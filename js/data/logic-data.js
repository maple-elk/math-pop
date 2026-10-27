  // ========================================================
  // SPATIAL, VISUAL & LOGIC PROBLEMS (SEQUENTIAL NUMBERED SETS)
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
      svg += `<text x="${originX}" y="${originY + h + w/2 + 4}" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">${label}</text>`;
    }
    svg += `</g>`;
    return svg;
  }

  function renderThoughtBubble(hintText = "Visualize this 3D solid before revealing the diagram.") {
    return `
      <div class="thought-bubble-container">
        <div class="thought-icon">🧊</div>
        <div class="thought-text">${hintText}</div>
        <div class="thought-hint">Press [SPACE] to view the 3D diagram and solution</div>
      </div>
    `;
  }

  // ========================================================
  // TRACK 1: LOGIC PROBLEMS (12 CURATED NUMBERED PROBLEMS)
  // ========================================================
  const LOGIC_SLIDES = [
    // Problem 1: Odd Seven
    {
      question: 'I am an odd number. Take away one letter from my spelling and I become "even". What number am I?',
      answerRaw: '7',
      answersAccepted: ['7', 'seven'],
      answerTitle: 'Answer: Seven (7)',
      explanation: "Removing the letter 'S' from SEVEN leaves the word EVEN.",
      render: (isRevealed) => {
        if (!isRevealed) {
          return `
            <div class="logic-riddle-container">
              <div class="logic-tiles-row">
                <span class="logic-tile">S</span>
                <span class="logic-tile">E</span>
                <span class="logic-tile">V</span>
                <span class="logic-tile">E</span>
                <span class="logic-tile">N</span>
              </div>
              <div class="logic-riddle-clue">Which letter can be removed to leave the word "EVEN"?</div>
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
            <div class="logic-banner highlight">SEVEN minus 'S' = EVEN</div>
          </div>
        `;
      }
    },

    // Problem 2: 3 Apples on a Table
    {
      question: 'There are 3 apples on a table, and you pick up 2 of them. How many apples do you have in your hands?',
      answerRaw: '2',
      answersAccepted: ['2', 'two', '2 apples', 'two apples'],
      answerTitle: 'Answer: 2 Apples',
      explanation: 'You picked up 2 apples, so you are holding 2 apples (while 1 apple remains on the table).',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="40" y="140" width="380" height="18" rx="8" fill="#d97706" />`;
        svg += `<rect x="70" y="158" width="16" height="35" rx="4" fill="#b45309" />`;
        svg += `<rect x="374" y="158" width="16" height="35" rx="4" fill="#b45309" />`;
        if (!isRevealed) {
          svg += `<text x="120" y="125" font-size="44" text-anchor="middle">🍎</text>`;
          svg += `<text x="230" y="125" font-size="44" text-anchor="middle">🍎</text>`;
          svg += `<text x="340" y="125" font-size="44" text-anchor="middle">🍎</text>`;
          svg += `<text x="230" y="55" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#1e293b" text-anchor="middle">3 apples on the table — you take 2</text>`;
        } else {
          svg += `<text x="120" y="125" font-size="44" text-anchor="middle">🍎</text>`;
          svg += `<text x="120" y="80" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#64748b" text-anchor="middle">Remaining on table: 1</text>`;
          svg += `<rect x="230" y="35" width="190" height="100" rx="14" fill="#ecfdf5" stroke="#10b981" stroke-width="2.5" />`;
          svg += `<text x="285" y="95" font-size="40" text-anchor="middle">🍎</text>`;
          svg += `<text x="365" y="95" font-size="40" text-anchor="middle">🍎</text>`;
          svg += `<text x="325" y="122" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">You hold: 2 apples</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 3: 2nd Place Runner
    {
      question: 'You are running in a track race and you pass the runner in 2nd place. What place are you in now?',
      answerRaw: '2nd',
      answersAccepted: ['2nd', '2', 'second', 'second place', '2nd place'],
      answerTitle: 'Answer: 2nd Place',
      explanation: 'By passing the runner in 2nd place, you take their position in 2nd place. The 1st-place runner is still ahead of you.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="20" y="40" width="420" height="120" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />`;
        svg += `<line x1="20" y1="80" x2="440" y2="80" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8,6" />`;
        svg += `<line x1="20" y1="120" x2="440" y2="120" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8,6" />`;
        svg += `<rect x="410" y="35" width="8" height="130" fill="#ef4444" />`;
        svg += `<text x="414" y="25" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#ef4444" text-anchor="middle">FINISH</text>`;

        if (!isRevealed) {
          svg += `<text x="340" y="70" font-size="28" text-anchor="middle">🏃</text>`;
          svg += `<rect x="320" y="20" width="42" height="18" rx="4" fill="#f59e0b" />`;
          svg += `<text x="341" y="33" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">1st</text>`;
          svg += `<text x="210" y="110" font-size="28" text-anchor="middle">🏃</text>`;
          svg += `<rect x="190" y="80" width="42" height="18" rx="4" fill="#64748b" />`;
          svg += `<text x="211" y="93" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">2nd</text>`;
          svg += `<text x="100" y="150" font-size="28" text-anchor="middle">🏃</text>`;
          svg += `<rect x="80" y="160" width="45" height="18" rx="4" fill="#2563eb" />`;
          svg += `<text x="102" y="173" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">YOU</text>`;
        } else {
          svg += `<text x="350" y="70" font-size="28" text-anchor="middle">🏃</text>`;
          svg += `<rect x="330" y="20" width="46" height="20" rx="4" fill="#f59e0b" />`;
          svg += `<text x="353" y="34" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">1st</text>`;
          svg += `<text x="230" y="110" font-size="30" text-anchor="middle">🏃</text>`;
          svg += `<rect x="195" y="72" width="70" height="22" rx="6" fill="#059669" />`;
          svg += `<text x="230" y="87" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">YOU: 2nd</text>`;
          svg += `<text x="90" y="150" font-size="28" text-anchor="middle">🏃</text>`;
          svg += `<rect x="68" y="160" width="46" height="20" rx="4" fill="#64748b" />`;
          svg += `<text x="91" y="174" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">3rd</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 4: Hens & Eggs Rate
    {
      question: 'If 3 hens lay 3 eggs in 3 days, how many eggs does 1 hen lay in 3 days?',
      answerRaw: '1',
      answersAccepted: ['1', 'one', '1 egg', 'one egg'],
      answerTitle: 'Answer: 1 Egg',
      explanation: 'Each hen lays 1 egg over the course of 3 days, so 3 hens together lay 3 eggs in 3 days.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        const hens = [
          { x: 80, label: 'Hen #1' },
          { x: 230, label: 'Hen #2' },
          { x: 380, label: 'Hen #3' }
        ];
        hens.forEach((h, idx) => {
          svg += `<rect x="${h.x - 55}" y="35" width="110" height="135" rx="14" fill="${isRevealed && idx === 0 ? '#ecfdf5' : '#ffffff'}" stroke="${isRevealed && idx === 0 ? '#10b981' : '#cbd5e1'}" stroke-width="${isRevealed && idx === 0 ? '2.5' : '1.5'}" />`;
          svg += `<text x="${h.x}" y="75" font-size="34" text-anchor="middle">🐔</text>`;
          svg += `<text x="${h.x}" y="105" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">${h.label}</text>`;
          if (isRevealed) {
            svg += `<text x="${h.x}" y="140" font-size="26" text-anchor="middle">🥚</text>`;
            svg += `<text x="${h.x}" y="160" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">1 egg / 3 days</text>`;
          } else {
            svg += `<text x="${h.x}" y="145" font-size="20" text-anchor="middle">🥚 ?</text>`;
          }
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 5: Place Value Riddle (62)
    {
      question: 'I am a 2-digit number between 50 and 70. My tens digit is 3 times my ones digit. What number am I?',
      answerRaw: '62',
      answersAccepted: ['62', 'sixty two', 'sixty-two'],
      answerTitle: 'Answer: 62',
      explanation: 'Between 50 and 70, the tens digit must be 6. Since 6 = 3 × 2, the ones digit is 2, making 62.',
      render: (isRevealed) => {
        if (!isRevealed) {
          return `
            <div class="logic-riddle-container">
              <div class="logic-tiles-row">
                <div style="text-align:center">
                  <span class="logic-tile">6</span>
                  <div style="font-size:0.8rem;font-weight:700;color:#64748b;margin-top:4px">TENS (50–70)</div>
                </div>
                <div style="text-align:center">
                  <span class="logic-tile">?</span>
                  <div style="font-size:0.8rem;font-weight:700;color:#64748b;margin-top:4px">ONES</div>
                </div>
              </div>
              <div class="logic-banner">Clue: Tens digit = 3 × Ones digit</div>
            </div>
          `;
        }
        return `
          <div class="logic-riddle-container">
            <div class="logic-tiles-row">
              <div style="text-align:center">
                <span class="logic-tile green-glow">6</span>
                <div style="font-size:0.8rem;font-weight:700;color:#047857;margin-top:4px">TENS</div>
              </div>
              <div style="text-align:center">
                <span class="logic-tile green-glow">2</span>
                <div style="font-size:0.8rem;font-weight:700;color:#047857;margin-top:4px">ONES</div>
              </div>
            </div>
            <div class="logic-banner highlight">6 = 3 × 2 → The number is 62</div>
          </div>
        `;
      }
    },

    // Problem 6: Feathers vs Rocks Weight
    {
      question: 'Which weighs more: 1 pound of feathers or 1 pound of rocks?',
      answerRaw: 'same',
      answersAccepted: ['same', 'equal', 'neither', 'both', 'they weigh the same', 'the same', 'they are the same', 'none'],
      answerTitle: 'Answer: They Weigh the Same (1 Pound Each)',
      explanation: 'Both weigh 1 pound (16 oz). Feathers take up more volume because they are less dense, but the total weight is equal.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<polygon points="230,120 215,160 245,160" fill="#475569" />`;
        svg += `<rect x="180" y="160" width="100" height="12" rx="4" fill="#334155" />`;
        svg += `<line x1="90" y1="120" x2="370" y2="120" stroke="#0284c7" stroke-width="5" stroke-linecap="round" />`;
        svg += `<line x1="90" y1="120" x2="90" y2="145" stroke="#94a3b8" stroke-width="2" />`;
        svg += `<ellipse cx="90" cy="148" rx="45" ry="8" fill="#cbd5e1" />`;
        svg += `<text x="90" y="135" font-size="26" text-anchor="middle">🪶🪶</text>`;
        svg += `<text x="90" y="175" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">1 LB FEATHERS</text>`;
        svg += `<line x1="370" y1="120" x2="370" y2="145" stroke="#94a3b8" stroke-width="2" />`;
        svg += `<ellipse cx="370" cy="148" rx="45" ry="8" fill="#cbd5e1" />`;
        svg += `<text x="370" y="135" font-size="26" text-anchor="middle">🪨🪨</text>`;
        svg += `<text x="370" y="175" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">1 LB ROCKS</text>`;

        if (isRevealed) {
          svg += `<rect x="165" y="45" width="130" height="32" rx="8" fill="#059669" />`;
          svg += `<text x="230" y="66" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">1 lb = 1 lb</text>`;
        } else {
          svg += `<text x="230" y="65" font-family="'Inter', sans-serif" font-size="26" font-weight="700" fill="#3730a3" text-anchor="middle">⚖️ ?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 7: Three Generations
    {
      question: 'Two fathers and two sons go fishing together. Each person catches 1 fish, and they bring home 3 fish in total. How is this possible?',
      answerRaw: '3',
      answersAccepted: ['3', 'three', '3 people', 'three people', 'grandfather'],
      answerTitle: 'Answer: There Are 3 People (3 Generations)',
      explanation: 'The group is a grandfather, his son (who is both a son and a father), and his grandson.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        const people = [
          { x: 90, title: 'Grandfather', sub: 'Father #1', icon: '👴' },
          { x: 230, title: 'Father / Son', sub: 'Father #2 & Son #1', icon: '👨' },
          { x: 370, title: 'Grandson', sub: 'Son #2', icon: '👦' }
        ];
        people.forEach(p => {
          svg += `<rect x="${p.x - 55}" y="35" width="110" height="135" rx="14" fill="#ffffff" stroke="${isRevealed ? '#10b981' : '#cbd5e1'}" stroke-width="2" />`;
          svg += `<text x="${p.x}" y="80" font-size="36" text-anchor="middle">${p.icon}</text>`;
          svg += `<text x="${p.x}" y="112" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0f172a" text-anchor="middle">${p.title}</text>`;
          if (isRevealed) {
            svg += `<text x="${p.x}" y="130" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#047857" text-anchor="middle">${p.sub}</text>`;
            svg += `<text x="${p.x}" y="156" font-size="20" text-anchor="middle">🐟</text>`;
          } else {
            svg += `<text x="${p.x}" y="145" font-size="18" text-anchor="middle">🐟 ?</text>`;
          }
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 8: Telephone Keypad Product
    {
      question: 'If you multiply all 10 digits on a standard telephone keypad together (1 × 2 × 3 × 4 × 5 × 6 × 7 × 8 × 9 × 0), what is the product?',
      answerRaw: '0',
      answersAccepted: ['0', 'zero'],
      answerTitle: 'Answer: 0',
      explanation: 'Because 0 is included in the multiplication chain, the entire product equals 0.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="140" y="15" width="180" height="175" rx="16" fill="#1e293b" />`;
        const keys = [
          { k: '1', x: 170, y: 45 }, { k: '2', x: 230, y: 45 }, { k: '3', x: 290, y: 45 },
          { k: '4', x: 170, y: 85 }, { k: '5', x: 230, y: 85 }, { k: '6', x: 290, y: 85 },
          { k: '7', x: 170, y: 125 }, { k: '8', x: 230, y: 125 }, { k: '9', x: 290, y: 125 },
          { k: '0', x: 230, y: 165 }
        ];
        keys.forEach(key => {
          const isZero = key.k === '0';
          const fill = isZero && isRevealed ? '#059669' : '#334155';
          svg += `<circle cx="${key.x}" cy="${key.y}" r="16" fill="${fill}" />`;
          svg += `<text x="${key.x}" y="${key.y + 5}" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">${key.k}</text>`;
        });
        if (isRevealed) {
          svg += `<rect x="335" y="70" width="110" height="58" rx="10" fill="#ecfdf5" stroke="#10b981" stroke-width="2" />`;
          svg += `<text x="390" y="94" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">ANY NUMBER × 0</text>`;
          svg += `<text x="390" y="116" font-family="'Inter', sans-serif" font-size="18" font-weight="800" fill="#047857" text-anchor="middle">= 0</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 9: Measurement & Coins
    {
      question: 'You have 2 U.S. coins that total 30 cents, and one of them is NOT a nickel. What are the two coins?',
      answerRaw: 'quarter and nickel',
      answersAccepted: ['quarter and nickel', 'a quarter and a nickel', 'quarter, nickel', '25 and 5', 'quarter'],
      answerTitle: 'Answer: A Quarter (25¢) and a Nickel (5¢)',
      explanation: 'One coin is not a nickel (it is a 25¢ quarter), while the other coin IS a nickel (5¢): 25¢ + 5¢ = 30¢.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="20" y="20" width="420" height="160" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />`;
        if (!isRevealed) {
          svg += `<circle cx="160" cy="95" r="42" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5" />`;
          svg += `<text x="160" y="102" font-family="'Inter', sans-serif" font-size="22" font-weight="800" fill="#334155" text-anchor="middle">? ¢</text>`;
          svg += `<text x="230" y="102" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="#64748b" text-anchor="middle">+</text>`;
          svg += `<circle cx="300" cy="95" r="34" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5" />`;
          svg += `<text x="300" y="102" font-family="'Inter', sans-serif" font-size="20" font-weight="800" fill="#334155" text-anchor="middle">? ¢</text>`;
          svg += `<text x="230" y="160" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#475569" text-anchor="middle">Total = 30¢ (One coin is not a nickel)</text>`;
        } else {
          svg += `<circle cx="155" cy="90" r="42" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5" />`;
          svg += `<text x="155" y="96" font-family="'Inter', sans-serif" font-size="18" font-weight="800" fill="#1e3a8a" text-anchor="middle">25¢</text>`;
          svg += `<text x="155" y="148" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#1e3a8a" text-anchor="middle">Quarter (Not a nickel)</text>`;
          svg += `<text x="230" y="96" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="#059669" text-anchor="middle">+</text>`;
          svg += `<circle cx="305" cy="90" r="34" fill="#d1fae5" stroke="#059669" stroke-width="2.5" />`;
          svg += `<text x="305" y="96" font-family="'Inter', sans-serif" font-size="17" font-weight="800" fill="#065f46" text-anchor="middle">5¢</text>`;
          svg += `<text x="305" y="148" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#065f46" text-anchor="middle">Nickel = 30¢ Total</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 10: Common Multiple of 3 and 4
    {
      question: 'I am a whole number less than 20. You land on me when counting by 3s, and you also land on me when counting by 4s. What number am I?',
      answerRaw: '12',
      answersAccepted: ['12', 'twelve'],
      answerTitle: 'Answer: 12',
      explanation: 'Multiples of 3 (< 20): 3, 6, 9, 12, 15, 18. Multiples of 4 (< 20): 4, 8, 12, 16. The common multiple is 12.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<text x="60" y="65" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#0284c7">By 3s:</text>`;
        [3, 6, 9, 12, 15, 18].forEach((n, idx) => {
          const x = 140 + idx * 52;
          const isMatch = n === 12;
          const fill = isRevealed && isMatch ? '#059669' : '#e0f2fe';
          const stroke = isRevealed && isMatch ? '#047857' : '#38bdf8';
          svg += `<circle cx="${x}" cy="60" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;
          svg += `<text x="${x}" y="65" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="${isRevealed && isMatch ? '#fff' : '#0369a1'}" text-anchor="middle">${n}</text>`;
        });

        svg += `<text x="60" y="135" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#d97706">By 4s:</text>`;
        [4, 8, 12, 16].forEach((n, idx) => {
          const x = 140 + idx * 65;
          const isMatch = n === 12;
          const fill = isRevealed && isMatch ? '#059669' : '#fef3c7';
          const stroke = isRevealed && isMatch ? '#047857' : '#f59e0b';
          svg += `<circle cx="${x}" cy="130" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;
          svg += `<text x="${x}" y="135" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="${isRevealed && isMatch ? '#fff' : '#b45309'}" text-anchor="middle">${n}</text>`;
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 11: Age Riddle
    {
      question: 'What always increases as time passes, and never goes backward or comes down?',
      answerRaw: 'age',
      answersAccepted: ['age', 'your age', 'my age', 'years', 'time'],
      answerTitle: 'Answer: Your Age',
      explanation: 'With each passing year, your age increases by 1 and never decreases.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<line x1="60" y1="150" x2="380" y2="50" stroke="#3730a3" stroke-width="5" stroke-linecap="round" />`;
        svg += `<polygon points="380,35 395,55 370,60" fill="#3730a3" />`;

        const steps = [
          { x: 100, y: 140, age: 'Year 6' },
          { x: 180, y: 115, age: 'Year 7' },
          { x: 260, y: 90, age: 'Year 8' },
          { x: 340, y: 65, age: 'Year 9+' }
        ];
        steps.forEach(s => {
          svg += `<circle cx="${s.x}" cy="${s.y}" r="11" fill="#ffffff" stroke="#3730a3" stroke-width="3" />`;
          svg += `<text x="${s.x}" y="${s.y + 24}" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">${s.age}</text>`;
        });

        if (isRevealed) {
          svg += `<rect x="175" y="18" width="110" height="28" rx="6" fill="#059669" />`;
          svg += `<text x="230" y="36" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">YOUR AGE</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 12: Carton of Eggs
    {
      question: 'There are 6 eggs in a carton. 6 people each take 1 egg, yet 1 egg is still inside the carton. How?',
      answerRaw: 'carton',
      answersAccepted: ['carton', 'the carton', 'box', 'the box', 'basket', 'last person', 'in the carton'],
      answerTitle: 'Answer: The 6th Person Took the Carton With the Egg Inside',
      explanation: 'Five people took individual eggs out, and the sixth person took the carton holding the last egg.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        for (let i = 0; i < 5; i++) {
          const x = 50 + i * 55;
          svg += `<circle cx="${x}" cy="80" r="18" fill="#e2e8f0" />`;
          svg += `<text x="${x}" y="85" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">#${i+1}</text>`;
          svg += `<text x="${x}" y="125" font-size="20" text-anchor="middle">🥚</text>`;
        }

        svg += `<circle cx="360" cy="80" r="18" fill="#dbeafe" stroke="#2563eb" stroke-width="2" />`;
        svg += `<text x="360" y="85" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">#6</text>`;
        if (isRevealed) {
          svg += `<rect x="325" y="105" width="70" height="42" rx="8" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />`;
          svg += `<text x="360" y="132" font-size="20" text-anchor="middle">🥚</text>`;
          svg += `<text x="360" y="165" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#c2410c" text-anchor="middle">Carton + Egg</text>`;
        } else {
          svg += `<rect x="325" y="105" width="70" height="42" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4" />`;
          svg += `<text x="360" y="132" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#64748b" text-anchor="middle">?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    }
  ];

  // ========================================================
  // TRACK 2: VISUAL & SPATIAL (10 CURATED NUMBERED PROBLEMS)
  // ========================================================
  const SHAPES = [
    { name: 'Circle', color: '#2563eb', draw: (x, y) => `<circle cx="${x}" cy="${y}" r="22" fill="#2563eb" />` },
    { name: 'Square', color: '#db2777', draw: (x, y) => `<rect x="${x-20}" y="${y-20}" width="40" height="40" rx="6" fill="#db2777" />` },
    { name: 'Triangle', color: '#d97706', draw: (x, y) => `<polygon points="${x},${y-24} ${x-22},${y+18} ${x+22},${y+18}" fill="#d97706" />` }
  ];

  const ARROWS = [
    { name: 'Up', deg: 0 },
    { name: 'Right', deg: 90 },
    { name: 'Down', deg: 180 },
    { name: 'Left', deg: 270 }
  ];

  const VISUAL_SLIDES = [
    // Problem 1: Shape Pattern Sequence
    {
      question: 'What shape comes next in this repeating sequence?',
      answerRaw: 'triangle',
      answersAccepted: ['triangle', 'a triangle'],
      answerTitle: 'Answer: Triangle',
      explanation: 'The three-shape unit repeats: Circle, Square, Triangle.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 120" width="100%" height="120" xmlns="http://www.w3.org/2000/svg">`;
        const seq = [SHAPES[0], SHAPES[1], SHAPES[2], SHAPES[0], SHAPES[1], SHAPES[2]];
        seq.forEach((item, idx) => {
          const x = 38 + idx * 76;
          const y = 60;
          svg += `<rect x="${x-30}" y="15" width="60" height="90" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
          if (idx === 5) {
            if (isRevealed) {
              svg += item.draw(x, y);
              svg += `<circle cx="${x}" cy="${y}" r="26" fill="none" stroke="#059669" stroke-width="2.5" stroke-dasharray="4,4" />`;
            } else {
              svg += `<text x="${x}" y="${y+10}" font-family="'Inter', sans-serif" font-size="30" font-weight="700" fill="#3730a3" text-anchor="middle">?</text>`;
            }
          } else {
            svg += item.draw(x, y);
          }
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 2: 3D Cube Stack (2x2 with 2 on top)
    {
      question: 'How many unit cubes are in this stack, including the hidden corner cube on the bottom layer?',
      answerRaw: '6',
      answersAccepted: ['6', 'six', '6 cubes'],
      answerTitle: 'Answer: 6 Cubes',
      explanation: 'There are 4 cubes forming the 2×2 bottom layer and 2 cubes on the top layer: 4 + 2 = 6 cubes.',
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

    // Problem 3: Butterfly Mirror Symmetry
    {
      question: 'When the left wing is reflected across the vertical line of symmetry, what complete shape is formed?',
      answerRaw: 'butterfly',
      answersAccepted: ['butterfly', 'wings', 'wing'],
      answerTitle: 'Answer: Symmetrical Butterfly',
      explanation: 'Reflecting across the vertical axis produces a matching right wing.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 230" width="100%" height="230" xmlns="http://www.w3.org/2000/svg">`;
        const pathLeft = 'M230,50 C180,30 130,50 140,90 C145,115 190,115 230,125 C170,140 160,185 190,195 C215,200 225,160 230,145';
        const pathRight = 'M230,50 C280,30 330,50 320,90 C315,115 270,115 230,125 C290,140 300,185 270,195 C245,200 235,160 230,145';
        svg += `<path d="${pathLeft}" fill="#fbcfe8" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round" />`;
        svg += `<line x1="230" y1="20" x2="230" y2="215" stroke="#6d28d9" stroke-width="2.5" stroke-dasharray="6,6" />`;
        svg += `<rect x="180" y="8" width="100" height="20" rx="5" fill="#6d28d9" />`;
        svg += `<text x="230" y="22" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">SYMMETRY LINE</text>`;
        if (isRevealed) {
          svg += `<path d="${pathRight}" fill="#fbcfe8" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round" />`;
        } else {
          svg += `<rect x="250" y="65" width="120" height="110" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,6" />`;
          svg += `<text x="310" y="130" font-family="'Inter', sans-serif" font-size="36" font-weight="700" fill="#94a3b8" text-anchor="middle">?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 4: Overlapping Triangles Count
    {
      question: 'How many triangles of any size can you find in this figure?',
      answerRaw: '5',
      answersAccepted: ['5', 'five', '5 triangles'],
      answerTitle: 'Answer: 5 Triangles',
      explanation: 'There are 4 small interior triangles plus 1 large outer triangle: 4 + 1 = 5.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<polygon points="230,25 130,185 330,185" fill="#eff6ff" stroke="#2563eb" stroke-width="3.5" stroke-linejoin="round" />`;
        svg += `<line x1="180" y1="105" x2="280" y2="105" stroke="#2563eb" stroke-width="2.5" />`;
        svg += `<line x1="180" y1="105" x2="230" y2="185" stroke="#2563eb" stroke-width="2.5" />`;
        svg += `<line x1="280" y1="105" x2="230" y2="185" stroke="#2563eb" stroke-width="2.5" />`;
        if (isRevealed) {
          svg += `<circle cx="230" cy="80" r="13" fill="#059669" /><text x="230" y="85" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">1</text>`;
          svg += `<circle cx="180" cy="160" r="13" fill="#059669" /><text x="180" y="165" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">2</text>`;
          svg += `<circle cx="230" cy="145" r="13" fill="#059669" /><text x="230" y="150" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">3</text>`;
          svg += `<circle cx="280" cy="160" r="13" fill="#059669" /><text x="280" y="165" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">4</text>`;
          svg += `<rect x="330" y="40" width="115" height="28" rx="6" fill="#1e293b" />`;
          svg += `<text x="387" y="58" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">+ 1 Outer = 5</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 5: Rotating Clockwise Arrow
    {
      question: 'Which direction does the 4th arrow point in this rotation sequence?',
      answerRaw: 'left',
      answersAccepted: ['left', 'pointing left', 'west'],
      answerTitle: 'Answer: Left',
      explanation: 'Each step rotates the arrow 90° clockwise: Up → Right → Down → Left.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 120" width="100%" height="120" xmlns="http://www.w3.org/2000/svg">`;
        const seq = [ARROWS[0], ARROWS[1], ARROWS[2], ARROWS[3]];
        seq.forEach((arrow, idx) => {
          const x = 65 + idx * 110;
          const y = 60;
          svg += `<rect x="${x-40}" y="15" width="80" height="90" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
          if (idx === 3 && !isRevealed) {
            svg += `<text x="${x}" y="${y+10}" font-family="'Inter', sans-serif" font-size="30" font-weight="700" fill="#3730a3" text-anchor="middle">?</text>`;
          } else {
            svg += `<g transform="translate(${x}, ${y}) rotate(${arrow.deg})">`;
            svg += `<line x1="0" y1="20" x2="0" y2="-15" stroke="${idx === 3 ? '#059669' : '#3730a3'}" stroke-width="5" stroke-linecap="round" />`;
            svg += `<polygon points="0,-24 -10,-10 10,-10" fill="${idx === 3 ? '#059669' : '#3730a3'}" />`;
            svg += `</g>`;
          }
        });
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 6: 3D Staircase Block Count
    {
      question: 'How many blocks make up this 3-step staircase?',
      answerRaw: '6',
      answersAccepted: ['6', 'six', '6 blocks', '6 cubes'],
      answerTitle: 'Answer: 6 Blocks',
      explanation: 'Columns from right to left have heights of 1, 2, and 3 blocks: 1 + 2 + 3 = 6 blocks.',
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

    // Problem 7: Heart Symmetry Line
    {
      question: 'When the left curve is reflected across the line of symmetry, what shape is completed?',
      answerRaw: 'heart',
      answersAccepted: ['heart', 'a heart'],
      answerTitle: 'Answer: A Heart',
      explanation: 'Both halves are mirror images across the central vertical axis.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 460 230" width="100%" height="230" xmlns="http://www.w3.org/2000/svg">`;
        const pathLeft = 'M230,80 C230,40 160,40 160,95 C160,145 230,190 230,200';
        const pathRight = 'M230,80 C230,40 300,40 300,95 C300,145 230,190 230,200';
        svg += `<path d="${pathLeft}" fill="#fecaca" stroke="#dc2626" stroke-width="3.5" stroke-linejoin="round" />`;
        svg += `<line x1="230" y1="20" x2="230" y2="215" stroke="#6d28d9" stroke-width="2.5" stroke-dasharray="6,6" />`;
        svg += `<rect x="180" y="8" width="100" height="20" rx="5" fill="#6d28d9" />`;
        svg += `<text x="230" y="22" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">SYMMETRY LINE</text>`;
        if (isRevealed) {
          svg += `<path d="${pathRight}" fill="#fecaca" stroke="#dc2626" stroke-width="3.5" stroke-linejoin="round" />`;
        } else {
          svg += `<rect x="250" y="65" width="120" height="110" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,6" />`;
          svg += `<text x="310" y="130" font-family="'Inter', sans-serif" font-size="36" font-weight="700" fill="#94a3b8" text-anchor="middle">?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 8: Top View Orthographic Grid
    {
      question: 'Looking straight down from directly above this 5-cube stack, how many top square faces are visible?',
      answerRaw: '4',
      answersAccepted: ['4', 'four', '4 squares'],
      answerTitle: 'Answer: 4 Squares (2×2 Footprint)',
      explanation: 'From directly above, the stack projects onto a 2×2 grid of 4 squares because the 5th cube sits directly over one of the base cubes.',
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
        svg += `<text x="140" y="30" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">Top-Down View ⬇</text>`;
        if (isRevealed) {
          svg += `<rect x="270" y="45" width="120" height="120" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
          svg += `<text x="330" y="35" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#2563eb" text-anchor="middle">TOP VIEW (4 SQUARES)</text>`;
          const cellSize = 36;
          for (let gy = 0; gy < 2; gy++) {
            for (let gx = 0; gx < 2; gx++) {
              const cx = 294 + gx * cellSize;
              const cy = 65 + gy * cellSize;
              svg += `<rect x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" rx="4" fill="#059669" stroke="#047857" stroke-width="1.5" />`;
            }
          }
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 9: Paper Fold & Punch
    {
      question: 'A square sheet of paper is folded in half once, and 1 hole is punched through both layers. How many holes appear when it is unfolded?',
      answerRaw: '2',
      answersAccepted: ['2', 'two', '2 holes'],
      answerTitle: 'Answer: 2 Holes',
      explanation: 'Folding the sheet in half creates 2 layers of paper, so a single punch pierces 2 symmetrical holes.',
      render: (isRevealed) => {
        let svg = `<svg viewBox="0 0 380 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="60" y="40" width="100" height="120" rx="6" fill="#f8fafc" stroke="#3730a3" stroke-width="2.5" />`;
        svg += `<line x1="60" y1="40" x2="60" y2="160" stroke="#6d28d9" stroke-width="3.5" stroke-dasharray="5,4" />`;
        svg += `<circle cx="120" cy="100" r="10" fill="#dc2626" />`;
        svg += `<text x="110" y="180" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">Folded in Half</text>`;
        svg += `<text x="190" y="105" font-size="20" text-anchor="middle">→</text>`;
        if (isRevealed) {
          svg += `<rect x="220" y="40" width="140" height="120" rx="6" fill="#f1f5f9" stroke="#059669" stroke-width="2.5" />`;
          svg += `<line x1="290" y1="40" x2="290" y2="160" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4" />`;
          svg += `<circle cx="260" cy="100" r="10" fill="#dc2626" />`;
          svg += `<circle cx="320" cy="100" r="10" fill="#dc2626" />`;
          svg += `<text x="290" y="180" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Unfolded: 2 Holes</text>`;
        } else {
          svg += `<rect x="220" y="40" width="140" height="120" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5,5" />`;
          svg += `<text x="290" y="110" font-family="'Inter', sans-serif" font-size="32" font-weight="700" fill="#94a3b8" text-anchor="middle">?</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    },

    // Problem 10: 3D Cube Net
    {
      question: 'Can this 6-square cross-shaped net fold along its edges to form a closed 3D cube without overlapping?',
      answerRaw: 'yes',
      answersAccepted: ['yes', 'y', 'true'],
      answerTitle: 'Answer: Yes',
      explanation: 'This is the standard cross net of a cube: 4 squares form the sides, while the top and bottom squares fold to close the top and base.',
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
          svg += `<rect x="${px}" y="${py}" width="${size}" height="${size}" rx="4" fill="#eef2ff" stroke="#3730a3" stroke-width="2" />`;
          svg += `<text x="${px + size/2}" y="${py + size/2 + 4}" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#3730a3" text-anchor="middle">${idx + 1}</text>`;
        });
        if (isRevealed) {
          svg += `<circle cx="310" cy="100" r="24" fill="#059669" />`;
          svg += `<path d="M300,100 L307,107 L321,93" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" />`;
          svg += `<text x="310" y="142" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">FOLDS INTO CUBE</text>`;
        }
        svg += `</svg>`;
        return svg;
      }
    }
  ];

  // ========================================================
  // TRACK 3: 3D GEOMETRY (6 CURATED NUMBERED PROBLEMS)
  // ========================================================
  const MENTAL_3D_SLIDES = [
    // Problem 1: Cube Edges
    {
      question: 'How many straight edges does a 3D cube have in total?',
      answerRaw: '12',
      answersAccepted: ['12', 'twelve', '12 edges'],
      answerTitle: 'Answer: 12 Edges',
      explanation: 'A cube has 4 top edges, 4 bottom edges, and 4 vertical side edges: 4 + 4 + 4 = 12 edges.',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Visualize a cube: count its top edges, bottom edges, and vertical edges.");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <line x1="120" y1="65" x2="120" y2="155" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="4,4" />
            <line x1="120" y1="155" x2="200" y2="155" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="4,4" />
            <line x1="80" y1="185" x2="120" y2="155" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="4,4" />
            <line x1="80" y1="95" x2="160" y2="95" stroke="#2563eb" stroke-width="4" stroke-linecap="round" />
            <line x1="160" y1="95" x2="200" y2="65" stroke="#2563eb" stroke-width="4" stroke-linecap="round" />
            <line x1="200" y1="65" x2="120" y2="65" stroke="#2563eb" stroke-width="4" stroke-linecap="round" />
            <line x1="120" y1="65" x2="80" y2="95" stroke="#2563eb" stroke-width="4" stroke-linecap="round" />
            <line x1="80" y1="95" x2="80" y2="185" stroke="#ea580c" stroke-width="4" stroke-linecap="round" />
            <line x1="160" y1="95" x2="160" y2="185" stroke="#ea580c" stroke-width="4" stroke-linecap="round" />
            <line x1="200" y1="65" x2="200" y2="155" stroke="#ea580c" stroke-width="4" stroke-linecap="round" />
            <line x1="80" y1="185" x2="160" y2="185" stroke="#6d28d9" stroke-width="4" stroke-linecap="round" />
            <line x1="160" y1="185" x2="200" y2="155" stroke="#6d28d9" stroke-width="4" stroke-linecap="round" />
            <rect x="235" y="45" width="105" height="26" rx="6" fill="#2563eb" />
            <text x="287" y="62" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4 Top Edges</text>
            <rect x="235" y="85" width="105" height="26" rx="6" fill="#ea580c" />
            <text x="287" y="102" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4 Vertical Edges</text>
            <rect x="235" y="125" width="105" height="26" rx="6" fill="#6d28d9" />
            <text x="287" y="142" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4 Base Edges</text>
          </svg>
        `;
      }
    },

    // Problem 2: Square Pyramid Vertices
    {
      question: 'How many vertices (corners) does a square-based pyramid have?',
      answerRaw: '5',
      answersAccepted: ['5', 'five', '5 corners', '5 vertices'],
      answerTitle: 'Answer: 5 Vertices',
      explanation: 'There are 4 corners around the square base plus 1 apex at the top: 4 + 1 = 5 vertices.',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Count the corners on the square base plus the top point.");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,165 240,165 280,125 140,125" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
            <polygon points="190,35 100,165 240,165" fill="rgba(245, 158, 11, 0.35)" stroke="#b45309" stroke-width="2" />
            <polygon points="190,35 240,165 280,125" fill="rgba(217, 119, 6, 0.35)" stroke="#b45309" stroke-width="2" />
            <circle cx="190" cy="35" r="11" fill="#dc2626" stroke="#ffffff" stroke-width="2" />
            <text x="190" y="39" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">1</text>
            <circle cx="100" cy="165" r="11" fill="#059669" stroke="#ffffff" stroke-width="2" />
            <text x="100" y="169" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">2</text>
            <circle cx="240" cy="165" r="11" fill="#059669" stroke="#ffffff" stroke-width="2" />
            <text x="240" y="169" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">3</text>
            <circle cx="280" cy="125" r="11" fill="#059669" stroke="#ffffff" stroke-width="2" />
            <text x="280" y="129" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4</text>
            <circle cx="140" cy="125" r="11" fill="#059669" stroke="#ffffff" stroke-width="2" />
            <text x="140" y="129" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">5</text>
          </svg>
        `;
      }
    },

    // Problem 3: Cylinder Flat Faces
    {
      question: 'How many flat circular faces does a cylinder have?',
      answerRaw: '2',
      answersAccepted: ['2', 'two', '2 faces'],
      answerTitle: 'Answer: 2 Flat Circular Faces',
      explanation: 'A cylinder has 2 flat circular bases (top and bottom) connected by 1 curved lateral surface.',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Visualize a closed cylinder: how many flat circular ends does it have?");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect x="130" y="65" width="100" height="90" fill="#bfdbfe" />
            <line x1="130" y1="65" x2="130" y2="155" stroke="#2563eb" stroke-width="2.5" />
            <line x1="230" y1="65" x2="230" y2="155" stroke="#2563eb" stroke-width="2.5" />
            <ellipse cx="180" cy="155" rx="50" ry="20" fill="#059669" stroke="#047857" stroke-width="2.5" />
            <ellipse cx="180" cy="65" rx="50" ry="20" fill="#059669" stroke="#047857" stroke-width="2.5" />
            <rect x="250" y="52" width="95" height="26" rx="6" fill="#059669" />
            <text x="297" y="69" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Top Face #1</text>
            <rect x="250" y="142" width="95" height="26" rx="6" fill="#059669" />
            <text x="297" y="159" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Bottom Face #2</text>
          </svg>
        `;
      }
    },

    // Problem 4: Cone Cross Section
    {
      question: 'If you slice a cone horizontally, parallel to its flat base, what 2D shape is the cross-section?',
      answerRaw: 'circle',
      answersAccepted: ['circle', 'a circle'],
      answerTitle: 'Answer: A Circle',
      explanation: 'Any horizontal cross-section of a right circular cone parallel to its base is a circle.',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Imagine slicing a cone straight across parallel to its circular base.");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="180" cy="175" rx="70" ry="22" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5" />
            <polygon points="180,35 110,175 250,175" fill="#ffedd5" />
            <ellipse cx="180" cy="115" rx="42" ry="14" fill="#059669" stroke="#047857" stroke-width="3" />
            <polygon points="180,35 138,115 222,115" fill="rgba(251, 146, 60, 0.45)" stroke="#ea580c" stroke-width="2" stroke-dasharray="3,3" />
            <text x="180" y="119" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">CROSS-SECTION: CIRCLE</text>
          </svg>
        `;
      }
    },

    // Problem 5: Triangular Prism Vertices
    {
      question: 'How many vertices (corners) does a triangular prism have?',
      answerRaw: '6',
      answersAccepted: ['6', 'six', '6 corners', '6 vertices'],
      answerTitle: 'Answer: 6 Vertices',
      explanation: 'A triangular prism has 3 vertices on the front triangular face and 3 on the back triangular face: 3 + 3 = 6.',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Visualize a prism with a triangle at the front and a triangle at the back.");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <polygon points="260,65 210,165 310,165" fill="#e0e7ff" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,4" />
            <line x1="120" y1="65" x2="260" y2="65" stroke="#3730a3" stroke-width="2.5" />
            <line x1="70" y1="165" x2="210" y2="165" stroke="#3730a3" stroke-width="2.5" />
            <line x1="170" y1="165" x2="310" y2="165" stroke="#3730a3" stroke-width="2.5" />
            <polygon points="120,65 70,165 170,165" fill="rgba(199, 210, 254, 0.6)" stroke="#3730a3" stroke-width="3" />
            <circle cx="120" cy="65" r="11" fill="#059669" stroke="#fff" stroke-width="2" />
            <text x="120" y="69" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">1</text>
            <circle cx="70" cy="165" r="11" fill="#059669" stroke="#fff" stroke-width="2" />
            <text x="70" y="169" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">2</text>
            <circle cx="170" cy="165" r="11" fill="#059669" stroke="#fff" stroke-width="2" />
            <text x="170" y="169" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">3</text>
            <circle cx="260" cy="65" r="11" fill="#059669" stroke="#fff" stroke-width="2" />
            <text x="260" y="69" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4</text>
            <circle cx="210" cy="165" r="11" fill="#059669" stroke="#fff" stroke-width="2" />
            <text x="210" y="169" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">5</text>
            <circle cx="310" cy="165" r="11" fill="#059669" stroke="#fff" stroke-width="2" />
            <text x="310" y="169" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">6</text>
          </svg>
        `;
      }
    },

    // Problem 6: Rectangular Prism Faces
    {
      question: 'How many flat rectangular faces does a rectangular prism (box) have?',
      answerRaw: '6',
      answersAccepted: ['6', 'six', '6 faces'],
      answerTitle: 'Answer: 6 Faces',
      explanation: 'A rectangular prism has 6 faces: Top, Bottom, Front, Back, Left, and Right.',
      render: (isRevealed) => {
        if (!isRevealed) {
          return renderThoughtBubble("Count the top, bottom, front, back, left, and right sides of a closed rectangular box.");
        }
        return `
          <svg viewBox="0 0 360 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <polygon points="80,105 200,105 260,65 140,65" fill="#fde68a" stroke="#d97706" stroke-width="2" />
            <polygon points="80,105 200,105 200,175 80,175" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
            <polygon points="200,105 260,65 260,135 200,175" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
            <text x="170" y="88" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#b45309" text-anchor="middle">1. TOP</text>
            <text x="140" y="145" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#b45309" text-anchor="middle">2. FRONT</text>
            <text x="230" y="130" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#c2410c" text-anchor="middle">3. RIGHT</text>
            <rect x="265" y="45" width="85" height="110" rx="8" fill="#059669" />
            <text x="307" y="65" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">+ 4. BOTTOM</text>
            <text x="307" y="85" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">+ 5. LEFT</text>
            <text x="307" y="105" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">+ 6. BACK</text>
            <text x="307" y="135" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#fef08a" text-anchor="middle">= 6 FACES</text>
          </svg>
        `;
      }
    }
  ];


// Global Exports
(typeof window !== "undefined" ? window : global).drawIsoCube = drawIsoCube;
(typeof window !== "undefined" ? window : global).renderThoughtBubble = renderThoughtBubble;
(typeof window !== "undefined" ? window : global).LOGIC_SLIDES = LOGIC_SLIDES;
(typeof window !== "undefined" ? window : global).SHAPES = SHAPES;
(typeof window !== "undefined" ? window : global).ARROWS = ARROWS;
(typeof window !== "undefined" ? window : global).VISUAL_SLIDES = VISUAL_SLIDES;
(typeof window !== "undefined" ? window : global).MENTAL_3D_SLIDES = MENTAL_3D_SLIDES;
