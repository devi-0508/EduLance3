import{a as i,d as f}from"./index-CGrZZ24Z.js";import{signInWithEmailAndPassword as g,signOut as d}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{getDoc as p,doc as w}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";const h=document.getElementById("login-form"),u=document.getElementById("modal-container"),o=(n,t,e=null)=>{u.innerHTML=`
        <div class="modal">
            <div class="modal-content">
                <h2>${n}</h2>
                <p>${t}</p>
                <button id="modal-ok-btn" class="btn btn-primary">OK</button>
            </div>
        </div>
    `,document.getElementById("modal-ok-btn").addEventListener("click",()=>{u.innerHTML="",e&&(window.location.href=e)})};h.addEventListener("submit",async n=>{n.preventDefault();const t=document.getElementById("email").value,e=document.getElementById("password").value;try{const r=(await g(i,t,e)).user;if(!r.emailVerified){await d(i),o("Email Not Verified","Please verify your email address before logging in.");return}const s=await p(w(f,"users",r.uid));if(s.exists()){const m=s.data(),c=r.email==="devipbiju2@gmail.com";if(!m.isVerified&&!c){await d(i),o("Admin Approval Pending","Waiting for admin approval. Please try again later.");return}const l=m.role;l==="freelancer"?window.location.href="freelancer_profile.html":l==="client"?window.location.href="client_profile.html":(l==="admin"||c)&&(window.location.href="admin_dashboard.html")}else await d(i),o("Error","User data not found in Firestore.")}catch(a){console.error("Error during login:",a),o("Login Error",a.message)}});
