import * as THREE from './vendor/three.module.min.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

export function initSculpture() {
  const host = document.querySelector('#sculpture');
  const visual = document.querySelector('.hero-visual');
  const motionButton = document.querySelector('.motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  let context;
  try { context = canvas.getContext('webgl2', { alpha: true, antialias: true }); } catch { return; }
  if (!context) return;

  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.z = 6.1;
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, 0.04);
  scene.environment = environmentTarget.texture;
  environment.dispose();
  pmrem.dispose();

  const geometry = new THREE.TorusKnotGeometry(1, 0.33, 192, 40, 2, 3);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xc7e7a1, metalness: 0.9, roughness: 0.23,
    clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 1.4,
  });
  const sculpture = new THREE.Mesh(geometry, material);
  sculpture.rotation.set(0.65, 0.25, -0.4);
  scene.add(sculpture);
  const light = new THREE.DirectionalLight(0xe2ffb4, 4);
  light.position.set(-3, 4, 5);
  scene.add(light);
  const rimLight = new THREE.DirectionalLight(0xf6f9ef, 3);
  rimLight.position.set(4, -2, 3);
  scene.add(rimLight);
  host.appendChild(canvas);

  let userPaused = reducedMotion.matches;
  let inView = true;
  let frameId = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;
  let disposed = false;
  let contextLost = false;

  function render() { if (!disposed && !contextLost) renderer.render(scene, camera); }
  function resize() {
    if (disposed || contextLost) return;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = 6.1 / Math.min(1, camera.aspect);
    camera.updateProjectionMatrix();
    render();
  }
  function updateMotionButton() {
    motionButton.setAttribute('aria-pressed', String(userPaused));
    const label = `${userPaused ? 'Play' : 'Pause'} sculpture animation`;
    motionButton.setAttribute('aria-label', label);
    motionButton.title = label;
  }
  function animate(time) {
    frameId = 0;
    if (disposed || contextLost || userPaused || document.hidden || !inView) return;
    const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 0.05) : 0;
    if (!lastFrame || time - lastFrame >= 1000 / 30) {
      elapsed += delta;
      lastFrame = time;
      const pointerBlend = 1 - Math.exp(-delta * 6);
      pointerX += (targetPointerX - pointerX) * pointerBlend;
      pointerY += (targetPointerY - pointerY) * pointerBlend;
      sculpture.rotation.y = 0.25 + elapsed * 0.13 + pointerX * 0.25;
      sculpture.rotation.x = 0.65 + pointerY * 0.16;
      sculpture.position.y = Math.sin(elapsed * 0.7) * 0.04;
      render();
    }
    frameId = requestAnimationFrame(animate);
  }
  function syncAnimation() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrame = 0;
    if (!disposed && !contextLost && !userPaused && !document.hidden && inView) frameId = requestAnimationFrame(animate);
    else render();
  }
  function onPointerMove(event) {
    if (userPaused || reducedMotion.matches) return;
    const bounds = visual.getBoundingClientRect();
    targetPointerX = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
    targetPointerY = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
  }
  function resetPointer() { targetPointerX = 0; targetPointerY = 0; }
  function onMotionChange() {
    userPaused = reducedMotion.matches;
    resetPointer();
    updateMotionButton();
    syncAnimation();
  }
  function onMotionClick() { userPaused = !userPaused; updateMotionButton(); syncAnimation(); }
  function onThemeChange() {
    material.color.set(document.documentElement.dataset.theme === 'light' ? 0x99b473 : 0xc7e7a1);
    render();
  }
  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    syncAnimation();
    visual.classList.remove('has-webgl');
    motionButton.hidden = true;
  }
  function onContextRestored() {
    contextLost = false;
    resize();
    visual.classList.add('has-webgl');
    motionButton.hidden = false;
    syncAnimation();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibilityObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncAnimation(); });
  visibilityObserver.observe(visual);
  visual.addEventListener('pointermove', onPointerMove);
  visual.addEventListener('pointerleave', resetPointer);
  motionButton.addEventListener('click', onMotionClick);
  reducedMotion.addEventListener('change', onMotionChange);
  document.addEventListener('visibilitychange', syncAnimation);
  window.addEventListener('portfolio-theme-change', onThemeChange);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  window.addEventListener('pageshow', syncAnimation);
  window.addEventListener('pagehide', (event) => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    if (event.persisted) return;
    disposed = true;
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    geometry.dispose();
    material.dispose();
    environmentTarget.dispose();
    renderer.dispose();
  });

  onThemeChange();
  resize();
  visual.classList.add('has-webgl');
  motionButton.hidden = false;
  updateMotionButton();
  syncAnimation();
}
