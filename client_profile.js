import { auth, onAuthStateChanged, db, collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from './src/firebase.js';
import { updateNavbar } from './index.js';

const postProjectForm = document.getElementById('post-project-form');
const projectsContainer = document.getElementById('projects-container');
const filterStatus = document.getElementById('filter-status');
const filterMinBudget = document.getElementById('filter-min-budget');
const filterMaxBudget = document.getElementById('filter-max-budget');
const modalContainer = document.getElementById('modal-container');

const showModal = (title, message) => {
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <h2>${title}</h2>
                <p>${message}</p>
                <button id="modal-ok-btn" class="btn btn-primary">OK</button>
            </div>
        </div>
    `;
    document.getElementById('modal-ok-btn').addEventListener('click', () => {
        modalContainer.innerHTML = '';
    });
};

const showConfirmModal = (title, message, onConfirm) => {
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="cta-buttons">
                    <button id="modal-confirm-btn" class="btn btn-primary">Confirm</button>
                    <button id="modal-cancel-btn" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        modalContainer.innerHTML = '';
        onConfirm();
    });
    document.getElementById('modal-cancel-btn').addEventListener('click', () => {
        modalContainer.innerHTML = '';
    });
};

const renderProjects = (projects) => {
    const status = filterStatus.value;
    const minBudget = parseFloat(filterMinBudget.value) || 0;
    const maxBudget = parseFloat(filterMaxBudget.value) || Infinity;

    const filteredProjects = projects.filter(p => {
        const matchesStatus = status === 'all' || p.status === status;
        const matchesBudget = p.budget >= minBudget && p.budget <= maxBudget;
        return matchesStatus && matchesBudget;
    });

    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = '<p>No projects found matching your filters.</p>';
        return;
    }

    projectsContainer.innerHTML = filteredProjects.map(p => `
        <div class="card">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <div class="skills">
                ${(p.skills || []).map(skill => `<span class="badge badge-blue">${skill}</span>`).join('')}
            </div>
            <div class="footer">
                <span class="price">₹${p.budget}</span>
                <span class="badge ${p.status === 'open' ? 'badge-green' : p.status === 'in progress' ? 'badge-yellow' : 'badge-gray'}">${p.status}</span>
            </div>
            <div class="actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <select class="status-update-select" data-id="${p.id}">
                    <option value="open" ${p.status === 'open' ? 'selected' : ''}>Open</option>
                    <option value="in progress" ${p.status === 'in progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${p.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="btn btn-reject btn-sm delete-project-btn" data-id="${p.id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Add event listeners for status updates
    document.querySelectorAll('.status-update-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const projectId = e.target.getAttribute('data-id');
            const newStatus = e.target.value;
            try {
                await updateDoc(doc(db, 'projects', projectId), { status: newStatus });
            } catch (error) {
                console.error("Error updating project status:", error);
                showModal("Error", "Could not update project status.");
            }
        });
    });

    // Add event listeners for project deletion
    document.querySelectorAll('.delete-project-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectId = e.target.getAttribute('data-id');
            showConfirmModal(
                "Delete Project",
                "Are you sure you want to delete this project? This action cannot be undone.",
                async () => {
                    try {
                        await deleteDoc(doc(db, 'projects', projectId));
                    } catch (error) {
                        console.error("Error deleting project:", error);
                        showModal("Error", "Could not delete project.");
                    }
                }
            );
        });
    });
};

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Handle project posting
    postProjectForm.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const skills = document.getElementById('skills').value.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
        const budget = parseFloat(document.getElementById('budget').value);

        try {
            await addDoc(collection(db, 'projects'), {
                title,
                description,
                skills,
                budget,
                status: 'open',
                clientId: user.uid,
                clientEmail: user.email,
                createdAt: serverTimestamp()
            });
            postProjectForm.reset();
            showModal("Project Posted", "Your project has been successfully posted.");
        } catch (error) {
            console.error("Error posting project:", error);
            showModal("Error", "Could not post project.");
        }
    };

    // Listen for client's projects
    const projectsQuery = query(collection(db, 'projects'), where('clientId', '==', user.uid));
    onSnapshot(projectsQuery, (snapshot) => {
        const projects = [];
        snapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });

        const updateUI = () => renderProjects(projects);
        updateUI();

        // Add filter event listeners
        filterStatus.onchange = updateUI;
        filterMinBudget.oninput = updateUI;
        filterMaxBudget.oninput = updateUI;
    });
});
