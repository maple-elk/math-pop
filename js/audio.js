// Web Audio API Synthesizer & Confetti Effects
let soundEnabled = (typeof SafeStorage !== "undefined" ? SafeStorage.getItem("mathpop_sound") : null) !== "false";

function isSoundEnabled() {
  return soundEnabled;
}

function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  if (typeof window !== "undefined") {
    window.soundEnabled = soundEnabled;
  } else if (typeof global !== "undefined") {
    global.soundEnabled = soundEnabled;
  }
  if (typeof SafeStorage !== "undefined") {
    SafeStorage.setItem("mathpop_sound", String(soundEnabled));
  }
  return soundEnabled;
}

  // --- Audio Synthesizer (Web Audio API) ---
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playPopSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  function playChimeSound(isBonus = false) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = isBonus ? [523.25, 659.25, 783.99, 1046.50] : [587.33, 880.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const now = ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // --- Confetti Animation ---
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerConfetti() {
    const colors = ['#2563eb', '#059669', '#d97706', '#4f46e5', '#0284c7'];
    for (let i = 0; i < 32; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 160,
        y: window.innerHeight / 2 - 40,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -8 - 3,
        size: Math.random() * 7 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }
    if (!confettiAnimationId) {
      renderConfetti();
    }
  }

  function renderConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.018;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      confettiCtx.restore();
    });

    confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < confettiCanvas.height);
    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(renderConfetti);
    } else {
      confettiAnimationId = null;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

// Global Exports
(typeof window !== "undefined" ? window : global).playPopSound = playPopSound;
(typeof window !== "undefined" ? window : global).playChimeSound = playChimeSound;
(typeof window !== "undefined" ? window : global).triggerConfetti = triggerConfetti;

(typeof window !== "undefined" ? window : global).soundEnabled = soundEnabled;
(typeof window !== "undefined" ? window : global).isSoundEnabled = isSoundEnabled;
(typeof window !== "undefined" ? window : global).setSoundEnabled = setSoundEnabled;
