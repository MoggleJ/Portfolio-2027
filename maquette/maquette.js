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

  // ---------- Tablette à droite : sommaire, journal de missions (après scan) et tests ----------
  const tablet = document.getElementById("tablet");
  if (tablet) {
    const handle = tablet.querySelector(".tablet-handle");
    let auto = false, scanTimer = 0;
    const setMode = (mode) => {
      tablet.querySelectorAll(".t-tabs [data-mode]").forEach((b) => b.setAttribute("aria-selected", b.dataset.mode === mode || (mode === "mission" && b.dataset.mode === "projects")));
      tablet.querySelectorAll("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== mode));
      tablet.classList.toggle("testing", mode === "tests");
      tablet.classList.toggle("wide", ["projects", "mission", "scan"].includes(mode));
      tablet.querySelector(".tablet-screen").scrollTop = 0;
    };
    const setOpen = (open) => { tablet.classList.toggle("open", open); handle.setAttribute("aria-expanded", open); };
    handle.addEventListener("click", () => { auto = false; setOpen(!tablet.classList.contains("open")); });
    tablet.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    tablet.querySelectorAll(".t-nav a:not([data-scan])").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
    document.addEventListener("click", (e) => { if (!tablet.contains(e.target) && !e.target.closest("#scan-btn")) { auto = false; setOpen(false); } });

    // Journal de missions : rendu dans la tablette
    const list = document.getElementById("t-projects");
    const kinds = { pro: "Entreprise", school: "École", perso: "Personnel" };
    const prefix = { pro: "ENT", school: "ECO", perso: "PER" };
    const P = window.PROJECTS || [];
    const code = (p) => `${prefix[p.kind]}-${String(P.filter((q) => q.kind === p.kind).indexOf(p) + 1).padStart(2, "0")}`;
    document.querySelectorAll(".js-count").forEach((el) => (el.textContent = P.length));
    if (list) {
      list.innerHTML = Object.entries(kinds).map(([kind, label]) => {
        const items = P.map((p, i) => [p, i]).filter(([p]) => p.kind === kind);
        return `<div class="t-group"><h4>${label}<span>${String(items.length).padStart(2, "0")}</span></h4>${items.map(([p, i]) => `
          <button class="t-mission" data-i="${i}"><span class="m-code">${code(p)}</span><span class="m-main"><b>${p.title}</b><span>${p.where} · ${p.when}</span></span><span aria-hidden="true">›</span></button>`).join("")}</div>`;
      }).join("");
      const rep = tablet.querySelector(".t-report");
      list.addEventListener("click", (e) => {
        const c = e.target.closest(".t-mission"); if (!c) return;
        const p = P[+c.dataset.i];
        const live = /cours|2027|alternance/.test(p.when);
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

    // Code-barres de la section 3 : la tablette sort, le scanne, puis affiche le journal
    const slip = document.getElementById("scan-btn");
    const msg = tablet.querySelector(".scan-msg");
    const scan = () => {
      clearTimeout(scanTimer);
      auto = false;
      slip && slip.classList.add("scanning");
      tablet.classList.remove("scanned");
      msg.textContent = "Lecture du code-barres…";
      setMode("scan"); setOpen(true);
      scanTimer = setTimeout(() => {
        msg.textContent = "MJ-2027 · PRJ reconnu · journal chargé";
        tablet.classList.add("scanned");
        slip && slip.classList.remove("scanning");
        scanTimer = setTimeout(() => setMode("projects"), reduced ? 300 : 700);
      }, reduced ? 300 : 1500);
    };
    slip && slip.addEventListener("click", scan);
    tablet.querySelector(".t-nav [data-scan]").addEventListener("click", () => setTimeout(scan, 400));

    // Elle se déplie toute seule sur la section compétences, en mode résultats de test
    const skills = document.getElementById("competences");
    if (skills) new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { auto = true; setMode("tests"); setOpen(true); }
      else if (auto) { auto = false; setOpen(false); setMode("menu"); }
    }, { threshold: 0.35 }).observe(skills);

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
