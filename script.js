/* ===== 1) Estado y utilidades ===== */
const LS_KEY_DONE = "cursosCompletados";      // completados (aprobados)
const LS_KEY_CUR = "cursosCursando";          // cursando (en curso)
const LS_KEY_THEME = "themeColors";           // colores personalizados

let WHAT_IF = false;                           // simulador (no persiste)
let whatIfSet = new Set();                     // selección temporal para what‑if

const leerJSON = (k, d) => JSON.parse(localStorage.getItem(k) || d);
const leerCompletados = () => leerJSON(LS_KEY_DONE, "[]");
const guardarCompletados = (lista) => localStorage.setItem(LS_KEY_DONE, JSON.stringify(lista));
const leerCursando = () => leerJSON(LS_KEY_CUR, "[]");
const guardarCursando = (lista) => localStorage.setItem(LS_KEY_CUR, JSON.stringify(lista));

const creditosPorTipo = { OB:0, EH:0, EE1:0, EE2:0, EE3:0, EE4:0 };
const cursosContadosEE = { EE1:0, EE2:0, EE3:0, EE4:0 };

/* ===== 2) Render principal ===== */
function renderMalla(cursos){
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = "";

  const porCiclo = cursos.reduce((acc, c)=>{ (acc[c.ciclo] ||= []).push(c); return acc; },{});

  // Set de estados
  const completados = WHAT_IF ? new Set(whatIfSet) : new Set(leerCompletados());
  const cursando = new Set(leerCursando());

  Object.keys(porCiclo).sort((a,b)=>+a-+b).forEach((ciclo)=>{
    const columna = document.createElement("div");
    columna.className = "semestre";

    const h2 = document.createElement("h2");
    h2.textContent = `Semestre ${ciclo}`;
    columna.appendChild(h2);

    porCiclo[ciclo].forEach((curso)=>{
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
        return deps.length? "\nDependen de éste:\n• " + deps.join("\n• ") : "";
      })();

      tip.textContent = reqTxt + depTxt + "\n\nTips: \n• Click = Aprobado.  Ctrl/Cmd + click = Marcar ‘cursando’.";
      div.appendChild(tip);

      // Click normal => aprobar/desaprobar (o en what‑if afecta set temporal)
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
        // Si pasa a completado, quitar cursando visual
        if (div.classList.contains("completado")){
          const cur = new Set(leerCursando());
          if (cur.has(curso.id)) { cur.delete(curso.id); guardarCursando([...cur]); div.classList.remove("cursando"); }
        }
        recalcularCreditos();
      });

      columna.appendChild(div);
    });

    contenedor.appendChild(columna);
  });
}

/* ===== 3) Helpers de estado ===== */
function toggleLS(key, id){
  const lista = leerJSON(key, "[]");
  const idx = lista.indexOf(id);
  if (idx===-1) lista.push(id); else lista.splice(idx,1);
  localStorage.setItem(key, JSON.stringify(lista));
}
function toggleCursando(id){
  const lista = leerCursando();
  const idx = lista.indexOf(id);
  if (idx===-1) lista.push(id); else lista.splice(idx,1);
  guardarCursando(lista);
}

/* ===== 4) Créditos y % sólo OB ===== */
function recalcularCreditos(){
  for (const k in creditosPorTipo) creditosPorTipo[k]=0;
  for (const k in cursosContadosEE) cursosContadosEE[k]=0;

  const completados = WHAT_IF ? new Set(whatIfSet) : new Set(leerCompletados());

  CURSOS.forEach((c)=>{
    if (!completados.has(c.id)) return;
    const tipos = String(c.tipo).split("-");
    tipos.forEach((t)=>{
      if (creditosPorTipo[t] != null) creditosPorTipo[t] += Number(c.creditos || 0);
      if (t.startsWith("EE")) cursosContadosEE[t]++;
    });
  });

  // Lista por tipo
  const ul = document.getElementById("creditos-list");
  ul.innerHTML = "";
  const orden = ["OB","EH","EE1","EE2","EE3","EE4"];
  orden.forEach((t)=>{
    const li = document.createElement("li");
    li.textContent = `${t}: ${creditosPorTipo[t]} créditos`;
    ul.appendChild(li);
  });

  const total = orden.reduce((s,t)=> s + creditosPorTipo[t], 0);
  document.getElementById("creditos-total").textContent = `Total aprobados: ${total} créditos`;

  // % sólo OB
  const totalObMax = CURSOS.filter(c=> String(c.tipo).split("-").includes("OB"))
                           .reduce((s,c)=> s + Number(c.creditos||0), 0);
  const pct = Math.round(((creditosPorTipo.OB || 0) / (totalObMax||1)) * 100);
  const barra = document.getElementById("barra-progreso");
  barra.style.width = `${pct}%`;
  document.getElementById("porcentaje-progreso").textContent = `${pct}% (OB)`;
}

/* ===== 5) Tema / colores ===== */
function applyTheme(theme){
  const root = document.documentElement;
  const map = {
    "--bg": theme.bg, "--text": theme.text, "--primary": theme.progress,
    "--ob": theme.ob, "--ob-hover": theme.obHover || theme.ob,
    "--ob-done": theme.obDone || theme.ob,
    "--eh": theme.eh, "--eh-hover": theme.ehHover || theme.eh,
    "--eh-done": theme.ehDone || theme.eh,
    "--ee": theme.ee, "--ee-hover": theme.eeHover || theme.ee,
    "--ee-done": theme.eeDone || theme.ee,
    "--sem-header": theme.sem
  };
  Object.entries(map).forEach(([k,v])=> v && root.style.setProperty(k,v));
}
function loadTheme(){
  const t = leerJSON(LS_KEY_THEME, "null");
  if (t) applyTheme(t);
}

/* ===== 6) Eventos UI ===== */
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

  // PDF (print)
  document.getElementById("btn-pdf").addEventListener("click",()=> window.print());

  // What‑If
  const chk = document.getElementById("toggle-whatif");
  chk.addEventListener("change",()=>{
    WHAT_IF = chk.checked;
    // Cargar set inicial desde aprobados reales
    whatIfSet = new Set(leerCompletados());
    renderMalla(CURSOS); recalcularCreditos();
  });

  // Panel de tema
  const panel = document.getElementById("panel-theme");
  const btnTheme = document.getElementById("btn-theme");
  const btnClose = document.getElementById("btn-theme-close");
  const btnReset = document.getElementById("btn-theme-reset");

  const inputs = {
    bg: document.getElementById("c-bg"),
    text: document.getElementById("c-text"),
    ob: document.getElementById("c-ob"),
    eh: document.getElementById("c-eh"),
    ee: document.getElementById("c-ee"),
    sem: document.getElementById("c-sem"),
    progress: document.getElementById("c-progress"),
  };

  // Abrir/cerrar panel
  const togglePanel = ()=> panel.hidden = !panel.hidden;
  btnTheme.addEventListener("click", togglePanel);
  btnClose.addEventListener("click", togglePanel);
  window.addEventListener("keydown", (e)=>{
    if (e.altKey && (e.key.toLowerCase()==='t')) togglePanel();
  });

  // Cambios de color
  Object.values(inputs).forEach(inp=>{
    inp.addEventListener("input",()=>{
      const theme = {
        bg: inputs.bg.value, text: inputs.text.value,
        ob: inputs.ob.value, eh: inputs.eh.value, ee: inputs.ee.value,
        sem: inputs.sem.value, progress: inputs.progress.value,
      };
      localStorage.setItem(LS_KEY_THEME, JSON.stringify(theme));
      applyTheme(theme);
    });
  });

  // Reset tema (volver a variables por defecto)
  btnReset.addEventListener("click",()=>{
    localStorage.removeItem(LS_KEY_THEME);
    location.reload();
  });
}

/* ===== 7) Inicio ===== */
loadTheme();
renderMalla(CURSOS);
recalcularCreditos();
initUI();
