import { auth, onAuthStateChanged, db, collection, query, where, onSnapshot, doc, getDoc, getDocs } from './src/firebase.js';
import { updateNavbar } from './index.js';

const matchesContainer = document.getElementById('matches-container');
const pageTitle = document.getElementById('page-title');
const pageDescription = document.getElementById('page-description');

const renderFreelancerMatches = (projects, freelancerSkills) => {
    const matchedProjects = projects.filter(p => {
        const projectSkills = (p.skills || []).map(s => s.toLowerCase());
        const matchedSkills = freelancerSkills.filter(s => projectSkills.includes(s.toLowerCase()));
        return matchedSkills.length > 0;
    }).map(p => {
        const projectSkills = (p.skills || []).map(s => s.toLowerCase());
        const matchedSkills = freelancerSkills.filter(s => projectSkills.includes(s.toLowerCase()));
        const matchPercentage = (matchedSkills.length / projectSkills.length) * 100;
        return { ...p, matchedSkills, matchPercentage };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    if (matchedProjects.length === 0) {
        matchesContainer.innerHTML = '<p>No matching projects found for your skills.</p>';
        return;
    }

    matchesContainer.innerHTML = matchedProjects.map(p => `
        <div class="card">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Client: ${p.clientEmail || 'Contact via platform'}</p>
            <div class="skills">
                ${(p.skills || []).map(skill => `<span class="badge ${p.matchedSkills.includes(skill.toLowerCase()) ? 'badge-green' : 'badge-blue'}">${skill}</span>`).join('')}
            </div>
            <div class="footer">
                <span class="price">₹${p.budget}</span>
                <span class="badge badge-yellow">${Math.round(p.matchPercentage)}% Match</span>
            </div>
        </div>
    `).join('');
};

const renderClientMatches = async (clientProjects, allFreelancers) => {
    pageTitle.textContent = "Matched Freelancers";
    pageDescription.textContent = "Find the best student talent for your projects.";

    if (clientProjects.length === 0) {
        matchesContainer.innerHTML = '<p>You haven\'t posted any projects yet.</p>';
        return;
    }

    let matchesContent = '';

    for (const project of clientProjects) {
        const projectSkills = (project.skills || []).map(s => s.toLowerCase());
        const matchedFreelancers = allFreelancers.filter(f => {
            const freelancerSkills = (f.skills || []).map(s => s.toLowerCase());
            const matchedSkills = freelancerSkills.filter(s => projectSkills.includes(s));
            return matchedSkills.length > 0;
        }).map(f => {
            const freelancerSkills = (f.skills || []).map(s => s.toLowerCase());
            const matchedSkills = freelancerSkills.filter(s => projectSkills.includes(s));
            const matchPercentage = (matchedSkills.length / projectSkills.length) * 100;
            return { ...f, matchedSkills, matchPercentage };
        }).sort((a, b) => b.matchPercentage - a.matchPercentage);

        matchesContent += `
            <div class="project-match-group" style="grid-column: 1 / -1; margin-top: 2rem;">
                <h2 style="border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem;">Matches for: ${project.title}</h2>
                <div class="card-grid">
                    ${matchedFreelancers.length > 0 ? matchedFreelancers.map(f => `
                        <div class="card">
                            <h3>${f.name}</h3>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Email: ${f.email}</p>
                            <p>Skills: ${f.skills.join(', ')}</p>
                            <div class="footer">
                                <a href="${f.resumeLink || '#'}" target="_blank" class="btn btn-secondary btn-sm" ${!f.resumeLink ? 'disabled' : ''}>${f.resumeLink ? 'View Resume' : 'No Resume'}</a>
                                <span class="badge badge-green">${Math.round(f.matchPercentage)}% Match</span>
                            </div>
                        </div>
                    `).join('') : '<p>No freelancers matched this project yet.</p>'}
                </div>
            </div>
        `;
    }

    matchesContainer.innerHTML = matchesContent;
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

        if (role === 'freelancer') {
            const freelancerSkills = userData.skills || [];
            const projectsQuery = query(collection(db, 'projects'), where('status', '==', 'open'));
            onSnapshot(projectsQuery, (snapshot) => {
                const projects = [];
                snapshot.forEach(doc => {
                    projects.push({ id: doc.id, ...doc.data() });
                });
                renderFreelancerMatches(projects, freelancerSkills);
            });
        } else if (role === 'client') {
            const clientProjectsQuery = query(collection(db, 'projects'), where('clientId', '==', user.uid));
            onSnapshot(clientProjectsQuery, async (snapshot) => {
                const clientProjects = [];
                snapshot.forEach(doc => {
                    clientProjects.push({ id: doc.id, ...doc.data() });
                });

                // Fetch all verified freelancers
                const freelancersQuery = query(collection(db, 'users'), where('role', '==', 'freelancer'), where('isVerified', '==', true));
                const freelancersSnapshot = await getDocs(freelancersQuery);
                const allFreelancers = [];
                freelancersSnapshot.forEach(doc => {
                    allFreelancers.push({ id: doc.id, ...doc.data() });
                });

                renderClientMatches(clientProjects, allFreelancers);
            });
        }
    }
});
