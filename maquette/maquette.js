// Maquette sprint 1 : comportements de démonstration (thème, ciel, cartes, yeux).
// Rien ici n'est du code de production : tout sera réécrit en composants Next.js au sprint 2.

(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Thème unique : fiche claire, tablette sombre (plus de bascule jour / nuit)
  try { localStorage.removeItem("theme"); } catch (e) {}

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

  // ---------- Pièces à conviction : projets versés au dossier, rapport déplié sur place ----------
  const P = window.PROJECTS || [];
  const kinds = { pro: "Entreprise", school: "École", perso: "Personnel" };
  const prefix = { pro: "ENT", school: "ECO", perso: "PER" };
  const code = (p) => `${prefix[p.kind]}-${String(P.filter((q) => q.kind === p.kind).indexOf(p) + 1).padStart(2, "0")}`;
  // Tirage photo, ou cadre vide quand le visuel manque encore
  const photo = (p) => p.img
    ? `<figure class="ev-photo"><i class="tape t1" aria-hidden="true"></i><img src="${p.img}" alt="${p.title}" loading="lazy"><figcaption class="hand">${code(p)}</figcaption></figure>`
    : `<figure class="ev-photo missing"><span class="mono">Photographie<br>à joindre</span><figcaption class="hand">${code(p)}</figcaption></figure>`;
  const evidence = document.getElementById("evidence");
  if (evidence) {
    evidence.innerHTML = Object.entries(kinds).map(([kind, label]) => {
      const items = P.filter((p) => p.kind === kind);
      return `<div class="ev-group">
        <h3 class="ev-cat reveal">${label}<span>${items.length} pièce${items.length > 1 ? "s" : ""}</span></h3>
        ${items.map((p, k) => {
          const live = /cours|2027|alternance/.test(p.when);
          return `<div class="ev" data-anim style="--d:${k}">
          <button class="ev-row" aria-expanded="false">
            <span class="ev-tag"><i aria-hidden="true"></i>Pièce<b>${code(p)}</b></span>
            <span class="ev-main"><b>${p.title}</b><span>${p.where} · ${p.when}</span></span>
            <span class="ev-go mono">Ouvrir</span>
          </button>
          <div class="ev-report" hidden>
            ${photo(p)}
            <div class="ev-text">
              <table class="form ev-meta"><tr><th>Base</th><td class="typed">${p.where}</td></tr><tr><th>Période</th><td class="typed">${p.when}</td></tr><tr><th>Statut</th><td><span class="check${live ? "" : " on"}">Accomplie</span><span class="check${live ? " on" : ""}">En cours</span></td></tr></table>
              <h4>Objectif</h4><p>${p.desc}</p>
              <h4>Déroulé</h4>
              <table class="ledger ev-log"><tbody>${p.missions.map((m) => `<tr><td>${m[0]}</td><td>${m[1]}</td></tr>`).join("")}</tbody></table>
              <p class="ev-tags mono">${p.tags.join(" · ")}</p>
              ${p.link ? `<a class="annex-link" href="${p.link}" target="_blank" rel="noopener"><span class="mono">Code</span> Voir sur GitHub ↗</a>` : `<p class="hand ev-note">Projet confidentiel ou sans dépôt public.</p>`}
            </div>
          </div>
        </div>`;
        }).join("")}
      </div>`;
    }).join("");
    evidence.addEventListener("click", (e) => {
      const b = e.target.closest(".ev-row"); if (!b) return;
      const open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", open);
      b.querySelector(".ev-go").textContent = open ? "Refermer" : "Ouvrir";
      b.nextElementSibling.hidden = !open;
    });
  }

  // ---------- Animations à l'encre : apparitions en cascade, compteurs, frises ----------
  function count(el) {
    const end = +el.dataset.count, suffix = el.dataset.suffix || "", t0 = performance.now(), dur = reduced ? 0 : 1200;
    const step = (t) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1;
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const anim = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    anim.unobserve(e.target);
    e.target.querySelectorAll("[data-count]").forEach(count);
  }), { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-anim]").forEach((el) => anim.observe(el));

  // La frise se trace au fil du défilement et marque chaque étape
  const lines = document.querySelectorAll(".ink-line");
  const trace = () => lines.forEach((tl) => {
    const r = tl.getBoundingClientRect(), mid = innerHeight * 0.65;
    tl.style.setProperty("--k", reduced ? 1 : Math.min(1, Math.max(0, (mid - r.top) / r.height)).toFixed(3));
    tl.querySelectorAll(".ink-item").forEach((it) => it.classList.toggle("lit", it.getBoundingClientRect().top + 20 < mid));
  });
  addEventListener("scroll", trace, { passive: true });
  trace();

  // ---------- Planète : tirer le drapeau vers le haut soulève une part et révèle les couches (easter egg) ----------
  const planet = document.getElementById("planet");
  if (planet) {
    const svg = planet.querySelector("svg"), flag = planet.querySelector(".flag");
    const hud = planet.querySelector(".hud-l"), close = planet.querySelector(".hud-close");
    let y0 = null, pull = 0;
    const unit = () => 560 / svg.getBoundingClientRect().height;
    const setPull = (v) => { pull = v; planet.style.setProperty("--pull", `${-v}px`); };
    const open = () => {
      planet.classList.add("opened"); planet.style.removeProperty("--pull");
      hud.textContent = "SCAN · COUPE GÉOLOGIQUE · 3 COUCHES"; close.hidden = false;
    };
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
    close.addEventListener("click", () => {
      planet.classList.remove("opened"); setPull(0);
      hud.textContent = "REC · CAM-02 · SURFACE MJ-1"; close.hidden = true;
    });
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
