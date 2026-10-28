// Maquette sprint 1, thème sous-marin : profondeur, ambiance, carnet de plongée, instruments et planète.
// Code de démonstration : tout sera réécrit en composants Next.js au sprint 2.

(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sélecteur de langue : visuel seulement pour la maquette
  document.querySelectorAll("[data-toggle-lang]").forEach((btn) =>
    btn.addEventListener("click", () => btn.querySelectorAll("span").forEach((s) => s.classList.toggle("on")))
  );

  // ---------- Profondeur : jauge, zone et lumière de surface ----------
  const stations = [...document.querySelectorAll(".station")];
  const gauge = document.querySelector(".gauge");
  const gM = gauge.querySelector(".g-m"), gZone = gauge.querySelector(".g-zone");
  const MAX = 4000;
  let depthNow = 0;
  const depthAt = () => {
    const y = scrollY + innerHeight * 0.4;
    let i = 0;
    while (i < stations.length - 1 && stations[i + 1].offsetTop <= y) i++;
    const a = stations[i], b = stations[i + 1];
    const d0 = +a.dataset.depth;
    if (!b) return [d0, a];
    const k = Math.min(1, Math.max(0, (y - a.offsetTop) / (b.offsetTop - a.offsetTop)));
    return [d0 + (+b.dataset.depth - d0) * k, a];
  };
  const onScroll = () => {
    const [d, st] = depthAt();
    depthNow = d;
    gauge.classList.toggle("hide", d < 12);
    gM.textContent = Math.round(d).toLocaleString("fr-FR");
    gauge.style.setProperty("--g", Math.sqrt(d / MAX).toFixed(4));
    const z = st.querySelector(".st-depth");
    gZone.textContent = z ? z.textContent.split("·")[1].trim() : "Surface";
    root.style.setProperty("--surf", Math.max(0, 1 - scrollY / (innerHeight * 1.3)).toFixed(3));
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // ---------- Bulles qui remontent et neige marine, plus dense en profondeur ----------
  const canvas = document.getElementById("sea");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, bubbles = [], snow = [];
    const bubble = (x, y, r) => ({ x, y, r: r || 1 + Math.random() * 3.5, v: .3 + Math.random() * .8, ph: Math.random() * 6.28 });
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bubbles = Array.from({ length: Math.round(w / 40) }, () => bubble(Math.random() * w, Math.random() * h));
      snow = Array.from({ length: Math.round(w / 14) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: .5 + Math.random() * 1.2, v: .1 + Math.random() * .25 }));
    };
    // Le pointeur laisse échapper quelques bulles
    let last = 0;
    addEventListener("pointermove", (e) => {
      if (reduced || e.timeStamp - last < 90) return;
      last = e.timeStamp;
      bubbles.push(bubble(e.clientX + (Math.random() - .5) * 10, e.clientY, 1 + Math.random() * 2.5));
      if (bubbles.length > 120) bubbles.splice(0, bubbles.length - 120);
    });
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const deep = Math.min(1, depthNow / 2500);
      for (const s of snow) {
        s.y += s.v; s.x += Math.sin((t / 2000) + s.y / 50) * .1;
        if (s.y > h) { s.y = -5; s.x = Math.random() * w; }
        ctx.fillStyle = `rgba(220, 240, 245, ${.12 + .35 * deep})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
      }
      ctx.lineWidth = 1;
      for (const b of bubbles) {
        b.y -= b.v * (1 + b.r / 3); b.x += Math.sin(t / 600 + b.ph) * .35;
        if (b.y < -10) { b.y = h + 10; b.x = Math.random() * w; }
        ctx.strokeStyle = `rgba(234, 246, 249, ${.35 - .15 * deep})`;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.28); ctx.stroke();
        ctx.fillStyle = "rgba(255, 255, 255, .35)";
        ctx.beginPath(); ctx.arc(b.x - b.r * .35, b.y - b.r * .35, b.r * .25, 0, 6.28); ctx.fill();
      }
      if (!reduced && !document.hidden) requestAnimationFrame(draw);
    };
    resize();
    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !reduced) requestAnimationFrame(draw); });
    requestAnimationFrame(draw);
  }

  // ---------- Carnet de plongée : projets groupés, rapport déplié sur place ----------
  const P = window.PROJECTS || [];
  const kinds = { pro: "Entreprise", school: "École", perso: "Personnel" };
  const prefix = { pro: "ENT", school: "ECO", perso: "PER" };
  const code = (p) => `${prefix[p.kind]}-${String(P.filter((q) => q.kind === p.kind).indexOf(p) + 1).padStart(2, "0")}`;
  const log = document.getElementById("logbook");
  if (log) {
    log.innerHTML = Object.entries(kinds).map(([kind, label]) => {
      const items = P.filter((p) => p.kind === kind);
      return `<div class="log-group"><h3 data-anim>${label}<span>${items.length} plongée${items.length > 1 ? "s" : ""}</span></h3>${items.map((p, k) => {
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
            <div class="e-port"><div class="glass">${p.img ? `<img src="${p.img}" alt="${p.title}" loading="lazy">` : `<span class="empty">Image<br>à fournir</span>`}</div></div>
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

  // ---------- Instruments de bord : un cadran par domaine de compétences ----------
  const dials = document.getElementById("dials");
  if (dials && window.SKILLS) {
    const levels = ["bases", "intermédiaire", "autonome", "avancé"];
    const total = window.SKILLS.reduce((s, c) => s + c.skills.length, 0);
    document.getElementById("skills-lead").textContent = `${window.SKILLS.length} instruments, ${total} compétences relevées sur quatre niveaux : ${levels.join(", ")}.`;
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

  // ---------- Apparitions, compteurs et câble d'ancrage ----------
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

  // ---------- Planète au fond : tirer le drapeau vers le haut révèle les couches (easter egg) ----------
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
