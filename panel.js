'use strict';
(() => {
  const C = TickerConfig, KEY = 'obs-ticker-studio-v1';
  const byId = id => document.getElementById(id);
  const ids = Object.keys(C.defaults);
  const ranges = {speed: ' px/sn', fontSize: ' px', height: ' px', radius: ' px', opacity: '%'};
  let settings = C.normalize(C.defaults), hasStorage = true, saveTimer;
  try {
    const linked = C.fromHash(location.hash);
    const saved = localStorage.getItem(KEY);
    settings = linked || (saved ? C.normalize(JSON.parse(saved)) : settings);
  } catch {
    byId('copyState').textContent = 'Kayıtlı ayarlar veya bağlantı okunamadı. Varsayılanlar açıldı.';
  }
  function fill() {
    ids.forEach(id => { if (typeof settings[id] === 'boolean') byId(id).checked = settings[id]; else byId(id).value = settings[id]; });
  }
  function read() {
    const values = {};
    ids.forEach(id => {
      const el = byId(id);
      values[id] = el.type === 'checkbox' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
    });
    settings = C.normalize(values);
  }
  function url(path) {
    const target = new URL(path, location.href);
    target.search = '';
    target.hash = 'settings=' + C.encode(settings);
    return target.href;
  }
  function update() {
    read();
    Object.entries(ranges).forEach(([key, unit]) => byId(key + 'Value').value = settings[key] + unit);
    byId('count').textContent = settings.text.length + ' / 4000';
    byId('obsUrl').value = url('overlay.html');
    byId('openOverlay').href = byId('obsUrl').value;
    byId('copy').disabled = !settings.text.trim();
    byId('preview').contentWindow.postMessage({type: 'ticker-preview', settings}, location.origin);
    byId('saveState').textContent = 'Kaydediliyor…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(settings)); hasStorage = true; }
      catch { hasStorage = false; }
      byId('saveState').textContent = hasStorage ? 'Bu tarayıcıda kaydedildi' : 'Ayar bağlantısını kaydet';
      // Makes a refresh retain the current state even when browser storage is blocked.
      try { history.replaceState(null, '', url('panel.html')); } catch { /* storage-independent links still work */ }
    }, 250);
  }
  async function copy(value, message) {
    byId('manualCopy').hidden = true;
    try {
      await navigator.clipboard.writeText(value);
      byId('copyState').textContent = message;
    } catch {
      const manual = byId('manualCopy');
      manual.hidden = false;
      manual.value = value;
      manual.focus();
      manual.select();
      byId('copyState').textContent = 'Bağlantı seçildi. Ctrl+C (Mac: ⌘C) ile kopyala.';
    }
  }
  byId('controls').addEventListener('submit', e => e.preventDefault());
  byId('controls').addEventListener('input', () => {
    byId('copyState').textContent = 'Değişiklikler önizlemede. OBS’e aktarmak için yeni bağlantıyı kopyala.';
    update();
  });
  byId('copy').addEventListener('click', () => copy(url('overlay.html'), 'OBS bağlantısı kopyalandı. OBS kaynağının URL alanına yapıştır.'));
  byId('copyEditor').addEventListener('click', () => copy(url('panel.html'), 'Ayar bağlantısı kopyalandı. Kaydederek başka bilgisayarda da düzenleyebilirsin.'));
  byId('import').addEventListener('click', () => {
    try {
      const imported = C.fromHash(new URL(byId('importUrl').value.trim()).hash);
      if (!imported) throw Error('Ayar yok');
      settings = imported;
      fill(); update();
      byId('importState').textContent = 'Ayarlar yüklendi.';
    } catch { byId('importState').textContent = 'Geçerli bir stüdyo OBS veya ayar bağlantısı yapıştır.'; }
  });
  byId('reset').addEventListener('click', () => {
    settings = C.normalize(C.defaults); fill(); update();
    byId('copyState').textContent = 'Varsayılan ayarlar yüklendi.';
  });
  const preview = byId('preview'), wrap = byId('frameWrap');
  function resizePreview() { const scale = wrap.clientWidth / 1920; preview.style.transform = `scale(${scale})`; wrap.style.height = 200 * scale + 'px'; }
  new ResizeObserver(resizePreview).observe(wrap);
  preview.addEventListener('load', () => preview.contentWindow.postMessage({type: 'ticker-preview', settings}, location.origin));
  fill(); update(); resizePreview();
})();
