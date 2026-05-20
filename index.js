import { auth, onAuthStateChanged, signOut, db, doc, getDoc } from './src/firebase.js';

const navbar = document.getElementById('navbar');

const updateNavbar = async (user) => {
    let navContent = `
        <a href="index.html" class="logo">EduLance</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
    `;

    if (user) {
        const isAdminEmail = user.email === 'devipbiju2@gmail.com';

        if (isAdminEmail) {
            navContent += `<a href="admin_dashboard.html">Pending Verifications</a>`;
        } else {
            // Fetch user role for non-admin users
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const role = userData.role;

                    if (role === 'freelancer') {
    navContent += `<a href="freelancer_profile.html">Profile</a>`;
    navContent += `<a href="projects.html">Projects</a>`;  // ← delete this line
    navContent += `<a href="matched_projects.html">Matched Projects</a>`;
} else if (role === 'client') {
                        navContent += `<a href="client_profile.html">Profile</a>`;
                        navContent += `<a href="matched_projects.html">Matched Freelancers</a>`;
                    } else if (role === 'admin') {
                        navContent += `<a href="admin_dashboard.html">Pending Verifications</a>`;
                    }
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        }

        navContent += `
            <a href="#" id="logout-btn">Logout</a>
        </div>
        `;
    } else {
        navContent += `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        </div>
        `;
    }

    navbar.innerHTML = navContent;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                window.location.href = 'login.html';
            } catch (error) {
                console.error("Error signing out:", error);
            }
        });
    }
};

onAuthStateChanged(auth, (user) => {
    updateNavbar(user);
});

export { updateNavbar };
