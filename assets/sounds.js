'use strict';

// Short, opt-in feedback. Nothing is fetched or played before a user interaction.
(() => {
  const button = document.querySelector('.sound-toggle');
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!button || !AudioContextClass) return;

  const base = new URL('./audio/', document.currentScript.src);
  const buffers = new Map();
  const activeSources = new Set();
  const preferenceKey = 'portfolio-sound';
  let enabled = false;
  let context = null;
  let gain = null;
  let loading = null;
  let requestId = 0;
  let lastPlayedAt = -Infinity;
  try { enabled = localStorage.getItem(preferenceKey) === 'on'; } catch {}

  function updateButton() {
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? 'Mute sound effects' : 'Enable sound effects';
  }

  function rememberPreference() {
    try { localStorage.setItem(preferenceKey, enabled ? 'on' : 'off'); } catch {}
  }

  function stopSounds() {
    requestId += 1;
    for (const source of activeSources) {
      try { source.stop(); } catch {}
      source.disconnect();
    }
    activeSources.clear();
  }

  function prepareAudio() {
    if (!context || context.state === 'closed') {
      context = new AudioContextClass({ latencyHint: 'interactive' });
      gain = context.createGain();
      gain.gain.value = 0.18;
      gain.connect(context.destination);
    }
    // Resume inside the click handler, before any asset-loading awaits.
    const resumed = context.resume();
    if (!loading) {
      loading = Promise.all(['click', 'navigate', 'toggle'].map(async (name) => {
        const response = await fetch(new URL(`${name}.mp3`, base));
        if (!response.ok) throw new Error('Sound asset unavailable');
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        buffers.set(name, buffer);
      })).catch((error) => { loading = null; throw error; });
    }
    return Promise.all([resumed, loading]);
  }

  async function play(name) {
    if (!enabled || document.hidden) return;
    const id = ++requestId;
    const requestedAt = performance.now();
    try {
      await prepareAudio();
      const now = performance.now();
      // Drop stale clicks and prevent queued sounds from firing after mute.
      if (!enabled || document.hidden || id !== requestId || now - requestedAt > 300 || now - lastPlayedAt < 60) return;
      const buffer = buffers.get(name);
      if (!buffer || context.state !== 'running') return;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(gain);
      source.onended = () => { activeSources.delete(source); source.disconnect(); };
      activeSources.add(source);
      source.start();
      lastPlayedAt = now;
    } catch {
      if (id !== requestId) return;
      enabled = false;
      stopSounds();
      updateButton();
      rememberPreference();
    }
  }

  button.hidden = false;
  updateButton();
  button.addEventListener('click', () => {
    enabled = !enabled;
    stopSounds();
    updateButton();
    rememberPreference();
    if (enabled) void play('toggle');
    else if (context) void context.suspend().catch(() => {});
  });

  document.addEventListener('click', (event) => {
    if (!enabled || !event.isTrusted || event.defaultPrevented || !(event.target instanceof Element)) return;
    const control = event.target.closest('a[href], button');
    if (!control || control === button || control.disabled || control.getAttribute('aria-disabled') === 'true') return;
    if (control.matches('.theme-toggle, .menu-toggle, .motion-toggle')) void play('toggle');
    else if (control.matches('a[href^="#"]')) void play('navigate');
    else void play('click');
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    stopSounds();
    if (context) void context.suspend().catch(() => {});
  });
  window.addEventListener('pagehide', stopSounds);
})();
