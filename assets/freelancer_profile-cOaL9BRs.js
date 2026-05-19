import{a as f,d as s}from"./index-CGrZZ24Z.js";import{onAuthStateChanged as p}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{doc as a,onSnapshot as y,updateDoc as d}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";const b=document.getElementById("user-name"),h=document.getElementById("user-email"),E=document.getElementById("user-resume"),m=document.getElementById("skills-container"),v=document.getElementById("add-skill-form"),u=document.getElementById("new-skill"),L=document.getElementById("predefined-skills-list"),k=document.getElementById("modal-container"),w=["Python","JavaScript","React","Node.js","Graphic Design","Content Writing","Video Editing","Data Analysis","UI/UX Design","Social Media Marketing"],c=(e,o)=>{k.innerHTML=`
        <div class="modal">
            <div class="modal-content">
                <h2>${e}</h2>
                <p>${o}</p>
                <button id="modal-ok-btn" class="btn btn-primary">OK</button>
            </div>
        </div>
    `,document.getElementById("modal-ok-btn").addEventListener("click",()=>{k.innerHTML=""})},S=(e,o)=>{if(!e||e.length===0){m.innerHTML="<p>No skills added yet.</p>";return}m.innerHTML=e.map(n=>`
        <span class="skill-tag">
            ${n}
            <button class="remove-skill-btn" data-skill="${n}">&times;</button>
        </span>
    `).join(""),document.querySelectorAll(".remove-skill-btn").forEach(n=>{n.addEventListener("click",async t=>{const i=t.target.getAttribute("data-skill"),r=e.filter(l=>l!==i);try{await d(a(s,"users",o),{skills:r})}catch(l){console.error("Error removing skill:",l),c("Error","Could not remove skill.")}})})},I=(e,o)=>{L.innerHTML=w.map(n=>e&&e.includes(n)?"":`<button class="btn btn-secondary btn-sm quick-add-btn" data-skill="${n}" style="margin: 0.25rem;">+ ${n}</button>`).join(""),document.querySelectorAll(".quick-add-btn").forEach(n=>{n.addEventListener("click",async t=>{const i=t.target.getAttribute("data-skill"),r=[...e||[],i];try{await d(a(s,"users",o),{skills:r})}catch(l){console.error("Error adding skill:",l),c("Error","Could not add skill.")}})})};p(f,e=>{if(!e){window.location.href="login.html";return}const o=a(s,"users",e.uid);y(o,n=>{if(n.exists()){const t=n.data();if(t.role!=="freelancer"){window.location.href="index.html";return}b.textContent=t.name,h.textContent=t.email,E.innerHTML=`
                ${t.resumeLink?`<a href="${t.resumeLink}" target="_blank" style="color: var(--secondary-color); margin-right: 1rem;">View Resume</a>`:"Resume: Not provided"}
                ${t.portfolioLink?`<a href="${t.portfolioLink}" target="_blank" style="color: var(--secondary-color);">View Portfolio</a>`:"Portfolio: Not provided"}
            `,S(t.skills,e.uid),I(t.skills,e.uid),v.onsubmit=async i=>{i.preventDefault();const r=u.value.trim();if(r&&(!t.skills||!t.skills.includes(r))){const l=[...t.skills||[],r];try{await d(a(s,"users",e.uid),{skills:l}),u.value=""}catch(g){console.error("Error adding skill:",g),c("Error","Could not add skill.")}}}}})});
