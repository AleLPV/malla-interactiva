/* ---------- 1.  Utilidades ---------- */
const LS_KEY = "cursosCompletados";

const leerCompletados = () =>
  JSON.parse(localStorage.getItem(LS_KEY) || "[]");

const guardarCompletados = (lista) =>
  localStorage.setItem(LS_KEY, JSON.stringify(lista));

/* ---------- 2.  Render ---------- */
function renderMalla(cursos) {
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = "";   // limpio por si se re‑renderiza

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
        div.textContent = curso.nombre;

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

/* ---------- 3.  Helpers ---------- */
function cssTipo(tipo) {
  if (tipo.startsWith("EE")) return "ee";
  if (tipo === "EH") return "eh";
  return "obligatorio";
}

function toggleLS(id) {
  const lista = leerCompletados();
  const idx = lista.indexOf(id);
  if (idx === -1) lista.push(id);
  else lista.splice(idx, 1);
  guardarCompletados(lista);
}

/* ---------- 4.  Inicio ---------- */
document.getElementById("btn-reset").addEventListener("click", () => {
  guardarCompletados([]);
  renderMalla(CURSOS); // CURSOS está en datos‑cursos.js
});

renderMalla(CURSOS);
