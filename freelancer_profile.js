import { auth, onAuthStateChanged, db, doc, getDoc, updateDoc, onSnapshot } from './src/firebase.js';
import { updateNavbar } from './index.js';

const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userResume = document.getElementById('user-resume');
const skillsContainer = document.getElementById('skills-container');
const addSkillForm = document.getElementById('add-skill-form');
const newSkillInput = document.getElementById('new-skill');
const predefinedSkillsList = document.getElementById('predefined-skills-list');
const modalContainer = document.getElementById('modal-container');

const predefinedSkills = ["Python", "JavaScript", "React", "Node.js", "Graphic Design", "Content Writing", "Video Editing", "Data Analysis", "UI/UX Design", "Social Media Marketing"];

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

const renderSkills = (skills, userId) => {
    if (!skills || skills.length === 0) {
        skillsContainer.innerHTML = '<p>No skills added yet.</p>';
        return;
    }

    skillsContainer.innerHTML = skills.map(skill => `
        <span class="skill-tag">
            ${skill}
            <button class="remove-skill-btn" data-skill="${skill}">&times;</button>
        </span>
    `).join('');

    document.querySelectorAll('.remove-skill-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const skillToRemove = e.target.getAttribute('data-skill');
            const updatedSkills = skills.filter(s => s !== skillToRemove);
            try {
                await updateDoc(doc(db, 'users', userId), { skills: updatedSkills });
            } catch (error) {
                console.error("Error removing skill:", error);
                showModal("Error", "Could not remove skill.");
            }
        });
    });
};

const renderPredefinedSkills = (currentSkills, userId) => {
    predefinedSkillsList.innerHTML = predefinedSkills.map(skill => {
        if (currentSkills && currentSkills.includes(skill)) return '';
        return `<button class="btn btn-secondary btn-sm quick-add-btn" data-skill="${skill}" style="margin: 0.25rem;">+ ${skill}</button>`;
    }).join('');

    document.querySelectorAll('.quick-add-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const skillToAdd = e.target.getAttribute('data-skill');
            const updatedSkills = [...(currentSkills || []), skillToAdd];
            try {
                await updateDoc(doc(db, 'users', userId), { skills: updatedSkills });
            } catch (error) {
                console.error("Error adding skill:", error);
                showModal("Error", "Could not add skill.");
            }
        });
    });
};

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.role !== 'freelancer') {
                window.location.href = 'index.html';
                return;
            }

            userName.textContent = userData.name;
            userEmail.textContent = userData.email;
            userResume.innerHTML = `
                ${userData.resumeLink ? `<a href="${userData.resumeLink}" target="_blank" style="color: var(--secondary-color); margin-right: 1rem;">View Resume</a>` : 'Resume: Not provided'}
                ${userData.portfolioLink ? `<a href="${userData.portfolioLink}" target="_blank" style="color: var(--secondary-color);">View Portfolio</a>` : 'Portfolio: Not provided'}
            `;

            renderSkills(userData.skills, user.uid);
            renderPredefinedSkills(userData.skills, user.uid);

            // Handle manual skill addition
            addSkillForm.onsubmit = async (e) => {
                e.preventDefault();
                const newSkill = newSkillInput.value.trim();
                if (newSkill && (!userData.skills || !userData.skills.includes(newSkill))) {
                    const updatedSkills = [...(userData.skills || []), newSkill];
                    try {
                        await updateDoc(doc(db, 'users', user.uid), { skills: updatedSkills });
                        newSkillInput.value = '';
                    } catch (error) {
                        console.error("Error adding skill:", error);
                        showModal("Error", "Could not add skill.");
                    }
                }
            };
        }
    });
});
