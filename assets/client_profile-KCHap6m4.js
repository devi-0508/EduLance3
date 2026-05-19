import{a as j,d as l}from"./index-CGrZZ24Z.js";import{onAuthStateChanged as E}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{addDoc as I,collection as m,serverTimestamp as B,query as $,where as L,onSnapshot as w,updateDoc as C,doc as p,deleteDoc as M}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";const g=document.getElementById("post-project-form"),b=document.getElementById("projects-container"),v=document.getElementById("filter-status"),y=document.getElementById("filter-min-budget"),h=document.getElementById("filter-max-budget"),d=document.getElementById("modal-container"),i=(o,a)=>{d.innerHTML=`
        <div class="modal">
            <div class="modal-content">
                <h2>${o}</h2>
                <p>${a}</p>
                <button id="modal-ok-btn" class="btn btn-primary">OK</button>
            </div>
        </div>
    `,document.getElementById("modal-ok-btn").addEventListener("click",()=>{d.innerHTML=""})},k=(o,a,r)=>{d.innerHTML=`
        <div class="modal">
            <div class="modal-content">
                <h2>${o}</h2>
                <p>${a}</p>
                <div class="cta-buttons">
                    <button id="modal-confirm-btn" class="btn btn-primary">Confirm</button>
                    <button id="modal-cancel-btn" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `,document.getElementById("modal-confirm-btn").addEventListener("click",()=>{d.innerHTML="",r()}),document.getElementById("modal-cancel-btn").addEventListener("click",()=>{d.innerHTML=""})},T=o=>{const a=v.value,r=parseFloat(y.value)||0,c=parseFloat(h.value)||1/0,s=o.filter(t=>{const n=a==="all"||t.status===a,e=t.budget>=r&&t.budget<=c;return n&&e});if(s.length===0){b.innerHTML="<p>No projects found matching your filters.</p>";return}b.innerHTML=s.map(t=>`
        <div class="card">
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <div class="skills">
                ${(t.skills||[]).map(n=>`<span class="badge badge-blue">${n}</span>`).join("")}
            </div>
            <div class="footer">
                <span class="price">₹${t.budget}</span>
                <span class="badge ${t.status==="open"?"badge-green":t.status==="in progress"?"badge-yellow":"badge-gray"}">${t.status}</span>
            </div>
            <div class="actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <select class="status-update-select" data-id="${t.id}">
                    <option value="open" ${t.status==="open"?"selected":""}>Open</option>
                    <option value="in progress" ${t.status==="in progress"?"selected":""}>In Progress</option>
                    <option value="completed" ${t.status==="completed"?"selected":""}>Completed</option>
                </select>
                <button class="btn btn-reject btn-sm delete-project-btn" data-id="${t.id}">Delete</button>
            </div>
        </div>
    `).join(""),document.querySelectorAll(".status-update-select").forEach(t=>{t.addEventListener("change",async n=>{const e=n.target.getAttribute("data-id"),u=n.target.value;try{await C(p(l,"projects",e),{status:u})}catch(f){console.error("Error updating project status:",f),i("Error","Could not update project status.")}})}),document.querySelectorAll(".delete-project-btn").forEach(t=>{t.addEventListener("click",n=>{const e=n.target.getAttribute("data-id");k("Delete Project","Are you sure you want to delete this project? This action cannot be undone.",async()=>{try{await M(p(l,"projects",e))}catch(u){console.error("Error deleting project:",u),i("Error","Could not delete project.")}})})})};E(j,o=>{if(!o){window.location.href="login.html";return}g.onsubmit=async r=>{r.preventDefault();const c=document.getElementById("title").value,s=document.getElementById("description").value,t=document.getElementById("skills").value.split(",").map(e=>e.trim().toLowerCase()).filter(e=>e),n=parseFloat(document.getElementById("budget").value);try{await I(m(l,"projects"),{title:c,description:s,skills:t,budget:n,status:"open",clientId:o.uid,clientEmail:o.email,createdAt:B()}),g.reset(),i("Project Posted","Your project has been successfully posted.")}catch(e){console.error("Error posting project:",e),i("Error","Could not post project.")}};const a=$(m(l,"projects"),L("clientId","==",o.uid));w(a,r=>{const c=[];r.forEach(t=>{c.push({id:t.id,...t.data()})});const s=()=>T(c);s(),v.onchange=s,y.oninput=s,h.oninput=s})});
