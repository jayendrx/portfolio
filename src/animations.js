import gsap from "gsap";
import { camera } from "./scene.js";

// Register GSAP plugins here — animations.js runs before main.js body due to ES module hoisting
gsap.registerPlugin(TextPlugin, ScrollTrigger);


//scroll set
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// ── Loading screen ──────────────────────────────────────────────
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
    "Explore my projects and skills",
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

export function typeLine() {
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

// ── Scroll camera animations ─────────────────────────────────────
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
        fPosi: { x: -1.2, y: 2.3, z: 2.7 },
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
