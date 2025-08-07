import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
gsap.registerPlugin(TextPlugin, ScrollTrigger);

const canvas = document.getElementById("canvas");
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const raycasterObjects = [];
const updatableMaterials = [];

let room;
let mixer;

//scroll set
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

//create a scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
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


//loading screen and transition to home screen
const bootLines = [
  "JayOS 98 [Version 1.0.0]",
  "(c) 2004-2025 Jay. Your friendly neighbourhood developer.",
  " ",
  "Initializing creativity modules...",
  "Loading 3D portfolio interface...",
  "Wait this is my fav song...",
  "Ugghhh okayy, back to work...",
  "Loading assets... please wait.",
  "Welcome, human. Launching...",
];

const homeLines = [
  "Welcome to my portfolio!",
  "Explore my projects, skills, and experiences.",
  "Scroll down to continue.",
  "Hello! I am Jayendra",
];
let currentLineHome = 0;
const homeText = document.getElementById("homeText");
const home = document.getElementById("welcome");

let currentLineBoot = 0;
const bootText = document.getElementById("bootText");
const loadingScreen = document.getElementById("loadingScreen");


function typelinehome() {
  if (currentLineHome < homeLines.length) {
    gsap.to(homeText, {
      duration: 2,
      text: homeLines[currentLineHome],
      ease: "power1.inOut",
      onComplete: () => {
        currentLineHome++;
        setTimeout(typelinehome, 1000);
      },
    });
  } else {
    gsap.to(home, {
      duration: 1,
      height: 90,
      ease: "power1.inOut",
      // onComplete: () => {
      //   gsap.to(button, {
      //     duration: 1,
      //     marginLeft: 1050,
      //     ease: "power1.inOut",
      //   });
      // },
    });
  }
}

function typeLine() {
  if (currentLineBoot < bootLines.length) {
    // Create a new line element for this boot line
    const lineEl = document.createElement("div");
    lineEl.style.whiteSpace = "pre"; // preserve spaces
    bootText.appendChild(lineEl);

    // Animate this line's text with GSAP TextPlugin
    gsap.to(lineEl, {
      duration: 1,
      text: bootLines[currentLineBoot],
      ease: "none",
      onComplete: () => {
        currentLineBoot++;
        setTimeout(typeLine, 200); // Next line after a delay
      },
    });
  } else {
    setTimeout(() => {
      gsap.to(loadingScreen, {
        duration: 2,
        opacity: 0,
        onComplete: () => {
          loadingScreen.style.display = "none"; // Hide the loading screen after fade out

          gsap.to(camera.position, {
            x: -2.0703035128665155,
            y: 2,
            z: 7.916248299201015,
            duration: 4,
            ease: "power2.inOut",
          });

          gsap.to(camera.rotation, {
            x: -0.0187101620325432,
            y: -0.09768332784825363,
            z: 0,
            duration: 2,
            ease: "power1.inOut",
          });

          typelinehome();
        },
      });
    }, 1000);
  }
}

//home to about animation

const positionAndRotation = [
  {
    id: "home",
    iPosi: { x: -2.070304, y: 2, z: 7.916248 },
    fPosi: { x: -2.070304, y: 2, z: 7.916248 },
    iRot: { x: -0.01871, y: -0.097683, z: 0 },
    fRot: { x: -0.01871, y: -0.097683, z: 0 },
  },
  {
    id: "about",
    iPosi: { x: -2.070304, y: 2, z: 7.916248 },
    fPosi: { x: -1.5, y: 1.5, z: 4 },
    iRot: { x: -0.01871, y: -0.097683, z: 0 },
    fRot: { x: 0, y: -0.2, z: 0 },
  },
  {
    id: "projects",
    iPosi: { x: -1.5, y: 1.5, z: 4 },
    fPosi: { x: -0.5, y: 0.7, z: 3 },
    iRot: { x: 0, y: -0.2, z: 0 },
    fRot: { x: 0, y: -0.3, z: 0 },
  },
  {
    id: "skills",
    iPosi: { x: -0.5, y: 0.7, z: 3 },
    fPosi: { x: -3.7, y: 3, z: 2.4 },
    iRot: { x: 0, y: -0.3, z: 0 },
    fRot: { x: -Math.PI / 2, y: 0, z: 0 },
  },
  {
    id: "achievements",
    iPosi: { x: -3.7, y: 3, z: 2.4 },
    fPosi: { x: 0.3, y: 1.3, z: 1.8 },
    iRot: { x: -Math.PI / 2, y: 0, z: 0 },
    fRot: { x: 0, y: 0, z: 0 },
  },
  {
    id: "experiences",
    iPosi: { x: 0.3, y: 1.3, z: 1.8 },
    fPosi: { x: -3, y: 0.2, z: 2.1 },
    iRot: { x: 0, y: 0, z: 0 },
    fRot: { x: 0, y: 0, z: 0 },
  },
  {
    id: "vibes",
    iPosi: { x: -3, y: 0.2, z: 2.1 },
    fPosi: { x: -3, y: 2.5, z: 3 },
    iRot: { x: 0, y: 0, z: 0 },
    fRot: { x: 0, y: 0, z: 0 },
  },
  {
    id: "contact",
    iPosi: { x: -3, y: 2.5, z: 3 },
    fPosi: { x: -1.2, y: 2.1, z: 2 },
    iRot: { x: 0, y: 0, z: 0 },
    fRot: { x: -0.01871, y: -0.097683, z: 0 },
  },
];

positionAndRotation.forEach(({ id, iPosi, fPosi, iRot, fRot }) => {
  gsap.fromTo(
    camera.position,
    {
      x: iPosi.x,
      y: iPosi.y,
      z: iPosi.z,
    },
    {
      x: fPosi.x,
      y: fPosi.y,
      z: fPosi.z,
      scrollTrigger: {
        trigger: `#${id}`,
        start: "top 900px",
        end: "bottom bottom",
        scrub: true,
      },
      ease: "power2.inOut",
    }
  );

  gsap.fromTo(
    camera.rotation,
    {
      x: iRot.x,
      y: iRot.y,
      z: iRot.z,
    },
    {
      x: fRot.x,
      y: fRot.y,
      z: fRot.z,
      scrollTrigger: {
        trigger: `#${id}`,
        start: "top 700px",
        end: "bottom bottom",
        scrub: true,
      },
      ease: "power2.inOut",
    }
  );

  let tempid = document.getElementById(`${id}`);

  gsap.to(tempid, {
    duration: 1,
    opacity: 1,
    scrollTrigger: {
      trigger: `#${id}`,
      start: "top 900px",
      end: "bottom bottom",
      scrub: true,
    },
    ease: "power2.out",
  });
});

//Model
const loader = new GLTFLoader();

const video = document.createElement("video");
video.src = "/day.mp4";
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

const video2 = document.createElement("video");
video2.src = "/night.mp4";
video2.flipX = true;
video2.loop = true;
video2.muted = true; // Mute the video to allow autoplay
video2.playsInline = true; // For iOS compatibility
video2.autoplay = true; // Autoplay the video
video2.play();

const videoTexture2 = new THREE.VideoTexture(video2);
videoTexture2.rotation = Math.PI / 2; // Rotate the video texture to match the model's orientation
videoTexture2.center.set(0.5, 0.5); // Center the texture
videoTexture2.colorSpace = THREE.SRGBColorSpace; // Ensure the video texture uses the correct color space

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
  night: {},
};

const textureLoader = new THREE.TextureLoader();

Object.entries(textureMap).forEach(([key, paths]) => {
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  dayTexture.flipY = false;
  loadedTextures.day[key] = dayTexture;

  const nightTexture = textureLoader.load(paths.night);
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.flipY = false;
  loadedTextures.night[key] = nightTexture;
});



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
    mixer = new THREE.AnimationMixer(room);
    // Play all animations found in the file
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
  }

  scene.add(room);
  window.room = room;
  let isNightMode = true;
  const toggleButton = document.getElementById("modeToggle");
  const switchimg =  document.getElementById("switch");
  
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      isNightMode = !isNightMode;
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
      })
    });
  
    room.traverse((node) => {
      if(node.name === "window"){
        node.material = new THREE.MeshBasicMaterial({
          map: isNightMode ? videoTexture2 : videoTexture
        })
      }
    })
  }
});


//orbit controls
// const controls = new OrbitControls(camera, document.getElementById("canvas"));
// controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
// controls.dampingFactor = 0.25;
// controls.enablePan = true;
// controls.target.set(-2, 1, 0);

window.addEventListener("DOMContentLoaded", () => {
  typeLine();
});

//renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x0000000, 1); // Set background color to black

// resize
window.addEventListener("resize", () => {
  console.log("resizing");
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // controls.update();
});

//parallax effect
window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (room) {
    gsap.to(room.rotation, {
      x: y * 0.05,
      y: x * 0.05,
      duration: 0.5,
      ease: "power2.out",
    });
  }
});

// raycaster
window.addEventListener("mousemove", (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
   

//Animation loop
function animate() {
  // controls.update();

  // Raycaster
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

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
