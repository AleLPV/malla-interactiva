const cursos = [
  // SEMESTRE I
  { id: "DE101", nombre: "Comunicación", ciclo: "I", requisitos: [] },
  { id: "DE102", nombre: "Introducción a la Filosofía", ciclo: "I", requisitos: [] },
  { id: "DE103", nombre: "Introducción a la Vida Universitaria", ciclo: "I", requisitos: [] },
  { id: "DE104", nombre: "Introducción al Estudio del Derecho", ciclo: "I", requisitos: [] },
  { id: "DE105", nombre: "Metodología del Estudio", ciclo: "I", requisitos: [] },
  { id: "DE106", nombre: "Taller de Liderazgo", ciclo: "I", requisitos: [] },
  { id: "DE107", nombre: "Teatro", ciclo: "I", requisitos: [] },

  // SEMESTRE II
  { id: "DE108", nombre: "Antropología Filosófica y Teológica", ciclo: "II", requisitos: ["DE102"] },
  { id: "DE109", nombre: "Comunicación I", ciclo: "II", requisitos: ["DE101"] },
  { id: "DE110", nombre: "Historia de la Cultura Occidental I", ciclo: "II", requisitos: ["DE102"] },
  { id: "DE111", nombre: "Historia General del Derecho", ciclo: "II", requisitos: ["DE104", "DE105"] },
  { id: "DE112", nombre: "Retórica y Dialéctica", ciclo: "II", requisitos: ["DE104", "DE107", "DE101"] },
  { id: "DE113", nombre: "Conciencia Jurídica del Peruano", ciclo: "II", requisitos: ["DE104", "DE105", "DE106"] },
  { id: "DE114", nombre: "Apreciación Artística (EH)", ciclo: "II", requisitos: [] },
  { id: "DE115", nombre: "Apreciación Literaria (EH)", ciclo: "II", requisitos: [] },

  // SEMESTRE III
  { id: "DE116", nombre: "Bases Romanistas del Derecho", ciclo: "III", requisitos: ["DE111"] },
  { id: "DE117", nombre: "Ciencia Política", ciclo: "III", requisitos: ["DE102", "DE108"] },
  { id: "DE118", nombre: "Derecho Natural", ciclo: "III", requisitos: ["DE112"] },
  { id: "DE119", nombre: "Historia de la Cultura Occidental II", ciclo: "III", requisitos: ["DE110"] },
  { id: "DE120", nombre: "Lógica y Gnoseología", ciclo: "III", requisitos: ["DE108"] },
  { id: "DE121", nombre: "Matemática para Abogados", ciclo: "III", requisitos: ["DE112"] },
  { id: "DE122", nombre: "Sociología y Derecho", ciclo: "III", requisitos: ["DE112"] }
];

// Agrupar cursos por ciclo
const cursosPorCiclo = {};
cursos.forEach(curso => {
  if (!cursosPorCiclo[curso.ciclo]) {
    cursosPorCiclo[curso.ciclo] = [];
  }
  cursosPorCiclo[curso.ciclo].push(curso);
});

const malla = document.getElementById("malla");

// Renderizar la malla
for (const ciclo in cursosPorCiclo) {
  const columna = document.createElement("div");
  columna.classList.add("semestre");
  const titulo = document.createElement("h2");
  titulo.textContent = `Semestre ${ciclo}`;
  columna.appendChild(titulo);

  cursosPorCiclo[ciclo].forEach(curso => {
    const div = document.createElement("div");
    div.classList.add("curso");
    div.textContent = curso.nombre;

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = curso.requisitos.length
      ? "Prerrequisitos:\n" + curso.requisitos.map(id => {
          const req = cursos.find(c => c.id === id);
          return req ? `- ${req.nombre}` : id;
        }).join("\n")
      : "Sin prerrequisitos.";

    div.appendChild(tooltip);

    div.addEventListener("click", () => {
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
      div.classList.toggle("completado");
    });

    columna.appendChild(div);
  });

  malla.appendChild(columna);
}
