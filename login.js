import { auth, signInWithEmailAndPassword, signOut, db, doc, getDoc } from './src/firebase.js';
import { updateNavbar } from './index.js';

const loginForm = document.getElementById('login-form');
const modalContainer = document.getElementById('modal-container');

const showModal = (title, message, redirectUrl = null) => {
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
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    });
};

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check email verification
        if (!user.emailVerified) {
            await signOut(auth);
            showModal("Email Not Verified", "Please verify your email address before logging in.");
            return;
        }

        // Check admin verification (isVerified)
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const isAdminEmail = user.email === 'devipbiju2@gmail.com';

            if (!userData.isVerified && !isAdminEmail) {
                await signOut(auth);
                showModal("Admin Approval Pending", "Waiting for admin approval. Please try again later.");
                return;
            }

            // Redirect based on role
            const role = userData.role;
            if (role === 'freelancer') {
                window.location.href = 'freelancer_profile.html';
            } else if (role === 'client') {
                window.location.href = 'client_profile.html';
            } else if (role === 'admin' || isAdminEmail) {
                window.location.href = 'admin_dashboard.html';
            }
        } else {
            // User exists in Auth but not in Firestore (shouldn't happen)
            await signOut(auth);
            showModal("Error", "User data not found in Firestore.");
        }

    } catch (error) {
        console.error("Error during login:", error);
        showModal("Login Error", error.message);
    }
});
