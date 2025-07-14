/* ---------- 1. Utilidades ---------- */
const LS_KEY = "cursosCompletados";

const leerCompletados = () =>
  JSON.parse(localStorage.getItem(LS_KEY) || "[]");

const guardarCompletados = (lista) =>
  localStorage.setItem(LS_KEY, JSON.stringify(lista));

const creditosPorTipo = {
  OB: 0,
  EH: 0,
  EE1: 0,
  EE2: 0,
  EE3: 0,
  EE4: 0,
};

const cursosContadosEE = {
  EE1: 0,
  EE2: 0,
  EE3: 0,
  EE4: 0,
};

/* ---------- 2. Render ---------- */
function renderMalla(cursos) {
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = "";

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

        const tipos = curso.tipo.split("-");

        if (tipos.some((t) => t.startsWith("EE"))) {
          div.classList.add("ee");
        } else if (tipos.includes("EH")) {
          div.classList.add("eh");
        } else {
          div.classList.add("obligatorio");
        }

        div.classList.add("curso");
        div.textContent =
          tipos.some((t) => t.startsWith("EE")) ? `${curso.tipo} - ${curso.nombre}` : curso.nombre;

        if (completados.has(curso.id)) div.classList.add("completado");

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

        div.addEventListener("click", () => {
          div.classList.toggle("completado");
          toggleLS(curso.id);
          recalcularCreditos();
        });

        columna.appendChild(div);
      });

      contenedor.appendChild(columna);
    });
}

/* ---------- 3. Helpers ---------- */
function toggleLS(id) {
  const lista = leerCompletados();
  const idx = lista.indexOf(id);
  if (idx === -1) lista.push(id);
  else lista.splice(idx, 1);
  guardarCompletados(lista);
}

/* ---------- 4. Créditos y cantidad de cursos EE ---------- */
function recalcularCreditos() {
  for (const k in creditosPorTipo) creditosPorTipo[k] = 0;
  for (const k in cursosContadosEE) cursosContadosEE[k] = 0;

  const completados = new Set(leerCompletados());

  CURSOS.forEach((c) => {
    if (!completados.has(c.id)) return;

    const tipos = c.tipo.split("-");
    tipos.forEach((t) => {
      if (creditosPorTipo[t] != null) {
        creditosPorTipo[t] += Number(c.creditos || 0);
      }
      if (t.startsWith("EE")) cursosContadosEE[t]++;
    });
  });

  const ul = document.getElementById("creditos-list");
  ul.innerHTML = "";

  const orden = ["OB", "EH", "EE1", "EE2", "EE3", "EE4"];
  orden.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t}: ${creditosPorTipo[t]} créditos`;
    ul.appendChild(li);
  });

  const total = orden.reduce((s, t) => s + creditosPorTipo[t], 0);
  document.getElementById("creditos-total").textContent = `Total aprobados: ${total} créditos`;

  // Actualizar barra de progreso
  const totalMaximo = 243; // Reemplaza por el total real de créditos si es otro
  const porcentaje = Math.round((total / totalMaximo) * 100);
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;

  // Tabla de cursos EE aprobados
  const tabla = document.getElementById("tabla-cursos-ee");
  tabla.innerHTML = "";
  ["EE1", "EE2", "EE3", "EE4"].forEach((t) => {
    const row = document.createElement("li");
    row.textContent = `${t}: ${cursosContadosEE[t]} curso${cursosContadosEE[t] !== 1 ? "s" : ""}`;
    tabla.appendChild(row);
  });
}

/* ---------- 5. Inicio ---------- */
document.getElementById("btn-reset").addEventListener("click", () => {
  guardarCompletados([]);
  renderMalla(CURSOS);
  recalcularCreditos();
});

renderMalla(CURSOS);
recalcularCreditos();
