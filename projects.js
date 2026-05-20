import { auth, onAuthStateChanged, db, collection, query, where, onSnapshot, doc, getDoc } from './src/firebase.js';
import { updateNavbar } from './index.js';

const projectsContainer = document.getElementById('projects-container');
const projectsDescription = document.getElementById('projects-description');

const renderProjects = (projects) => {
    if (projects.length === 0) {
        projectsContainer.innerHTML = '<p>No projects found.</p>';
        return;
    }

    projectsContainer.innerHTML = projects.map(p => `
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
        </div>
    `).join('');
};

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
        const projectsQuery = query(collection(db, 'projects'));
        onSnapshot(projectsQuery, (snapshot) => {
            const projects = [];
            snapshot.forEach(doc => {
                projects.push({ id: doc.id, ...doc.data() });
            });
            renderProjects(projects);
        });
    }
});
