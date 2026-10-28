// Maquette sprint 1, thème vaisseau spatial : plan du vaisseau, sas, étoiles, soute, salle des machines et planète.
// Code de démonstration : tout sera réécrit en composants Next.js au sprint 2.

(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sélecteur de langue : visuel seulement pour la maquette
  document.querySelectorAll("[data-toggle-lang]").forEach((btn) =>
    btn.addEventListener("click", () => btn.querySelectorAll("span").forEach((s) => s.classList.toggle("on")))
  );

  // ---------- Plan du vaisseau : compartiment en cours ----------
  const decks = [...document.querySelectorAll(".deck")];
  const map = document.querySelectorAll(".deckmap a");
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    map.forEach((a) => {
      const on = a.dataset.for === e.target.id;
      a.classList.toggle("on", on);
      if (on) a.classList.add("seen");
    });
  }), { rootMargin: "-45% 0px -50% 0px" });
  decks.forEach((d) => spy.observe(d));

  // Les sas s'ouvrent quand on arrive devant
  const doors = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("open"); doors.unobserve(e.target); }
  }), { threshold: 0.9 });
  document.querySelectorAll(".door").forEach((d) => (reduced ? d.classList.add("open") : doors.observe(d)));

  // ---------- L'espace derrière la coque : étoiles qui défilent, plus vite quand on fait défiler la page ----------
  const canvas = document.getElementById("space");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, stars = [], speed = 0, lastY = scrollY;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round((w * h) / 4500) }, () => ({ x: Math.random() * w, y: Math.random() * h, z: .2 + Math.random() * .8 }));
    };
    addEventListener("scroll", () => { speed = Math.min(40, speed + Math.abs(scrollY - lastY) * .08); lastY = scrollY; }, { passive: true });
    const draw = () => {
      ctx.fillStyle = "#020306"; ctx.fillRect(0, 0, w, h);
      const v = reduced ? 0 : .25 + speed;
      speed *= .92;
      for (const s of stars) {
        s.x -= v * s.z;
        if (s.x < -20) { s.x = w + 10; s.y = Math.random() * h; }
        const len = Math.max(1, v * s.z * 3);
        ctx.strokeStyle = `rgba(230, 236, 255, ${.25 + .6 * s.z})`;
        ctx.lineWidth = s.z * 1.6;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + len, s.y); ctx.stroke();
      }
      if (!reduced && !document.hidden) requestAnimationFrame(draw);
    };
    resize();
    addEventListener("resize", () => { resize(); if (reduced) draw(); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !reduced) requestAnimationFrame(draw); });
    requestAnimationFrame(draw);
  }

  // ---------- Soute : projets groupés en conteneurs, rapport déplié sur place ----------
  const P = window.PROJECTS || [];
  const kinds = { pro: "Entreprise", school: "École", perso: "Personnel" };
  const prefix = { pro: "ENT", school: "ECO", perso: "PER" };
  const code = (p) => `${prefix[p.kind]}-${String(P.filter((q) => q.kind === p.kind).indexOf(p) + 1).padStart(2, "0")}`;
  const log = document.getElementById("logbook");
  if (log) {
    log.innerHTML = Object.entries(kinds).map(([kind, label]) => {
      const items = P.filter((p) => p.kind === kind);
      return `<div class="log-group"><h3 data-anim>${label}<span>${items.length} conteneur${items.length > 1 ? "s" : ""}</span></h3>${items.map((p, k) => {
        const live = /cours|2027|alternance/.test(p.when);
        return `<div class="entry" data-anim style="--d:${k}">
          <button class="entry-row" aria-expanded="false">
            <i class="sonar" aria-hidden="true"></i>
            <span class="e-code">${code(p)}</span>
            <span class="e-main"><b>${p.title}</b><span>${p.where}</span></span>
            <span class="e-when">${p.when}</span>
            <span class="e-go" aria-hidden="true">+</span>
          </button>
          <div class="e-report" hidden>
            <div class="e-port"><div class="glass">${p.img ? `<img src="${p.img}" alt="${p.title}" loading="lazy">` : `<span class="empty">Visuel<br>à fournir</span>`}</div></div>
            <div class="e-text">
              <div class="e-meta"><span>Base <b>${p.where}</b></span><span>Période <b>${p.when}</b></span><span class="e-status${live ? " now" : ""}">${live ? "En cours" : "Terminée"}</span></div>
              <h4>Objectif</h4><p>${p.desc}</p>
              <h4>Journal de bord</h4>
              <ul class="e-steps">${p.missions.map((m) => `<li><b>${m[0]}</b><span>${m[1]}</span></li>`).join("")}</ul>
              <div class="e-tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
              ${p.link ? `<a class="e-link" href="${p.link}" target="_blank" rel="noopener">Voir le code sur GitHub ↗</a>` : `<p class="e-note">Projet confidentiel ou sans dépôt public</p>`}
            </div>
          </div>
        </div>`;
      }).join("")}</div>`;
    }).join("");
    log.addEventListener("click", (e) => {
      const b = e.target.closest(".entry-row"); if (!b) return;
      const open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", open);
      b.nextElementSibling.hidden = !open;
    });
  }

  // ---------- Salle des machines : un cadran par domaine de compétences ----------
  const dials = document.getElementById("dials");
  if (dials && window.SKILLS) {
    const levels = ["bases", "intermédiaire", "autonome", "avancé"];
    const total = window.SKILLS.reduce((s, c) => s + c.skills.length, 0);
    document.getElementById("skills-lead").textContent = `${window.SKILLS.length} systèmes, ${total} compétences mesurées sur quatre niveaux : ${levels.join(", ")}.`;
    // Arc de 180° centré en (100,100), rayon 80 : longueur ≈ 251
    const ticks = Array.from({ length: 11 }, (_, i) => {
      const a = Math.PI * (1 - i / 10), c = Math.cos(a), s = Math.sin(a);
      return `<line class="tick" x1="${100 + c * 92}" y1="${100 - s * 92}" x2="${100 + c * 98}" y2="${100 - s * 98}"/>`;
    }).join("");
    dials.innerHTML = window.SKILLS.map((c, i) => {
      const score = Math.round((c.skills.reduce((s, [, l]) => s + l, 0) / (c.skills.length * 4)) * 100);
      return `<div class="dial" data-anim style="--d:${i % 3}" data-score="${score}">
        <svg viewBox="0 0 200 112" aria-hidden="true">${ticks}
          <path class="arc" d="M20 100 A80 80 0 0 1 180 100"/>
          <path class="val" d="M20 100 A80 80 0 0 1 180 100"/>
          <g class="needle"><line x1="100" y1="100" x2="100" y2="34"/><circle cx="100" cy="100" r="6"/></g>
        </svg>
        <div class="dial-num"><span data-count="${score}">0</span><small> %</small></div>
        <h3>${c.title}</h3>
        <ul>${c.skills.map(([n, l]) => `<li><span>${n}</span><span class="bub" title="${levels[l - 1]}">${[1, 2, 3, 4].map((j) => `<i class="${j <= l ? "f" : ""}" style="--n:${j}"></i>`).join("")}</span></li>`).join("")}</ul>
      </div>`;
    }).join("");
  }
  const runDial = (d) => {
    const s = +d.dataset.score;
    d.querySelector(".val").style.strokeDasharray = `${(251 * s) / 100} 400`;
    d.querySelector(".needle").style.transform = `rotate(${-90 + 1.8 * s}deg)`;
  };

  // ---------- Apparitions, compteurs et conduit lumineux ----------
  function count(el) {
    const end = +el.dataset.count, t0 = performance.now(), dur = reduced ? 0 : 1400;
    const step = (t) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1;
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const anim = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("in");
    anim.unobserve(el);
    if (el.dataset.count) count(el);
    el.querySelectorAll("[data-count]").forEach(count);
    if (el.classList.contains("dial")) runDial(el);
  }), { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll("[data-anim], .readings dd").forEach((el) => anim.observe(el));

  const cables = document.querySelectorAll(".cable");
  const unroll = () => cables.forEach((cb) => {
    const r = cb.getBoundingClientRect(), mid = innerHeight * 0.62;
    cb.style.setProperty("--k", reduced ? 1 : Math.min(1, Math.max(0, (mid - r.top) / r.height)).toFixed(3));
    cb.querySelectorAll(".beacon").forEach((b) => b.classList.toggle("lit", b.getBoundingClientRect().top + 30 < mid));
  });
  addEventListener("scroll", unroll, { passive: true });
  unroll();

  // ---------- Yeux des habitants : ils suivent le pointeur ----------
  const pupils = document.querySelectorAll("[data-pupil]");
  if (pupils.length && !reduced) {
    addEventListener("pointermove", (e) => {
      pupils.forEach((p) => {
        const eye = p.previousElementSibling.getBoundingClientRect();
        const dx = e.clientX - (eye.left + eye.width / 2), dy = e.clientY - (eye.top + eye.height / 2);
        // L'habitant est tourné sur la planète : on ramène la direction écran dans son repère local
        const m = p.parentNode.getScreenCTM().inverse();
        const lx = m.a * dx + m.c * dy, ly = m.b * dx + m.d * dy;
        const len = Math.hypot(lx, ly) || 1;
        const dist = Math.min(+p.dataset.pupil, Math.hypot(dx, dy) / 40);
        p.setAttribute("transform", `translate(${(lx / len) * dist} ${(ly / len) * dist})`);
      });
    });
  }

  // ---------- Planète par le hublot : tirer le drapeau vers le haut révèle les couches (easter egg) ----------
  const planet = document.getElementById("planet");
  if (planet) {
    const svg = planet.querySelector("svg"), flag = planet.querySelector(".flag"), close = planet.querySelector(".port-close");
    let y0 = null, pull = 0;
    const unit = () => 560 / svg.getBoundingClientRect().height;
    const setPull = (v) => { pull = v; planet.style.setProperty("--pull", `${-v}px`); };
    const open = () => { planet.classList.add("opened"); planet.style.removeProperty("--pull"); close.hidden = false; };
    flag.addEventListener("pointerdown", (e) => {
      if (planet.classList.contains("opened")) return;
      y0 = e.clientY; flag.setPointerCapture(e.pointerId); planet.classList.add("pulling");
    });
    flag.addEventListener("pointermove", (e) => {
      if (y0 === null) return;
      setPull(Math.min(70, Math.max(0, (y0 - e.clientY) * unit()) * 0.6)); // résistance : la part tient bon
    });
    const release = () => {
      if (y0 === null) return;
      y0 = null; planet.classList.remove("pulling");
      if (pull > 34) open();
      else { const tapped = pull === 0; setPull(0); if (tapped) { planet.classList.remove("wiggle"); void planet.offsetWidth; planet.classList.add("wiggle"); } }
    };
    flag.addEventListener("pointerup", release);
    flag.addEventListener("pointercancel", release);
    flag.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    close.addEventListener("click", () => { planet.classList.remove("opened"); setPull(0); close.hidden = true; });
  }
})();
