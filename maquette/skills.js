// Compétences reprises de Portfolio_2026 (data/skills.json), niveau d'autonomie sur 4.
window.SKILLS = [
 {
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
  const levels = ["bases", "intermédiaire", "autonome", "avancé"];
  // Synthèse sur la fiche papier
  const paper = document.getElementById("skills");
  if (paper) {
    paper.innerHTML = `<table class="ledger"><thead><tr><th>Module</th><th>Épreuves</th><th>Score</th></tr></thead><tbody>${window.SKILLS.map((c) => {
      const score = Math.round((c.skills.reduce((s, [, l]) => s + l, 0) / (c.skills.length * 4)) * 100);
      return `<tr><td>${c.title}</td><td>${c.skills.map(([n]) => n).join(", ")}</td><td class="score">${score} %</td></tr>`;
    }).join("")}</tbody></table>`;
  }
  // Feuille de résultats : une épreuve par module, la case du niveau est cochée au stylo
  const tests = document.getElementById("tests");
  if (tests) {
    const total = window.SKILLS.reduce((s, c) => s + c.skills.length, 0);
    document.querySelector(".t-count").textContent = `${window.SKILLS.length} épreuves, ${total} compétences notées sur quatre niveaux.`;
    const x = '<svg class="pen-x" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4 L16 16"/><path d="M16 4 L4 16"/></svg>';
    tests.innerHTML = window.SKILLS.map((c, i) => {
      const score = Math.round((c.skills.reduce((s, [, l]) => s + l, 0) / (c.skills.length * 4)) * 100);
      return `
      <div class="exam" data-anim>
        <div class="exam-head">
          <span class="mono">Épreuve M${String(i + 1).padStart(2, "0")}</span>
          <h3>${c.title}</h3>
          <span class="exam-score"><b class="typed" data-count="${score}" data-suffix=" %">0 %</b><svg class="pen-circle" viewBox="0 0 120 60" aria-hidden="true"><path d="M8 32 C10 10 100 4 112 26 C120 46 40 58 14 46 C4 40 8 24 30 16"/></svg></span>
        </div>
        <table class="exam-grid">
          <thead><tr><th>Compétence</th>${["Bases", "Interm.", "Autonome", "Avancé"].map((l, j) => `<th title="${levels[j]}">${l}</th>`).join("")}</tr></thead>
          <tbody>${c.skills.map(([n, l], r) => `<tr style="--r:${r}"><td>${n}</td>${levels.map((_, j) => `<td class="box">${j + 1 === l ? x : ""}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>`;
    }).join("");
  }
})();
