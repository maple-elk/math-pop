// Math & Logic Studio — Preschool to 5th Grade Math, Logic & Science
(function() {
  'use strict';

  // Safe Storage wrapper to guard against private browsing restrictions & quota limits
  const SafeStorage = {
    _mem: {},
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return Object.prototype.hasOwnProperty.call(this._mem, key) ? this._mem[key] : null;
      }
    },
    setItem(key, val) {
      try {
        localStorage.setItem(key, String(val));
      } catch (e) {
        this._mem[key] = String(val);
      }
    },
    removeItem(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        delete this._mem[key];
      }
    }
  };

  // Global App State
  let activeTab = 'grade2'; // 'preschool' | 'kindergarten' | 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'riddles' | 'science'
  let streak = parseInt(SafeStorage.getItem('mathpop_streak') || '0', 10);
  let totalCompleted = parseInt(SafeStorage.getItem('mathpop_total') || '0', 10);
  let soundEnabled = SafeStorage.getItem('mathpop_sound') !== 'false';

  // Preschool State
  let activePreschoolTrack = 'patterns'; // 'patterns' | 'counting' | 'shapes' | 'sorting'
  const trackPreschoolIndices = {
    patterns: 0,
    counting: 0,
    shapes: 0,
    sorting: 0
  };
  let currentPreschoolSlide = null;
  let preschoolState = 'QUESTION'; // 'QUESTION' | 'SOLUTION' | 'COMPLETE'

  // Kindergarten State
  let activeKindergartenTrack = 'math'; // 'math' | 'questions' | 'riddles' | 'puzzles'
  const trackKindergartenIndices = {
    math: 0,
    questions: 0,
    riddles: 0,
    puzzles: 0
  };
  let currentKindergartenSlide = null;
  let kindergartenState = 'QUESTION'; // 'QUESTION' | 'SOLUTION' | 'COMPLETE'

  // Active sub-topic per math grade
  const gradeTopicState = {
    grade1: 'g1_add10',
    grade2: 'g2_add',
    grade3: 'g3_mult',
    grade4: 'g4_mult',
    grade5: 'g5_pemdas'
  };

  // Indices for finite curated math sets (g1_unusual .. g5_unusual)
  const trackMathSetIndices = {
    g1_unusual: 0,
    g2_unusual: 0,
    g3_unusual: 0,
    g4_unusual: 0,
    g5_unusual: 0
  };

  // Session deduplication for open-ended random math generators so questions do not repeat
  const seenMathProblemsByTopic = {};

  let currentMathProblem = null;
  let mathState = 'QUESTION'; // 'QUESTION' | 'SOLUTION' | 'COMPLETE'

  // Teaser & Riddle State
  let activeTeaserTrack = 'logic'; // 'logic' | 'visual' | 'mental'
  const trackSlideIndices = {
    logic: 0,
    visual: 0,
    mental: 0
  };
  let currentRiddle = null;
  let riddleState = 'QUESTION'; // 'QUESTION' | 'SOLUTION' | 'COMPLETE'

  // Completion tracking for all non-random finite problem sets
  // Maps setKey (e.g. 'preschool:patterns', 'riddles:logic', 'math:g1_unusual') -> Array of completed 0-based indices
  let completedSetMap = {};

  function getCompletedList(setKey) {
    if (!completedSetMap[setKey] || !Array.isArray(completedSetMap[setKey])) {
      completedSetMap[setKey] = [];
    }
    return completedSetMap[setKey];
  }

  function isSlideCompleted(setKey, index) {
    return getCompletedList(setKey).includes(index);
  }

  function markSlideCompleted(setKey, index) {
    const list = getCompletedList(setKey);
    if (!list.includes(index)) {
      list.push(index);
    }
  }

  function resetCompletedSet(setKey) {
    completedSetMap[setKey] = [];
    if (typeof ProfileManager !== 'undefined' && ProfileManager.saveSessionState) {
      ProfileManager.saveSessionState();
    }
  }

  // Finds the next uncompleted problem index without looping back to already-completed questions
  function findNextUncompletedIndex(setKey, totalLength, afterIndex) {
    const completed = getCompletedList(setKey);
    // First search strictly forward from afterIndex + 1 to end
    for (let i = afterIndex + 1; i < totalLength; i++) {
      if (!completed.includes(i)) return i;
    }
    // If any earlier problem was skipped and not yet completed, visit it once
    for (let i = 0; i <= afterIndex && i < totalLength; i++) {
      if (!completed.includes(i)) return i;
    }
    return -1; // All problems in this finite set have been completed!
  }

  function renderNumberedStepPills(containerEl, setKey, total, currentIdx, onSelectIdx) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const done = isSlideCompleted(setKey, i);
      const isCurrent = (i === currentIdx);
      btn.className = 'slide-step-btn' + (done ? ' completed' : '') + (isCurrent ? ' active' : '');
      btn.textContent = done ? `${i + 1}✓` : `${i + 1}`;
      btn.title = done ? `Problem ${i + 1} (Completed)` : `Problem ${i + 1}`;
      btn.addEventListener('click', () => {
        onSelectIdx(i);
      });
      containerEl.appendChild(btn);
    }
  }

  function formatSetCounterText(setKey, currentIdx, total) {
    const doneCount = getCompletedList(setKey).length;
    if (doneCount > 0) {
      return `Problem ${currentIdx + 1} of ${total} (${doneCount}/${total} completed)`;
    }
    return `Problem ${currentIdx + 1} of ${total}`;
  }

  // --- Common DOM Elements ---
  const streakCountEl = document.getElementById('streakCount');
  const streakPillEl = document.getElementById('streakPill');
  const totalCompletedEl = document.getElementById('totalCompleted');
  const soundToggleBtn = document.getElementById('soundToggle');
  const resetStatsBtn = document.getElementById('resetStatsBtn');
  const tabButtons = document.querySelectorAll('.app-tab');
  const preschoolSection = document.getElementById('preschoolSection');
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
  const modalPlayBtn = document.getElementById('modalPlayBtn');
  const playerNameRow = document.getElementById('playerNameRow');
  const profileSaveFeedback = document.getElementById('profileSaveFeedback');

  // Preschool DOM Elements
  const preschoolCardEl = document.getElementById('preschoolCard');
  const preschoolBadgeEl = document.getElementById('preschoolBadge');
  const preschoolQuestionEl = document.getElementById('preschoolQuestion');
  const preschoolViewportEl = document.getElementById('preschoolViewport');
  const preschoolInputZoneEl = document.getElementById('preschoolInputZone');
  const preschoolSolutionBoxEl = document.getElementById('preschoolSolutionBox');
  const preschoolAnswerTitleEl = document.getElementById('preschoolAnswerTitle');
  const preschoolExplanationEl = document.getElementById('preschoolExplanation');
  const preschoolActionBtn = document.getElementById('preschoolActionBtn');
  const preschoolActionText = document.getElementById('preschoolActionText');
  const preschoolAnswerInput = document.getElementById('preschoolAnswerInput');
  const preschoolInputFeedback = document.getElementById('preschoolInputFeedback');
  const preschoolTrackButtons = document.querySelectorAll('.preschool-track-btn');
  const prevPreschoolSlideBtn = document.getElementById('prevPreschoolSlideBtn');
  const nextPreschoolSlideBtn = document.getElementById('nextPreschoolSlideBtn');
  const preschoolSlideIndicator = document.getElementById('preschoolSlideIndicator');
  const preschoolSlideDots = document.getElementById('preschoolSlideDots');
  const preschoolSpeakBtn = document.getElementById('preschoolSpeakBtn');

  // Kindergarten DOM Elements
  const kindergartenCardEl = document.getElementById('kindergartenCard');
  const kindergartenBadgeEl = document.getElementById('kindergartenBadge');
  const kindergartenQuestionEl = document.getElementById('kindergartenQuestion');
  const kindergartenViewportEl = document.getElementById('kindergartenViewport');
  const kindergartenInputZoneEl = document.getElementById('kindergartenInputZone');
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
  const mathSetToolbar = document.getElementById('mathSetToolbar');
  const prevMathSlideBtn = document.getElementById('prevMathSlideBtn');
  const nextMathSlideBtn = document.getElementById('nextMathSlideBtn');
  const mathSlideIndicator = document.getElementById('mathSlideIndicator');
  const mathSlideDots = document.getElementById('mathSlideDots');
  const cardEl = document.getElementById('card');
  const cardBadgeEl = document.getElementById('cardBadge');
  const equationContainer = document.getElementById('equationContainer');
  const inputZoneEl = document.getElementById('inputZone');
  const actionBtn = document.getElementById('actionBtn');
  const actionText = document.getElementById('actionText');
  const answerInput = document.getElementById('answerInput');
  const inputFeedback = document.getElementById('inputFeedback');
  const visualizerEl = document.getElementById('visualizer');
  const stepExplanationEl = document.getElementById('stepExplanation');

  // Teaser DOM Elements & Slide Navigation Toolbar
  const riddleCardEl = document.getElementById('riddleCard');
  const riddleBadgeEl = document.getElementById('riddleBadge');
  const riddleQuestionEl = document.getElementById('riddleQuestion');
  const riddleViewportEl = document.getElementById('riddleViewport');
  const riddleInputZoneEl = document.getElementById('riddleInputZone');
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

  function setQuestionWithNumber(el, index, questionText) {
    if (!el) return;
    el.innerHTML = '';
    const numSpan = document.createElement('span');
    numSpan.className = 'problem-num-tag';
    numSpan.textContent = `#${index + 1}`;
    el.appendChild(numSpan);
    el.appendChild(document.createTextNode(questionText));
  }

  function renderSetCompleteViewport(title, totalCount, onNextSet, nextSetLabel, onResetSet) {
    const wrapper = document.createElement('div');
    wrapper.className = 'set-complete-panel';
    wrapper.innerHTML = `
      <span class="set-complete-badge">✓ Set Complete (${totalCount} of ${totalCount})</span>
      <div class="set-complete-title">All ${totalCount} problems in ${title} completed</div>
      <div class="set-complete-desc">You have worked through every numbered problem in this set without repeating any questions. You can review any problem using the numbered buttons above, move to the next set, or reset this set.</div>
      <div class="set-complete-actions">
        ${nextSetLabel ? `<button type="button" class="btn-set-action" id="btnNextSetAction">${nextSetLabel} →</button>` : ''}
        <button type="button" class="btn-set-action secondary" id="btnResetSetAction">Reset Set &amp; Start at #1</button>
      </div>
    `;
    setTimeout(() => {
      const nextBtn = wrapper.querySelector('#btnNextSetAction');
      if (nextBtn && onNextSet) {
        nextBtn.addEventListener('click', onNextSet);
      }
      const resetBtn = wrapper.querySelector('#btnResetSetAction');
      if (resetBtn && onResetSet) {
        resetBtn.addEventListener('click', onResetSet);
      }
    }, 0);
    return wrapper;
  }

  function renderTopicBar() {
    if (!GRADE_TOPICS[activeTab]) return;
    const topics = GRADE_TOPICS[activeTab] || [];
    const currentSelected = gradeTopicState[activeTab] || topics[0]?.id;

    topicBar.innerHTML = '';
    topics.forEach(t => {
      const btn = document.createElement('button');
      btn.className = `mode-btn ${t.id === currentSelected ? 'active' : ''}`;
      btn.setAttribute('data-topic', t.id);
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        topicBar.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gradeTopicState[activeTab] = t.id;
        showNewMathProblem();
        ProfileManager.saveSessionState();
      });
      topicBar.appendChild(btn);
    });
  }


  function buildFiniteMathProblem(topicId, index) {
    const deck = FINITE_MATH_SETS[topicId] || FINITE_MATH_SETS.g1_unusual;
    const clampedIdx = Math.max(0, Math.min(deck.length - 1, index));
    const item = deck[clampedIdx];
    const gradeLabel = getGradeLabel(activeTab);
    const numTag = `<span class="problem-num-tag">#${clampedIdx + 1}</span>`;
    const exprHtml = item.leftHtml || `<span class="num">${item.a}</span><span class="op">${item.op}</span><span class="num">${item.b}</span><span class="equals">=</span>`;
    return {
      isFiniteSet: true,
      setKey: `math:${topicId}`,
      topicId,
      slideIndex: clampedIdx,
      totalSlides: deck.length,
      badge: `${gradeLabel} • Number Sense • Problem ${clampedIdx + 1} of ${deck.length}`,
      leftHtml: `${numTag}${exprHtml}`,
      answerHtml: item.ans,
      answerRaw: item.raw || item.ans.replace(/,/g, ''),
      hasVisualDots: false,
      stepExplanation: item.exp
    };
  }

  function generateMathProblem() {
    const topic = gradeTopicState[activeTab] || (activeTab === 'grade1' ? 'g1_add10' : 'g2_add');
    if (isFiniteMathTopic(topic)) {
      const idx = trackMathSetIndices[topic] || 0;
      return buildFiniteMathProblem(topic, idx);
    }

    if (!seenMathProblemsByTopic[topic]) {
      seenMathProblemsByTopic[topic] = new Set();
    }
    const seen = seenMathProblemsByTopic[topic];
    let candidate = null;
    for (let attempt = 0; attempt < 45; attempt++) {
      candidate = generateRandomMathProblemOnce(topic);
      if (!seen.has(candidate.leftHtml)) {
        seen.add(candidate.leftHtml);
        return candidate;
      }
    }
    // If all combinations in a small topic (like Making 10) have been exhausted, reset seen history except the very last one
    const lastKey = currentMathProblem ? currentMathProblem.leftHtml : null;
    seen.clear();
    if (lastKey) seen.add(lastKey);
    for (let attempt = 0; attempt < 20; attempt++) {
      candidate = generateRandomMathProblemOnce(topic);
      if (candidate.leftHtml !== lastKey) {
        seen.add(candidate.leftHtml);
        return candidate;
      }
    }
    return candidate;
  }

  function updateMathSetToolbar(topicId) {
    if (!mathSetToolbar) return;
    if (!isFiniteMathTopic(topicId)) {
      mathSetToolbar.classList.add('hidden');
      return;
    }
    mathSetToolbar.classList.remove('hidden');
    const deck = FINITE_MATH_SETS[topicId] || [];
    const currentIdx = trackMathSetIndices[topicId] || 0;
    const setKey = `math:${topicId}`;
    mathSlideIndicator.textContent = formatSetCounterText(setKey, currentIdx, deck.length);
    renderNumberedStepPills(mathSlideDots, setKey, deck.length, currentIdx, (idx) => {
      trackMathSetIndices[topicId] = idx;
      showNewMathProblem(idx);
    });
    prevMathSlideBtn.disabled = (currentIdx <= 0);
    nextMathSlideBtn.disabled = (currentIdx >= deck.length - 1);
  }

  function showMathSetCompleteScreen(topicId) {
    const deck = FINITE_MATH_SETS[topicId] || [];
    const setKey = `math:${topicId}`;
    mathState = 'COMPLETE';
    updateMathSetToolbar(topicId);
    cardBadgeEl.textContent = `${getGradeLabel(activeTab)} • Number Sense • Set Complete (${deck.length} of ${deck.length})`;
    equationContainer.innerHTML = '';
    const panel = renderSetCompleteViewport(
      `${getGradeLabel(activeTab)} Number Sense Set`,
      deck.length,
      () => {
        const topics = GRADE_TOPICS[activeTab] || [];
        if (topics.length > 0) {
          gradeTopicState[activeTab] = topics[0].id;
          renderTopicBar();
          showNewMathProblem();
        }
      },
      'Back to Practice Topics',
      () => {
        resetCompletedSet(setKey);
        trackMathSetIndices[topicId] = 0;
        showNewMathProblem(0);
      }
    );
    equationContainer.appendChild(panel);
    if (inputZoneEl) inputZoneEl.classList.add('hidden');
    visualizerEl.style.display = 'none';
    stepExplanationEl.classList.add('hidden');
    actionBtn.classList.remove('next-mode');
    actionText.textContent = 'Reset Set & Start at #1';
  }

  function showNewMathProblem(explicitFiniteIndex) {
    const topic = gradeTopicState[activeTab] || (activeTab === 'grade1' ? 'g1_add10' : 'g2_add');
    if (isFiniteMathTopic(topic)) {
      const deck = FINITE_MATH_SETS[topic] || [];
      const setKey = `math:${topic}`;
      if (typeof explicitFiniteIndex === 'number') {
        trackMathSetIndices[topic] = Math.max(0, Math.min(deck.length - 1, explicitFiniteIndex));
      } else {
        const cur = trackMathSetIndices[topic] || 0;
        if (isSlideCompleted(setKey, cur)) {
          const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, cur);
          if (nextUncompleted === -1) {
            showMathSetCompleteScreen(topic);
            return;
          }
          trackMathSetIndices[topic] = nextUncompleted;
        }
      }
    }

    if (inputZoneEl) inputZoneEl.classList.remove('hidden');
    mathState = 'QUESTION';
    currentMathProblem = generateMathProblem();
    updateMathSetToolbar(topic);

    cardEl.style.animation = 'none';
    void cardEl.offsetWidth;
    cardEl.style.animation = 'popIn 0.18s ease-out';
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
      visualizerEl.innerHTML = `
        <div class="dots-group" id="dotsA"></div>
        <div class="visualizer-op" id="visualizerOp">${currentMathProblem.dotsOp}</div>
        <div class="dots-group" id="dotsB"></div>
      `;
      const curDotsA = document.getElementById('dotsA');
      const curDotsB = document.getElementById('dotsB');

      for (let i = 0; i < currentMathProblem.dotsA; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot dot-blue';
        curDotsA.appendChild(dot);
      }
      for (let i = 0; i < currentMathProblem.dotsB; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot dot-orange';
        curDotsB.appendChild(dot);
      }
    } else if (currentMathProblem.customVisualHtml) {
      visualizerEl.style.display = 'flex';
      visualizerEl.innerHTML = currentMathProblem.customVisualHtml;
    } else {
      visualizerEl.style.display = 'none';
    }

    actionBtn.classList.remove('next-mode');
    actionText.textContent = 'Reveal Answer';

    if (typeof AppRouter !== 'undefined' && AppRouter.syncUrl) {
      AppRouter.syncUrl();
    }
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

      let isMatch = (typedVal === rawAns || cleanTyped === cleanRaw);

      // Check answersAccepted array if defined on problem
      if (!isMatch && Array.isArray(currentMathProblem.answersAccepted)) {
        isMatch = currentMathProblem.answersAccepted.some((accepted) => {
          const a = String(accepted).toLowerCase().trim().replace(/,/g, '');
          return cleanTyped === a || typedVal === a;
        });
      }

      // 1. Prime vs. Composite equivalence (yes/no, prime/composite, y/n)
      if (!isMatch) {
        if (cleanRaw === 'yes' && ['yes', 'y', 'prime'].includes(cleanTyped)) {
          isMatch = true;
        } else if (cleanRaw === 'no' && ['no', 'n', 'composite', 'not prime'].includes(cleanTyped)) {
          isMatch = true;
        }
      }

      // 2. Fraction equivalence (e.g. integer "1" vs single-denominator "1/1")
      if (!isMatch) {
        const normFrac = (s) => (s.endsWith('/1') ? s.slice(0, -2) : s);
        if (normFrac(cleanTyped) === normFrac(cleanRaw)) {
          isMatch = true;
        }
      }

      // 3. Division with remainders flexible spacing (e.g. "5r2" matches "5 R 2")
      const isRemProblem = /[rR]|remainder/i.test(cleanRaw);
      if (!isMatch && isRemProblem) {
        const normRem = (s) => s.replace(/\s+/g, '').replace(/remainder/gi, 'r');
        if (normRem(cleanTyped) === normRem(cleanRaw)) {
          isMatch = true;
        }
      }

      // 4. Decimal and whole number equivalence (e.g. student typing "3" matches "3.0")
      if (!isMatch && !cleanTyped.includes('/') && !cleanRaw.includes('/') && !isRemProblem && !/[rR]|remainder/i.test(cleanTyped)) {
        const numTyped = Number(cleanTyped);
        const numRaw = Number(cleanRaw);
        if (!isNaN(numTyped) && !isNaN(numRaw) && Math.abs(numTyped - numRaw) < 1e-6) {
          isMatch = true;
        }
      }

      if (isMatch) {
        isCorrectTyped = true;
        inputFeedback.textContent = '✓ Correct!';
        inputFeedback.className = 'input-feedback correct';
      } else {
        isCorrectTyped = false;
        inputFeedback.textContent = `Not quite — the answer is ${currentMathProblem.answerRaw}.`;
        inputFeedback.className = 'input-feedback incorrect';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }

    if (currentMathProblem.isFiniteSet) {
      markSlideCompleted(currentMathProblem.setKey, currentMathProblem.slideIndex);
      updateMathSetToolbar(currentMathProblem.topicId);
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
    if (currentMathProblem.isFiniteSet) {
      const nextIdx = findNextUncompletedIndex(currentMathProblem.setKey, currentMathProblem.totalSlides, currentMathProblem.slideIndex);
      if (nextIdx === -1) {
        actionText.textContent = `Finish Set (${currentMathProblem.totalSlides}/${currentMathProblem.totalSlides}) ✓`;
      } else {
        actionText.textContent = `Next Problem (#${nextIdx + 1}) →`;
      }
    } else {
      actionText.textContent = 'Next Problem →';
    }
  }

  function handleMathAdvance() {
    actionBtn.classList.add('pressed');
    setTimeout(() => actionBtn.classList.remove('pressed'), 120);

    const topic = gradeTopicState[activeTab];
    if (mathState === 'QUESTION') {
      revealMathSolution();
    } else if (mathState === 'SOLUTION') {
      if (currentMathProblem && currentMathProblem.isFiniteSet) {
        const nextIdx = findNextUncompletedIndex(currentMathProblem.setKey, currentMathProblem.totalSlides, currentMathProblem.slideIndex);
        if (nextIdx === -1) {
          showMathSetCompleteScreen(currentMathProblem.topicId);
        } else {
          trackMathSetIndices[currentMathProblem.topicId] = nextIdx;
          showNewMathProblem(nextIdx);
        }
      } else {
        showNewMathProblem();
      }
    } else if (mathState === 'COMPLETE' && isFiniteMathTopic(topic)) {
      resetCompletedSet(`math:${topic}`);
      trackMathSetIndices[topic] = 0;
      showNewMathProblem(0);
    }
  }

  // SEQUENTIAL NUMBERED LOGIC / SPATIAL CONTROLLER
  // ========================================================
  function getActiveDeck() {
    if (activeTeaserTrack === 'logic') return LOGIC_SLIDES;
    if (activeTeaserTrack === 'visual') return VISUAL_SLIDES;
    if (activeTeaserTrack === 'mental') return MENTAL_3D_SLIDES;
    return LOGIC_SLIDES;
  }

  function getTrackName() {
    if (activeTeaserTrack === 'logic') return 'Logic Problems';
    if (activeTeaserTrack === 'visual') return 'Visual & Spatial';
    if (activeTeaserTrack === 'mental') return '3D Geometry';
    return 'Logic & Spatial';
  }

  function updateSlideToolbar() {
    const deck = getActiveDeck();
    const currentIdx = trackSlideIndices[activeTeaserTrack] || 0;
    const total = deck.length;
    const setKey = `riddles:${activeTeaserTrack}`;

    slideIndicator.textContent = formatSetCounterText(setKey, currentIdx, total);
    renderNumberedStepPills(slideDots, setKey, total, currentIdx, (i) => showSlide(i));

    prevSlideBtn.disabled = (currentIdx <= 0);
    nextSlideBtn.disabled = (currentIdx >= total - 1);
  }

  function showRiddleSetComplete() {
    const deck = getActiveDeck();
    const setKey = `riddles:${activeTeaserTrack}`;
    riddleState = 'COMPLETE';
    updateSlideToolbar();

    const nextTrackOrder = { logic: 'visual', visual: 'mental', mental: 'logic' };
    const nextTrackNames = { logic: 'Visual & Spatial', visual: '3D Geometry', mental: 'Logic Problems' };
    const nextTrack = nextTrackOrder[activeTeaserTrack];

    riddleBadgeEl.textContent = `${getTrackName()} • Set Complete (${deck.length} of ${deck.length})`;
    riddleQuestionEl.textContent = `${getTrackName()} — Complete`;
    riddleViewportEl.innerHTML = '';
    riddleViewportEl.appendChild(renderSetCompleteViewport(
      getTrackName(),
      deck.length,
      () => {
        activeTeaserTrack = nextTrack;
        teaserTrackButtons.forEach(b => b.classList.toggle('active', b.dataset.track === activeTeaserTrack));
        const targetSetKey = `riddles:${activeTeaserTrack}`;
        const nextDeck = getActiveDeck();
        const firstUncompleted = findNextUncompletedIndex(targetSetKey, nextDeck.length, -1);
        showSlide(firstUncompleted === -1 ? 0 : firstUncompleted);
        ProfileManager.saveSessionState();
      },
      `Switch to ${nextTrackNames[activeTeaserTrack]}`,
      () => {
        resetCompletedSet(setKey);
        showSlide(0);
      }
    ));
    if (riddleInputZoneEl) riddleInputZoneEl.classList.add('hidden');
    riddleSolutionBoxEl.classList.add('hidden');
    riddleActionBtn.classList.remove('next-mode');
    riddleActionText.textContent = 'Reset Set & Start at #1';
  }

  function showSlide(index) {
    const deck = getActiveDeck();
    if (index < 0) index = 0;
    if (index >= deck.length) index = deck.length - 1;
    trackSlideIndices[activeTeaserTrack] = index;

    if (riddleInputZoneEl) riddleInputZoneEl.classList.remove('hidden');
    currentRiddle = deck[index];
    riddleState = 'QUESTION';

    riddleCardEl.style.animation = 'none';
    void riddleCardEl.offsetWidth;
    riddleCardEl.style.animation = 'popIn 0.18s ease-out';
    playPopSound();

    riddleBadgeEl.textContent = `${getTrackName()} • Problem ${index + 1} of ${deck.length}`;
    setQuestionWithNumber(riddleQuestionEl, index, currentRiddle.question);

    riddleViewportEl.innerHTML = currentRiddle.render(false);
    riddleSolutionBoxEl.classList.add('hidden');

    riddleAnswerInput.value = '';
    riddleInputFeedback.textContent = '';
    riddleInputFeedback.className = 'input-feedback';

    riddleActionBtn.classList.remove('next-mode');
    riddleActionText.textContent = 'Reveal Answer';

    updateSlideToolbar();

    if (typeof AppRouter !== 'undefined' && AppRouter.syncUrl) {
      AppRouter.syncUrl();
    }
  }

  function nextSlide() {
    const deck = getActiveDeck();
    const currentIdx = trackSlideIndices[activeTeaserTrack] || 0;
    if (currentIdx < deck.length - 1) {
      showSlide(currentIdx + 1);
    }
  }

  function prevSlide() {
    const currentIdx = trackSlideIndices[activeTeaserTrack] || 0;
    if (currentIdx > 0) {
      showSlide(currentIdx - 1);
    }
  }

  function revealRiddleSolution() {
    riddleState = 'SOLUTION';
    const currentIdx = trackSlideIndices[activeTeaserTrack] || 0;
    const deck = getActiveDeck();
    const setKey = `riddles:${activeTeaserTrack}`;

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
        riddleInputFeedback.textContent = '✓ Correct!';
        riddleInputFeedback.className = 'input-feedback correct';
      } else {
        riddleInputFeedback.textContent = `Not quite — the answer is ${currentRiddle.answerRaw}.`;
        riddleInputFeedback.className = 'input-feedback incorrect';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }

    markSlideCompleted(setKey, currentIdx);
    updateSlideToolbar();

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
    const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, currentIdx);
    if (nextUncompleted === -1) {
      riddleActionText.textContent = `Finish Set (${deck.length}/${deck.length}) ✓`;
    } else {
      riddleActionText.textContent = `Next Problem (#${nextUncompleted + 1}) →`;
    }
  }

  function handleRiddleAdvance() {
    riddleActionBtn.classList.add('pressed');
    setTimeout(() => riddleActionBtn.classList.remove('pressed'), 120);

    const deck = getActiveDeck();
    const currentIdx = trackSlideIndices[activeTeaserTrack] || 0;
    const setKey = `riddles:${activeTeaserTrack}`;

    if (riddleState === 'QUESTION') {
      revealRiddleSolution();
    } else if (riddleState === 'SOLUTION') {
      const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, currentIdx);
      if (nextUncompleted === -1) {
        showRiddleSetComplete();
      } else {
        showSlide(nextUncompleted);
      }
    } else if (riddleState === 'COMPLETE') {
      resetCompletedSet(setKey);
      showSlide(0);
    }
  }

  // ========================================================
  // SCIENCE LAB (PHYSICS, ENGINEERING & CHEMISTRY)
  // ========================================================
  let activeScienceTrack = 'space'; // 'space' | 'air' | 'density' | 'chemistry'
  const trackScienceIndices = {
    space: 0,
    air: 0,
    density: 0,
    chemistry: 0
  };
  let currentScienceSlide = null;
  let scienceState = 'QUESTION'; // 'QUESTION' | 'SOLUTION' | 'COMPLETE'

  // Science DOM Elements
  const scienceSection = document.getElementById('scienceSection');
  const scienceCardEl = document.getElementById('scienceCard');
  const scienceBadgeEl = document.getElementById('scienceBadge');
  const scienceQuestionEl = document.getElementById('scienceQuestion');
  const scienceViewportEl = document.getElementById('scienceViewport');
  const scienceInputZoneEl = document.getElementById('scienceInputZone');
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

  // SCIENCE LAB NAVIGATION & CONTROLLER (NUMBERED, NO LOOPBACK)
  // ========================================================
  function getActiveScienceDeck() {
    return SCIENCE_SLIDES[activeScienceTrack] || SCIENCE_SLIDES.space;
  }

  function getScienceTrackName() {
    switch (activeScienceTrack) {
      case 'space': return 'Space & Gravity';
      case 'air': return 'Air & Friction';
      case 'density': return 'Density & Fluids';
      case 'chemistry': return 'Chemistry & Mechanics';
      default: return 'Science Lab';
    }
  }

  function updateScienceSlideToolbar() {
    const deck = getActiveScienceDeck();
    const currentIdx = trackScienceIndices[activeScienceTrack] || 0;
    const total = deck.length;
    const setKey = `science:${activeScienceTrack}`;

    scienceSlideIndicator.textContent = formatSetCounterText(setKey, currentIdx, total);
    renderNumberedStepPills(scienceSlideDots, setKey, total, currentIdx, (i) => showScienceSlide(i));

    prevScienceSlideBtn.disabled = (currentIdx <= 0);
    nextScienceSlideBtn.disabled = (currentIdx >= total - 1);
  }

  function showScienceSetComplete() {
    const deck = getActiveScienceDeck();
    const setKey = `science:${activeScienceTrack}`;
    scienceState = 'COMPLETE';
    updateScienceSlideToolbar();

    const nextTrackOrder = { space: 'air', air: 'density', density: 'chemistry', chemistry: 'space' };
    const nextTrackNames = { space: 'Air & Friction', air: 'Density & Fluids', density: 'Chemistry & Mechanics', chemistry: 'Space & Gravity' };
    const nextTrack = nextTrackOrder[activeScienceTrack];

    scienceBadgeEl.textContent = `Science Lab • ${getScienceTrackName()} • Set Complete (${deck.length} of ${deck.length})`;
    scienceQuestionEl.textContent = `${getScienceTrackName()} — Complete`;
    scienceViewportEl.innerHTML = '';
    scienceViewportEl.appendChild(renderSetCompleteViewport(
      getScienceTrackName(),
      deck.length,
      () => {
        activeScienceTrack = nextTrack;
        scienceTrackButtons.forEach(b => b.classList.toggle('active', b.dataset.track === activeScienceTrack));
        const targetSetKey = `science:${activeScienceTrack}`;
        const nextDeck = getActiveScienceDeck();
        const firstUncompleted = findNextUncompletedIndex(targetSetKey, nextDeck.length, -1);
        showScienceSlide(firstUncompleted === -1 ? 0 : firstUncompleted);
        ProfileManager.saveSessionState();
      },
      `Switch to ${nextTrackNames[activeScienceTrack]}`,
      () => {
        resetCompletedSet(setKey);
        showScienceSlide(0);
      }
    ));
    if (scienceInputZoneEl) scienceInputZoneEl.classList.add('hidden');
    scienceSolutionBoxEl.classList.add('hidden');
    scienceActionBtn.classList.remove('next-mode');
    scienceActionText.textContent = 'Reset Set & Start at #1';
  }

  function showScienceSlide(index) {
    const deck = getActiveScienceDeck();
    if (index < 0) index = 0;
    if (index >= deck.length) index = deck.length - 1;
    trackScienceIndices[activeScienceTrack] = index;

    if (scienceInputZoneEl) scienceInputZoneEl.classList.remove('hidden');
    currentScienceSlide = deck[index];
    scienceState = 'QUESTION';

    scienceCardEl.style.animation = 'none';
    void scienceCardEl.offsetWidth;
    scienceCardEl.style.animation = 'popIn 0.18s ease-out';
    playPopSound();

    scienceBadgeEl.textContent = `Science Lab • ${getScienceTrackName()} • Problem ${index + 1} of ${deck.length}`;
    setQuestionWithNumber(scienceQuestionEl, index, currentScienceSlide.question);

    scienceViewportEl.innerHTML = currentScienceSlide.render(false);
    scienceSolutionBoxEl.classList.add('hidden');

    scienceAnswerInput.value = '';
    scienceInputFeedback.textContent = '';
    scienceInputFeedback.className = 'input-feedback';

    scienceActionBtn.classList.remove('next-mode');
    scienceActionText.textContent = 'Reveal Answer';

    updateScienceSlideToolbar();

    if (typeof AppRouter !== 'undefined' && AppRouter.syncUrl) {
      AppRouter.syncUrl();
    }
  }

  function nextScienceSlide() {
    const deck = getActiveScienceDeck();
    const currentIdx = trackScienceIndices[activeScienceTrack] || 0;
    if (currentIdx < deck.length - 1) {
      showScienceSlide(currentIdx + 1);
    }
  }

  function prevScienceSlide() {
    const currentIdx = trackScienceIndices[activeScienceTrack] || 0;
    if (currentIdx > 0) {
      showScienceSlide(currentIdx - 1);
    }
  }

  function revealScienceSolution() {
    scienceState = 'SOLUTION';
    const currentIdx = trackScienceIndices[activeScienceTrack] || 0;
    const deck = getActiveScienceDeck();
    const setKey = `science:${activeScienceTrack}`;

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
        scienceInputFeedback.textContent = '✓ Correct!';
        scienceInputFeedback.className = 'input-feedback correct';
      } else {
        scienceInputFeedback.textContent = 'See the explanation below:';
        scienceInputFeedback.className = 'input-feedback';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }

    markSlideCompleted(setKey, currentIdx);
    updateScienceSlideToolbar();

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
    const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, currentIdx);
    if (nextUncompleted === -1) {
      scienceActionText.textContent = `Finish Set (${deck.length}/${deck.length}) ✓`;
    } else {
      scienceActionText.textContent = `Next Problem (#${nextUncompleted + 1}) →`;
    }
  }

  function handleScienceAdvance() {
    scienceActionBtn.classList.add('pressed');
    setTimeout(() => scienceActionBtn.classList.remove('pressed'), 120);

    const deck = getActiveScienceDeck();
    const currentIdx = trackScienceIndices[activeScienceTrack] || 0;
    const setKey = `science:${activeScienceTrack}`;

    if (scienceState === 'QUESTION') {
      revealScienceSolution();
    } else if (scienceState === 'SOLUTION') {
      const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, currentIdx);
      if (nextUncompleted === -1) {
        showScienceSetComplete();
      } else {
        showScienceSlide(nextUncompleted);
      }
    } else if (scienceState === 'COMPLETE') {
      resetCompletedSet(setKey);
      showScienceSlide(0);
    }
  }


  function getActivePreschoolDeck() {
    return PRESCHOOL_SLIDES[activePreschoolTrack] || PRESCHOOL_SLIDES.patterns;
  }

  function getPreschoolTrackName() {
    const names = {
      patterns: 'Patterns',
      counting: 'Counting 1–5',
      shapes: 'Shapes & Sizes',
      sorting: 'Sorting & Matching'
    };
    return names[activePreschoolTrack] || 'Preschool';
  }

  function updatePreschoolSlideToolbar() {
    const deck = getActivePreschoolDeck();
    const total = deck.length;
    const currentIdx = trackPreschoolIndices[activePreschoolTrack] || 0;
    const setKey = `preschool:${activePreschoolTrack}`;

    preschoolSlideIndicator.textContent = formatSetCounterText(setKey, currentIdx, total);
    prevPreschoolSlideBtn.disabled = currentIdx <= 0;
    nextPreschoolSlideBtn.disabled = currentIdx >= total - 1;

    renderNumberedStepPills(
      preschoolSlideDots,
      setKey,
      total,
      currentIdx,
      (idx) => {
        showPreschoolSlide(idx);
        ProfileManager.saveSessionState();
      }
    );
  }

  function showPreschoolSetComplete() {
    const deck = getActivePreschoolDeck();
    const setKey = `preschool:${activePreschoolTrack}`;
    preschoolState = 'COMPLETE';
    updatePreschoolSlideToolbar();
    preschoolBadgeEl.textContent = `Preschool • ${getPreschoolTrackName()} • Set Complete (${deck.length} of ${deck.length})`;
    preschoolQuestionEl.textContent = `${getPreschoolTrackName()} — Complete`;

    const nextTrackOrder = { patterns: 'counting', counting: 'shapes', shapes: 'sorting', sorting: 'patterns' };
    const nextTrackNames = {
      patterns: 'Counting 1–5 (12)',
      counting: 'Shapes & Sizes (12)',
      shapes: 'Sorting & Matching (12)',
      sorting: 'Patterns (12)'
    };

    preschoolViewportEl.innerHTML = '';
    preschoolViewportEl.appendChild(renderSetCompleteViewport(
      getPreschoolTrackName(),
      deck.length,
      () => {
        const nextTrack = nextTrackOrder[activePreschoolTrack] || 'patterns';
        activePreschoolTrack = nextTrack;
        preschoolTrackButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-track') === nextTrack));
        const nextDeck = getActivePreschoolDeck();
        const nextSetKey = `preschool:${nextTrack}`;
        const startIdx = findNextUncompletedIndex(nextSetKey, nextDeck.length, -1);
        showPreschoolSlide(startIdx === -1 ? 0 : startIdx);
        ProfileManager.saveSessionState();
      },
      `Switch to ${nextTrackNames[activePreschoolTrack]}`,
      () => {
        resetCompletedSet(setKey);
        showPreschoolSlide(0);
      }
    ));
    if (preschoolInputZoneEl) preschoolInputZoneEl.classList.add('hidden');
    preschoolSolutionBoxEl.classList.add('hidden');
    preschoolActionBtn.classList.remove('next-mode');
    preschoolActionText.textContent = 'Reset Set & Start at #1';
  }

  function showPreschoolSlide(index) {
    const deck = getActivePreschoolDeck();
    if (index < 0) index = 0;
    if (index >= deck.length) index = deck.length - 1;
    trackPreschoolIndices[activePreschoolTrack] = index;

    if (preschoolInputZoneEl) preschoolInputZoneEl.classList.remove('hidden');
    currentPreschoolSlide = deck[index];
    preschoolState = 'QUESTION';

    preschoolCardEl.style.animation = 'none';
    void preschoolCardEl.offsetWidth;
    preschoolCardEl.style.animation = 'popIn 0.18s ease-out';
    playPopSound();

    preschoolBadgeEl.textContent = `Preschool • ${getPreschoolTrackName()} • Problem ${index + 1} of ${deck.length}`;
    setQuestionWithNumber(preschoolQuestionEl, index, currentPreschoolSlide.question);

    preschoolViewportEl.innerHTML = currentPreschoolSlide.render(false);
    preschoolSolutionBoxEl.classList.add('hidden');

    preschoolAnswerInput.value = '';
    preschoolInputFeedback.textContent = '';
    preschoolInputFeedback.className = 'input-feedback';

    preschoolActionBtn.classList.remove('next-mode');
    preschoolActionText.textContent = 'Reveal Answer';

    updatePreschoolSlideToolbar();

    if (typeof AppRouter !== 'undefined' && AppRouter.syncUrl) {
      AppRouter.syncUrl();
    }
  }

  function nextPreschoolSlide() {
    const deck = getActivePreschoolDeck();
    const currentIdx = trackPreschoolIndices[activePreschoolTrack] || 0;
    if (currentIdx < deck.length - 1) {
      showPreschoolSlide(currentIdx + 1);
    }
  }

  function prevPreschoolSlide() {
    const currentIdx = trackPreschoolIndices[activePreschoolTrack] || 0;
    if (currentIdx > 0) {
      showPreschoolSlide(currentIdx - 1);
    }
  }

  function revealPreschoolSolution() {
    preschoolState = 'SOLUTION';
    const currentIdx = trackPreschoolIndices[activePreschoolTrack] || 0;
    const deck = getActivePreschoolDeck();
    const setKey = `preschool:${activePreschoolTrack}`;

    preschoolViewportEl.innerHTML = currentPreschoolSlide.render(true);
    preschoolAnswerTitleEl.textContent = currentPreschoolSlide.answerTitle;
    preschoolExplanationEl.textContent = currentPreschoolSlide.explanation;
    preschoolSolutionBoxEl.classList.remove('hidden');

    const typedVal = preschoolAnswerInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
    let isCorrectTyped = null;
    if (typedVal !== '') {
      if (currentPreschoolSlide.answersAccepted) {
        isCorrectTyped = currentPreschoolSlide.answersAccepted.some(ans => typedVal === ans.toLowerCase().trim() || typedVal.includes(ans.toLowerCase().trim()));
      } else if (currentPreschoolSlide.answerRaw) {
        isCorrectTyped = typedVal.includes(currentPreschoolSlide.answerRaw.toLowerCase().trim());
      }

      if (isCorrectTyped) {
        preschoolInputFeedback.textContent = '✓ Correct!';
        preschoolInputFeedback.className = 'input-feedback correct';
      } else {
        preschoolInputFeedback.textContent = `Answer: ${currentPreschoolSlide.answerRaw}`;
        preschoolInputFeedback.className = 'input-feedback';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }

    markSlideCompleted(setKey, currentIdx);
    updatePreschoolSlideToolbar();

    ProfileManager.recordCompletion('preschool', streak);
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

    preschoolActionBtn.classList.add('next-mode');
    const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, currentIdx);
    if (nextUncompleted === -1) {
      preschoolActionText.textContent = `Finish Set (${deck.length}/${deck.length}) ✓`;
    } else {
      preschoolActionText.textContent = `Next Problem (#${nextUncompleted + 1}) →`;
    }
  }

  function handlePreschoolAdvance() {
    preschoolActionBtn.classList.add('pressed');
    setTimeout(() => preschoolActionBtn.classList.remove('pressed'), 120);

    const deck = getActivePreschoolDeck();
    const currentIdx = trackPreschoolIndices[activePreschoolTrack] || 0;
    const setKey = `preschool:${activePreschoolTrack}`;

    if (preschoolState === 'QUESTION') {
      revealPreschoolSolution();
    } else if (preschoolState === 'SOLUTION') {
      const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, currentIdx);
      if (nextUncompleted === -1) {
        showPreschoolSetComplete();
      } else {
        showPreschoolSlide(nextUncompleted);
      }
    } else if (preschoolState === 'COMPLETE') {
      resetCompletedSet(setKey);
      showPreschoolSlide(0);
    }
  }

  function getActiveKindergartenDeck() {
    return KINDERGARTEN_SLIDES[activeKindergartenTrack] || KINDERGARTEN_SLIDES.math;
  }

  function getKindergartenTrackName() {
    const names = {
      math: 'Counting & Number Bonds',
      questions: 'Everyday Questions',
      riddles: 'Word & Sound Riddles',
      puzzles: 'Patterns & Shapes'
    };
    return names[activeKindergartenTrack] || 'Kindergarten';
  }

  function updateKindergartenSlideToolbar() {
    const deck = getActiveKindergartenDeck();
    const total = deck.length;
    const currentIdx = trackKindergartenIndices[activeKindergartenTrack] || 0;
    const setKey = `kindergarten:${activeKindergartenTrack}`;

    kindergartenSlideIndicator.textContent = formatSetCounterText(setKey, currentIdx, total);
    prevKindergartenSlideBtn.disabled = currentIdx <= 0;
    nextKindergartenSlideBtn.disabled = currentIdx >= total - 1;

    renderNumberedStepPills(
      kindergartenSlideDots,
      setKey,
      total,
      currentIdx,
      (idx) => {
        showKindergartenSlide(idx);
        ProfileManager.saveSessionState();
      }
    );
  }

  function showKindergartenSetComplete() {
    const deck = getActiveKindergartenDeck();
    const setKey = `kindergarten:${activeKindergartenTrack}`;
    kindergartenState = 'COMPLETE';
    updateKindergartenSlideToolbar();
    kindergartenBadgeEl.textContent = `Kindergarten • ${getKindergartenTrackName()} • Set Complete (${deck.length} of ${deck.length})`;
    kindergartenQuestionEl.textContent = `${getKindergartenTrackName()} — Complete`;

    const nextTrackOrder = { math: 'questions', questions: 'riddles', riddles: 'puzzles', puzzles: 'math' };
    const nextTrackNames = {
      math: 'Everyday Questions (12)',
      questions: 'Word & Sound Riddles (12)',
      riddles: 'Patterns & Shapes (12)',
      puzzles: 'Counting & Number Bonds (12)'
    };

    kindergartenViewportEl.innerHTML = '';
    kindergartenViewportEl.appendChild(renderSetCompleteViewport(
      getKindergartenTrackName(),
      deck.length,
      () => {
        const nextTrack = nextTrackOrder[activeKindergartenTrack] || 'math';
        activeKindergartenTrack = nextTrack;
        kindergartenTrackButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-track') === nextTrack));
        const nextDeck = getActiveKindergartenDeck();
        const nextSetKey = `kindergarten:${nextTrack}`;
        const startIdx = findNextUncompletedIndex(nextSetKey, nextDeck.length, -1);
        showKindergartenSlide(startIdx === -1 ? 0 : startIdx);
        ProfileManager.saveSessionState();
      },
      `Switch to ${nextTrackNames[activeKindergartenTrack]}`,
      () => {
        resetCompletedSet(setKey);
        showKindergartenSlide(0);
      }
    ));
    if (kindergartenInputZoneEl) kindergartenInputZoneEl.classList.add('hidden');
    kindergartenSolutionBoxEl.classList.add('hidden');
    kindergartenActionBtn.classList.remove('next-mode');
    kindergartenActionText.textContent = 'Reset Set & Start at #1';
  }

  function showKindergartenSlide(index) {
    const deck = getActiveKindergartenDeck();
    if (index < 0) index = 0;
    if (index >= deck.length) index = deck.length - 1;
    trackKindergartenIndices[activeKindergartenTrack] = index;

    if (kindergartenInputZoneEl) kindergartenInputZoneEl.classList.remove('hidden');
    currentKindergartenSlide = deck[index];
    kindergartenState = 'QUESTION';

    kindergartenCardEl.style.animation = 'none';
    void kindergartenCardEl.offsetWidth;
    kindergartenCardEl.style.animation = 'popIn 0.18s ease-out';
    playPopSound();

    kindergartenBadgeEl.textContent = `Kindergarten • ${getKindergartenTrackName()} • Problem ${index + 1} of ${deck.length}`;
    setQuestionWithNumber(kindergartenQuestionEl, index, currentKindergartenSlide.question);

    kindergartenViewportEl.innerHTML = currentKindergartenSlide.render(false);
    kindergartenSolutionBoxEl.classList.add('hidden');

    kindergartenAnswerInput.value = '';
    kindergartenInputFeedback.textContent = '';
    kindergartenInputFeedback.className = 'input-feedback';

    kindergartenActionBtn.classList.remove('next-mode');
    kindergartenActionText.textContent = 'Reveal Answer';

    updateKindergartenSlideToolbar();

    if (typeof AppRouter !== 'undefined' && AppRouter.syncUrl) {
      AppRouter.syncUrl();
    }
  }

  function nextKindergartenSlide() {
    const deck = getActiveKindergartenDeck();
    const currentIdx = trackKindergartenIndices[activeKindergartenTrack] || 0;
    if (currentIdx < deck.length - 1) {
      showKindergartenSlide(currentIdx + 1);
    }
  }

  function prevKindergartenSlide() {
    const currentIdx = trackKindergartenIndices[activeKindergartenTrack] || 0;
    if (currentIdx > 0) {
      showKindergartenSlide(currentIdx - 1);
    }
  }

  function revealKindergartenSolution() {
    kindergartenState = 'SOLUTION';
    const currentIdx = trackKindergartenIndices[activeKindergartenTrack] || 0;
    const deck = getActiveKindergartenDeck();
    const setKey = `kindergarten:${activeKindergartenTrack}`;

    kindergartenViewportEl.innerHTML = currentKindergartenSlide.render(true);
    kindergartenAnswerTitleEl.textContent = currentKindergartenSlide.answerTitle;
    kindergartenExplanationEl.textContent = currentKindergartenSlide.explanation;
    kindergartenSolutionBoxEl.classList.remove('hidden');

    const typedVal = kindergartenAnswerInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
    let isCorrectTyped = null;
    if (typedVal !== '') {
      if (currentKindergartenSlide.answersAccepted) {
        isCorrectTyped = currentKindergartenSlide.answersAccepted.some(ans => typedVal === ans.toLowerCase().trim() || typedVal.includes(ans.toLowerCase().trim()));
      } else if (currentKindergartenSlide.answerRaw) {
        isCorrectTyped = typedVal.includes(currentKindergartenSlide.answerRaw.toLowerCase().trim());
      }

      if (isCorrectTyped) {
        kindergartenInputFeedback.textContent = '✓ Correct!';
        kindergartenInputFeedback.className = 'input-feedback correct';
      } else {
        kindergartenInputFeedback.textContent = `Answer: ${currentKindergartenSlide.answerRaw}`;
        kindergartenInputFeedback.className = 'input-feedback';
      }
    }

    if (isCorrectTyped === false) {
      streak = 0;
    } else {
      streak += 1;
    }

    markSlideCompleted(setKey, currentIdx);
    updateKindergartenSlideToolbar();

    ProfileManager.recordCompletion('kindergarten', streak);
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
    const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, currentIdx);
    if (nextUncompleted === -1) {
      kindergartenActionText.textContent = `Finish Set (${deck.length}/${deck.length}) ✓`;
    } else {
      kindergartenActionText.textContent = `Next Problem (#${nextUncompleted + 1}) →`;
    }
  }

  function handleKindergartenAdvance() {
    kindergartenActionBtn.classList.add('pressed');
    setTimeout(() => kindergartenActionBtn.classList.remove('pressed'), 120);

    const deck = getActiveKindergartenDeck();
    const currentIdx = trackKindergartenIndices[activeKindergartenTrack] || 0;
    const setKey = `kindergarten:${activeKindergartenTrack}`;

    if (kindergartenState === 'QUESTION') {
      revealKindergartenSolution();
    } else if (kindergartenState === 'SOLUTION') {
      const nextUncompleted = findNextUncompletedIndex(setKey, deck.length, currentIdx);
      if (nextUncompleted === -1) {
        showKindergartenSetComplete();
      } else {
        showKindergartenSlide(nextUncompleted);
      }
    } else if (kindergartenState === 'COMPLETE') {
      resetCompletedSet(setKey);
      showKindergartenSlide(0);
    }
  }

  // Finite Math Set Prev/Next Helpers
  function nextMathSetSlide() {
    const topic = gradeTopicState[activeTab];
    if (!isFiniteMathTopic(topic)) return;
    const deck = FINITE_MATH_SETS[topic] || [];
    const currentIdx = trackMathSetIndices[topic] || 0;
    if (currentIdx < deck.length - 1) {
      trackMathSetIndices[topic] = currentIdx + 1;
      showNewMathProblem(currentIdx + 1);
    }
  }

  function prevMathSetSlide() {
    const topic = gradeTopicState[activeTab];
    if (!isFiniteMathTopic(topic)) return;
    const currentIdx = trackMathSetIndices[topic] || 0;
    if (currentIdx > 0) {
      trackMathSetIndices[topic] = currentIdx - 1;
      showNewMathProblem(currentIdx - 1);
    }
  }

  // Stats UI & Legacy Storage Helpers
  function updateStatsUI() {
    if (streakCountEl) streakCountEl.textContent = streak;
    if (totalCompletedEl) totalCompletedEl.textContent = totalCompleted;
  }

  function saveStats() {
    SafeStorage.setItem('mathpop_streak', String(streak));
    SafeStorage.setItem('mathpop_total', String(totalCompleted));
  }

  // PROFILE & PROGRESS MANAGEMENT (LOCALSTORAGE + EXPORT/IMPORT)
  // ========================================================
  const ProfileManager = (function() {
    const STORAGE_KEY = 'math_pop_profiles_v1';
    const AVATARS = ['🎈', '🚀', '🦊', '🐱', '🐶', '🐻', '🦁', '🦄', '🦖', '🌟', '🐼', '🐨'];

    let store = {
      activeProfileId: null,
      profiles: []
    };
    let selectedNewAvatar = AVATARS[0];
    let selectedEditAvatar = AVATARS[0];

    function createDefaultProfile(name = 'Player 1', avatar = '🎈') {
      const legacyScore = parseInt(SafeStorage.getItem('mathpop_total') || '0', 10) || 0;
      const legacyStreak = parseInt(SafeStorage.getItem('mathpop_streak') || '0', 10) || 0;

      return {
        id: 'prof_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: name.trim() || 'Player 1',
        avatar: avatar || '🎈',
        createdAt: new Date().toISOString(),
        stats: {
          totalCompleted: legacyScore,
          currentStreak: legacyStreak,
          bestStreak: legacyStreak,
          categories: {
            preschool: 0,
            kindergarten: 0,
            grade1: 0,
            grade2: 0,
            grade3: 0,
            grade4: 0,
            grade5: 0,
            riddles: 0,
            science: 0
          }
        },
        session: {
          activeTab: 'grade2',
          gradeTopics: {
            grade1: 'g1_add10',
            grade2: 'g2_add',
            grade3: 'g3_mult',
            grade4: 'g4_mult',
            grade5: 'g5_pemdas'
          },
          mathSetIndices: {
            g1_unusual: 0,
            g2_unusual: 0,
            g3_unusual: 0,
            g4_unusual: 0,
            g5_unusual: 0
          },
          riddleTrack: 'logic',
          riddleSlide: { logic: 0, visual: 0, mental: 0 },
          scienceTrack: 'space',
          scienceSlide: { space: 0, air: 0, density: 0, chemistry: 0 },
          preschoolTrack: 'patterns',
          preschoolSlide: { patterns: 0, counting: 0, shapes: 0, sorting: 0 },
          kindergartenTrack: 'math',
          kindergartenSlide: { math: 0, questions: 0, riddles: 0, puzzles: 0 },
          completedSets: {}
        }
      };
    }

    function loadStore() {
      try {
        const raw = SafeStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
            store = parsed;
            if (!store.profiles.some(p => p.id === store.activeProfileId)) {
              store.activeProfileId = store.profiles[0].id;
            }
            return;
          }
        }
      } catch (e) {
        // Fallback to default
      }
      const firstProfile = createDefaultProfile('Player 1', '🎈');
      store = {
        activeProfileId: firstProfile.id,
        profiles: [firstProfile]
      };
      saveStore();
    }

    function saveStore() {
      try {
        SafeStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch (e) {
        // Ignore storage write error
      }
    }

    function getActiveProfile() {
      return store.profiles.find(p => p.id === store.activeProfileId) || store.profiles[0];
    }

    function showFeedback(msg) {
      if (!profileSaveFeedback) return;
      profileSaveFeedback.textContent = msg;
      profileSaveFeedback.classList.remove('hidden');
      setTimeout(() => profileSaveFeedback.classList.add('hidden'), 2500);
    }

    function syncGlobalsFromProfile() {
      const active = getActiveProfile();
      if (!active) return;

      totalCompleted = active.stats.totalCompleted || 0;
      streak = active.stats.currentStreak || 0;
      updateStatsUI();

      if (profileAvatarEl) profileAvatarEl.textContent = active.avatar;
      if (profileNameEl) profileNameEl.textContent = active.name;

      if (active.session) {
        if (active.session.completedSets && typeof active.session.completedSets === 'object') {
          completedSetMap = JSON.parse(JSON.stringify(active.session.completedSets));
        } else {
          completedSetMap = {};
        }

        if (active.session.gradeTopics) {
          Object.assign(gradeTopicState, active.session.gradeTopics);
        }
        if (active.session.mathSetIndices) {
          Object.assign(trackMathSetIndices, active.session.mathSetIndices);
        }
        if (active.session.riddleTrack) {
          activeTeaserTrack = active.session.riddleTrack;
          teaserTrackButtons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-track') === activeTeaserTrack);
          });
        }
        if (active.session.riddleSlide && typeof active.session.riddleSlide === 'object') {
          Object.assign(trackSlideIndices, active.session.riddleSlide);
        }
        if (active.session.scienceTrack) {
          activeScienceTrack = active.session.scienceTrack;
          scienceTrackButtons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-track') === activeScienceTrack);
          });
        }
        if (active.session.scienceSlide && typeof active.session.scienceSlide === 'object') {
          Object.assign(trackScienceIndices, active.session.scienceSlide);
        }
        if (active.session.preschoolTrack) {
          activePreschoolTrack = active.session.preschoolTrack;
          preschoolTrackButtons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-track') === activePreschoolTrack);
          });
        }
        if (active.session.preschoolSlide && typeof active.session.preschoolSlide === 'object') {
          Object.assign(trackPreschoolIndices, active.session.preschoolSlide);
        }
        if (active.session.kindergartenTrack) {
          activeKindergartenTrack = active.session.kindergartenTrack;
          kindergartenTrackButtons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-track') === activeKindergartenTrack);
          });
        }
        if (active.session.kindergartenSlide && typeof active.session.kindergartenSlide === 'object') {
          Object.assign(trackKindergartenIndices, active.session.kindergartenSlide);
        }
      }
    }

    function saveSessionState() {
      const active = getActiveProfile();
      if (!active) return;

      active.stats.totalCompleted = totalCompleted;
      active.stats.currentStreak = streak;
      if (streak > (active.stats.bestStreak || 0)) {
        active.stats.bestStreak = streak;
      }

      active.session = {
        activeTab: activeTab,
        gradeTopics: { ...gradeTopicState },
        mathSetIndices: { ...trackMathSetIndices },
        riddleTrack: activeTeaserTrack,
        riddleSlide: { ...trackSlideIndices },
        scienceTrack: activeScienceTrack,
        scienceSlide: { ...trackScienceIndices },
        preschoolTrack: activePreschoolTrack,
        preschoolSlide: { ...trackPreschoolIndices },
        kindergartenTrack: activeKindergartenTrack,
        kindergartenSlide: { ...trackKindergartenIndices },
        completedSets: JSON.parse(JSON.stringify(completedSetMap))
      };
      saveStore();
    }

    function recordCompletion(categoryKey, currentStreakVal) {
      const active = getActiveProfile();
      if (!active) return;

      totalCompleted += 1;
      active.stats.totalCompleted = totalCompleted;
      active.stats.currentStreak = currentStreakVal;
      if (currentStreakVal > (active.stats.bestStreak || 0)) {
        active.stats.bestStreak = currentStreakVal;
      }

      if (!active.stats.categories) {
        active.stats.categories = {};
      }
      active.stats.categories[categoryKey] = (active.stats.categories[categoryKey] || 0) + 1;

      saveSessionState();
    }

    function switchProfile(profileId) {
      const target = store.profiles.find(p => p.id === profileId);
      if (!target) return;
      store.activeProfileId = target.id;
      saveStore();
      syncGlobalsFromProfile();

      const targetTab = (target.session && target.session.activeTab) || 'grade2';
      switchTab(targetTab);
      renderModal();
      playPopSound();
    }

    function addProfile(name, avatar) {
      const cleanName = (name || '').trim();
      if (!cleanName) return false;
      const newProf = createDefaultProfile(cleanName, avatar || selectedNewAvatar);
      newProf.stats.totalCompleted = 0;
      newProf.stats.currentStreak = 0;
      newProf.stats.bestStreak = 0;

      store.profiles.push(newProf);
      store.activeProfileId = newProf.id;
      saveStore();
      syncGlobalsFromProfile();
      switchTab('grade2');
      renderModal();
      showFeedback(`Switched to ${newProf.name}`);
      playChimeSound(false);
      return true;
    }

    function resetActiveProgress() {
      const active = getActiveProfile();
      if (!active) return;

      active.stats = {
        totalCompleted: 0,
        currentStreak: 0,
        bestStreak: 0,
        categories: {
          preschool: 0,
          kindergarten: 0,
          grade1: 0,
          grade2: 0,
          grade3: 0,
          grade4: 0,
          grade5: 0,
          riddles: 0,
          science: 0
        }
      };
      completedSetMap = {};
      if (active.session) {
        active.session.completedSets = {};
      }
      totalCompleted = 0;
      streak = 0;
      saveStats();
      saveStore();
      updateStatsUI();
      renderModal();
      showFeedback('Progress reset');
    }

    function deleteActiveProfile() {
      if (store.profiles.length <= 1) {
        resetActiveProgress();
        return;
      }
      store.profiles = store.profiles.filter(p => p.id !== store.activeProfileId);
      store.activeProfileId = store.profiles[0].id;
      saveStore();
      syncGlobalsFromProfile();
      renderModal();
    }

    function exportBackupJSON() {
      saveSessionState();
      const payload = {
        app: 'Math & Logic Progress Backup',
        version: 2,
        exportedAt: new Date().toISOString(),
        data: store
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const active = getActiveProfile();
      const safeName = (active ? active.name : 'learner').toLowerCase().replace(/[^a-z0-9]/g, '_');
      a.href = url;
      a.download = `math_logic_progress_${safeName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showFeedback('Progress exported');
    }

    function importBackupJSON(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const importedStore = parsed.data && Array.isArray(parsed.data.profiles) ? parsed.data : (Array.isArray(parsed.profiles) ? parsed : null);
          if (!importedStore || !importedStore.profiles.length) {
            throw new Error('Invalid backup format');
          }
          store = importedStore;
          if (!store.profiles.some(p => p.id === store.activeProfileId)) {
            store.activeProfileId = store.profiles[0].id;
          }
          saveStore();
          syncGlobalsFromProfile();
          const active = getActiveProfile();
          if (active && active.session && active.session.activeTab) {
            switchTab(active.session.activeTab);
          }
          renderModal();
          showFeedback('Backup restored');
          playChimeSound(true);
        } catch (err) {
          showFeedback('Invalid JSON backup file');
        }
      };
      reader.readAsText(file);
    }

    function renderAvatarGrid(containerEl, currentSelected, onSelect) {
      if (!containerEl) return;
      containerEl.innerHTML = '';
      AVATARS.forEach(emoji => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'avatar-option' + (emoji === currentSelected ? ' selected' : '');
        btn.textContent = emoji;
        btn.addEventListener('click', () => {
          onSelect(emoji);
        });
        containerEl.appendChild(btn);
      });
    }

    function renderCategoryBreakdown(active) {
      if (!categoryBreakdownGrid) return;
      const cats = (active.stats && active.stats.categories) || {};
      const items = [
        { key: 'preschool', label: 'Preschool' },
        { key: 'kindergarten', label: 'Kindergarten' },
        { key: 'grade1', label: '1st Grade' },
        { key: 'grade2', label: '2nd Grade' },
        { key: 'grade3', label: '3rd Grade' },
        { key: 'grade4', label: '4th Grade' },
        { key: 'grade5', label: '5th Grade' },
        { key: 'riddles', label: 'Logic & Spatial' },
        { key: 'science', label: 'Science Lab' }
      ];

      categoryBreakdownGrid.innerHTML = items.map(item => {
        const count = cats[item.key] || 0;
        return `
          <div class="cat-chip">
            <span class="cat-chip-label">${item.label}</span>
            <span class="cat-chip-val">${count}</span>
          </div>
        `;
      }).join('');
    }

    function renderModal() {
      const active = getActiveProfile();
      if (!active) return;

      if (modalActiveAvatar) modalActiveAvatar.textContent = active.avatar;
      if (modalActiveName) modalActiveName.textContent = active.name;
      if (modalTotalCompleted) modalTotalCompleted.textContent = active.stats.totalCompleted || 0;
      if (modalCurrentStreak) modalCurrentStreak.textContent = active.stats.currentStreak || 0;
      if (modalBestStreak) modalBestStreak.textContent = active.stats.bestStreak || 0;

      renderCategoryBreakdown(active);

      if (profileList) {
        profileList.innerHTML = '';
        store.profiles.forEach(p => {
          const item = document.createElement('div');
          item.className = 'profile-item' + (p.id === active.id ? ' active' : '');
          item.innerHTML = `
            <div class="profile-item-left">
              <span class="profile-item-avatar">${p.avatar}</span>
              <div>
                <div class="profile-item-name">${p.name}</div>
                <div class="profile-item-stats">Completed: ${p.stats.totalCompleted || 0} • Best Streak: ${p.stats.bestStreak || 0}</div>
              </div>
            </div>
          `;
          item.addEventListener('click', () => switchProfile(p.id));
          profileList.appendChild(item);
        });
      }

      if (deleteProfileBtn) {
        deleteProfileBtn.classList.toggle('hidden', store.profiles.length <= 1);
      }
    }

    function bindModalEvents() {
      if (profileBtn && profileModal) {
        profileBtn.addEventListener('click', () => {
          renderModal();
          profileModal.classList.remove('hidden');
        });
      }
      if (closeProfileModalBtn && profileModal) {
        closeProfileModalBtn.addEventListener('click', () => profileModal.classList.add('hidden'));
      }
      if (modalPlayBtn && profileModal) {
        modalPlayBtn.addEventListener('click', () => profileModal.classList.add('hidden'));
      }
      if (profileModal) {
        profileModal.addEventListener('click', (e) => {
          if (e.target === profileModal) profileModal.classList.add('hidden');
        });
      }

      const openEditForm = () => {
        const active = getActiveProfile();
        if (!active || !editPlayerForm) return;
        selectedEditAvatar = active.avatar;
        if (editPlayerNameInput) editPlayerNameInput.value = active.name;
        const updateEditAvatar = (emoji) => {
          selectedEditAvatar = emoji;
          renderAvatarGrid(editAvatarPicker, selectedEditAvatar, updateEditAvatar);
        };
        updateEditAvatar(selectedEditAvatar);
        editPlayerForm.classList.remove('hidden');
      };

      if (editProfileBtn) editProfileBtn.addEventListener('click', openEditForm);
      if (playerNameRow) playerNameRow.addEventListener('click', openEditForm);
      if (modalActiveAvatar) modalActiveAvatar.addEventListener('click', openEditForm);

      if (cancelEditPlayerBtn && editPlayerForm) {
        cancelEditPlayerBtn.addEventListener('click', () => editPlayerForm.classList.add('hidden'));
      }
      if (editPlayerForm) {
        editPlayerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const active = getActiveProfile();
          if (active && editPlayerNameInput && editPlayerNameInput.value.trim()) {
            active.name = editPlayerNameInput.value.trim();
            active.avatar = selectedEditAvatar;
            saveStore();
            syncGlobalsFromProfile();
            renderModal();
            editPlayerForm.classList.add('hidden');
            showFeedback('Profile updated');
          }
        });
      }

      if (toggleNewPlayerBtn && newPlayerForm) {
        toggleNewPlayerBtn.addEventListener('click', () => {
          selectedNewAvatar = AVATARS[0];
          const updateNewAvatar = (emoji) => {
            selectedNewAvatar = emoji;
            renderAvatarGrid(newAvatarPicker, selectedNewAvatar, updateNewAvatar);
          };
          updateNewAvatar(selectedNewAvatar);
          newPlayerForm.classList.toggle('hidden');
          if (newPlayerNameInput) newPlayerNameInput.focus();
        });
      }
      if (cancelNewPlayerBtn && newPlayerForm) {
        cancelNewPlayerBtn.addEventListener('click', () => newPlayerForm.classList.add('hidden'));
      }
      if (newPlayerForm) {
        newPlayerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          if (newPlayerNameInput && addProfile(newPlayerNameInput.value, selectedNewAvatar)) {
            newPlayerNameInput.value = '';
            newPlayerForm.classList.add('hidden');
          }
        });
      }

      if (exportProfilesBtn) {
        exportProfilesBtn.addEventListener('click', exportBackupJSON);
      }
      if (importProfilesBtn && importFileInput) {
        importProfilesBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            importBackupJSON(e.target.files[0]);
            e.target.value = '';
          }
        });
      }

      if (resetProfileStatsBtn) {
        resetProfileStatsBtn.addEventListener('click', resetActiveProgress);
      }
      if (deleteProfileBtn) {
        deleteProfileBtn.addEventListener('click', deleteActiveProfile);
      }
      if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', resetActiveProgress);
      }
    }

    function init() {
      loadStore();
      syncGlobalsFromProfile();
      bindModalEvents();
    }

    return {
      init,
      getActiveProfile,
      recordCompletion,
      saveSessionState,
      resetActiveProgress
    };
  })();
  (typeof window !== "undefined" ? window : global).ProfileManager = ProfileManager;

  // ========================================================
  // CLIENT-SIDE URL HASH ROUTER (REQUIREMENT R1)
  // ========================================================
  const AppRouter = (function() {
    let isInternalUpdate = false;
    let isNavigating = false;
    let isInitialLoad = true;

    const VALID_SECTIONS = [
      'preschool', 'kindergarten',
      'grade1', 'grade2', 'grade3', 'grade4', 'grade5',
      'riddles', 'science'
    ];

    const TRACK_COUNTS = {
      preschool: { patterns: 12, counting: 12, shapes: 12, sorting: 12 },
      kindergarten: { math: 12, questions: 12, riddles: 12, puzzles: 12 },
      riddles: { logic: 12, visual: 10, mental: 6 },
      science: { space: 4, air: 4, density: 4, chemistry: 4 }
    };

    const TRACK_CONFIG = {
      preschool: {
        tracks: ['patterns', 'counting', 'shapes', 'sorting'],
        defaultTrack: 'patterns',
        getDeck: (track) => (typeof PRESCHOOL_SLIDES !== 'undefined' ? PRESCHOOL_SLIDES[track] : null)
      },
      kindergarten: {
        tracks: ['math', 'questions', 'riddles', 'puzzles'],
        defaultTrack: 'math',
        getDeck: (track) => (typeof KINDERGARTEN_SLIDES !== 'undefined' ? KINDERGARTEN_SLIDES[track] : null)
      },
      riddles: {
        tracks: ['logic', 'visual', 'mental'],
        defaultTrack: 'logic',
        getDeck: (track) => {
          if (track === 'logic') return typeof LOGIC_SLIDES !== 'undefined' ? LOGIC_SLIDES : null;
          if (track === 'visual') return typeof VISUAL_SLIDES !== 'undefined' ? VISUAL_SLIDES : null;
          if (track === 'mental') return typeof MENTAL_3D_SLIDES !== 'undefined' ? MENTAL_3D_SLIDES : null;
          return null;
        }
      },
      science: {
        tracks: ['space', 'air', 'density', 'chemistry'],
        defaultTrack: 'space',
        getDeck: (track) => (typeof SCIENCE_SLIDES !== 'undefined' ? SCIENCE_SLIDES[track] : null)
      }
    };

    const MATH_CONFIG = {
      grade1: { topics: ['g1_add10', 'g1_sub10', 'g1_make10', 'g1_add20', 'g1_sub20', 'g1_tens', 'g1_mix', 'g1_unusual'], defaultTopic: 'g1_add10', finiteTopics: { g1_unusual: 10 } },
      grade2: { topics: ['g2_add', 'g2_sub', 'g2_mix', 'g2_chal', 'g2_unusual'], defaultTopic: 'g2_add', finiteTopics: { g2_unusual: 10 } },
      grade3: { topics: ['g3_mult', 'g3_div', 'g3_addsub', 'g3_geom', 'g3_mix', 'g3_unusual'], defaultTopic: 'g3_mult', finiteTopics: { g3_unusual: 10 } },
      grade4: { topics: ['g4_mult', 'g4_div', 'g4_frac', 'g4_prime', 'g4_dec', 'g4_mix', 'g4_unusual'], defaultTopic: 'g4_mult', finiteTopics: { g4_unusual: 10 } },
      grade5: { topics: ['g5_pemdas', 'g5_frac_unlike', 'g5_frac_mult', 'g5_dec_ops', 'g5_volume', 'g5_mix', 'g5_unusual'], defaultTopic: 'g5_pemdas', finiteTopics: { g5_unusual: 10 } }
    };

    function parseHash(hashStr) {
      if (typeof hashStr !== 'string') {
        hashStr = (typeof window !== 'undefined' && window.location ? window.location.hash : '') || '';
      }
      if (!hashStr || typeof hashStr !== 'string') return null;

      const clean = hashStr.replace(/^[#\s]+/, '').split('?')[0].trim();
      if (!clean) return null;

      const parts = clean.split('/').map(p => p.trim()).filter(Boolean);
      if (parts.length === 0) return null;

      const section = parts[0].toLowerCase();
      const topic = parts[1] ? parts[1].toLowerCase() : null;
      let problem = null;

      if (parts[2]) {
        const parsedNum = parseInt(parts[2], 10);
        if (!isNaN(parsedNum)) {
          problem = parsedNum;
        }
      }

      return { section, topic, problem };
    }

    function getCurrentCanonicalHash() {
      if (activeTab === 'preschool') {
        const track = activePreschoolTrack || 'patterns';
        const num = (trackPreschoolIndices[track] || 0) + 1;
        return `#preschool/${track}/${num}`;
      }
      if (activeTab === 'kindergarten') {
        const track = activeKindergartenTrack || 'math';
        const num = (trackKindergartenIndices[track] || 0) + 1;
        return `#kindergarten/${track}/${num}`;
      }
      if (activeTab === 'riddles') {
        const track = activeTeaserTrack || 'logic';
        const num = (trackSlideIndices[track] || 0) + 1;
        return `#riddles/${track}/${num}`;
      }
      if (activeTab === 'science') {
        const track = activeScienceTrack || 'space';
        const num = (trackScienceIndices[track] || 0) + 1;
        return `#science/${track}/${num}`;
      }
      // Math sections (grade1 .. grade5)
      const topic = gradeTopicState[activeTab] || (typeof GRADE_TOPICS !== 'undefined' && GRADE_TOPICS[activeTab] && GRADE_TOPICS[activeTab][0]?.id) || 'g2_add';
      if (typeof isFiniteMathTopic === 'function' && isFiniteMathTopic(topic)) {
        const num = (trackMathSetIndices[topic] || 0) + 1;
        return `#${activeTab}/${topic}/${num}`;
      }
      return `#${activeTab}/${topic}`;
    }

    function formatCanonicalHash(state) {
      if (!state) return getCurrentCanonicalHash();
      const section = (state.section || '').toLowerCase();
      if (!VALID_SECTIONS.includes(section)) return '#grade2/g2_add';

      const topic = state.topic ? state.topic.toLowerCase() : null;
      const problemIndex = typeof state.problemIndex === 'number'
        ? state.problemIndex
        : (typeof state.problem === 'number' ? state.problem - 1 : 0);

      const secCfg = TRACK_CONFIG[section];
      if (secCfg) {
        const track = (topic && secCfg.tracks.includes(topic)) ? topic : secCfg.defaultTrack;
        const total = (TRACK_COUNTS[section] && TRACK_COUNTS[section][track]) || (secCfg.getDeck && secCfg.getDeck(track) ? secCfg.getDeck(track).length : 1);
        const clampedIdx = Math.max(0, Math.min(total - 1, problemIndex));
        return `#${section}/${track}/${clampedIdx + 1}`;
      }

      // Math sections
      const mCfg = MATH_CONFIG[section];
      if (mCfg) {
        const top = (topic && mCfg.topics.includes(topic)) ? topic : mCfg.defaultTopic;
        if (mCfg.finiteTopics && mCfg.finiteTopics[top]) {
          const total = mCfg.finiteTopics[top];
          const clampedIdx = Math.max(0, Math.min(total - 1, problemIndex));
          return `#${section}/${top}/${clampedIdx + 1}`;
        }
        return `#${section}/${top}`;
      }

      return '#grade2/g2_add';
    }

    function clampProblemNumber(section, topic, rawProblemNum) {
      if (!VALID_SECTIONS.includes(section)) return 1;

      let total = null;
      if (TRACK_COUNTS[section] && topic && TRACK_COUNTS[section][topic]) {
        total = TRACK_COUNTS[section][topic];
      } else if (section.startsWith('grade') && topic && topic.endsWith('_unusual')) {
        total = 10;
      }

      if (total === null) {
        return null;
      }

      if (typeof rawProblemNum !== 'number' || isNaN(rawProblemNum)) {
        return 1;
      }

      return Math.max(1, Math.min(total, rawProblemNum));
    }

    function matchesCurrentState(parsed) {
      if (!parsed || parsed.section !== activeTab) return false;
      if (activeTab === 'preschool') {
        const expectedTrack = activePreschoolTrack || 'patterns';
        if (parsed.topic && parsed.topic !== expectedTrack) return false;
        const expectedProblem = (trackPreschoolIndices[expectedTrack] || 0) + 1;
        if (typeof parsed.problem === 'number' && parsed.problem !== expectedProblem) return false;
        return true;
      }
      if (activeTab === 'kindergarten') {
        const expectedTrack = activeKindergartenTrack || 'math';
        if (parsed.topic && parsed.topic !== expectedTrack) return false;
        const expectedProblem = (trackKindergartenIndices[expectedTrack] || 0) + 1;
        if (typeof parsed.problem === 'number' && parsed.problem !== expectedProblem) return false;
        return true;
      }
      if (activeTab === 'riddles') {
        const expectedTrack = activeTeaserTrack || 'logic';
        if (parsed.topic && parsed.topic !== expectedTrack) return false;
        const expectedProblem = (trackSlideIndices[expectedTrack] || 0) + 1;
        if (typeof parsed.problem === 'number' && parsed.problem !== expectedProblem) return false;
        return true;
      }
      if (activeTab === 'science') {
        const expectedTrack = activeScienceTrack || 'space';
        if (parsed.topic && parsed.topic !== expectedTrack) return false;
        const expectedProblem = (trackScienceIndices[expectedTrack] || 0) + 1;
        if (typeof parsed.problem === 'number' && parsed.problem !== expectedProblem) return false;
        return true;
      }
      // Math sections
      const expectedTopic = gradeTopicState[activeTab] || (typeof GRADE_TOPICS !== 'undefined' && GRADE_TOPICS[activeTab] && GRADE_TOPICS[activeTab][0]?.id) || 'g2_add';
      if (parsed.topic && parsed.topic !== expectedTopic) return false;
      if (typeof isFiniteMathTopic === 'function' && isFiniteMathTopic(expectedTopic)) {
        const expectedProblem = (trackMathSetIndices[expectedTopic] || 0) + 1;
        if (typeof parsed.problem === 'number' && parsed.problem !== expectedProblem) return false;
      }
      return true;
    }

    function syncUrl(options = {}) {
      if (isNavigating) return;
      if (typeof window === 'undefined' || !window.location) return;

      const targetHash = getCurrentCanonicalHash();
      if (window.location.hash === targetHash) return;

      isInternalUpdate = true;
      try {
        if ((isInitialLoad || options.replace) && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', targetHash);
          isInternalUpdate = false;
        } else {
          window.location.hash = targetHash;
          setTimeout(() => {
            isInternalUpdate = false;
          }, 0);
        }
      } catch (e) {
        try {
          window.location.hash = targetHash;
        } catch (_) {}
        setTimeout(() => {
          isInternalUpdate = false;
        }, 0);
      }
    }

    function applyRoute(parsed, isInitial = false) {
      if (!parsed || !VALID_SECTIONS.includes(parsed.section)) {
        return false;
      }

      isNavigating = true;
      try {
        const section = parsed.section;
        activeTab = section;

        // 1. Update Primary Tab UI and Section Visibility
        if (tabButtons && tabButtons.length) {
          tabButtons.forEach(btn => {
            const isMatch = btn.getAttribute('data-tab') === section;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
          });
        }

        if (preschoolSection) preschoolSection.classList.toggle('hidden', section !== 'preschool');
        if (kindergartenSection) kindergartenSection.classList.toggle('hidden', section !== 'kindergarten');
        if (mathSection) mathSection.classList.toggle('hidden', !section.startsWith('grade'));
        if (riddlesSection) riddlesSection.classList.toggle('hidden', section !== 'riddles');
        if (scienceSection) scienceSection.classList.toggle('hidden', section !== 'science');

        // 2. Section Specific Track & Slide Setup
        if (section === 'preschool') {
          const cfg = TRACK_CONFIG.preschool;
          const track = (parsed.topic && cfg.tracks.includes(parsed.topic))
            ? parsed.topic
            : (activePreschoolTrack || cfg.defaultTrack);
          activePreschoolTrack = track;
          if (preschoolTrackButtons) {
            preschoolTrackButtons.forEach(b => {
              b.classList.toggle('active', b.getAttribute('data-track') === track);
            });
          }

          const deck = cfg.getDeck(track) || [];
          let index = trackPreschoolIndices[track] || 0;
          if (typeof parsed.problem === 'number' && !isNaN(parsed.problem) && deck.length > 0) {
            index = Math.max(0, Math.min(deck.length - 1, parsed.problem - 1));
          }
          showPreschoolSlide(index);

        } else if (section === 'kindergarten') {
          const cfg = TRACK_CONFIG.kindergarten;
          const track = (parsed.topic && cfg.tracks.includes(parsed.topic))
            ? parsed.topic
            : (activeKindergartenTrack || cfg.defaultTrack);
          activeKindergartenTrack = track;
          if (kindergartenTrackButtons) {
            kindergartenTrackButtons.forEach(b => {
              b.classList.toggle('active', b.getAttribute('data-track') === track);
            });
          }

          const deck = cfg.getDeck(track) || [];
          let index = trackKindergartenIndices[track] || 0;
          if (typeof parsed.problem === 'number' && !isNaN(parsed.problem) && deck.length > 0) {
            index = Math.max(0, Math.min(deck.length - 1, parsed.problem - 1));
          }
          showKindergartenSlide(index);

        } else if (section === 'riddles') {
          const cfg = TRACK_CONFIG.riddles;
          const track = (parsed.topic && cfg.tracks.includes(parsed.topic))
            ? parsed.topic
            : (activeTeaserTrack || cfg.defaultTrack);
          activeTeaserTrack = track;
          if (teaserTrackButtons) {
            teaserTrackButtons.forEach(b => {
              b.classList.toggle('active', b.getAttribute('data-track') === track);
            });
          }

          const deck = cfg.getDeck(track) || [];
          let index = trackSlideIndices[track] || 0;
          if (typeof parsed.problem === 'number' && !isNaN(parsed.problem) && deck.length > 0) {
            index = Math.max(0, Math.min(deck.length - 1, parsed.problem - 1));
          }
          showSlide(index);

        } else if (section === 'science') {
          const cfg = TRACK_CONFIG.science;
          const track = (parsed.topic && cfg.tracks.includes(parsed.topic))
            ? parsed.topic
            : (activeScienceTrack || cfg.defaultTrack);
          activeScienceTrack = track;
          if (scienceTrackButtons) {
            scienceTrackButtons.forEach(b => {
              b.classList.toggle('active', b.getAttribute('data-track') === track);
            });
          }

          const deck = cfg.getDeck(track) || [];
          let index = trackScienceIndices[track] || 0;
          if (typeof parsed.problem === 'number' && !isNaN(parsed.problem) && deck.length > 0) {
            index = Math.max(0, Math.min(deck.length - 1, parsed.problem - 1));
          }
          showScienceSlide(index);

        } else {
          // Math Grade Section (grade1 .. grade5)
          const gradeTopics = (typeof GRADE_TOPICS !== 'undefined' && GRADE_TOPICS[section]) || [];
          const validTopic = parsed.topic && gradeTopics.find(t => t.id === parsed.topic);
          const topicId = validTopic ? validTopic.id : (gradeTopicState[section] || (gradeTopics[0] && gradeTopics[0].id));
          gradeTopicState[section] = topicId;

          renderTopicBar();

          if (typeof isFiniteMathTopic === 'function' && isFiniteMathTopic(topicId)) {
            const deck = (typeof FINITE_MATH_SETS !== 'undefined' && FINITE_MATH_SETS[topicId]) || [];
            let index = trackMathSetIndices[topicId] || 0;
            if (typeof parsed.problem === 'number' && !isNaN(parsed.problem) && deck.length > 0) {
              index = Math.max(0, Math.min(deck.length - 1, parsed.problem - 1));
            }
            showNewMathProblem(index);
          } else {
            showNewMathProblem();
          }
        }

        ProfileManager.saveSessionState();
        return true;
      } finally {
        isNavigating = false;
      }
    }

    function handleHashChange() {
      if (isInternalUpdate) return;
      if (typeof window === 'undefined' || !window.location) return;

      const targetHash = window.location.hash;
      if (targetHash === getCurrentCanonicalHash()) {
        return;
      }

      const parsed = parseHash(targetHash);
      if (!parsed || !VALID_SECTIONS.includes(parsed.section)) {
        // Fallback to valid default (grade2)
        const fallbackParsed = { section: 'grade2', topic: null, problem: null };
        applyRoute(fallbackParsed, false);
        syncUrl({ replace: true });
        return;
      }

      if (matchesCurrentState(parsed)) {
        syncUrl({ replace: true });
        return;
      }

      applyRoute(parsed, false);

      const canonical = getCurrentCanonicalHash();
      if (window.location.hash !== canonical) {
        syncUrl({ replace: true });
      }
    }

    function init() {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('hashchange', handleHashChange);
      }
    }

    function markReady() {
      isInitialLoad = false;
    }

    return {
      init,
      parseHash,
      applyRoute,
      syncUrl,
      handleHashChange,
      getCurrentCanonicalHash,
      formatCanonicalHash,
      clampProblemNumber,
      matchesCurrentState,
      markReady,
      VALID_SECTIONS,
      TRACK_CONFIG,
      TRACK_COUNTS
    };
  })();
  (typeof window !== "undefined" ? window : global).AppRouter = AppRouter;

  // ========================================================
  // TAB SWITCHING & GLOBAL EVENT LISTENERS
  // ========================================================
  function switchTab(tabName) {
    activeTab = tabName;

    tabButtons.forEach(btn => {
      const isMatch = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    if (preschoolSection) preschoolSection.classList.add('hidden');
    if (kindergartenSection) kindergartenSection.classList.add('hidden');
    mathSection.classList.add('hidden');
    riddlesSection.classList.add('hidden');
    scienceSection.classList.add('hidden');

    if (tabName === 'preschool') {
      if (preschoolSection) preschoolSection.classList.remove('hidden');
      showPreschoolSlide(trackPreschoolIndices[activePreschoolTrack] || 0);
    } else if (tabName === 'kindergarten') {
      if (kindergartenSection) kindergartenSection.classList.remove('hidden');
      showKindergartenSlide(trackKindergartenIndices[activeKindergartenTrack] || 0);
    } else if (tabName === 'riddles') {
      riddlesSection.classList.remove('hidden');
      showSlide(trackSlideIndices[activeTeaserTrack] || 0);
    } else if (tabName === 'science') {
      scienceSection.classList.remove('hidden');
      showScienceSlide(trackScienceIndices[activeScienceTrack] || 0);
    } else {
      mathSection.classList.remove('hidden');
      renderTopicBar();
      showNewMathProblem();
    }

    ProfileManager.saveSessionState();
    if (typeof AppRouter !== 'undefined' && AppRouter.syncUrl) {
      AppRouter.syncUrl();
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      if (targetTab && targetTab !== activeTab) {
        switchTab(targetTab);
      }
    });
  });

  // Preschool Track Switcher & Speech
  preschoolTrackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTrack = btn.getAttribute('data-track');
      if (targetTrack && targetTrack !== activePreschoolTrack) {
        activePreschoolTrack = targetTrack;
        preschoolTrackButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-track') === targetTrack);
        });
        showPreschoolSlide(trackPreschoolIndices[activePreschoolTrack] || 0);
        ProfileManager.saveSessionState();
      }
    });
  });

  if (preschoolSpeakBtn) {
    preschoolSpeakBtn.addEventListener('click', () => {
      if (currentPreschoolSlide) {
        const textToRead = preschoolState === 'SOLUTION'
          ? `${currentPreschoolSlide.answerTitle}. ${currentPreschoolSlide.explanation}`
          : currentPreschoolSlide.question;
        speakText(textToRead, preschoolSpeakBtn);
      }
    });
  }

  // Kindergarten Track Switcher & Speech
  kindergartenTrackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTrack = btn.getAttribute('data-track');
      if (targetTrack && targetTrack !== activeKindergartenTrack) {
        activeKindergartenTrack = targetTrack;
        kindergartenTrackButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-track') === targetTrack);
        });
        showKindergartenSlide(trackKindergartenIndices[activeKindergartenTrack] || 0);
        ProfileManager.saveSessionState();
      }
    });
  });

  if (kindergartenSpeakBtn) {
    kindergartenSpeakBtn.addEventListener('click', () => {
      if (currentKindergartenSlide) {
        const textToRead = kindergartenState === 'SOLUTION'
          ? `${currentKindergartenSlide.answerTitle}. ${currentKindergartenSlide.explanation}`
          : currentKindergartenSlide.question;
        speakText(textToRead, kindergartenSpeakBtn);
      }
    });
  }

  // Logic & Spatial Track Switcher
  teaserTrackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTrack = btn.getAttribute('data-track');
      if (targetTrack && targetTrack !== activeTeaserTrack) {
        activeTeaserTrack = targetTrack;
        teaserTrackButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-track') === targetTrack);
        });
        showSlide(trackSlideIndices[activeTeaserTrack] || 0);
        ProfileManager.saveSessionState();
      }
    });
  });

  // Science Track Switcher
  scienceTrackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTrack = btn.getAttribute('data-track');
      if (targetTrack && targetTrack !== activeScienceTrack) {
        activeScienceTrack = targetTrack;
        scienceTrackButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-track') === targetTrack);
        });
        showScienceSlide(trackScienceIndices[activeScienceTrack] || 0);
        ProfileManager.saveSessionState();
      }
    });
  });

  // Action Buttons
  actionBtn.addEventListener('click', handleMathAdvance);
  if (prevMathSlideBtn) prevMathSlideBtn.addEventListener('click', prevMathSetSlide);
  if (nextMathSlideBtn) nextMathSlideBtn.addEventListener('click', nextMathSetSlide);

  riddleActionBtn.addEventListener('click', handleRiddleAdvance);
  prevSlideBtn.addEventListener('click', prevSlide);
  nextSlideBtn.addEventListener('click', nextSlide);

  scienceActionBtn.addEventListener('click', handleScienceAdvance);
  prevScienceSlideBtn.addEventListener('click', prevScienceSlide);
  nextScienceSlideBtn.addEventListener('click', nextScienceSlide);

  if (preschoolActionBtn) preschoolActionBtn.addEventListener('click', handlePreschoolAdvance);
  if (prevPreschoolSlideBtn) prevPreschoolSlideBtn.addEventListener('click', prevPreschoolSlide);
  if (nextPreschoolSlideBtn) nextPreschoolSlideBtn.addEventListener('click', nextPreschoolSlide);

  if (kindergartenActionBtn) kindergartenActionBtn.addEventListener('click', handleKindergartenAdvance);
  if (prevKindergartenSlideBtn) prevKindergartenSlideBtn.addEventListener('click', prevKindergartenSlide);
  if (nextKindergartenSlideBtn) nextKindergartenSlideBtn.addEventListener('click', nextKindergartenSlide);

  // Keyboard Support
  window.addEventListener('keydown', (e) => {
    if (profileModal && !profileModal.classList.contains('hidden')) {
      if (e.key === 'Escape') profileModal.classList.add('hidden');
      return;
    }

    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

    if (e.code === 'Space' || e.code === 'Enter') {
      if (activeEl && activeEl.tagName === 'BUTTON') {
        return;
      }
      if (isTyping && e.code === 'Space') {
        return;
      }
      e.preventDefault();
      if (activeTab === 'preschool') {
        handlePreschoolAdvance();
      } else if (activeTab === 'kindergarten') {
        handleKindergartenAdvance();
      } else if (activeTab === 'riddles') {
        handleRiddleAdvance();
      } else if (activeTab === 'science') {
        handleScienceAdvance();
      } else {
        handleMathAdvance();
      }
    } else if (!isTyping && e.code === 'ArrowRight') {
      if (activeTab === 'preschool') nextPreschoolSlide();
      if (activeTab === 'kindergarten') nextKindergartenSlide();
      if (activeTab === 'riddles') nextSlide();
      if (activeTab === 'science') nextScienceSlide();
      if (isFiniteMathTopic(gradeTopicState[activeTab])) nextMathSetSlide();
    } else if (!isTyping && e.code === 'ArrowLeft') {
      if (activeTab === 'preschool') prevPreschoolSlide();
      if (activeTab === 'kindergarten') prevKindergartenSlide();
      if (activeTab === 'riddles') prevSlide();
      if (activeTab === 'science') prevScienceSlide();
      if (isFiniteMathTopic(gradeTopicState[activeTab])) prevMathSetSlide();
    }
  });

  // Sound Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      SafeStorage.setItem('mathpop_sound', String(soundEnabled));
      if (typeof setSoundEnabled === 'function') {
        setSoundEnabled(soundEnabled);
      }
      soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled && typeof playPopSound === 'function') playPopSound();
    });
  }

  // Synchronize audio mute state across reloads
  if (typeof setSoundEnabled === 'function') {
    setSoundEnabled(soundEnabled);
  }
  if (soundToggleBtn) {
    soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
  }

  // Initialize Application
  ProfileManager.init();
  AppRouter.init();

  const parsedInitial = AppRouter.parseHash();
  if (parsedInitial && AppRouter.VALID_SECTIONS.includes(parsedInitial.section)) {
    AppRouter.applyRoute(parsedInitial, true);
    AppRouter.syncUrl({ replace: true });
  } else {
    const initialProfile = ProfileManager.getActiveProfile();
    const initialTab = (initialProfile && initialProfile.session && initialProfile.session.activeTab) || 'grade2';
    switchTab(initialTab);
    AppRouter.syncUrl({ replace: true });
  }
  AppRouter.markReady();
})();
