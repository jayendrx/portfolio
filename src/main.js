import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
gsap.registerPlugin(TextPlugin, ScrollTrigger);

const canvas = document.getElementById("canvas");
const clock = new THREE.Clock();

let room;
let mixer;

//scroll set
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

//create a scene
const scene = new THREE.Scene();

//camera

// const aspectRatio= window.innerWidth/window.innerHeight
// const camera = new THREE.OrthographicCamera(-1*window.innerWidth,1*window.innerWidth,1*window.innerHeight,-1*window.innerHeight,0.1,20);

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

//axis helper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

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
];
let currentLineHome = 0;
const homeText = document.getElementById("homeText");
const home = document.getElementById("home");

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
      autoAlpha: 0,
      ease: "power1.inOut",
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
      duration: 0.5,
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
    fPosi: { x: -4.7, y: 3, z: 0.7 },
    iRot: { x: 0, y: -0.3, z: 0 },
    fRot: { x: -Math.PI / 2, y: 0, z: 0 },
  },
  {
    id: "achievements",
    iPosi: { x: -4.7, y: 3, z: 0.7 },
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

  let tempid =  document.getElementById(`${id}`);

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
video.src = "/sunset2.mp4";
video.loop = true;
video.muted = true; // Mute the video to allow autoplay
video.playsInline = true; // For iOS compatibility
video.autoplay = true; // Autoplay the video
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.rotation = Math.PI / 2; // Rotate the video texture to match the model's orientation
videoTexture.center.set(0.5, 0.5); // Center the texture
videoTexture.colorSpace = THREE.SRGBColorSpace; // Ensure the video texture uses the correct color space

loader.load("/portfoliov18.glb", function (gltf) {
  room = gltf.scene;

  room.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;

      console.log(node.name, node.material.type);

      if (node.name === "window") {
        {
          node.material = new THREE.MeshBasicMaterial({ map: videoTexture });
          node.material.needsUpdate = true;
        }
      }
      else if (node.material && node.material.type === 'MeshBasicMaterial') {
      // Replace flat unlit material with a lit one
      node.material = new THREE.MeshStandardMaterial({
        map: node.material.map,
        color: node.material.color,
        roughness: 0.8,
        metalness: 0.2
      });
    }

    }
  });
  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(room);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }

  scene.add(room);
  window.room = room;
});

//lights
const ambientLight = new THREE.AmbientLight(0xffb385, 0.5);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xff9240, 2);
sunlight.position.set(20, 15, 15);
sunlight.castShadow = true;
sunlight.shadow.radius = 4;
sunlight.shadow.bias = -0.0001;
scene.add(sunlight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// directionalLight.position.set(20, 15, 15);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;
// directionalLight.shadow.camera.left = -10;
// directionalLight.shadow.camera.right = 10;
// directionalLight.shadow.camera.top = 10;
// directionalLight.shadow.camera.bottom = -10;
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 50;
// scene.add(directionalLight);

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
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x0000000, 1); // Set background color to black
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//post processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.2, // strength
  0.2, // radius
  0 // threshold
);
composer.addPass(bloomPass);

// resize
window.addEventListener("resize", () => {
  console.log("resizing");
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // controls.update();
});

//parallax effect
window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (room) {
    gsap.to(room.rotation, {
      x: y * 0.1,
      y: x * 0.1,
      duration: 0.5,
      ease: "power2.out",
    });
  }
});

//camera positions
let camPositions = [
  {
    id: "landingPage",
    position: new THREE.Vector3(
      -1.0703035128665155,
      2.366754901952743,
      5.916248299201015
    ),
    rotation: new THREE.Euler(0, 0, Math.PI / 2),
  },
  {
    id: "about",
    position: new THREE.Vector3(
      -1.0703035128665155,
      2.366754901952743,
      5.916248299201015
    ),
    rotation: new THREE.Euler(0, 0, Math.PI / 2),
  },
  {
    id: "projects",
    position: new THREE.Vector3(
      -1.0703035128665155,
      2.366754901952743,
      5.916248299201015
    ),
    rotation: new THREE.Euler(0, 0, Math.PI / 2),
  },
  {
    id: "contact",
    position: new THREE.Vector3(
      -1.0703035128665155,
      2.366754901952743,
      5.916248299201015
    ),
    rotation: new THREE.Euler(0, 0, Math.PI / 2),
  },
];

//Animation loop
function animate() {
  requestAnimationFrame(animate);
  // controls.update();

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  composer.render();
}

animate();
