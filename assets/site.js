(() => {
  'use strict';
  const root = document.documentElement;
  const controls = [...document.querySelectorAll('[data-set-language]')];
  const key = 'campus-website-language';
  const valid = value => value === 'zh' || value === 'en';
  let saved;
  try { saved = localStorage.getItem(key); } catch (_) { /* Private storage may be unavailable. */ }
  const requested = new URL(location.href).searchParams.get('lang');
  const initial = valid(requested) ? requested : valid(saved) ? saved : navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  function applyLanguage(language, updateAddress = false) {
    root.dataset.language = language;
    root.lang = language === 'zh' ? 'zh-Hans' : 'en';
    document.title = document.body.dataset[language === 'zh' ? 'titleZh' : 'titleEn'];
    document.querySelectorAll('[data-label-zh]').forEach(node => node.setAttribute('aria-label', node.dataset[language === 'zh' ? 'labelZh' : 'labelEn']));
    document.querySelectorAll('[data-alt-zh]').forEach(node => node.setAttribute('alt', node.dataset[language === 'zh' ? 'altZh' : 'altEn']));
    controls.forEach(control => {
      control.setAttribute('aria-current', String(control.dataset.setLanguage === language));
    });
    // URL preference also survives a blocked storage API and direct deep-link visits.
    for (const link of document.querySelectorAll('a[href]')) {
      const raw = link.getAttribute('href');
      if (link.hasAttribute('data-set-language') || raw.startsWith('#') || raw.startsWith('mailto:')) continue;
      const url = new URL(raw, location.href);
      if (url.origin !== location.origin) continue;
      url.searchParams.set('lang', language);
      link.href = url.href;
    }
    try { localStorage.setItem(key, language); } catch (_) { /* Keep the current page functional. */ }
    if (updateAddress) {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      try { history.replaceState(null, '', url); } catch (_) { /* File previews may restrict history. */ }
    }
  }
  controls.forEach(control => control.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    applyLanguage(control.dataset.setLanguage, true);
  }));
  applyLanguage(initial);
})();
