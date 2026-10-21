'use strict';
(() => {
  const C = TickerConfig;
  const band = document.getElementById('band'), label = document.getElementById('label');
  const track = document.getElementById('track'), windowEl = document.getElementById('window');
  let settings = C.normalize(C.defaults), generation = 0;
  const fonts = {segoe: '"Segoe UI", Arial, sans-serif', arial: 'Arial, sans-serif', verdana: 'Verdana, sans-serif', georgia: 'Georgia, serif'};
  function read() {
    try { settings = C.fromHash(location.hash) || C.normalize(C.defaults); }
    catch { settings = C.normalize(C.defaults); }
    render();
  }
  async function render() {
    const turn = ++generation, s = settings;
    band.style.setProperty('--accent', s.accent);
    band.style.setProperty('--label-color', s.labelColor);
    band.style.setProperty('--label-size', Math.min(32, s.fontSize * .84) + 'px');
    band.style.height = s.height + 'px';
    band.style.borderRadius = s.radius + 'px';
    const rgb = s.background.match(/[a-f0-9]{2}/gi).map(v => parseInt(v, 16));
    band.style.background = `rgba(${rgb.join(',')},${s.opacity / 100})`;
    band.style.fontFamily = fonts[s.font];
    band.style.color = s.textColor;
    band.style.fontSize = s.fontSize + 'px';
    label.hidden = !s.showLabel || !s.title.trim();
    document.getElementById('title').textContent = s.title;
    track.style.animation = 'none';
    track.style.visibility = 'hidden';
    track.replaceChildren();
    const group = document.createElement('div');
    group.className = 'group';
    for (const line of s.text.split(/\r?\n/).map(v => v.trim()).filter(Boolean)) {
      const item = document.createElement('span');
      item.className = 'item';
      line.split(/(yasaktır\.?|YASAKTIR\.?|yasak\.?)/gi).forEach((part, i) => {
        const span = document.createElement('span');
        span.textContent = part;
        if (i % 2) span.className = 'warning';
        item.append(span);
      });
      group.append(item);
    }
    track.append(group);
    await document.fonts.ready;
    if (turn !== generation) return;
    const distance = group.getBoundingClientRect().width;
    if (distance > 0) {
      const count = Math.ceil(windowEl.clientWidth / distance) + 1;
      for (let i = 0; i < count; i++) {
        const copy = group.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        track.append(copy);
      }
      track.style.setProperty('--distance', distance + 'px');
      // Layout flush resets an animation after changes.
      void track.offsetWidth;
      if (s.speed > 0) track.style.animation = `scroll ${distance / s.speed}s linear infinite ${s.direction === 'right' ? 'reverse' : 'normal'}`;
    }
    track.style.visibility = 'visible';
  }
  addEventListener('hashchange', read);
  addEventListener('resize', render);
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'ticker-preview') return;
    settings = C.normalize(event.data.settings);
    render();
  });
  read();
})();
