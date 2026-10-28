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

  // ---------- Tablette à droite : tout le dossier, déverrouillé par le scan du code-barres ----------
  const tablet = document.getElementById("tablet");
  if (tablet) {
    const handle = tablet.querySelector(".tablet-handle");
    const screen = tablet.querySelector(".tablet-screen");
    const wideScreen = window.matchMedia("(min-width: 1100px)");
    let scanTimer = 0, scanned = false;
    const setMode = (mode) => {
      const tab = mode === "mission" ? "projects" : mode;
      tablet.querySelectorAll(".t-tabs [data-mode]").forEach((b) => b.setAttribute("aria-selected", b.dataset.mode === tab));
      tablet.querySelectorAll("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== mode));
      tablet.classList.toggle("testing", mode === "tests");
      screen.scrollTop = 0;
    };
    // Sur grand écran, la fiche glisse à gauche pour laisser la tablette à côté
    const setOpen = (open) => {
      tablet.classList.toggle("open", open);
      handle.setAttribute("aria-expanded", open);
      document.body.classList.toggle("docked", open);
    };
    handle.addEventListener("click", () => setOpen(!tablet.classList.contains("open")));
    tablet.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
    document.addEventListener("click", (e) => {
      if (!wideScreen.matches && !tablet.contains(e.target) && !e.target.closest("#scan-btn")) setOpen(false);
    });

    // Journal de missions
    const list = document.getElementById("t-projects");
    const kinds = { pro: "Entreprise", school: "École", perso: "Personnel" };
    const prefix = { pro: "ENT", school: "ECO", perso: "PER" };
    const P = window.PROJECTS || [];
    const code = (p) => `${prefix[p.kind]}-${String(P.filter((q) => q.kind === p.kind).indexOf(p) + 1).padStart(2, "0")}`;
    // Sans visuel : mire de test avec le code du projet
    const visual = (p, cls) => p.img
      ? `<img class="${cls}" src="${p.img}" alt="${p.title}" loading="lazy">`
      : `<span class="${cls} no-img" aria-hidden="true"><b>${code(p)}</b><i>Visuel à fournir</i></span>`;
    document.querySelectorAll(".js-count").forEach((el) => (el.textContent = P.length));
    if (list) {
      list.innerHTML = Object.entries(kinds).map(([kind, label]) => {
        const items = P.map((p, i) => [p, i]).filter(([p]) => p.kind === kind);
        return `<div class="t-group"><h4>${label}<span>${String(items.length).padStart(2, "0")}</span></h4>${items.map(([p, i]) => `
          <button class="t-mission" data-i="${i}">${visual(p, "m-thumb")}<span class="m-main"><b>${p.title}</b><span>${code(p)} · ${p.where}</span></span><span aria-hidden="true">›</span></button>`).join("")}</div>`;
      }).join("");
      const rep = tablet.querySelector(".t-report");
      list.addEventListener("click", (e) => {
        const c = e.target.closest(".t-mission"); if (!c) return;
        const p = P[+c.dataset.i];
        const live = /cours|2027|alternance/.test(p.when);
        rep.querySelector(".r-visual").innerHTML = visual(p, "r-img");
        rep.querySelector(".code").textContent = `${code(p)} · ${kinds[p.kind]}`;
        rep.querySelector(".r-title").textContent = p.title;
        rep.querySelector(".base").textContent = p.where;
        rep.querySelector(".period").textContent = p.when;
        const st = rep.querySelector(".stamp-s");
        st.textContent = live ? "En cours" : "Accomplie"; st.classList.toggle("ongoing", live);
        rep.querySelector(".desc").textContent = p.desc;
        rep.querySelector(".log-list").innerHTML = p.missions.map((m) => `<li><b>${m[0]}</b>${m[1]}</li>`).join("");
        rep.querySelector(".tags").innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join("");
        rep.querySelector(".links-row").innerHTML = p.link
          ? `<a class="t-btn" href="${p.link}" target="_blank" rel="noopener">Voir le code sur GitHub ↗</a>`
          : `<span class="t-note">Projet confidentiel ou sans dépôt public</span>`;
        setMode("mission");
      });
    }

    // Scan : la tablette sort, lit le code-barres, puis déverrouille le dossier
    const slip = document.getElementById("scan-btn");
    const msg = tablet.querySelector(".scan-msg");
    const scan = () => {
      clearTimeout(scanTimer);
      slip && slip.classList.add("scanning");
      tablet.classList.remove("scanned");
      msg.textContent = "Lecture du code-barres…";
      setMode("scan"); setOpen(true);
      scanTimer = setTimeout(() => {
        msg.textContent = "MJ-2027 · dossier reconnu";
        tablet.classList.add("scanned");
        slip && slip.classList.remove("scanning");
        slip && slip.classList.add("done");
        scanTimer = setTimeout(() => { scanned = true; tablet.classList.remove("locked"); setMode("projects"); }, reduced ? 300 : 700);
      }, reduced ? 300 : 1500);
    };
    slip && slip.addEventListener("click", scan);
    tablet.querySelectorAll("[data-scan]").forEach((b) => b.addEventListener("click", () => {
      document.getElementById("projets").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      scan();
    }));
    // Déclenché automatiquement quand le code-barres arrive à l'écran
    if (slip) new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting && !scanned) { obs.disconnect(); scan(); }
    }, { threshold: 0.9 }).observe(slip);

    // Planète : vue surface ou couches sous le drapeau
    const views = tablet.querySelectorAll(".game-views .screen");
    tablet.querySelectorAll(".t-switch button").forEach((b) => b.addEventListener("click", () => {
      tablet.querySelectorAll(".t-switch button").forEach((x) => x.classList.toggle("on", x === b));
      views.forEach((v, i) => (v.hidden = i !== +b.dataset.view));
    }));

    const clock = tablet.querySelector(".t-clock"), start = Date.now();
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
