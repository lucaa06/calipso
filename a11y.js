/**
 * Calipso — Widget Accessibilità
 * Autocontenuto · Nessun cookie · Nessun tracker
 * GDPR-compliant: preferenze in localStorage, nessun dato trasmesso.
 */
(function () {
  'use strict';

  const STORE_KEY = 'a11y_prefs';
  const DEFAULTS = { bigText:false, contrast:false, noMotion:false, underLinks:false, readFont:false };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(STORE_KEY))); }
    catch { return Object.assign({}, DEFAULTS); }
  }
  function save(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {} }

  let state = load();

  function apply() {
    const r = document.documentElement;
    r.style.setProperty('--a11y-fs', state.bigText ? '1.22' : '1');
    r.classList.toggle('a11y-contrast',  state.contrast);
    r.classList.toggle('a11y-no-motion', state.noMotion);
    r.classList.toggle('a11y-links',     state.underLinks);
    r.classList.toggle('a11y-font',      state.readFont);
  }

  /* ── CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    :root { --a11y-fs: 1; }
    html { font-size: calc(20px * var(--a11y-fs)); }

    /* ── ALTO CONTRASTO ── */
    html.a11y-contrast,
    html.a11y-contrast body { background:#000!important; color:#fff!important; }

    /* Tutto il testo: sempre bianco su nero */
    html.a11y-contrast * { color:#fff!important; opacity:1!important; }
    html.a11y-contrast a { color:#ffee00!important; text-decoration:underline!important; }
    html.a11y-contrast a:visited { color:#ffcc00!important; }

    /* Tutti i contenitori: sfondo nero */
    html.a11y-contrast section,
    html.a11y-contrast article,
    html.a11y-contrast nav,
    html.a11y-contrast footer,
    html.a11y-contrast footer-pg,
    html.a11y-contrast header,
    html.a11y-contrast main,
    html.a11y-contrast div,
    html.a11y-contrast #nav,
    html.a11y-contrast #nav.sc,
    html.a11y-contrast .get,
    html.a11y-contrast .process,
    html.a11y-contrast .intro,
    html.a11y-contrast .hero,
    html.a11y-contrast .mq-pale,
    html.a11y-contrast .mq-red,
    html.a11y-contrast .tech,
    html.a11y-contrast .deliv,
    html.a11y-contrast .faq,
    html.a11y-contrast .contact,
    html.a11y-contrast .svc,
    html.a11y-contrast #ck,
    html.a11y-contrast .gc,
    html.a11y-contrast .step,
    html.a11y-contrast .dl-item,
    html.a11y-contrast .tech-cell,
    html.a11y-contrast .faq-item,
    html.a11y-contrast .faq-a,
    html.a11y-contrast #a11y-panel,
    html.a11y-contrast .a11y-foot { background:#000!important; border-color:#444!important; box-shadow:none!important; }

    /* Bordi visibili sulle card */
    html.a11y-contrast .gc,
    html.a11y-contrast .dl-item,
    html.a11y-contrast .tech-cell,
    html.a11y-contrast .faq-item { border:1px solid #555!important; }

    /* Bottoni: bianco/nero per massimo contrasto */
    html.a11y-contrast button,
    html.a11y-contrast .ck-ok,
    html.a11y-contrast .ck-no,
    html.a11y-contrast .n-cta,
    html.a11y-contrast .h-btn,
    html.a11y-contrast .proc-btn { background:#fff!important; color:#000!important; border:2px solid #fff!important; }

    /* Linee decorative: giallo per massimo contrasto */
    html.a11y-contrast .gc::before,
    html.a11y-contrast .h-tag::before,
    html.a11y-contrast .ct-tag::before,
    html.a11y-contrast .ct-tag::after { background:#ffee00!important; }

    /* FAQ icon */
    html.a11y-contrast .faq-icon { background:transparent!important; border-color:#fff!important; }
    html.a11y-contrast .faq-icon line { stroke:#fff!important; }
    html.a11y-contrast .faq-item.open .faq-icon { background:#fff!important; }
    html.a11y-contrast .faq-item.open .faq-icon line { stroke:#000!important; }

    /* a11y widget stesso: mantieni leggibile */
    html.a11y-contrast #a11y-btn { background:var(--red,#A21A2D)!important; }
    html.a11y-contrast .a11y-head span { color:#aaa!important; }
    html.a11y-contrast .a11y-label { color:#fff!important; }
    html.a11y-contrast .a11y-ico { background:rgba(255,255,255,.1)!important; }
    html.a11y-contrast .a11y-track { background:#444!important; }
    html.a11y-contrast .a11y-sw input:checked + .a11y-track { background:var(--red,#A21A2D)!important; }
    html.a11y-contrast #a11y-reset { border-color:#555!important; color:#aaa!important; }
    html.a11y-contrast .a11y-gdpr { color:#666!important; }

    html.a11y-no-motion *, html.a11y-no-motion *::before, html.a11y-no-motion *::after {
      animation-duration:.001ms!important; animation-iteration-count:1!important;
      transition-duration:.001ms!important; scroll-behavior:auto!important;
    }
    html.a11y-links a { text-decoration:underline!important; }
    html.a11y-font, html.a11y-font body, html.a11y-font p, html.a11y-font li,
    html.a11y-font h1, html.a11y-font h2, html.a11y-font h3, html.a11y-font h4 {
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif!important;
      letter-spacing:.01em!important; line-height:1.65!important;
    }

    #a11y-btn {
      position:fixed; bottom:1.6rem; right:1.6rem; z-index:8900;
      width:46px; height:46px; border-radius:50%;
      background:var(--red,#A21A2D); border:none; cursor:pointer;
      box-shadow:0 3px 16px rgba(0,0,0,.25);
      display:flex; align-items:center; justify-content:center;
      transition:transform .22s,box-shadow .22s;
      -webkit-tap-highlight-color:transparent;
    }
    #a11y-btn:hover { transform:scale(1.07); box-shadow:0 5px 22px rgba(0,0,0,.3); }
    #a11y-btn:focus-visible { outline:2px solid #ffee00; outline-offset:3px; }
    #a11y-btn svg { width:20px; height:20px; display:block; }

    #a11y-panel {
      position:fixed; bottom:5.6rem; right:1.6rem; z-index:8900;
      width:272px; background:#faf7f2;
      border:1px solid rgba(13,10,8,.1); border-radius:12px;
      box-shadow:0 8px 36px rgba(0,0,0,.16);
      overflow:hidden;
      font-family:'DM Mono',monospace!important;
      transform:translateY(10px) scale(.97); opacity:0; pointer-events:none;
      transition:transform .22s cubic-bezier(.23,1,.32,1),opacity .22s;
    }
    #a11y-panel.open { transform:translateY(0) scale(1); opacity:1; pointer-events:auto; }

    .a11y-head {
      display:flex; align-items:center; gap:.55rem;
      padding:.95rem 1.1rem .8rem;
      border-bottom:1px solid rgba(13,10,8,.08);
    }
    .a11y-head svg { width:13px; height:13px; fill:var(--red,#A21A2D); flex-shrink:0; }
    .a11y-head span {
      font-family:'DM Mono',monospace!important; font-size:.56rem!important;
      letter-spacing:.26em!important; text-transform:uppercase!important;
      color:#5C5248!important; font-weight:400!important;
    }
    .a11y-rows { padding:.3rem 0; }
    .a11y-row {
      display:flex; align-items:center; justify-content:space-between;
      padding:.62rem 1.1rem; border-bottom:1px solid rgba(13,10,8,.05); gap:.6rem;
    }
    .a11y-row:last-of-type { border-bottom:none; }
    .a11y-label {
      display:flex; align-items:center; gap:.6rem;
      font-size:.64rem!important; color:#0D0A08!important;
      font-family:'DM Mono',monospace!important;
      letter-spacing:.04em!important; line-height:1.3!important; cursor:pointer;
    }
    .a11y-ico {
      width:28px; height:28px; border-radius:6px;
      background:rgba(162,26,45,.08);
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .a11y-ico svg { width:14px; height:14px; fill:var(--red,#A21A2D); display:block; }
    .a11y-sw { position:relative; width:34px; height:19px; flex-shrink:0; }
    .a11y-sw input { opacity:0; width:0; height:0; position:absolute; }
    .a11y-track {
      position:absolute; inset:0; background:#D8D2CA;
      border-radius:19px; cursor:pointer; transition:background .18s;
    }
    .a11y-track::before {
      content:''; position:absolute; left:2px; top:2px;
      width:15px; height:15px; background:#fff; border-radius:50%;
      transition:transform .18s; box-shadow:0 1px 3px rgba(0,0,0,.2);
    }
    .a11y-sw input:checked + .a11y-track { background:var(--red,#A21A2D); }
    .a11y-sw input:checked + .a11y-track::before { transform:translateX(15px); }
    .a11y-sw input:focus-visible + .a11y-track { outline:2px solid #ffee00; outline-offset:2px; }
    .a11y-foot {
      padding:.7rem 1.1rem .85rem;
      border-top:1px solid rgba(13,10,8,.07);
      background:rgba(13,10,8,.02);
    }
    #a11y-reset {
      width:100%; padding:.45rem;
      font-family:'DM Mono',monospace!important; font-size:.52rem!important;
      letter-spacing:.18em!important; text-transform:uppercase!important;
      background:transparent; border:1px solid rgba(13,10,8,.15);
      border-radius:5px; cursor:pointer; color:#5C5248!important;
      transition:background .18s,color .18s,border-color .18s; margin-bottom:.6rem;
    }
    #a11y-reset:hover { background:rgba(162,26,45,.06); border-color:var(--red,#A21A2D); color:var(--red,#A21A2D)!important; }
    .a11y-gdpr {
      font-size:.46rem!important; line-height:1.6!important;
      color:#9E9088!important; font-family:'DM Mono',monospace!important;
      letter-spacing:.02em!important;
    }
    @media(max-width:400px) { #a11y-panel { width:calc(100vw - 3.2rem); } }
  `;
  document.head.appendChild(style);

  /* ── ICONE SVG ── */
  const ICO = {
    // Testa widget: figura stilizzata accessibilità
    access: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="3.2" r="1.7" fill="currentColor"/><line x1="5.2" y1="7" x2="10.8" y2="7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="7" x2="8" y2="12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="10" x2="5.8" y2="13.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="10" x2="10.2" y2="13.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    // Testo grande: due "T" di dimensione diversa
    bigText: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="3.5" x2="9.5" y2="3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="5.75" y1="3.5" x2="5.75" y2="13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="10" y1="7.5" x2="15" y2="7.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><line x1="12.5" y1="7.5" x2="12.5" y2="13" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`,
    // Alto contrasto: cerchio diviso metà pieno
    contrast: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="5.8" stroke="currentColor" stroke-width="1.2"/><path d="M8 2.2a5.8 5.8 0 0 1 0 11.6V2.2Z" fill="currentColor"/></svg>`,
    // Riduci animazioni: due barre pause
    noMotion: `<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3.5" width="3.2" height="9" rx="1"/><rect x="9.8" y="3.5" width="3.2" height="9" rx="1"/></svg>`,
    // Sottolinea link: U con linea sotto
    underLinks: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 3.5v4.8a4 4 0 0 0 8 0V3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="2.5" y1="14" x2="13.5" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    // Font leggibile: "Aa" con serif vs sans
    readFont: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 13L5.5 3.5L9 13M3.2 10.2h5.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><line x1="11.5" y1="6.5" x2="11.5" y2="13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M11.5 8.5c0-1 .8-2 2-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="11.5" cy="11" r="1.8" stroke="currentColor" stroke-width="1.1"/></svg>`,
  };

  /* ── I18N ── */
  const A11Y_I18N = {
    it: { title:'Accessibilità', bigText:'Testo più grande', contrast:'Alto contrasto', noMotion:'Riduci animazioni', underLinks:'Sottolinea link', readFont:'Font leggibile', reset:'Ripristina tutto', gdpr:'Preferenze salvate localmente nel browser. Nessun cookie, nessun dato trasmesso a terze parti.', ariaBtn:'Accessibilità — apri impostazioni', ariaPanel:'Impostazioni di accessibilità' },
    en: { title:'Accessibility', bigText:'Larger text', contrast:'High contrast', noMotion:'Reduce motion', underLinks:'Underline links', readFont:'Readable font', reset:'Reset all', gdpr:'Preferences stored locally in browser. No cookies, no data sent to third parties.', ariaBtn:'Accessibility — open settings', ariaPanel:'Accessibility settings' },
    fr: { title:'Accessibilité', bigText:'Texte plus grand', contrast:'Contraste élevé', noMotion:'Réduire les animations', underLinks:'Souligner les liens', readFont:'Police lisible', reset:'Tout réinitialiser', gdpr:'Préférences enregistrées localement. Aucun cookie, aucune donnée transmise.', ariaBtn:'Accessibilité — ouvrir les paramètres', ariaPanel:'Paramètres d\'accessibilité' },
    de: { title:'Barrierefreiheit', bigText:'Größerer Text', contrast:'Hoher Kontrast', noMotion:'Animationen reduzieren', underLinks:'Links unterstreichen', readFont:'Lesbare Schrift', reset:'Alles zurücksetzen', gdpr:'Einstellungen lokal im Browser gespeichert. Keine Cookies, keine Daten an Dritte.', ariaBtn:'Barrierefreiheit — Einstellungen öffnen', ariaPanel:'Barrierefreiheit-Einstellungen' },
    es: { title:'Accesibilidad', bigText:'Texto más grande', contrast:'Alto contraste', noMotion:'Reducir animaciones', underLinks:'Subrayar enlaces', readFont:'Fuente legible', reset:'Restablecer todo', gdpr:'Preferencias guardadas localmente. Sin cookies, sin datos enviados a terceros.', ariaBtn:'Accesibilidad — abrir ajustes', ariaPanel:'Ajustes de accesibilidad' }
  };
  const curLang = (document.documentElement.lang || 'it').slice(0,2).toLowerCase();
  const t = A11Y_I18N[curLang] || A11Y_I18N.it;

  const FEATURES = [
    { key:'bigText',    label: t.bigText  },
    { key:'contrast',   label: t.contrast    },
    { key:'noMotion',   label: t.noMotion },
    { key:'underLinks', label: t.underLinks   },
    { key:'readFont',   label: t.readFont    },
  ];

  /* ── DOM ── */
  const btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.setAttribute('aria-label', t.ariaBtn);
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'a11y-panel');
  btn.innerHTML = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="10" cy="4" r="2.2" fill="#fff"/><line x1="6.5" y1="8.5" x2="13.5" y2="8.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><line x1="10" y1="8.5" x2="10" y2="14.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><line x1="10" y1="12.5" x2="7.5" y2="16.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><line x1="10" y1="12.5" x2="12.5" y2="16.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`;

  const panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', t.ariaPanel);

  let rows = '';
  FEATURES.forEach(f => {
    rows += `
      <div class="a11y-row">
        <label class="a11y-label" for="a11y-${f.key}">
          <span class="a11y-ico">${ICO[f.key]}</span>${f.label}
        </label>
        <label class="a11y-sw">
          <input type="checkbox" id="a11y-${f.key}" data-key="${f.key}"${state[f.key]?' checked':''}>
          <span class="a11y-track"></span>
        </label>
      </div>`;
  });

  panel.innerHTML = `
    <div class="a11y-head">${ICO.access}<span>${t.title}</span></div>
    <div class="a11y-rows">${rows}</div>
    <div class="a11y-foot">
      <button id="a11y-reset">${t.reset}</button>
      <p class="a11y-gdpr">${t.gdpr}</p>
    </div>`;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  /* ── LOGICA ── */
  let open = false;
  function togglePanel(force) {
    open = force !== undefined ? force : !open;
    btn.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('open', open);
    if (open) { const f = panel.querySelector('input'); if(f) setTimeout(()=>f.focus(),25); }
  }

  btn.addEventListener('click', () => togglePanel());
  document.addEventListener('pointerdown', e => {
    if (open && !panel.contains(e.target) && e.target !== btn) togglePanel(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { togglePanel(false); btn.focus(); }
  });
  panel.addEventListener('change', e => {
    const inp = e.target;
    if (!inp.dataset.key) return;
    state[inp.dataset.key] = inp.checked;
    save(state); apply();
  });
  document.getElementById('a11y-reset').addEventListener('click', () => {
    state = Object.assign({}, DEFAULTS);
    save(state);
    panel.querySelectorAll('input[type=checkbox]').forEach(cb => { cb.checked = false; });
    apply();
  });

  apply();
})();
