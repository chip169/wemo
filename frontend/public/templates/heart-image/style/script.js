const imgUrls = [];
for (let i = 1; i <= 20; i++) {
  imgUrls.push(`./style/image/Anh (${i}).jpg`);
}

const messages = [
  'I Love You ❤️',
  'My Love 🎁',
  'Ngọt ngào & Ấm áp 🥰',
  'Mãi mãi bên nhau 🍀',
  'Yêu thương đong đầy ✨'
];

try {
  const urlParams = new URLSearchParams(window.location.search);
  const customPhotos = urlParams.get("photos");
  if (customPhotos) {
    const parsed = JSON.parse(decodeURIComponent(customPhotos));
    if (Array.isArray(parsed) && parsed.length > 0) {
      imgUrls.splice(0, imgUrls.length, ...parsed);
    }
  }
  const customMsg = urlParams.get("message");
  if (customMsg) {
    messages.unshift(customMsg);
  }
  const recipient = urlParams.get("recipient");
  if (recipient) {
    messages.unshift(`Gửi ${recipient} ❤️`);
  }
} catch (e) {}

function showFallingMessage() {
  const container = document.getElementById('messageContainer');
  if (!container) return;
  const count = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < count; i++) {
    const msg = document.createElement('div');
    msg.className = 'falling-message';
    msg.textContent = messages[Math.floor(Math.random() * messages.length)];
    const left = Math.random() * 80 + 5;
    const duration = Math.random() * 3 + 3;
    const fontSize = Math.random() * 8 + 14;
    msg.style.left = `${left}%`;
    msg.style.top = `-50px`;
    msg.style.animationDuration = `${duration}s`;
    msg.style.fontSize = `${fontSize}px`;
    container.appendChild(msg);
    setTimeout(() => msg.remove(), duration * 1000 + 1000);
  }
}

const isMobile = window.innerWidth < 600 || window.innerHeight < 600;
let scale = isMobile ? 8 : (window.innerWidth < 900 ? 12 : 18);
const step = 0.2;
const imgSize = isMobile ? 60 : 80;
const delay = 150;
const heartPoints = [];

for (let t = 0; t < 2 * Math.PI; t += step) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  heartPoints.push({ x, y });
}

const container = document.getElementById('heartContainer');
const heartGroup = document.createElement('div');
heartGroup.style.transformStyle = 'preserve-3d';
heartGroup.style.position = 'absolute';
heartGroup.style.top = '50%';
heartGroup.style.left = '50%';
heartGroup.style.transform = 'translate(-50%, -50%)';
container.appendChild(heartGroup);

heartPoints.forEach((point, i) => {
  setTimeout(() => {
    const img = document.createElement('img');
    img.src = imgUrls[i % imgUrls.length];
    img.className = 'photo';
    img.dataset.index = i;
    img.style.left = `calc(50% + ${point.x * scale}px - ${imgSize / 2}px)`;
    img.style.top = `calc(50% - ${point.y * scale}px - ${imgSize / 2}px)`;
    heartGroup.appendChild(img);
    setTimeout(() => img.classList.add('show'), 10);
  }, i * delay);
});

const totalDelay = heartPoints.length * (delay - 100);
setTimeout(() => {
  setInterval(showFallingMessage, 3000);
}, totalDelay + 1000);

let rotateX = 0;
let rotateY = 0;
let isDragging = false;
let lastX, lastY;

container.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
container.addEventListener('mouseup', () => isDragging = false);
container.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  rotateY += dx * 0.3;
  rotateX -= dy * 0.3;
  updateTransform();
});

container.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }
});
container.addEventListener('touchend', () => isDragging = false);
container.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const dx = e.touches[0].clientX - lastX;
  const dy = e.touches[0].clientY - lastY;
  lastX = e.touches[0].clientX;
  lastY = e.touches[0].clientY;
  rotateY += dx * 0.3;
  rotateX -= dy * 0.3;
  updateTransform();
});

function updateTransform() {
  heartGroup.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function createStars(count = 150) {
  const starField = document.getElementById('starField');
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    starField.appendChild(star);
  }
}

function createShootingStar() {
  const starField = document.getElementById('starField');
  const shootingStar = document.createElement('div');
  shootingStar.className = 'shooting-star';
  shootingStar.style.top = `${Math.random() * window.innerHeight}px`;
  shootingStar.style.left = `${Math.random() * window.innerWidth / 2}px`;
  starField.appendChild(shootingStar);
  setTimeout(() => shootingStar.remove(), 1000);
}

function createStarBurst(x, y) {
  const count = 12;
  const starField = document.getElementById('starField');
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star-burst';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 150 + 50;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    star.style.setProperty('--dx', `${dx}px`);
    star.style.setProperty('--dy', `${dy}px`);
    starField.appendChild(star);
    setTimeout(() => star.remove(), 800);
  }
}

createStars();
setInterval(() => {
  if (Math.random() < 0.6) createShootingStar();
}, 500);

document.addEventListener('click', (e) => createStarBurst(e.clientX, e.clientY));
document.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    createStarBurst(e.touches[0].clientX, e.touches[0].clientY);
  }
});