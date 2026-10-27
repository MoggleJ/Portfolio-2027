// Maquette sprint 1 : comportements de démonstration (thème, ciel, cartes, yeux).
// Rien ici n'est du code de production : tout sera réécrit en composants Next.js au sprint 2.

(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Thème ----------
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }
  const saved = store("theme");
  if (saved) root.dataset.theme = saved;
  document.querySelectorAll("[data-toggle-theme]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      store("theme", next);
    })
  );

  // Sélecteur de langue : visuel seulement pour la maquette
  document.querySelectorAll("[data-toggle-lang]").forEach((btn) =>
    btn.addEventListener("click", () => btn.querySelectorAll("span").forEach((s) => s.classList.toggle("on")))
  );

  // ---------- Étoiles ----------
  const canvas = document.getElementById("stars");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w, h, dpr;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(230, Math.max(110, (w * h) / 7000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.08 ? 1.4 + Math.random() * 0.8 : 0.4 + Math.random() * 0.9,
        period: 2000 + Math.random() * 4000,
        phase: Math.random() * Math.PI * 2,
        base: 0.25 + Math.random() * 0.55,
      }));
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      const light = root.dataset.theme === "light";
      const rgb = getComputedStyle(root).getPropertyValue("--star").trim();
      for (const s of stars) {
        if (light && s.r < 0.9) continue; // ciel clair : moins d'étoiles, comme une carte du ciel
        const a = reduced ? s.base : s.base * (0.55 + 0.45 * Math.sin((t / s.period) * Math.PI * 2 + s.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb}, ${a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.4 && !light) {
          ctx.fillStyle = `rgba(${rgb}, ${a * 0.15})`;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!reduced && !document.hidden) requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !reduced) requestAnimationFrame(draw); });
    requestAnimationFrame(draw);
    new MutationObserver(() => reduced && requestAnimationFrame(draw)).observe(root, { attributes: true });
  }

  // ---------- Cartes projets ----------
  const groups = document.getElementById("project-groups");
  const dialog = document.getElementById("detail");
  if (groups && window.PROJECTS) {
    const kinds = { pro: "Entreprise", school: "École", perso: "Personnel" };
    const prefix = { pro: "ENT", school: "ECO", perso: "PER" };
    const code = (p) => `${prefix[p.kind]}-${String(window.PROJECTS.filter((q) => q.kind === p.kind).indexOf(p) + 1).padStart(2, "0")}`;
    groups.innerHTML = Object.entries(kinds).map(([kind, label]) => {
      const items = window.PROJECTS.map((p, i) => [p, i]).filter(([p]) => p.kind === kind);
      return `
      <div class="group reveal" id="projets-${kind}">
        <h3 class="group-title">${label}<span>${String(items.length).padStart(2, "0")}</span></h3>
        <div class="log">${items.map(([p, i]) => `
          <button class="mission-row" data-i="${i}" aria-haspopup="dialog">
            <span class="m-code">${code(p)}</span>
            <span class="m-main"><strong>${p.title}</strong><span>${p.where}</span></span>
            <span class="m-when">${p.when}</span>
            <span class="m-tags">${p.tags.slice(0, 3).join(" · ")}</span>
            <span class="m-go" aria-hidden="true">→</span>
          </button>`).join("")}
        </div>
      </div>`;
    }).join("");

    groups.addEventListener("pointermove", (e) => {
      const c = e.target.closest(".mission-row"); if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    });

    groups.addEventListener("click", (e) => {
      const c = e.target.closest(".mission-row"); if (!c) return;
      const p = window.PROJECTS[+c.dataset.i];
      const live = /cours|2027|alternance/.test(p.when);
      dialog.querySelectorAll(".code").forEach((el) => (el.textContent = `Mission ${code(p)} · ${kinds[p.kind]}`));
      dialog.querySelector("h3").textContent = p.title;
      dialog.querySelector(".base").textContent = p.where;
      dialog.querySelector(".period").textContent = p.when;
      const stamp = dialog.querySelector(".stamp");
      stamp.textContent = live ? "En cours" : "Accomplie";
      stamp.classList.toggle("ongoing", live);
      dialog.querySelector(".desc").textContent = p.desc;
      dialog.querySelector("tbody").innerHTML = p.missions.map((m) => `<tr><td>${m[0]}</td><td>${m[1]}</td></tr>`).join("");
      dialog.querySelector(".tags").innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join("");
      dialog.querySelector(".links-row").innerHTML = p.link
        ? `<a class="btn ghost" href="${p.link}" target="_blank" rel="noopener">Voir le code sur GitHub ↗</a>`
        : `<span class="chip">Projet confidentiel ou sans dépôt public</span>`;
      dialog.showModal();
    });
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.querySelector(".close").addEventListener("click", () => dialog.close());
  }

  // ---------- Écran vidéo : timecode ----------
  const tc = document.querySelector(".timecode");
  if (tc && !reduced) {
    const t0 = performance.now();
    setInterval(() => {
      const t = (performance.now() - t0) / 1000;
      const p = (n) => String(Math.floor(n)).padStart(2, "0");
      tc.textContent = `${p(t / 3600)}:${p((t / 60) % 60)}:${p(t % 60)}:${p((t * 25) % 25)}`;
    }, 40);
  }

  // ---------- Yeux des monstres (aperçu, sans physique) ----------
  const pupils = document.querySelectorAll("[data-pupil]");
  if (pupils.length && !reduced) {
    window.addEventListener("pointermove", (e) => {
      pupils.forEach((p) => {
        const eye = p.previousElementSibling.getBoundingClientRect();
        const dx = e.clientX - (eye.left + eye.width / 2), dy = e.clientY - (eye.top + eye.height / 2);
        // Le monstre est tourné sur la planète : on ramène la direction écran dans son repère local
        const m = p.parentNode.getScreenCTM().inverse();
        const lx = m.a * dx + m.c * dy, ly = m.b * dx + m.d * dy;
        const len = Math.hypot(lx, ly) || 1;
        const dist = Math.min(+p.dataset.pupil, Math.hypot(dx, dy) / 40);
        p.setAttribute("transform", `translate(${(lx / len) * dist} ${(ly / len) * dist})`);
      });
    });
  }

  // ---------- Apparition au défilement ----------
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
