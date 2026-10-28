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
  // Résultats détaillés sur la tablette
  const tests = document.getElementById("tests");
  if (tests) {
    const total = window.SKILLS.reduce((s, c) => s + c.skills.length, 0);
    document.querySelector(".t-count").textContent = `${window.SKILLS.length} modules · ${total} épreuves`;
    tests.innerHTML = window.SKILLS.map((c, i) => {
      const score = Math.round((c.skills.reduce((s, [, l]) => s + l, 0) / (c.skills.length * 4)) * 100);
      return `
      <div class="t-module" style="--d:${i % 2}">
        <div class="t-mod-head"><span><i>M${String(i + 1).padStart(2, "0")}</i>${c.title}</span><b>${score} %</b></div>
        <div class="t-meter"><i style="--v:${score}%"></i></div>
        <ul>${c.skills.map(([n, l]) => `<li><span>${n}</span><span class="t-lvl" data-l="${l}" title="${levels[l - 1]}"><span class="dots">${"<i></i>".repeat(4)}</span>${levels[l - 1]}</span></li>`).join("")}</ul>
      </div>`;
    }).join("");
  }
})();
