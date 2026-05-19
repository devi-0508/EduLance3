import { auth, onAuthStateChanged, db, collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, getDocs, writeBatch } from './src/firebase.js';
import { updateNavbar } from './index.js';

const pendingUsersContainer = document.getElementById('pending-users-container');
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

const renderPendingUsers = (users) => {
    if (users.length === 0) {
        pendingUsersContainer.innerHTML = '<p>No pending users to verify.</p>';
        return;
    }

    let tableContent = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Resume</th>
                    <th>Portfolio</th>
                    <th>Verification Folder</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.forEach(user => {
        tableContent += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.resumeLink ? `<a href="${user.resumeLink}" target="_blank">View</a>` : 'Not provided'}</td>
                <td>${user.portfolioLink ? `<a href="${user.portfolioLink}" target="_blank">View</a>` : 'Not provided'}</td>
                <td><a href="${user.verificationFolderLink}" target="_blank">View Folder</a></td>
                <td>
                    <button class="action-btn btn-approve" data-id="${user.id}" data-email="${user.email}">Approve</button>
                    <button class="action-btn btn-reject" data-id="${user.id}" data-email="${user.email}">Reject</button>
                </td>
            </tr>
        `;
    });

    tableContent += `
            </tbody>
        </table>
    `;

    pendingUsersContainer.innerHTML = tableContent;

    // Add event listeners for buttons
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.target.getAttribute('data-id');
            const email = e.target.getAttribute('data-email');
            try {
                // Find all unverified documents with this email
                const q = query(collection(db, 'users'), where('email', '==', email), where('isVerified', '==', false));
                const querySnapshot = await getDocs(q);
                
                const batch = writeBatch(db);
                querySnapshot.forEach((docSnap) => {
                    batch.update(docSnap.ref, { isVerified: true });
                });
                await batch.commit();
                
                showModal("User Approved", "The user has been successfully verified.");
            } catch (error) {
                console.error("Error approving user:", error);
                showModal("Error", "Could not approve user.");
            }
        });
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-id');
            const email = e.target.getAttribute('data-email');
            showConfirmModal(
                "Confirm Rejection",
                "Are you sure you want to reject and delete this user? This action cannot be undone.",
                async () => {
                    try {
                        // Find all unverified documents with this email
                        const q = query(collection(db, 'users'), where('email', '==', email), where('isVerified', '==', false));
                        const querySnapshot = await getDocs(q);
                        
                        const batch = writeBatch(db);
                        querySnapshot.forEach((docSnap) => {
                            batch.delete(docSnap.ref);
                        });
                        await batch.commit();
                        
                        showModal("User Rejected", "The user has been removed from the system.");
                    } catch (error) {
                        console.error("Error rejecting user:", error);
                        showModal("Error", "Could not reject user.");
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

    // Check if user is admin
    const userDocRef = doc(db, 'users', user.uid);
    const isAdminEmail = user.email === 'devipbiju2@gmail.com';

    onSnapshot(userDocRef, (docSnap) => {
        const isRoleAdmin = docSnap.exists() && docSnap.data().role === 'admin';
        
        if (isRoleAdmin || isAdminEmail) {
            // Listen for pending users
            const pendingUsersQuery = query(collection(db, 'users'), where('isVerified', '==', false));
            onSnapshot(pendingUsersQuery, (snapshot) => {
                const usersMap = new Map();
                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    const email = data.email;
                    
                    // Filter out the admin email and ensure we don't show the current user
                    if (email !== 'devipbiju2@gmail.com' && docSnap.id !== user.uid) {
                        // If multiple entries exist for the same email, keep the most recent one (or just one)
                        if (!usersMap.has(email)) {
                            usersMap.set(email, { id: docSnap.id, ...data });
                        }
                    }
                });
                renderPendingUsers(Array.from(usersMap.values()));
            });
        } else {
            window.location.href = 'index.html';
        }
    });
});
