/* === Persistencia === */
const LS_KEY_THEME = "themeColors";   // colores
const LS_KEY_FONT  = "themeFont";     // tipografía

/* === Aplicar tema (variables CSS) === */
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
  const t = JSON.parse(localStorage.getItem(LS_KEY_THEME) || "null");
  if (t) applyTheme(t);
}

/* === Inputs del panel === */
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
  const m = rgb.match(/rgba?\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/i);
  if (!m) return '#000000';
  const [r,g,b] = m.slice(1,4).map(Number);
  return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function initThemeInputs(){
  // Cargar a los inputs los valores actuales (desde LS o CSS)
  const get = (v)=> getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const t = JSON.parse(localStorage.getItem(LS_KEY_THEME) || "null") || {
    bg:get('--bg'), text:get('--text'),
    ob:get('--ob'), eh:get('--eh'), ee:get('--ee'), sem:get('--sem-header'),
    progress:get('--primary'),
    cursoBorder:get('--curso-border'),
    cursandoOutline:get('--cursando-outline'),
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
    bg:i.bg.value, text:i.text.value,
    ob:i.ob.value, eh:i.eh.value, ee:i.ee.value, sem:i.sem.value,
    progress:i.progress.value,
    cursoBorder:i.cursoBorder.value,
    cursandoOutline:i.cursandoOutline.value,
  };
  localStorage.setItem(LS_KEY_THEME, JSON.stringify(theme));
  applyTheme(theme); // vista en vivo
}

/* === Tipografías === */
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
  const f = JSON.parse(localStorage.getItem(LS_KEY_FONT) || "null");
  if (!f) return;
  applyFont(f);
  // reflejar en UI
  const sel = document.getElementById('font-family');
  if (sel && f.family) sel.value = f.family;
  const size = document.getElementById('font-size');
  if (size && f.size) size.value = f.size;
  const url = document.getElementById('font-url');
  if (url && f.url) url.value = f.url;
}

/* === Panel: abrir/cerrar confiable === */
function initThemePanel(){
  const panel   = document.getElementById("panel-theme");
  const overlay = document.getElementById("theme-overlay");
  const btnOpen = document.getElementById("btn-theme");
  const btnClose= document.getElementById("btn-theme-close");
  const btnReset= document.getElementById("btn-theme-reset");

  const open  = ()=>{ panel.hidden=false; overlay.hidden=false; initThemeInputs(); };
  const close = ()=>{ panel.hidden=true;  overlay.hidden=true;  };
  const toggle= ()=> panel.hidden ? open() : close();

  btnOpen .addEventListener('click', toggle);
  btnClose.addEventListener('click', close);
  overlay .addEventListener('click', close);
  window   .addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); if(e.altKey && e.key.toLowerCase()==='t') toggle(); });

  // Cambios en vivo + persistencia
  Object.values(themeInputs()).forEach(inp=> inp.addEventListener('input', saveThemeFromInputs));

  // Reset de tema
  btnReset.addEventListener('click', ()=>{
    localStorage.removeItem(LS_KEY_THEME);
    location.reload();
  });

  // Tipografías
  document.getElementById('font-apply').addEventListener('click', ()=>{
    const family = document.getElementById('font-family').value;
    const size   = parseInt(document.getElementById('font-size').value,10) || 16;
    const url    = document.getElementById('font-url').value.trim();
    applyFont({ family, size, url });
  });
}

/* === Llamadas de inicio (colócalas donde ya inicializas) === */
loadTheme();
loadFont();
initThemePanel();
