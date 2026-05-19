import{a as k,d as m}from"./index-CGrZZ24Z.js";import{onAuthStateChanged as y}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{getDoc as b,doc as j,query as u,collection as g,where as h,onSnapshot as f,getDocs as v}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";const p=document.getElementById("matches-container"),S=document.getElementById("page-title"),$=document.getElementById("page-description"),C=(o,d)=>{const c=o.filter(t=>{const s=(t.skills||[]).map(e=>e.toLowerCase());return d.filter(e=>s.includes(e.toLowerCase())).length>0}).map(t=>{const s=(t.skills||[]).map(a=>a.toLowerCase()),n=d.filter(a=>s.includes(a.toLowerCase())),e=n.length/s.length*100;return{...t,matchedSkills:n,matchPercentage:e}}).sort((t,s)=>s.matchPercentage-t.matchPercentage);if(c.length===0){p.innerHTML="<p>No matching projects found for your skills.</p>";return}p.innerHTML=c.map(t=>`
        <div class="card">
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Client: ${t.clientEmail||"Contact via platform"}</p>
            <div class="skills">
                ${(t.skills||[]).map(s=>`<span class="badge ${t.matchedSkills.includes(s.toLowerCase())?"badge-green":"badge-blue"}">${s}</span>`).join("")}
            </div>
            <div class="footer">
                <span class="price">₹${t.budget}</span>
                <span class="badge badge-yellow">${Math.round(t.matchPercentage)}% Match</span>
            </div>
        </div>
    `).join("")},w=async(o,d)=>{if(S.textContent="Matched Freelancers",$.textContent="Find the best student talent for your projects.",o.length===0){p.innerHTML="<p>You haven't posted any projects yet.</p>";return}let c="";for(const t of o){const s=(t.skills||[]).map(e=>e.toLowerCase()),n=d.filter(e=>(e.skills||[]).map(i=>i.toLowerCase()).filter(i=>s.includes(i)).length>0).map(e=>{const l=(e.skills||[]).map(r=>r.toLowerCase()).filter(r=>s.includes(r)),i=l.length/s.length*100;return{...e,matchedSkills:l,matchPercentage:i}}).sort((e,a)=>a.matchPercentage-e.matchPercentage);c+=`
            <div class="project-match-group" style="grid-column: 1 / -1; margin-top: 2rem;">
                <h2 style="border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem;">Matches for: ${t.title}</h2>
                <div class="card-grid">
                    ${n.length>0?n.map(e=>`
                        <div class="card">
                            <h3>${e.name}</h3>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Email: ${e.email}</p>
                            <p>Skills: ${e.skills.join(", ")}</p>
                            <div class="footer">
                                <a href="${e.resumeLink||"#"}" target="_blank" class="btn btn-secondary btn-sm" ${e.resumeLink?"":"disabled"}>${e.resumeLink?"View Resume":"No Resume"}</a>
                                <span class="badge badge-green">${Math.round(e.matchPercentage)}% Match</span>
                            </div>
                        </div>
                    `).join(""):"<p>No freelancers matched this project yet.</p>"}
                </div>
            </div>
        `}p.innerHTML=c};y(k,async o=>{if(!o){window.location.href="login.html";return}const d=await b(j(m,"users",o.uid));if(d.exists()){const c=d.data(),t=c.role;if(t==="freelancer"){const s=c.skills||[],n=u(g(m,"projects"),h("status","==","open"));f(n,e=>{const a=[];e.forEach(l=>{a.push({id:l.id,...l.data()})}),C(a,s)})}else if(t==="client"){const s=u(g(m,"projects"),h("clientId","==",o.uid));f(s,async n=>{const e=[];n.forEach(r=>{e.push({id:r.id,...r.data()})});const a=u(g(m,"users"),h("role","==","freelancer"),h("isVerified","==",!0)),l=await v(a),i=[];l.forEach(r=>{i.push({id:r.id,...r.data()})}),w(e,i)})}}});
