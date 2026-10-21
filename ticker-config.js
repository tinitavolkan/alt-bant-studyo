(function (root) {
  'use strict';
  const defaults = {
    title: 'YAYIN KURALLARI',
    text: 'Berkan Kutlu övmek\nKaan Ayhan övmek\nZaha övmek!!!\nGabriel Sara övmek\nSane övmek\nİlkay Gündoğan övmek YASAKTIR.\nGünay övmek?\nSingo Nerede Demek YASAKTIR.\nGakpo övmek yasak.',
    speed: 120, fontSize: 30, height: 88, radius: 12,
    accent: '#ffce45', textColor: '#f7f8fb', labelColor: '#11151c',
    background: '#0c0f16', opacity: 94, direction: 'left', font: 'segoe', showLabel: true
  };
  function normalize(input) {
    const d = defaults, s = input && typeof input === 'object' ? input : {};
    const number = (key, min, max) => {
      const n = typeof s[key] === 'number' ? s[key] : NaN;
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d[key];
    };
    const color = key => typeof s[key] === 'string' && /^#[0-9a-f]{6}$/i.test(s[key]) ? s[key] : d[key];
    return {
      title: typeof s.title === 'string' ? s.title.slice(0, 50) : d.title,
      text: typeof s.text === 'string' ? s.text.slice(0, 4000) : d.text,
      speed: number('speed', 0, 300), fontSize: number('fontSize', 18, 64),
      height: number('height', 70, 160), radius: number('radius', 0, 32),
      accent: color('accent'), textColor: color('textColor'), labelColor: color('labelColor'), background: color('background'),
      opacity: number('opacity', 0, 100), direction: s.direction === 'right' ? 'right' : 'left',
      font: ['segoe', 'arial', 'verdana', 'georgia'].includes(s.font) ? s.font : d.font,
      showLabel: typeof s.showLabel === 'boolean' ? s.showLabel : d.showLabel
    };
  }
  function encode(settings) {
    const bytes = new TextEncoder().encode(JSON.stringify(normalize(settings)));
    return btoa(Array.from(bytes, b => String.fromCharCode(b)).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decode(value) {
    if (!value || value.length > 40000 || !/^[A-Za-z0-9_-]+$/.test(value)) throw Error('Geçersiz bağlantı');
    const bytes = Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw Error('Geçersiz ayarlar');
    return normalize(parsed);
  }
  function fromHash(hash) {
    const value = new URLSearchParams(hash.replace(/^#/, '')).get('settings');
    return value ? decode(value) : null;
  }
  root.TickerConfig = {defaults, normalize, encode, decode, fromHash};
})(globalThis);
