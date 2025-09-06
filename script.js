/* ===== Claves de almacenamiento ===== */
const LS_KEY_DONE  = "cursosCompletados";   // aprobados
const LS_KEY_CUR   = "cursosCursando";      // cursando
const LS_KEY_THEME = "themeColors";         // colores
const LS_KEY_FONT  = "themeFont";           // tipografía

/* ===== Estado ===== */
let WHAT_IF = false;
let whatIfSet = new Set();

const readJSON = (k, d) => JSON.parse(localStorage.getItem(k) || d);
const leerCompletados = () => readJSON(LS_KEY_DONE, "[]");
const guardarCompletados = (lista) => localStorage.setItem(LS_KEY_DONE, JSON.stringify(lista));
const leerCursando = () => readJSON(LS_KEY_CUR, "[]");
const guardarCursando = (lista) => localStorage.setItem(LS_KEY_CUR, JSON.stringify(lista));

const creditosPorTipo = { OB:0, EH:0, EE1:0, EE2:0, EE3:0, EE4:0 };
const cursosContadosEE = { EE1:0, EE2:0, EE3:0, EE4:0 };
const LS_KEY_PLAN = "cursosPlaneados";   // NUEVO: ids planeados (persistente)
let PLAN_MODE = false;                   // NUEVO: si está activo el modo planeado

const leerPlaneados    = () => JSON.parse(localStorage.getItem(LS_KEY_PLAN) || "[]");
const guardarPlaneados = (arr) => localStorage.setItem(LS_KEY_PLAN, JSON.stringify(arr));
function togglePlaneado(id){
  const arr = leerPlaneados();
  const i = arr.indexOf(id);
  if (i === -1) arr.push(id); else arr.splice(i,1);
  guardarPlaneados(arr);
}
/* ===== Render malla ===== */
function renderMalla(cursos){
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = "";

  const porCiclo = cursos.reduce((acc,c)=>{ (acc[c.ciclo] ||= []).push(c); return acc; },{});
  const completados = WHAT_IF ? new Set(whatIfSet) : new Set(leerCompletados());
  const cursando    = new Set(leerCursando());

  Object.keys(porCiclo).sort((a,b)=>+a-+b).forEach(ciclo=>{
    const col = document.createElement("div");
    col.className = "semestre";
    const h2 = document.createElement("h2");
    h2.textContent = `Semestre ${ciclo}`;
    col.appendChild(h2);

    porCiclo[ciclo].forEach(curso=>{
      const div = document.createElement("div");
      const tipos = String(curso.tipo).split("-");

      if (tipos.some(t=>t.startsWith("EE"))) div.classList.add("ee");
      else if (tipos.includes("EH")) div.classList.add("eh");
      else div.classList.add("obligatorio");

      div.classList.add("curso");
      div.textContent = tipos.some(t=>t.startsWith("EE")) ? `${curso.tipo} - ${curso.nombre}` : curso.nombre;

      if (completados.has(curso.id)) div.classList.add("completado");
      if (cursando.has(curso.id) && !div.classList.contains("completado")) div.classList.add("cursando");

      const tip = document.createElement("div");
      tip.className = "tooltip";
      const reqTxt = curso.requisitos?.length
        ? "Prerrequisitos:\n" + curso.requisitos.map(id=>{
            const r = CURSOS.find(x=>x.id===id); return r?`• ${r.nombre}`:id;
          }).join("\n")
        : "Sin prerrequisitos.";
      const depTxt = (()=>{
        const deps = CURSOS.filter(x=> (x.requisitos||[]).includes(curso.id)).map(x=>x.nombre);
        return deps.length ? "\nDependen de éste:\n• " + deps.join("\n• ") : "";
      })();
      tip.textContent = reqTxt + depTxt + "\n\nTips:\n• Click = Aprobado  ·  Ctrl/Cmd + click = Marcar ‘cursando’.";
      div.appendChild(tip);

      div.addEventListener("click", (ev)=>{
        if (ev.ctrlKey || ev.metaKey){
          toggleCursando(curso.id);
          div.classList.toggle("cursando");
          recalcularCreditos();
          return;
        }
        if (WHAT_IF){
          if (whatIfSet.has(curso.id)) whatIfSet.delete(curso.id); else whatIfSet.add(curso.id);
        }else{
          toggleLS(LS_KEY_DONE, curso.id);
        }
        div.classList.toggle("completado");
        if (div.classList.contains("completado")){
          const cur = new Set(leerCursando());
          if (cur.has(curso.id)){ cur.delete(curso.id); guardarCursando([...cur]); div.classList.remove("cursando"); }
        }
        recalcularCreditos();
      });

      col.appendChild(div);
    });

    contenedor.appendChild(col);
  });
}

/* ===== Helpers ===== */
function toggleLS(key, id){
  const lista = readJSON(key, "[]");
  const idx = lista.indexOf(id);
  if (idx === -1) lista.push(id); else lista.splice(idx,1);
  localStorage.setItem(key, JSON.stringify(lista));
}
function toggleCursando(id){
  const lista = leerCursando();
  const idx = lista.indexOf(id);
  if (idx === -1) lista.push(id); else lista.splice(idx,1);
  guardarCursando(lista);
}

/* ===== Créditos / % sólo OB ===== */
function recalcularCreditos(){
  for (const k in creditosPorTipo) creditosPorTipo[k]=0;
  for (const k in cursosContadosEE) cursosContadosEE[k]=0;

  const completados = WHAT_IF ? new Set(whatIfSet) : new Set(leerCompletados());

  CURSOS.forEach(c=>{
    if (!completados.has(c.id)) return;
    const tipos = String(c.tipo).split("-");
    tipos.forEach(t=>{
      if (creditosPorTipo[t] != null) creditosPorTipo[t] += Number(c.creditos || 0);
      if (t.startsWith("EE")) cursosContadosEE[t]++;
    });
  });

  const ul = document.getElementById("creditos-list");
  ul.innerHTML = "";
  const orden = ["OB","EH","EE1","EE2","EE3","EE4"];
  orden.forEach(t=>{
    const li = document.createElement("li");
    li.textContent = `${t}: ${creditosPorTipo[t]} créditos`;
    ul.appendChild(li);
  });
  const total = orden.reduce((s,t)=> s + creditosPorTipo[t], 0);
  document.getElementById("creditos-total").textContent = `Total aprobados: ${total} créditos`;

  const totalObMax = CURSOS.filter(c=> String(c.tipo).split("-").includes("OB"))
                           .reduce((s,c)=> s + Number(c.creditos||0), 0);
  const pct = Math.round(((creditosPorTipo.OB || 0) / (totalObMax || 1)) * 100);
  document.getElementById("barra-progreso").style.width = `${pct}%`;
  document.getElementById("porcentaje-progreso").textContent = `${pct}% (OB)`;
}

/* ===== Tema (colores) ===== */
function applyTheme(theme){
  const root = document.documentElement;
  const map = {
    "--bg": theme.bg, "--text": theme.text, "--primary": theme.progress,
    "--ob": theme.ob, "--ob-hover": theme.obHover || theme.ob, "--ob-done": theme.obDone || theme.ob,
    "--eh": theme.eh, "--eh-hover": theme.ehHover || theme.eh, "--eh-done": theme.ehDone || theme.eh,
    "--ee": theme.ee, "--ee-hover": theme.eeHover || theme.ee, "--ee-done": theme.eeDone || theme.ee,
    "--sem-header": theme.sem,
    "--curso-border": theme.cursoBorder,
    "--cursando-outline": theme.cursandoOutline
  };
  Object.entries(map).forEach(([k,v])=> v && root.style.setProperty(k,v));
}
function loadTheme(){
  const t = readJSON(LS_KEY_THEME, "null");
  if (t) applyTheme(t);
}
function themeInputs(){
  return {
    bg: document.getElementById("c-bg"),
    text: document.getElementById("c-text"),
    ob: document.getElementById("c-ob"),
    eh: document.getElementById("c-eh"),
    ee: document.getElementById("c-ee"),
    sem: document.getElementById("c-sem"),
    progress: document.getElementById("c-progress"),
    cursoBorder: document.getElementById("c-curso-border"),
    cursandoOutline: document.getElementById("c-cursando-outline"),
  };
}
function rgbToHex(rgb){
  if (!rgb) return '#000000';
  if (rgb.startsWith('#')) return rgb;
  const m = rgb.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return '#000000';
  const [r,g,b] = m.slice(1,4).map(Number);
  return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function initThemeInputs(){
  const get = (v)=> getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const t = readJSON(LS_KEY_THEME, "null") || {
    bg:get('--bg'), text:get('--text'), ob:get('--ob'), eh:get('--eh'), ee:get('--ee'),
    sem:get('--sem-header'), progress:get('--primary'),
    cursoBorder:get('--curso-border'), cursandoOutline:get('--cursando-outline')
  };
  const i = themeInputs();
  i.bg.value = rgbToHex(t.bg); i.text.value = rgbToHex(t.text);
  i.ob.value = rgbToHex(t.ob); i.eh.value = rgbToHex(t.eh); i.ee.value = rgbToHex(t.ee);
  i.sem.value = rgbToHex(t.sem); i.progress.value = rgbToHex(t.progress);
  i.cursoBorder.value = rgbToHex(t.cursoBorder || '#0000');
  i.cursandoOutline.value = rgbToHex(t.cursandoOutline);
}
function saveThemeFromInputs(){
  const i = themeInputs();
  const theme = {
    bg:i.bg.value, text:i.text.value, ob:i.ob.value, eh:i.eh.value, ee:i.ee.value,
    sem:i.sem.value, progress:i.progress.value,
    cursoBorder:i.cursoBorder.value, cursandoOutline:i.cursandoOutline.value
  };
  localStorage.setItem(LS_KEY_THEME, JSON.stringify(theme));
  applyTheme(theme);
}

/* ===== Tipografía ===== */
function applyFont(cfg){
  const root = document.documentElement;
  if (cfg.family) root.style.setProperty('--font-family', cfg.family);
  if (cfg.size)   root.style.setProperty('--font-size', `${cfg.size}px`);
  if (cfg.url){
    let link = document.getElementById('gf-link');
    if (!link){ link = document.createElement('link'); link.id='gf-link'; link.rel='stylesheet'; document.head.appendChild(link); }
    link.href = cfg.url;
  }
  localStorage.setItem(LS_KEY_FONT, JSON.stringify(cfg));
}
function loadFont(){
  const f = readJSON(LS_KEY_FONT, "null");
  if (!f) return;
  applyFont(f);
  const sel = document.getElementById('font-family'); if (sel && f.family) sel.value = f.family;
  const size = document.getElementById('font-size');  if (size && f.size) size.value = f.size;
  const url  = document.getElementById('font-url');   if (url && f.url) url.value = f.url;
}

/* ===== UI ===== */
function initUI(){
  // Reset aprobados
  document.getElementById("btn-reset").addEventListener("click",()=>{
    if (!WHAT_IF){ localStorage.setItem(LS_KEY_DONE, "[]"); }
    whatIfSet.clear();
    renderMalla(CURSOS); recalcularCreditos();
  });

  // Limpiar cursando
  document.getElementById("btn-clear-cursando").addEventListener("click",()=>{
    localStorage.setItem(LS_KEY_CUR, "[]");
    renderMalla(CURSOS); recalcularCreditos();
  });

  // PDF
  document.getElementById("btn-pdf").addEventListener("click",()=> window.print());

  // What-If
  const chk = document.getElementById("toggle-whatif");
  chk.addEventListener("change",()=>{
    WHAT_IF = chk.checked;
    whatIfSet = new Set(leerCompletados());
    renderMalla(CURSOS); recalcularCreditos();
  });

  // Panel de tema
  const panel = document.getElementById("panel-theme");
  const overlay = document.getElementById("theme-overlay");
  const btnTheme = document.getElementById("btn-theme");
  const btnClose = document.getElementById("btn-theme-close");
  const btnReset = document.getElementById("btn-theme-reset");

  const openPanel = ()=>{ panel.hidden=false; overlay.hidden=false; initThemeInputs(); };
  const closePanel = ()=>{ panel.hidden=true; overlay.hidden=true; };
  const togglePanel = ()=> panel.hidden ? openPanel() : closePanel();

  btnTheme.addEventListener("click", togglePanel);
  btnClose.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);
  window.addEventListener("keydown", (e)=>{ if(e.key==='Escape') closePanel(); if (e.altKey && e.key.toLowerCase()==='t') togglePanel(); });

  // Cambios de color en vivo
  Object.values(themeInputs()).forEach(inp=> inp.addEventListener("input", saveThemeFromInputs));

  // Aplicar tipografía
  document.getElementById('font-apply').addEventListener('click', ()=>{
    const family = document.getElementById('font-family').value;
    const size   = parseInt(document.getElementById('font-size').value,10) || 16;
    const url    = document.getElementById('font-url').value.trim();
    applyFont({ family, size, url });
  });

  // Reset tema
  btnReset.addEventListener('click', ()=>{
    localStorage.removeItem(LS_KEY_THEME);
    location.reload();
  });
}

/* ===== Inicio ===== */
loadTheme();
loadFont();
renderMalla(CURSOS);
recalcularCreditos();
initUI();
