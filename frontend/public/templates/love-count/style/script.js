const popSound = new Audio("style/pop.mp3");
document.addEventListener("click", () => {
    popSound.currentTime = 0;
    popSound.play().catch(() => { });
});

const bgMusic = new Audio("style/nhac.mp3");
bgMusic.currentTime = 45;
bgMusic.loop = true;

const introOverlay = document.getElementById("introOverlay");
const holdBtn = document.getElementById("holdBtn");
const introHeartFill = document.getElementById("introHeartFill");

const HOLD_DURATION = 1500;
let holdProgress = 0;
let holdInterval = null;

function setHeartFill(percent) {
    const y = 30 - (30 * percent) / 100;
    introHeartFill.setAttribute("y", y);
}

function program(delay = 200) {
  (function () {
    const _b = (s) => decodeURIComponent(escape(atob(s)));
    const _d = [
      "QuG6o24gcXV54buBbiB0aHXhu5ljIHbhu4IgRHIuR2lmdGVy",
      "VGlrdG9rOiBodHRwczovL3d3dy50aWt0b2suY29tL0Bkci5naWZ0ZXIzMDY=",
      "R2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vRHJHaWZ0ZXI="
    ];

    setTimeout(() => {
      _d.forEach(x => console.log(_b(x)));
    }, delay);
  })();
}

function startHold() {
    if (holdInterval) return;
    holdInterval = setInterval(() => {
        holdProgress += 30;
        const percent = Math.min(100, (holdProgress / HOLD_DURATION) * 100);
        setHeartFill(percent);
        if (percent >= 100) {
            clearInterval(holdInterval);
            holdInterval = null;
            finishIntro();
        }
    }, 30);
}

function cancelHold() {
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }
    holdProgress = 0;
    setHeartFill(0);
}

function finishIntro() {
    bgMusic.play().catch(() => { });
    introOverlay.classList.add("fading");
}

holdBtn.addEventListener("pointerdown", startHold);
holdBtn.addEventListener("pointerup", cancelHold);
holdBtn.addEventListener("pointerleave", cancelHold);
holdBtn.addEventListener("pointercancel", cancelHold);

let startDate = new Date();

function pad(n) {
    return String(n).padStart(2, "0");
}

function updateCounter() {
    const now = new Date();

    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.floor((nowMidnight - startMidnight) / 86400000);
    document.getElementById("days").textContent = days;

    const nextMidnight = new Date(nowMidnight.getTime() + 86400000);
    const remaining = nextMidnight - now;
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    document.getElementById("hours").textContent = pad(hours);
    document.getElementById("minutes").textContent = pad(minutes);
    document.getElementById("seconds").textContent = pad(seconds);
}

async function loadInfo() {
    let dateStr = "26 - 01 - 2026";
    let boyStr = "Minh Bảo";
    let girlStr = "Ngọc Song";
    try {
        const res = await fetch("style/info.txt");
        if (res.ok) {
            const text = await res.text();
            text.split("\n").forEach((line) => {
                const [key, value] = line.split("=");
                if (key && value) {
                    if (key.trim() === "date") dateStr = value.trim();
                    if (key.trim() === "boy") boyStr = value.trim();
                    if (key.trim() === "girl") girlStr = value.trim();
                }
            });
        }
    } catch (e) {}

    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("boy")) boyStr = urlParams.get("boy");
        if (urlParams.get("girl")) girlStr = urlParams.get("girl");
        if (urlParams.get("date")) dateStr = urlParams.get("date");
        const customPhotos = urlParams.get("photos");
        if (customPhotos) {
            const parsed = JSON.parse(decodeURIComponent(customPhotos));
            if (Array.isArray(parsed) && parsed.length > 0) {
                galleryImages.length = 0;
                parsed.forEach((p) => galleryImages.push(p));
            }
        }
    } catch (e) {}

    const [day, month, year] = dateStr.match(/\d+/g).map(Number);
    startDate = new Date(year, month - 1, day, 0, 0, 0);

    document.getElementById("boyName").textContent = boyStr;
    document.getElementById("girlName").textContent = girlStr;

    updateCounter();
    setInterval(updateCounter, 1000);
}

loadInfo();

function createFloatingHearts() {
    const bg = document.getElementById("heartsBg");
    const count = 25;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement("span");
        heart.innerHTML = "&#10084;";
        heart.style.left = Math.random() * 100 + "%";
        heart.style.fontSize = 14 + Math.random() * 22 + "px";
        heart.style.animationDuration = 8 + Math.random() * 12 + "s";
        heart.style.animationDelay = Math.random() * 10 + "s";
        bg.appendChild(heart);
    }
}

createFloatingHearts();

const galleryImageCount = 20;
const galleryImages = [];
for (let i = 1; i <= galleryImageCount; i++) {
    galleryImages.push(`style/img/Anh (${i}).jpg`);
}

let memoryIndex = 0;
const mainView = document.querySelector(".container");
const memoriesView = document.getElementById("memoriesView");
const memoryImg = document.getElementById("memoryImg");
const polaroid = document.getElementById("polaroid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

function showMemory(index) {
    memoryImg.src = encodeURI(galleryImages[index]);
}

document.getElementById("photoBtn").addEventListener("click", () => {
    memoryIndex = 0;
    showMemory(memoryIndex);
    mainView.classList.add("hidden");
    memoriesView.classList.add("open");
});

document.getElementById("backBtn").addEventListener("click", () => {
    memoriesView.classList.remove("open");
    mainView.classList.remove("hidden");
});

program();

document.getElementById("cameraBtn").addEventListener("click", () => {
    memoryIndex = (memoryIndex + 1) % galleryImages.length;
    showMemory(memoryIndex);
});

polaroid.addEventListener("click", () => {
    lightboxImg.src = memoryImg.src;
    lightbox.classList.add("open");
});

lightbox.addEventListener("click", () => {
    lightbox.classList.remove("open");
});
