// Auto-generated: inlined EEC Live Attendance HTML so the dashboard can open it as a blob URL even in the bundled standalone.
window.EEC_LIVE_ATTENDANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EEC Subcommittee Attendance</title>
<style>
  :root{
    --ink:#16243a; --paper:#f4f1ea; --card:#fffdf8; --line:#cdc6b5;
    --navy:#1f3864; --navy-soft:#2e75b6; --present:#1f7a4d; --absent:#9aa0a6;
    --accent:#b5472d; --shadow:0 1px 0 rgba(0,0,0,.04),0 8px 24px -16px rgba(31,56,100,.5);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
    background:var(--paper);color:var(--ink);
    background-image:radial-gradient(circle at 1px 1px,rgba(31,56,100,.05) 1px,transparent 0);
    background-size:22px 22px;line-height:1.5;padding:24px 16px 80px;
  }
  .wrap{max-width:860px;margin:0 auto}
  header.top{margin-bottom:22px;border-bottom:2px solid var(--navy);padding-bottom:14px}
  .kicker{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:11px;letter-spacing:.22em;
    text-transform:uppercase;color:var(--accent);margin-bottom:6px}
  h1{font-size:30px;font-weight:700;color:var(--navy);letter-spacing:-.01em}
  .sub{font-size:14px;color:#5b6472;margin-top:4px;font-style:italic}
  .tabs{display:flex;flex-wrap:wrap;gap:6px;margin:20px 0 0}
  .tab{font-family:ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.06em;
    padding:9px 16px;border:1px solid var(--line);background:var(--card);color:#4a5568;
    cursor:pointer;border-radius:2px 2px 0 0;border-bottom:none;transition:.15s;font-weight:600}
  .tab:hover{color:var(--navy)}
  .tab.active{background:var(--navy);color:#fff;border-color:var(--navy)}
  .panel{background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);
    border-radius:0 4px 4px 4px;padding:20px;display:none}
  .panel.active{display:block;animation:fade .25s ease}
  @keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  .meta{display:flex;flex-wrap:wrap;gap:10px 22px;align-items:baseline;
    padding-bottom:14px;border-bottom:1px dashed var(--line);margin-bottom:6px}
  .meta h2{font-size:20px;color:var(--navy);font-weight:700}
  .stat{font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#4a5568}
  .stat b{font-size:17px;color:var(--ink)}
  .quorum{font-family:ui-monospace,Menlo,monospace;font-size:12px;font-weight:700;
    padding:3px 10px;border-radius:999px;letter-spacing:.04em}
  .q-met{background:#e3f1e9;color:var(--present);border:1px solid #bfe0cd}
  .q-no{background:#f6e9e6;color:var(--accent);border:1px solid #e6c9c1}
  .group-label{font-family:ui-monospace,Menlo,monospace;font-size:10.5px;letter-spacing:.16em;
    text-transform:uppercase;color:#8a8675;margin:18px 0 4px;padding-bottom:3px;
    border-bottom:1px solid #e7e2d4}
  ul{list-style:none}
  li.row{display:flex;align-items:center;gap:12px;padding:9px 6px;border-bottom:1px solid #efece1}
  li.row:last-child{border-bottom:none}
  .chk{flex:none;width:26px;height:26px;border:2px solid var(--line);border-radius:5px;
    cursor:pointer;display:grid;place-items:center;background:#fff;transition:.12s;font-size:15px}
  .chk:hover{border-color:var(--navy-soft)}
  .row.present .chk{background:var(--present);border-color:var(--present);color:#fff}
  .row.present .chk::after{content:"\\2713"}
  .name{flex:1;font-size:15.5px}
  .row.present .name{font-weight:600}
  .row:not(.present):not(.unset) .name{color:var(--absent)}
  .role{font-size:11.5px;color:#8a8675;font-family:ui-monospace,Menlo,monospace;
    font-style:normal;display:block;margin-top:1px}
  .nv{font-size:10px;color:#8a8675;border:1px solid var(--line);border-radius:3px;
    padding:1px 5px;font-family:ui-monospace,Menlo,monospace;flex:none}
  .del{flex:none;border:none;background:none;color:#c4bca8;cursor:pointer;font-size:18px;
    line-height:1;padding:4px 6px;border-radius:4px}
  .del:hover{color:var(--accent);background:#f6e9e6}
  .addbar{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;padding-top:16px;
    border-top:1px dashed var(--line)}
  .addbar input,.addbar select{font-family:inherit;font-size:14px;padding:9px 11px;
    border:1px solid var(--line);border-radius:4px;background:#fff;color:var(--ink)}
  .addbar input{flex:1;min-width:150px}
  .addbar select{flex:none}
  button.btn{font-family:ui-monospace,Menlo,monospace;font-size:12px;font-weight:700;
    letter-spacing:.05em;padding:9px 16px;border:1px solid var(--navy);background:var(--navy);
    color:#fff;border-radius:4px;cursor:pointer;transition:.15s}
  button.btn:hover{background:#162a4d}
  button.btn.ghost{background:transparent;color:var(--navy)}
  button.btn.ghost:hover{background:#eef1f7}
  .toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
  footer{max-width:860px;margin:26px auto 0;font-size:12px;color:#8a8675;
    font-family:ui-monospace,Menlo,monospace;text-align:center;line-height:1.7}
  @media(max-width:560px){h1{font-size:24px}.tab{flex:1;text-align:center}}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="kicker">Icahn School of Medicine at Mount Sinai &middot; ASCEND</div>
    <h1>EEC Subcommittee Attendance</h1>
    <div class="sub">Tap a box to mark present. Add members at the bottom of each panel.</div>
    <div style="margin-top:12px;padding:9px 13px;background:#f6e9e6;border:1px solid #e6c9c1;border-radius:4px;font-size:13px;color:#b5472d;font-family:ui-monospace,Menlo,monospace">
      &#9888; This shared version holds data in memory only. <b>Export the record before closing or refreshing</b> &mdash; checks are not saved.
    </div>
  </header>
  <div class="tabs" id="tabs"></div>
  <div id="panels"></div>
</div>
<footer>
  Quorum = majority of voting members. Counts reflect <b>voting members only</b>.<br>
  Attendance persists per device &middot; use "New meeting" to clear all checks.
</footer>

<script>
const SEED = {
  EEC:{name:"Executive Education Committee",quorum:7,people:[
    ["TBA","General Faculty Co-Chair",1],
    ["Ganesh Gunasekaran, MD","General Faculty \\u2014 Section Chief, Hepatobiliary Surgery",1],
    ["Arvind Kamthan, MD","General Faculty \\u2014 Hematology & Medical Oncology",1],
    ["Brian Rice, MD","General Faculty \\u2014 Hospital Medicine",1],
    ["Kyunghyun Lee, MD","General Faculty \\u2014 Hospital Medicine",1],
    ["Richard Stern, MD","General Faculty \\u2014 Radiology, Medical Education",1],
    ["Sreekala Raghavan, MD","General Faculty \\u2014 General Internal Medicine",1],
    ["TBA","General Faculty",1],
    ["TBA","General Faculty",1],
    ["TBA","Student Representative, Phase 1",1],
    ["Alan Zhang","Student Representative, Phase 2",1],
    ["Jamie Frost","Student Representative, Phase 3",1],
    ["TBA","Student Representative, MSTP",1],
    ["Rainier Soriano, MD","Administrative Co-Chair \\u2014 Sr. Assoc. Dean, Curricular Affairs",0],
    ["Tonia Kim, MD","PCCS Faculty Co-Chair",0],
    ["Deanna Chieco, MD","CCS Faculty Co-Chair",0],
    ["Leona Hess, PhD","CIS Faculty Co-Chair",0],
    ["Michelle Francis, MD","AES Faculty Co-Chair",0],
    ["Cynthia Abraham, MD","Module Director (Pre-clerkship)",0],
    ["Eve Merrill, MD","Clerkship Director (Inpatient Medicine)",0],
    ["Eric Kutscher, MD","General Internal Medicine",0],
    ["Brad Rosenberg, MD, PhD","Dept. of Microbiology",0],
    ["Craig Katz, MD","Psychiatry, Medical Education, Health System Design",0],
    ["Vannita Simma-Chiang, MD","Director of Specialty Advising",0]
  ]},
  PCCS:{name:"Pre-Clerkship Curriculum Subcommittee",quorum:13,people:[
    ["Tonia Kim, MD","Faculty Co-Chair",1],
    ["Staci Leisman, MD","Administrative Co-Chair",0],
    ["Alexandros Polydorides, MD PhD","Phase 1 Module Director \\u2014 Pathology",1],
    ["Amanda Krausert, MD","Phase 1 Module Director \\u2014 Cardiology",1],
    ["David Bechhofer","Phase 1 Module Director \\u2014 MCG",1],
    ["Margrit Wiesendanger","Phase 1 Module Director",1],
    ["Trevor Pour","Phase 1 Module Director",1],
    ["Matthew Tomey","Phase 1 Module Director",1],
    ["Hannah Levavi","Phase 1 Module Director",1],
    ["Steven Itzkowitz","Phase 1 Module Director",1],
    ["John Paulsen","Phase 1 Module Director",1],
    ["Tamara Kalir","Phase 1 Module Director",1],
    ["Cynthia Abraham","Phase 1 Module Director",1],
    ["Maria Skamagas","Phase 1 Module Director",1],
    ["Micaela Bayard","Phase 1 Module Director",1],
    ["Soo Kim","Phase 1 Module Director",1],
    ["Roberto Posada","Phase 1 Module Director",1],
    ["Daniel Caplivski","Phase 1 Module Director",1],
    ["Laura Stein","Phase 1 Module Director",1],
    ["Anna Pace","Phase 1 Module Director",1],
    ["Simone Tomasi","Phase 1 Module Director",1],
    ["Oren Cohen","Phase 1 Module Director",1],
    ["Mary Beasley","Phase 1 Module Director",1],
    ["Christopher Strother","Director of Clinical Competency",0],
    ["Horatio Holzer","Director of Clinical Curriculum",0],
    ["Jacob Shreffler","Office of Assessment & Evaluation Rep",0],
    ["Ravi Ramaswamy","Director of Integration & Transitions",0],
    ["Rachael Volkman","Student Representative, Phase 1 (M1)",1],
    ["Nina Faynshtayn","Student Representative, Phase 1 (M2)",1]
  ]},
  CCS:{name:"Clinical Curriculum Subcommittee",quorum:13,people:[
    ["Deanna Chieco","Faculty Co-Chair",1],
    ["Horatio Holzer, MD","Administrative Co-Chair",0],
    ["Eve Merrill","Clerkship / Assoc. Clerkship Director",1],
    ["Rex Hermansen","Clerkship / Assoc. Clerkship Director",1],
    ["Jan Fune","Clerkship / Assoc. Clerkship Director",1],
    ["Scott Nguyen","Clerkship / Assoc. Clerkship Director",1],
    ["Mercedes Perez-Rodriguez","Clerkship / Assoc. Clerkship Director",1],
    ["Yael Kufert","Clerkship / Assoc. Clerkship Director",1],
    ["Katherine Chen","Clerkship / Assoc. Clerkship Director",1],
    ["Cynthia Abraham","Clerkship / Assoc. Clerkship Director",1],
    ["Michael Chietero","Clerkship / Assoc. Clerkship Director",1],
    ["Susan Lerner","Clerkship / Assoc. Clerkship Director",1],
    ["Adam Korayem","Clerkship / Assoc. Clerkship Director",1],
    ["Shefali Trivedi","Clerkship / Assoc. Clerkship Director",1],
    ["Chandni Pawar","Clerkship / Assoc. Clerkship Director",1],
    ["Matthew Swan","Clerkship / Assoc. Clerkship Director",1],
    ["Andrea Lendaris","Clerkship / Assoc. Clerkship Director",1],
    ["Dessi Tsevdos","Clerkship / Assoc. Clerkship Director",1],
    ["Eric Barna","Clerkship / Assoc. Clerkship Director",1],
    ["Harish Jasti","Clerkship / Assoc. Clerkship Director",1],
    ["Laura Belland","Clerkship / Assoc. Clerkship Director",1],
    ["Christopher Strother","Director of Clinical Competency",0],
    ["Vasundhara Singh","Director of Medical Student Electives",0],
    ["Staci Leisman","Director of Pre-clerkship Curriculum",0],
    ["Ravi Ramaswamy","Director of Integration & Transitions",0],
    ["Jamie Edelstein, MD","Clinical Site Education Leader (MSHS)",1],
    ["Reema","Clinical Site Education Leader (Affiliate)",1],
    ["Jacob Shreffler","Office of Assessment & Evaluation Rep",0],
    ["Michael Lemonick","Student Representative, Phase 2/3",1],
    ["Emma Breber","Student Representative, Phase 2/3",1]
  ]},
  CIS:{name:"Curricular Integration Subcommittee",quorum:10,people:[
    ["Leona Hess, PhD","Faculty Co-Chair",1],
    ["Ravishankar Ramaswamy, MD","Administrative Co-Chair",0],
    ["Maaike Van Gerwen, MD","AOC Lead \\u2014 Scientific & Scholarly Discovery",1],
    ["Leona Hess, PhD","AOC Lead \\u2014 Patient-Centered Advocacy",1],
    ["Aveena Kochar, MD","AOC Lead \\u2014 Healthcare Delivery Science",1],
    ["David Portnoy, MD","AOC Lead \\u2014 Leadership & Prof. Identity",1],
    ["Cynthia Abraham, MD","Thread Lead \\u2014 Embryology",1],
    ["Staci Leisman, MD","Thread Lead \\u2014 Physiology",1],
    ["Tonia Kim, MD","Thread Lead \\u2014 Pharmacology",1],
    ["TBA","Thread Lead \\u2014 Nutrition",1],
    ["Lili Chan","Thread Lead \\u2014 Artificial Intelligence",1],
    ["Krishna Chokshi","Thread Lead \\u2014 Medical Ethics",1],
    ["Jacqueline Sheehan","Thread Lead \\u2014 Communication Skills",1],
    ["Bess Storch","Thread Lead \\u2014 EBM",1],
    ["Joanne Hojsak","POM 1 Director",1],
    ["Mike Herscher","POM 2 Director",1],
    ["Bess Storch","POM 3 Director / EBM",1],
    ["Mary Rojas","Director, Medical Student Research Office",0],
    ["Christopher Strother","Director of Clinical Competency",0],
    ["Jacob Shreffler","Office of Assessment & Evaluation Rep",0],
    ["Naveen Abraham","Student Representative, Phase 1/2 (M1)",1],
    ["Alvira Tyagi","Student Representative, Phase 1/2 or 2/3 (M1)",1],
    ["Maria Hernandez","Student Representative, Phase 1/2 or 2/3 (M1)",1]
  ]},
  AES:{name:"Assessment & Evaluation Subcommittee",quorum:6,people:[
    ["Michelle Francis","Faculty Co-Chair (tentative)",1],
    ["Jacob Shreffler, PhD","Administrative Co-Chair",0],
    ["Not filled until July/August","Director of Assessment & Evaluation",1],
    ["Christopher Strother","Director of Clinical Competency",1],
    ["TBA","General Faculty",1],
    ["TBA","General Faculty",1],
    ["Varun Devraj","Student Representative",1],
    ["Ashwin Kulshrestha","Student Representative",1],
    ["Lev Sandler","Student Representative",1],
    ["Phase 2 Student \\u2014 TBA","Student Representative",1],
    ["Phase 3 Student \\u2014 TBA","Student Representative",1]
  ]}
};
const KEY="eec_attendance_v5";
function lastName(n){
  if(/^TBA/i.test(n)||/Not filled/i.test(n)||/^Phase \\d+ Student/i.test(n)) return null;
  let s=n.replace(/,\\s*(MD|PhD|MEd|DO|MHPE|MS|MPH|RN|EdD)\\b.*$/i,"").trim();
  let parts=s.split(/\\s+/);
  return (parts[parts.length-1]||"").toLowerCase();
}
function sortPeople(arr){
  return arr.map((p,idx)=>({p,idx})).sort((a,b)=>{
    const av=a.p.voting?1:0, bv=b.p.voting?1:0;
    if(av!==bv) return bv-av;
    const la=lastName(a.p.name), lb=lastName(b.p.name);
    if(la===null&&lb===null) return a.idx-b.idx;
    if(la===null) return 1;
    if(lb===null) return -1;
    return la<lb?-1:la>lb?1:a.idx-b.idx;
  }).map(o=>o.p);
}
for(const k in SEED){
  SEED[k].people = sortPeople(
    SEED[k].people.map(p=>({name:p[0],role:p[1],voting:p[2]}))
  ).map(p=>[p.name,p.role,p.voting]);
}
let state=null;
if(!state){
  state={};
  for(const k in SEED){
    state[k]={name:SEED[k].name,quorum:SEED[k].quorum,
      people:SEED[k].people.map(p=>({name:p[0],role:p[1],voting:p[2],present:false}))};
  }
}
function save(){/* in-memory only: export before closing or refreshing */}
let active=Object.keys(state)[0];

const tabsEl=document.getElementById("tabs");
const panelsEl=document.getElementById("panels");

function render(){
  tabsEl.innerHTML="";panelsEl.innerHTML="";
  for(const key in state){
    const t=document.createElement("div");
    t.className="tab"+(key===active?" active":"");
    t.textContent=key;
    t.onclick=()=>{active=key;render()};
    tabsEl.appendChild(t);

    const c=state[key];
    const panel=document.createElement("div");
    panel.className="panel"+(key===active?" active":"");

    const votingTotal=c.people.filter(p=>p.voting).length;
    const votingPresent=c.people.filter(p=>p.voting&&p.present).length;
    const allPresent=c.people.filter(p=>p.present).length;
    const met=votingPresent>=c.quorum;

    const meta=document.createElement("div");
    meta.className="meta";
    meta.innerHTML=
      '<h2>'+c.name+'</h2>'+
      '<span class="stat">Voting present <b>'+votingPresent+'</b> / '+votingTotal+'</span>'+
      '<span class="stat">All present <b>'+allPresent+'</b> / '+c.people.length+'</span>'+
      '<span class="stat">Quorum needs <b>'+c.quorum+'</b></span>'+
      '<span class="quorum '+(met?'q-met':'q-no')+'">'+(met?'QUORUM MET':'QUORUM NOT MET')+'</span>';
    panel.appendChild(meta);

    const ul=document.createElement("ul");
    let lastGroup=null;
    c.people.forEach((p,i)=>{
      const g=p.voting?"Voting members":"Non-voting / ex officio";
      if(g!==lastGroup){
        const gl=document.createElement("div");
        gl.className="group-label";gl.textContent=g;
        ul.appendChild(gl);lastGroup=g;
      }
      const li=document.createElement("li");
      li.className="row "+(p.present?"present":"unset");
      const box=document.createElement("div");
      box.className="chk";
      box.onclick=()=>{p.present=!p.present;save();render()};
      const nm=document.createElement("div");
      nm.className="name";
      nm.innerHTML=esc(p.name)+'<span class="role">'+esc(p.role||"")+'</span>';
      li.appendChild(box);li.appendChild(nm);
      if(!p.voting){const b=document.createElement("span");b.className="nv";b.textContent="non-voting";li.appendChild(b)}
      const del=document.createElement("button");
      del.className="del";del.innerHTML="&times;";del.title="Remove";
      del.onclick=()=>{if(confirm("Remove "+p.name+"?")){c.people.splice(i,1);save();render()}};
      li.appendChild(del);
      ul.appendChild(li);
    });
    panel.appendChild(ul);

    const add=document.createElement("div");
    add.className="addbar";
    add.innerHTML=
      '<input placeholder="Full name" id="n_'+key+'">'+
      '<input placeholder="Role / title (optional)" id="r_'+key+'">'+
      '<select id="v_'+key+'"><option value="1">Voting</option><option value="0">Non-voting</option></select>'+
      '<button class="btn">Add member</button>';
    add.querySelector("button").onclick=()=>{
      const nv=document.getElementById("n_"+key).value.trim();
      if(!nv){return}
      c.people.push({name:nv,role:document.getElementById("r_"+key).value.trim(),
        voting:+document.getElementById("v_"+key).value,present:false});
      c.people=sortPeople(c.people);
      save();render();
    };
    panel.appendChild(add);

    const tb=document.createElement("div");
    tb.className="toolbar";
    const dt=document.createElement("input");
    dt.type="date";dt.id="d_"+key;dt.value=c.date||"";
    dt.style.cssText="font-family:ui-monospace,Menlo,monospace;font-size:12px;padding:8px 10px;border:1px solid var(--line);border-radius:4px;background:#fff;color:var(--ink)";
    dt.onchange=()=>{c.date=dt.value;save()};
    const b1=document.createElement("button");
    b1.className="btn ghost";b1.textContent="New meeting (clear checks)";
    b1.onclick=()=>{if(confirm("Clear all attendance checks for "+key+"?")){c.people.forEach(p=>p.present=false);save();render()}};
    const b2=document.createElement("button");
    b2.className="btn ghost";b2.textContent="Mark all present";
    b2.onclick=()=>{c.people.forEach(p=>p.present=true);save();render()};
    const b3=document.createElement("button");
    b3.className="btn";b3.textContent="Export record";
    b3.onclick=()=>exportRecord(key);
    tb.appendChild(dt);tb.appendChild(b1);tb.appendChild(b2);tb.appendChild(b3);
    panel.appendChild(tb);

    panelsEl.appendChild(panel);
  }
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}

function exportRecord(key){
  const c=state[key];
  const date=c.date||new Date().toISOString().slice(0,10);
  const vT=c.people.filter(p=>p.voting).length;
  const vP=c.people.filter(p=>p.voting&&p.present).length;
  const met=vP>=c.quorum;
  const present=c.people.filter(p=>p.present);
  const absent=c.people.filter(p=>!p.present);

  let txt="";
  txt+=c.name+"\\n";
  txt+="Attendance Record \\u2014 "+date+"\\n";
  txt+="Icahn School of Medicine at Mount Sinai \\u00B7 ASCEND MD Curriculum\\n";
  txt+="".padEnd(60,"=")+"\\n\\n";
  txt+="Voting members present: "+vP+" of "+vT+"\\n";
  txt+="Quorum required: "+c.quorum+"\\n";
  txt+="Quorum: "+(met?"MET":"NOT MET")+"\\n";
  txt+="Total present (all): "+present.length+" of "+c.people.length+"\\n\\n";
  txt+="PRESENT ("+present.length+")\\n"+"".padEnd(60,"-")+"\\n";
  present.forEach(p=>{txt+="  [x] "+p.name+(p.voting?"":" (non-voting)")+" \\u2014 "+(p.role||"")+"\\n"});
  txt+="\\nABSENT ("+absent.length+")\\n"+"".padEnd(60,"-")+"\\n";
  absent.forEach(p=>{txt+="  [ ] "+p.name+(p.voting?"":" (non-voting)")+" \\u2014 "+(p.role||"")+"\\n"});
  txt+="\\nGenerated "+new Date().toLocaleString()+"\\n";

  let csv="Name,Role,Voting,Status\\n";
  c.people.forEach(p=>{
    const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
    csv+=[q(p.name),q(p.role||""),p.voting?"Voting":"Non-voting",p.present?"Present":"Absent"].join(",")+"\\n";
  });

  const ov=document.createElement("div");
  ov.style.cssText="position:fixed;inset:0;background:rgba(22,36,58,.55);display:grid;place-items:center;z-index:99;padding:18px";
  ov.onclick=e=>{if(e.target===ov)ov.remove()};
  const box=document.createElement("div");
  box.style.cssText="background:var(--card);border:1px solid var(--line);border-radius:6px;max-width:640px;width:100%;max-height:88vh;overflow:auto;padding:20px;box-shadow:0 20px 60px -20px rgba(0,0,0,.5)";
  box.innerHTML='<div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-bottom:4px">Attendance Record</div>'+
    '<h2 style="color:var(--navy);font-size:19px;margin-bottom:12px">'+esc(c.name)+' \\u2014 '+esc(date)+'</h2>';
  const ta=document.createElement("textarea");
  ta.value=txt;ta.readOnly=true;
  ta.style.cssText="width:100%;height:300px;font-family:ui-monospace,Menlo,monospace;font-size:12px;padding:12px;border:1px solid var(--line);border-radius:4px;background:#fbfaf5;color:var(--ink);resize:vertical";
  box.appendChild(ta);
  const bar=document.createElement("div");
  bar.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px";
  function mkBtn(label,fn,ghost){const b=document.createElement("button");b.className="btn"+(ghost?" ghost":"");b.textContent=label;b.onclick=fn;return b}
  function dl(name,data,mime){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:mime}));a.download=name;a.click()}
  bar.appendChild(mkBtn("Copy text",()=>{ta.select();document.execCommand("copy");}));
  bar.appendChild(mkBtn("Download .txt",()=>dl(key+"_attendance_"+date+".txt",txt,"text/plain"),true));
  bar.appendChild(mkBtn("Download .csv",()=>dl(key+"_attendance_"+date+".csv",csv,"text/csv"),true));
  bar.appendChild(mkBtn("Close",()=>ov.remove(),true));
  box.appendChild(bar);
  ov.appendChild(box);document.body.appendChild(ov);
}
render();

</script>
</body>
</html>
`;
