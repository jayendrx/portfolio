import * as THREE from "three";

export const canvas = document.getElementById("canvas");
export const clock = new THREE.Clock();
export const raycaster = new THREE.Raycaster();
export const pointer = new THREE.Vector2();
export const raycasterObjects = [];
export const updatableMaterials = [];

// Scene
export const scene = new THREE.Scene();

// Camera
export const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);
camera.position.set(-1.264014516098957, 1.3548963900538047, 1.418463466599842);
camera.rotation.set(
    -0.2187101620325432,
    0.29768332784825363,
    0.06509972494815654
);

// Renderer
const isMobile = window.innerWidth <= 768;

export const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile, // skip antialias on mobile for perf
    powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Fix #4: cap pixel ratio at 2 (was uncapped — phones with 3x DPR rendered 9x the pixels)
// Fix #5: on mobile drop further to 1x to cut GPU workload significantly
renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0000000, 1);

// Fix #5: reduce camera far plane on mobile (less geometry to process per frame)
if (isMobile) {
    camera.far = 100;
    camera.updateProjectionMatrix();
}
