import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene, raycasterObjects, updatableMaterials } from "./scene.js";

export let room;

// Ref so main.js always reads the live AnimationMixer value
export const mixerRef = { value: null };

// ── Video textures ───────────────────────────────────────────────
const video = document.createElement("video");
video.src = "/night.mp4";
video.flipX = true;
video.loop = true;
video.muted = true; // Mute the video to allow autoplay
video.playsInline = true; // For iOS compatibility
video.autoplay = true; // Autoplay the video
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.rotation = Math.PI / 2; // Rotate the video texture to match the model's orientation
videoTexture.center.set(0.5, 0.5); // Center the texture
videoTexture.colorSpace = THREE.SRGBColorSpace; // Ensure the video texture uses the correct color space

// ── Atlas textures ───────────────────────────────────────────────
const textureMap = {
    first: {
        day: "/Textures/Day/DayAtlasSet1rebake.webp",
        night: "/Textures/Night/NightAtlasSet1rebake.webp",
    },

    second: {
        day: "/Textures/Day/DayAtlasSet2.webp",
        night: "/Textures/Night/NightAtlasSet2.webp",
    },

    third: {
        day: "/Textures/Day/DayAtlasSet3edited2.webp",
        night: "/Textures/Night/NightAtlasSet3edited2.webp",
    },
};

const loadedTextures = {
    day: {},
    night: {}, // populated lazily on first toggle
};

const textureLoader = new THREE.TextureLoader();

// Load only day textures upfront — night textures load on first toggle
Object.entries(textureMap).forEach(([key, paths]) => {
    const dayTexture = textureLoader.load(paths.day);
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    dayTexture.flipY = false;
    loadedTextures.day[key] = dayTexture;
});

// Called once on first toggle to fetch and inject night textures
function loadNightTextures() {
    return new Promise((resolve) => {
        let loaded = 0;
        const total = Object.keys(textureMap).length;
        Object.entries(textureMap).forEach(([key, paths]) => {
            const nightTexture = textureLoader.load(paths.night, () => {
                loaded++;
                if (loaded === total) resolve();
            });
            nightTexture.colorSpace = THREE.SRGBColorSpace;
            nightTexture.flipY = false;
            loadedTextures.night[key] = nightTexture;
        });
    });
}

// ── GLTF Model ───────────────────────────────────────────────────
const loader = new GLTFLoader();

loader.load("/portfolioWithoutMaterialsV14.glb", function (gltf) {
    room = gltf.scene;

    room.traverse((node) => {
        if (node.isMesh) {
            const textureKey = Object.keys(textureMap).find((key) => node.name.includes(key));

            // Only proceed if a texture key was found for this mesh
            if (textureKey) {
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        uDayTexture: { value: loadedTextures.day[textureKey] },
                        uNightTexture: { value: loadedTextures.night[textureKey] },
                        uMixRatio: { value: 0.0 }, // Start in day mode
                    },
                    vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;

            // FIX 2: Restructured the shader to match modern Three.js standards.
            // This ensures all skinning variables are declared and calculated correctly.
            #include <common>
            #include <uv_pars_vertex>
            #include <displacementmap_pars_vertex>
            #include <morphtarget_pars_vertex>
            #include <skinning_pars_vertex>
            #include <logdepthbuf_pars_vertex>
            #include <clipping_planes_pars_vertex>

            void main() {
              #include <uv_vertex>
              #include <beginnormal_vertex>
              #include <morphnormal_vertex>
              #include <skinbase_vertex>
              #include <skinnormal_vertex>
              #include <defaultnormal_vertex>
              vNormal = normalize( transformedNormal );

              #include <begin_vertex>
              #include <morphtarget_vertex>
              #include <skinning_vertex>
              #include <displacementmap_vertex>
              #include <project_vertex>
              #include <logdepthbuf_vertex>
              #include <clipping_planes_vertex>

              vUv = uv;
            }
          `,
                    fragmentShader: `
            uniform sampler2D uDayTexture;
            uniform sampler2D uNightTexture;
            uniform float uMixRatio;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
              vec4 dayColor = texture2D(uDayTexture, vUv);
              vec4 nightColor = texture2D(uNightTexture, vUv);
              vec4 finalColor = mix(dayColor, nightColor, uMixRatio);
              finalColor.rgb = pow(finalColor.rgb, vec3(1.0/2.2));
              gl_FragColor = finalColor;
            }
          `,
                });
                node.material = material;

                updatableMaterials.push(material);

            }

            if (node.name.includes("raycaster")) {
                raycasterObjects.push(node);
            }

            if (node.name === "window") {
                node.material = new THREE.MeshBasicMaterial({ map: videoTexture });
            }
        }
    });

    if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(room);
        mixerRef.value = mixer;
        // Play all animations found in the file
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
    }

    scene.add(room);
    window.room = room;
    let isNightMode = true;
    let nightTexturesLoaded = false;
    const toggleButton = document.getElementById("modeToggle");
    const switchimg = document.getElementById("switch");

    if (toggleButton) {
        toggleButton.addEventListener("click", async () => {
            isNightMode = !isNightMode;

            // Lazy-load night textures on very first toggle
            if (!nightTexturesLoaded && !isNightMode) {
                console.log("Lazy-loading night textures...");
                await loadNightTextures();
                // Inject the now-loaded night textures into existing materials
                updatableMaterials.forEach((material) => {
                    const key = Object.keys(textureMap).find((k) =>
                        material.uniforms.uDayTexture.value === loadedTextures.day[k]
                    );
                    if (key) material.uniforms.uNightTexture.value = loadedTextures.night[key];
                });
                nightTexturesLoaded = true;
                console.log("Night textures loaded and injected.");
            }

            console.log(`Switching to ${isNightMode ? "Night" : "Day"} mode. Updating ${updatableMaterials.length} materials.`);

            updatableMaterials.forEach((material) => {
                gsap.to(material.uniforms.uMixRatio, {
                    value: isNightMode ? 0.0 : 1.0,
                    duration: 1.5,
                    ease: "power1.inOut",
                });
            });

            gsap.to(switchimg, {
                rotate: isNightMode ? 0 : 90,
                duration: 1.5,
                ease: "power1.inOut"
            });
        });

        room.traverse((node) => {
            if (node.name === "window") {
                node.material = new THREE.MeshBasicMaterial({
                    map: videoTexture
                });
            }
        });
    }
});
