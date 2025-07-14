/* ------------- BLOQUE 1 (semestres 1 al 4) ------------- */
const CURSOS = [
  /* SEMESTRE 1 */
  { id:"DE16-0101", nombre:"Comunicación", ciclo:1, tipo: "OB", creditos: 3, requisitos:[] },
  { id:"DE16-0102", nombre:"Introducción a la Filosofía", ciclo:1, tipo: "OB", creditos: 3, requisitos:[] },
  { id:"DE16-0103", nombre:"Introducción a la Vida Universitaria", ciclo:1, tipo: "OB", creditos: 3, requisitos:[] },
  { id:"DE16-0104", nombre:"Introducción al Estudio del Derecho", ciclo:1, tipo: "OB", creditos: 4, requisitos:[] },
  { id:"DE16-0105", nombre:"Metodología del Estudio", ciclo:1, tipo: "OB", creditos: 3, requisitos:[] },
  { id:"DE16-0106", nombre:"Taller de Liderazgo", ciclo:1, tipo: "OB", creditos: 2, requisitos:[] },
  { id:"DE16-0107", nombre:"Teatro", ciclo:1, tipo: "OB", creditos: 3, requisitos:[] },

  /* SEMESTRE 2 */
  { id:"DE16-0208", nombre:"Antropología Filosófica y Teológica", ciclo:2, tipo: "OB", creditos: 3, requisitos:["DE16-0102"] },
  { id:"DE16-0209", nombre:"Comunicación I", ciclo:2, tipo: "OB", creditos: 3, requisitos:["DE16-0101"] },
  { id:"DE16-0210", nombre:"Historia de la Cultura Occidental I", ciclo:2, tipo: "OB", creditos: 3, requisitos:["DE16-0102"] },
  { id:"DE16-0211", nombre:"Historia General del Derecho", ciclo:2, tipo: "OB", creditos: 3, requisitos:["DE16-0104","DE16-0105"] },
  { id:"DE16-0212", nombre:"Retórica y Dialéctica", ciclo:2, tipo: "OB", creditos: 3, requisitos:["DE16-0104","DE16-0107","DE16-0101"] },
  { id:"DE16-0213", nombre:"Teoría del Derecho", ciclo:2, tipo: "OB", creditos: 4, requisitos:["DE16-0104","DE16-0105","DE16-0106"] },
  { id:"DE16-0214", nombre:"Apreciación Artística", ciclo:2, tipo: "EH", creditos: 2, requisitos:[] },
  { id:"DE16-0215", nombre:"Apreciación Literaria", ciclo:2, tipo: "EH", creditos: 2, requisitos:[] },

  /* SEMESTRE 3 */
  { id:"DE16-0316", nombre:"Bases Romanistas del Derecho", ciclo:3, tipo: "OB", creditos: 3, requisitos:["DE16-0211"] },
  { id:"DE16-0317", nombre:"Ciencia Política", ciclo:3, tipo: "OB", creditos: 4, requisitos:[] },
  { id:"DE16-0318", nombre:"Derecho Natural", ciclo:3, tipo: "OB", creditos: 4, requisitos:["DE16-0317","DE16-0212","DE16-0208"] },
  { id:"DE16-0319", nombre:"Historia de la Cultura Occidental II", ciclo:3, tipo: "OB", creditos: 3, requisitos:["DE16-0210"] },
  { id:"DE16-0320", nombre:"Lógica y Gnoseología", ciclo:3, tipo: "OB", creditos: 3, requisitos:["DE16-0208"] },
  { id:"DE16-0321", nombre:"Matemática para Abogados", ciclo:3, tipo: "OB", creditos: 3, requisitos:["DE16-0317"] },
  { id:"DE16-0322", nombre:"Apreciación Musical", ciclo:3, tipo: "EH", creditos: 2, requisitos:[] },
  { id:"DE16-0323", nombre:"Sociología y Derecho", ciclo:3, tipo: "EH", creditos: 2, requisitos:["DE16-0317"] },

  /* SEMESTRE 4 */
  { id:"DE16-0424", nombre:"Derecho Constitucional I", ciclo:4, tipo: "OB", creditos: 4, requisitos:["DE16-0318","DE16-0317"] },
  { id:"DE16-0425", nombre:"Derecho de Personas", ciclo:4, tipo: "OB", creditos: 3, requisitos:["DE16-0318","DE16-0316"] },
  { id:"DE16-0426", nombre:"Derecho Penal General", ciclo:4, tipo: "OB", creditos: 4, requisitos:["DE16-0318"] },
  { id:"DE16-0427", nombre:"Derecho y Economía", ciclo:4, tipo: "OB", creditos: 2, requisitos:["DE16-0321"] },
  { id:"DE16-0428", nombre:"Psicología", ciclo:4, tipo: "OB", creditos: 3, requisitos:["DE16-0208"] },
  { id:"DE16-0429", nombre:"Sistema de Justicia y Mecanismos de Solución de Conflictos", ciclo:4, tipo: "OB", creditos: 3, requisitos:["DE16-0317"] },
  { id:"DE16-0430", nombre:"Teología I", ciclo:4, tipo: "EH", creditos: 3, requisitos:["DE16-0208"] },
];

/* ------------- BLOOQUE 2 (semestres 5 al 8) ------------- */
  /* SEMESTRE 5 */
  { id:"DE16-0531", nombre:"Acto Jurídico", ciclo:5, tipo: "OB", creditos: 4, requisitos:["DE16-0425"] },
  { id:"DE16-0532", nombre:"Derecho Administrativo I", ciclo:5, tipo: "OB", creditos: 3, requisitos:["DE16-0424"] },
  { id:"DE16-0533", nombre:"Derecho Constitucional II", ciclo:5, tipo: "OB", creditos: 3, requisitos:["DE16-0429","DE16-0424"] },
  { id:"DE16-0534", nombre:"Derecho Penal Especial", ciclo:5, tipo: "OB", creditos: 3, requisitos:["DE16-0426"] },
  { id:"DE16-0535", nombre:"Derecho Procesal General", ciclo:5, tipo: "OB", creditos: 3, requisitos:["DE16-0429"] },
  { id:"DE16-0536", nombre:"Metodología de la Investigación Jurídica", ciclo:5, tipo: "OB", creditos: 3, requisitos:["DE16-0320","DE16-0426","DE16-0425","DE16-0424"] },
  { id:"DE16-0537", nombre:"Moral", ciclo:5, tipo: "EH", creditos: 3, requisitos:["DE16-0430","DE16-0320"] },

  /* SEMESTRE 6 */
  { id:"DE16-0638", nombre:"Argumentación Jurídica", ciclo:6, tipo: "OB", creditos: 3, requisitos:["DE16-0536","DE16-0535","DE16-0533"] },
  { id:"DE16-0639", nombre:"Derecho Administrativo II", ciclo:6, tipo: "OB", creditos: 3, requisitos:["DE16-0532"] },
  { id:"DE16-0640", nombre:"Derecho Internacional Público", ciclo:6, tipo: "OB", creditos: 2, requisitos:["DE16-0533"] },
  { id:"DE16-0641", nombre:"Derecho Procesal Civil I", ciclo:6, tipo: "OB", creditos: 4, requisitos:["DE16-0535"] },
  { id:"DE16-0642", nombre:"Derechos Reales", ciclo:6, tipo: "OB", creditos: 4, requisitos:["DE16-0427","DE16-0531"] },
  { id:"DE16-0643", nombre:"Suficiencia de Mitad de Carrera", ciclo:6, tipo: "OB", creditos: 1, requisitos:["DE16-0536"] },
  { id:"DE16-0644", nombre:"Teología II", ciclo:6, tipo: "OB", creditos: 3, requisitos:["DE16-0430"] },
  { id:"DE16-0645", nombre:"Seminario de Derecho Penal: Económico y Delitos contra la Administración Pública", ciclo:6, tipo: "EE1", creditos: 2, requisitos:["DE16-0534"] },
  { id:"DE16-0646", nombre:"Seminario de Introducción al Derecho Comparado", ciclo:6, tipo: "EE2", creditos: 2, requisitos:["DE16-0536"] },
  { id:"DE16-0647", nombre:"Historia de la Filosofía Política", ciclo:6, tipo: "EH", creditos: 2, requisitos:["DE16-0537","DE16-0533"] },

  /* SEMESTRE 7 */
  { id:"DE16-0748", nombre:"Contabilidad y Análisis Financiero", ciclo:7, tipo: "OB", creditos: 2, requisitos:[] },
  { id:"DE16-0749", nombre:"Derecho de Obligaciones", ciclo:7, tipo: "OB", creditos: 4, requisitos:["DE16-0642"] },
  { id:"DE16-0750", nombre:"Derecho Procesal Civil II", ciclo:7, tipo: "OB", creditos: 3, requisitos:["DE16-0641","DE16-0638"] },
  { id:"DE16-0751", nombre:"Derecho Procesal Constitucional", ciclo:7, tipo: "OB", creditos: 4, requisitos:["DE16-0638"] },
  { id:"DE16-0752", nombre:"Derecho Tributario I: PP.GG. y Código Tributario", ciclo:7, tipo: "OB", creditos: 3, requisitos:["DE16-0639"] },
  { id:"DE16-0753", nombre:"Historia del Perú I", ciclo:7, tipo: "OB", creditos: 3, requisitos:["DE16-0210"] },
  { id:"DE16-0754", nombre:"Derecho Municipal y Regional", ciclo:7, tipo: "EE4", creditos: 2, requisitos:["DE16-0532"] },
  { id:"DE16-0755", nombre:"Derecho de la Propiedad Intelectual", ciclo:7, tipo: "EE3", creditos: 2, requisitos:["DE16-0642","DE16-0532"] },
  { id:"DE16-0756", nombre:"Seminario de Organizaciones Internacionales", ciclo:7, tipo: "EE2", creditos: 2, requisitos:["DE16-0640"] },

  /* SEMESTRE 8 */
  { id:"DE16-0857", nombre:"Derecho de Contratos I: Teoría General", ciclo:8, tipo: "OB", creditos: 3, requisitos:["DE16-0749"] },
  { id:"DE16-0858", nombre:"Derecho Laboral I: PP.GG. y D.L. Individual", ciclo:8, tipo: "OB", creditos: 3, requisitos:["DE16-0640","DE16-0749"] },
  { id:"DE16-0859", nombre:"Derecho Mercantil I: Parte General y Títulos Valores", ciclo:8, tipo: "OB", creditos: 3, requisitos:["DE16-0749"] },
  { id:"DE16-0860", nombre:"Derecho Procesal Penal", ciclo:8, tipo: "OB", creditos: 4, requisitos:["DE16-0534","DE16-0638"] },
  { id:"DE16-0861", nombre:"Derecho Tributario II: Impuesto a la Renta", ciclo:8, tipo: "OB", creditos: 3, requisitos:["DE16-0748","DE16-0752"] },
  { id:"DE16-0862", nombre:"Historia del Perú II", ciclo:8, tipo: "OB", creditos: 3, requisitos:["DE16-0753"] },
  { id:"DE16-0863", nombre:"Derecho y Biotecnología", ciclo:8, tipo: "EE2", creditos: 2, requisitos:["DE16-0751","DE16-0640"] },
  { id:"DE16-0864", nombre:"Seminario de Criminalística, Ciencias Forenses y Criminología", ciclo:8, tipo: "EE1", creditos: 2, requisitos:["DE16-0751","DE16-0860","DE16-0428"] },
  { id:"DE16-0865", nombre:"Derecho de la Integración", ciclo:8, tipo: "EE2", creditos: 2, requisitos:["DE16-0640"] },
];

/* ------------- BLOQUE 3 (semestres 9 al 12) ------------- */

  /* SEMESTRE 9 */
  { id:"DE16-0966", nombre:"Derecho de Contratos II: Contratos Típicos", ciclo:9, tipo: "OB", creditos: 4, requisitos:["DE16-0857"] },
  { id:"DE16-0967", nombre:"Derecho Laboral II: D.L. Colectivo y D. Previsional", ciclo:9, tipo: "OB", creditos: 3, requisitos:["DE16-0858"] },
  { id:"DE16-0968", nombre:"Derecho Mercantil II: Sociedades", ciclo:9, tipo: "OB", creditos: 4, requisitos:["DE16-0859","DE16-0748"] },
  { id:"DE16-0969", nombre:"Derecho Tributario III: Imposición al Consumo y Tributación Municipal", ciclo:9, tipo: "OB", creditos: 2, requisitos:["DE16-0861"] },
  { id:"DE16-0970", nombre:"Enseñanza Social de la Iglesia", ciclo:9, tipo: "OB", creditos: 3, requisitos:["DE16-0430","DE16-0537"] },
  { id:"DE16-0971", nombre:"Taller de Negociación, Mediación y Conciliación", ciclo:9, tipo: "OB", creditos: 2, requisitos:["DE16-0857","DE16-0428"] },
  { id:"DE16-0972", nombre:"Derecho Procesal Laboral", ciclo:9, tipo: "EE1", creditos: 2, requisitos:["DE16-0967","DE16-0638"] },
  { id:"DE16-0973", nombre:"Seminario de Derecho y Nuevas Tecnologías", ciclo:9, tipo: "EE3", creditos: 2, requisitos:["DE16-0859","DE16-0857"] },
  { id:"DE16-0974", nombre:"Taller de Litigación Oral", ciclo:9, tipo: "EE1", creditos: 2, requisitos:["DE16-0860","DE16-0967","DE16-0638"] },

  /* SEMESTRE 10 */
  { id:"DE16-1075", nombre:"Arbitraje", ciclo:10, tipo: "OB", creditos: 3, requisitos:["DE16-0971","DE16-0968"] },
  { id:"DE16-1076", nombre:"Derecho de Familia", ciclo:10, tipo: "OB", creditos: 4, requisitos:["DE16-0967","DE16-0970"] },
  { id:"DE16-1077", nombre:"Ética Profesional", ciclo:10, tipo: "OB", creditos: 2, requisitos:["DE16-0537"] },
  { id:"DE16-1078", nombre:"Filosofía del Derecho", ciclo:10, tipo: "OB", creditos: 3, requisitos:["DE16-0751","DE16-0537"] },
  { id:"DE16-1079", nombre:"Responsabilidad Civil y Seguros", ciclo:10, tipo: "OB", creditos: 3, requisitos:["DE16-0857"] },
  { id:"DE16-1080", nombre:"Seminario de Investigación Jurídica I", ciclo:10, tipo: "OB", creditos: 3, requisitos:["DE16-0643"] },
  { id:"DE16-1081", nombre:"Seminario de Derecho del Consumidor, Oublicidad Comercial y PC.", ciclo:10, tipo: "EE1 - EE3", creditos: 2, requisitos:["DE16-0532","DE16-0968"] },
  { id:"DE16-1082", nombre:"Derecho Aduanero y Comercio Internacional", ciclo:10, tipo: "EE2 - EE3", creditos: 2, requisitos:["DE16-0857","DE16-0969"] },
  { id:"DE16-1083", nombre:"Seminario de Contratación Estatal y APP", ciclo:10, tipo: "EE4", creditos: 2, requisitos:["DE16-0857","DE16-0532"] },

  /* SEMESTRE 11 */
  { id:"DE16-1184", nombre:"Contratos Modernos", ciclo:11, tipo: "OB", creditos: 3, requisitos:["DE16-1079","DE16-0968"] },
  { id:"DE16-1185", nombre:"Derecho de Sucesiones", ciclo:11, tipo: "OB", creditos: 3, requisitos:["DE16-1076"] },
  { id:"DE16-1186", nombre:"Derechos Humanos", ciclo:11, tipo: "OB", creditos: 3, requisitos:["DE16-1078","DE16-0430"] },
  { id:"DE16-1187", nombre:"Elementos de Derecho Canónico y Eclesiástico del Estado", ciclo:11, tipo: "OB", creditos: 3, requisitos:["DE16-1076","DE16-1078"] },
  { id:"DE16-1188", nombre:"Financiamiento y Garantías", ciclo:11, tipo: "OB", creditos: 3, requisitos:["DE16-1079","DE16-0968","DE16-0748"] },
  { id:"DE16-1189", nombre:"Seminario de Investigación Jurídica II", ciclo:11, tipo: "OB", creditos: 3, requisitos:["DE16-1080"] },
  { id:"DE16-1190", nombre:"Derecho Bancario", ciclo:11, tipo: "EE3", creditos: 2, requisitos:["DE16-1079","DE16-0968"] },
  { id:"DE16-1191", nombre:"Derecho Minero", ciclo:11, tipo: "EE4", creditos: 2, requisitos:["DE16-0968","DE16-0639"] },
  { id:"DE16-1192", nombre:"Derecho de la Competencia y Regulación", ciclo:11, tipo: "EE4", creditos: 2, requisitos:["DE16-0639","DE16-0427","DE16-0968"] },

  /* SEMESTRE 12 */
  { id:"DE16-1193", nombre:"Derecho Internacional Privado", ciclo:12, tipo: "OB", creditos: 2, requisitos:["DE16-1185"] },
  { id:"DE16-1194", nombre:"Derecho Notarial y Registral", ciclo:12, tipo: "OB", creditos: 3, requisitos:["DE16-1185","DE16-0968"] },
  { id:"DE16-1195", nombre:"Inglés Técnico Jurídico", ciclo:12, tipo: "OB", creditos: 2, requisitos:[] },
  { id:"DE16-1206", nombre:"Práctica Empresarial: Mercantil, Tributario, Laboral y Gestión Empresarial", ciclo:12, tipo: "OB", creditos: 2, requisitos:["DE16-1188","DE16-0969","DE16-0967"] },
  { id:"DE16-1207", nombre:"Práctica Forense Civil y Penal", ciclo:12, tipo: "OB", creditos: 3, requisitos:["DE16-0860","DE16-0641"] },
  { id:"DE16-1208", nombre:"Práctica Forense en Derecho Const. y Administrativo", ciclo:12, tipo: "OB", creditos: 2, requisitos:["DE16-0639","DE16-1187"] },
  { id:"DE16-1209", nombre:"Arbitraje Comercial Internacional y de Inversiones", ciclo:12, tipo: "EE1 - EE2", creditos: 2, requisitos:["DE16-1075","DE16-1188"] },
  { id:"DE16-1299", nombre:"Derecho de la Energía", ciclo:12, tipo: "EE4", creditos: 2, requisitos:["DE16-1192"] },
  { id:"DE16-1210", nombre:"Dirección y Liderazgo Estratégico", ciclo:12, tipo:"EE3 - EE4", creditos:2, requisitos:["DE16-0748","DE16-1077","DE16-0106"] },

];
