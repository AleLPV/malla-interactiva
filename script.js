/* ---------- 1. Utilidades ---------- */
const LS_KEY = "cursosCompletados";

const leerCompletados = () =>
  JSON.parse(localStorage.getItem(LS_KEY) || "[]");

const guardarCompletados = (lista) =>
  localStorage.setItem(LS_KEY, JSON.stringify(lista));

// Objeto donde llevamos la cuenta de créditos aprobados
const creditosPorTipo = {
  OB: 0,
  EH: 0,
  EE1: 0,
  EE2: 0,
  EE3: 0,
  EE4: 0
};

/* ---------- 2. Render ---------- */
function renderMalla(cursos) {
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = ""; // limpio por si se re‑renderiza

  // Agrupo por ciclo
  const porCiclo = cursos.reduce((acc, c) => {
    (acc[c.ciclo] = acc[c.ciclo] || []).push(c);
    return acc;
  }, {});

  const completados = new Set(leerCompletados());

  Object.keys(porCiclo)
    .sort((a, b) => +a - +b)
    .forEach((ciclo) => {
      const columna = document.createElement("div");
      columna.className = "semestre";

      const h2 = document.createElement("h2");
      h2.textContent = `Semestre ${ciclo}`;
      columna.appendChild(h2);

      porCiclo[ciclo].forEach((curso) => {
        const div = document.createElement("div");
        div.className = `curso ${cssTipo(curso.tipo)}`;

        // Mostrar EE1 - Curso nombre
        div.textContent = (curso.tipo.startsWith("EE") ? `${curso.tipo} - ` : "") + curso.nombre;

        // Restaurar completado desde localStorage
        if (completados.has(curso.id)) div.classList.add("completado");

        // Tooltip de prerrequisitos
        const tip = document.createElement("div");
        tip.className = "tooltip";
        tip.textContent = curso.requisitos.length
          ? "Prerrequisitos:\n" +
            curso.requisitos
              .map((id) => {
                const req = cursos.find((c) => c.id === id);
                return req ? `• ${req.nombre}` : id;
              })
              .join("\n")
          : "Sin prerrequisitos.";
        div.appendChild(tip);

        // Click – marcar / desmarcar
        div.addEventListener("click", () => {
          div.classList.toggle("completado");
          toggleLS(curso.id);
        });

        columna.appendChild(div);
      });

      contenedor.appendChild(columna);
    });
}

/* ---------- 3. Helpers ---------- */
function cssTipo(tipo) {
  if (tipo.startsWith("EE")) return tipo.toLowerCase(); // ee1, ee2, ...
  if (tipo === "EH") return "eh";
  return "obligatorio";
}

function toggleLS(id) {
  const lista = leerCompletados();
  const idx = lista.indexOf(id);
  if (idx === -1) lista.push(id);
  else lista.splice(idx, 1);
  guardarCompletados(lista);

  // Recalcular créditos cuando se marca o desmarca un curso
  recalcularCreditos();
}

/* ---------- 4. Créditos aprobados ---------- */
function recalcularCreditos() {
  // Reinicia conteo
  for (const k in creditosPorTipo) creditosPorTipo[k] = 0;

  // Lee cursos completados
  const completados = new Set(leerCompletados());
  CURSOS.forEach(c => {
    if (completados.has(c.id)) creditosPorTipo[c.tipo] += c.creditos;
  });

  // Pinta lista
  const ul = document.getElementById("creditos-list");
  ul.innerHTML = ""; // limpia

  const orden = ["OB", "EH", "EE1", "EE2", "EE3", "EE4"];
  orden.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t}: ${creditosPorTipo[t]} créditos`;
    ul.appendChild(li);
  });

  // Total general
  const total = orden.reduce((s, t) => s + creditosPorTipo[t], 0);
  document.getElementById("creditos-total").textContent =
    `Total aprobados: ${total} créditos`;
}

/* ---------- 5. Inicio ---------- */
document.getElementById("btn-reset").addEventListener("click", () => {
  guardarCompletados([]);
  renderMalla(CURSOS); // vuelve a dibujar
  recalcularCreditos(); // y resetea créditos
});

// Primera carga
renderMalla(CURSOS);
recalcularCreditos();
