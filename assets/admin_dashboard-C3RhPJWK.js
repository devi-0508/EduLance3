import{a as w,d}from"./index-CGrZZ24Z.js";import{onAuthStateChanged as L}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{doc as $,onSnapshot as v,query as u,collection as f,where as s,getDocs as g,writeBatch as y}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";const E=document.getElementById("pending-users-container"),l=document.getElementById("modal-container"),h=(e,n)=>{l.innerHTML=`
        <div class="modal">
            <div class="modal-content">
                <h2>${e}</h2>
                <p>${n}</p>
                <button id="modal-ok-btn" class="btn btn-primary">OK</button>
            </div>
        </div>
    `,document.getElementById("modal-ok-btn").addEventListener("click",()=>{l.innerHTML=""})},k=(e,n,t)=>{l.innerHTML=`
        <div class="modal">
            <div class="modal-content">
                <h2>${e}</h2>
                <p>${n}</p>
                <div class="cta-buttons">
                    <button id="modal-confirm-btn" class="btn btn-primary">Confirm</button>
                    <button id="modal-cancel-btn" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `,document.getElementById("modal-confirm-btn").addEventListener("click",()=>{l.innerHTML="",t()}),document.getElementById("modal-cancel-btn").addEventListener("click",()=>{l.innerHTML=""})},A=e=>{if(e.length===0){E.innerHTML="<p>No pending users to verify.</p>";return}let n=`
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
    `;e.forEach(t=>{n+=`
            <tr>
                <td>${t.name}</td>
                <td>${t.email}</td>
                <td>${t.role}</td>
                <td>${t.resumeLink?`<a href="${t.resumeLink}" target="_blank">View</a>`:"Not provided"}</td>
                <td>${t.portfolioLink?`<a href="${t.portfolioLink}" target="_blank">View</a>`:"Not provided"}</td>
                <td><a href="${t.verificationFolderLink}" target="_blank">View Folder</a></td>
                <td>
                    <button class="action-btn btn-approve" data-id="${t.id}" data-email="${t.email}">Approve</button>
                    <button class="action-btn btn-reject" data-id="${t.id}" data-email="${t.email}">Reject</button>
                </td>
            </tr>
        `}),n+=`
            </tbody>
        </table>
    `,E.innerHTML=n,document.querySelectorAll(".btn-approve").forEach(t=>{t.addEventListener("click",async i=>{i.target.getAttribute("data-id");const m=i.target.getAttribute("data-email");try{const o=u(f(d,"users"),s("email","==",m),s("isVerified","==",!1)),c=await g(o),a=y(d);c.forEach(r=>{a.update(r.ref,{isVerified:!0})}),await a.commit(),h("User Approved","The user has been successfully verified.")}catch(o){console.error("Error approving user:",o),h("Error","Could not approve user.")}})}),document.querySelectorAll(".btn-reject").forEach(t=>{t.addEventListener("click",i=>{i.target.getAttribute("data-id");const m=i.target.getAttribute("data-email");k("Confirm Rejection","Are you sure you want to reject and delete this user? This action cannot be undone.",async()=>{try{const o=u(f(d,"users"),s("email","==",m),s("isVerified","==",!1)),c=await g(o),a=y(d);c.forEach(r=>{a.delete(r.ref)}),await a.commit(),h("User Rejected","The user has been removed from the system.")}catch(o){console.error("Error rejecting user:",o),h("Error","Could not reject user.")}})})})};L(w,e=>{if(!e){window.location.href="login.html";return}const n=$(d,"users",e.uid),t=e.email==="devipbiju2@gmail.com";v(n,i=>{if(i.exists()&&i.data().role==="admin"||t){const o=u(f(d,"users"),s("isVerified","==",!1));v(o,c=>{const a=new Map;c.forEach(r=>{const p=r.data(),b=p.email;b!=="devipbiju2@gmail.com"&&r.id!==e.uid&&(a.has(b)||a.set(b,{id:r.id,...p}))}),A(Array.from(a.values()))})}else window.location.href="index.html"})});
