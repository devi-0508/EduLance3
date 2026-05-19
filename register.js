import { auth, createUserWithEmailAndPassword, sendEmailVerification, db, doc, setDoc, serverTimestamp, signOut } from './src/firebase.js';
import { updateNavbar } from './index.js';

const registerForm = document.getElementById('register-form');
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

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const resumeLink = document.getElementById('resumeLink').value;
    const portfolioLink = document.getElementById('portfolioLink').value;
    const verificationFolderLink = document.getElementById('verificationFolderLink').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        const isAdminEmail = email === 'devipbiju2@gmail.com';

        // Prepare user data
        const userData = {
            name,
            email,
            role: isAdminEmail ? 'admin' : role,
            verificationFolderLink,
            skills: [],
            isVerified: isAdminEmail ? true : false,
            createdAt: serverTimestamp()
        };

        // Only add optional links if they have a value
        if (resumeLink) userData.resumeLink = resumeLink;
        if (portfolioLink) userData.portfolioLink = portfolioLink;

        // Store user data in Firestore
        try {
            await setDoc(doc(db, 'users', user.uid), userData);
        } catch (firestoreError) {
            // Detailed error logging for security rules debugging
            const errInfo = {
                error: firestoreError.message,
                operationType: 'write',
                path: `users/${user.uid}`,
                authInfo: {
                    userId: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified
                }
            };
            console.error('Firestore Error during registration:', JSON.stringify(errInfo));
            throw new Error("Missing or insufficient permissions. Please ensure all required fields are correctly filled.");
        }

        // Sign out the user immediately after registration to prevent unverified login
        await signOut(auth);

        const successMessage = isAdminEmail 
            ? "As the default admin, you can log in immediately after verifying your email address."
            : "Please check your email to verify your account. Once verified, wait for admin approval to access the platform.";

        showModal(
            "Registration Successful",
            successMessage,
            "login.html"
        );

    } catch (error) {
        console.error("Error during registration:", error);
        showModal("Registration Error", error.message);
    }
});
