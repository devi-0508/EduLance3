import{a as p,d as l}from"./index-CGrZZ24Z.js";import{onAuthStateChanged as u}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{getDoc as g,doc as m,query as h,collection as f,onSnapshot as j}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";const d=document.getElementById("projects-container"),b=document.getElementById("projects-description"),y=(s,o=null)=>{let e=s;if(o&&(e=s.filter(t=>{const n=(t.skills||[]).map(r=>r.toLowerCase());return o.filter(r=>n.includes(r.toLowerCase())).length>0}),b.textContent="Projects matching your skills."),e.length===0){d.innerHTML="<p>No projects found matching your criteria.</p>";return}d.innerHTML=e.map(t=>`
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
        </div>
    `).join("")};u(p,async s=>{if(!s){window.location.href="login.html";return}const o=await g(m(l,"users",s.uid));if(o.exists()){const e=o.data(),n=e.role==="freelancer"?e.skills:null,a=h(f(l,"projects"));j(a,r=>{const i=[];r.forEach(c=>{i.push({id:c.id,...c.data()})}),y(i,n)})}});
