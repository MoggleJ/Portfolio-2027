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
      const next = root.dataset.theme === "dark" ? "light" : "dark";
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

  // ---------- Le dossier dans la tablette : on y entre en défilant ----------
  const pad = document.getElementById("dossier");
  if (pad) {
    const device = pad.querySelector(".pad-device");

    // Entrée : la tablette grandit jusqu'à remplir l'écran, et le bureau s'assombrit autour
    const onScroll = () => {
      const r = pad.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.8)));
      device.style.setProperty("--p", reduced ? 1 : p.toFixed(3));
      document.body.classList.toggle("in-pad", r.top < vh * 0.3 && r.bottom > vh * 0.6);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();

    // Scan du code-barres : déclenché quand il arrive à l'écran, clic possible
    const slip = document.getElementById("scan-btn");
    const msg = pad.querySelector(".scan-msg");
    let scanned = false;
    const scan = () => {
      if (scanned) return;
      scanned = true;
      slip.classList.add("scanning");
      setTimeout(() => {
        slip.classList.remove("scanning"); slip.classList.add("done");
        pad.classList.add("scanned");
        msg.textContent = "MJ-2027 · dossier reconnu";
      }, reduced ? 200 : 1300);
    };
    if (slip) {
      slip.addEventListener("click", () => { scan(); pad.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); });
      new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { obs.disconnect(); scan(); } }, { threshold: 0.9 }).observe(slip);
    }

    // Journal de missions : chaque ligne déplie son rapport sur place
    const list = document.getElementById("t-projects");
    const kinds = { pro: "Entreprise", school: "École", perso: "Personnel" };
    const prefix = { pro: "ENT", school: "ECO", perso: "PER" };
    const P = window.PROJECTS || [];
    const code = (p) => `${prefix[p.kind]}-${String(P.filter((q) => q.kind === p.kind).indexOf(p) + 1).padStart(2, "0")}`;
    // Sans visuel : mire de test avec le code du projet
    const visual = (p, cls) => p.img
      ? `<img class="${cls}" src="${p.img}" alt="${p.title}" loading="lazy">`
      : `<span class="${cls} no-img" aria-hidden="true"><b>${code(p)}</b><i>Visuel à fournir</i></span>`;
    const report = (p) => {
      const live = /cours|2027|alternance/.test(p.when);
      return `<div class="m-report" hidden>
        ${visual(p, "r-img")}
        <div class="t-report">
          <dl class="t-rep-meta"><div><dt>Base</dt><dd>${p.where}</dd></div><div><dt>Période</dt><dd>${p.when}</dd></div><div><dt>Statut</dt><dd><span class="stamp-s${live ? " ongoing" : ""}">${live ? "En cours" : "Accomplie"}</span></dd></div></dl>
          <h4>Objectif</h4><p>${p.desc}</p>
          <h4>Journal de bord</h4><ul class="log-list">${p.missions.map((m) => `<li><b>${m[0]}</b>${m[1]}</li>`).join("")}</ul>
          <h4>Équipement</h4><div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <div class="links-row">${p.link ? `<a class="t-btn" href="${p.link}" target="_blank" rel="noopener">Voir le code sur GitHub ↗</a>` : `<span class="t-note">Projet confidentiel ou sans dépôt public</span>`}</div>
        </div>
      </div>`;
    };
    document.querySelectorAll(".js-count").forEach((el) => (el.textContent = P.length));
    if (list) {
      list.innerHTML = Object.entries(kinds).map(([kind, label]) => {
        const items = P.filter((p) => p.kind === kind);
        return `<div class="t-group"><h4>${label}<span>${String(items.length).padStart(2, "0")}</span></h4>${items.map((p) => `
          <div class="m-item">
            <button class="t-mission" aria-expanded="false">${visual(p, "m-thumb")}<span class="m-main"><b>${p.title}</b><span>${code(p)} · ${p.where} · ${p.when}</span></span><span class="m-go" aria-hidden="true">+</span></button>
            ${report(p)}
          </div>`).join("")}</div>`;
      }).join("");
      list.addEventListener("click", (e) => {
        const b = e.target.closest(".t-mission"); if (!b) return;
        const open = b.getAttribute("aria-expanded") !== "true";
        b.setAttribute("aria-expanded", open);
        b.nextElementSibling.hidden = !open;
      });
    }

    // Partie en cours : barre d'état et rail latéral ; les jauges de tests se remplissent à l'arrivée
    const where = pad.querySelector(".pad-where");
    const links = pad.querySelectorAll(".pad-rail a");
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      where.textContent = e.target.dataset.label;
      links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${e.target.id}`));
      if (e.target.id === "competences") e.target.classList.add("run");
    }), { rootMargin: "-45% 0px -50% 0px" });
    pad.querySelectorAll(".pad-sec").forEach((sec) => spy.observe(sec));

    const clock = pad.querySelector(".t-clock"), start = Date.now();
    setInterval(() => {
      const t = Math.floor((Date.now() - start) / 1000), p = (n) => String(n).padStart(2, "0");
      clock.textContent = `T+${p(Math.floor(t / 3600))}:${p(Math.floor(t / 60) % 60)}:${p(t % 60)}`;
    }, 1000);
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
