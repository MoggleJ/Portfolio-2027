// Compétences reprises de Portfolio_2026 (data/skills.json), niveau d'autonomie sur 4.
window.SKILLS = [
 {
  "icon": "📟",
  "title": "Embarqué & Bas Niveau",
  "skills": [
   [
    "C",
    4
   ],
   [
    "C++",
    4
   ],
   [
    "Arduino",
    4
   ],
   [
    "Python",
    4
   ],
   [
    "STM32",
    3
   ],
   [
    "Assembly",
    3
   ],
   [
    "RTOS",
    2
   ]
  ]
 },
 {
  "icon": "🌐",
  "title": "Développement Logiciel & Web",
  "skills": [
   [
    "JavaScript",
    3
   ],
   [
    "TypeScript",
    3
   ],
   [
    "Node.js",
    3
   ],
   [
    "Angular",
    3
   ],
   [
    "Java",
    4
   ],
   [
    "HTML / CSS",
    4
   ],
   [
    "Kotlin",
    3
   ]
  ]
 },
 {
  "icon": "🛠️",
  "title": "Outils",
  "skills": [
   [
    "Git / GitHub / GitLab",
    4
   ],
   [
    "Visual Studio Code",
    4
   ],
   [
    "STM32CubeIDE",
    2
   ],
   [
    "IntelliJ IDEA",
    4
   ],
   [
    "Arduino IDE",
    4
   ],
   [
    "Android Studio",
    3
   ]
  ]
 },
 {
  "icon": "🎨",
  "title": "CAO & Conception 3D",
  "skills": [
   [
    "Fusion 360",
    3
   ],
   [
    "SolidWorks",
    4
   ],
   [
    "SolidWorks Composer",
    3
   ],
   [
    "Scanner 3D",
    2
   ]
  ]
 },
 {
  "icon": "📚",
  "title": "Bases de Données",
  "skills": [
   [
    "MySQL",
    4
   ],
   [
    "MongoDB",
    3
   ]
  ]
 },
 {
  "icon": "💻",
  "title": "Infrastructure & DevOps",
  "skills": [
   [
    "Linux",
    4
   ],
   [
    "Windows",
    4
   ],
   [
    "Docker",
    3
   ],
   [
    "Kubernetes",
    2
   ]
  ]
 },
 {
  "icon": "🔬",
  "title": "Instrumentation & Analyse",
  "skills": [
   [
    "LabVIEW",
    3
   ],
   [
    "Windows CVI",
    3
   ],
   [
    "MATLAB",
    3
   ],
   [
    "Simulink",
    3
   ]
  ]
 },
 {
  "icon": "🎯",
  "title": "Autres compétences techniques",
  "skills": [
   [
    "Programmation Réseau",
    3
   ],
   [
    "Sécurité Informatique",
    3
   ],
   [
    "Programmation Concurrente",
    3
   ],
   [
    "Programmation de Tests",
    2
   ],
   [
    "IA (Apprentissage Profond et Apprentissage Automatique)",
    3
   ],
   [
    "SFTP / SSH",
    3
   ]
  ]
 },
 {
  "icon": "🌍",
  "title": "Communication",
  "skills": [
   [
    "Français (Natif)",
    4
   ],
   [
    "Anglais (C1 - 940)",
    4
   ],
   [
    "Espagnol (B2)",
    4
   ]
  ]
 }
];

(function () {
  const el = document.getElementById("skills");
  if (!el) return;
  el.innerHTML = window.SKILLS.map((c) => `
    <article class="card skill-cat reveal">
      <h3><span aria-hidden="true">${c.icon}</span>${c.title}</h3>
      ${c.skills.map(([n, l]) => `<div class="skill"><span>${n}</span><span class="lvl" role="img" aria-label="${l} sur 4">${[1, 2, 3, 4].map((i) => `<i class="${i <= l ? "on" : ""}"></i>`).join("")}</span></div>`).join("")}
    </article>`).join("");
})();
