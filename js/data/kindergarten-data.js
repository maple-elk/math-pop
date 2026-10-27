  // KINDERGARTEN MODULE (4 TRACKS × 12 NUMBERED PROBLEMS = 48)
  // ========================================================
  function drawTenFrameSVG(filledCount, highlightRemaining = false, secondColorCount = 0) {
    let svg = `<svg viewBox="0 0 460 190" width="100%" height="190" xmlns="http://www.w3.org/2000/svg">`;
    const startX = 80;
    const startY = 25;
    const cellW = 60;
    const cellH = 60;

    svg += `<rect x="${startX}" y="${startY}" width="${cellW * 5}" height="${cellH * 2}" rx="8" fill="#ffffff" stroke="#334155" stroke-width="3" />`;
    for (let c = 1; c < 5; c++) {
      svg += `<line x1="${startX + c * cellW}" y1="${startY}" x2="${startX + c * cellW}" y2="${startY + cellH * 2}" stroke="#334155" stroke-width="2" />`;
    }
    svg += `<line x1="${startX}" y1="${startY + cellH}" x2="${startX + cellW * 5}" y2="${startY + cellH}" stroke="#334155" stroke-width="2" />`;

    for (let i = 0; i < 10; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const cx = startX + col * cellW + cellW / 2;
      const cy = startY + row * cellH + cellH / 2;

      if (i < filledCount) {
        svg += `<circle cx="${cx}" cy="${cy}" r="20" fill="#ef4444" />`;
        svg += `<text x="${cx}" y="${cy + 5}" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
      } else if (secondColorCount > 0 && i < filledCount + secondColorCount) {
        svg += `<circle cx="${cx}" cy="${cy}" r="20" fill="#3b82f6" />`;
        svg += `<text x="${cx}" y="${cy + 5}" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
      } else if (highlightRemaining) {
        const remNum = i - filledCount + 1;
        svg += `<circle cx="${cx}" cy="${cy}" r="20" fill="#d1fae5" stroke="#059669" stroke-width="2.5" stroke-dasharray="4,3" />`;
        svg += `<text x="${cx}" y="${cy + 5}" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">+${remNum}</text>`;
      }
    }
    svg += `</svg>`;
    return svg;
  }

  const KINDERGARTEN_SLIDES = {
    // --------------------------------------------------------
    // TRACK 1: COUNTING & NUMBER BONDS (12 Numbered Problems)
    // --------------------------------------------------------
    math: [
      {
        question: 'Look at the 10-frame. There are 6 red dots. How many empty boxes are left to make 10?',
        answerRaw: '4',
        answersAccepted: ['4', 'four'],
        answerTitle: 'Answer: 4 More to Make 10',
        explanation: 'A 10-frame has 10 spaces in total. With 6 filled, 4 spaces remain empty (6 + 4 = 10).',
        render: (isRevealed) => drawTenFrameSVG(6, isRevealed, 0)
      },
      {
        question: 'There are 7 red dots in the 10-frame. How many more dots do you need to make 10?',
        answerRaw: '3',
        answersAccepted: ['3', 'three'],
        answerTitle: 'Answer: 3 More to Make 10',
        explanation: '7 filled spaces plus 3 empty spaces equals 10 (7 + 3 = 10).',
        render: (isRevealed) => drawTenFrameSVG(7, isRevealed, 0)
      },
      {
        question: 'Look at the 10-frame: 5 red dots on the top row and 2 blue dots on the bottom row. How many dots are there in all?',
        answerRaw: '7',
        answersAccepted: ['7', 'seven'],
        answerTitle: 'Answer: 7 Dots (5 + 2 = 7)',
        explanation: 'Start at 5 for the full top row and count on 2 more: 6, 7.',
        render: () => drawTenFrameSVG(5, false, 2)
      },
      {
        question: '3 ladybugs are sitting on a leaf, and 2 more fly over. How many ladybugs are there altogether?',
        answerRaw: '5',
        answersAccepted: ['5', 'five'],
        answerTitle: 'Answer: 5 Ladybugs (3 + 2 = 5)',
        explanation: 'Combining a group of 3 and a group of 2 gives 5 in all.',
        render: (isRevealed) => renderPreschoolOneMore('🐞', 3, 2, isRevealed)
      },
      {
        question: '5 frogs are on a log. 2 frogs jump into the water. How many frogs are still on the log?',
        answerRaw: '3',
        answersAccepted: ['3', 'three'],
        answerTitle: 'Answer: 3 Frogs Left (5 − 2 = 3)',
        explanation: 'Starting with 5 and taking away 2 leaves 3 frogs on the log.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="45" y="105" width="370" height="26" rx="10" fill="#92400e" />`;
          for (let i = 0; i < 5; i++) {
            const cx = 95 + i * 68;
            const jumped = i >= 3;
            svg += `<text x="${cx}" y="95" font-size="36" opacity="${jumped && isRevealed ? '0.3' : '1'}" text-anchor="middle">🐸</text>`;
            if (jumped) {
              svg += `<line x1="${cx - 16}" y1="68" x2="${cx + 16}" y2="100" stroke="#ef4444" stroke-width="3.5" />`;
            } else if (isRevealed) {
              svg += `<circle cx="${cx}" cy="145" r="11" fill="#059669" />`;
              svg += `<text x="${cx}" y="149" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
            }
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Count by 2s with these pairs of cherries: 2, 4, 6, [?]. What number comes next?',
        answerRaw: '8',
        answersAccepted: ['8', 'eight'],
        answerTitle: 'Answer: 8 Cherries',
        explanation: 'Four pairs of 2 make 8: 2, 4, 6, 8.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🍒', label: '2' },
            { icon: '🍒', label: '4' },
            { icon: '🍒', label: '6' },
            { icon: '🍒', label: isRevealed ? '8' : '?' }
          ], -1, isRevealed);
        }
      },
      {
        question: 'Look at the two groups of stars: 7 stars on the left and 5 stars on the right. Which number is GREATER (7 or 5)?',
        answerRaw: '7',
        answersAccepted: ['7', 'seven', 'left', 'box a', 'a'],
        answerTitle: 'Answer: 7 is Greater than 5',
        explanation: '7 comes after 5 when counting, so 7 is greater than 5 (7 > 5).',
        render: (isRevealed) => renderPreschoolCompareBoxes('⭐', 7, 5, 'MORE', isRevealed)
      },
      {
        question: 'Look at the two dice: 4 dots on the first die and 4 dots on the second die. What is the double 4 + 4?',
        answerRaw: '8',
        answersAccepted: ['8', 'eight'],
        answerTitle: 'Answer: 8 (4 + 4 = 8)',
        explanation: 'Doubling 4 gives 8 dots in total.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          const drawDie4 = (x) => {
            svg += `<rect x="${x}" y="35" width="90" height="90" rx="14" fill="#ffffff" stroke="#1e293b" stroke-width="3" />`;
            [[-22, -22], [22, -22], [-22, 22], [22, 22]].forEach(([dx, dy]) => {
              svg += `<circle cx="${x + 45 + dx}" cy="${80 + dy}" r="8" fill="#1e293b" />`;
            });
          };
          drawDie4(105);
          svg += `<text x="230" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="800" fill="#334155" text-anchor="middle">+</text>`;
          drawDie4(265);
          if (isRevealed) {
            svg += `<text x="230" y="152" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#047857" text-anchor="middle">4 + 4 = 8</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'What number comes right BEFORE 10 when you count backward: 10, [?], 8, 7?',
        answerRaw: '9',
        answersAccepted: ['9', 'nine'],
        answerTitle: 'Answer: 9',
        explanation: 'One less than 10 is 9.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🔟', label: '10' },
            { icon: '9️⃣', label: '9' },
            { icon: '8️⃣', label: '8' },
            { icon: '7️⃣', label: '7' }
          ], 1, isRevealed);
        }
      },
      {
        question: 'Look at this teen number: 1 full 10-frame (10) plus 3 extra dots. What number is 10 + 3?',
        answerRaw: '13',
        answersAccepted: ['13', 'thirteen'],
        answerTitle: 'Answer: 13 (10 + 3 = 13)',
        explanation: '1 group of ten and 3 ones makes thirteen (13).',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="45" y="35" width="200" height="85" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5" />`;
          svg += `<text x="145" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#1d4ed8" text-anchor="middle">10 Dots</text>`;
          svg += `<text x="275" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#334155" text-anchor="middle">+</text>`;
          svg += `<rect x="305" y="35" width="110" height="85" rx="10" fill="#ecfdf5" stroke="#059669" stroke-width="2.5" />`;
          svg += `<text x="360" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#047857" text-anchor="middle">3 Dots</text>`;
          if (isRevealed) {
            svg += `<text x="230" y="148" font-family="'Inter', sans-serif" font-size="15" font-weight="800" fill="#047857" text-anchor="middle">10 + 3 = 13</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Share 6 strawberries equally between 2 plates. How many strawberries go on each plate?',
        answerRaw: '3',
        answersAccepted: ['3', 'three'],
        answerTitle: 'Answer: 3 Strawberries on Each Plate',
        explanation: '3 strawberries on the left plate and 3 on the right plate make 6 in all (3 + 3 = 6).',
        render: (isRevealed) => renderPreschoolCompareBoxes('🍓', 3, 3, 'MORE', isRevealed)
      },
      {
        question: 'Count by 5s using hands (5 fingers on each hand): 5, 10, [?]. How many fingers are on 3 hands?',
        answerRaw: '15',
        answersAccepted: ['15', 'fifteen'],
        answerTitle: 'Answer: 15 Fingers',
        explanation: 'Counting by 5s three times goes: 5, 10, 15.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🖐️', label: '5' },
            { icon: '🖐️', label: '10' },
            { icon: '🖐️', label: '15' }
          ], 2, isRevealed);
        }
      }
    ],

    // --------------------------------------------------------
    // TRACK 2: EVERYDAY QUESTIONS (12 Numbered Problems)
    // --------------------------------------------------------
    questions: [
      {
        question: 'If you mix Red paint and Yellow paint together, what new color do you make?',
        answerRaw: 'orange',
        answersAccepted: ['orange'],
        answerTitle: 'Answer: Orange',
        explanation: 'Red and Yellow are primary colors that blend together to make Orange.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 160" width="100%" height="160" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<circle cx="115" cy="80" r="36" fill="#ef4444" /><text x="115" y="138" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">Red</text>`;
          svg += `<text x="180" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#475569" text-anchor="middle">+</text>`;
          svg += `<circle cx="245" cy="80" r="36" fill="#eab308" /><text x="245" y="138" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">Yellow</text>`;
          svg += `<text x="310" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#475569" text-anchor="middle">=</text>`;
          svg += `<circle cx="375" cy="80" r="36" fill="${isRevealed ? '#f97316' : '#e2e8f0'}" stroke="#cbd5e1" stroke-width="2" />`;
          svg += `<text x="375" y="${isRevealed ? '138' : '88'}" font-family="'Inter', sans-serif" font-size="${isRevealed ? '12' : '24'}" font-weight="700" fill="#334155" text-anchor="middle">${isRevealed ? 'Orange' : '?'}</text>`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'If you mix Blue paint and Yellow paint together, what new color do you make?',
        answerRaw: 'green',
        answersAccepted: ['green'],
        answerTitle: 'Answer: Green',
        explanation: 'Blue and Yellow mix together to create Green.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 160" width="100%" height="160" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<circle cx="115" cy="80" r="36" fill="#2563eb" /><text x="115" y="138" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">Blue</text>`;
          svg += `<text x="180" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#475569" text-anchor="middle">+</text>`;
          svg += `<circle cx="245" cy="80" r="36" fill="#eab308" /><text x="245" y="138" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">Yellow</text>`;
          svg += `<text x="310" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#475569" text-anchor="middle">=</text>`;
          svg += `<circle cx="375" cy="80" r="36" fill="${isRevealed ? '#16a34a' : '#e2e8f0'}" stroke="#cbd5e1" stroke-width="2" />`;
          svg += `<text x="375" y="${isRevealed ? '138' : '88'}" font-family="'Inter', sans-serif" font-size="${isRevealed ? '12' : '24'}" font-weight="700" fill="#334155" text-anchor="middle">${isRevealed ? 'Green' : '?'}</text>`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Look at the analog clock: the long minute hand points to 12 and the short hour hand points to 3. What time is it?',
        answerRaw: '3',
        answersAccepted: ['3', '3:00', '3 oclock', "3 o'clock", 'three'],
        answerTitle: "Answer: 3 O'Clock (3:00)",
        explanation: "When the minute hand points straight up to 12, we read the hour hand: 3 o'clock.",
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 175" width="100%" height="175" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<circle cx="230" cy="88" r="65" fill="#ffffff" stroke="#1e293b" stroke-width="4" />`;
          svg += `<text x="230" y="42" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#1e293b" text-anchor="middle">12</text>`;
          svg += `<text x="282" y="93" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#059669" text-anchor="middle">3</text>`;
          svg += `<text x="230" y="144" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#1e293b" text-anchor="middle">6</text>`;
          svg += `<text x="178" y="93" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#1e293b" text-anchor="middle">9</text>`;
          svg += `<line x1="230" y1="88" x2="230" y2="48" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" />`;
          svg += `<line x1="230" y1="88" x2="265" y2="88" stroke="#059669" stroke-width="5" stroke-linecap="round" />`;
          svg += `<circle cx="230" cy="88" r="4" fill="#0f172a" />`;
          if (isRevealed) {
            svg += `<text x="365" y="93" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="#047857">3:00</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'How many cents is 1 Penny worth?',
        answerRaw: '1',
        answersAccepted: ['1', 'one', '1 cent', '1¢'],
        answerTitle: 'Answer: 1 Cent (1¢)',
        explanation: 'A copper penny is worth 1 cent. A nickel is 5¢, a dime is 10¢, and a quarter is 25¢.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<circle cx="230" cy="82" r="46" fill="#d97706" stroke="#92400e" stroke-width="3" />`;
          svg += `<text x="230" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle">${isRevealed ? '1¢' : 'Penny'}</text>`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'How many cents is 1 Nickel worth?',
        answerRaw: '5',
        answersAccepted: ['5', 'five', '5 cents', '5¢'],
        answerTitle: 'Answer: 5 Cents (5¢)',
        explanation: 'One nickel has the same value as 5 pennies (5¢).',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<circle cx="230" cy="82" r="50" fill="#94a3b8" stroke="#475569" stroke-width="3" />`;
          svg += `<text x="230" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle">${isRevealed ? '5¢' : 'Nickel'}</text>`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'How many days are in 1 full week (Sunday through Saturday)?',
        answerRaw: '7',
        answersAccepted: ['7', 'seven', '7 days'],
        answerTitle: 'Answer: 7 Days',
        explanation: 'The 7 days are Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday.',
        render: (isRevealed) => {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          let svg = `<svg viewBox="0 0 460 150" width="100%" height="150" xmlns="http://www.w3.org/2000/svg">`;
          days.forEach((d, idx) => {
            const x = 22 + idx * 60;
            svg += `<rect x="${x}" y="40" width="52" height="70" rx="10" fill="${isRevealed ? '#ecfdf5' : '#ffffff'}" stroke="${isRevealed ? '#059669' : '#cbd5e1'}" stroke-width="2" />`;
            svg += `<text x="${x + 26}" y="72" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">${d}</text>`;
            if (isRevealed) {
              svg += `<text x="${x + 26}" y="96" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#047857" text-anchor="middle">${idx + 1}</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'In which season do leaves turn orange and brown and fall from the trees: Spring, Summer, Fall (Autumn), or Winter?',
        answerRaw: 'fall',
        answersAccepted: ['fall', 'autumn'],
        answerTitle: 'Answer: Fall (Autumn)',
        explanation: 'Leaves change color and fall in Autumn, after Summer and before Winter.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🌷', label: 'Spring', odd: false },
          { icon: '☀️', label: 'Summer', odd: false },
          { icon: '🍂', label: 'Fall', odd: true },
          { icon: '❄️', label: 'Winter', odd: false }
        ], isRevealed)
      },
      {
        question: 'Which body part do we use for our sense of hearing: Eyes, Ears, Nose, or Hands?',
        answerRaw: 'ears',
        answersAccepted: ['ears', 'ear', '2', 'b'],
        answerTitle: 'Answer: Ears',
        explanation: 'Our ears detect sound waves so we can hear music, voices, and nature.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '👀', label: 'Eyes', odd: false },
          { icon: '👂', label: 'Ears', odd: true },
          { icon: '👃', label: 'Nose', odd: false },
          { icon: '👐', label: 'Hands', odd: false }
        ], isRevealed)
      },
      {
        question: 'How many legs does an insect (like an ant or a ladybug) have?',
        answerRaw: '6',
        answersAccepted: ['6', 'six', '6 legs'],
        answerTitle: 'Answer: 6 Legs',
        explanation: 'All insects have 6 legs (3 on the left side and 3 on the right side). Spiders have 8 legs.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<text x="230" y="95" font-size="56" text-anchor="middle">🐜</text>`;
          if (isRevealed) {
            svg += `<text x="230" y="145" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#047857" text-anchor="middle">3 left + 3 right = 6 legs</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Look at the balance scale: the Elephant side goes DOWN and the Mouse side goes UP. Which animal is HEAVIER?',
        answerRaw: 'elephant',
        answersAccepted: ['elephant', 'the elephant', 'left'],
        answerTitle: 'Answer: The Elephant is Heavier',
        explanation: 'On a balance scale, the heavier side tips down and the lighter side rises up.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 175" width="100%" height="175" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<polygon points="230,115 212,155 248,155" fill="#475569" />`;
          svg += `<line x1="100" y1="135" x2="360" y2="95" stroke="#1e293b" stroke-width="5" stroke-linecap="round" />`;
          svg += `<text x="115" y="122" font-size="40" text-anchor="middle">🐘</text>`;
          svg += `<text x="345" y="84" font-size="32" text-anchor="middle">🐭</text>`;
          if (isRevealed) {
            svg += `<text x="115" y="162" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">Heavier (Down)</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'A caterpillar builds a chrysalis (cocoon). What animal does it turn into when it comes out?',
        answerRaw: 'butterfly',
        answersAccepted: ['butterfly', 'a butterfly', '3', 'c'],
        answerTitle: 'Answer: A Butterfly',
        explanation: 'The life cycle goes: Egg → Caterpillar → Chrysalis → Butterfly.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🥚', label: 'Egg' },
            { icon: '🐛', label: 'Caterpillar' },
            { icon: '🫘', label: 'Chrysalis' },
            { icon: '🦋', label: 'Butterfly' }
          ], 3, isRevealed);
        }
      },
      {
        question: 'Look at the line of animals racing toward the finish flag on the right: Dog (1st), Cat (2nd), Rabbit (3rd). Which animal is in 2nd place?',
        answerRaw: 'cat',
        answersAccepted: ['cat', 'the cat', 'middle'],
        answerTitle: 'Answer: The Cat is in 2nd Place',
        explanation: 'The Dog is closest to the flag in 1st place, and the Cat is right behind in 2nd place.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🐰', label: '3rd (Rabbit)' },
            { icon: '🐱', label: isRevealed ? '2nd (Cat) ✓' : '2nd (Cat)' },
            { icon: '🐶', label: '1st (Dog)' },
            { icon: '🏁', label: 'Finish' }
          ], -1, isRevealed);
        }
      }
    ],

    // --------------------------------------------------------
    // TRACK 3: WORD & SOUND RIDDLES (12 Numbered Problems)
    // --------------------------------------------------------
    riddles: [
      {
        question: 'Which of these words rhymes with CAT: Hat, Dog, or Sun?',
        answerRaw: 'hat',
        answersAccepted: ['hat', 'a hat', '1', 'a'],
        answerTitle: 'Answer: Hat (Cat / Hat)',
        explanation: 'Cat and Hat both end with the "-at" sound.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🎩', label: 'Hat', odd: true },
          { icon: '🐶', label: 'Dog', odd: false },
          { icon: '☀️', label: 'Sun', odd: false }
        ], isRevealed)
      },
      {
        question: 'What first letter makes the /b/ sound at the beginning of BEAR and BALL?',
        answerRaw: 'b',
        answersAccepted: ['b', 'letter b'],
        answerTitle: 'Answer: The Letter B',
        explanation: 'Both Bear and Ball begin with the letter B.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🐻', label: isRevealed ? 'Bear' : '_ear' },
            { icon: '⚽', label: isRevealed ? 'Ball' : '_all' }
          ], -1, isRevealed);
        }
      },
      {
        question: 'What letter comes at the very end of the word DOG: D – O – [?]?',
        answerRaw: 'g',
        answersAccepted: ['g', 'letter g', 'dog'],
        answerTitle: 'Answer: The Letter G (D-O-G)',
        explanation: 'DOG ends with the /g/ sound, spelled with the letter G.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🐶', label: 'Dog' },
            { icon: 'D', label: '1st' },
            { icon: 'O', label: '2nd' },
            { icon: 'G', label: '3rd' }
          ], 3, isRevealed);
        }
      },
      {
        question: 'What is the OPPOSITE of HOT (like fire)?',
        answerRaw: 'cold',
        answersAccepted: ['cold', 'cool', 'freezing', 'ice'],
        answerTitle: 'Answer: Cold',
        explanation: 'Hot and Cold are opposites.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🔥', label: 'Hot' },
            { icon: '❄️', label: 'Cold' }
          ], 1, isRevealed);
        }
      },
      {
        question: 'Put these two words together to make one compound word: RAIN + BOW = [?]?',
        answerRaw: 'rainbow',
        answersAccepted: ['rainbow', 'a rainbow'],
        answerTitle: 'Answer: Rainbow',
        explanation: 'Joining RAIN and BOW makes the compound word RAINBOW.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🌧️', label: 'Rain' },
            { icon: '🎀', label: 'Bow' },
            { icon: '🌈', label: 'Rainbow' }
          ], 2, isRevealed);
        }
      },
      {
        question: 'Clap the syllables (word beats) in AP-PLE. How many claps does AP-PLE have?',
        answerRaw: '2',
        answersAccepted: ['2', 'two', '2 claps'],
        answerTitle: 'Answer: 2 Syllables (AP – PLE)',
        explanation: 'Apple has two beats when spoken aloud: AP (1) – PLE (2).',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🍎', label: 'Apple' },
            { icon: '👏', label: '1: AP' },
            { icon: '👏', label: isRevealed ? '2: PLE' : '?' }
          ], -1, isRevealed);
        }
      },
      {
        question: 'Look at the middle vowel missing in S – [?] – N (the bright star in the daytime sky). Is the missing letter A, E, or U?',
        answerRaw: 'u',
        answersAccepted: ['u', 'sun', 'letter u'],
        answerTitle: 'Answer: U (S-U-N)',
        explanation: 'The short /u/ vowel sound in the middle spells SUN.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '☀️', label: 'Sun' },
            { icon: 'S', label: '1st' },
            { icon: 'U', label: 'Middle' },
            { icon: 'N', label: 'Last' }
          ], 2, isRevealed);
        }
      },
      {
        question: 'I am yellow, monkeys like to peel me, and I grow in a bunch. What fruit am I?',
        answerRaw: 'banana',
        answersAccepted: ['banana', 'a banana'],
        answerTitle: 'Answer: A Banana',
        explanation: 'Bananas have a yellow peel and grow together in bunches.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🐒', label: 'Monkey' },
            { icon: '🍌', label: 'Banana' }
          ], 1, isRevealed);
        }
      },
      {
        question: 'I have hands on my face, I show the numbers 1 through 12, and I tell you the time. What am I?',
        answerRaw: 'clock',
        answersAccepted: ['clock', 'a clock', 'watch'],
        answerTitle: 'Answer: A Clock',
        explanation: 'A clock has a round face and two pointers called hands.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🔢', label: '1 to 12' },
            { icon: '🕒', label: 'Clock' }
          ], 1, isRevealed);
        }
      },
      {
        question: 'Which word rhymes with TREE: Bee, Car, or Book?',
        answerRaw: 'bee',
        answersAccepted: ['bee', 'a bee', '1', 'a'],
        answerTitle: 'Answer: Bee (Tree / Bee)',
        explanation: 'Tree and Bee both end with the long "-ee" sound.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🐝', label: 'Bee', odd: true },
          { icon: '🚗', label: 'Car', odd: false },
          { icon: '📖', label: 'Book', odd: false }
        ], isRevealed)
      },
      {
        question: 'Put these two words together to make one compound word: SUN + FLOWER = [?]?',
        answerRaw: 'sunflower',
        answersAccepted: ['sunflower', 'a sunflower'],
        answerTitle: 'Answer: Sunflower',
        explanation: 'SUN plus FLOWER makes the compound word SUNFLOWER.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '☀️', label: 'Sun' },
            { icon: '🌸', label: 'Flower' },
            { icon: '🌻', label: 'Sunflower' }
          ], 2, isRevealed);
        }
      },
      {
        question: 'Look at Alphabet Row: A, B, C, [?], E. Which letter comes right after C?',
        answerRaw: 'd',
        answersAccepted: ['d', 'letter d'],
        answerTitle: 'Answer: The Letter D',
        explanation: 'In alphabetical order: A, B, C, D, E.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: 'A', label: '1' },
            { icon: 'B', label: '2' },
            { icon: 'C', label: '3' },
            { icon: 'D', label: '4' },
            { icon: 'E', label: '5' }
          ], 3, isRevealed);
        }
      }
    ],

    // --------------------------------------------------------
    // TRACK 4: PATTERNS & VISUAL PUZZLES (12 Numbered Problems)
    // --------------------------------------------------------
    puzzles: [
      {
        question: 'Red, Blue, Blue, Red, Blue, [?]. What color completes this ABB pattern?',
        answerRaw: 'blue',
        answersAccepted: ['blue'],
        answerTitle: 'Answer: Blue',
        explanation: 'The pattern repeats 1 Red followed by 2 Blues (Red, Blue, Blue).',
        render: (isRevealed) => drawPreschoolPatternRow([
          { svgShape: drawShapeToken('circle', '#ef4444', 19), label: 'Red' },
          { svgShape: drawShapeToken('circle', '#2563eb', 19), label: 'Blue' },
          { svgShape: drawShapeToken('circle', '#2563eb', 19), label: 'Blue' },
          { svgShape: drawShapeToken('circle', '#ef4444', 19), label: 'Red' },
          { svgShape: drawShapeToken('circle', '#2563eb', 19), label: 'Blue' },
          { svgShape: drawShapeToken('circle', '#2563eb', 19), label: 'Blue' }
        ], 5, isRevealed)
      },
      {
        question: 'Look at this 2×2 grid: the top row has Circle, Square. The bottom row has Circle, [?]. What shape goes in the bottom-right corner?',
        answerRaw: 'square',
        answersAccepted: ['square', 'a square'],
        answerTitle: 'Answer: Square',
        explanation: 'The left column has Circles and the right column has Squares.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 175" width="100%" height="175" xmlns="http://www.w3.org/2000/svg">`;
          const cells = [
            { x: 155, y: 20, shape: 'circle', color: '#2563eb', missing: false },
            { x: 235, y: 20, shape: 'square', color: '#d97706', missing: false },
            { x: 155, y: 95, shape: 'circle', color: '#2563eb', missing: false },
            { x: 235, y: 95, shape: 'square', color: '#059669', missing: true }
          ];
          cells.forEach(c => {
            svg += `<rect x="${c.x}" y="${c.y}" width="68" height="68" rx="10" fill="#ffffff" stroke="${c.missing ? '#6366f1' : '#cbd5e1'}" stroke-width="2.5" />`;
            if (c.missing && !isRevealed) {
              svg += `<text x="${c.x + 34}" y="${c.y + 44}" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="800" fill="#4f46e5" text-anchor="middle">?</text>`;
            } else {
              svg += drawShapeToken(c.shape, c.color, 18)(c.x + 34, c.y + 38);
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'A whole pizza is cut down the middle into 2 equal pieces. If you put the 2 halves back together, how many whole pizzas do you have?',
        answerRaw: '1',
        answersAccepted: ['1', 'one', '1 whole'],
        answerTitle: 'Answer: 1 Whole Pizza',
        explanation: 'Two halves fit together to make 1 whole circle.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<circle cx="230" cy="82" r="54" fill="#fbbf24" stroke="#b45309" stroke-width="4" />`;
          svg += `<line x1="230" y1="28" x2="230" y2="136" stroke="#b45309" stroke-width="3" stroke-dasharray="${isRevealed ? 'none' : '5,4'}" />`;
          if (isRevealed) {
            svg += `<text x="230" y="156" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">2 Halves = 1 Whole</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Look at the 4 animals: Duck (2 legs), Chicken (2 legs), Owl (2 legs), Dog (4 legs). Which animal does NOT have 2 legs?',
        answerRaw: 'dog',
        answersAccepted: ['dog', 'the dog', '4', 'd'],
        answerTitle: 'Answer: The Dog (4 Legs)',
        explanation: 'Ducks, chickens, and owls are birds with 2 legs, while a dog has 4 legs.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🦆', label: 'Duck (2)', odd: false },
          { icon: '🐔', label: 'Chicken (2)', odd: false },
          { icon: '🦉', label: 'Owl (2)', odd: false },
          { icon: '🐶', label: 'Dog (4)', odd: true }
        ], isRevealed)
      },
      {
        question: 'Put the plant growth steps in order: Step 1 is Seed, Step 2 is Sprout, Step 3 is [?]. What comes at Step 3?',
        answerRaw: 'flower',
        answersAccepted: ['flower', 'plant', 'bloom'],
        answerTitle: 'Answer: Flower',
        explanation: 'First you plant a seed, next it sprouts leaves, and then it blooms into a flower.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '🌰', label: '1. Seed' },
            { icon: '🌱', label: '2. Sprout' },
            { icon: '🌻', label: '3. Flower' }
          ], 2, isRevealed);
        }
      },
      {
        question: 'How many building blocks are stacked in this L-shaped tower (3 in the tall stack on the left and 1 on the right)?',
        answerRaw: '4',
        answersAccepted: ['4', 'four', '4 blocks'],
        answerTitle: 'Answer: 4 Blocks',
        explanation: '3 stacked blocks plus 1 block next to them equals 4 blocks in all.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 175" width="100%" height="175" xmlns="http://www.w3.org/2000/svg">`;
          const coords = [
            { x: 180, y: 110, n: 1 },
            { x: 180, y: 70, n: 2 },
            { x: 180, y: 30, n: 3 },
            { x: 225, y: 110, n: 4 }
          ];
          coords.forEach(b => {
            svg += `<rect x="${b.x}" y="${b.y}" width="42" height="38" rx="5" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />`;
            if (isRevealed) {
              svg += `<text x="${b.x + 21}" y="${b.y + 24}" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">${b.n}</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Follow the arrow path from the Bee: start at the Bee and move RIGHT along the green path. Do you reach the Flower or the Rock?',
        answerRaw: 'flower',
        answersAccepted: ['flower', 'the flower'],
        answerTitle: 'Answer: The Flower',
        explanation: 'The straight green path from the Bee leads right to the Flower.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<text x="90" y="90" font-size="40" text-anchor="middle">🐝</text>`;
          svg += `<path d="M 125 80 L 325 55" stroke="${isRevealed ? '#059669' : '#22c55e'}" stroke-width="5" stroke-dasharray="6,4" fill="none" />`;
          svg += `<path d="M 125 115 L 220 130" stroke="#cbd5e1" stroke-width="4" fill="none" />`;
          svg += `<text x="365" y="65" font-size="40" text-anchor="middle">🌻</text>`;
          svg += `<text x="365" y="135" font-size="36" text-anchor="middle">🪨</text>`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'If you put 2 identical right triangles together along their diagonal edges, what 4-sided shape do they form?',
        answerRaw: 'square',
        answersAccepted: ['square', 'a square', 'rectangle'],
        answerTitle: 'Answer: A Square',
        explanation: 'Two right triangles join along their diagonal to make 1 square.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          if (!isRevealed) {
            svg += `<polygon points="130,45 130,125 210,125" fill="#8b5cf6" />`;
            svg += `<text x="235" y="92" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#475569" text-anchor="middle">+</text>`;
            svg += `<polygon points="260,45 340,45 340,125" fill="#a78bfa" />`;
          } else {
            svg += `<rect x="190" y="42" width="80" height="80" fill="#059669" />`;
            svg += `<line x1="190" y1="42" x2="270" y2="122" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="4,4" />`;
            svg += `<text x="230" y="148" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">1 Square</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Which dark shadow matches the Star shape: Shadow A (Circle), Shadow B (Star), or Shadow C (Square)?',
        answerRaw: 'b',
        answersAccepted: ['b', 'shadow b', 'star', '2'],
        answerTitle: 'Answer: Shadow B (Star)',
        explanation: 'Shadow B has the same 5 points as the Star.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<text x="80" y="95" font-size="44" text-anchor="middle">⭐</text>`;
          svg += `<circle cx="195" cy="78" r="22" fill="#334155" /><text x="195" y="135" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">A</text>`;
          svg += `<text x="290" y="94" font-size="42" fill="${isRevealed ? '#059669' : '#334155'}" text-anchor="middle">★</text><text x="290" y="135" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">B</text>`;
          svg += `<rect x="365" y="56" width="44" height="44" rx="4" fill="#334155" /><text x="387" y="135" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">C</text>`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Look at this growing staircase of squares: 1, 2, 3, [?]. How many squares are in Column 4?',
        answerRaw: '4',
        answersAccepted: ['4', 'four'],
        answerTitle: 'Answer: 4 Squares',
        explanation: 'Each step of the staircase is 1 block taller than the one before it: 1, 2, 3, 4.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 170" width="100%" height="170" xmlns="http://www.w3.org/2000/svg">`;
          for (let col = 1; col <= 4; col++) {
            const x = 95 + (col - 1) * 75;
            if (col === 4 && !isRevealed) {
              svg += `<rect x="${x}" y="30" width="45" height="110" rx="8" fill="#eef2ff" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,4" />`;
              svg += `<text x="${x + 22.5}" y="92" font-family="'Plus Jakarta Sans', sans-serif" font-size="26" font-weight="800" fill="#4f46e5" text-anchor="middle">?</text>`;
            } else {
              for (let r = 0; r < col; r++) {
                svg += `<rect x="${x}" y="${115 - r * 27}" width="45" height="24" rx="4" fill="${col === 4 ? '#059669' : '#2563eb'}" />`;
              }
            }
            svg += `<text x="${x + 22.5}" y="156" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">Step ${col}</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'When the left half of this Pine Tree is reflected across the line of symmetry, what complete object is formed?',
        answerRaw: 'tree',
        answersAccepted: ['tree', 'pine tree', 'a tree'],
        answerTitle: 'Answer: A Symmetrical Pine Tree',
        explanation: 'Both sides of the pine tree match across the center line.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 175" width="100%" height="175" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<polygon points="230,25 160,125 230,125" fill="#16a34a" />`;
          if (isRevealed) {
            svg += `<polygon points="230,25 300,125 230,125" fill="#22c55e" />`;
          }
          svg += `<line x1="230" y1="15" x2="230" y2="155" stroke="#6d28d9" stroke-width="2.5" stroke-dasharray="5,4" />`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Look at the 3×3 grid where every row has Circle, Square, Triangle. The bottom row has Circle, Square, [?]. What shape completes the bottom row?',
        answerRaw: 'triangle',
        answersAccepted: ['triangle', 'a triangle'],
        answerTitle: 'Answer: Triangle',
        explanation: 'Every row contains one Circle, one Square, and one Triangle.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { svgShape: drawShapeToken('circle', '#2563eb', 19), label: 'Circle' },
            { svgShape: drawShapeToken('square', '#d97706', 18), label: 'Square' },
            { svgShape: drawShapeToken('triangle', '#059669', 19), label: 'Triangle' }
          ], 2, isRevealed);
        }
      }
    ]
  };

// Global Exports
(typeof window !== "undefined" ? window : global).drawTenFrameSVG = drawTenFrameSVG;
(typeof window !== "undefined" ? window : global).KINDERGARTEN_SLIDES = KINDERGARTEN_SLIDES;
