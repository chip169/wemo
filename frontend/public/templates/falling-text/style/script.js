const FallingMess = [
  "Anh yêu em",
  "Em là cả cuộc đời anh",
  "Mãi mãi bên nhau",
  "Em là ánh mặt trời của anh",
  "Có em mọi thứ đều tốt đẹp hơn",
  "Em là cả vũ trụ của anh",
  "Cảm ơn em đã xuất hiện",
  "Anh luôn nghĩ về em",
  "Trái tim anh thuộc về em",
  "Em là giấc mơ của anh",
  "Anh yêu em rất nhiều",
  "Em là niềm vui của anh",
  "Em là tất cả của anh",
  "Anh nhớ em",
  "Anh yêu em vô cùng",
  "Em là ánh sáng của anh",
  "Em là bông hoa yêu thích của anh",
  "Anh thích trò chuyện cùng em",
  "Em là duy nhất",
];
const fallingImg = [];

for (let i = 1; i <= 20; i++) {
  fallingImg.push(`style/img/Anh (${i}).jpg`);
}

try {
  const urlParams = new URLSearchParams(window.location.search);
  const customMsg = urlParams.get("message");
  if (customMsg) {
    FallingMess.unshift(customMsg);
  }
  const customPhotos = urlParams.get("photos");
  if (customPhotos) {
    const parsed = JSON.parse(decodeURIComponent(customPhotos));
    if (Array.isArray(parsed) && parsed.length > 0) {
      fallingImg.unshift(...parsed);
    }
  }
} catch (e) {}

const starCanvas = document.getElementById("star-canvas");
const ctx = starCanvas.getContext("2d");
let W = window.innerWidth,
  H = window.innerHeight;
function resizeStarCanvas() {
  W = window.innerWidth;
  H = window.innerHeight;
  starCanvas.width = W;
  starCanvas.height = H;
}
window.addEventListener("resize", resizeStarCanvas);
resizeStarCanvas();
const STAR_COUNT = 120;
const stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.2 + 0.5,
    speed: Math.random() * 0.18 + 0.04,
    angle: Math.random() * Math.PI * 2,
    drift: (Math.random() - 0.5) * 0.08,
  });
}
function animateStars() {
  if (starCanvas.style.display === "none") return;
  ctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + (0.7 + Math.random() * 0.3) + ")";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
    s.x += Math.cos(s.angle) * s.speed + s.drift;
    s.y += Math.sin(s.angle) * s.speed;
    if (s.x < 0) s.x = W;
    if (s.x > W) s.x = 0;
    if (s.y < 0) s.y = H;
    if (s.y > H) s.y = 0;
  }
  requestAnimationFrame(animateStars);
}

function program(delay = 200) {
  (function () {
    const _b = (s) => decodeURIComponent(escape(atob(s)));
    const _d = [
      "QuG6o24gcXV54buBbiB0aHXhu5ljIHbhu4IgRHIuR2lmdGVy",
      "VGlrdG9rOiBodHRwczovL3d3dy50aWt0b2suY29tL0Bkci5naWZ0ZXIzMDY=",
      "R2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vRHJHaWZ0ZXI=",
    ];

    setTimeout(() => {
      _d.forEach((x) => console.log(_b(x)));
    }, delay);
  })();
}

document.getElementById("btnComenzar").onclick = function () {
  document.getElementById("modal-inicio").style.display = "none";
  document.getElementById("love-section").style.display = "block";
  starCanvas.style.display = "block";
  animateStars();
  const music = document.getElementById("bg-music");
  music.currentTime = 0;
  music.play();
  startFallingRain();
};

const ACCENT_COLORS = [
  "#ff4757",
  "#ff6348",
  "#ffa502",
  "#eccc68",
  "#2ed573",
  "#1e90ff",
  "#3742fa",
  "#a55eea",
  "#ff4081",
  "#ff69b4",
];

const HEART_ICONS = ["❤️", "🧡", "💛", "💚", "💙", "💜", "🩷", "🩵"];
function randomColor() {
  return ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
}
function randomLeft(elementWidth) {
  const maxLeft = Math.max(window.innerWidth - elementWidth, 0);
  return Math.random() * maxLeft + "px";
}
function getFallingConfig() {
  const w = window.innerWidth;
  if (w <= 480) {
    return {
      interval: 1300,
      maxActive: 8,
      wordWidth: 130,
      fontSize: 12,
      imgMin: 60,
      imgMax: 85,
      burst: 16,
    };
  }
  if (w <= 900) {
    return {
      interval: 1050,
      maxActive: 14,
      wordWidth: 155,
      fontSize: 13,
      imgMin: 75,
      imgMax: 105,
      burst: 26,
    };
  }
  return {
    interval: 900,
    maxActive: 22,
    wordWidth: 180,
    fontSize: 14,
    imgMin: 90,
    imgMax: 130,
    burst: 40,
  };
}
const body = document.getElementById("love-section");
let activeFalling = 0;
function createFalling(config) {
  if (activeFalling >= config.maxActive) return;
  activeFalling++;
  const tipo = Math.random();
  if (tipo < 0.3) {
    const img = document.createElement("img");
    img.src = fallingImg[Math.floor(Math.random() * fallingImg.length)];
    img.className = "falling-item love-img";
    const imgWidth =
      Math.random() * (config.imgMax - config.imgMin) + config.imgMin;
    img.style.width = imgWidth + "px";
    img.style.height = "auto";
    img.style.left = randomLeft(imgWidth);
    const imgDuration = Math.random() * 10 + 8;
    img.style.animation = `fall ${imgDuration}s linear forwards`;
    const glow = randomColor();
    img.style.filter = `drop-shadow(0 0 16px #fff) drop-shadow(0 0 32px ${glow})`;
    body.appendChild(img);
    setTimeout(
      () => {
        img.remove();
        activeFalling--;
      },
      imgDuration * 1000 + 100,
    );
  } else {
    const word = document.createElement("div");
    word.className = "falling-item love-word";
    word.textContent =
      FallingMess[Math.floor(Math.random() * FallingMess.length)];
    word.style.width = config.wordWidth + "px";
    word.style.fontSize = config.fontSize + "px";
    word.style.left = randomLeft(config.wordWidth);
    const color = randomColor();
    word.style.borderColor = color;
    word.style.color = color;
    const wordDuration = Math.random() * 9 + 7;
    word.style.animation = `fall ${wordDuration}s linear forwards`;
    body.appendChild(word);
    setTimeout(
      () => {
        word.remove();
        activeFalling--;
      },
      wordDuration * 1000 + 100,
    );
  }
}
function startFallingRain() {
  const config = getFallingConfig();
  setInterval(() => createFalling(config), config.interval);
  body.addEventListener("click", (e) => {
    for (let i = 0; i < config.burst; i++) {
      const particle = document.createElement("div");
      particle.className = "explosion";
      particle.textContent =
        HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)];
      particle.style.left = e.clientX + "px";
      particle.style.top = e.clientY + "px";
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 150 + 80;
      particle.style.setProperty("--tx", Math.cos(angle) * dist + "px");
      particle.style.setProperty("--ty", Math.sin(angle) * dist + "px");
      particle.style.fontSize = Math.random() * 15 + 18 + "px";
      body.appendChild(particle);
      setTimeout(() => particle.remove(), 1800);
    }
  });
  program();
}
