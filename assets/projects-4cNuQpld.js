import{a as c,d as a}from"./index-CGrZZ24Z.js";import{onAuthStateChanged as d}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{getDoc as p,doc as l,query as u,collection as g,onSnapshot as m}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";const r=document.getElementById("projects-container");document.getElementById("projects-description");const h=e=>{if(e.length===0){r.innerHTML="<p>No projects found.</p>";return}r.innerHTML=e.map(s=>`
        <div class="card">
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <div class="skills">
                ${(s.skills||[]).map(t=>`<span class="badge badge-blue">${t}</span>`).join("")}
            </div>
            <div class="footer">
                <span class="price">₹${s.budget}</span>
                <span class="badge ${s.status==="open"?"badge-green":s.status==="in progress"?"badge-yellow":"badge-gray"}">${s.status}</span>
            </div>
        </div>
    `).join("")};d(c,async e=>{if(!e){window.location.href="login.html";return}if((await p(l(a,"users",e.uid))).exists()){const t=u(g(a,"projects"));m(t,i=>{const o=[];i.forEach(n=>{o.push({id:n.id,...n.data()})}),h(o)})}});
