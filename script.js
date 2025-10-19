// Khởi tạo Lucide icons (giữ cho các phần khác, nhưng không dùng cho hearts)
lucide.createIcons();

// State và functions
let currentStage = 'hearts';
let hearts = [];
let envelopeOpen = false;
let musicPlaying = true;
let musicStarted = false;
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

// Music control (giữ nguyên)
musicToggle.addEventListener('click', () => {
  if (!musicStarted) {
    bgMusic.play().then(() => {
      musicStarted = true;
      bgMusic.muted = false;
    }).catch(e => console.error('Audio play failed:', e));
  }
  musicPlaying = !musicPlaying;
  if (musicStarted) {
    bgMusic.muted = !musicPlaying;
  }
  musicToggle.innerHTML = musicPlaying 
    ? '<i data-lucide="volume-2" class="w-6 h-6 text-pink-500"></i>'
    : '<i data-lucide="volume-x" class="w-6 h-6 text-gray-400"></i>';
  lucide.createIcons();
});

// Function to show/hide stage (giữ nguyên)
function showStage(stage) {
  console.log('Switching to stage:', stage);
  document.querySelectorAll('#hearts, #notification, #envelope, #letter').forEach(el => el.classList.add('hidden'));
  document.getElementById(stage).classList.remove('hidden');
  currentStage = stage;
  if (stage === 'hearts') {
    generateHearts();
  }
}

// Generate hearts ĐƠN GIẢN: SVG inline, animation inline style (không cần Lucide)
function generateHearts() {
  console.log('Generating hearts...');
  const heartsContainer = document.getElementById('hearts');
  heartsContainer.innerHTML = ''; // Clear cũ
  hearts = Array.from({ length: 25 }, (_, i) => ({ // Giảm xuống 25 cho perf
    id: i,
    left: Math.random() * 100, // % ngang
    duration: (8 + Math.random() * 4) + 's', // 8-12s
    delay: Math.random() * 2 + 's', // Delay spawn
    sway: (Math.random() - 0.5) * 40 + 'px', // Lắc ±20px
    drift: (Math.random() - 0.5) * 100 + 'px', // Drift cuối ±50px
    size: (window.innerWidth < 768 ? 25 : 35) + Math.random() * 15, // Size responsive
    rotation: Math.random() * 720 - 360, // Xoay -360 đến +360 deg
  }));

  hearts.forEach(heart => {
    const heartEl = document.createElement('div');
    heartEl.className = 'heart-falling absolute'; // Giữ class cho CSS base
    heartEl.style.cssText = `
      left: ${heart.left}%;
      top: -${heart.size * 2}px; /* Bắt đầu ngoài màn hình */
      animation-duration: ${heart.duration};
      animation-delay: ${heart.delay};
      animation-timing-function: linear;
      transform: rotate(${heart.rotation}deg);
      z-index: 50;
      opacity: 1;
      /* Inline animation đơn giản: rơi + lắc + xoay */
      animation: ${heart.duration} linear ${heart.delay} infinite 
        alternate 
        translateY(-100%, 120vh) translateX(0, ${heart.drift}) rotate(${heart.rotation}deg, ${heart.rotation + 360}deg),
        sway ${heart.duration} ease-in-out ${heart.delay} infinite;
    `;

    // SVG inline heart đỏ (đơn giản, chắc chắn render)
    heartEl.innerHTML = `
      <svg width="${heart.size}" height="${heart.size}" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;

    heartsContainer.appendChild(heartEl);
  });

  console.log(`Generated ${hearts.length} hearts with inline SVG`);
}

// Confetti effect (giữ nguyên)
function launchConfetti() {
  confettiCanvas.classList.remove('hidden');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const confetti = [];
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 5 + 5,
      color: ['#ff6b6b', '#ffd93d', '#6bcf6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random() * 5)],
      size: Math.random() * 5 + 3,
    });
  }
  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      if (p.y > confettiCanvas.height) confetti.splice(i, 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    if (confetti.length) requestAnimationFrame(animate);
    else confettiCanvas.classList.add('hidden');
  }
  animate();
}

// Typewriter effect (giữ nguyên)
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Event handlers (giữ nguyên)
document.getElementById('btnNotification').addEventListener('click', () => {
  if (!musicStarted) {
    bgMusic.play().then(() => {
      musicStarted = true;
      bgMusic.muted = false;
      bgMusic.volume = 0.3;
    }).catch(e => {
      console.error('Audio autoplay blocked:', e);
      alert('Nhấn nút nhạc để bật âm thanh nhé! 🎵');
    });
  }
  showStage('envelope');
});

document.getElementById('envelopeContainer').addEventListener('click', () => {
  if (!envelopeOpen) {
    envelopeOpen = true;
    document.getElementById('envelopeFlap').style.transform = 'rotateX(180deg)';
    document.getElementById('envelopeContainer').classList.add('scale-110', 'rotate-6');
    launchConfetti();
    setTimeout(() => {
      showStage('letter');
      typeWriter(document.getElementById('letterTitle'), 'Gửi Em Yêu');
    }, 800);
  }
});

document.getElementById('backToEnvelope').addEventListener('click', () => {
  envelopeOpen = false;
  document.getElementById('envelopeFlap').style.transform = 'rotateX(0deg)';
  document.getElementById('envelopeContainer').classList.remove('scale-110', 'rotate-6');
  showStage('envelope');
});

// Keyboard support (giữ nguyên)
document.getElementById('envelopeContainer').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    document.getElementById('envelopeContainer').click();
  }
});

// Init (giữ nguyên)
showStage('hearts');
generateHearts();
setTimeout(() => {
  showStage('notification');
}, 4000);

// Re-init icons và resize (đơn giản hóa: regenerate hearts nếu resize)
window.addEventListener('resize', () => {
  if (currentStage === 'hearts') {
    generateHearts();
  }
  if (currentStage === 'letter') confettiCanvas.width = window.innerWidth;
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) lucide.createIcons();
});