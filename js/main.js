import "./api.js";
import "./market.js";
import "./portfolio.js";
import "./trade.js";
import { updateHistory } from "./trade.js";

// Hero Background Sequence Animation
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const frameCount = 192;
let assetPath = 'assets'; // default to assets

// Detect which folder exists (assets or asset)
const currentFrame = (path, index) => (
    `${path}/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const animationState = { frame: 0 };

function preloadImages() {
    // Try primary path
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame('assets', i);
        img.onerror = () => {
            // If primary fails, try singular 'asset'
            if (i === 1) {
                console.log("Assets folder not found, trying 'asset' folder...");
                retryWithSingularPath();
            }
        };
        images.push(img);
    }
}

function retryWithSingularPath() {
    images.length = 0; // clear existing
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame('asset', i);
        images.push(img);
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function renderFrame() {
    if (!images[animationState.frame]) return;

    const img = images[animationState.frame];
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

    if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

const fps = 24;
const frameInterval = 1000 / fps;
let lastFrameTime = 0;

function startHeroAnimation(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const elapsed = timestamp - lastFrameTime;

    if (elapsed > frameInterval) {
        if (animationState.frame < frameCount - 1) {
            animationState.frame++;
            renderFrame();
            lastFrameTime = timestamp - (elapsed % frameInterval);
        } else {
            // Stop at last frame
            return;
        }
    }
    requestAnimationFrame(startHeroAnimation);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    renderFrame();
});

// Initialize Hero Animation
preloadImages();
resizeCanvas();

// Robust startup: Wait for images[0] but also check if already complete
function init() {
    console.log("Initializing Hero Animation...");
    if (images[0].complete) {
        onFirstFrameLoad();
    } else {
        images[0].onload = onFirstFrameLoad;
        images[0].onerror = (e) => console.error("Failed to load first frame. Check path: " + images[0].src, e);
        // Fallback for extreme cases
        setTimeout(() => {
            if (animationState.frame === 0) {
                console.log("Forcing animation start after timeout...");
                onFirstFrameLoad();
            }
        }, 2000);
    }
}

function onFirstFrameLoad() {
    console.log("First frame loaded (" + images[0].width + "x" + images[0].height + "), starting engine.");
    renderFrame();
    requestAnimationFrame(startHeroAnimation);
}

init();

// Navigation Logic
const pages = {
    home: document.getElementById("home-page"),
    dashboard: document.getElementById("dashboard-page"),
    history: document.getElementById("history-page")
};

const navLinks = {
    home: document.getElementById("nav-home"),
    dashboard: document.getElementById("nav-dashboard"),
    history: document.getElementById("nav-history")
};

function showPage(pageId) {
    // Show/Hide background based on page
    if (pageId === 'home') {
        canvas.style.display = 'block';
    } else {
        canvas.style.display = 'none';
    }

    // Hide all pages
    Object.values(pages).forEach(p => p.classList.remove("active"));
    Object.values(navLinks).forEach(l => l.classList.remove("active"));

    // Show selected page
    if (pages[pageId]) {
        pages[pageId].classList.add("active");
        navLinks[pageId].classList.add("active");
    }

    if (pageId === 'history') {
        updateHistory();
    }
}

// Handle Hash Change
window.addEventListener("hashchange", () => {
    const pageId = window.location.hash.slice(1) || 'home';
    showPage(pageId);
});

// Initial Load
const initialPage = window.location.hash.slice(1) || 'home';
showPage(initialPage);

console.log("Trade Marker Terminal Initialized.");
