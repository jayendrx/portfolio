import gsap from "gsap";
import { camera, renderer, raycaster, pointer, raycasterObjects } from "./scene.js";

const isMobile = window.innerWidth <= 768;

// ── Window resize ────────────────────────────────────────────────
window.addEventListener("resize", () => {
    console.log("resizing");
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Keep pixel ratio consistent with initial setup
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    // controls.update();
});

if (!isMobile) {
    // ── Parallax effect ──────────────────────────────────────────────
    // Skipped on mobile: touch screens don't fire mousemove,
    // and the GSAP tween would run pointlessly every pointer event.
    window.addEventListener("mousemove", (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (window.room) {
            gsap.to(window.room.rotation, {
                x: y * 0.05,
                y: x * 0.05,
                duration: 0.5,
                ease: "power2.out",
            });
        }
    });

    // ── Raycaster pointer tracking ───────────────────────────────────
    // Skipped on mobile: cursor changes are meaningless on touch.
    window.addEventListener("mousemove", (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
}

// ── Raycaster cursor update (called each frame) ──────────────────
let hoveredObject = null; // track which object is currently hovered

export function updateRaycaster() {
    // No-op on mobile — saves a raycaster intersect check every single frame
    if (isMobile) return;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(raycasterObjects, true);
    const hit = intersects.length > 0 ? intersects[0].object : null;

    if (hit !== hoveredObject) {
        // ── Mouse leave: restore previous object ─────────────────
        if (hoveredObject) {
            gsap.to(hoveredObject.scale, {
                x: hoveredObject.userData._baseScale.x,
                y: hoveredObject.userData._baseScale.y,
                z: hoveredObject.userData._baseScale.z,
                duration: 0.35,
                ease: "power2.out",
            });
            gsap.to(hoveredObject.rotation, {
                y: hoveredObject.userData._baseRotation.y,
                duration: 0.35,
                ease: "power2.out",
            });
            document.body.style.cursor = "default";
        }

        // ── Mouse enter: animate new object ──────────────────────
        if (hit) {
            // Store baseline only once (so repeated hovers always restore correctly)
            if (!hit.userData._baseScale) {
                hit.userData._baseScale = hit.scale.clone();
                hit.userData._baseRotation = hit.rotation.clone();
            }
            gsap.to(hit.scale, {
                x: hit.userData._baseScale.x * 1.12,
                y: hit.userData._baseScale.y * 1.12,
                z: hit.userData._baseScale.z * 1.12,
                duration: 0.35,
                ease: "back.out(1.7)",
            });
            gsap.to(hit.rotation, {
                y: hit.userData._baseRotation.y - 0.15,
                duration: 0.35,
                ease: "power2.out",
            });
            document.body.style.cursor = "pointer";
        }

        hoveredObject = hit;
    }
}

