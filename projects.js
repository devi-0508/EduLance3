import { auth, onAuthStateChanged, db, collection, query, where, onSnapshot, doc, getDoc } from './src/firebase.js';
import { updateNavbar } from './index.js';

const projectsContainer = document.getElementById('projects-container');
const projectsDescription = document.getElementById('projects-description');

const renderProjects = (projects, freelancerSkills = null) => {
    let filteredProjects = projects;

    if (freelancerSkills) {
        // Filter projects based on skills for freelancers
        filteredProjects = projects.filter(p => {
            const projectSkills = (p.skills || []).map(s => s.toLowerCase());
            const matchedSkills = freelancerSkills.filter(s => projectSkills.includes(s.toLowerCase()));
            return matchedSkills.length > 0;
        });
        projectsDescription.textContent = "Projects matching your skills.";
    }

    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = '<p>No projects found matching your criteria.</p>';
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
        const userData = userDoc.data();
        const role = userData.role;
        const freelancerSkills = role === 'freelancer' ? userData.skills : null;

        // Listen for all projects
        const projectsQuery = query(collection(db, 'projects'));
        onSnapshot(projectsQuery, (snapshot) => {
            const projects = [];
            snapshot.forEach(doc => {
                projects.push({ id: doc.id, ...doc.data() });
            });
            renderProjects(projects, freelancerSkills);
        });
    }
});
