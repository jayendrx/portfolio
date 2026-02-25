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
export function updateRaycaster() {
    // No-op on mobile — saves a raycaster intersect check every single frame
    if (isMobile) return;

    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(raycasterObjects);

    for (let i = 0; i < intersects.length; i++) {

    }
    if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
    } else {
        document.body.style.cursor = "default";
    }
}

