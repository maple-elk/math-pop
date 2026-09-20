// Math Pop! - Elementary Math (Grades 2-5) & Spatial Brain Teasers
(function() {
  'use strict';

  // Global App State
  let activeTab = 'grade2'; // 'kindergarten' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'riddles' | 'science'
  let streak = parseInt(localStorage.getItem('mathpop_streak') || '0', 10);
  let totalCompleted = parseInt(localStorage.getItem('mathpop_total') || '0', 10);
  let soundEnabled = localStorage.getItem('mathpop_sound') !== 'false';

  // Kindergarten State
  let activeKindergartenTrack = 'math'; // 'math' | 'questions' | 'riddles' | 'puzzles'
  const trackKindergartenIndices = {
    math: 0,
    questions: 0,
    riddles: 0,
    puzzles: 0
  };
  let currentKindergartenSlide = null;
  let kindergartenState = 'QUESTION'; // 'QUESTION' | 'SOLUTION'

  // Active sub-topic per math grade
  const gradeTopicState = {
    grade2: 'g2_add',
    grade3: 'g3_mult',
    grade4: 'g4_mult',
    grade5: 'g5_pemdas'
  };

  let currentMathProblem = null;
  let mathState = 'QUESTION'; // 'QUESTION' | 'SOLUTION'

  // Teaser & Riddle State
  let activeTeaserTrack = 'logic'; // 'logic' | 'visual' | 'mental'
  const trackSlideIndices = {
    logic: 0,
    visual: 0,
    mental: 0
  };
  let currentRiddle = null;
  let riddleState = 'QUESTION'; // 'QUESTION' | 'SOLUTION'

  // --- Common DOM Elements ---
  const streakCountEl = document.getElementById('streakCount');
  const streakPillEl = document.getElementById('streakPill');
  const totalCompletedEl = document.getElementById('totalCompleted');
  const soundToggleBtn = document.getElementById('soundToggle');
  const resetStatsBtn = document.getElementById('resetStatsBtn');
  const tabButtons = document.querySelectorAll('.app-tab');
  const kindergartenSection = document.getElementById('kindergartenSection');
  const mathSection = document.getElementById('mathSection');
  const riddlesSection = document.getElementById('riddlesSection');

  // --- Profile DOM Elements ---
  const profileBtn = document.getElementById('profileBtn');
  const profileAvatarEl = document.getElementById('profileAvatar');
  const profileNameEl = document.getElementById('profileName');
  const profileModal = document.getElementById('profileModal');
  const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
  const modalActiveAvatar = document.getElementById('modalActiveAvatar');
  const modalActiveName = document.getElementById('modalActiveName');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const editPlayerForm = document.getElementById('editPlayerForm');
  const editPlayerNameInput = document.getElementById('editPlayerNameInput');
  const cancelEditPlayerBtn = document.getElementById('cancelEditPlayerBtn');
  const editAvatarPicker = document.getElementById('editAvatarPicker');
  const modalTotalCompleted = document.getElementById('modalTotalCompleted');
  const modalCurrentStreak = document.getElementById('modalCurrentStreak');
  const modalBestStreak = document.getElementById('modalBestStreak');
  const categoryBreakdownGrid = document.getElementById('categoryBreakdownGrid');
  const toggleNewPlayerBtn = document.getElementById('toggleNewPlayerBtn');
  const newPlayerForm = document.getElementById('newPlayerForm');
  const newPlayerNameInput = document.getElementById('newPlayerNameInput');
  const cancelNewPlayerBtn = document.getElementById('cancelNewPlayerBtn');
  const newAvatarPicker = document.getElementById('newAvatarPicker');
  const profileList = document.getElementById('profileList');
  const resetProfileStatsBtn = document.getElementById('resetProfileStatsBtn');
  const deleteProfileBtn = document.getElementById('deleteProfileBtn');
  const exportProfilesBtn = document.getElementById('exportProfilesBtn');
  const importProfilesBtn = document.getElementById('importProfilesBtn');
  const importFileInput = document.getElementById('importFileInput');

  // Kindergarten DOM Elements
  const kindergartenCardEl = document.getElementById('kindergartenCard');
  const kindergartenBadgeEl = document.getElementById('kindergartenBadge');
  const kindergartenQuestionEl = document.getElementById('kindergartenQuestion');
  const kindergartenViewportEl = document.getElementById('kindergartenViewport');
  const kindergartenSolutionBoxEl = document.getElementById('kindergartenSolutionBox');
  const kindergartenAnswerTitleEl = document.getElementById('kindergartenAnswerTitle');
  const kindergartenExplanationEl = document.getElementById('kindergartenExplanation');
  const kindergartenActionBtn = document.getElementById('kindergartenActionBtn');
  const kindergartenActionText = document.getElementById('kindergartenActionText');
  const kindergartenAnswerInput = document.getElementById('kindergartenAnswerInput');
  const kindergartenInputFeedback = document.getElementById('kindergartenInputFeedback');
  const kindergartenTrackButtons = document.querySelectorAll('.kindergarten-track-btn');
  const prevKindergartenSlideBtn = document.getElementById('prevKindergartenSlideBtn');
  const nextKindergartenSlideBtn = document.getElementById('nextKindergartenSlideBtn');
  const kindergartenSlideIndicator = document.getElementById('kindergartenSlideIndicator');
  const kindergartenSlideDots = document.getElementById('kindergartenSlideDots');
  const kindergartenSpeakBtn = document.getElementById('kindergartenSpeakBtn');

  // Math DOM Elements
  const topicBar = document.getElementById('topicBar');
  const cardEl = document.getElementById('card');
  const cardBadgeEl = document.getElementById('cardBadge');
  const equationContainer = document.getElementById('equationContainer');
  const actionBtn = document.getElementById('actionBtn');
  const actionText = document.getElementById('actionText');
  const answerInput = document.getElementById('answerInput');
  const inputFeedback = document.getElementById('inputFeedback');
  const visualizerEl = document.getElementById('visualizer');
  const dotsAEl = document.getElementById('dotsA');
  const dotsBEl = document.getElementById('dotsB');
  const visualizerOpEl = document.getElementById('visualizerOp');
  const stepExplanationEl = document.getElementById('stepExplanation');

  // Teaser DOM Elements & Slide Navigation Toolbar
  const riddleCardEl = document.getElementById('riddleCard');
  const riddleBadgeEl = document.getElementById('riddleBadge');
  const riddleQuestionEl = document.getElementById('riddleQuestion');
  const riddleViewportEl = document.getElementById('riddleViewport');
  const riddleSolutionBoxEl = document.getElementById('riddleSolutionBox');
  const riddleAnswerTitleEl = document.getElementById('riddleAnswerTitle');
  const riddleExplanationEl = document.getElementById('riddleExplanation');
  const riddleActionBtn = document.getElementById('riddleActionBtn');
  const riddleActionText = document.getElementById('riddleActionText');
  const riddleAnswerInput = document.getElementById('riddleAnswerInput');
  const riddleInputFeedback = document.getElementById('riddleInputFeedback');
  const teaserTrackButtons = document.querySelectorAll('.teaser-track-btn');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const slideIndicator = document.getElementById('slideIndicator');
  const slideDots = document.getElementById('slideDots');

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
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
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
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
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
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 45; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 180,
        y: window.innerHeight / 2 - 40,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
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
      p.opacity -= 0.015;

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

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function simplifyFraction(n, d) {
    const g = gcd(Math.abs(n), Math.abs(d));
    return { num: n / g, den: d / g };
  }

  function renderFraction(n, d) {
    return `<span class="fraction"><span class="fraction-num">${n}</span><span class="fraction-den">${d}</span></span>`;
  }

  // ========================================================
  // GRADE DEFINITIONS & TOPIC CONFIGURATIONS
  // ========================================================
  const GRADE_TOPICS = {
    grade2: [
      { id: 'g2_add', label: '➕ Addition (to 20)' },
      { id: 'g2_sub', label: '➖ Subtraction (to 20)' },
      { id: 'g2_mix', label: '🔀 Mixed (to 20)' },
      { id: 'g2_chal', label: '🚀 Challenge (to 100)' },
      { id: 'g2_unusual', label: '🦄 Unusual Math' }
    ],
    grade3: [
      { id: 'g3_mult', label: '✖️ Times Tables (to 10)' },
      { id: 'g3_div', label: '➗ Division Facts' },
      { id: 'g3_addsub', label: '➕ 3-Digit Add/Sub' },
      { id: 'g3_geom', label: '📐 Area & Perimeter' },
      { id: 'g3_mix', label: '🔀 Mixed 3rd' },
      { id: 'g3_unusual', label: '🦄 Unusual Math' }
    ],
    grade4: [
      { id: 'g4_mult', label: '✖️ Multi-Digit (e.g. 24 × 6)' },
      { id: 'g4_div', label: '➗ Remainders (e.g. 29 ÷ 4)' },
      { id: 'g4_frac', label: '🍰 Like Fractions' },
      { id: 'g4_prime', label: '⭐ Factors & Primes' },
      { id: 'g4_dec', label: '🔢 Decimals (+ / -)' },
      { id: 'g4_mix', label: '🔀 Mixed 4th' },
      { id: 'g4_unusual', label: '🦄 Unusual Math' }
    ],
    grade5: [
      { id: 'g5_pemdas', label: '⚡ Order of Ops (PEMDAS)' },
      { id: 'g5_frac_unlike', label: '🍰 Unlike Fractions' },
      { id: 'g5_frac_mult', label: '✖️ Fraction Multiply' },
      { id: 'g5_dec_ops', label: '🔢 Decimal Ops (× / ÷)' },
      { id: 'g5_volume', label: '📦 Powers of 10 & Volume' },
      { id: 'g5_mix', label: '🔀 Mixed 5th' },
      { id: 'g5_unusual', label: '🦄 Unusual Math' }
    ]
  };

  function renderTopicBar() {
    if (activeTab === 'riddles') return;
    const topics = GRADE_TOPICS[activeTab] || [];
    const currentSelected = gradeTopicState[activeTab] || topics[0]?.id;

    topicBar.innerHTML = '';
    topics.forEach(t => {
      const btn = document.createElement('button');
      btn.className = `mode-btn ${t.id === currentSelected ? 'active' : ''}`;
      btn.dataset.topic = t.id;
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        topicBar.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gradeTopicState[activeTab] = t.id;
        showNewMathProblem();
      });
      topicBar.appendChild(btn);
    });
  }

  // ========================================================
  // UNUSUAL MATH GENERATORS (GRADES 2 - 5)
  // ========================================================
  function generateG2Unusual() {
    const kind = getRandomInt(1, 4);
    if (kind === 1) {
      const doubles = [
        { a: 1000, b: 1000, op: '+', ans: 2000, exp: 'Think 1 + 1 = 2, so 1 thousand + 1 thousand = 2 thousand (2,000)!' },
        { a: 2000, b: 2000, op: '+', ans: 4000, exp: '2 thousand + 2 thousand = 4 thousand (4,000)!' },
        { a: 500, b: 500, op: '+', ans: 1000, exp: 'Two 500s make one thousand (1,000)!' },
        { a: 100, b: 100, op: '+', ans: 200, exp: '100 + 100 = 200!' },
        { a: 300, b: 300, op: '+', ans: 600, exp: '300 + 300 = 600!' },
        { a: 2000, b: 1000, op: '-', ans: 1000, exp: '2 thousand minus 1 thousand leaves 1 thousand (1,000)!' },
        { a: 1000, b: 500, op: '-', ans: 500, exp: '1,000 minus 500 leaves 500!' }
      ];
      const p = doubles[getRandomInt(0, doubles.length - 1)];
      return {
        badge: '2nd Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a.toLocaleString()}</span><span class="op">${p.op}</span><span class="num">${p.b.toLocaleString()}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans.toLocaleString()}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    } else if (kind === 2) {
      const leaps = [
        { a: 99, b: 1, op: '+', ans: 100, exp: 'Adding 1 jumps straight into the next hundred (100)!' },
        { a: 999, b: 1, op: '+', ans: 1000, exp: 'Adding 1 leaps right into one thousand (1,000)!' },
        { a: 1000, b: 1, op: '-', ans: 999, exp: 'Taking 1 away from 1,000 steps back to 999!' },
        { a: 100, b: 1, op: '-', ans: 99, exp: '100 minus 1 = 99!' }
      ];
      const p = leaps[getRandomInt(0, leaps.length - 1)];
      return {
        badge: '2nd Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a.toLocaleString()}</span><span class="op">${p.op}</span><span class="num">${p.b.toLocaleString()}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans.toLocaleString()}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    } else if (kind === 3) {
      const twins = [
        { a: 22, ans: 44 },
        { a: 33, ans: 66 },
        { a: 44, ans: 88 },
        { a: 55, ans: 110 }
      ];
      const p = twins[getRandomInt(0, twins.length - 1)];
      return {
        badge: '2nd Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a}</span><span class="op">+</span><span class="num">${p.a}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: `Twin double: ${p.a} + ${p.a} = ${p.ans}!`
      };
    } else {
      return {
        badge: '2nd Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">1,000,000</span><span class="op">+</span><span class="num">0</span><span class="equals">=</span>`,
        answerHtml: `1,000,000`,
        answerRaw: `1000000`,
        hasVisualDots: false,
        stepExplanation: 'Adding 0 never changes the number, even for ONE MILLION!'
      };
    }
  }

  function generateG3Unusual() {
    const kind = getRandomInt(1, 3);
    if (kind === 1) {
      const ops = [
        { a: 100, b: 100, ans: 10000, exp: 'Count the zeros: 2 zeros + 2 zeros = 4 zeros! 1 with 4 zeros is TEN THOUSAND (10,000)!' },
        { a: 10, b: 1000, ans: 10000, exp: '1 zero + 3 zeros = 4 zeros = 10,000!' },
        { a: 50, b: 20, ans: 1000, exp: 'Multiply 5 × 2 = 10, then append the two zeros = 1,000!' },
        { a: 30, b: 30, ans: 900, exp: '3 × 3 = 9, plus two zeros = 900!' },
        { a: 200, b: 5, ans: 1000, exp: '2 × 5 = 10, plus two zeros = 1,000!' },
        { a: 40, b: 50, ans: 2000, exp: '4 × 5 = 20, plus two zeros = 2,000!' }
      ];
      const p = ops[getRandomInt(0, ops.length - 1)];
      return {
        badge: '3rd Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a.toLocaleString()}</span><span class="op">×</span><span class="num">${p.b.toLocaleString()}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans.toLocaleString()}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    } else if (kind === 2) {
      const quarters = [
        { a: 25, b: 4, ans: 100, exp: 'Think of money: 4 quarters = $1.00 = 100 cents!' },
        { a: 25, b: 8, ans: 200, exp: '8 quarters = $2.00 = 200 cents!' },
        { a: 50, b: 4, ans: 200, exp: 'Four 50-cent pieces = 200 cents!' }
      ];
      const p = quarters[getRandomInt(0, quarters.length - 1)];
      return {
        badge: '3rd Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a}</span><span class="op">×</span><span class="num">${p.b}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    } else {
      const nines = [
        { a: 9, b: 11, ans: 99, exp: '9 × 11 repeats 9 twice: 99!' },
        { a: 9, b: 111, ans: 999, exp: '9 × 111 = 999!' },
        { a: 99, b: 99, ans: 198, exp: 'Shortcut: (100 + 100) - 2 = 198!' }
      ];
      const p = nines[getRandomInt(0, nines.length - 1)];
      const op = p.a === 99 ? '+' : '×';
      return {
        badge: '3rd Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a}</span><span class="op">${op}</span><span class="num">${p.b}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    }
  }

  function generateG4Unusual() {
    const kind = getRandomInt(1, 3);
    if (kind === 1) {
      const millions = [
        { a: 1000, b: 1000, op: '×', ans: 1000000, exp: '1 thousand thousands = ONE MILLION (1,000,000)!' },
        { a: 1000000, b: 1000, op: '÷', ans: 1000, exp: 'One million divided by one thousand = 1,000!' },
        { a: 10000, b: 2, op: '÷', ans: 5000, exp: 'Half of ten thousand is five thousand (5,000)!' },
        { a: 10000, b: 10, op: '×', ans: 100000, exp: 'Ten thousand times ten = ONE HUNDRED THOUSAND (100,000)!' }
      ];
      const p = millions[getRandomInt(0, millions.length - 1)];
      return {
        badge: '4th Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a.toLocaleString()}</span><span class="op">${p.op}</span><span class="num">${p.b.toLocaleString()}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans.toLocaleString()}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    } else if (kind === 2) {
      const factorA = getRandomInt(5, 9);
      const factorB = getRandomInt(6, 12);
      return {
        badge: '4th Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${factorA}</span><span class="op">×</span><span class="num">${factorB}</span><span class="op">×</span><span class="num">0</span><span class="equals">=</span>`,
        answerHtml: `0`,
        answerRaw: `0`,
        hasVisualDots: false,
        stepExplanation: 'The Zero Black Hole! Multiplying any chain of numbers by 0 always results in 0!'
      };
    } else {
      const palindromes = [
        { a: 101, b: 7, ans: 707, exp: '101 × 7 sandwiches a zero between the sevens: 707!' },
        { a: 101, b: 24, ans: 2424, exp: '101 times a 2-digit number repeats the digits: 24 × 101 = 2,424!' },
        { a: 11, b: 11, ans: 121, exp: '11 × 11 is the famous palindrome number 121!' }
      ];
      const p = palindromes[getRandomInt(0, palindromes.length - 1)];
      return {
        badge: '4th Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a}</span><span class="op">×</span><span class="num">${p.b}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans.toLocaleString()}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    }
  }

  function generateG5Unusual() {
    const kind = getRandomInt(1, 4);
    if (kind === 1) {
      const traps = [
        { a: 100, b: 100, c: 0, ans: 100, exp: 'PEMDAS rule: Multiply first! 100 × 0 = 0, then 100 - 0 = 100 (NOT 0)!' },
        { a: 10, b: 10, c: 10, ans: 110, exp: 'Multiply first: 10 × 10 = 100. Then add: 10 + 100 = 110 (NOT 200)!' },
        { a: 50, b: 50, c: 2, ans: 150, exp: 'Multiply first: 50 × 2 = 100. Then add: 50 + 100 = 150 (NOT 200)!' }
      ];
      const p = traps[getRandomInt(0, traps.length - 1)];
      const op1 = p.c === 0 ? '-' : '+';
      return {
        badge: '5th Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a}</span><span class="op">${op1}</span><span class="num">${p.b}</span><span class="op">×</span><span class="num">${p.c}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    } else if (kind === 2) {
      const bases = [999, 1000000, 42, 777];
      const b = bases[getRandomInt(0, bases.length - 1)];
      return {
        badge: '5th Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${b.toLocaleString()}<sup>0</sup></span><span class="equals">=</span>`,
        answerHtml: `1`,
        answerRaw: `1`,
        hasVisualDots: false,
        stepExplanation: 'The Zero Exponent rule: Any non-zero number raised to the power of 0 equals 1!'
      };
    } else if (kind === 3) {
      const fracs = [
        { text: 'Half of 1,000,000', ans: 500000, exp: '1/2 of 1,000,000 = 500,000 (Five hundred thousand)!' },
        { text: '1,000 ÷ 250', ans: 4, exp: '250 goes into 1,000 exactly 4 times!' },
        { text: '1,000,000 ÷ 1,000,000', ans: 1, exp: 'Any number divided by itself equals 1!' }
      ];
      const p = fracs[getRandomInt(0, fracs.length - 1)];
      return {
        badge: '5th Grade • 🦄 Unusual Math!',
        leftHtml: `<span style="font-size:0.65em; color:#1e293b; font-weight:800;">${p.text}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans.toLocaleString()}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    } else {
      const negs = [
        { a: 5, b: 10, ans: -5, exp: '5 minus 10 drops 5 steps below zero into negative numbers: -5!' },
        { a: 0, b: 50, ans: -50, exp: '0 minus 50 = -50!' },
        { a: 10, b: 25, ans: -15, exp: '10 minus 25 = -15!' }
      ];
      const p = negs[getRandomInt(0, negs.length - 1)];
      return {
        badge: '5th Grade • 🦄 Unusual Math!',
        leftHtml: `<span class="num">${p.a}</span><span class="op">-</span><span class="num">${p.b}</span><span class="equals">=</span>`,
        answerHtml: `${p.ans}`,
        answerRaw: `${p.ans}`,
        hasVisualDots: false,
        stepExplanation: p.exp
      };
    }
  }

  // ========================================================
  // MATH PROBLEM GENERATOR (GRADES 2 - 5)
  // ========================================================
  function generateMathProblem() {
    const topic = gradeTopicState[activeTab] || 'g2_add';

    if (topic.startsWith('g2_')) {
      let subMode = topic;
      if (subMode === 'g2_mix') {
        subMode = Math.random() < 0.18 ? 'g2_unusual' : (Math.random() < 0.5 ? 'g2_add' : 'g2_sub');
      }

      if (subMode === 'g2_unusual') {
        return generateG2Unusual();
      }

      if (subMode === 'g2_add') {
        const sum = getRandomInt(4, 20);
        const a = getRandomInt(1, sum - 1);
        const b = sum - a;
        return {
          badge: '2nd Grade • Addition',
          leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${sum}`,
          answerRaw: `${sum}`,
          hasVisualDots: true,
          dotsA: a,
          dotsB: b,
          dotsOp: '+',
          stepExplanation: ''
        };
      } else if (subMode === 'g2_sub') {
        const a = getRandomInt(4, 20);
        const b = getRandomInt(1, a - 1);
        const ans = a - b;
        return {
          badge: '2nd Grade • Subtraction',
          leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${ans}`,
          answerRaw: `${ans}`,
          hasVisualDots: true,
          dotsA: a,
          dotsB: b,
          dotsOp: '-',
          stepExplanation: ''
        };
      } else {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = getRandomInt(12, 68);
          const b = getRandomInt(10, 100 - a);
          return {
            badge: '2nd Grade • Challenge (to 100)',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a + b}`,
            answerRaw: `${a + b}`,
            hasVisualDots: false,
            stepExplanation: `Break it into tens and ones: ${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${(Math.floor(a/10)+Math.floor(b/10))*10}, plus ${(a%10)+(b%10)} = ${a + b}!`
          };
        } else {
          const a = getRandomInt(25, 99);
          const b = getRandomInt(10, a - 5);
          return {
            badge: '2nd Grade • Challenge (to 100)',
            leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a - b}`,
            answerRaw: `${a - b}`,
            hasVisualDots: false,
            stepExplanation: `${a} minus ${b} leaves ${a - b}!`
          };
        }
      }
    }

    if (topic.startsWith('g3_')) {
      let subMode = topic;
      if (subMode === 'g3_mix') {
        const list = ['g3_mult', 'g3_div', 'g3_addsub', 'g3_geom', 'g3_unusual'];
        subMode = list[getRandomInt(0, list.length - 1)];
      }

      if (subMode === 'g3_unusual') {
        return generateG3Unusual();
      }

      if (subMode === 'g3_mult') {
        const a = getRandomInt(2, 10);
        const b = getRandomInt(2, 10);
        return {
          badge: '3rd Grade • Times Tables',
          leftHtml: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${a * b}`,
          answerRaw: `${a * b}`,
          hasVisualDots: false,
          stepExplanation: `${a} groups of ${b} equals ${a * b}!`
        };
      } else if (subMode === 'g3_div') {
        const b = getRandomInt(2, 10);
        const ans = getRandomInt(2, 10);
        const a = b * ans;
        return {
          badge: '3rd Grade • Division Facts',
          leftHtml: `<span class="num">${a}</span><span class="op">÷</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${ans}`,
          answerRaw: `${ans}`,
          hasVisualDots: false,
          stepExplanation: `Because ${b} × ${ans} = ${a}, ${a} ÷ ${b} = ${ans}!`
        };
      } else if (subMode === 'g3_addsub') {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = getRandomInt(120, 550);
          const b = getRandomInt(110, 440);
          return {
            badge: '3rd Grade • 3-Digit Addition',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a + b}`,
            answerRaw: `${a + b}`,
            hasVisualDots: false,
            stepExplanation: `Sum: ${a} + ${b} = ${a + b}!`
          };
        } else {
          const a = getRandomInt(300, 950);
          const b = getRandomInt(120, a - 50);
          return {
            badge: '3rd Grade • 3-Digit Subtraction',
            leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a - b}`,
            answerRaw: `${a - b}`,
            hasVisualDots: false,
            stepExplanation: `Difference: ${a} - ${b} = ${a - b}!`
          };
        }
      } else if (subMode === 'g3_geom') {
        const w = getRandomInt(3, 9);
        const h = getRandomInt(3, 8);
        const askArea = Math.random() < 0.5;
        const ans = askArea ? (w * h) : (2 * (w + h));
        const qType = askArea ? 'Area (Length × Width)' : 'Perimeter (Distance Around)';
        const formula = askArea ? `${w} × ${h} = ${ans} sq units` : `2×(${w} + ${h}) = ${ans} units`;

        const svg = `
          <div class="geom-container">
            <svg viewBox="0 0 200 110" width="100%" height="90">
              <rect x="35" y="20" width="130" height="70" rx="6" fill="#e0e7ff" stroke="#4f46e5" stroke-width="3" />
              <text x="100" y="14" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#4f46e5" text-anchor="middle">Width = ${w}</text>
              <text x="22" y="60" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#4f46e5" text-anchor="middle">H = ${h}</text>
            </svg>
            <div style="font-size:0.95rem; font-weight:700; color:#3730a3;">Find the ${qType}</div>
          </div>
        `;

        return {
          badge: '3rd Grade • Geometry',
          leftHtml: `<span class="op" style="font-size:0.7em;">${qType}</span><span class="equals">=</span>`,
          answerHtml: `${ans}`,
          answerRaw: `${ans}`,
          hasVisualDots: false,
          customVisualHtml: svg,
          stepExplanation: `${formula}!`
        };
      }
    }

    if (topic.startsWith('g4_')) {
      let subMode = topic;
      if (subMode === 'g4_mix') {
        const list = ['g4_mult', 'g4_div', 'g4_frac', 'g4_prime', 'g4_dec', 'g4_unusual'];
        subMode = list[getRandomInt(0, list.length - 1)];
      }

      if (subMode === 'g4_unusual') {
        return generateG4Unusual();
      }

      if (subMode === 'g4_mult') {
        const isTens = Math.random() < 0.35;
        if (isTens) {
          const a = getRandomInt(2, 8) * 10;
          const b = getRandomInt(2, 9) * 10;
          return {
            badge: '4th Grade • Multi-Digit Multiplication',
            leftHtml: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a * b}`,
            answerRaw: `${a * b}`,
            hasVisualDots: false,
            stepExplanation: `Multiply non-zero digits: ${(a/10)} × ${(b/10)} = ${(a/10)*(b/10)}, then append two zeros = ${a * b}!`
          };
        } else {
          const a = getRandomInt(14, 65);
          const b = getRandomInt(3, 8);
          return {
            badge: '4th Grade • Multi-Digit Multiplication',
            leftHtml: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a * b}`,
            answerRaw: `${a * b}`,
            hasVisualDots: false,
            stepExplanation: `(${Math.floor(a/10)*10} × ${b}) + (${(a%10)} × ${b}) = ${Math.floor(a/10)*10*b} + ${(a%10)*b} = ${a * b}!`
          };
        }
      } else if (subMode === 'g4_div') {
        const div = getRandomInt(3, 8);
        const hasRemainder = Math.random() < 0.6;
        if (hasRemainder) {
          const quotient = getRandomInt(4, 15);
          const rem = getRandomInt(1, div - 1);
          const dividend = quotient * div + rem;
          return {
            badge: '4th Grade • Division with Remainders',
            leftHtml: `<span class="num">${dividend}</span><span class="op">÷</span><span class="num">${div}</span><span class="equals">=</span>`,
            answerHtml: `${quotient} R ${rem}`,
            answerRaw: `${quotient} R ${rem}`,
            hasVisualDots: false,
            stepExplanation: `${div} goes into ${dividend} ${quotient} times with a remainder of ${rem} (since ${quotient} × ${div} + ${rem} = ${dividend})!`
          };
        } else {
          const quotient = getRandomInt(12, 28);
          const dividend = quotient * div;
          return {
            badge: '4th Grade • Long Division',
            leftHtml: `<span class="num">${dividend}</span><span class="op">÷</span><span class="num">${div}</span><span class="equals">=</span>`,
            answerHtml: `${quotient}`,
            answerRaw: `${quotient}`,
            hasVisualDots: false,
            stepExplanation: `${dividend} ÷ ${div} divides evenly into ${quotient}!`
          };
        }
      } else if (subMode === 'g4_frac') {
        const den = [4, 5, 6, 8, 10, 12][getRandomInt(0, 5)];
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = getRandomInt(1, den - 2);
          const b = getRandomInt(1, den - 1 - a);
          const sum = a + b;
          return {
            badge: '4th Grade • Like Fractions',
            leftHtml: `${renderFraction(a, den)} <span class="op">+</span> ${renderFraction(b, den)} <span class="equals">=</span>`,
            answerHtml: `${renderFraction(sum, den)}`,
            answerRaw: `${sum}/${den}`,
            hasVisualDots: false,
            stepExplanation: `Since denominators match (${den}), add the numerators: ${a} + ${b} = ${sum} (${sum}/${den})!`
          };
        } else {
          const a = getRandomInt(3, den - 1);
          const b = getRandomInt(1, a - 1);
          const diff = a - b;
          return {
            badge: '4th Grade • Like Fractions',
            leftHtml: `${renderFraction(a, den)} <span class="op">-</span> ${renderFraction(b, den)} <span class="equals">=</span>`,
            answerHtml: `${renderFraction(diff, den)}`,
            answerRaw: `${diff}/${den}`,
            hasVisualDots: false,
            stepExplanation: `Keep denominator ${den}, subtract numerators: ${a} - ${b} = ${diff} (${diff}/${den})!`
          };
        }
      } else if (subMode === 'g4_prime') {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
        const composites = [4, 6, 8, 9, 12, 14, 15, 18, 20, 21, 24, 25, 28];
        const isPrimeQ = Math.random() < 0.5;
        const num = isPrimeQ ? primes[getRandomInt(0, primes.length - 1)] : composites[getRandomInt(0, composites.length - 1)];

        return {
          badge: '4th Grade • Factors & Primes',
          leftHtml: `<span style="font-size:0.6em; color:#1e293b; font-weight:700;">Is <span style="color:#4f46e5; font-size:1.4em;">${num}</span> a Prime Number?</span><span class="equals">=</span>`,
          answerHtml: `${isPrimeQ ? 'YES' : 'NO'}`,
          answerRaw: isPrimeQ ? 'yes' : 'no',
          hasVisualDots: false,
          stepExplanation: isPrimeQ ? `${num} is PRIME because its only factors are 1 and ${num}!` : `${num} is COMPOSITE (not prime) because it can be factored into other whole numbers!`
        };
      } else if (subMode === 'g4_dec') {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = (getRandomInt(1, 9) / 10).toFixed(1);
          const b = (getRandomInt(2, 9) / 10).toFixed(1);
          const sum = (parseFloat(a) + parseFloat(b)).toFixed(1);
          return {
            badge: '4th Grade • Decimals',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${sum}`,
            answerRaw: `${sum}`,
            hasVisualDots: false,
            stepExplanation: `${a} tenths + ${b} tenths = ${sum}!`
          };
        } else {
          const a = (getRandomInt(15, 50) / 10).toFixed(1);
          const b = (getRandomInt(5, parseFloat(a) * 10 - 2) / 10).toFixed(1);
          const diff = (parseFloat(a) - parseFloat(b)).toFixed(1);
          return {
            badge: '4th Grade • Decimals',
            leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${diff}`,
            answerRaw: `${diff}`,
            hasVisualDots: false,
            stepExplanation: `${a} - ${b} = ${diff}!`
          };
        }
      }
    }

    if (topic.startsWith('g5_')) {
      let subMode = topic;
      if (subMode === 'g5_mix') {
        const list = ['g5_pemdas', 'g5_frac_unlike', 'g5_frac_mult', 'g5_dec_ops', 'g5_volume', 'g5_unusual'];
        subMode = list[getRandomInt(0, list.length - 1)];
      }

      if (subMode === 'g5_unusual') {
        return generateG5Unusual();
      }

      if (subMode === 'g5_pemdas') {
        const template = getRandomInt(1, 3);
        if (template === 1) {
          const a = getRandomInt(2, 12);
          const b = getRandomInt(2, 7);
          const c = getRandomInt(2, 6);
          const ans = a + b * c;
          return {
            badge: '5th Grade • Order of Operations',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="op">×</span><span class="num">${c}</span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${ans}`,
            hasVisualDots: false,
            stepExplanation: `1. Multiply first: ${b} × ${c} = ${b * c}. 2. Then add: ${a} + ${b * c} = ${ans}!`
          };
        } else if (template === 2) {
          const a = getRandomInt(2, 8);
          const b = getRandomInt(2, 8);
          const c = getRandomInt(2, 6);
          const ans = (a + b) * c;
          return {
            badge: '5th Grade • Order of Operations',
            leftHtml: `<span class="num">(${a}</span><span class="op">+</span><span class="num">${b})</span><span class="op">×</span><span class="num">${c}</span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${ans}`,
            hasVisualDots: false,
            stepExplanation: `1. Parentheses first: (${a} + ${b}) = ${a + b}. 2. Then multiply: ${a + b} × ${c} = ${ans}!`
          };
        } else {
          const c = getRandomInt(2, 5);
          const divResult = getRandomInt(2, 6);
          const b = c * divResult;
          const a = b + getRandomInt(5, 20);
          const ans = a - divResult;
          return {
            badge: '5th Grade • Order of Operations',
            leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="op">÷</span><span class="num">${c}</span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${ans}`,
            hasVisualDots: false,
            stepExplanation: `1. Divide first: ${b} ÷ ${c} = ${divResult}. 2. Then subtract: ${a} - ${divResult} = ${ans}!`
          };
        }
      } else if (subMode === 'g5_frac_unlike') {
        const pairs = [
          { d1: 2, d2: 4, lcd: 4 },
          { d1: 3, d2: 6, lcd: 6 },
          { d1: 2, d2: 3, lcd: 6 },
          { d1: 4, d2: 8, lcd: 8 },
          { d1: 2, d2: 5, lcd: 10 }
        ];
        const pair = pairs[getRandomInt(0, pairs.length - 1)];
        const n1 = 1;
        const n2 = 1;
        const conv1 = n1 * (pair.lcd / pair.d1);
        const conv2 = n2 * (pair.lcd / pair.d2);
        const sumNum = conv1 + conv2;
        const simp = simplifyFraction(sumNum, pair.lcd);
        const ansFormatted = simp.den === 1 ? `${simp.num}` : `${renderFraction(simp.num, simp.den)}`;

        return {
          badge: '5th Grade • Unlike Fractions',
          leftHtml: `${renderFraction(n1, pair.d1)} <span class="op">+</span> ${renderFraction(n2, pair.d2)} <span class="equals">=</span>`,
          answerHtml: `${ansFormatted}`,
          answerRaw: `${simp.num}/${simp.den}`,
          hasVisualDots: false,
          stepExplanation: `Common denominator is ${pair.lcd}: ${conv1}/${pair.lcd} + ${conv2}/${pair.lcd} = ${sumNum}/${pair.lcd}${simp.den !== pair.lcd ? ` (simplified to ${simp.num}/${simp.den})` : ''}!`
        };
      } else if (subMode === 'g5_frac_mult') {
        const n1 = getRandomInt(1, 3);
        const d1 = getRandomInt(n1 + 1, 5);
        const n2 = getRandomInt(1, 4);
        const d2 = getRandomInt(n2 + 1, 6);
        const prodNum = n1 * n2;
        const prodDen = d1 * d2;
        const simp = simplifyFraction(prodNum, prodDen);
        const ansFormatted = simp.den === 1 ? `${simp.num}` : `${renderFraction(simp.num, simp.den)}`;

        return {
          badge: '5th Grade • Multiplying Fractions',
          leftHtml: `${renderFraction(n1, d1)} <span class="op">×</span> ${renderFraction(n2, d2)} <span class="equals">=</span>`,
          answerHtml: `${ansFormatted}`,
          answerRaw: `${simp.num}/${simp.den}`,
          hasVisualDots: false,
          stepExplanation: `Multiply numerators: ${n1} × ${n2} = ${prodNum}. Multiply denominators: ${d1} × ${d2} = ${prodDen} (${prodNum}/${prodDen}${simp.den !== prodDen ? ` = ${simp.num}/${simp.den}` : ''})!`
        };
      } else if (subMode === 'g5_dec_ops') {
        const isMult = Math.random() < 0.6;
        if (isMult) {
          const a = (getRandomInt(11, 45) / 10).toFixed(1);
          const b = getRandomInt(2, 5);
          const ans = (parseFloat(a) * b).toFixed(1);
          return {
            badge: '5th Grade • Decimal Multiplication',
            leftHtml: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${ans}`,
            hasVisualDots: false,
            stepExplanation: `${a} × ${b} = ${ans}!`
          };
        } else {
          const div = getRandomInt(2, 6);
          const res = (getRandomInt(11, 40) / 10).toFixed(1);
          const a = (parseFloat(res) * div).toFixed(1);
          return {
            badge: '5th Grade • Decimal Division',
            leftHtml: `<span class="num">${a}</span><span class="op">÷</span><span class="num">${div}</span><span class="equals">=</span>`,
            answerHtml: `${res}`,
            answerRaw: `${res}`,
            hasVisualDots: false,
            stepExplanation: `${a} ÷ ${div} = ${res}!`
          };
        }
      } else if (subMode === 'g5_volume') {
        const isExp = Math.random() < 0.5;
        if (isExp) {
          const exp = getRandomInt(2, 4);
          const ans = Math.pow(10, exp).toLocaleString();
          return {
            badge: '5th Grade • Powers of 10',
            leftHtml: `<span class="num">10<sup>${exp}</sup></span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${Math.pow(10, exp)}`,
            hasVisualDots: false,
            stepExplanation: `10 raised to power of ${exp} is a 1 followed by ${exp} zeros = ${ans}!`
          };
        } else {
          const l = getRandomInt(2, 6);
          const w = getRandomInt(2, 5);
          const h = getRandomInt(2, 4);
          const vol = l * w * h;

          const svg = `
            <div class="geom-container">
              <svg viewBox="0 0 220 110" width="100%" height="90">
                <polygon points="60,40 120,20 170,35 110,55" fill="#c7d2fe" stroke="#4f46e5" stroke-width="2" />
                <polygon points="60,40 110,55 110,95 60,80" fill="#818cf8" stroke="#4f46e5" stroke-width="2" />
                <polygon points="110,55 170,35 170,75 110,95" fill="#4f46e5" stroke="#3730a3" stroke-width="2" />
                <text x="85" y="98" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">L = ${l}</text>
                <text x="150" y="92" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">W = ${w}</text>
                <text x="45" y="62" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">H = ${h}</text>
              </svg>
              <div style="font-size:0.95rem; font-weight:700; color:#3730a3;">Find Volume: Length × Width × Height</div>
            </div>
          `;

          return {
            badge: '5th Grade • Volume',
            leftHtml: `<span class="op" style="font-size:0.7em;">Volume</span><span class="equals">=</span>`,
            answerHtml: `${vol}`,
            answerRaw: `${vol}`,
            hasVisualDots: false,
            customVisualHtml: svg,
            stepExplanation: `Volume = Length × Width × Height = ${l} × ${w} × ${h} = ${vol} cubic units!`
          };
        }
      }
    }

    return {
      badge: 'Math Fact',
      leftHtml: `<span class="num">5</span><span class="op">+</span><span class="num">5</span><span class="equals">=</span>`,
      answerHtml: `10`,
      answerRaw: `10`,
      hasVisualDots: false,
      stepExplanation: '5 + 5 = 10!'
    };
  }

  function showNewMathProblem() {
    mathState = 'QUESTION';
    currentMathProblem = generateMathProblem();

    cardEl.style.animation = 'none';
    void cardEl.offsetWidth;
    cardEl.style.animation = 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    playPopSound();

    cardBadgeEl.textContent = currentMathProblem.badge;

    equationContainer.innerHTML = `
      <div class="equation" id="equation">
        ${currentMathProblem.leftHtml}
        <span class="solution-slot" id="solutionSlot">
          <span class="question-mark" id="questionMark">?</span>
          <span class="solution-val hidden" id="solutionVal">${currentMathProblem.answerHtml}</span>
        </span>
      </div>
    `;

    answerInput.value = '';
    inputFeedback.textContent = '';
    inputFeedback.className = 'input-feedback';

    stepExplanationEl.classList.add('hidden');
    stepExplanationEl.textContent = '';

    if (currentMathProblem.hasVisualDots) {
      visualizerEl.style.display = 'flex';
      dotsAEl.innerHTML = '';
      dotsBEl.innerHTML = '';
      visualizerOpEl.textContent = currentMathProblem.dotsOp;

      for (let i = 0; i < currentMathProblem.dotsA; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot dot-blue';
        dotsAEl.appendChild(dot);
      }
      for (let i = 0; i < currentMathProblem.dotsB; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot dot-orange';
        dotsBEl.appendChild(dot);
      }
    } else if (currentMathProblem.customVisualHtml) {
      visualizerEl.style.display = 'flex';
      visualizerEl.innerHTML = currentMathProblem.customVisualHtml;
    } else {
      visualizerEl.style.display = 'none';
    }

    actionBtn.classList.remove('next-mode');
    actionText.textContent = 'Reveal Solution';
  }

  function revealMathSolution() {
    mathState = 'SOLUTION';

    const questionMarkEl = document.getElementById('questionMark');
    const solutionValEl = document.getElementById('solutionVal');
    if (questionMarkEl) questionMarkEl.classList.add('hidden');
    if (solutionValEl) solutionValEl.classList.remove('hidden');

    if (currentMathProblem.stepExplanation) {
      stepExplanationEl.textContent = currentMathProblem.stepExplanation;
      stepExplanationEl.classList.remove('hidden');
    }

    const typedVal = answerInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
    let isCorrectTyped = null;
    if (typedVal !== '') {
      const rawAns = currentMathProblem.answerRaw.toLowerCase().replace(/\s+/g, ' ');
      const cleanTyped = typedVal.replace(/,/g, '');
      const cleanRaw = rawAns.replace(/,/g, '');
      if (typedVal === rawAns || cleanTyped === cleanRaw) {
        isCorrectTyped = true;
        inputFeedback.textContent = '🌟 Spot on! Awesome work!';
        inputFeedback.className = 'input-feedback correct';
      } else {
        isCorrectTyped = false;
        inputFeedback.textContent = `Nice try! The answer is ${currentMathProblem.answerRaw}`;
        inputFeedback.className = 'input-feedback incorrect';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }
    ProfileManager.recordCompletion(activeTab, streak);
    saveStats();
    updateStatsUI();

    if (streak > 0 && streak % 5 === 0) {
      playChimeSound(true);
      triggerConfetti();
      streakPillEl.classList.add('bump');
      setTimeout(() => streakPillEl.classList.remove('bump'), 300);
    } else {
      playChimeSound(false);
    }

    actionBtn.classList.add('next-mode');
    actionText.textContent = 'Next Problem →';
  }

  function handleMathAdvance() {
    actionBtn.classList.add('pressed');
    setTimeout(() => actionBtn.classList.remove('pressed'), 120);

    if (mathState === 'QUESTION') {
      revealMathSolution();
    } else if (mathState === 'SOLUTION') {
      showNewMathProblem();
    }
  }

  // ========================================================
  // SPATIAL, VISUAL & LOGIC BRAIN TEASERS (SEQUENTIAL NUMBERED SLIDES)
  // ========================================================

  // Isometric 3D Cube Renderer Helper
  function drawIsoCube(originX, originY, size, label = null, isGhost = false) {
    const w = size;
    const h = size * 0.5;
    const topPts = `${originX},${originY} ${originX + w},${originY + h} ${originX},${originY + 2*h} ${originX - w},${originY + h}`;
    const leftPts = `${originX - w},${originY + h} ${originX},${originY + 2*h} ${originX},${originY + 2*h + w} ${originX - w},${originY + h + w}`;
    const rightPts = `${originX},${originY + 2*h} ${originX + w},${originY + h} ${originX + w},${originY + h + w} ${originX},${originY + 2*h + w}`;

    const topFill = isGhost ? 'rgba(147, 197, 253, 0.4)' : '#93c5fd';
    const leftFill = isGhost ? 'rgba(59, 130, 246, 0.4)' : '#3b82f6';
    const rightFill = isGhost ? 'rgba(29, 78, 216, 0.4)' : '#1d4ed8';
    const strokeColor = isGhost ? '#f59e0b' : '#ffffff';
    const strokeWidth = isGhost ? '2.5' : '1.5';
    const strokeDash = isGhost ? 'stroke-dasharray="4,3"' : '';

    let svg = `<g>`;
    svg += `<polygon points="${topPts}" fill="${topFill}" stroke="${strokeColor}" stroke-width="${strokeWidth}" ${strokeDash} />`;
    svg += `<polygon points="${leftPts}" fill="${leftFill}" stroke="${strokeColor}" stroke-width="${strokeWidth}" ${strokeDash} />`;
    svg += `<polygon points="${rightPts}" fill="${rightFill}" stroke="${strokeColor}" stroke-width="${strokeWidth}" ${strokeDash} />`;
    if (label !== null) {
      svg += `<circle cx="${originX}" cy="${originY + h + w/2}" r="12" fill="#ffffff" stroke="#10b981" stroke-width="2" />`;
      svg += `<text x="${originX}" y="${originY + h + w/2 + 4}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">${label}</text>`;
    }
    svg += `</g>`;
    return svg;
  }

  // Thought bubble placeholder for mental 3D riddles during question state
  function renderThoughtBubble(hintText = "Picture this 3D solid in your mind...") {
    return `
      <div class="thought-bubble-container">
        <div class="thought-icon">💭</div>
        <div class="thought-text">${hintText}</div>
        <div class="thought-hint">⌨️ Press [SPACE] to reveal the 3D model &amp; answer!</div>
      </div>
    `;
  }

  // ========================================================
  // TRACK 1: LOGIC RIDDLES (12 CURATED NUMBERED SLIDES)
  // ========================================================
  const LOGIC_SLIDES = [
    // Slide 1: Odd Seven
    {
      question: 'I am an odd number. Take away an alphabet letter and I become even. What number am I?',
      answerRaw: '7',
      answersAccepted: ['7', 'seven'],
      answerTitle: 'Answer: Seven (7)!',
      explanation: "When you remove the letter 'S' from the word SEVEN, you are left with EVEN!",
      render: (isRevealed) => {
        if (!isRevealed) {
          return `
            <div class="logic-riddle-container">
              <div class="logic-riddle-icon">🤔 🔤</div>
              <div class="logic-tiles-row">
                <span class="logic-tile">S</span>
                <span class="logic-tile">E</span>
                <span class="logic-tile">V</span>
                <span class="logic-tile">E</span>
                <span class="logic-tile">N</span>
              </div>
              <div class="logic-riddle-clue">Which alphabet letter could you take away?</div>
            </div>
          `;
        }
        return `
          <div class="logic-riddle-container">
            <div class="logic-tiles-row">
              <span class="logic-tile crossed">S</span>
              <span class="logic-tile green-glow">E</span>
              <span class="logic-tile green-glow">V</span>
              <span class="logic-tile green-glow">E</span>
              <span class="logic-tile green-glow">N</span>
            </div>
            <div class="logic-banner highlight">✨ S + EVEN = SEVEN! Take away 'S' ➡️ EVEN! ✨</div>
          </div>
        `;
      }
    },

    // Slide 2: 3 Apples Table
    {
      question: 'There are 3 juicy apples on a kitchen table. You take away 2 apples. How many apples do YOU have?',
      answerRaw: '2',
      answersAccepted: ['2', 'two', '2 apples', 'two apples'],
      answerTitle: 'Answer: 2 Apples!',
      explanation: 'You took 2 apples, so YOU have 2 apples! (There is 1 apple left sitting on the table).',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        // Table surface
        svg += `<rect x="40" y="140" width="380" height="18" rx="8" fill="#d97706" />`;
        svg += `<rect x="70" y="158" width="16" height="35" rx="4" fill="#b45309" />`;
        svg += `<rect x="374" y="158" width="16" height="35" rx="4" fill="#b45309" />`;
        if (!isRevealed) {
          // 3 apples on table
          svg += `<text x="120" y="125" font-size="44" text-anchor="middle">🍎</text>`;
          svg += `<text x="230" y="125" font-size="44" text-anchor="middle">🍎</text>`;
          svg += `<text x="340" y="125" font-size="44" text-anchor="middle">🍎</text>`;
          svg += `<text x="230" y="55" font-family="'Fredoka', sans-serif" font-size="18" font-weight="700" fill="#4f46e5" text-anchor="middle">3 Apples on the table... You grab 2!</text>`;
        } else {
          // 1 apple on table, 2 apples in hand box
          svg += `<text x="120" y="125" font-size="44" text-anchor="middle">🍎</text>`;
          svg += `<text x="120" y="80" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle">Left on table: 1</text>`;
          // Hands holding 2 apples
          svg += `<rect x="230" y="35" width="190" height="100" rx="16" fill="#d1fae5" stroke="#10b981" stroke-width="3" />`;
          svg += `<text x="285" y="95" font-size="40" text-anchor="middle">🍎</text>`;
          svg += `<text x="365" y="95" font-size="40" text-anchor="middle">🍎</text>`;
          svg += `<text x="325" y="122" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#047857" text-anchor="middle">YOU HOLD 2 APPLES!</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 3: 2nd Place Runner
    {
      question: 'You are running in a school race and you overtake the person in 2nd place. What place are you in now?',
      answerRaw: '2nd',
      answersAccepted: ['2nd', '2', 'second', 'second place', '2nd place'],
      answerTitle: 'Answer: 2nd Place!',
      explanation: 'You overtook the runner in 2nd place and took their spot! The runner in 1st place is still in front of you!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        // Track lanes
        svg += `<rect x="20" y="40" width="420" height="120" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3" />`;
        svg += `<line x1="20" y1="80" x2="440" y2="80" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8,6" />`;
        svg += `<line x1="20" y1="120" x2="440" y2="120" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8,6" />`;
        // Finish line banner
        svg += `<rect x="410" y="35" width="8" height="130" fill="#ef4444" />`;
        svg += `<text x="414" y="25" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#ef4444" text-anchor="middle">FINISH</text>`;

        if (!isRevealed) {
          // 1st place ahead
          svg += `<text x="340" y="70" font-size="30" text-anchor="middle">🏃‍♂️</text>`;
          svg += `<rect x="320" y="20" width="42" height="18" rx="6" fill="#f59e0b" />`;
          svg += `<text x="341" y="33" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">1st</text>`;
          // 2nd place
          svg += `<text x="210" y="110" font-size="30" text-anchor="middle">🏃‍♀️</text>`;
          svg += `<rect x="190" y="80" width="42" height="18" rx="6" fill="#94a3b8" />`;
          svg += `<text x="211" y="93" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">2nd</text>`;
          // YOU coming up
          svg += `<text x="100" y="150" font-size="30" text-anchor="middle">🏃⚡</text>`;
          svg += `<rect x="80" y="160" width="45" height="18" rx="6" fill="#6366f1" />`;
          svg += `<text x="102" y="173" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">YOU</text>`;
        } else {
          // 1st place still ahead
          svg += `<text x="350" y="70" font-size="30" text-anchor="middle">🏃‍♂️</text>`;
          svg += `<rect x="330" y="20" width="46" height="20" rx="6" fill="#f59e0b" />`;
          svg += `<text x="353" y="34" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">1st 🥇</text>`;
          // YOU in 2nd place!
          svg += `<text x="230" y="110" font-size="34" text-anchor="middle">🏃✨</text>`;
          svg += `<rect x="195" y="72" width="70" height="22" rx="8" fill="#10b981" />`;
          svg += `<text x="230" y="87" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">YOU: 2nd 🥈</text>`;
          // Overtaken runner now 3rd
          svg += `<text x="90" y="150" font-size="30" text-anchor="middle">🏃‍♀️💨</text>`;
          svg += `<rect x="68" y="160" width="46" height="20" rx="6" fill="#d97706" />`;
          svg += `<text x="91" y="174" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">3rd 🥉</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 4: Hens & Eggs
    {
      question: 'If 3 hens lay 3 eggs in 3 days, how many eggs does 1 single hen lay in 3 days?',
      answerRaw: '1',
      answersAccepted: ['1', 'one', '1 egg', 'one egg'],
      answerTitle: 'Answer: 1 Egg!',
      explanation: 'The laying speed is 1 egg per hen every 3 days! So 1 hen lays exactly 1 egg in 3 days!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        const hens = [
          { x: 80, label: 'Hen #1' },
          { x: 230, label: 'Hen #2' },
          { x: 380, label: 'Hen #3' }
        ];
        hens.forEach((h, idx) => {
          svg += `<rect x="${h.x - 55}" y="35" width="110" height="135" rx="16" fill="${isRevealed && idx === 0 ? '#ecfdf5' : '#ffffff'}" stroke="${isRevealed && idx === 0 ? '#10b981' : '#e2e8f0'}" stroke-width="${isRevealed && idx === 0 ? '3' : '2'}" />`;
          svg += `<text x="${h.x}" y="75" font-size="36" text-anchor="middle">🐔</text>`;
          svg += `<text x="${h.x}" y="105" font-family="'Fredoka', sans-serif" font-size="13" font-weight="700" fill="#475569" text-anchor="middle">${h.label}</text>`;
          if (isRevealed) {
            svg += `<text x="${h.x}" y="145" font-size="28" text-anchor="middle">🥚</text>`;
            svg += `<text x="${h.x}" y="162" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#047857" text-anchor="middle">1 egg / 3 days</text>`;
          } else {
            svg += `<text x="${h.x}" y="145" font-size="24" text-anchor="middle">🥚?</text>`;
          }
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 5: Guess My Number 62
    {
      question: 'I am a 2-digit number between 50 and 70. My tens digit is 3 times my ones digit. What number am I?',
      answerRaw: '62',
      answersAccepted: ['62', 'sixty two', 'sixty-two'],
      answerTitle: 'Answer: 62!',
      explanation: 'Between 50 and 70, the tens digit is 6. Since 6 = 3 × 2, the ones digit is 2! The number is 62!',
      render: (isRevealed) => {
        if (!isRevealed) {
          return `
            <div class="logic-riddle-container">
              <div class="logic-tiles-row">
                <div style="text-align:center">
                  <span class="logic-tile">6 ?</span>
                  <div style="font-size:0.85rem;font-weight:700;color:#64748b;margin-top:4px">TENS (50-70)</div>
                </div>
                <div style="text-align:center">
                  <span class="logic-tile">?</span>
                  <div style="font-size:0.85rem;font-weight:700;color:#64748b;margin-top:4px">ONES</div>
                </div>
              </div>
              <div class="logic-banner">🔍 Clue: Tens digit = 3 × Ones digit</div>
            </div>
          `;
        }
        return `
          <div class="logic-riddle-container">
            <div class="logic-tiles-row">
              <div style="text-align:center">
                <span class="logic-tile green-glow">6</span>
                <div style="font-size:0.85rem;font-weight:700;color:#047857;margin-top:4px">TENS</div>
              </div>
              <div style="text-align:center">
                <span class="logic-tile green-glow">2</span>
                <div style="font-size:0.85rem;font-weight:700;color:#047857;margin-top:4px">ONES</div>
              </div>
            </div>
            <div class="logic-banner highlight">✨ 6 is 3 times 2 (6 = 3 × 2)! Number = 62! ✨</div>
          </div>
        `;
      }
    },

    // Slide 6: Feathers vs Rocks
    {
      question: 'Which weighs more: a pound of fluffy feathers or a pound of heavy rocks?',
      answerRaw: 'same',
      answersAccepted: ['same', 'equal', 'neither', 'both', 'they weigh the same', 'the same', 'they are the same', 'none'],
      answerTitle: 'Answer: They weigh the exact SAME!',
      explanation: 'Both weigh exactly 1 pound (16 oz)! Feathers take up more volume, but a pound is a pound!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        // Fulcrum triangle
        svg += `<polygon points="230,120 215,160 245,160" fill="#475569" />`;
        svg += `<rect x="180" y="160" width="100" height="12" rx="4" fill="#334155" />`;
        // Balance beam
        svg += `<line x1="90" y1="120" x2="370" y2="120" stroke="#0284c7" stroke-width="6" stroke-linecap="round" />`;
        // Left pan (feathers)
        svg += `<line x1="90" y1="120" x2="90" y2="145" stroke="#94a3b8" stroke-width="2" />`;
        svg += `<ellipse cx="90" cy="148" rx="45" ry="8" fill="#cbd5e1" />`;
        svg += `<text x="90" y="135" font-size="28" text-anchor="middle">🪶🪶</text>`;
        svg += `<text x="90" y="175" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0284c7" text-anchor="middle">1 LB FEATHERS</text>`;
        // Right pan (rocks)
        svg += `<line x1="370" y1="120" x2="370" y2="145" stroke="#94a3b8" stroke-width="2" />`;
        svg += `<ellipse cx="370" cy="148" rx="45" ry="8" fill="#cbd5e1" />`;
        svg += `<text x="370" y="135" font-size="28" text-anchor="middle">🪨🪨</text>`;
        svg += `<text x="370" y="175" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0284c7" text-anchor="middle">1 LB ROCKS</text>`;

        if (isRevealed) {
          svg += `<rect x="165" y="45" width="130" height="34" rx="10" fill="#10b981" />`;
          svg += `<text x="230" y="67" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">⚖️ 1 lb = 1 lb !</text>`;
        } else {
          svg += `<text x="230" y="65" font-family="'Fredoka', sans-serif" font-size="32" font-weight="800" fill="#6366f1" text-anchor="middle">⚖️ ?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 7: Family Fishing
    {
      question: 'Two fathers and two sons go fishing together. Each catches 1 fish, and they bring home exactly 3 fish. How is that possible?',
      answerRaw: '3',
      answersAccepted: ['3', 'three', '3 people', 'three people', 'grandfather'],
      answerTitle: 'Answer: There are only 3 people!',
      explanation: 'The group consists of a Grandfather, his Son (who is also a dad), and his Grandson! 2 fathers and 2 sons among 3 generations!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        const people = [
          { x: 90, title: 'Grandfather', sub: 'Father #1', icon: '👴' },
          { x: 230, title: 'Father / Son', sub: 'Father #2 & Son #1', icon: '👨' },
          { x: 370, title: 'Grandson', sub: 'Son #2', icon: '👦' }
        ];
        people.forEach(p => {
          svg += `<rect x="${p.x - 55}" y="35" width="110" height="135" rx="16" fill="#ffffff" stroke="${isRevealed ? '#10b981' : '#e2e8f0'}" stroke-width="2.5" />`;
          svg += `<text x="${p.x}" y="80" font-size="38" text-anchor="middle">${p.icon}</text>`;
          svg += `<text x="${p.x}" y="112" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#1e293b" text-anchor="middle">${p.title}</text>`;
          if (isRevealed) {
            svg += `<text x="${p.x}" y="132" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">${p.sub}</text>`;
            svg += `<text x="${p.x}" y="156" font-size="20" text-anchor="middle">🐟</text>`;
          } else {
            svg += `<text x="${p.x}" y="145" font-size="20" text-anchor="middle">🎣 🐟?</text>`;
          }
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 8: Zero Phone Keypad
    {
      question: 'Multiply all the numbers on a telephone keypad together (1 × 2 × 3 × 4 × 5 × 6 × 7 × 8 × 9 × 0). What is the total?',
      answerRaw: '0',
      answersAccepted: ['0', 'zero'],
      answerTitle: 'Answer: 0!',
      explanation: 'The 0 key at the bottom multiplies the entire chain by zero! Any giant number × 0 = 0!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        // Phone keypad box
        svg += `<rect x="140" y="15" width="180" height="175" rx="18" fill="#1e293b" />`;
        const keys = [
          { k: '1', x: 170, y: 45 }, { k: '2', x: 230, y: 45 }, { k: '3', x: 290, y: 45 },
          { k: '4', x: 170, y: 85 }, { k: '5', x: 230, y: 85 }, { k: '6', x: 290, y: 85 },
          { k: '7', x: 170, y: 125 }, { k: '8', x: 230, y: 125 }, { k: '9', x: 290, y: 125 },
          { k: '0', x: 230, y: 165 }
        ];
        keys.forEach(key => {
          const isZero = key.k === '0';
          const fill = isZero && isRevealed ? '#10b981' : '#334155';
          const textFill = isZero && isRevealed ? '#ffffff' : '#f8fafc';
          svg += `<circle cx="${key.x}" cy="${key.y}" r="16" fill="${fill}" />`;
          svg += `<text x="${key.x}" y="${key.y + 5}" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="${textFill}" text-anchor="middle">${key.k}</text>`;
        });
        if (isRevealed) {
          svg += `<rect x="340" y="65" width="105" height="65" rx="14" fill="#d1fae5" stroke="#10b981" stroke-width="2.5" />`;
          svg += `<text x="392" y="92" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">ZERO VORTEX</text>`;
          svg += `<text x="392" y="118" font-family="'Fredoka', sans-serif" font-size="22" font-weight="800" fill="#047857" text-anchor="middle">= 0!</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 9: The Monster's Nose
    {
      question: 'If a friendly monster has a nose that is 12 inches long, what would its nose be?',
      answerRaw: 'foot',
      answersAccepted: ['foot', 'a foot', '1 foot', 'one foot'],
      answerTitle: 'Answer: A Foot!',
      explanation: '12 inches equals 1 foot! So the monster literally has a foot on its face!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        // Monster face
        svg += `<circle cx="120" cy="100" r="55" fill="#a7f3d0" stroke="#059669" stroke-width="3" />`;
        svg += `<circle cx="105" cy="85" r="8" fill="#1e293b" />`;
        svg += `<circle cx="135" cy="85" r="8" fill="#1e293b" />`;
        svg += `<path d="M105,120 Q120,135 135,120" stroke="#047857" stroke-width="3" fill="none" />`;

        // Ruler extending horizontally
        svg += `<rect x="175" y="85" width="220" height="30" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />`;
        for (let i = 1; i <= 12; i++) {
          const rx = 175 + i * (220 / 12);
          svg += `<line x1="${rx}" y1="85" x2="${rx}" y2="${i % 3 === 0 ? 102 : 94}" stroke="#ca8a04" stroke-width="1.5" />`;
        }
        svg += `<text x="285" y="105" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#854d0e" text-anchor="middle">12 INCHES</text>`;

        if (isRevealed) {
          svg += `<rect x="230" y="130" width="120" height="32" rx="10" fill="#ec4899" />`;
          svg += `<text x="290" y="152" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">🦶 A FOOT!</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 10: Hopscotch Multiples (3s & 4s)
    {
      question: 'I am a whole number less than 20. If you count by 3s you land on me. If you count by 4s you land on me. What number am I?',
      answerRaw: '12',
      answersAccepted: ['12', 'twelve'],
      answerTitle: 'Answer: 12!',
      explanation: 'Multiples of 3: 3, 6, 9, 12, 15, 18. Multiples of 4: 4, 8, 12, 16. Both land on 12!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        // Line 1: 3s
        svg += `<text x="60" y="65" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#0284c7">🐸 By 3s:</text>`;
        [3, 6, 9, 12, 15, 18].forEach((n, idx) => {
          const x = 140 + idx * 52;
          const isMatch = n === 12;
          const fill = isRevealed && isMatch ? '#10b981' : '#e0f2fe';
          const stroke = isRevealed && isMatch ? '#047857' : '#38bdf8';
          svg += `<circle cx="${x}" cy="60" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;
          svg += `<text x="${x}" y="${65}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="${isRevealed && isMatch ? '#fff' : '#0369a1'}" text-anchor="middle">${n}</text>`;
        });

        // Line 2: 4s
        svg += `<text x="60" y="135" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#d97706">🐰 By 4s:</text>`;
        [4, 8, 12, 16].forEach((n, idx) => {
          const x = 140 + idx * 65;
          const isMatch = n === 12;
          const fill = isRevealed && isMatch ? '#10b981' : '#fef3c7';
          const stroke = isRevealed && isMatch ? '#047857' : '#f59e0b';
          svg += `<circle cx="${x}" cy="130" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;
          svg += `<text x="${x}" y="${135}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="${isRevealed && isMatch ? '#fff' : '#b45309'}" text-anchor="middle">${n}</text>`;
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 11: Age Riddle
    {
      question: 'What goes up and up, but never, ever comes down?',
      answerRaw: 'age',
      answersAccepted: ['age', 'your age', 'my age', 'years'],
      answerTitle: 'Answer: Your Age!',
      explanation: 'Every birthday your age goes up by 1 year. You can never get younger!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        // Upward timeline arrow
        svg += `<line x1="60" y1="150" x2="380" y2="50" stroke="#6366f1" stroke-width="6" stroke-linecap="round" />`;
        svg += `<polygon points="380,35 395,55 370,60" fill="#6366f1" />`;

        // Milestones
        const steps = [
          { x: 100, y: 140, age: 'Age 6' },
          { x: 180, y: 115, age: 'Age 7' },
          { x: 260, y: 90, age: 'Age 8' },
          { x: 340, y: 65, age: 'Age 9+' }
        ];
        steps.forEach(s => {
          svg += `<circle cx="${s.x}" cy="${s.y}" r="12" fill="#ffffff" stroke="#6366f1" stroke-width="3" />`;
          svg += `<text x="${s.x}" y="${s.y + 24}" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#475569" text-anchor="middle">${s.age}</text>`;
        });

        if (isRevealed) {
          svg += `<text x="230" y="40" font-size="34" text-anchor="middle">🎂 🎉 🎈</text>`;
        } else {
          svg += `<text x="230" y="40" font-size="34" text-anchor="middle">❓ 🚀 ❓</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 12: Carton of Eggs
    {
      question: 'There are 6 eggs in a carton. 6 hungry kids each take 1 egg. Yet 1 egg is still left in the carton! How?',
      answerRaw: 'carton',
      answersAccepted: ['carton', 'the carton', 'box', 'the box', 'basket', 'last kid', 'in the carton'],
      answerTitle: 'Answer: The last kid took the carton!',
      explanation: 'The first 5 kids took their eggs out. The 6th kid took the carton with the egg still sitting inside it!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        // 5 kids holding eggs
        for (let i = 0; i < 5; i++) {
          const x = 50 + i * 55;
          svg += `<text x="${x}" y="90" font-size="28" text-anchor="middle">🧒</text>`;
          svg += `<text x="${x}" y="125" font-size="20" text-anchor="middle">🥚</text>`;
        }

        // 6th kid
        svg += `<text x="360" y="90" font-size="32" text-anchor="middle">👧✨</text>`;
        if (isRevealed) {
          // Carton with 1 egg inside
          svg += `<rect x="325" y="105" width="70" height="42" rx="8" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />`;
          svg += `<text x="360" y="132" font-size="20" text-anchor="middle">🥚</text>`;
          svg += `<text x="360" y="165" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#c2410c" text-anchor="middle">Carton + Egg!</text>`;
        } else {
          svg += `<rect x="325" y="105" width="70" height="42" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4" />`;
          svg += `<text x="360" y="132" font-family="'Fredoka', sans-serif" font-size="20" font-weight="800" fill="#94a3b8" text-anchor="middle">?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    }
  ];

  // ========================================================
  // TRACK 2: VISUAL & SPATIAL RIDDLES (10 CURATED NUMBERED SLIDES)
  // ========================================================
  const SHAPES = [
    { name: 'Circle', color: '#3b82f6', draw: (x, y) => `<circle cx="${x}" cy="${y}" r="22" fill="#3b82f6" />` },
    { name: 'Square', color: '#ec4899', draw: (x, y) => `<rect x="${x-20}" y="${y-20}" width="40" height="40" rx="6" fill="#ec4899" />` },
    { name: 'Triangle', color: '#f59e0b', draw: (x, y) => `<polygon points="${x},${y-24} ${x-22},${y+18} ${x+22},${y+18}" fill="#f59e0b" />` }
  ];

  const ARROWS = [
    { name: 'Up', deg: 0 },
    { name: 'Right', deg: 90 },
    { name: 'Down', deg: 180 },
    { name: 'Left', deg: 270 }
  ];

  const VISUAL_SLIDES = [
    // Slide 1: Shape Pattern Sequence
    {
      question: 'What shape comes next in the pattern?',
      answerRaw: 'triangle',
      answersAccepted: ['triangle', 'a triangle'],
      answerTitle: 'Answer: Triangle!',
      explanation: 'The sequence repeats: Circle ➡️ Square ➡️ Triangle. Next is the Triangle!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 120" width="100%" height="120" xmlns="http://www.w3.org/2000/svg">`;
        const seq = [SHAPES[0], SHAPES[1], SHAPES[2], SHAPES[0], SHAPES[1], SHAPES[2]];
        seq.forEach((item, idx) => {
          const x = 38 + idx * 76;
          const y = 60;
          svg += `<rect x="${x-30}" y="15" width="60" height="90" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />`;
          if (idx === 5) {
            if (isRevealed) {
              svg += item.draw(x, y);
              svg += `<circle cx="${x}" cy="${y}" r="26" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="4,4" />`;
            } else {
              svg += `<text x="${x}" y="${y+12}" font-family="'Fredoka', sans-serif" font-size="34" font-weight="700" fill="#6366f1" text-anchor="middle">?</text>`;
            }
          } else {
            svg += item.draw(x, y);
          }
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 2: 3D Cube Stack (2x2 with 2 on top)
    {
      question: 'How many cubes are in this stack? (Watch out for the hidden foundation cube!)',
      answerRaw: '6',
      answersAccepted: ['6', 'six', '6 cubes'],
      answerTitle: 'Answer: 6 Cubes!',
      explanation: 'There are 4 cubes on the bottom layer and 2 on the top layer = 6 cubes in total!',
      render: (isRevealed) => {
        const size = 32;
        const centerX = 230;
        const centerY = 130;
        let svg = `<svg viewBox="0 0 460 230" width="100%" height="230" xmlns="http://www.w3.org/2000/svg">`;
        const cubes = [
          { gx: 0, gy: 0, gz: 0, hidden: true },
          { gx: 1, gy: 0, gz: 0, hidden: false },
          { gx: 0, gy: 1, gz: 0, hidden: false },
          { gx: 1, gy: 1, gz: 0, hidden: false },
          { gx: 0, gy: 0, gz: 1, hidden: false },
          { gx: 1, gy: 0, gz: 1, hidden: false }
        ];
        const sorted = [...cubes].sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy) || (a.gz - b.gz));
        sorted.forEach((cube, index) => {
          const ox = centerX + (cube.gx - cube.gy) * size;
          const oy = centerY + (cube.gx + cube.gy) * (size * 0.5) - cube.gz * size;
          const label = isRevealed ? (index + 1) : null;
          const isGhost = isRevealed && cube.hidden;
          svg += drawIsoCube(ox, oy, size, label, isGhost);
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 3: Butterfly Mirror Symmetry
    {
      question: 'Look at the mirror line! What does the complete butterfly look like?',
      answerRaw: 'butterfly',
      answersAccepted: ['butterfly', 'wings', 'wing'],
      answerTitle: 'Answer: Symmetrical Butterfly!',
      explanation: 'When folded along the purple dotted mirror line, both wings match identically!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 230" width="100%" height="230" xmlns="http://www.w3.org/2000/svg">`;
        const pathLeft = 'M230,50 C180,30 130,50 140,90 C145,115 190,115 230,125 C170,140 160,185 190,195 C215,200 225,160 230,145';
        const pathRight = 'M230,50 C280,30 330,50 320,90 C315,115 270,115 230,125 C290,140 300,185 270,195 C245,200 235,160 230,145';
        svg += `<path d="${pathLeft}" fill="#fbcfe8" stroke="#ec4899" stroke-width="4" stroke-linejoin="round" />`;
        svg += `<line x1="230" y1="20" x2="230" y2="215" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="6,6" />`;
        svg += `<rect x="180" y="8" width="100" height="20" rx="6" fill="#8b5cf6" />`;
        svg += `<text x="230" y="22" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">MIRROR LINE</text>`;
        if (isRevealed) {
          svg += `<path d="${pathRight}" fill="#fbcfe8" stroke="#ec4899" stroke-width="4" stroke-linejoin="round" />`;
          svg += `<circle cx="280" cy="120" r="16" fill="#10b981" />`;
          svg += `<path d="M273,120 L278,125 L288,114" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" />`;
        } else {
          svg += `<rect x="250" y="65" width="120" height="110" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,6" />`;
          svg += `<text x="310" y="132" font-family="'Fredoka', sans-serif" font-size="44" font-weight="800" fill="#94a3b8" text-anchor="middle">?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 4: Triangle Detective (Count the triangles)
    {
      question: 'How many triangles can you find in this shape?',
      answerRaw: '5',
      answersAccepted: ['5', 'five', '5 triangles'],
      answerTitle: 'Answer: 5 Triangles!',
      explanation: 'There are 4 small triangles inside + 1 big overall triangle = 5 triangles in total!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<polygon points="230,25 130,185 330,185" fill="#eff6ff" stroke="#3b82f6" stroke-width="4" stroke-linejoin="round" />`;
        svg += `<line x1="180" y1="105" x2="280" y2="105" stroke="#3b82f6" stroke-width="3" />`;
        svg += `<line x1="180" y1="105" x2="230" y2="185" stroke="#3b82f6" stroke-width="3" />`;
        svg += `<line x1="280" y1="105" x2="230" y2="185" stroke="#3b82f6" stroke-width="3" />`;
        if (isRevealed) {
          svg += `<circle cx="230" cy="80" r="14" fill="#10b981" /><text x="230" y="85" font-family="'Fredoka', sans-serif" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">1</text>`;
          svg += `<circle cx="180" cy="160" r="14" fill="#10b981" /><text x="180" y="165" font-family="'Fredoka', sans-serif" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">2</text>`;
          svg += `<circle cx="230" cy="145" r="14" fill="#10b981" /><text x="230" y="150" font-family="'Fredoka', sans-serif" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">3</text>`;
          svg += `<circle cx="280" cy="160" r="14" fill="#10b981" /><text x="280" y="165" font-family="'Fredoka', sans-serif" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">4</text>`;
          svg += `<rect x="330" y="40" width="115" height="32" rx="8" fill="#ec4899" />`;
          svg += `<text x="387" y="61" font-family="'Fredoka', sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">+ 1 BIG TRIANGLE!</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 5: Rotating Clockwise Arrow
    {
      question: 'Which direction does the 4th arrow point?',
      answerRaw: 'left',
      answersAccepted: ['left', 'pointing left', 'west'],
      answerTitle: 'Answer: Pointing Left!',
      explanation: 'The arrow rotates 90° clockwise at each step: Up ➡️ Right ➡️ Down ➡️ Left!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 120" width="100%" height="120" xmlns="http://www.w3.org/2000/svg">`;
        const seq = [ARROWS[0], ARROWS[1], ARROWS[2], ARROWS[3]];
        seq.forEach((arrow, idx) => {
          const x = 65 + idx * 110;
          const y = 60;
          svg += `<rect x="${x-40}" y="15" width="80" height="90" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />`;
          if (idx === 3 && !isRevealed) {
            svg += `<text x="${x}" y="${y+12}" font-family="'Fredoka', sans-serif" font-size="34" font-weight="700" fill="#6366f1" text-anchor="middle">?</text>`;
          } else {
            svg += `<g transform="translate(${x}, ${y}) rotate(${arrow.deg})">`;
            svg += `<line x1="0" y1="20" x2="0" y2="-15" stroke="${idx === 3 ? '#10b981' : '#6366f1'}" stroke-width="5" stroke-linecap="round" />`;
            svg += `<polygon points="0,-24 -10,-10 10,-10" fill="${idx === 3 ? '#10b981' : '#6366f1'}" />`;
            svg += `</g>`;
          }
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 6: 3D Staircase Block Count
    {
      question: 'How many blocks make up this 3-step staircase?',
      answerRaw: '6',
      answersAccepted: ['6', 'six', '6 blocks', '6 cubes'],
      answerTitle: 'Answer: 6 Blocks!',
      explanation: 'Step 1 has 1 block, Step 2 has 2 blocks, Step 3 has 3 blocks: 1 + 2 + 3 = 6 blocks total!',
      render: (isRevealed) => {
        const size = 30;
        const centerX = 230;
        const centerY = 135;
        let svg = `<svg viewBox="0 0 460 220" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">`;
        const cubes = [
          { gx: 0, gy: 0, gz: 0, hidden: true },
          { gx: 1, gy: 0, gz: 0, hidden: false },
          { gx: 2, gy: 0, gz: 0, hidden: false },
          { gx: 0, gy: 0, gz: 1, hidden: true },
          { gx: 1, gy: 0, gz: 1, hidden: false },
          { gx: 0, gy: 0, gz: 2, hidden: false }
        ];
        const sorted = [...cubes].sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy) || (a.gz - b.gz));
        sorted.forEach((cube, index) => {
          const ox = centerX + (cube.gx - cube.gy) * size;
          const oy = centerY + (cube.gx + cube.gy) * (size * 0.5) - cube.gz * size;
          const label = isRevealed ? (index + 1) : null;
          const isGhost = isRevealed && cube.hidden;
          svg += drawIsoCube(ox, oy, size, label, isGhost);
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 7: Heart Symmetry Line
    {
      question: 'When reflected across the mirror line, what completed shape do you get?',
      answerRaw: 'heart',
      answersAccepted: ['heart', 'a heart'],
      answerTitle: 'Answer: A Heart!',
      explanation: 'Both halves reflect perfectly across the center line to form a lovely Heart!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 230" width="100%" height="230" xmlns="http://www.w3.org/2000/svg">`;
        const pathLeft = 'M230,80 C230,40 160,40 160,95 C160,145 230,190 230,200';
        const pathRight = 'M230,80 C230,40 300,40 300,95 C300,145 230,190 230,200';
        svg += `<path d="${pathLeft}" fill="#fecaca" stroke="#ef4444" stroke-width="4" stroke-linejoin="round" />`;
        svg += `<line x1="230" y1="20" x2="230" y2="215" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="6,6" />`;
        svg += `<rect x="180" y="8" width="100" height="20" rx="6" fill="#8b5cf6" />`;
        svg += `<text x="230" y="22" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">MIRROR LINE</text>`;
        if (isRevealed) {
          svg += `<path d="${pathRight}" fill="#fecaca" stroke="#ef4444" stroke-width="4" stroke-linejoin="round" />`;
          svg += `<circle cx="280" cy="120" r="16" fill="#10b981" />`;
          svg += `<path d="M273,120 L278,125 L288,114" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" />`;
        } else {
          svg += `<rect x="250" y="65" width="120" height="110" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,6" />`;
          svg += `<text x="310" y="132" font-family="'Fredoka', sans-serif" font-size="44" font-weight="800" fill="#94a3b8" text-anchor="middle">?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 8: Top View Orthographic Grid
    {
      question: 'If an eagle looks straight down from above, how many ground grid squares does it see?',
      answerRaw: '4',
      answersAccepted: ['4', 'four', '4 squares'],
      answerTitle: 'Answer: 4 Squares!',
      explanation: 'Looking straight down, you see a 2x2 grid of 4 squares! The 5th cube sits directly on top of another.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 420 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        const size = 28;
        const centerX = 140;
        const centerY = 120;
        const cubes = [
          { gx: 0, gy: 0, gz: 0 }, { gx: 1, gy: 0, gz: 0 },
          { gx: 0, gy: 1, gz: 0 }, { gx: 1, gy: 1, gz: 0 },
          { gx: 0, gy: 0, gz: 1 }
        ];
        const sorted = [...cubes].sort((a,b) => (a.gx+a.gy)-(b.gx+b.gy) || a.gz-b.gz);
        sorted.forEach(c => {
          const ox = centerX + (c.gx - c.gy) * size;
          const oy = centerY + (c.gx + c.gy) * (size * 0.5) - c.gz * size;
          svg += drawIsoCube(ox, oy, size);
        });
        svg += `<text x="140" y="30" font-size="24" text-anchor="middle">🦅 ⬇️</text>`;
        if (isRevealed) {
          svg += `<rect x="270" y="45" width="120" height="120" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />`;
          svg += `<text x="330" y="35" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#3b82f6" text-anchor="middle">TOP VIEW GRID (4)</text>`;
          const cellSize = 36;
          for (let gy = 0; gy < 2; gy++) {
            for (let gx = 0; gx < 2; gx++) {
              const cx = 294 + gx * cellSize;
              const cy = 65 + gy * cellSize;
              svg += `<rect x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" rx="4" fill="#10b981" stroke="#047857" stroke-width="1.5" />`;
            }
          }
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 9: Paper Fold & Punch
    {
      question: 'A paper square is folded in half and 1 hole is punched through. How many holes appear when unfolded?',
      answerRaw: '2',
      answersAccepted: ['2', 'two', '2 holes'],
      answerTitle: 'Answer: 2 Holes!',
      explanation: 'Because the paper was folded into 2 layers, 1 punch cuts through both layers, creating 2 symmetrical holes!',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 380 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="60" y="40" width="100" height="120" rx="6" fill="#f8fafc" stroke="#6366f1" stroke-width="3" />`;
        svg += `<line x1="60" y1="40" x2="60" y2="160" stroke="#a855f7" stroke-width="4" stroke-dasharray="5,4" />`;
        svg += `<circle cx="120" cy="100" r="10" fill="#ef4444" stroke="#991b1b" stroke-width="2" />`;
        svg += `<text x="110" y="180" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">Folded Half</text>`;
        svg += `<text x="190" y="105" font-size="22" text-anchor="middle">➡️</text>`;
        if (isRevealed) {
          svg += `<rect x="220" y="40" width="140" height="120" rx="6" fill="#f1f5f9" stroke="#10b981" stroke-width="3" />`;
          svg += `<line x1="290" y1="40" x2="290" y2="160" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4" />`;
          svg += `<circle cx="260" cy="100" r="10" fill="#ef4444" stroke="#991b1b" stroke-width="2" />`;
          svg += `<circle cx="320" cy="100" r="10" fill="#ef4444" stroke="#991b1b" stroke-width="2" />`;
          svg += `<text x="290" y="180" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Unfolded (2 Holes!)</text>`;
        } else {
          svg += `<rect x="220" y="40" width="140" height="120" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5,5" />`;
          svg += `<text x="290" y="110" font-family="'Fredoka', sans-serif" font-size="36" font-weight="800" fill="#94a3b8" text-anchor="middle">?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Slide 10: 3D Cube Net
    {
      question: 'Can this 6-square cross net fold up into a closed 3D cube without overlapping?',
      answerRaw: 'yes',
      answersAccepted: ['yes', 'y', 'true'],
      answerTitle: 'Answer: YES, It Folds!',
      explanation: 'This is a classic Latin cross cube net! Each of the 6 squares folds into one of the 6 faces of a cube.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 380 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        const size = 38;
        const originX = 140;
        const originY = 25;
        const netCoords = [
          { x: 1, y: 0 },
          { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
          { x: 1, y: 2 }
        ];
        netCoords.forEach((sq, idx) => {
          const px = originX + sq.x * size - 30;
          const py = originY + sq.y * size;
          svg += `<rect x="${px}" y="${py}" width="${size}" height="${size}" rx="4" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2.5" />`;
          svg += `<text x="${px + size/2}" y="${py + size/2 + 4}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#4f46e5" text-anchor="middle">${idx + 1}</text>`;
        });
        if (isRevealed) {
          svg += `<circle cx="310" cy="100" r="28" fill="#10b981" />`;
          svg += `<path d="M298,100 L306,108 L322,92" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" />`;
          svg += `<text x="310" y="145" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">PERFECT CUBE</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    }
  ];

  // ========================================================
  // TRACK 3: MENTAL 3D SPATIAL (6 CURATED NUMBERED SLIDES)
  // ========================================================
  const MENTAL_3D_SLIDES = [
    // Slide 1: Cube Edges
    {
      question: 'How many straight line edges are there on a cube?',
      answerRaw: '12',
      answersAccepted: ['12', 'twelve', '12 edges'],
      answerTitle: 'Answer: 12 Edges!',
      explanation: 'A cube has 4 edges on top (blue), 4 edges on bottom (purple), and 4 vertical posts (orange) = 12 straight edges total!',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Picture a cube in your mind. Count top, bottom, and side edges!");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <line x1="120" y1="65" x2="120" y2="155" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="4,4" />
            <line x1="120" y1="155" x2="200" y2="155" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="4,4" />
            <line x1="80" y1="185" x2="120" y2="155" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="4,4" />
            <!-- 4 Top Edges (Blue) -->
            <line x1="80" y1="95" x2="160" y2="95" stroke="#3b82f6" stroke-width="4.5" stroke-linecap="round" />
            <line x1="160" y1="95" x2="200" y2="65" stroke="#3b82f6" stroke-width="4.5" stroke-linecap="round" />
            <line x1="200" y1="65" x2="120" y2="65" stroke="#3b82f6" stroke-width="4.5" stroke-linecap="round" />
            <line x1="120" y1="65" x2="80" y2="95" stroke="#3b82f6" stroke-width="4.5" stroke-linecap="round" />
            <!-- 4 Vertical Edges (Orange) -->
            <line x1="80" y1="95" x2="80" y2="185" stroke="#f97316" stroke-width="4.5" stroke-linecap="round" />
            <line x1="160" y1="95" x2="160" y2="185" stroke="#f97316" stroke-width="4.5" stroke-linecap="round" />
            <line x1="200" y1="65" x2="200" y2="155" stroke="#f97316" stroke-width="4.5" stroke-linecap="round" />
            <!-- 4 Bottom Edges (Purple) -->
            <line x1="80" y1="185" x2="160" y2="185" stroke="#8b5cf6" stroke-width="4.5" stroke-linecap="round" />
            <line x1="160" y1="185" x2="200" y2="155" stroke="#8b5cf6" stroke-width="4.5" stroke-linecap="round" />
            <!-- Badges -->
            <rect x="235" y="45" width="105" height="26" rx="6" fill="#3b82f6" />
            <text x="287" y="62" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4 Top Edges</text>
            <rect x="235" y="85" width="105" height="26" rx="6" fill="#f97316" />
            <text x="287" y="102" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4 Pillars</text>
            <rect x="235" y="125" width="105" height="26" rx="6" fill="#8b5cf6" />
            <text x="287" y="142" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4 Base Edges</text>
          </svg>
        `;
      }
    },

    // Slide 2: Square Pyramid Corners (Vertices)
    {
      question: 'How many sharp corners (vertices) does a square pyramid have?',
      answerRaw: '5',
      answersAccepted: ['5', 'five', '5 corners', '5 vertices'],
      answerTitle: 'Answer: 5 Vertices (Corners)!',
      explanation: 'There are 4 corners on the square ground base plus 1 apex point on top = 5 corners total!',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Think of the Great Pyramid in Egypt: ground corners + the pointy top!");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,165 240,165 280,125 140,125" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" />
            <polygon points="190,35 100,165 240,165" fill="rgba(245, 158, 11, 0.4)" stroke="#b45309" stroke-width="2.5" />
            <polygon points="190,35 240,165 280,125" fill="rgba(217, 119, 6, 0.4)" stroke="#b45309" stroke-width="2.5" />
            <circle cx="190" cy="35" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="2" />
            <text x="190" y="39" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">1</text>
            <circle cx="100" cy="165" r="12" fill="#10b981" stroke="#ffffff" stroke-width="2" />
            <text x="100" y="169" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">2</text>
            <circle cx="240" cy="165" r="12" fill="#10b981" stroke="#ffffff" stroke-width="2" />
            <text x="240" y="169" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">3</text>
            <circle cx="280" cy="125" r="12" fill="#10b981" stroke="#ffffff" stroke-width="2" />
            <text x="280" y="129" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4</text>
            <circle cx="140" cy="125" r="12" fill="#10b981" stroke="#ffffff" stroke-width="2" />
            <text x="140" y="129" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">5</text>
          </svg>
        `;
      }
    },

    // Slide 3: Cylinder Flat Faces
    {
      question: 'How many flat circular faces does a soup can (cylinder) have?',
      answerRaw: '2',
      answersAccepted: ['2', 'two', '2 faces'],
      answerTitle: 'Answer: 2 Flat Faces!',
      explanation: 'A cylinder has 2 flat circular faces (top and bottom lids) and 1 smooth rolling curved surface!',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Picture a soup can sitting on the counter. How many flat sides?");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect x="130" y="65" width="100" height="90" fill="#bfdbfe" />
            <line x1="130" y1="65" x2="130" y2="155" stroke="#3b82f6" stroke-width="3" />
            <line x1="230" y1="65" x2="230" y2="155" stroke="#3b82f6" stroke-width="3" />
            <ellipse cx="180" cy="155" rx="50" ry="20" fill="#10b981" stroke="#047857" stroke-width="3" />
            <ellipse cx="180" cy="65" rx="50" ry="20" fill="#10b981" stroke="#047857" stroke-width="3" />
            <rect x="250" y="52" width="95" height="26" rx="6" fill="#10b981" />
            <text x="297" y="69" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Top Face #1</text>
            <rect x="250" y="142" width="95" height="26" rx="6" fill="#10b981" />
            <text x="297" y="159" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Bottom Face #2</text>
          </svg>
        `;
      }
    },

    // Slide 4: Cone Cross Section
    {
      question: 'If you slice a cone horizontally straight across parallel to its base, what 2D shape is the flat cut face?',
      answerRaw: 'circle',
      answersAccepted: ['circle', 'a circle'],
      answerTitle: 'Answer: A Circle!',
      explanation: 'Any horizontal flat cross-section of a cone forms a circular surface!',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Imagine slicing the top off an ice cream cone straight across with a knife!");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="180" cy="175" rx="70" ry="22" fill="#fed7aa" stroke="#ea580c" stroke-width="3" />
            <polygon points="180,35 110,175 250,175" fill="#ffedd5" />
            <ellipse cx="180" cy="115" rx="42" ry="14" fill="#10b981" stroke="#047857" stroke-width="3.5" />
            <polygon points="180,35 138,115 222,115" fill="rgba(251, 146, 60, 0.5)" stroke="#ea580c" stroke-width="2" stroke-dasharray="3,3" />
            <text x="180" y="119" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">CUT FACE = CIRCLE</text>
          </svg>
        `;
      }
    },

    // Slide 5: Triangular Prism Vertices (Corners)
    {
      question: 'How many sharp pointy corners (vertices) does a camping tent (triangular prism) have?',
      answerRaw: '6',
      answersAccepted: ['6', 'six', '6 corners', '6 vertices'],
      answerTitle: 'Answer: 6 Vertices (Corners)!',
      explanation: 'A triangular prism has 3 corners on the front triangular face and 3 corners on the back triangular face = 6 vertices in total!',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Picture a triangle tent in the woods. How many pointy corners does the tent frame have?");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <!-- Back triangle -->
            <polygon points="260,65 210,165 310,165" fill="#e0e7ff" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,4" />
            <!-- Connecting edges -->
            <line x1="120" y1="65" x2="260" y2="65" stroke="#4f46e5" stroke-width="3" />
            <line x1="70" y1="165" x2="210" y2="165" stroke="#4f46e5" stroke-width="3" />
            <line x1="170" y1="165" x2="310" y2="165" stroke="#4f46e5" stroke-width="3" />
            <!-- Front triangle -->
            <polygon points="120,65 70,165 170,165" fill="rgba(199, 210, 254, 0.6)" stroke="#4f46e5" stroke-width="3.5" />

            <!-- 6 glowing vertices -->
            <circle cx="120" cy="65" r="11" fill="#10b981" stroke="#fff" stroke-width="2" />
            <text x="120" y="69" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">1</text>
            <circle cx="70" cy="165" r="11" fill="#10b981" stroke="#fff" stroke-width="2" />
            <text x="70" y="169" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">2</text>
            <circle cx="170" cy="165" r="11" fill="#10b981" stroke="#fff" stroke-width="2" />
            <text x="170" y="169" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">3</text>
            <circle cx="260" cy="65" r="11" fill="#10b981" stroke="#fff" stroke-width="2" />
            <text x="260" y="69" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">4</text>
            <circle cx="210" cy="165" r="11" fill="#10b981" stroke="#fff" stroke-width="2" />
            <text x="210" y="169" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">5</text>
            <circle cx="310" cy="165" r="11" fill="#10b981" stroke="#fff" stroke-width="2" />
            <text x="310" y="169" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">6</text>
          </svg>
        `;
      }
    },

    // Slide 6: Shoebox Flat Rectangular Faces
    {
      question: 'How many flat rectangular faces does a cardboard shoebox have?',
      answerRaw: '6',
      answersAccepted: ['6', 'six', '6 faces'],
      answerTitle: 'Answer: 6 Faces!',
      explanation: 'A rectangular prism shoebox has 6 faces: Top, Bottom, Front, Back, Left, and Right!',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Picture a shoebox with its lid closed. Count all the flat sides!");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <!-- 3D Cuboid box -->
            <polygon points="80,105 200,105 260,65 140,65" fill="#fde68a" stroke="#d97706" stroke-width="2.5" />
            <polygon points="80,105 200,105 200,175 80,175" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" />
            <polygon points="200,105 260,65 260,135 200,175" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5" />
            <!-- Face Labels -->
            <text x="170" y="88" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#b45309" text-anchor="middle">1. TOP</text>
            <text x="140" y="145" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#b45309" text-anchor="middle">2. FRONT</text>
            <text x="230" y="130" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#c2410c" text-anchor="middle">3. RIGHT</text>
            <!-- Badge listing the 6 faces -->
            <rect x="265" y="45" width="85" height="110" rx="8" fill="#10b981" />
            <text x="307" y="65" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">+ 4. BOTTOM</text>
            <text x="307" y="85" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">+ 5. LEFT</text>
            <text x="307" y="105" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">+ 6. BACK</text>
            <text x="307" y="135" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fef08a" text-anchor="middle">= 6 FACES!</text>
          </svg>
        `;
      }
    }
  ];

  // ========================================================
  // SEQUENTIAL NUMBERED SLIDE CONTROLLER
  // ========================================================
  function getActiveDeck() {
    if (activeTeaserTrack === 'logic') return LOGIC_SLIDES;
    if (activeTeaserTrack === 'visual') return VISUAL_SLIDES;
    if (activeTeaserTrack === 'mental') return MENTAL_3D_SLIDES;
    return LOGIC_SLIDES;
  }

  function getTrackName() {
    if (activeTeaserTrack === 'logic') return 'Logic Riddle';
    if (activeTeaserTrack === 'visual') return 'Visual & Spatial';
    if (activeTeaserTrack === 'mental') return 'Mental 3D';
    return 'Brain Teaser';
  }

  function updateSlideToolbar() {
    const deck = getActiveDeck();
    const currentIdx = trackSlideIndices[activeTeaserTrack] || 0;
    const total = deck.length;

    slideIndicator.textContent = `Slide ${currentIdx + 1} of ${total}`;

    // Render navigation dots
    slideDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = `slide-dot ${i === currentIdx ? 'active' : ''}`;
      dot.title = `Go to Slide ${i + 1}`;
      dot.addEventListener('click', () => {
        showSlide(i);
      });
      slideDots.appendChild(dot);
    }

    prevSlideBtn.disabled = (currentIdx === 0);
    nextSlideBtn.disabled = (currentIdx === total - 1);
  }

  function showSlide(index) {
    const deck = getActiveDeck();
    if (index < 0) index = 0;
    if (index >= deck.length) index = deck.length - 1;
    trackSlideIndices[activeTeaserTrack] = index;

    currentRiddle = deck[index];
    riddleState = 'QUESTION';

    riddleCardEl.style.animation = 'none';
    void riddleCardEl.offsetWidth;
    riddleCardEl.style.animation = 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    playPopSound();

    riddleBadgeEl.textContent = `Slide ${index + 1} of ${deck.length} • ${getTrackName()}`;
    riddleQuestionEl.textContent = currentRiddle.question;

    riddleViewportEl.innerHTML = currentRiddle.render(false);
    riddleSolutionBoxEl.classList.add('hidden');

    riddleAnswerInput.value = '';
    riddleInputFeedback.textContent = '';
    riddleInputFeedback.className = 'input-feedback';

    riddleActionBtn.classList.remove('next-mode');
    riddleActionText.textContent = 'Reveal Solution';

    updateSlideToolbar();
  }

  function nextSlide() {
    const deck = getActiveDeck();
    const currentIdx = trackSlideIndices[activeTeaserTrack] || 0;
    if (currentIdx < deck.length - 1) {
      showSlide(currentIdx + 1);
    } else {
      showSlide(0); // Wrap around to first slide
    }
  }

  function prevSlide() {
    const deck = getActiveDeck();
    const currentIdx = trackSlideIndices[activeTeaserTrack] || 0;
    if (currentIdx > 0) {
      showSlide(currentIdx - 1);
    } else {
      showSlide(deck.length - 1); // Wrap to last slide
    }
  }

  function revealRiddleSolution() {
    riddleState = 'SOLUTION';
    riddleViewportEl.innerHTML = currentRiddle.render(true);
    riddleAnswerTitleEl.textContent = currentRiddle.answerTitle;
    riddleExplanationEl.textContent = currentRiddle.explanation;
    riddleSolutionBoxEl.classList.remove('hidden');

    const typedVal = riddleAnswerInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
    let isCorrectTyped = null;
    if (typedVal !== '') {
      if (currentRiddle.answersAccepted) {
        isCorrectTyped = currentRiddle.answersAccepted.some(ans => typedVal === ans.toLowerCase().trim());
      } else if (currentRiddle.answerRaw) {
        isCorrectTyped = (typedVal === currentRiddle.answerRaw.toLowerCase().trim());
      }

      if (isCorrectTyped) {
        riddleInputFeedback.textContent = '🌟 Spot on! Brilliant thinking!';
        riddleInputFeedback.className = 'input-feedback correct';
      } else {
        riddleInputFeedback.textContent = `Nice try! The answer is ${currentRiddle.answerRaw}`;
        riddleInputFeedback.className = 'input-feedback incorrect';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }
    ProfileManager.recordCompletion('riddles', streak);
    saveStats();
    updateStatsUI();

    if (streak > 0 && streak % 5 === 0) {
      playChimeSound(true);
      triggerConfetti();
      streakPillEl.classList.add('bump');
      setTimeout(() => streakPillEl.classList.remove('bump'), 300);
    } else {
      playChimeSound(false);
    }

    riddleActionBtn.classList.add('next-mode');
    riddleActionText.textContent = 'Next Slide →';
  }

  function handleRiddleAdvance() {
    riddleActionBtn.classList.add('pressed');
    setTimeout(() => riddleActionBtn.classList.remove('pressed'), 120);

    if (riddleState === 'QUESTION') {
      revealRiddleSolution();
    } else if (riddleState === 'SOLUTION') {
      nextSlide();
    }
  }

  // ========================================================
  // SCIENCE LAB (PHYSICS, ENGINEERING & CHEMISTRY FOR KIDS)
  // ========================================================

  // Science Lab State
  let activeScienceTrack = 'space'; // 'space' | 'air' | 'density' | 'chemistry'
  const trackScienceIndices = {
    space: 0,
    air: 0,
    density: 0,
    chemistry: 0
  };
  let currentScienceSlide = null;
  let scienceState = 'QUESTION'; // 'QUESTION' | 'SOLUTION'

  // Science DOM Elements
  const scienceSection = document.getElementById('scienceSection');
  const scienceCardEl = document.getElementById('scienceCard');
  const scienceBadgeEl = document.getElementById('scienceBadge');
  const scienceQuestionEl = document.getElementById('scienceQuestion');
  const scienceViewportEl = document.getElementById('scienceViewport');
  const scienceSolutionBoxEl = document.getElementById('scienceSolutionBox');
  const scienceAnswerTitleEl = document.getElementById('scienceAnswerTitle');
  const scienceExplanationEl = document.getElementById('scienceExplanation');
  const scienceActionBtn = document.getElementById('scienceActionBtn');
  const scienceActionText = document.getElementById('scienceActionText');
  const scienceAnswerInput = document.getElementById('scienceAnswerInput');
  const scienceInputFeedback = document.getElementById('scienceInputFeedback');
  const scienceTrackButtons = document.querySelectorAll('.science-track-btn');
  const prevScienceSlideBtn = document.getElementById('prevScienceSlideBtn');
  const nextScienceSlideBtn = document.getElementById('nextScienceSlideBtn');
  const scienceSlideIndicator = document.getElementById('scienceSlideIndicator');
  const scienceSlideDots = document.getElementById('scienceSlideDots');

  // ========================================================
  // SCIENCE SLIDES DATA (16 CURATED NUMBERED PROBLEMS)
  // ========================================================
  const SCIENCE_SLIDES = {
    // TRACK 1: 🌌 SPACE, GRAVITY & ORBITS (4 Slides)
    space: [
      // Slide 1: Apollo 15 Vacuum Drop (Hammer & Feather)
      {
        question: 'On the Moon with NO air (a pure vacuum), Apollo 15 astronaut David Scott dropped a heavy 3-lb steel hammer and a light falcon feather at the same moment. What happened?',
        answerRaw: 'hit together',
        answersAccepted: ['same', 'together', 'both', 'at the same time', 'same time', 'they hit together', 'hit at the same time', 'both hit', 'hit together', 'fell together'],
        answerTitle: 'Answer: They Hit the Ground at the EXACT Same Time!',
        explanation: 'In a vacuum with no air resistance, gravity accelerates ALL objects at the identical rate, regardless of weight! On Earth, air slows down the feather; on the airless Moon, hammer and feather land in perfect sync!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Moon surface
          svg += `<rect x="0" y="160" width="460" height="50" fill="#94a3b8" />`;
          svg += `<ellipse cx="90" cy="180" rx="30" ry="10" fill="#64748b" />`;
          svg += `<ellipse cx="360" cy="175" rx="40" ry="12" fill="#64748b" />`;
          // Black starry sky
          svg += `<rect x="0" y="0" width="460" height="160" fill="#0f172a" />`;
          svg += `<circle cx="50" cy="30" r="1.5" fill="#fff" /><circle cx="120" cy="50" r="1" fill="#fff" /><circle cx="210" cy="20" r="1.5" fill="#fff" /><circle cx="390" cy="40" r="1" fill="#fff" /><circle cx="430" cy="70" r="1.5" fill="#fff" />`;
          // Distant Earth in sky
          svg += `<circle cx="400" cy="35" r="18" fill="#3b82f6" />`;
          svg += `<path d="M390,30 Q400,25 410,32 Q405,45 395,40 Z" fill="#10b981" />`;

          if (!isRevealed) {
            // High drop point
            svg += `<text x="140" y="65" font-size="34" text-anchor="middle">🔨</text>`;
            svg += `<text x="140" y="90" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#93c5fd" text-anchor="middle">3 lb Steel Hammer</text>`;
            svg += `<text x="320" y="65" font-size="34" text-anchor="middle">🪶</text>`;
            svg += `<text x="320" y="90" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#93c5fd" text-anchor="middle">0.03 oz Feather</text>`;
            svg += `<line x1="230" y1="20" x2="230" y2="150" stroke="#334155" stroke-dasharray="4,4" stroke-width="2" />`;
            svg += `<rect x="180" y="110" width="100" height="26" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />`;
            svg += `<text x="230" y="127" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#38bdf8" text-anchor="middle">WHO LANDS 1st?</text>`;
          } else {
            // Both landed at the bottom!
            svg += `<line x1="140" y1="40" x2="140" y2="145" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" />`;
            svg += `<line x1="320" y1="40" x2="320" y2="145" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" />`;
            svg += `<text x="140" y="158" font-size="32" text-anchor="middle">🔨</text>`;
            svg += `<text x="320" y="158" font-size="32" text-anchor="middle">🪶</text>`;
            // Impact badge
            svg += `<rect x="150" y="55" width="160" height="42" rx="12" fill="#10b981" />`;
            svg += `<text x="230" y="73" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">PERFECT TIE!</text>`;
            svg += `<text x="230" y="90" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fef08a" text-anchor="middle">⚡ 0.00s Simultaneous!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 2: Cosmic Silence (Sound in Vacuum)
      {
        question: 'In sci-fi movies, space battles have loud booming explosions! If you stood outside a rocket in deep space, could you hear an asteroid explode nearby?',
        answerRaw: 'no',
        answersAccepted: ['no', 'nothing', 'silence', 'silent', 'nope', 'cannot', 'cant', 'you cant hear', 'complete silence', 'total silence'],
        answerTitle: 'Answer: NO! Complete, Absolute Silence!',
        explanation: 'Sound is a mechanical vibration wave that needs physical particles (air, water, or solid atoms) to bump into each other. Space is an empty vacuum with no air molecules to carry vibrations to your ears!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Split screen: Earth (Left) vs Deep Space (Right)
          svg += `<rect x="15" y="15" width="205" height="180" rx="14" fill="#eff6ff" stroke="#93c5fd" stroke-width="2" />`;
          svg += `<rect x="240" y="15" width="205" height="180" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2" />`;

          // Earth side
          svg += `<text x="117" y="42" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#0369a1" text-anchor="middle">🌍 ON EARTH (Air)</text>`;
          svg += `<text x="60" y="95" font-size="30" text-anchor="middle">💥</text>`;
          svg += `<path d="M85,85 Q110,65 110,95 Q110,125 85,105" fill="none" stroke="#0284c7" stroke-width="3" />`;
          svg += `<path d="M100,75 Q135,55 135,95 Q135,135 100,115" fill="none" stroke="#0284c7" stroke-width="3" />`;
          svg += `<text x="165" y="95" font-size="30" text-anchor="middle">👂</text>`;
          svg += `<rect x="50" y="145" width="135" height="24" rx="6" fill="#10b981" />`;
          svg += `<text x="117" y="161" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">🔊 Air Carries Waves!</text>`;

          // Space side
          svg += `<text x="342" y="42" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#93c5fd" text-anchor="middle">🚀 IN SPACE (Vacuum)</text>`;
          svg += `<text x="285" y="95" font-size="30" text-anchor="middle">💥</text>`;
          if (!isRevealed) {
            svg += `<text x="342" y="95" font-family="'Fredoka', sans-serif" font-size="28" font-weight="800" fill="#94a3b8" text-anchor="middle">❓ 👂 ❓</text>`;
          } else {
            svg += `<line x1="315" y1="75" x2="365" y2="115" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />`;
            svg += `<line x1="365" y1="75" x2="315" y2="115" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />`;
            svg += `<text x="390" y="95" font-size="28" text-anchor="middle">🔇</text>`;
            svg += `<rect x="275" y="145" width="135" height="24" rx="6" fill="#ef4444" />`;
            svg += `<text x="342" y="161" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">ZERO SOUND WAVES</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 3: Zero-G Illusion (Falling in Orbit)
      {
        question: 'Astronauts float weightlessly inside the Space Station. Is there NO gravity up where they fly in space?',
        answerRaw: 'there is gravity',
        answersAccepted: ['gravity exists', 'there is gravity', 'gravity', 'still gravity', 'myth', 'false', 'yes there is gravity', 'no'],
        answerTitle: 'Answer: Gravity is 90% as Strong Up There! (Perpetual Free-Fall)',
        explanation: 'Astronauts float NOT because gravity vanished, but because the station flies sideways at 17,500 mph while falling toward Earth! The curve of its fall matches the curvature of Earth, so they never hit the ground!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Earth sphere in lower left
          svg += `<circle cx="100" cy="230" r="160" fill="#1e3a8a" stroke="#3b82f6" stroke-width="3" />`;
          svg += `<path d="M50,140 Q100,110 140,150 Q160,200 110,220 Z" fill="#10b981" />`;
          svg += `<text x="100" y="195" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">EARTH</text>`;

          // Orbital path arc
          svg += `<path d="M80,30 Q240,30 350,150" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,6" />`;

          // Space station at peak of orbit
          svg += `<text x="180" y="38" font-size="32" text-anchor="middle">🛰️</text>`;
          svg += `<text x="220" y="38" font-size="24" text-anchor="middle">🧑‍🚀</text>`;

          if (isRevealed) {
            // Speed vector arrow (sideways)
            svg += `<line x1="180" y1="20" x2="270" y2="20" stroke="#10b981" stroke-width="3.5" marker-end="url(#arrow)" />`;
            svg += `<text x="230" y="14" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#10b981">17,500 mph Sideways</text>`;
            // Gravity vector arrow (down)
            svg += `<line x1="180" y1="30" x2="180" y2="85" stroke="#ef4444" stroke-width="3.5" />`;
            svg += `<text x="188" y="70" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#ef4444">Gravity Pulling Down</text>`;
            // Explanation badge
            svg += `<rect x="255" y="85" width="185" height="50" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />`;
            svg += `<text x="347" y="105" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#f59e0b" text-anchor="middle">PERPETUAL FREE-FALL</text>`;
            svg += `<text x="347" y="122" font-family="'Fredoka', sans-serif" font-size="10" font-weight="700" fill="#cbd5e1" text-anchor="middle">Falling AROUND the Earth!</text>`;
          } else {
            svg += `<rect x="260" y="85" width="170" height="42" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />`;
            svg += `<text x="345" y="111" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#64748b" text-anchor="middle">Zero-G or Falling? ❓</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 4: Planetary Gravity (Mass vs Weight)
      {
        question: 'If you weigh 60 lbs on Earth, how much would you weigh on a bathroom scale placed on the Moon?',
        answerRaw: '10',
        answersAccepted: ['10', '10 lbs', '10 pounds', 'ten', 'ten pounds', '1/6'],
        answerTitle: 'Answer: Only 10 Pounds! (1/6th of Earth Gravity)',
        explanation: 'Your body mass stays identical, but the Moon is much smaller than Earth and exerts only 1/6th as much gravitational pull! 60 lbs ÷ 6 = 10 lbs on the Moon scale!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Earth Side
          svg += `<rect x="20" y="20" width="195" height="170" rx="14" fill="#f0fdf4" stroke="#86efac" stroke-width="2" />`;
          svg += `<text x="117" y="45" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#166534" text-anchor="middle">🌍 ON EARTH</text>`;
          svg += `<text x="117" y="90" font-size="36" text-anchor="middle">🧒</text>`;
          svg += `<rect x="82" y="115" width="70" height="35" rx="8" fill="#15803d" />`;
          svg += `<text x="117" y="138" font-family="'Fredoka', sans-serif" font-size="16" font-weight="800" fill="#fff" text-anchor="middle">60 lbs</text>`;

          // Moon Side
          svg += `<rect x="245" y="20" width="195" height="170" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2" />`;
          svg += `<text x="342" y="45" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#93c5fd" text-anchor="middle">🌕 ON THE MOON</text>`;
          if (!isRevealed) {
            svg += `<text x="342" y="90" font-size="36" text-anchor="middle">🧑‍🚀</text>`;
            svg += `<rect x="307" y="115" width="70" height="35" rx="8" fill="#334155" />`;
            svg += `<text x="342" y="138" font-family="'Fredoka', sans-serif" font-size="18" font-weight="800" fill="#94a3b8" text-anchor="middle">? lbs</text>`;
          } else {
            // Jumping high in low gravity!
            svg += `<text x="342" y="70" font-size="36" text-anchor="middle">🧑‍🚀✨</text>`;
            svg += `<text x="342" y="95" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#38bdf8" text-anchor="middle">SUPER JUMP!</text>`;
            svg += `<rect x="307" y="115" width="70" height="35" rx="8" fill="#3b82f6" />`;
            svg += `<text x="342" y="138" font-family="'Fredoka', sans-serif" font-size="16" font-weight="800" fill="#fff" text-anchor="middle">10 lbs</text>`;
            svg += `<text x="342" y="172" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fbbf24" text-anchor="middle">(60 ÷ 6 = 10 lbs)</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // TRACK 2: 💨 AIR RESISTANCE & FRICTION (4 Slides)
    air: [
      // Slide 1: Flat Paper vs Crumpled Paper Ball
      {
        question: 'You drop two identical sheets of paper from the ceiling. Both weigh the exact same: one is flat, and one is squished into a tight ball. Which hits the floor first?',
        answerRaw: 'ball',
        answersAccepted: ['ball', 'crumpled', 'crumpled ball', 'the ball', 'the crumpled paper', 'crumpled paper', 'paper ball'],
        answerTitle: 'Answer: The Crumpled Paper Ball!',
        explanation: 'Both sheets weigh the exact same! But the flat paper has a wide surface area catching thousands of air molecules (air drag/brakes), while the crumpled ball slips smoothly through the air!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Floor line
          svg += `<line x1="30" y1="185" x2="430" y2="185" stroke="#475569" stroke-width="3" stroke-linecap="round" />`;

          // Left: Flat sheet
          svg += `<text x="120" y="30" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#0369a1" text-anchor="middle">FLAT PAPER (Same Wt)</text>`;
          if (!isRevealed) {
            svg += `<rect x="70" y="55" width="100" height="30" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />`;
            svg += `<text x="120" y="75" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#64748b" text-anchor="middle">📄 Flat Sheet</text>`;
          } else {
            svg += `<rect x="70" y="80" width="100" height="30" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />`;
            // Upward air drag arrows
            svg += `<path d="M80,130 L80,115 M75,122 L80,115 L85,122" stroke="#ef4444" stroke-width="2.5" />`;
            svg += `<path d="M120,130 L120,115 M115,122 L120,115 L125,122" stroke="#ef4444" stroke-width="2.5" />`;
            svg += `<path d="M160,130 L160,115 M155,122 L160,115 L165,122" stroke="#ef4444" stroke-width="2.5" />`;
            svg += `<text x="120" y="150" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#dc2626" text-anchor="middle">⬆️ HIGH AIR DRAG</text>`;
          }

          // Right: Crumpled ball
          svg += `<text x="340" y="30" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#15803d" text-anchor="middle">CRUMPLED BALL (Same Wt)</text>`;
          if (!isRevealed) {
            svg += `<circle cx="340" cy="70" r="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />`;
            svg += `<text x="340" y="75" font-size="16" text-anchor="middle">⚪</text>`;
          } else {
            // Already hit the ground!
            svg += `<circle cx="340" cy="170" r="18" fill="#dcfce7" stroke="#16a34a" stroke-width="3" />`;
            svg += `<text x="340" y="176" font-size="16" text-anchor="middle">⚡</text>`;
            svg += `<rect x="290" y="70" width="100" height="24" rx="6" fill="#16a34a" />`;
            svg += `<text x="340" y="86" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">HITS 1st! 🥇</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 2: The Parachute Brake
      {
        question: 'Why does a skydiver open a giant parachute canopy to slow down safely, even though the heavy cloth adds extra weight?',
        answerRaw: 'air resistance',
        answersAccepted: ['air resistance', 'drag', 'air', 'slows down', 'catches air', 'traps air', 'surface area'],
        answerTitle: 'Answer: It Traps a Massive Wall of Air (Drag Force)!',
        explanation: 'The huge parachute canopy multiplies surface area by hundreds of times! As it falls, it collides with millions of air molecules, generating an upward drag force that counters gravity!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Canopy dome
          svg += `<path d="M150,80 C150,20 310,20 310,80 Z" fill="#f43f5e" stroke="#be123c" stroke-width="3" />`;
          // Stripes on canopy
          svg += `<path d="M190,80 C190,28 270,28 270,80 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />`;
          // Strings
          svg += `<line x1="150" y1="80" x2="230" y2="150" stroke="#94a3b8" stroke-width="1.5" />`;
          svg += `<line x1="190" y1="80" x2="230" y2="150" stroke="#94a3b8" stroke-width="1.5" />`;
          svg += `<line x1="270" y1="80" x2="230" y2="150" stroke="#94a3b8" stroke-width="1.5" />`;
          svg += `<line x1="310" y1="80" x2="230" y2="150" stroke="#94a3b8" stroke-width="1.5" />`;
          // Skydiver
          svg += `<circle cx="230" cy="155" r="8" fill="#1e293b" />`;
          svg += `<line x1="230" y1="163" x2="230" y2="185" stroke="#1e293b" stroke-width="3" />`;

          if (isRevealed) {
            // Big upward air drag arrows under canopy
            svg += `<path d="M180,120 L180,90 M173,98 L180,90 L187,98" stroke="#3b82f6" stroke-width="4" />`;
            svg += `<path d="M230,120 L230,90 M223,98 L230,90 L237,98" stroke="#3b82f6" stroke-width="4" />`;
            svg += `<path d="M280,120 L280,90 M273,98 L280,90 L287,98" stroke="#3b82f6" stroke-width="4" />`;
            svg += `<rect x="330" y="45" width="115" height="42" rx="8" fill="#3b82f6" />`;
            svg += `<text x="387" y="63" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">UPWARD AIR DRAG</text>`;
            svg += `<text x="387" y="78" font-family="'Fredoka', sans-serif" font-size="10" font-weight="700" fill="#dbeafe" text-anchor="middle">Balances Gravity!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 3: Sledding Friction (Ice vs Grass)
      {
        question: 'Why does a plastic sled glide effortlessly down a snowy ice hill, but screeches to a dead stop on dry grass?',
        answerRaw: 'friction',
        answersAccepted: ['friction', 'friction stops it', 'ice is slippery', 'grass has friction', 'smooth vs rough', 'more friction'],
        answerTitle: 'Answer: Friction! (Microscopic Interlocking Teeth)',
        explanation: 'All surfaces have microscopic jagged bumps. Rough grass blades hook directly into the plastic sled bottom (high friction). On ice, pressure creates a thin slippery film of water that allows the sled to hydroplane smoothly!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Left: Ice Hill
          svg += `<polygon points="20,180 215,80 215,180" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2" />`;
          svg += `<text x="100" y="170" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#0284c7">❄️ Smooth Ice</text>`;
          svg += `<rect x="110" y="110" width="45" height="15" rx="4" fill="#ef4444" transform="rotate(-25 110 110)" />`;
          svg += `<text x="150" y="105" font-size="18">💨💨</text>`;

          // Right: Grass Hill
          svg += `<polygon points="245,180 440,80 440,180" fill="#dcfce7" stroke="#22c55e" stroke-width="2" />`;
          svg += `<text x="340" y="170" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#15803d">🌱 Rough Grass</text>`;
          svg += `<rect x="335" y="110" width="45" height="15" rx="4" fill="#ef4444" transform="rotate(-25 335 110)" />`;
          if (isRevealed) {
            svg += `<text x="375" y="105" font-size="18">🛑 STUCK!</text>`;
            svg += `<rect x="155" y="20" width="150" height="34" rx="8" fill="#1e293b" />`;
            svg += `<text x="230" y="42" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#facc15" text-anchor="middle">FRICTION = RESISTANCE</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 4: Wheels & Bearings (Rolling vs Sliding)
      {
        question: 'Why is dragging a 200-lb wooden box across concrete nearly impossible, but rolling it on a cart with wheels is super easy?',
        answerRaw: 'rolling friction',
        answersAccepted: ['wheels', 'rolling', 'rolling friction', 'less friction', 'rotation', 'bearings'],
        answerTitle: 'Answer: Rolling Cuts Friction by Over 90%!',
        explanation: 'Sliding scrapes every microscopic point of the box against concrete, generating friction and heat. Wheels rotate, meaning only a microscopic point touches the ground at any instant without scraping!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Concrete ground line
          svg += `<line x1="20" y1="165" x2="440" y2="165" stroke="#64748b" stroke-width="4" />`;

          // Left: Sliding box
          svg += `<rect x="60" y="85" width="80" height="80" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2" />`;
          svg += `<text x="100" y="130" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">200 LB</text>`;
          svg += `<text x="100" y="65" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#dc2626" text-anchor="middle">SLIDING (Scraping)</text>`;
          if (isRevealed) {
            svg += `<text x="100" y="180" font-size="14" text-anchor="middle">🔥 High Resistance</text>`;
          }

          // Right: Wheeled cart
          svg += `<rect x="280" y="85" width="80" height="60" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2" />`;
          svg += `<text x="320" y="120" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">200 LB</text>`;
          // Two wheels
          svg += `<circle cx="295" cy="155" r="10" fill="#1e293b" stroke="#3b82f6" stroke-width="3" />`;
          svg += `<circle cx="345" cy="155" r="10" fill="#1e293b" stroke="#3b82f6" stroke-width="3" />`;
          svg += `<text x="320" y="65" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#16a34a" text-anchor="middle">ROLLING (Effortless)</text>`;
          if (isRevealed) {
            svg += `<text x="320" y="185" font-size="14" text-anchor="middle">✨ Tiny Contact Point</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // TRACK 3: 🌊 DENSITY & VISCOSITY (4 Slides)
    density: [
      // Slide 1: Giant Steel Ship vs Tiny Pebble
      {
        question: 'A tiny solid pebble weighs only 1 ounce and sinks straight to the bottom. A giant cruise ship weighs 100,000 tons of steel and floats on top. Why?',
        answerRaw: 'density',
        answersAccepted: ['density', 'buoyancy', 'air', 'hollow', 'air inside', 'displaces water', 'archimedes', 'water displacement'],
        answerTitle: 'Answer: Average Density! (The Ship is Mostly Air!)',
        explanation: 'Solid steel sinks because it is denser than water. But a ship is shaped like a giant bowl full of air! The combined mass of steel + air divided by its enormous volume makes its average density much less than water!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Water surface and body
          svg += `<rect x="20" y="90" width="420" height="110" rx="10" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />`;
          svg += `<text x="40" y="115" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#0369a1">WATER</text>`;

          // Left: Pebble
          svg += `<circle cx="80" cy="175" r="8" fill="#475569" />`;
          svg += `<text x="80" y="65" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#475569" text-anchor="middle">1 oz Pebble</text>`;
          svg += `<line x1="80" y1="75" x2="80" y2="160" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3" />`;
          svg += `<text x="80" y="195" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#b91c1c" text-anchor="middle">SINKS!</text>`;

          // Right: Ship
          // Hull
          svg += `<polygon points="180,90 380,90 350,140 210,140" fill="#e2e8f0" stroke="#1e293b" stroke-width="2.5" />`;
          // Hollow Air pocket label
          svg += `<text x="280" y="120" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#0284c7" text-anchor="middle">AIR POCKETS</text>`;
          // Deck cabins
          svg += `<rect x="230" y="65" width="100" height="25" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />`;
          svg += `<rect x="250" y="45" width="20" height="20" fill="#ef4444" />`;

          if (isRevealed) {
            // Upward buoyant force arrows
            svg += `<path d="M240,165 L240,145 M235,152 L240,145 L245,152" stroke="#0284c7" stroke-width="3" />`;
            svg += `<path d="M280,165 L280,145 M275,152 L280,145 L285,152" stroke="#0284c7" stroke-width="3" />`;
            svg += `<path d="M320,165 L320,145 M315,152 L320,145 L325,152" stroke="#0284c7" stroke-width="3" />`;
            svg += `<text x="280" y="185" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0369a1" text-anchor="middle">⬆️ BUOYANT FORCE OF WATER</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 2: Oil & Water Density Tower
      {
        question: 'If you pour golden cooking oil into blue water, they refuse to mix. Which liquid floats on top, and why?',
        answerRaw: 'oil',
        answersAccepted: ['oil', 'cooking oil', 'oil floats', 'oil is lighter', 'oil is less dense'],
        answerTitle: 'Answer: Oil Floats on Top! (Oil is Less Dense than Water)',
        explanation: 'One cup of cooking oil weighs ~215 grams, while one cup of water weighs ~240 grams! Because oil molecules are spaced farther apart and packed less densely, gravity pulls the heavier water to the bottom, pushing oil to the top!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Tall beaker
          svg += `<rect x="80" y="25" width="120" height="160" rx="10" fill="#f8fafc" stroke="#475569" stroke-width="3" />`;
          // Graduation ticks
          for (let i = 1; i <= 5; i++) {
            svg += `<line x1="80" y1="${25 + i * 26}" x2="95" y2="${25 + i * 26}" stroke="#94a3b8" stroke-width="2" />`;
          }

          if (!isRevealed) {
            svg += `<rect x="83" y="105" width="114" height="77" fill="#60a5fa" opacity="0.8" />`;
            svg += `<rect x="83" y="35" width="114" height="70" fill="#fde047" opacity="0.8" />`;
            svg += `<text x="140" y="75" font-family="'Fredoka', sans-serif" font-size="28" font-weight="800" fill="#854d0e" text-anchor="middle">?</text>`;
            svg += `<text x="140" y="145" font-family="'Fredoka', sans-serif" font-size="28" font-weight="800" fill="#1e3a8a" text-anchor="middle">?</text>`;
          } else {
            // Oil top layer
            svg += `<rect x="83" y="35" width="114" height="70" fill="#fde047" opacity="0.9" />`;
            svg += `<text x="140" y="70" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#854d0e" text-anchor="middle">🌻 OIL (0.92 g/cm³)</text>`;
            // Water bottom layer
            svg += `<rect x="83" y="105" width="114" height="77" fill="#3b82f6" opacity="0.9" />`;
            svg += `<text x="140" y="145" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">💧 WATER (1.0 g/cm³)</text>`;

            // Molecular packing zoom-in on right
            svg += `<rect x="235" y="35" width="190" height="145" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
            svg += `<text x="330" y="60" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle">MOLECULAR PACKING</text>`;
            // Oil loose dots
            svg += `<text x="250" y="90" font-size="11" font-weight="700" fill="#854d0e">Oil:</text>`;
            svg += `<circle cx="280" cy="86" r="5" fill="#eab308" /><circle cx="310" cy="86" r="5" fill="#eab308" /><circle cx="340" cy="86" r="5" fill="#eab308" /><circle cx="370" cy="86" r="5" fill="#eab308" />`;
            // Water tight dots
            svg += `<text x="250" y="135" font-size="11" font-weight="700" fill="#1d4ed8">Water:</text>`;
            svg += `<circle cx="280" cy="130" r="5" fill="#3b82f6" /><circle cx="295" cy="130" r="5" fill="#3b82f6" /><circle cx="310" cy="130" r="5" fill="#3b82f6" /><circle cx="325" cy="130" r="5" fill="#3b82f6" /><circle cx="340" cy="130" r="5" fill="#3b82f6" /><circle cx="355" cy="130" r="5" fill="#3b82f6" />`;
            svg += `<text x="330" y="165" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#15803d" text-anchor="middle">Water is MORE DENSE!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 3: The Honey Ramp Race (Viscosity)
      {
        question: 'You tilt two spoons down a ramp: one holds cold honey, and one holds water. The water races down instantly, but the honey creeps slowly. Why?',
        answerRaw: 'viscosity',
        answersAccepted: ['viscosity', 'thick', 'thickness', 'honey is sticky', 'sticky', 'internal friction', 'viscous'],
        answerTitle: 'Answer: Viscosity! (Internal Fluid Friction)',
        explanation: 'Viscosity measures a fluid resistance to flowing. Honey is packed with long, tangled sugar chains that cling to each other, creating internal drag. Water molecules are tiny and slide past each other with minimal friction!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Ramp
          svg += `<polygon points="40,170 380,40 380,170" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />`;

          // Track 1: Water
          svg += `<text x="340" y="30" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0284c7">💧 Water</text>`;
          // Track 2: Honey
          svg += `<text x="340" y="65" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#b45309">🍯 Honey</text>`;

          if (!isRevealed) {
            svg += `<circle cx="320" cy="65" r="10" fill="#3b82f6" />`;
            svg += `<circle cx="320" cy="90" r="10" fill="#f59e0b" />`;
            svg += `<text x="210" y="140" font-family="'Fredoka', sans-serif" font-size="18" font-weight="800" fill="#64748b" text-anchor="middle">READY... SET... GO! 🏁</text>`;
          } else {
            // Water at bottom
            svg += `<circle cx="70" cy="160" r="12" fill="#3b82f6" />`;
            svg += `<text x="70" y="140" font-size="12" font-weight="800" fill="#0369a1" text-anchor="middle">WINNER! ⚡</text>`;
            // Honey crawling near top
            svg += `<path d="M290,75 Q270,85 250,90" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" fill="none" />`;
            svg += `<text x="270" y="115" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#b45309">Slow Ooze...</text>`;

            // Badge
            svg += `<rect x="170" y="135" width="190" height="30" rx="8" fill="#1e293b" />`;
            svg += `<text x="265" y="155" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fef08a" text-anchor="middle">HONEY = HIGH VISCOSITY</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 4: The Floating Ice Mystery
      {
        question: 'Almost every liquid shrinks and gets denser when it freezes solid. Why does ice FLOAT on top of water instead of sinking to the bottom?',
        answerRaw: 'less dense',
        answersAccepted: ['less dense', 'ice is less dense', 'ice expands', 'expands', 'crystals', 'air', 'density', 'hexagonal'],
        answerTitle: 'Answer: Water Expands When It Freezes! (Hexagonal Cages)',
        explanation: 'When water freezes into solid ice, its molecules lock into a 6-sided hexagonal crystal lattice with hollow empty pockets inside, expanding volume by ~9%! That makes solid ice LESS dense than liquid water, so it bobs on top!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Glass cup
          svg += `<path d="M60,40 L90,180 L210,180 L240,40" fill="#f0f9ff" stroke="#38bdf8" stroke-width="3" />`;
          // Water inside cup
          svg += `<polygon points="68,75 232,75 208,175 92,175" fill="#bae6fd" opacity="0.8" />`;

          // Ice cube floating at surface
          svg += `<rect x="120" y="60" width="60" height="50" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2.5" />`;
          svg += `<text x="150" y="90" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0284c7" text-anchor="middle">ICE CUBE</text>`;

          if (isRevealed) {
            // Hexagon crystal illustration on right
            svg += `<rect x="270" y="30" width="165" height="155" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
            svg += `<text x="352" y="55" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0369a1" text-anchor="middle">HEXAGONAL CRYSTAL</text>`;
            // Draw hexagon ring with hollow center
            const hx = 352, hy = 110, hr = 35;
            let hexPts = '';
            for (let i = 0; i < 6; i++) {
              const a = (i * 60) * Math.PI / 180;
              const px = hx + hr * Math.cos(a);
              const py = hy + hr * Math.sin(a);
              hexPts += `${px},${py} `;
            }
            svg += `<polygon points="${hexPts}" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5" />`;
            svg += `<text x="352" y="115" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#0284c7" text-anchor="middle">EMPTY</text>`;
            svg += `<text x="352" y="170" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#15803d" text-anchor="middle">Expands 9% = Floats!</text>`;
          } else {
            svg += `<text x="150" y="130" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#0369a1" text-anchor="middle">Floats at top!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // TRACK 4: ⚗️ CHEMISTRY & MATTER (4 Slides)
    chemistry: [
      // Slide 1: Baking Soda & Vinegar Balloon
      {
        question: 'You pour clear vinegar over white baking soda inside a bottle capped with a flat balloon. What happens to the balloon and why?',
        answerRaw: 'inflates',
        answersAccepted: ['inflates', 'blows up', 'fills with gas', 'expands', 'gas', 'co2', 'carbon dioxide', 'balloon inflates', 'fills up'],
        answerTitle: 'Answer: The Balloon Inflates with Carbon Dioxide Gas!',
        explanation: 'An acid-base chemical reaction takes place! The vinegar and baking soda combine to create water, salt, and Carbon Dioxide gas (CO2). Gas molecules bounce apart and occupy hundreds of times more volume than liquids, inflating the balloon!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Bottle base and neck
          svg += `<rect x="185" y="95" width="70" height="90" rx="8" fill="#f8fafc" stroke="#475569" stroke-width="2.5" />`;
          svg += `<rect x="205" y="60" width="30" height="40" fill="#f8fafc" stroke="#475569" stroke-width="2.5" />`;

          if (!isRevealed) {
            // Uninflated floppy balloon on bottle mouth
            svg += `<path d="M210,60 C200,45 205,30 220,30 C235,30 230,45 225,60" fill="#ec4899" stroke="#be185d" stroke-width="2" />`;
            // Powder at bottom
            svg += `<rect x="188" y="160" width="64" height="22" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />`;
            svg += `<text x="220" y="175" font-family="'Fredoka', sans-serif" font-size="10" font-weight="700" fill="#64748b" text-anchor="middle">Baking Soda</text>`;
          } else {
            // Fizzing foaming reaction
            svg += `<rect x="188" y="140" width="64" height="42" rx="4" fill="#dbeafe" />`;
            svg += `<circle cx="200" cy="155" r="4" fill="#3b82f6" /><circle cx="215" cy="165" r="5" fill="#3b82f6" /><circle cx="235" cy="150" r="4" fill="#3b82f6" />`;
            // Fully inflated round balloon
            svg += `<ellipse cx="220" cy="35" rx="45" ry="32" fill="#ec4899" stroke="#be185d" stroke-width="2.5" />`;
            svg += `<text x="220" y="40" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">CO₂ GAS</text>`;

            // Reaction note
            svg += `<rect x="290" y="70" width="150" height="45" rx="10" fill="#10b981" />`;
            svg += `<text x="365" y="88" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">CHEMICAL REACTION</text>`;
            svg += `<text x="365" y="104" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#fef08a" text-anchor="middle">Gas expands rapidly!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 2: The Seesaw Lever (Mechanical Advantage)
      {
        question: 'Can a 50-lb child lift a 200-lb adult high into the air on a playground seesaw? How?',
        answerRaw: 'sit farther',
        answersAccepted: ['lever', 'sit further', 'sit farther', 'farther back', 'leverage', 'torque', 'distance', 'sit at the end', 'move back'],
        answerTitle: 'Answer: YES! By Sitting 4 Times Farther from the Fulcrum!',
        explanation: 'A seesaw is a simple machine called a lever! Leverage (Torque) = Force × Distance. A 50-lb child sitting 8 feet from the pivot produces the exact same rotational torque as a 200-lb adult sitting 2 feet away ($50 \times 8 = 200 \times 2 = 400$)!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Ground
          svg += `<line x1="30" y1="180" x2="430" y2="180" stroke="#475569" stroke-width="3" />`;

          if (!isRevealed) {
            // Level seesaw
            svg += `<polygon points="230,130 210,180 250,180" fill="#64748b" />`;
            svg += `<line x1="50" y1="130" x2="410" y2="130" stroke="#d97706" stroke-width="8" stroke-linecap="round" />`;
            svg += `<text x="80" y="115" font-size="28" text-anchor="middle">🧒</text>`;
            svg += `<text x="80" y="90" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#475569" text-anchor="middle">50 lbs</text>`;
            svg += `<text x="380" y="115" font-size="34" text-anchor="middle">👨</text>`;
            svg += `<text x="380" y="90" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#475569" text-anchor="middle">200 lbs</text>`;
          } else {
            // Tilted lever in child favor!
            svg += `<polygon points="230,130 210,180 250,180" fill="#64748b" />`;
            svg += `<line x1="50" y1="170" x2="410" y2="90" stroke="#d97706" stroke-width="8" stroke-linecap="round" />`;
            // Kid down far out on long lever arm (8 ft)
            svg += `<text x="70" y="155" font-size="28" text-anchor="middle">🧒✨</text>`;
            svg += `<text x="70" y="195" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#047857" text-anchor="middle">50 lbs × 8 ft</text>`;
            // Adult up in the air sitting close (2 ft)
            svg += `<text x="290" y="105" font-size="32" text-anchor="middle">👨</text>`;
            svg += `<text x="290" y="70" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#b45309" text-anchor="middle">200 lbs × 2 ft</text>`;

            // Math banner
            svg += `<rect x="135" y="15" width="190" height="34" rx="8" fill="#10b981" />`;
            svg += `<text x="230" y="37" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">⚖️ 400 ft-lbs = 400 ft-lbs!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 3: Candle in a Jar (Atmospheric Pressure)
      {
        question: 'If you trap a burning candle under an upside-down glass jar in a dish of colored water, what happens when the flame goes out?',
        answerRaw: 'water rises',
        answersAccepted: ['water rises', 'water goes up', 'sucks water', 'rises', 'vacuum', 'pressure', 'water gets sucked up'],
        answerTitle: 'Answer: Water Gets Pushed UP into the Jar!',
        explanation: 'The candle flame heated the air inside the jar, causing air to expand and escape. When the flame dies from lack of oxygen, the trapped air cools and contracts, creating lower pressure inside. The higher atmospheric pressure outside pushes water up into the jar!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Shallow dish
          svg += `<ellipse cx="230" cy="180" rx="140" ry="18" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2" />`;
          // Water pool
          svg += `<ellipse cx="230" cy="180" rx="130" ry="14" fill="#60a5fa" opacity="0.6" />`;

          if (!isRevealed) {
            // Inverted jar
            svg += `<rect x="175" y="45" width="110" height="135" rx="10" fill="rgba(255,255,255,0.7)" stroke="#64748b" stroke-width="2" />`;
            // Candle burning
            svg += `<rect x="218" y="130" width="24" height="40" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />`;
            svg += `<circle cx="230" cy="120" r="7" fill="#f97316" />`;
            svg += `<circle cx="230" cy="118" r="4" fill="#fef08a" />`;
            svg += `<text x="230" y="85" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#64748b" text-anchor="middle">Flame Burning...</text>`;
          } else {
            // Water pulled up inside jar!
            svg += `<rect x="175" y="45" width="110" height="135" rx="10" fill="rgba(255,255,255,0.7)" stroke="#64748b" stroke-width="2" />`;
            svg += `<rect x="177" y="125" width="106" height="53" fill="#3b82f6" opacity="0.7" />`;
            // Extinguished candle with smoke
            svg += `<rect x="218" y="130" width="24" height="40" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />`;
            svg += `<path d="M230,122 Q225,110 235,100" stroke="#94a3b8" stroke-width="2" fill="none" />`;
            // Atmospheric push arrows outside
            svg += `<path d="M140,140 L140,165 M135,158 L140,165 L145,158" stroke="#10b981" stroke-width="3" />`;
            svg += `<path d="M320,140 L320,165 M315,158 L320,165 L325,158" stroke="#10b981" stroke-width="3" />`;
            svg += `<text x="375" y="150" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#047857">AIR PRESSURE PUSHES!</text>`;
            svg += `<text x="230" y="90" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#1d4ed8" text-anchor="middle">⬆️ WATER RISES!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // Slide 4: Dissolving Sugar (Molecules Dispersing)
      {
        question: 'You stir white sugar crystals into hot tea until they completely vanish. Did the sugar disappear from the universe? Where is it?',
        answerRaw: 'dissolved',
        answersAccepted: ['dissolved', 'in the water', 'in the tea', 'still there', 'it dissolved', 'molecules', 'separated'],
        answerTitle: 'Answer: It Dissolved! (Surrounded by Water Molecules)',
        explanation: 'The sugar did not disappear from reality! Tumbling water molecules pulled the sugar crystal apart into individual sugar molecules too microscopic to see. That is why the tea tastes sweet and the total weight is unchanged!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          // Left: Teacup
          svg += `<ellipse cx="120" cy="170" rx="60" ry="12" fill="#cbd5e1" />`;
          svg += `<path d="M70,80 L80,160 L160,160 L170,80" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" />`;
          svg += `<ellipse cx="120" cy="80" rx="50" ry="12" fill="#d97706" opacity="0.6" />`;

          if (!isRevealed) {
            // Sugar cube dropping
            svg += `<rect x="110" y="50" width="20" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
            svg += `<text x="120" y="35" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#475569" text-anchor="middle">Sugar Cube</text>`;
          } else {
            // Dissolved tea
            svg += `<text x="120" y="125" font-size="20" text-anchor="middle">✨ Sweet!</text>`;

            // Magnifying bubble on right
            svg += `<circle cx="320" cy="110" r="75" fill="#f0f9ff" stroke="#3b82f6" stroke-width="3" />`;
            svg += `<text x="320" y="60" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#0369a1" text-anchor="middle">MICROSCOPIC VIEW</text>`;
            // Sugar molecules (pink) surrounded by water molecules (blue)
            svg += `<circle cx="300" cy="100" r="10" fill="#ec4899" /><circle cx="340" cy="120" r="10" fill="#ec4899" />`;
            svg += `<text x="300" y="104" font-size="9" font-weight="800" fill="#fff" text-anchor="middle">S</text>`;
            svg += `<text x="340" y="124" font-size="9" font-weight="800" fill="#fff" text-anchor="middle">S</text>`;
            // Surrounding water molecules
            svg += `<circle cx="280" cy="95" r="5" fill="#3b82f6" /><circle cx="315" cy="85" r="5" fill="#3b82f6" /><circle cx="305" cy="120" r="5" fill="#3b82f6" /><circle cx="355" cy="105" r="5" fill="#3b82f6" /><circle cx="330" cy="140" r="5" fill="#3b82f6" />`;
            svg += `<text x="320" y="165" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#15803d" text-anchor="middle">Sugar is Still There!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ]
  };

  // ========================================================
  // SCIENCE LAB NAVIGATION & CONTROLLER
  // ========================================================
  function getActiveScienceDeck() {
    return SCIENCE_SLIDES[activeScienceTrack] || SCIENCE_SLIDES.space;
  }

  function getScienceTrackName() {
    switch (activeScienceTrack) {
      case 'space': return 'Space & Gravity';
      case 'air': return 'Air & Friction';
      case 'density': return 'Density & Viscosity';
      case 'chemistry': return 'Chemistry & Matter';
      default: return 'Science Lab';
    }
  }

  function updateScienceSlideToolbar() {
    const deck = getActiveScienceDeck();
    const currentIdx = trackScienceIndices[activeScienceTrack] || 0;
    const total = deck.length;

    scienceSlideIndicator.textContent = `Slide ${currentIdx + 1} of ${total}`;

    // Render navigation dots
    scienceSlideDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = `slide-dot ${i === currentIdx ? 'active' : ''}`;
      dot.title = `Go to Slide ${i + 1}`;
      dot.addEventListener('click', () => {
        showScienceSlide(i);
      });
      scienceSlideDots.appendChild(dot);
    }

    prevScienceSlideBtn.disabled = (currentIdx === 0);
    nextScienceSlideBtn.disabled = (currentIdx === total - 1);
  }

  function showScienceSlide(index) {
    const deck = getActiveScienceDeck();
    if (index < 0) index = 0;
    if (index >= deck.length) index = deck.length - 1;
    trackScienceIndices[activeScienceTrack] = index;

    currentScienceSlide = deck[index];
    scienceState = 'QUESTION';

    scienceCardEl.style.animation = 'none';
    void scienceCardEl.offsetWidth;
    scienceCardEl.style.animation = 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    playPopSound();

    scienceBadgeEl.textContent = `Slide ${index + 1} of ${deck.length} • ${getScienceTrackName()}`;
    scienceQuestionEl.textContent = currentScienceSlide.question;

    scienceViewportEl.innerHTML = currentScienceSlide.render(false);
    scienceSolutionBoxEl.classList.add('hidden');

    scienceAnswerInput.value = '';
    scienceInputFeedback.textContent = '';
    scienceInputFeedback.className = 'input-feedback';

    scienceActionBtn.classList.remove('next-mode');
    scienceActionText.textContent = 'Reveal Science Secret';

    updateScienceSlideToolbar();
  }

  function nextScienceSlide() {
    const deck = getActiveScienceDeck();
    const currentIdx = trackScienceIndices[activeScienceTrack] || 0;
    if (currentIdx < deck.length - 1) {
      showScienceSlide(currentIdx + 1);
    } else {
      showScienceSlide(0);
  showKindergartenSlide(0); // Loop back
    }
  }

  function prevScienceSlide() {
    const deck = getActiveScienceDeck();
    const currentIdx = trackScienceIndices[activeScienceTrack] || 0;
    if (currentIdx > 0) {
      showScienceSlide(currentIdx - 1);
    } else {
      showScienceSlide(deck.length - 1);
    }
  }

  function revealScienceSolution() {
    scienceState = 'SOLUTION';
    scienceViewportEl.innerHTML = currentScienceSlide.render(true);
    scienceAnswerTitleEl.textContent = currentScienceSlide.answerTitle;
    scienceExplanationEl.textContent = currentScienceSlide.explanation;
    scienceSolutionBoxEl.classList.remove('hidden');

    const typedVal = scienceAnswerInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
    let isCorrectTyped = null;
    if (typedVal !== '') {
      if (currentScienceSlide.answersAccepted) {
        isCorrectTyped = currentScienceSlide.answersAccepted.some(ans => typedVal.includes(ans.toLowerCase().trim()) || ans.toLowerCase().trim().includes(typedVal));
      } else if (currentScienceSlide.answerRaw) {
        isCorrectTyped = typedVal.includes(currentScienceSlide.answerRaw.toLowerCase().trim());
      }

      if (isCorrectTyped) {
        scienceInputFeedback.textContent = '🌟 Fantastic scientific thinking! Spot on!';
        scienceInputFeedback.className = 'input-feedback correct';
      } else {
        scienceInputFeedback.textContent = `Great thought! Let's examine the science secret:`;
        scienceInputFeedback.className = 'input-feedback';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }
    ProfileManager.recordCompletion('science', streak);
    saveStats();
    updateStatsUI();

    if (streak > 0 && streak % 5 === 0) {
      playChimeSound(true);
      triggerConfetti();
      streakPillEl.classList.add('bump');
      setTimeout(() => streakPillEl.classList.remove('bump'), 300);
    } else {
      playChimeSound(false);
    }

    scienceActionBtn.classList.add('next-mode');
    scienceActionText.textContent = 'Next Science Slide →';
  }

  function handleScienceAdvance() {
    scienceActionBtn.classList.add('pressed');
    setTimeout(() => scienceActionBtn.classList.remove('pressed'), 120);

    if (scienceState === 'QUESTION') {
      revealScienceSolution();
    } else if (scienceState === 'SOLUTION') {
      nextScienceSlide();
    }
  }

  // ========================================================
  // KINDERGARTEN (MATH, QUESTIONS, RIDDLES, PUZZLES)
  // ========================================================

  function speakKindergarten(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      if (kindergartenSpeakBtn) {
        kindergartenSpeakBtn.classList.add('speaking');
        utterance.onend = () => kindergartenSpeakBtn.classList.remove('speaking');
        utterance.onerror = () => kindergartenSpeakBtn.classList.remove('speaking');
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  const KINDERGARTEN_SLIDES = {
    // ----------------------------------------------------
    // TRACK 1: 🔢 COUNTING & MATH (12 Slides)
    // ----------------------------------------------------
    math: [
      // 1. Duck Pond Counting (5)
      {
        question: 'How many cute yellow ducklings are swimming in the pond? Count them!',
        answerRaw: '5',
        answersAccepted: ['5', 'five', '5 ducks', '5 ducklings', 'five ducklings'],
        answerTitle: 'Answer: 5 Ducklings! 🦆',
        explanation: 'Count along the pond: 1, 2, 3, 4, and 5 happy swimming ducks!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="20" width="440" height="160" rx="30" fill="#e0f2fe" stroke="#38bdf8" stroke-width="3"/>`;
          svg += `<path d="M30,140 Q110,120 190,140 T350,140 T440,140" fill="none" stroke="#bae6fd" stroke-width="6"/>`;
          svg += `<path d="M20,160 Q100,145 180,160 T360,160 T440,160" fill="none" stroke="#7dd3fc" stroke-width="4"/>`;
          const ducks = [
            { x: 70, y: 110, num: 1 },
            { x: 150, y: 80, num: 2 },
            { x: 230, y: 115, num: 3 },
            { x: 310, y: 75, num: 4 },
            { x: 390, y: 105, num: 5 }
          ];
          ducks.forEach(d => {
            svg += `<text x="${d.x}" y="${d.y}" font-size="42" text-anchor="middle">🦆</text>`;
            if (isRevealed) {
              svg += `<circle cx="${d.x}" cy="${d.y - 38}" r="14" fill="#f59e0b" stroke="#fff" stroke-width="2"/>`;
              svg += `<text x="${d.x}" y="${d.y - 33}" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">${d.num}</text>`;
            }
          });
          if (isRevealed) {
            svg += `<rect x="160" y="148" width="140" height="28" rx="10" fill="#10b981"/>`;
            svg += `<text x="230" y="167" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">TOTAL = 5 DUCKS!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 2. Apple Harvest Addition (3 + 2 = 5)
      {
        question: '3 red apples are on the tree. 2 fell into the basket! How many apples in all? (3 + 2 = ?)',
        answerRaw: '5',
        answersAccepted: ['5', 'five', '5 apples', 'five apples'],
        answerTitle: 'Answer: 3 + 2 = 5 Apples! 🍎',
        explanation: '3 apples on the branch plus 2 apples in the basket make 5 delicious apples altogether!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="150" width="440" height="40" rx="10" fill="#dcfce7"/>`;
          // Tree foliage on left
          svg += `<circle cx="140" cy="85" r="65" fill="#86efac" stroke="#22c55e" stroke-width="3"/>`;
          svg += `<circle cx="110" cy="70" r="45" fill="#4ade80"/>`;
          svg += `<circle cx="170" cy="75" r="45" fill="#4ade80"/>`;
          // Trunk
          svg += `<rect x="128" y="130" width="24" height="40" fill="#b45309" rx="4"/>`;
          // 3 apples on tree
          svg += `<text x="105" y="80" font-size="30" text-anchor="middle">🍎</text>`;
          svg += `<text x="145" y="65" font-size="30" text-anchor="middle">🍎</text>`;
          svg += `<text x="165" y="105" font-size="30" text-anchor="middle">🍎</text>`;
          svg += `<rect x="90" y="115" width="80" height="22" rx="8" fill="#15803d"/>`;
          svg += `<text x="130" y="130" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">3 on tree</text>`;
          // Plus sign
          svg += `<text x="235" y="100" font-family="'Fredoka', sans-serif" font-size="32" font-weight="900" fill="#059669" text-anchor="middle">+</text>`;
          // Basket on right with 2 apples
          svg += `<rect x="290" y="105" width="100" height="45" rx="12" fill="#d97706" stroke="#b45309" stroke-width="2"/>`;
          svg += `<text x="320" y="100" font-size="30" text-anchor="middle">🍎</text>`;
          svg += `<text x="360" y="100" font-size="30" text-anchor="middle">🍎</text>`;
          svg += `<rect x="300" y="125" width="80" height="20" rx="6" fill="#92400e"/>`;
          svg += `<text x="340" y="139" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fef3c7" text-anchor="middle">2 in basket</text>`;
          if (isRevealed) {
            svg += `<rect x="180" y="15" width="110" height="32" rx="10" fill="#10b981" stroke="#059669" stroke-width="2"/>`;
            svg += `<text x="235" y="36" font-family="'Fredoka', sans-serif" font-size="15" font-weight="800" fill="#fff" text-anchor="middle">3 + 2 = 5! 🎉</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 3. Balloon Pop Subtraction (5 - 2 = 3)
      {
        question: 'You had 5 shiny balloons. POP! 2 popped! How many balloons are still floating? (5 - 2 = ?)',
        answerRaw: '3',
        answersAccepted: ['3', 'three', '3 balloons', 'three balloons'],
        answerTitle: 'Answer: 5 - 2 = 3 Balloons! 🎈',
        explanation: '5 balloons minus the 2 that popped leaves 3 colorful balloons floating high!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          // 3 intact floating balloons
          const intact = [
            { x: 80, y: 70, color: '🎈', label: '1' },
            { x: 155, y: 55, color: '🎈', label: '2' },
            { x: 230, y: 75, color: '🎈', label: '3' }
          ];
          intact.forEach(b => {
            svg += `<text x="${b.x}" y="${b.y}" font-size="44" text-anchor="middle">${b.color}</text>`;
            svg += `<line x1="${b.x}" y1="${b.y + 12}" x2="${b.x - 5}" y2="155" stroke="#94a3b8" stroke-width="2" stroke-dasharray="3,2"/>`;
            if (isRevealed) {
              svg += `<circle cx="${b.x}" cy="${b.y - 36}" r="12" fill="#10b981"/>`;
              svg += `<text x="${b.x}" y="${b.y - 32}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">${b.label}</text>`;
            }
          });
          // 2 popped balloons
          const popped = [{ x: 320, y: 75 }, { x: 390, y: 65 }];
          popped.forEach(p => {
            svg += `<text x="${p.x}" y="${p.y}" font-size="34" text-anchor="middle">💥</text>`;
            svg += `<text x="${p.x}" y="${p.y + 24}" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#ef4444" text-anchor="middle">POP!</text>`;
            svg += `<line x1="${p.x}" y1="${p.y + 30}" x2="${p.x - 5}" y2="155" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>`;
          });
          // Hand holding strings
          svg += `<text x="180" y="175" font-size="28" text-anchor="middle">✊</text>`;
          if (isRevealed) {
            svg += `<rect x="150" y="15" width="160" height="28" rx="8" fill="#3b82f6"/>`;
            svg += `<text x="230" y="34" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">5 - 2 = 3 LEFT!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 4. Ladybug Ten-Frame (6)
      {
        question: 'Count the ladybugs in this ten-frame! How many ladybugs are there?',
        answerRaw: '6',
        answersAccepted: ['6', 'six', '6 ladybugs', 'six ladybugs'],
        answerTitle: 'Answer: 6 Ladybugs! 🐞',
        explanation: 'The top row has a full 5 ladybugs, and the bottom row has 1. 5 + 1 = 6 ladybugs!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="50" y="25" width="360" height="145" rx="16" fill="#f0fdf4" stroke="#10b981" stroke-width="3"/>`;
          // Grid 2 rows x 5 columns
          const cellW = 68;
          const cellH = 65;
          const startX = 60;
          const startY = 32;
          for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
              const x = startX + col * cellW;
              const y = startY + row * cellH;
              svg += `<rect x="${x}" y="${y}" width="${cellW - 4}" height="${cellH - 4}" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="2"/>`;
              const index = row * 5 + col;
              if (index < 6) {
                svg += `<text x="${x + (cellW-4)/2}" y="${y + 42}" font-size="34" text-anchor="middle">🐞</text>`;
                if (isRevealed) {
                  svg += `<text x="${x + (cellW-4)/2}" y="${y + 55}" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#dc2626" text-anchor="middle">${index + 1}</text>`;
                }
              } else {
                svg += `<circle cx="${x + (cellW-4)/2}" cy="${y + (cellH-4)/2}" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-dasharray="3,3" stroke-width="1.5"/>`;
              }
            }
          }
          if (isRevealed) {
            svg += `<rect x="150" y="170" width="160" height="24" rx="6" fill="#10b981"/>`;
            svg += `<text x="230" y="186" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">5 on top + 1 on bottom = 6!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 5. Fishbowl Comparison (Who has MORE?)
      {
        question: 'Which bowl has MORE fish swimming inside: Bowl A or Bowl B?',
        answerRaw: 'B',
        answersAccepted: ['b', 'bowl b', 'fishbowl b', 'b has more', '2'],
        answerTitle: 'Answer: Bowl B has MORE! 🐟',
        explanation: 'Bowl A only has 2 fish, but Bowl B has 4 fish! 4 is greater than 2 (4 > 2)!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          // Table
          svg += `<rect x="20" y="165" width="420" height="15" rx="6" fill="#d97706"/>`;
          // Bowl A (2 fish)
          svg += `<circle cx="130" cy="105" r="55" fill="#e0f2fe" stroke="#38bdf8" stroke-width="3"/>`;
          svg += `<ellipse cx="130" cy="55" rx="35" ry="10" fill="#bae6fd" stroke="#38bdf8" stroke-width="2"/>`;
          svg += `<text x="110" y="110" font-size="28" text-anchor="middle">🐠</text>`;
          svg += `<text x="145" y="125" font-size="28" text-anchor="middle">🐠</text>`;
          svg += `<rect x="95" y="145" width="70" height="22" rx="6" fill="#64748b"/>`;
          svg += `<text x="130" y="160" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">Bowl A: 2</text>`;

          // Bowl B (4 fish)
          const bowlBStroke = isRevealed ? '#10b981' : '#38bdf8';
          const bowlBFill = isRevealed ? '#dcfce7' : '#e0f2fe';
          svg += `<circle cx="330" cy="105" r="55" fill="${bowlBFill}" stroke="${bowlBStroke}" stroke-width="3"/>`;
          svg += `<ellipse cx="330" cy="55" rx="35" ry="10" fill="#bae6fd" stroke="${bowlBStroke}" stroke-width="2"/>`;
          svg += `<text x="310" y="95" font-size="26" text-anchor="middle">🐟</text>`;
          svg += `<text x="350" y="100" font-size="26" text-anchor="middle">🐟</text>`;
          svg += `<text x="315" y="130" font-size="26" text-anchor="middle">🐟</text>`;
          svg += `<text x="345" y="135" font-size="26" text-anchor="middle">🐟</text>`;
          svg += `<rect x="295" y="145" width="70" height="22" rx="6" fill="${isRevealed ? '#10b981' : '#64748b'}"/>`;
          svg += `<text x="330" y="160" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">Bowl B: 4</text>`;

          if (isRevealed) {
            svg += `<circle cx="330" cy="30" r="16" fill="#f59e0b"/>`;
            svg += `<text x="330" y="36" font-size="16" text-anchor="middle">⭐</text>`;
            svg += `<rect x="180" y="70" width="100" height="30" rx="8" fill="#10b981"/>`;
            svg += `<text x="230" y="90" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">4 > 2 (MORE!)</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 6. Twinkling Stars (7)
      {
        question: 'Count the twinkling stars shining in the night sky! How many do you see?',
        answerRaw: '7',
        answersAccepted: ['7', 'seven', '7 stars', 'seven stars'],
        answerTitle: 'Answer: 7 Twinkling Stars! ⭐',
        explanation: 'Point to each bright star: 1, 2, 3, 4, 5, 6, 7! Seven golden stars!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="24" fill="#0f172a" stroke="#334155" stroke-width="2"/>`;
          // Moon
          svg += `<text x="60" y="65" font-size="36" text-anchor="middle">🌙</text>`;
          const stars = [
            { x: 130, y: 70, num: 1 },
            { x: 190, y: 130, num: 2 },
            { x: 230, y: 60, num: 3 },
            { x: 280, y: 120, num: 4 },
            { x: 330, y: 65, num: 5 },
            { x: 385, y: 130, num: 6 },
            { x: 410, y: 60, num: 7 }
          ];
          stars.forEach(s => {
            svg += `<text x="${s.x}" y="${s.y}" font-size="34" text-anchor="middle">⭐</text>`;
            if (isRevealed) {
              svg += `<circle cx="${s.x}" cy="${s.y - 28}" r="11" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>`;
              svg += `<text x="${s.x}" y="${s.y - 24}" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">${s.num}</text>`;
            }
          });
          if (isRevealed) {
            svg += `<rect x="160" y="150" width="140" height="26" rx="8" fill="#f59e0b"/>`;
            svg += `<text x="230" y="168" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">7 BRIGHT STARS!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 7. Cookie Jar Addition (4 + 1 = 5)
      {
        question: 'There are 4 cookies inside the jar. Bunny drops in 1 more cookie! How many cookies now? (4 + 1 = ?)',
        answerRaw: '5',
        answersAccepted: ['5', 'five', '5 cookies', 'five cookies'],
        answerTitle: 'Answer: 4 + 1 = 5 Cookies! 🍪',
        explanation: '4 chocolate cookies in the jar plus 1 more cookie makes 5 sweet cookies in all!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="165" width="440" height="20" rx="4" fill="#fed7aa"/>`;
          // Glass jar
          svg += `<rect x="160" y="45" width="140" height="120" rx="20" fill="rgba(224, 242, 254, 0.4)" stroke="#38bdf8" stroke-width="3"/>`;
          svg += `<rect x="185" y="30" width="90" height="18" rx="6" fill="#f97316"/>`;
          // 4 cookies inside
          svg += `<text x="195" y="95" font-size="30" text-anchor="middle">🍪</text>`;
          svg += `<text x="260" y="95" font-size="30" text-anchor="middle">🍪</text>`;
          svg += `<text x="200" y="140" font-size="30" text-anchor="middle">🍪</text>`;
          svg += `<text x="260" y="140" font-size="30" text-anchor="middle">🍪</text>`;
          // 1 cookie entering from top
          svg += `<text x="230" y="24" font-size="28" text-anchor="middle">🍪</text>`;
          svg += `<line x1="230" y1="28" x2="230" y2="50" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,2"/>`;
          // Bunny on left
          svg += `<text x="90" y="120" font-size="50" text-anchor="middle">🐰</text>`;
          if (isRevealed) {
            svg += `<rect x="330" y="80" width="105" height="48" rx="12" fill="#10b981"/>`;
            svg += `<text x="382" y="102" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">4 IN + 1 MORE</text>`;
            svg += `<text x="382" y="120" font-family="'Fredoka', sans-serif" font-size="16" font-weight="900" fill="#fef08a" text-anchor="middle">= 5 COOKIES!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 8. Frogs on a Log Subtraction (4 - 1 = 3)
      {
        question: '4 green frogs sat on a log. 1 hopped into the pond: SPLASH! How many frogs are still on the log? (4 - 1 = ?)',
        answerRaw: '3',
        answersAccepted: ['3', 'three', '3 frogs', 'three frogs'],
        answerTitle: 'Answer: 4 - 1 = 3 Frogs! 🐸',
        explanation: '4 frogs on the log minus 1 frog jumping into the water leaves 3 frogs on the log!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="80" width="440" height="105" rx="14" fill="#bae6fd"/>`;
          // Wooden log
          svg += `<rect x="40" y="115" width="280" height="35" rx="12" fill="#78350f" stroke="#451a03" stroke-width="2"/>`;
          // 3 sitting frogs
          const sitting = [{ x: 80, num: 1 }, { x: 150, num: 2 }, { x: 220, num: 3 }];
          sitting.forEach(f => {
            svg += `<text x="${f.x}" y="${110}" font-size="34" text-anchor="middle">🐸</text>`;
            if (isRevealed) {
              svg += `<circle cx="${f.x}" cy="70" r="10" fill="#10b981"/>`;
              svg += `<text x="${f.x}" y="74" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">${f.num}</text>`;
            }
          });
          // 1 jumping frog
          svg += `<path d="M260,110 Q320,50 360,130" fill="none" stroke="#0284c7" stroke-width="3" stroke-dasharray="4,3"/>`;
          svg += `<text x="360" y="125" font-size="32" text-anchor="middle">🐸</text>`;
          svg += `<text x="360" y="160" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#0369a1" text-anchor="middle">SPLASH! 💦</text>`;
          if (isRevealed) {
            svg += `<rect x="140" y="20" width="160" height="28" rx="8" fill="#15803d"/>`;
            svg += `<text x="220" y="39" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">4 - 1 = 3 ON LOG!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 9. High-Five Hands (5)
      {
        question: 'Give a high five! How many fingers (including the thumb) are on ONE hand? 🖐️',
        answerRaw: '5',
        answersAccepted: ['5', 'five', '5 fingers', 'five fingers'],
        answerTitle: 'Answer: 5 Fingers! 🖐️',
        explanation: 'Thumb, index, middle, ring, and pinky — that makes 5 fingers on one hand!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fdf2f8" stroke="#fbcfe8" stroke-width="2"/>`;
          // Giant Hand SVG
          svg += `<text x="230" y="125" font-size="80" text-anchor="middle">🖐️</text>`;
          const tips = [
            { x: 175, y: 70, n: 1 },
            { x: 195, y: 35, n: 2 },
            { x: 230, y: 25, n: 3 },
            { x: 265, y: 38, n: 4 },
            { x: 290, y: 75, n: 5 }
          ];
          if (isRevealed) {
            tips.forEach(t => {
              svg += `<circle cx="${t.x}" cy="${t.y}" r="12" fill="#ec4899" stroke="#fff" stroke-width="2"/>`;
              svg += `<text x="${t.x}" y="${t.y + 4}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">${t.n}</text>`;
            });
            svg += `<rect x="160" y="150" width="140" height="28" rx="8" fill="#db2777"/>`;
            svg += `<text x="230" y="169" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">HIGH FIVE = 5!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 10. Toy Cars (2 + 2 = 4)
      {
        question: '2 red cars and 2 blue cars line up on the track! How many cars in all? (2 + 2 = ?)',
        answerRaw: '4',
        answersAccepted: ['4', 'four', '4 cars', 'four cars'],
        answerTitle: 'Answer: 2 + 2 = 4 Cars! 🚗',
        explanation: 'Two red cars plus two blue cars equal 4 speedy cars ready to race!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="20" y="40" width="420" height="120" rx="18" fill="#334155"/>`;
          svg += `<line x1="20" y1="100" x2="440" y2="100" stroke="#facc15" stroke-width="4" stroke-dasharray="14,10"/>`;
          // Finish line
          svg += `<line x1="400" y1="40" x2="400" y2="160" stroke="#fff" stroke-width="6" stroke-dasharray="10,10"/>`;
          // 2 red cars
          svg += `<text x="90" y="85" font-size="40" text-anchor="middle">🚗</text>`;
          svg += `<text x="180" y="85" font-size="40" text-anchor="middle">🚗</text>`;
          // 2 blue cars
          svg += `<text x="270" y="145" font-size="40" text-anchor="middle">🚙</text>`;
          svg += `<text x="350" y="145" font-size="40" text-anchor="middle">🚙</text>`;
          if (isRevealed) {
            svg += `<rect x="150" y="10" width="160" height="30" rx="8" fill="#10b981"/>`;
            svg += `<text x="230" y="30" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">2 + 2 = 4 CARS! 🏁</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 11. Triangle Straight Sides (3)
      {
        question: 'How many straight sides does a TRIANGLE have? Count around the shape! ▲',
        answerRaw: '3',
        answersAccepted: ['3', 'three', '3 sides', 'three sides'],
        answerTitle: 'Answer: 3 Straight Sides! 📐',
        explanation: 'A triangle always has 3 straight sides and 3 pointy corners!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>`;
          // Big Triangle
          svg += `<polygon points="230,30 340,160 120,160" fill="#fef08a" stroke="#eab308" stroke-width="6" stroke-linejoin="round"/>`;
          if (isRevealed) {
            // Side 1 (left)
            svg += `<circle cx="165" cy="95" r="14" fill="#3b82f6"/>`;
            svg += `<text x="165" y="100" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">1</text>`;
            // Side 2 (bottom)
            svg += `<circle cx="230" cy="175" r="14" fill="#3b82f6"/>`;
            svg += `<text x="230" y="180" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">2</text>`;
            // Side 3 (right)
            svg += `<circle cx="295" cy="95" r="14" fill="#3b82f6"/>`;
            svg += `<text x="295" y="100" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">3</text>`;
            svg += `<text x="230" y="125" font-family="'Fredoka', sans-serif" font-size="18" font-weight="900" fill="#a16207" text-anchor="middle">TRIANGLE = 3!</text>`;
          } else {
            svg += `<text x="230" y="120" font-size="36" text-anchor="middle">❓</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 12. Making 10 Bond (7 + ? = 10)
      {
        question: 'There are 7 blue dots in this 10-frame. How many MORE dots do we need to make 10?',
        answerRaw: '3',
        answersAccepted: ['3', 'three', '3 more', '3 dots'],
        answerTitle: 'Answer: 3 More Dots! 🔵',
        explanation: '7 blue dots plus 3 empty spaces equals a full ten-frame: 7 + 3 = 10!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="50" y="25" width="360" height="145" rx="16" fill="#f8fafc" stroke="#3b82f6" stroke-width="3"/>`;
          const cellW = 68;
          const cellH = 65;
          const startX = 60;
          const startY = 32;
          for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
              const x = startX + col * cellW;
              const y = startY + row * cellH;
              svg += `<rect x="${x}" y="${y}" width="${cellW - 4}" height="${cellH - 4}" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="2"/>`;
              const index = row * 5 + col;
              if (index < 7) {
                svg += `<circle cx="${x + (cellW-4)/2}" cy="${y + (cellH-4)/2}" r="18" fill="#3b82f6"/>`;
              } else {
                if (isRevealed) {
                  svg += `<circle cx="${x + (cellW-4)/2}" cy="${y + (cellH-4)/2}" r="18" fill="#f59e0b"/>`;
                  svg += `<text x="${x + (cellW-4)/2}" y="${y + (cellH-4)/2 + 5}" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">+1</text>`;
                } else {
                  svg += `<circle cx="${x + (cellW-4)/2}" cy="${y + (cellH-4)/2}" r="16" fill="none" stroke="#f59e0b" stroke-dasharray="4,3" stroke-width="2"/>`;
                  svg += `<text x="${x + (cellW-4)/2}" y="${y + (cellH-4)/2 + 5}" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#f59e0b" text-anchor="middle">?</text>`;
                }
              }
            }
          }
          if (isRevealed) {
            svg += `<rect x="150" y="172" width="160" height="24" rx="6" fill="#10b981"/>`;
            svg += `<text x="230" y="188" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">7 + 3 = 10 (FULL!)</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // ----------------------------------------------------
    // TRACK 2: ❓ CURIOUS QUESTIONS (12 Slides)
    // ----------------------------------------------------
    questions: [
      // 1. Color Mixing Blue + Yellow = Green
      {
        question: 'What color paint do you get when you mix BLUE and YELLOW paint together? 🎨',
        answerRaw: 'green',
        answersAccepted: ['green', 'it makes green', 'bright green'],
        answerTitle: 'Answer: Bright GREEN! 💚',
        explanation: 'Blue and yellow are primary colors! When you swirl them together, they magically make GREEN!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          // Blue splash
          svg += `<circle cx="90" cy="100" r="42" fill="#3b82f6"/>`;
          svg += `<text x="90" y="105" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">BLUE</text>`;
          // Plus
          svg += `<text x="160" y="108" font-family="'Fredoka', sans-serif" font-size="28" font-weight="900" fill="#64748b" text-anchor="middle">+</text>`;
          // Yellow splash
          svg += `<circle cx="230" cy="100" r="42" fill="#facc15"/>`;
          svg += `<text x="230" y="105" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#713f12" text-anchor="middle">YELLOW</text>`;
          // Equals
          svg += `<text x="300" y="108" font-family="'Fredoka', sans-serif" font-size="28" font-weight="900" fill="#64748b" text-anchor="middle">=</text>`;
          // Result
          if (isRevealed) {
            svg += `<circle cx="370" cy="100" r="50" fill="#10b981" stroke="#059669" stroke-width="4"/>`;
            svg += `<text x="370" y="98" font-family="'Fredoka', sans-serif" font-size="16" font-weight="900" fill="#fff" text-anchor="middle">GREEN!</text>`;
            svg += `<text x="370" y="120" font-size="20" text-anchor="middle">✨</text>`;
          } else {
            svg += `<circle cx="370" cy="100" r="45" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="3"/>`;
            svg += `<text x="370" y="110" font-size="34" text-anchor="middle">❓</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 2. Spider Legs (8)
      {
        question: 'How many walking legs does a spider have? Count them on both sides! 🕷️',
        answerRaw: '8',
        answersAccepted: ['8', 'eight', '8 legs', 'eight legs'],
        answerTitle: 'Answer: 8 Legs! 🕷️',
        explanation: 'Spiders have 4 legs on the left side and 4 legs on the right side. 4 + 4 = 8 walking legs!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#faf5ff" stroke="#e9d5ff" stroke-width="2"/>`;
          // Spider Web lines
          svg += `<line x1="230" y1="10" x2="230" y2="70" stroke="#cbd5e1" stroke-width="2"/>`;
          svg += `<circle cx="230" cy="100" r="35" fill="#7e22ce"/>`;
          svg += `<circle cx="230" cy="80" r="22" fill="#6b21a8"/>`;
          // Eyes
          svg += `<circle cx="222" cy="78" r="5" fill="#fff"/><circle cx="222" cy="78" r="2.5" fill="#000"/>`;
          svg += `<circle cx="238" cy="78" r="5" fill="#fff"/><circle cx="238" cy="78" r="2.5" fill="#000"/>`;
          // Left legs
          const leftLegs = [{ y1: 85, y2: 65, n: 1 }, { y1: 95, y2: 85, n: 2 }, { y1: 105, y2: 110, n: 3 }, { y1: 115, y2: 135, n: 4 }];
          leftLegs.forEach(l => {
            svg += `<path d="M200,${l.y1} Q160,${l.y2-10} 130,${l.y2}" fill="none" stroke="#7e22ce" stroke-width="4" stroke-linecap="round"/>`;
            if (isRevealed) {
              svg += `<circle cx="118" cy="${l.y2}" r="9" fill="#10b981"/>`;
              svg += `<text x="118" y="${l.y2 + 3}" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">${l.n}</text>`;
            }
          });
          // Right legs
          const rightLegs = [{ y1: 85, y2: 65, n: 5 }, { y1: 95, y2: 85, n: 6 }, { y1: 105, y2: 110, n: 7 }, { y1: 115, y2: 135, n: 8 }];
          rightLegs.forEach(l => {
            svg += `<path d="M260,${l.y1} Q300,${l.y2-10} 330,${l.y2}" fill="none" stroke="#7e22ce" stroke-width="4" stroke-linecap="round"/>`;
            if (isRevealed) {
              svg += `<circle cx="342" cy="${l.y2}" r="9" fill="#10b981"/>`;
              svg += `<text x="342" y="${l.y2 + 3}" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">${l.n}</text>`;
            }
          });
          if (isRevealed) {
            svg += `<rect x="160" y="155" width="140" height="26" rx="8" fill="#7e22ce"/>`;
            svg += `<text x="230" y="173" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">4 + 4 = 8 LEGS!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 3. Animal Sky Flyer (Eagle)
      {
        question: 'Which of these animals can soar high up in the blue sky: Penguin, Lion, or Eagle?',
        answerRaw: 'eagle',
        answersAccepted: ['eagle', 'the eagle', 'an eagle'],
        answerTitle: 'Answer: The Eagle! 🦅',
        explanation: 'Eagles have big, powerful wings to soar through clouds! Penguins swim in water and lions run on grass.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="2"/>`;
          // 3 cards
          const animals = [
            { x: 90, emoji: '🐧', name: 'Penguin', fly: false },
            { x: 230, emoji: '🦁', name: 'Lion', fly: false },
            { x: 370, emoji: '🦅', name: 'Eagle', fly: true }
          ];
          animals.forEach(a => {
            const isWinner = isRevealed && a.fly;
            svg += `<rect x="${a.x - 55}" y="35" width="110" height="125" rx="16" fill="${isWinner ? '#d1fae5' : '#fff'}" stroke="${isWinner ? '#10b981' : '#cbd5e1'}" stroke-width="${isWinner ? '3' : '2'}"/>`;
            svg += `<text x="${a.x}" y="95" font-size="46" text-anchor="middle">${a.emoji}</text>`;
            svg += `<text x="${a.x}" y="135" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="${isWinner ? '#065f46' : '#334155'}" text-anchor="middle">${a.name}</text>`;
            if (isRevealed && a.fly) {
              svg += `<circle cx="${a.x}" cy="25" r="14" fill="#f59e0b"/>`;
              svg += `<text x="${a.x}" y="30" font-size="14" text-anchor="middle">⭐</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },

      // 4. Freezing Cold Rain turns to Snow
      {
        question: 'When it is freezing cold in the winter, falling raindrops turn into soft white...',
        answerRaw: 'snow',
        answersAccepted: ['snow', 'snowflakes', 'snowflake', 'fluffy snow'],
        answerTitle: 'Answer: Fluffy White SNOW! ❄️',
        explanation: 'When the air in the clouds drops below 32°F (0°C), water droplets freeze into beautiful crystalline snowflakes!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>`;
          // Snow hill
          svg += `<path d="M10,150 Q160,110 300,140 T450,130 L450,190 L10,190 Z" fill="#f8fafc"/>`;
          // Cloud
          svg += `<ellipse cx="140" cy="50" rx="60" ry="25" fill="#e0f2fe"/>`;
          svg += `<ellipse cx="180" cy="45" rx="40" ry="20" fill="#e0f2fe"/>`;
          svg += `<text x="90" y="105" font-size="28" text-anchor="middle">❄️</text>`;
          svg += `<text x="160" y="90" font-size="28" text-anchor="middle">❄️</text>`;
          svg += `<text x="210" y="115" font-size="28" text-anchor="middle">❄️</text>`;
          // Snowman on right
          svg += `<text x="360" y="145" font-size="55" text-anchor="middle">⛄</text>`;
          if (isRevealed) {
            svg += `<rect x="150" y="145" width="160" height="30" rx="10" fill="#10b981"/>`;
            svg += `<text x="230" y="166" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">WHITE SNOW! ❄️</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 5. Five Senses - Smelling Flowers
      {
        question: 'Which body part and sense do you use to smell a pretty flower? 🌸 Eyes, Ears, or Nose?',
        answerRaw: 'nose',
        answersAccepted: ['nose', 'our nose', 'the nose', 'my nose', 'smell'],
        answerTitle: 'Answer: Your NOSE! 👃',
        explanation: 'You smell sweet roses with your nose, look at colors with your eyes, and listen with your ears!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fdf4ff" stroke="#f0abfc" stroke-width="2"/>`;
          // Flower on left
          svg += `<text x="110" y="125" font-size="65" text-anchor="middle">🌹</text>`;
          // Scent waves
          svg += `<path d="M150,90 Q180,60 210,90 T270,90" fill="none" stroke="#ec4899" stroke-width="3" stroke-dasharray="5,4"/>`;
          // Face sniffing on right
          svg += `<circle cx="340" cy="100" r="45" fill="#fed7aa"/>`;
          svg += `<circle cx="325" cy="85" r="5" fill="#334155"/>`;
          svg += `<path d="M320,118 Q335,130 350,118" fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round"/>`;
          // Nose
          svg += `<circle cx="320" cy="98" r="8" fill="#fb923c"/>`;
          if (isRevealed) {
            svg += `<rect x="290" y="150" width="100" height="26" rx="8" fill="#db2777"/>`;
            svg += `<text x="340" y="168" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">NOSE 👃</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 6. Egg Layer (Hen/Bird)
      {
        question: 'Which of these animals lays eggs in a cozy nest: Puppy, Kitten, or Hen / Bird?',
        answerRaw: 'hen',
        answersAccepted: ['hen', 'bird', 'chicken', 'the hen', 'the bird'],
        answerTitle: 'Answer: The Hen / Bird! 🐣',
        explanation: 'Mother birds and hens lay eggs with hard shells and keep them warm until cute chicks hatch!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>`;
          const cards = [
            { x: 90, emoji: '🐶', name: 'Puppy', egg: false },
            { x: 230, emoji: '🐱', name: 'Kitten', egg: false },
            { x: 370, emoji: '🐔', name: 'Hen / Bird', egg: true }
          ];
          cards.forEach(c => {
            const isWinner = isRevealed && c.egg;
            svg += `<rect x="${c.x - 55}" y="35" width="110" height="125" rx="16" fill="${isWinner ? '#dcfce7' : '#fff'}" stroke="${isWinner ? '#10b981' : '#cbd5e1'}" stroke-width="${isWinner ? '3' : '2'}"/>`;
            svg += `<text x="${c.x}" y="95" font-size="44" text-anchor="middle">${c.emoji}</text>`;
            svg += `<text x="${c.x}" y="135" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="${isWinner ? '#065f46' : '#334155'}" text-anchor="middle">${c.name}</text>`;
            if (isWinner) {
              svg += `<text x="${c.x}" y="30" font-size="18" text-anchor="middle">🥚✨</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },

      // 7. Caterpillar Metamorphosis
      {
        question: 'A tiny caterpillar crawls on a green leaf, sleeps in a chrysalis, and turns into a...',
        answerRaw: 'butterfly',
        answersAccepted: ['butterfly', 'a butterfly', 'pretty butterfly'],
        answerTitle: 'Answer: A Beautiful BUTTERFLY! 🦋',
        explanation: 'This amazing magical change is called metamorphosis! The crawler grows colorful wings and flies!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>`;
          // Step 1: Caterpillar
          svg += `<text x="90" y="90" font-size="44" text-anchor="middle">🐛</text>`;
          svg += `<text x="90" y="130" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#15803d" text-anchor="middle">1. Caterpillar</text>`;
          // Arrow 1
          svg += `<text x="175" y="95" font-size="24" text-anchor="middle">➡️</text>`;
          // Step 2: Chrysalis
          svg += `<ellipse cx="230" cy="85" rx="14" ry="26" fill="#84cc16" stroke="#4d7c0f" stroke-width="2"/>`;
          svg += `<line x1="230" y1="50" x2="230" y2="60" stroke="#713f12" stroke-width="3"/>`;
          svg += `<text x="230" y="130" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#15803d" text-anchor="middle">2. Chrysalis</text>`;
          // Arrow 2
          svg += `<text x="285" y="95" font-size="24" text-anchor="middle">➡️</text>`;
          // Step 3: Butterfly
          if (isRevealed) {
            svg += `<text x="360" y="90" font-size="50" text-anchor="middle">🦋</text>`;
            svg += `<text x="360" y="130" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#047857" text-anchor="middle">3. BUTTERFLY!</text>`;
          } else {
            svg += `<circle cx="360" cy="85" r="32" fill="#fff" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="2"/>`;
            svg += `<text x="360" y="96" font-size="28" text-anchor="middle">❓</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 8. Melting Ice Cube
      {
        question: 'What happens to a solid ice cube if you leave it out in the warm sunshine? ☀️🧊',
        answerRaw: 'melts',
        answersAccepted: ['melts', 'it melts', 'melt', 'turns to water', 'water', 'it melts into water'],
        answerTitle: 'Answer: It MELTS into Water! 💧',
        explanation: 'Heat energy from the warm sun warms up the solid ice until it melts into a liquid puddle!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          // Sun beaming from top left
          svg += `<text x="70" y="65" font-size="48" text-anchor="middle">☀️</text>`;
          // Sun rays
          svg += `<line x1="105" y1="70" x2="200" y2="105" stroke="#facc15" stroke-width="3" stroke-dasharray="6,4"/>`;
          if (!isRevealed) {
            // Cold Ice cube
            svg += `<rect x="230" y="80" width="60" height="60" rx="10" fill="#bae6fd" stroke="#38bdf8" stroke-width="3"/>`;
            svg += `<text x="260" y="118" font-size="28" text-anchor="middle">🧊</text>`;
            svg += `<text x="360" y="115" font-size="36" text-anchor="middle">❓</text>`;
          } else {
            // Melted puddle
            svg += `<ellipse cx="280" cy="130" rx="80" ry="24" fill="#60a5fa" opacity="0.6"/>`;
            svg += `<rect x="260" y="100" width="40" height="25" rx="6" fill="#bae6fd" stroke="#38bdf8" stroke-width="2"/>`;
            svg += `<text x="280" y="115" font-size="18" text-anchor="middle">💧</text>`;
            svg += `<rect x="210" y="155" width="140" height="26" rx="8" fill="#0284c7"/>`;
            svg += `<text x="280" y="173" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">MELTED WATER!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 9. Day vs Night: The Sun
      {
        question: 'What giant bright glowing star gives Earth warm light during the DAYTIME? ☀️',
        answerRaw: 'sun',
        answersAccepted: ['sun', 'the sun', 'sunshine'],
        answerTitle: 'Answer: The SUN! ☀️',
        explanation: 'The Sun is our closest star! It gives light, heat, and energy to every plant, animal, and person!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>`;
          // Green hill
          svg += `<path d="M10,160 Q230,120 450,160 L450,190 L10,190 Z" fill="#22c55e"/>`;
          // Sun
          svg += `<circle cx="230" cy="75" r="42" fill="#facc15" stroke="#eab308" stroke-width="4"/>`;
          // Sun face
          svg += `<circle cx="218" cy="70" r="4" fill="#713f12"/><circle cx="242" cy="70" r="4" fill="#713f12"/>`;
          svg += `<path d="M220,85 Q230,95 240,85" fill="none" stroke="#713f12" stroke-width="3" stroke-linecap="round"/>`;
          if (isRevealed) {
            svg += `<rect x="160" y="145" width="140" height="28" rx="8" fill="#f59e0b"/>`;
            svg += `<text x="230" y="164" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">THE BRIGHT SUN! ☀️</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 10. Monkey's Fruit (Banana)
      {
        question: 'Which fruit is yellow, curved like a smile, and monkeys love to peel and eat? 🍌',
        answerRaw: 'banana',
        answersAccepted: ['banana', 'a banana', 'bananas'],
        answerTitle: 'Answer: A BANANA! 🍌',
        explanation: 'Bananas grow on big green tropical plants and are packed with sweet energy and yummy nutrients!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>`;
          svg += `<text x="120" y="115" font-size="70" text-anchor="middle">🐒</text>`;
          if (isRevealed) {
            svg += `<text x="320" y="115" font-size="70" text-anchor="middle">🍌</text>`;
            svg += `<rect x="260" y="145" width="120" height="26" rx="8" fill="#eab308"/>`;
            svg += `<text x="320" y="163" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">BANANA! 🍌</text>`;
          } else {
            svg += `<circle cx="320" cy="95" r="45" fill="#fff" stroke="#cbd5e1" stroke-dasharray="4,4" stroke-width="2"/>`;
            svg += `<text x="320" y="108" font-size="40" text-anchor="middle">❓</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 11. Days of the Week (7)
      {
        question: 'Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday! How many days in ONE week?',
        answerRaw: '7',
        answersAccepted: ['7', 'seven', '7 days', 'seven days'],
        answerTitle: 'Answer: 7 Days in a Week! 📅',
        explanation: 'There are exactly 7 days in every week: 5 school days and 2 weekend fun days!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
          const startX = 35;
          const boxW = 52;
          days.forEach((d, idx) => {
            const x = startX + idx * 56;
            const isWeekend = idx === 0 || idx === 6;
            svg += `<rect x="${x}" y="60" width="${boxW}" height="${boxW}" rx="10" fill="${isWeekend ? '#fef3c7' : '#e0f2fe'}" stroke="${isWeekend ? '#f59e0b' : '#38bdf8'}" stroke-width="2"/>`;
            svg += `<text x="${x + boxW/2}" y="88" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#1e293b" text-anchor="middle">${d}</text>`;
            if (isRevealed) {
              svg += `<circle cx="${x + boxW/2}" cy="102" r="8" fill="#10b981"/>`;
              svg += `<text x="${x + boxW/2}" y="106" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">${idx + 1}</text>`;
            }
          });
          if (isRevealed) {
            svg += `<rect x="150" y="145" width="160" height="28" rx="8" fill="#10b981"/>`;
            svg += `<text x="230" y="164" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">7 DAYS IN A WEEK!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 12. What Plants Need (Water & Sunlight)
      {
        question: 'A tiny seed in the soil needs bright sunshine and one more drink to grow tall. What is it? 💧',
        answerRaw: 'water',
        answersAccepted: ['water', 'rain', 'water and sun', 'drink of water'],
        answerTitle: 'Answer: WATER! 💧🌱',
        explanation: 'Plants drink water through their roots and catch sunshine on their leaves to grow strong!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>`;
          // Soil
          svg += `<rect x="10" y="140" width="440" height="50" fill="#78350f" rx="6"/>`;
          // Sun
          svg += `<text x="70" y="60" font-size="44" text-anchor="middle">☀️</text>`;
          // Plant sprout
          svg += `<path d="M230,140 Q230,105 230,95" stroke="#22c55e" stroke-width="5" stroke-linecap="round"/>`;
          svg += `<ellipse cx="220" cy="95" rx="14" ry="7" fill="#4ade80" transform="rotate(-30 220 95)"/>`;
          svg += `<ellipse cx="240" cy="95" rx="14" ry="7" fill="#4ade80" transform="rotate(30 240 95)"/>`;
          // Watering can on right
          svg += `<text x="360" y="75" font-size="45" text-anchor="middle">🚿</text>`;
          svg += `<path d="M335,80 Q290,105 250,120" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,4" fill="none"/>`;
          if (isRevealed) {
            svg += `<rect x="150" y="20" width="160" height="28" rx="8" fill="#0284c7"/>`;
            svg += `<text x="230" y="39" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">SUN + WATER = 🌱</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // ----------------------------------------------------
    // TRACK 3: 🦁 PLAYFUL RIDDLES (12 Slides)
    // ----------------------------------------------------
    riddles: [
      // 1. The Clock
      {
        question: 'I have a round face and two ticking hands, but no arms and no legs! I tell you when it is snack time. What am I?',
        answerRaw: 'clock',
        answersAccepted: ['clock', 'a clock', 'watch', 'a watch'],
        answerTitle: 'Answer: A CLOCK! ⏰',
        explanation: 'Tick-tock! The clock\'s short hand points to the hour, and the long hand points to the minutes!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>`;
          svg += `<circle cx="230" cy="100" r="60" fill="#fff" stroke="#3b82f6" stroke-width="6"/>`;
          // Center dot
          svg += `<circle cx="230" cy="100" r="5" fill="#1e293b"/>`;
          // Hands (pointing to 3:00)
          svg += `<line x1="230" y1="100" x2="230" y2="55" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>`;
          svg += `<line x1="230" y1="100" x2="270" y2="100" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>`;
          // Tick marks 12, 3, 6, 9
          svg += `<text x="230" y="52" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#64748b" text-anchor="middle">12</text>`;
          svg += `<text x="282" y="104" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#64748b" text-anchor="middle">3</text>`;
          svg += `<text x="230" y="152" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#64748b" text-anchor="middle">6</text>`;
          svg += `<text x="178" y="104" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#64748b" text-anchor="middle">9</text>`;
          if (isRevealed) {
            svg += `<rect x="150" y="15" width="160" height="26" rx="8" fill="#3b82f6"/>`;
            svg += `<text x="230" y="33" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">TICK-TOCK CLOCK! ⏰</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 2. The Cat
      {
        question: 'I have soft whiskers, four furry paws, a tail, and I purr \'Meow!\' when I want a bowl of milk. Who am I?',
        answerRaw: 'cat',
        answersAccepted: ['cat', 'a cat', 'kitten', 'a kitten', 'kitty'],
        answerTitle: 'Answer: A Cat / Kitten! 🐱',
        explanation: 'Cats love napping in sunny windows, batting at yarn balls, and purring when they are happy!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/>`;
          svg += `<text x="200" y="125" font-size="80" text-anchor="middle">🐱</text>`;
          // Yarn ball
          svg += `<circle cx="310" cy="120" r="22" fill="#ef4444"/>`;
          svg += `<path d="M295,120 Q310,105 325,120" stroke="#fee2e2" stroke-width="2" fill="none"/>`;
          svg += `<text x="310" y="127" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">YARN</text>`;
          if (isRevealed) {
            svg += `<rect x="160" y="20" width="140" height="28" rx="8" fill="#f97316"/>`;
            svg += `<text x="230" y="39" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">MEOW! IT\'S A CAT! 🐱</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 3. The Egg
      {
        question: 'You must crack me open before you can cook or eat me! What am I?',
        answerRaw: 'egg',
        answersAccepted: ['egg', 'an egg'],
        answerTitle: 'Answer: An EGG! 🥚',
        explanation: 'Crack! Break the smooth outer shell to scramble delicious eggs or bake fluffy birthday cakes!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          if (!isRevealed) {
            // Whole egg
            svg += `<ellipse cx="230" cy="100" rx="45" ry="60" fill="#fef3c7" stroke="#fde68a" stroke-width="4"/>`;
            svg += `<text x="230" y="110" font-size="40" text-anchor="middle">❓</text>`;
          } else {
            // Cracked egg with yolk
            svg += `<path d="M190,130 Q170,80 200,60 L215,80 L205,95 L220,110 Z" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>`;
            svg += `<path d="M270,130 Q290,80 260,60 L245,80 L255,95 L240,110 Z" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>`;
            svg += `<circle cx="230" cy="115" r="24" fill="#f59e0b"/>`;
            svg += `<text x="230" y="122" font-size="18" text-anchor="middle">✨</text>`;
            svg += `<rect x="160" y="150" width="140" height="26" rx="8" fill="#f59e0b"/>`;
            svg += `<text x="230" y="168" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">CRACK! AN EGG! 🥚</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 4. The Honeybee
      {
        question: 'I wear fuzzy yellow and black stripes, I buzz from flower to flower, and I make sweet golden honey! Who am I?',
        answerRaw: 'bee',
        answersAccepted: ['bee', 'a bee', 'honeybee', 'a honeybee', 'bumblebee'],
        answerTitle: 'Answer: A Honeybee! 🐝',
        explanation: 'Buzzzz! Honeybees sip sweet nectar from colorful blossoms and make honey for their hive!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>`;
          svg += `<text x="120" y="130" font-size="55" text-anchor="middle">🌸</text>`;
          // Flight path
          svg += `<path d="M140,95 Q200,40 260,85" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,4"/>`;
          svg += `<text x="280" y="95" font-size="60" text-anchor="middle">🐝</text>`;
          if (isRevealed) {
            svg += `<text x="380" y="110" font-size="44" text-anchor="middle">🍯</text>`;
            svg += `<rect x="150" y="145" width="160" height="28" rx="8" fill="#d97706"/>`;
            svg += `<text x="230" y="164" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">BUZZZZ! A HONEYBEE! 🐝</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 5. The Umbrella
      {
        question: 'I go UP when the raindrops fall DOWN, and I keep your head cozy and dry! What am I?',
        answerRaw: 'umbrella',
        answersAccepted: ['umbrella', 'an umbrella'],
        answerTitle: 'Answer: An UMBRELLA! ☂️',
        explanation: 'Open the canopy when raindrops splash down from storm clouds to stay completely dry!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>`;
          // Raindrops
          const drops = [50, 90, 130, 330, 370, 410];
          drops.forEach(d => {
            svg += `<text x="${d}" y="60" font-size="20" text-anchor="middle">💧</text>`;
            svg += `<text x="${d + 20}" y="110" font-size="20" text-anchor="middle">💧</text>`;
          });
          // Giant Umbrella in center
          svg += `<path d="M170,100 Q230,35 290,100 Z" fill="#ec4899" stroke="#db2777" stroke-width="3"/>`;
          svg += `<line x1="230" y1="100" x2="230" y2="145" stroke="#475569" stroke-width="4" stroke-linecap="round"/>`;
          svg += `<path d="M230,145 Q230,158 220,155" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round"/>`;
          if (isRevealed) {
            svg += `<rect x="150" y="155" width="160" height="26" rx="8" fill="#db2777"/>`;
            svg += `<text x="230" y="173" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">AN UMBRELLA! ☂️</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 6. The Snail
      {
        question: 'I crawl slowly across the green grass, and I carry my whole spiral house on my back! Who am I?',
        answerRaw: 'snail',
        answersAccepted: ['snail', 'a snail'],
        answerTitle: 'Answer: A SNAIL! 🐌',
        explanation: 'A snail carries its shell wherever it goes and glides along on a smooth shiny trail!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>`;
          // Clover grass
          svg += `<rect x="10" y="145" width="440" height="45" fill="#86efac" rx="6"/>`;
          svg += `<text x="80" y="145" font-size="30" text-anchor="middle">🍀</text>`;
          svg += `<text x="380" y="145" font-size="30" text-anchor="middle">🍀</text>`;
          // Snail
          svg += `<text x="220" y="130" font-size="80" text-anchor="middle">🐌</text>`;
          if (isRevealed) {
            svg += `<rect x="160" y="20" width="140" height="28" rx="8" fill="#15803d"/>`;
            svg += `<text x="230" y="39" font-family="'Fredoka', sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">SLOW SNAIL! 🐌</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 7. The Snowman
      {
        question: 'I have an orange carrot nose, two coal eyes, and a red scarf. But I melt away when warm sunshine arrives! Who am I?',
        answerRaw: 'snowman',
        answersAccepted: ['snowman', 'a snowman'],
        answerTitle: 'Answer: A SNOWMAN! ⛄',
        explanation: 'Built out of 3 big rolled snowballs in winter! When spring sunshine warms the air, the snowman melts!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#e0f2fe" stroke="#bae6fd" stroke-width="2"/>`;
          svg += `<text x="230" y="135" font-size="85" text-anchor="middle">⛄</text>`;
          svg += `<text x="350" y="80" font-size="40" text-anchor="middle">☀️</text>`;
          if (isRevealed) {
            svg += `<rect x="150" y="145" width="160" height="28" rx="8" fill="#0284c7"/>`;
            svg += `<text x="230" y="164" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">CHILLY SNOWMAN! ⛄</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 8. The Puppy
      {
        question: 'I have four legs, floppy ears, and I wag my tail happily when you come home! Who am I?',
        answerRaw: 'dog',
        answersAccepted: ['dog', 'a dog', 'puppy', 'a puppy'],
        answerTitle: 'Answer: A Puppy / Dog! 🐶',
        explanation: 'Puppies love fetching tennis balls, learning fun tricks, getting belly rubs, and wagging their tails!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>`;
          svg += `<text x="200" y="125" font-size="80" text-anchor="middle">🐶</text>`;
          svg += `<text x="310" y="115" font-size="44" text-anchor="middle">🦴</text>`;
          if (isRevealed) {
            svg += `<rect x="150" y="20" width="160" height="28" rx="8" fill="#eab308"/>`;
            svg += `<text x="230" y="39" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">WAGGING PUPPY! 🐶</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 9. The Birthday Candle
      {
        question: 'I am tall when first lit, and I get shorter and shorter as I burn on your birthday cake! What am I?',
        answerRaw: 'candle',
        answersAccepted: ['candle', 'a candle', 'birthday candle'],
        answerTitle: 'Answer: A Birthday CANDLE! 🕯️',
        explanation: 'Make a special birthday wish and blow out the candle flame!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fdf2f8" stroke="#fbcfe8" stroke-width="2"/>`;
          // Cupcake base
          svg += `<rect x="180" y="125" width="100" height="40" rx="8" fill="#f472b6"/>`;
          svg += `<ellipse cx="230" cy="125" rx="55" ry="18" fill="#fbcfe8"/>`;
          // Tall Candle
          svg += `<rect x="224" y="65" width="12" height="55" rx="3" fill="#38bdf8"/>`;
          // Flame
          svg += `<ellipse cx="230" cy="50" rx="6" ry="12" fill="#f59e0b"/>`;
          svg += `<ellipse cx="230" cy="52" rx="3" ry="6" fill="#fef08a"/>`;
          if (isRevealed) {
            svg += `<rect x="150" y="15" width="160" height="26" rx="8" fill="#ec4899"/>`;
            svg += `<text x="230" y="33" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">BIRTHDAY CANDLE! 🕯️</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 10. The Elephant
      {
        question: 'I am the biggest land animal! I have giant floppy ears and a long nose called a trunk. Who am I?',
        answerRaw: 'elephant',
        answersAccepted: ['elephant', 'an elephant'],
        answerTitle: 'Answer: An ELEPHANT! 🐘',
        explanation: 'Elephants use their amazing trunks to spray cool water, trumpet loudly, and grab tasty leaves!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>`;
          svg += `<text x="210" y="130" font-size="85" text-anchor="middle">🐘</text>`;
          // Water spray from trunk
          svg += `<path d="M140,90 Q90,60 110,35 Q130,50 150,75" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,3"/>`;
          svg += `<text x="100" y="45" font-size="18" text-anchor="middle">💦</text>`;
          if (isRevealed) {
            svg += `<rect x="150" y="150" width="160" height="26" rx="8" fill="#475569"/>`;
            svg += `<text x="230" y="168" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">MIGHTY ELEPHANT! 🐘</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 11. The Moon
      {
        question: 'I glow in the night sky. Sometimes I am round like a ball, and sometimes curved like a banana! What am I?',
        answerRaw: 'moon',
        answersAccepted: ['moon', 'the moon'],
        answerTitle: 'Answer: The MOON! 🌙',
        explanation: 'The Moon orbits Earth! When the sun lights up just one side, it looks like a glowing crescent curve!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#0f172a" stroke="#334155" stroke-width="2"/>`;
          svg += `<circle cx="80" cy="40" r="1.5" fill="#fff"/><circle cx="380" cy="50" r="1.5" fill="#fff"/><circle cx="340" cy="130" r="1.5" fill="#fff"/>`;
          svg += `<text x="230" y="125" font-size="85" text-anchor="middle">🌙</text>`;
          if (isRevealed) {
            svg += `<rect x="160" y="145" width="140" height="28" rx="8" fill="#f59e0b"/>`;
            svg += `<text x="230" y="164" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">NIGHT MOON! 🌙</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 12. The Frog
      {
        question: 'I am green, I live by lily pads, I catch flies with my long tongue, and I say \'Ribbit! Ribbit!\' Who am I?',
        answerRaw: 'frog',
        answersAccepted: ['frog', 'a frog', 'toad', 'a toad'],
        answerTitle: 'Answer: A FROG! 🐸',
        explanation: 'Ribbit! Frogs are amphibians that start as swimming tadpoles and grow into high-jumping frogs!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="2"/>`;
          // Lily pad
          svg += `<ellipse cx="230" cy="140" rx="75" ry="24" fill="#22c55e" stroke="#15803d" stroke-width="2"/>`;
          svg += `<text x="230" y="125" font-size="70" text-anchor="middle">🐸</text>`;
          svg += `<text x="330" y="90" font-size="24" text-anchor="middle">🪰</text>`;
          if (isRevealed) {
            // Sticky tongue
            svg += `<path d="M250,105 Q290,95 320,90" stroke="#f43f5e" stroke-width="4" fill="none" stroke-linecap="round"/>`;
            svg += `<rect x="160" y="15" width="140" height="28" rx="8" fill="#15803d"/>`;
            svg += `<text x="230" y="34" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">RIBBIT! A FROG! 🐸</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // ----------------------------------------------------
    // TRACK 4: 🧩 SHAPE & LOGIC PUZZLES (12 Slides)
    // ----------------------------------------------------
    puzzles: [
      // 1. Color Circle Pattern (Red, Blue, Red, Blue... ?)
      {
        question: 'What color circle comes next in this pattern? 🔴 🔵 🔴 🔵 [?]',
        answerRaw: 'red',
        answersAccepted: ['red', 'red circle', 'the red one'],
        answerTitle: 'Answer: RED Circle! 🔴',
        explanation: 'The pattern repeats: Red, Blue, Red, Blue... so the next circle in line must be RED!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>`;
          const circles = [
            { x: 70, fill: '#ef4444' },
            { x: 150, fill: '#3b82f6' },
            { x: 230, fill: '#ef4444' },
            { x: 310, fill: '#3b82f6' }
          ];
          circles.forEach(c => {
            svg += `<circle cx="${c.x}" cy="100" r="30" fill="${c.fill}"/>`;
          });
          // Question box slot
          if (isRevealed) {
            svg += `<circle cx="390" cy="100" r="30" fill="#ef4444" stroke="#10b981" stroke-width="4"/>`;
            svg += `<text x="390" y="108" font-family="'Fredoka', sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle">RED</text>`;
            svg += `<rect x="150" y="150" width="160" height="26" rx="8" fill="#10b981"/>`;
            svg += `<text x="230" y="168" font-family="'Fredoka', sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">PATTERN: RED, BLUE...</text>`;
          } else {
            svg += `<circle cx="390" cy="100" r="30" fill="#fff" stroke="#f59e0b" stroke-width="3" stroke-dasharray="5,4"/>`;
            svg += `<text x="390" y="110" font-family="'Fredoka', sans-serif" font-size="30" font-weight="900" fill="#f59e0b" text-anchor="middle">?</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 2. Shape Sequence: Triangle, Square
      {
        question: 'What shape comes next in this pattern? ▲ ■ ▲ ■ [?]',
        answerRaw: 'triangle',
        answersAccepted: ['triangle', 'a triangle'],
        answerTitle: 'Answer: TRIANGLE! ▲',
        explanation: 'Triangle, Square, Triangle, Square... the repeating shape sequence starts over with a TRIANGLE!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>`;
          // 1: Triangle
          svg += `<polygon points="70,65 95,125 45,125" fill="#f59e0b"/>`;
          // 2: Square
          svg += `<rect x="125" y="70" width="50" height="50" rx="6" fill="#8b5cf6"/>`;
          // 3: Triangle
          svg += `<polygon points="230,65 255,125 205,125" fill="#f59e0b"/>`;
          // 4: Square
          svg += `<rect x="285" y="70" width="50" height="50" rx="6" fill="#8b5cf6"/>`;
          // 5: Slot
          if (isRevealed) {
            svg += `<polygon points="390,65 415,125 365,125" fill="#f59e0b" stroke="#10b981" stroke-width="4"/>`;
            svg += `<rect x="140" y="150" width="180" height="26" rx="8" fill="#10b981"/>`;
            svg += `<text x="230" y="168" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">TRIANGLE COMES NEXT!</text>`;
          } else {
            svg += `<rect x="365" y="70" width="50" height="50" rx="8" fill="#fff" stroke="#f59e0b" stroke-width="3" stroke-dasharray="5,4"/>`;
            svg += `<text x="390" y="105" font-family="'Fredoka', sans-serif" font-size="28" font-weight="800" fill="#f59e0b" text-anchor="middle">?</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 3. Odd One Out: Animals vs Apple
      {
        question: 'Look at the four cards: 🐶 Dog, 🐱 Cat, 🐰 Bunny, 🍎 Apple. Which one does NOT belong?',
        answerRaw: 'apple',
        answersAccepted: ['apple', 'the apple', 'an apple', 'fruit'],
        answerTitle: 'Answer: The APPLE! 🍎',
        explanation: 'The dog, cat, and bunny are living, breathing animals! The apple is a delicious piece of fruit!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          const cards = [
            { x: 65, emoji: '🐶', label: 'Dog', isOdd: false },
            { x: 175, emoji: '🐱', label: 'Cat', isOdd: false },
            { x: 285, emoji: '🐰', label: 'Bunny', isOdd: false },
            { x: 395, emoji: '🍎', label: 'Apple', isOdd: true }
          ];
          cards.forEach(c => {
            const isWinner = isRevealed && c.isOdd;
            svg += `<rect x="${c.x - 45}" y="35" width="90" height="120" rx="14" fill="${isWinner ? '#fee2e2' : '#fff'}" stroke="${isWinner ? '#ef4444' : '#cbd5e1'}" stroke-width="${isWinner ? '3.5' : '2'}"/>`;
            svg += `<text x="${c.x}" y="95" font-size="44" text-anchor="middle">${c.emoji}</text>`;
            svg += `<text x="${c.x}" y="135" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="${isWinner ? '#b91c1c' : '#334155'}" text-anchor="middle">${c.label}</text>`;
            if (isWinner) {
              svg += `<circle cx="${c.x}" cy="24" r="12" fill="#ef4444"/>`;
              svg += `<text x="${c.x}" y="29" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">★</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },

      // 4. Shadow Match (Butterfly)
      {
        question: 'Which dark shadow matches the colorful butterfly: Shadow A, B, or C?',
        answerRaw: 'B',
        answersAccepted: ['b', 'shadow b', 'b matches', '2'],
        answerTitle: 'Answer: Shadow B! 🦋',
        explanation: 'Shadow B has the matching curved antennae and twin round wings of the butterfly!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>`;
          // Original butterfly
          svg += `<rect x="25" y="30" width="110" height="135" rx="16" fill="#fff" stroke="#10b981" stroke-width="3"/>`;
          svg += `<text x="80" y="100" font-size="55" text-anchor="middle">🦋</text>`;
          svg += `<text x="80" y="145" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#047857" text-anchor="middle">COLORFUL</text>`;

          // Shadows A, B, C
          const shadows = [
            { x: 195, label: 'A', icon: '🐝', correct: false },
            { x: 285, label: 'B', icon: '🦋', correct: true },
            { x: 375, label: 'C', icon: '🪲', correct: false }
          ];
          shadows.forEach(s => {
            const isWinner = isRevealed && s.correct;
            svg += `<rect x="${s.x - 40}" y="35" width="80" height="130" rx="14" fill="${isWinner ? '#d1fae5' : '#1e293b'}" stroke="${isWinner ? '#10b981' : '#334155'}" stroke-width="${isWinner ? '3' : '2'}"/>`;
            svg += `<g style="filter: brightness(0);">${`<text x="${s.x}" y="100" font-size="44" text-anchor="middle">${s.icon}</text>`}</g>`;
            svg += `<rect x="${s.x - 22}" y="130" width="44" height="22" rx="6" fill="${isWinner ? '#10b981' : '#475569'}"/>`;
            svg += `<text x="${s.x}" y="146" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">${s.label}</text>`;
          });
          svg += `</svg>`;
          return svg;
        }
      },

      // 5. Size Ordering (Ant, Dog, Elephant)
      {
        question: 'Look at the 3 animals: Ant, Dog, and Elephant! Which one is the BIGGEST of all?',
        answerRaw: 'elephant',
        answersAccepted: ['elephant', 'the elephant', 'an elephant'],
        answerTitle: 'Answer: The ELEPHANT! 🐘',
        explanation: 'The tiny ant is smallest, the dog is medium, and the huge elephant is the biggest of all!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          // Ground
          svg += `<line x1="20" y1="160" x2="440" y2="160" stroke="#cbd5e1" stroke-width="3"/>`;
          // Ant (Small)
          svg += `<text x="70" y="155" font-size="24" text-anchor="middle">🐜</text>`;
          svg += `<text x="70" y="180" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#64748b" text-anchor="middle">Small</text>`;
          // Dog (Medium)
          svg += `<text x="190" y="150" font-size="50" text-anchor="middle">🐕</text>`;
          svg += `<text x="190" y="180" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#64748b" text-anchor="middle">Medium</text>`;
          // Elephant (Biggest)
          svg += `<text x="350" y="140" font-size="90" text-anchor="middle">🐘</text>`;
          const elColor = isRevealed ? '#10b981' : '#64748b';
          svg += `<text x="350" y="180" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="${elColor}" text-anchor="middle">BIGGEST!</text>`;
          if (isRevealed) {
            svg += `<circle cx="350" cy="30" r="16" fill="#f59e0b"/>`;
            svg += `<text x="350" y="36" font-size="18" text-anchor="middle">⭐</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 6. Fruit Pattern (Apple, Banana, Apple, Banana...)
      {
        question: 'Look at the fruit pattern: 🍎 🍌 🍎 🍌 [?] What fruit comes next?',
        answerRaw: 'apple',
        answersAccepted: ['apple', 'an apple', 'the apple', 'red apple'],
        answerTitle: 'Answer: An APPLE! 🍎',
        explanation: 'Apple, Banana, Apple, Banana... the repeating fruit pattern starts over with an APPLE!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>`;
          const fruits = [
            { x: 70, f: '🍎' },
            { x: 150, f: '🍌' },
            { x: 230, f: '🍎' },
            { x: 310, f: '🍌' }
          ];
          fruits.forEach(fr => {
            svg += `<text x="${fr.x}" y="115" font-size="50" text-anchor="middle">${fr.f}</text>`;
          });
          if (isRevealed) {
            svg += `<rect x="360" y="55" width="65" height="75" rx="14" fill="#fee2e2" stroke="#ef4444" stroke-width="3"/>`;
            svg += `<text x="392" y="115" font-size="50" text-anchor="middle">🍎</text>`;
            svg += `<rect x="150" y="150" width="160" height="26" rx="8" fill="#10b981"/>`;
            svg += `<text x="230" y="168" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">APPLE IS NEXT! 🍎</text>`;
          } else {
            svg += `<rect x="360" y="55" width="65" height="75" rx="14" fill="#fff" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,4"/>`;
            svg += `<text x="392" y="105" font-family="'Fredoka', sans-serif" font-size="34" font-weight="800" fill="#f59e0b" text-anchor="middle">?</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 7. Full vs Empty Cup
      {
        question: 'Look at the two juice cups! Which cup is completely FULL: Cup A or Cup B?',
        answerRaw: 'A',
        answersAccepted: ['a', 'cup a', 'glass a', '1'],
        answerTitle: 'Answer: Cup A is FULL! 🧃',
        explanation: 'Cup A has orange juice filled all the way to the top! Cup B is totally empty.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>`;
          // Table
          svg += `<line x1="40" y1="160" x2="420" y2="160" stroke="#cbd5e1" stroke-width="3"/>`;
          // Cup A (Full orange juice)
          svg += `<path d="M100,50 L110,150 L160,150 L170,50 Z" fill="#fdba74" stroke="#f97316" stroke-width="3"/>`;
          // Straw
          svg += `<line x1="140" y1="140" x2="160" y2="30" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>`;
          svg += `<rect x="110" y="165" width="50" height="22" rx="6" fill="${isRevealed ? '#10b981' : '#64748b'}"/>`;
          svg += `<text x="135" y="180" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">Cup A</text>`;

          // Cup B (Empty glass)
          svg += `<path d="M290,50 L300,150 L350,150 L360,50 Z" fill="rgba(255,255,255,0.7)" stroke="#94a3b8" stroke-width="3"/>`;
          svg += `<rect x="300" y="165" width="50" height="22" rx="6" fill="#64748b"/>`;
          svg += `<text x="325" y="180" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">Cup B</text>`;

          if (isRevealed) {
            svg += `<circle cx="135" cy="20" r="14" fill="#f59e0b"/>`;
            svg += `<text x="135" y="25" font-size="14" text-anchor="middle">⭐</text>`;
            svg += `<rect x="200" y="85" width="80" height="26" rx="8" fill="#10b981"/>`;
            svg += `<text x="240" y="103" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">FULL! 🧃</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 8. Things That Go Together (Shoe & Sock)
      {
        question: 'You put on your shoe 👟! Which item goes together with your shoe: Sock, Spoon, or Car?',
        answerRaw: 'sock',
        answersAccepted: ['sock', 'a sock', 'socks', 'the sock'],
        answerTitle: 'Answer: A SOCK! 🧦',
        explanation: 'Shoes and socks are best buddies for your feet! You put cozy socks on before your shoes!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          // Shoe on left
          svg += `<rect x="25" y="35" width="110" height="130" rx="16" fill="#e0f2fe" stroke="#38bdf8" stroke-width="3"/>`;
          svg += `<text x="80" y="105" font-size="55" text-anchor="middle">👟</text>`;
          svg += `<text x="80" y="145" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#0369a1" text-anchor="middle">SHOE</text>`;

          // 3 choices
          const choices = [
            { x: 200, icon: '🧦', name: 'Sock', match: true },
            { x: 290, icon: '🥄', name: 'Spoon', match: false },
            { x: 380, icon: '🚗', name: 'Car', match: false }
          ];
          choices.forEach(c => {
            const isWinner = isRevealed && c.match;
            svg += `<rect x="${c.x - 40}" y="40" width="80" height="120" rx="14" fill="${isWinner ? '#dcfce7' : '#fff'}" stroke="${isWinner ? '#10b981' : '#cbd5e1'}" stroke-width="${isWinner ? '3.5' : '2'}"/>`;
            svg += `<text x="${c.x}" y="100" font-size="44" text-anchor="middle">${c.icon}</text>`;
            svg += `<text x="${c.x}" y="140" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="${isWinner ? '#065f46' : '#334155'}" text-anchor="middle">${c.name}</text>`;
            if (isWinner) {
              svg += `<circle cx="${c.x}" cy="28" r="12" fill="#10b981"/>`;
              svg += `<text x="${c.x}" y="33" font-size="12" text-anchor="middle">✓</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },

      // 9. Missing Puzzle Piece
      {
        question: 'A puzzle corner is missing from the striped square! Which piece fits: Piece A, B, or C?',
        answerRaw: 'A',
        answersAccepted: ['a', 'piece a', '1'],
        answerTitle: 'Answer: Piece A! 🧩',
        explanation: 'Piece A has the matching blue color and diagonal stripe to complete the square puzzle!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>`;
          // Main square with top-right corner missing
          svg += `<rect x="60" y="45" width="100" height="100" rx="8" fill="#3b82f6"/>`;
          svg += `<line x1="60" y1="145" x2="160" y2="45" stroke="#fff" stroke-width="8"/>`;
          // Cutout in top right
          svg += `<rect x="120" y="45" width="40" height="40" fill="#f0f9ff" stroke="#f59e0b" stroke-dasharray="4,3" stroke-width="2"/>`;
          svg += `<text x="140" y="72" font-family="'Fredoka', sans-serif" font-size="16" font-weight="900" fill="#f59e0b" text-anchor="middle">?</text>`;

          // 3 Pieces
          const pieces = [
            { x: 230, label: 'A', fill: '#3b82f6', stripe: true, match: true },
            { x: 305, label: 'B', fill: '#ef4444', stripe: false, match: false },
            { x: 380, label: 'C', fill: '#10b981', stripe: false, match: false }
          ];
          pieces.forEach(p => {
            const isWinner = isRevealed && p.match;
            svg += `<rect x="${p.x - 30}" y="65" width="60" height="60" rx="8" fill="${p.fill}" stroke="${isWinner ? '#f59e0b' : '#cbd5e1'}" stroke-width="${isWinner ? '4' : '2'}"/>`;
            if (p.stripe) {
              svg += `<line x1="${p.x - 30}" y1="125" x2="${p.x + 30}" y2="65" stroke="#fff" stroke-width="6"/>`;
            }
            svg += `<rect x="${p.x - 16}" y="135" width="32" height="20" rx="6" fill="${isWinner ? '#10b981' : '#64748b'}"/>`;
            svg += `<text x="${p.x}" y="149" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">${p.label}</text>`;
          });
          svg += `</svg>`;
          return svg;
        }
      },

      // 10. Odd One Out (Vehicles vs Lion)
      {
        question: 'Look at the 4 pictures: 🚗 Car, ✈️ Airplane, 🚢 Boat, 🦁 Lion. Which one does NOT belong?',
        answerRaw: 'lion',
        answersAccepted: ['lion', 'the lion', 'a lion', 'animal'],
        answerTitle: 'Answer: The LION! 🦁',
        explanation: 'The car, airplane, and boat are vehicles that people ride in! The lion is a wild furry animal!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
          const cards = [
            { x: 65, emoji: '🚗', name: 'Car', isOdd: false },
            { x: 175, emoji: '✈️', name: 'Plane', isOdd: false },
            { x: 285, emoji: '🚢', name: 'Boat', isOdd: false },
            { x: 395, emoji: '🦁', name: 'Lion', isOdd: true }
          ];
          cards.forEach(c => {
            const isWinner = isRevealed && c.isOdd;
            svg += `<rect x="${c.x - 45}" y="35" width="90" height="120" rx="14" fill="${isWinner ? '#fef3c7' : '#fff'}" stroke="${isWinner ? '#f59e0b' : '#cbd5e1'}" stroke-width="${isWinner ? '3.5' : '2'}"/>`;
            svg += `<text x="${c.x}" y="95" font-size="44" text-anchor="middle">${c.emoji}</text>`;
            svg += `<text x="${c.x}" y="135" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="${isWinner ? '#b45309' : '#334155'}" text-anchor="middle">${c.name}</text>`;
            if (isWinner) {
              svg += `<circle cx="${c.x}" cy="24" r="12" fill="#f59e0b"/>`;
              svg += `<text x="${c.x}" y="29" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">★</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },

      // 11. Star Size Detective (Smallest Star)
      {
        question: 'Look at Star 1, Star 2, and Star 3! Which star is the SMALLEST of all?',
        answerRaw: '1',
        answersAccepted: ['1', 'star 1', 'first', 'the first one', 'one'],
        answerTitle: 'Answer: Star 1! ⭐',
        explanation: 'Star 1 is tiny, Star 2 is medium, and Star 3 is giant! Star 1 is the smallest!',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#0f172a" stroke="#334155" stroke-width="2"/>`;
          // Star 1 (Tiny)
          svg += `<text x="90" y="110" font-size="30" text-anchor="middle">⭐</text>`;
          svg += `<rect x="65" y="140" width="50" height="22" rx="6" fill="${isRevealed ? '#10b981' : '#334155'}"/>`;
          svg += `<text x="90" y="155" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">Star 1</text>`;

          // Star 2 (Medium)
          svg += `<text x="215" y="115" font-size="52" text-anchor="middle">⭐</text>`;
          svg += `<rect x="190" y="140" width="50" height="22" rx="6" fill="#334155"/>`;
          svg += `<text x="215" y="155" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">Star 2</text>`;

          // Star 3 (Giant)
          svg += `<text x="350" y="125" font-size="80" text-anchor="middle">⭐</text>`;
          svg += `<rect x="325" y="140" width="50" height="22" rx="6" fill="#334155"/>`;
          svg += `<text x="350" y="155" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">Star 3</text>`;

          if (isRevealed) {
            svg += `<circle cx="90" cy="55" r="14" fill="#10b981"/>`;
            svg += `<text x="90" y="60" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">✓</text>`;
            svg += `<rect x="150" y="20" width="160" height="26" rx="8" fill="#10b981"/>`;
            svg += `<text x="230" y="38" font-family="'Fredoka', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">STAR 1 IS SMALLEST!</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      // 12. Animal Homes (Beehive)
      {
        question: 'Where does a busy honeybee live? Bird Nest, Beehive, or Doghouse?',
        answerRaw: 'beehive',
        answersAccepted: ['beehive', 'a beehive', 'the beehive', 'hive'],
        answerTitle: 'Answer: A BEEHIVE! 🍯',
        explanation: 'Bees build golden honeycomb beehives! Birds make stick nests and dogs live in doghouses.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="10" y="10" width="440" height="180" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>`;
          // Flying bee on left
          svg += `<text x="65" y="105" font-size="50" text-anchor="middle">🐝</text>`;
          svg += `<text x="65" y="145" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#b45309" text-anchor="middle">Bee</text>`;

          // 3 homes
          const homes = [
            { x: 175, icon: '🪹', name: 'Nest', match: false },
            { x: 285, icon: '🍯', name: 'Beehive', match: true },
            { x: 395, icon: '🏠', name: 'Doghouse', match: false }
          ];
          homes.forEach(h => {
            const isWinner = isRevealed && h.match;
            svg += `<rect x="${h.x - 45}" y="35" width="90" height="120" rx="14" fill="${isWinner ? '#fef3c7' : '#fff'}" stroke="${isWinner ? '#f59e0b' : '#cbd5e1'}" stroke-width="${isWinner ? '3.5' : '2'}"/>`;
            svg += `<text x="${h.x}" y="95" font-size="44" text-anchor="middle">${h.icon}</text>`;
            svg += `<text x="${h.x}" y="135" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="${isWinner ? '#b45309' : '#334155'}" text-anchor="middle">${h.name}</text>`;
            if (isWinner) {
              svg += `<circle cx="${h.x}" cy="24" r="12" fill="#f59e0b"/>`;
              svg += `<text x="${h.x}" y="29" font-size="12" text-anchor="middle">⭐</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      }
    ]
  };

  // ========================================================
  // KINDERGARTEN SLIDE RENDER & ADVANCE LOGIC
  // ========================================================
  function renderKindergartenSlideDots(totalSlides, currentIdx) {
    if (!kindergartenSlideDots) return;
    kindergartenSlideDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.className = `slide-dot ${i === currentIdx ? 'active' : ''}`;
      dot.setAttribute('title', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        showKindergartenSlide(i);
      });
      kindergartenSlideDots.appendChild(dot);
    }
  }

  function showKindergartenSlide(index) {
    kindergartenState = 'QUESTION';
    const slides = KINDERGARTEN_SLIDES[activeKindergartenTrack] || [];
    if (!slides.length) return;

    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;

    trackKindergartenIndices[activeKindergartenTrack] = index;
    currentKindergartenSlide = slides[index];

    kindergartenCardEl.style.animation = 'none';
    void kindergartenCardEl.offsetWidth;
    kindergartenCardEl.style.animation = 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    playPopSound();

    const trackNames = {
      math: 'Counting & Math',
      questions: 'Curious Questions',
      riddles: 'Playful Riddles',
      puzzles: 'Shape Puzzles'
    };
    kindergartenBadgeEl.textContent = `🌱 Kindergarten • ${trackNames[activeKindergartenTrack] || ''}`;
    kindergartenSlideIndicator.textContent = `Slide ${index + 1} of ${slides.length}`;
    renderKindergartenSlideDots(slides.length, index);

    prevKindergartenSlideBtn.disabled = (index === 0);
    nextKindergartenSlideBtn.disabled = (index === slides.length - 1);

    kindergartenQuestionEl.textContent = currentKindergartenSlide.question;
    kindergartenViewportEl.innerHTML = currentKindergartenSlide.render(false);

    kindergartenAnswerInput.value = '';
    kindergartenInputFeedback.textContent = '';
    kindergartenInputFeedback.className = 'input-feedback';

    kindergartenSolutionBoxEl.classList.add('hidden');
    kindergartenAnswerTitleEl.textContent = '';
    kindergartenExplanationEl.textContent = '';

    kindergartenActionBtn.classList.remove('next-mode');
    kindergartenActionText.textContent = 'Reveal Answer';
  }

  function revealKindergartenSolution() {
    kindergartenState = 'SOLUTION';
    if (!currentKindergartenSlide) return;

    kindergartenViewportEl.innerHTML = currentKindergartenSlide.render(true);

    kindergartenAnswerTitleEl.textContent = currentKindergartenSlide.answerTitle;
    kindergartenExplanationEl.textContent = currentKindergartenSlide.explanation;
    kindergartenSolutionBoxEl.classList.remove('hidden');

    const typed = kindergartenAnswerInput.value.trim().toLowerCase();
    let isCorrectTyped = null;
    if (typed !== '') {
      const accepted = currentKindergartenSlide.answersAccepted.map(a => a.toLowerCase().trim());
      const raw = currentKindergartenSlide.answerRaw.toLowerCase().trim();
      if (accepted.includes(typed) || typed === raw) {
        isCorrectTyped = true;
        kindergartenInputFeedback.textContent = '🌟 Spot on! You are so smart!';
        kindergartenInputFeedback.className = 'input-feedback correct';
      } else {
        isCorrectTyped = false;
        kindergartenInputFeedback.textContent = `Nice try! The answer is: ${currentKindergartenSlide.answerRaw}`;
        kindergartenInputFeedback.className = 'input-feedback incorrect';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }
    if (typeof ProfileManager !== 'undefined' && ProfileManager.recordCompletion) {
      ProfileManager.recordCompletion('kindergarten', streak);
    } else {
      totalCompleted += 1;
    }
    saveStats();
    updateStatsUI();

    if (streak > 0 && streak % 5 === 0) {
      playChimeSound(true);
      triggerConfetti();
      streakPillEl.classList.add('bump');
      setTimeout(() => streakPillEl.classList.remove('bump'), 300);
    } else {
      playChimeSound(false);
    }

    kindergartenActionBtn.classList.add('next-mode');
    kindergartenActionText.textContent = 'Next Question →';
  }

  function prevKindergartenSlide() {
    const currentIdx = trackKindergartenIndices[activeKindergartenTrack] || 0;
    if (currentIdx > 0) {
      showKindergartenSlide(currentIdx - 1);
    }
  }

  function nextKindergartenSlide() {
    const slides = KINDERGARTEN_SLIDES[activeKindergartenTrack] || [];
    const currentIdx = trackKindergartenIndices[activeKindergartenTrack] || 0;
    if (currentIdx < slides.length - 1) {
      showKindergartenSlide(currentIdx + 1);
    } else {
      showKindergartenSlide(0);
    }
  }

  function handleKindergartenAdvance() {
    kindergartenActionBtn.classList.add('pressed');
    setTimeout(() => kindergartenActionBtn.classList.remove('pressed'), 120);

    if (kindergartenState === 'QUESTION') {
      revealKindergartenSolution();
    } else if (kindergartenState === 'SOLUTION') {
      nextKindergartenSlide();
    }
  }

  // ========================================================
  // PER-USER PROFILE PERSISTENCE LAYER (ZERO AUTH)
  // ========================================================
  const AVATARS = ['🎈', '🚀', '🦊', '🐱', '🐶', '🐻', '🦁', '🦄', '🦖', '🌟', '🐼', '🐨'];
  const STORAGE_PROFILES_KEY = 'mathpop_profiles_v1';
  const STORAGE_ACTIVE_PROFILE_KEY = 'mathpop_active_profile_id';

  let profiles = [];
  let activeProfileId = null;
  let selectedNewAvatar = '🎈';
  let selectedEditAvatar = '🎈';

  const ProfileManager = {
    init() {
      try {
        const stored = localStorage.getItem(STORAGE_PROFILES_KEY);
        if (stored) {
          profiles = JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Could not parse profiles from localStorage:', err);
        profiles = [];
      }

      // Backward Compatibility & Migration:
      // If no profiles array exists yet, read legacy mathpop_total and mathpop_streak
      if (!Array.isArray(profiles) || profiles.length === 0) {
        const legacyTotal = parseInt(localStorage.getItem('mathpop_total') || '0', 10);
        const legacyStreak = parseInt(localStorage.getItem('mathpop_streak') || '0', 10);
        const defaultProfile = {
          id: 'prof_' + Date.now(),
          name: 'Player 1',
          avatar: '🎈',
          createdAt: Date.now(),
          stats: {
            totalCompleted: legacyTotal,
            currentStreak: legacyStreak,
            bestStreak: legacyStreak,
            categories: {
              kindergarten: 0,
              grade2: legacyTotal > 0 ? legacyTotal : 0,
              grade3: 0,
              grade4: 0,
              grade5: 0,
              riddles: 0,
              science: 0
            }
          }
        };
        profiles = [defaultProfile];
        activeProfileId = defaultProfile.id;
        this.saveProfiles();
      } else {
        // Ensure data consistency across schema versions
        profiles.forEach(p => {
          if (!p.stats) p.stats = {};
          if (typeof p.stats.totalCompleted !== 'number') p.stats.totalCompleted = 0;
          if (typeof p.stats.currentStreak !== 'number') p.stats.currentStreak = 0;
          if (typeof p.stats.bestStreak !== 'number') p.stats.bestStreak = p.stats.currentStreak || 0;
          if (!p.stats.categories) p.stats.categories = {};
        });

        activeProfileId = localStorage.getItem(STORAGE_ACTIVE_PROFILE_KEY);
        if (!activeProfileId || !profiles.some(p => p.id === activeProfileId)) {
          activeProfileId = profiles[0].id;
          localStorage.setItem(STORAGE_ACTIVE_PROFILE_KEY, activeProfileId);
        }
      }

      this.syncActiveToGlobalState();
    },

    getProfiles() {
      return profiles;
    },

    saveProfiles() {
      try {
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
        if (activeProfileId) {
          localStorage.setItem(STORAGE_ACTIVE_PROFILE_KEY, activeProfileId);
        }
        // Mirror active stats to legacy keys
        const active = this.getActiveProfile();
        if (active) {
          localStorage.setItem('mathpop_streak', (active.stats.currentStreak || 0).toString());
          localStorage.setItem('mathpop_total', (active.stats.totalCompleted || 0).toString());
        }
      } catch (err) {
        console.error('Failed to save profiles to localStorage:', err);
      }
    },

    getActiveProfile() {
      return profiles.find(p => p.id === activeProfileId) || profiles[0];
    },

    setActiveProfile(id) {
      const match = profiles.find(p => p.id === id);
      if (!match) return;
      activeProfileId = id;
      this.syncActiveToGlobalState();
      this.saveProfiles();
      updateStatsUI();
      renderProfileModalContent();
    },

    syncActiveToGlobalState() {
      const active = this.getActiveProfile();
      if (active) {
        streak = active.stats.currentStreak || 0;
        totalCompleted = active.stats.totalCompleted || 0;
      }
    },

    updateStats(currentStreak, total) {
      const active = this.getActiveProfile();
      if (!active) return;
      active.stats.currentStreak = currentStreak;
      active.stats.totalCompleted = total;
      active.stats.bestStreak = Math.max(active.stats.bestStreak || 0, currentStreak);
      this.saveProfiles();
    },

    recordCompletion(categoryKey, currentStreak) {
      const active = this.getActiveProfile();
      if (!active) return;
      active.stats.totalCompleted = (active.stats.totalCompleted || 0) + 1;
      active.stats.currentStreak = currentStreak;
      active.stats.bestStreak = Math.max(active.stats.bestStreak || 0, currentStreak);
      if (!active.stats.categories) active.stats.categories = {};
      active.stats.categories[categoryKey] = (active.stats.categories[categoryKey] || 0) + 1;

      this.syncActiveToGlobalState();
      this.saveProfiles();
      if (profileModal && !profileModal.classList.contains('hidden')) {
        renderProfileModalContent();
      }
    },

    createProfile(name, avatar) {
      const cleanName = (name || '').trim() || `Player ${profiles.length + 1}`;
      const newProfile = {
        id: 'prof_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name: cleanName,
        avatar: avatar || '🎈',
        createdAt: Date.now(),
        stats: {
          totalCompleted: 0,
          currentStreak: 0,
          bestStreak: 0,
          categories: {
            kindergarten: 0,
            grade2: 0,
            grade3: 0,
            grade4: 0,
            grade5: 0,
            riddles: 0,
            science: 0
          }
        }
      };
      profiles.push(newProfile);
      this.setActiveProfile(newProfile.id);
    },

    updateProfileInfo(id, newName, newAvatar) {
      const profile = profiles.find(p => p.id === id);
      if (!profile) return;
      if (newName && newName.trim()) {
        profile.name = newName.trim();
      }
      if (newAvatar) {
        profile.avatar = newAvatar;
      }
      this.saveProfiles();
      updateStatsUI();
      renderProfileModalContent();
    },

    resetProfileStats(id) {
      const profile = profiles.find(p => p.id === id);
      if (!profile) return;
      profile.stats.totalCompleted = 0;
      profile.stats.currentStreak = 0;
      profile.stats.bestStreak = 0;
      profile.stats.categories = {
        kindergarten: 0,
        grade2: 0,
        grade3: 0,
        grade4: 0,
        grade5: 0,
        riddles: 0,
        science: 0
      };
      if (id === activeProfileId) {
        this.syncActiveToGlobalState();
      }
      this.saveProfiles();
      updateStatsUI();
      renderProfileModalContent();
    },

    deleteProfile(id) {
      if (profiles.length <= 1) {
        alert('You must keep at least one player profile!');
        return;
      }
      const index = profiles.findIndex(p => p.id === id);
      if (index === -1) return;
      profiles.splice(index, 1);
      if (activeProfileId === id) {
        activeProfileId = profiles[0].id;
        this.syncActiveToGlobalState();
      }
      this.saveProfiles();
      updateStatsUI();
      renderProfileModalContent();
    },

    exportData() {
      const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        activeProfileId,
        profiles
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mathpop-profiles-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    importData(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        let importedProfiles = [];
        if (Array.isArray(parsed)) {
          importedProfiles = parsed;
        } else if (parsed && Array.isArray(parsed.profiles)) {
          importedProfiles = parsed.profiles;
        } else {
          throw new Error('Invalid file format: No profiles list found.');
        }

        if (importedProfiles.length === 0) {
          throw new Error('Backup file contains no profiles.');
        }

        importedProfiles.forEach((p, i) => {
          if (!p.id) p.id = 'prof_' + Date.now() + '_' + i;
          if (!p.name) p.name = `Player ${i + 1}`;
          if (!p.avatar) p.avatar = '🎈';
          if (!p.stats) p.stats = {};
          if (typeof p.stats.totalCompleted !== 'number') p.stats.totalCompleted = 0;
          if (typeof p.stats.currentStreak !== 'number') p.stats.currentStreak = 0;
          if (typeof p.stats.bestStreak !== 'number') p.stats.bestStreak = p.stats.currentStreak || 0;
          if (!p.stats.categories) p.stats.categories = {};
        });

        profiles = importedProfiles;
        activeProfileId = (parsed.activeProfileId && profiles.some(p => p.id === parsed.activeProfileId))
          ? parsed.activeProfileId
          : profiles[0].id;

        this.syncActiveToGlobalState();
        this.saveProfiles();
        updateStatsUI();
        renderProfileModalContent();
        alert('Profiles successfully imported!');
      } catch (err) {
        alert('Could not import profiles: ' + err.message);
      }
    }
  };

  // Profile Modal Helpers
  function renderAvatarPicker(containerEl, currentAvatar, onSelect) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    AVATARS.forEach(avatar => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'avatar-choice' + (avatar === currentAvatar ? ' selected' : '');
      btn.textContent = avatar;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        containerEl.querySelectorAll('.avatar-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        onSelect(avatar);
      });
      containerEl.appendChild(btn);
    });
  }

  function renderCategoryBreakdown(containerEl, categories) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    const categoryLabels = [
      { key: 'kindergarten', label: '🌱 Kindergarten' },
      { key: 'grade2', label: '2️⃣ 2nd Grade' },
      { key: 'grade3', label: '3️⃣ 3rd Grade' },
      { key: 'grade4', label: '4️⃣ 4th Grade' },
      { key: 'grade5', label: '5️⃣ 5th Grade' },
      { key: 'riddles', label: '🧩 Teasers' },
      { key: 'science', label: '🔬 Science' }
    ];

    categoryLabels.forEach(cat => {
      const count = (categories && categories[cat.key]) || 0;
      const chip = document.createElement('div');
      chip.className = 'cat-chip';
      chip.innerHTML = `<span>${cat.label}</span><span class="cat-chip-count">${count}</span>`;
      containerEl.appendChild(chip);
    });
  }

  function renderProfileModalContent() {
    const active = ProfileManager.getActiveProfile();
    if (!active) return;

    if (modalActiveAvatar) modalActiveAvatar.textContent = active.avatar || '🎈';
    if (modalActiveName) modalActiveName.textContent = active.name || 'Player 1';
    if (modalTotalCompleted) modalTotalCompleted.textContent = active.stats.totalCompleted || 0;
    if (modalCurrentStreak) modalCurrentStreak.textContent = active.stats.currentStreak || 0;
    if (modalBestStreak) modalBestStreak.textContent = active.stats.bestStreak || 0;

    renderCategoryBreakdown(categoryBreakdownGrid, active.stats.categories);

    if (profileList) {
      profileList.innerHTML = '';
      const allProfiles = ProfileManager.getProfiles();
      allProfiles.forEach(p => {
        const item = document.createElement('div');
        const isActive = p.id === active.id;
        item.className = 'profile-item' + (isActive ? ' active' : '');

        const leftDiv = document.createElement('div');
        leftDiv.className = 'profile-item-left';

        const avatarSpan = document.createElement('span');
        avatarSpan.className = 'profile-item-avatar';
        avatarSpan.textContent = p.avatar || '🎈';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'profile-item-info';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'profile-item-name';
        nameSpan.textContent = p.name;

        const statsSpan = document.createElement('span');
        statsSpan.className = 'profile-item-stats';
        statsSpan.textContent = `${p.stats.totalCompleted || 0} completed • Best: ${p.stats.bestStreak || 0}`;

        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(statsSpan);
        leftDiv.appendChild(avatarSpan);
        leftDiv.appendChild(infoDiv);
        item.appendChild(leftDiv);

        if (isActive) {
          const activeLabel = document.createElement('span');
          activeLabel.className = 'profile-item-active-label';
          activeLabel.textContent = 'Active';
          item.appendChild(activeLabel);
        } else {
          const switchBtn = document.createElement('button');
          switchBtn.type = 'button';
          switchBtn.className = 'btn-switch';
          switchBtn.textContent = 'Switch';
          switchBtn.addEventListener('click', () => {
            ProfileManager.setActiveProfile(p.id);
          });
          item.appendChild(switchBtn);
        }

        profileList.appendChild(item);
      });

      if (deleteProfileBtn) {
        if (allProfiles.length > 1) {
          deleteProfileBtn.classList.remove('hidden');
        } else {
          deleteProfileBtn.classList.add('hidden');
        }
      }
    }
  }

  function openProfileModal() {
    renderProfileModalContent();
    hideNewPlayerForm();
    hideEditProfile();
    if (profileModal) profileModal.classList.remove('hidden');
  }

  function closeProfileModal() {
    if (profileModal) profileModal.classList.add('hidden');
    hideNewPlayerForm();
    hideEditProfile();
  }

  function showEditProfile() {
    const active = ProfileManager.getActiveProfile();
    if (!active || !editPlayerForm) return;
    editPlayerNameInput.value = active.name;
    selectedEditAvatar = active.avatar || '🎈';
    renderAvatarPicker(editAvatarPicker, selectedEditAvatar, (avatar) => {
      selectedEditAvatar = avatar;
    });
    editPlayerForm.classList.remove('hidden');
    editPlayerNameInput.focus();
  }

  function hideEditProfile() {
    if (editPlayerForm) editPlayerForm.classList.add('hidden');
  }

  function toggleNewPlayerForm() {
    if (!newPlayerForm) return;
    if (newPlayerForm.classList.contains('hidden')) {
      showNewPlayerForm();
    } else {
      hideNewPlayerForm();
    }
  }

  function showNewPlayerForm() {
    if (!newPlayerForm) return;
    newPlayerNameInput.value = '';
    selectedNewAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    renderAvatarPicker(newAvatarPicker, selectedNewAvatar, (avatar) => {
      selectedNewAvatar = avatar;
    });
    newPlayerForm.classList.remove('hidden');
    newPlayerNameInput.focus();
  }

  function hideNewPlayerForm() {
    if (newPlayerForm) newPlayerForm.classList.add('hidden');
  }

  // ========================================================
  // STATS & UNIFIED NAVIGATION
  // ========================================================
  function saveStats() {
    ProfileManager.updateStats(streak, totalCompleted);
  }

  function updateStatsUI() {
    const active = ProfileManager.getActiveProfile();
    if (active) {
      streakCountEl.textContent = active.stats.currentStreak || 0;
      totalCompletedEl.textContent = active.stats.totalCompleted || 0;
      if (profileAvatarEl) profileAvatarEl.textContent = active.avatar || '🎈';
      if (profileNameEl) profileNameEl.textContent = active.name || 'Player';
    } else {
      streakCountEl.textContent = streak;
      totalCompletedEl.textContent = totalCompleted;
    }
  }

  function switchTab(newTab) {
    if (newTab === activeTab) return;
    activeTab = newTab;

    tabButtons.forEach(btn => {
      const isMatch = btn.dataset.tab === activeTab;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    if (activeTab === 'kindergarten') {
      if (mathSection) mathSection.classList.add('hidden');
      if (scienceSection) scienceSection.classList.add('hidden');
      if (riddlesSection) riddlesSection.classList.add('hidden');
      if (kindergartenSection) kindergartenSection.classList.remove('hidden');
      showKindergartenSlide(trackKindergartenIndices[activeKindergartenTrack] || 0);
    } else if (activeTab === 'riddles') {
      if (mathSection) mathSection.classList.add('hidden');
      if (scienceSection) scienceSection.classList.add('hidden');
      if (kindergartenSection) kindergartenSection.classList.add('hidden');
      if (riddlesSection) riddlesSection.classList.remove('hidden');
      showSlide(trackSlideIndices[activeTeaserTrack] || 0);
    } else if (activeTab === 'science') {
      if (mathSection) mathSection.classList.add('hidden');
      if (riddlesSection) riddlesSection.classList.add('hidden');
      if (kindergartenSection) kindergartenSection.classList.add('hidden');
      if (scienceSection) scienceSection.classList.remove('hidden');
      showScienceSlide(trackScienceIndices[activeScienceTrack] || 0);
    } else {
      if (riddlesSection) riddlesSection.classList.add('hidden');
      if (scienceSection) scienceSection.classList.add('hidden');
      if (kindergartenSection) kindergartenSection.classList.add('hidden');
      if (mathSection) mathSection.classList.remove('hidden');
      renderTopicBar();
      showNewMathProblem();
    }
  }

  // ========================================================
  // EVENT LISTENERS
  // ========================================================
  window.addEventListener('keydown', (e) => {
    // If profile modal is open, Esc closes it, and do not trigger game advances
    if (profileModal && !profileModal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeProfileModal();
      }
      return;
    }

    if (e.code === 'Space' || e.key === ' ' || e.code === 'Enter' || e.key === 'Enter') {
      e.preventDefault();
      if (activeTab === 'kindergarten') {
        handleKindergartenAdvance();
      } else if (activeTab === 'riddles') {
        handleRiddleAdvance();
      } else if (activeTab === 'science') {
        handleScienceAdvance();
      } else {
        handleMathAdvance();
      }
    } else if (activeTab === 'kindergarten') {
      if (e.key === 'ArrowLeft' && document.activeElement !== kindergartenAnswerInput) {
        e.preventDefault();
        prevKindergartenSlide();
      } else if (e.key === 'ArrowRight' && document.activeElement !== kindergartenAnswerInput) {
        e.preventDefault();
        nextKindergartenSlide();
      }
    } else if (activeTab === 'riddles') {
      if (e.key === 'ArrowLeft' && document.activeElement !== riddleAnswerInput) {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight' && document.activeElement !== riddleAnswerInput) {
        e.preventDefault();
        nextSlide();
      }
    } else if (activeTab === 'science') {
      if (e.key === 'ArrowLeft' && document.activeElement !== scienceAnswerInput) {
        e.preventDefault();
        prevScienceSlide();
      } else if (e.key === 'ArrowRight' && document.activeElement !== scienceAnswerInput) {
        e.preventDefault();
        nextScienceSlide();
      }
    }
  });

  kindergartenActionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleKindergartenAdvance();
  });

  prevKindergartenSlideBtn.addEventListener('click', () => {
    prevKindergartenSlide();
  });

  nextKindergartenSlideBtn.addEventListener('click', () => {
    nextKindergartenSlide();
  });

  kindergartenTrackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      kindergartenTrackButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeKindergartenTrack = btn.dataset.track;
      showKindergartenSlide(trackKindergartenIndices[activeKindergartenTrack] || 0);
    });
  });

  kindergartenSpeakBtn.addEventListener('click', () => {
    if (!currentKindergartenSlide) return;
    if (kindergartenState === 'QUESTION') {
      speakKindergarten(currentKindergartenSlide.question);
    } else {
      speakKindergarten(currentKindergartenSlide.answerTitle + '. ' + currentKindergartenSlide.explanation);
    }
  });

  actionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleMathAdvance();
  });

  riddleActionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleRiddleAdvance();
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  prevSlideBtn.addEventListener('click', () => {
    prevSlide();
  });

  nextSlideBtn.addEventListener('click', () => {
    nextSlide();
  });

  teaserTrackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      teaserTrackButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTeaserTrack = btn.dataset.track;
      showSlide(trackSlideIndices[activeTeaserTrack] || 0);
    });
  });

  scienceActionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleScienceAdvance();
  });

  prevScienceSlideBtn.addEventListener('click', () => {
    prevScienceSlide();
  });

  nextScienceSlideBtn.addEventListener('click', () => {
    nextScienceSlide();
  });

  scienceTrackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      scienceTrackButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeScienceTrack = btn.dataset.track;
      showScienceSlide(trackScienceIndices[activeScienceTrack] || 0);
    });
  });

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('mathpop_sound', soundEnabled.toString());
    soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
  });

  resetStatsBtn.addEventListener('click', () => {
    const active = ProfileManager.getActiveProfile();
    const pName = active ? active.name : 'your';
    if (confirm(`Reset streak and completed count for ${pName}?`)) {
      streak = 0;
      totalCompleted = 0;
      if (active) {
        ProfileManager.resetProfileStats(active.id);
      } else {
        saveStats();
        updateStatsUI();
      }
    }
  });

  // Profile Modal Event Listeners
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openProfileModal();
    });
  }

  if (closeProfileModalBtn) {
    closeProfileModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeProfileModal();
    });
  }

  if (profileModal) {
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) {
        closeProfileModal();
      }
    });
  }

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showEditProfile();
    });
  }

  if (cancelEditPlayerBtn) {
    cancelEditPlayerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideEditProfile();
    });
  }

  if (editPlayerForm) {
    editPlayerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const active = ProfileManager.getActiveProfile();
      if (active && editPlayerNameInput) {
        ProfileManager.updateProfileInfo(active.id, editPlayerNameInput.value, selectedEditAvatar);
      }
      hideEditProfile();
    });
  }

  if (toggleNewPlayerBtn) {
    toggleNewPlayerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleNewPlayerForm();
    });
  }

  if (cancelNewPlayerBtn) {
    cancelNewPlayerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideNewPlayerForm();
    });
  }

  if (newPlayerForm) {
    newPlayerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (newPlayerNameInput) {
        ProfileManager.createProfile(newPlayerNameInput.value, selectedNewAvatar);
      }
      hideNewPlayerForm();
    });
  }

  if (resetProfileStatsBtn) {
    resetProfileStatsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const active = ProfileManager.getActiveProfile();
      if (active && confirm(`Reset all stats and completed cards for ${active.name}?`)) {
        ProfileManager.resetProfileStats(active.id);
      }
    });
  }

  if (deleteProfileBtn) {
    deleteProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const active = ProfileManager.getActiveProfile();
      if (active && confirm(`Delete profile for ${active.name}? All progress will be removed.`)) {
        ProfileManager.deleteProfile(active.id);
      }
    });
  }

  if (exportProfilesBtn) {
    exportProfilesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ProfileManager.exportData();
    });
  }

  if (importProfilesBtn && importFileInput) {
    importProfilesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      importFileInput.click();
    });

    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        ProfileManager.importData(event.target.result);
        importFileInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Initialize
  ProfileManager.init();
  soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
  updateStatsUI();
  renderTopicBar();
  showNewMathProblem();
  showSlide(0);
  showScienceSlide(0);

})();
