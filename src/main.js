import gsap from "gsap";
import "./animations.js";
import "./model.js";
import "./events.js";
import { scene, camera, renderer, clock } from "./scene.js";
import { mixerRef } from "./model.js";
import { updateRaycaster } from "./events.js";
import { typeLine } from "./animations.js";



// ── Boot ─────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  typeLine();
});

// ── Animation loop ────────────────────────────────────────────────
function animate() {
  updateRaycaster();

  const delta = clock.getDelta();
  if (mixerRef.value) mixerRef.value.update(delta);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();


