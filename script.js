const cursos = [
  // SEMESTRE 1
  { id: "DE101", nombre: "Comunicación", ciclo: "1", tipo: "OB", requisitos: [] },
  { id: "DE102", nombre: "Introducción a la Filosofía", ciclo: "1", tipo: "OB", requisitos: [] },
  { id: "DE103", nombre: "Introducción a la Vida Universitaria", ciclo: "1", tipo: "OB", requisitos: [] },
  { id: "DE104", nombre: "Introducción al Estudio del Derecho", ciclo: "1", tipo: "OB", requisitos: [] },
  { id: "DE105", nombre: "Metodología del Estudio", ciclo: "1", tipo: "OB", requisitos: [] },
  { id: "DE106", nombre: "Taller de Liderazgo", ciclo: "1", tipo: "OB", requisitos: [] },
  { id: "DE107", nombre: "Teatro", ciclo: "1", tipo: "OB", requisitos: [] },

  // SEMESTRE 2
  { id: "DE108", nombre: "Antropología Filosófica y Teológica", ciclo: "2", tipo: "OB", requisitos: ["DE102"] },
  { id: "DE109", nombre: "Comunicación I", ciclo: "2", tipo: "OB", requisitos: ["DE101"] },
  { id: "DE110", nombre: "Historia de la Cultura Occidental I", ciclo: "2", tipo: "OB", requisitos: ["DE102"] },
  { id: "DE111", nombre: "Historia General del Derecho", ciclo: "2", tipo: "OB", requisitos: ["DE104", "DE105"] },
  { id: "DE112", nombre: "Retórica y Dialéctica", ciclo: "2", tipo: "OB", requisitos: ["DE104", "DE107", "DE101"] },
  { id: "DE113", nombre: "Conciencia Jurídica del Peruano", ciclo: "2", tipo: "OB", requisitos: ["DE104", "DE105", "DE106"] },
  { id: "DE114", nombre: "Apreciación Artística", ciclo: "2", tipo: "EH", requisitos: [] },
  { id: "DE115", nombre: "Apreciación Literaria", ciclo: "2", tipo: "EH", requisitos: [] },

  // MÁS CURSOS DE SEMESTRE 3 AL 12...
];

// Leer desde localStorage
const cursosCompletados = JSON.parse(localStorage.getItem("cursosCompletados") || "[]");

const cursosPorCiclo = {};
cursos.forEach(curso => {
  if (!cursosPorCiclo[curso.ciclo]) {
    cursosPorCiclo[curso.ciclo] = [];
  }
  cursosPorCiclo[curso.ciclo].push(curso);
});

const malla = document.getElementById("malla");

for (const ciclo in cursosPorCiclo) {
  const columna = document.createElement("div");
  columna.classList.add("semestre");
  const titulo = document.createElement("h2");
  titulo.textContent = `Semestre ${ciclo}`;
  columna.appendChild(titulo);

  cursosPorCiclo[ciclo].forEach(curso => {
    const div = document.createElement("div");
    div.classList.add("curso");

    // Tipo de curso
    if (curso.tipo.startsWith("EE")) {
      div.classList.add("ee");
    } else if (curso.tipo === "EH") {
      div.classList.add("eh");
    } else {
      div.classList.add("obligatorio");
    }

    div.textContent = curso.nombre;

    // Tooltip de prerrequisitos
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = curso.requisitos.length
      ? "Prerrequisitos:\n" + curso.requisitos.map(id => {
          const req = cursos.find(c => c.id === id);
          return req ? `- ${req.nombre}` : id;
        }).join("\n")
      : "Sin prerrequisitos.";

    div.appendChild(tooltip);

    // Restaurar si estaba marcado
    if (cursosCompletados.includes(curso.id)) {
      div.classList.add("completado");
    }

    div.addEventListener("click", () => {
      div.classList.toggle("completado");
      actualizarLocalStorage(curso.id, div.classList.contains("completado"));
    });

    columna.appendChild(div);
  });

  malla.appendChild(columna);
}

// Guardar o quitar del localStorage
function actualizarLocalStorage(id, completado) {
  let completados = JSON.parse(localStorage.getItem("cursosCompletados") || "[]");
  if (completado) {
    if (!completados.includes(id)) completados.push(id);
  } else {
    completados = completados.filter(c => c !== id);
  }
  localStorage.setItem("cursosCompletados", JSON.stringify(completados));
}

// Botón desmarcar todos
function desmarcarTodo() {
  document.querySelectorAll(".curso").forEach(div => div.classList.remove("completado"));
  localStorage.removeItem("cursosCompletados");
}
