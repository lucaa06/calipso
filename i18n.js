/**
 * Calipso i18n Engine
 * Detects language via IP (ipapi.co) → browser → default IT
 * Applies translations from /lang/{locale}.json
 * Injects language switcher in navbar
 */

(function () {
  'use strict';

  /* ── CONFIG ── */
  const SUPPORTED = ['it', 'en', 'es', 'fr', 'de'];
  const DEFAULT_LANG = 'it';
  const STORAGE_KEY = 'calipso_lang';

  const LANG_LABELS = { it: 'IT', en: 'EN', es: 'ES', fr: 'FR', de: 'DE' };
  const LANG_NAMES  = { it: 'Italiano', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch' };

  /* IP → country → language map */
  const COUNTRY_LANG = {
    IT:'it', SM:'it', VA:'it',
    US:'en', GB:'en', AU:'en', CA:'en', NZ:'en', IE:'en', SG:'en', PH:'en', IN:'en', ZA:'en', NG:'en', GH:'en', KE:'en', UG:'en', TZ:'en', ZW:'en', BW:'en', NA:'en',
    ES:'es', MX:'es', AR:'es', CO:'es', PE:'es', VE:'es', CL:'es', EC:'es', GT:'es', CU:'es', BO:'es', DO:'es', HN:'es', PY:'es', SV:'es', NI:'es', CR:'es', PA:'es', UY:'es',
    FR:'fr', BE:'fr', CH:'fr', LU:'fr', MC:'fr', SN:'fr', CI:'fr', CM:'fr', ML:'fr', BF:'fr', MG:'fr', TN:'fr', MA:'fr', DZ:'fr', HT:'fr',
    DE:'de', AT:'de', LI:'de'
  };

  /* ── STATE ── */
  let currentLang = DEFAULT_LANG;
  let translations = {};

  /* ── DETECT LANGUAGE ── */
  async function detectLanguage() {
    // 1. Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    // 2. Try IP geolocation (free, no key required)
    try {
      const resp = await Promise.race([
        fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout ? AbortSignal.timeout(2500) : undefined }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500))
      ]);
      const data = await resp.json();
      const country = (data.country_code || '').toUpperCase();
      const lang = COUNTRY_LANG[country];
      if (lang && SUPPORTED.includes(lang)) return lang;
    } catch (_) { /* silently fall through */ }

    // 3. Browser language
    const browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browserLang)) return browserLang;

    // 4. Default
    return DEFAULT_LANG;
  }

  /* ── LOAD TRANSLATIONS ── */
  async function loadTranslations(lang) {
    try {
      const resp = await fetch(`lang/${lang}.json`);
      if (!resp.ok) throw new Error('not found');
      return await resp.json();
    } catch (_) {
      if (lang !== DEFAULT_LANG) return loadTranslations(DEFAULT_LANG);
      return {};
    }
  }

  /* ── APPLY TRANSLATIONS ── */
  function applyTranslations(t) {
    // Update html lang attribute
    if (t['html.lang']) document.documentElement.lang = t['html.lang'];

    // Update meta tags
    if (t['meta.title']) document.title = t['meta.title'];
    setMeta('name', 'description', t['meta.description']);
    setMeta('name', 'keywords', t['meta.keywords']);
    setMeta('property', 'og:title', t['meta.title']);
    setMeta('property', 'og:description', t['meta.description']);
    setMeta('property', 'twitter:title', t['meta.title']);
    setMeta('property', 'twitter:description', t['meta.description']);

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        // Preserve child elements like <strong>, <a>, <span> when using innerHTML
        el.innerHTML = t[key];
      }
    });

    // Update data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });
  }

  function setMeta(attr, val, content) {
    if (!content) return;
    const el = document.querySelector(`meta[${attr}="${val}"]`);
    if (el) el.setAttribute('content', content);
  }

  /* ── BUILD LANGUAGE SWITCHER ── */
  function buildSwitcher(activeLang) {
    const container = document.querySelector('.n-lang-switcher');
    if (!container) return;

    container.innerHTML = '';

    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.setAttribute('aria-label', 'Select language');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `
      <svg class="lang-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span class="lang-code">${LANG_LABELS[activeLang]}</span>
      <svg class="lang-chevron" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
        <path d="M1 1l4 4 4-4"/>
      </svg>
    `;

    const dropdown = document.createElement('ul');
    dropdown.className = 'lang-dropdown';
    dropdown.setAttribute('role', 'listbox');

    SUPPORTED.forEach(lang => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', lang === activeLang ? 'true' : 'false');
      li.className = 'lang-option' + (lang === activeLang ? ' active' : '');
      li.innerHTML = `<span class="lang-opt-code">${LANG_LABELS[lang]}</span><span class="lang-opt-name">${LANG_NAMES[lang]}</span>`;
      li.addEventListener('click', () => setLanguage(lang));
      dropdown.appendChild(li);
    });

    container.appendChild(btn);
    container.appendChild(dropdown);

    // Toggle dropdown
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on outside click
    document.addEventListener('click', () => {
      container.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  /* ── SET LANGUAGE ── */
  async function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);
    currentLang = lang;

    // Close dropdown if open
    const switcher = document.querySelector('.n-lang-switcher');
    if (switcher) switcher.classList.remove('open');

    // Load + apply
    translations = await loadTranslations(lang);
    applyTranslations(translations);

    // Rebuild switcher active state
    buildSwitcher(lang);
  }

  /* ── INIT ── */
  async function init() {
    // Build switcher placeholder immediately (skeleton)
    const switcher = document.querySelector('.n-lang-switcher');
    if (switcher) switcher.innerHTML = `<div class="lang-skeleton"></div>`;

    const lang = await detectLanguage();
    currentLang = lang;
    translations = await loadTranslations(lang);
    applyTranslations(translations);
    buildSwitcher(lang);
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose API */
  window.CalipsoI18n = { setLanguage, getCurrentLang: () => currentLang };

})();
