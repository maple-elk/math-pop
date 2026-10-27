  // PRESCHOOL MODULE (4 TRACKS × 12 NUMBERED PROBLEMS = 48)
  // ========================================================
  function drawPreschoolPatternRow(items, missingIndex, isRevealed) {
    let svg = `<svg viewBox="0 0 460 150" width="100%" height="150" xmlns="http://www.w3.org/2000/svg">`;
    const count = items.length;
    const boxW = count <= 5 ? 74 : 64;
    const gap = count <= 5 ? 12 : 9;
    const totalW = count * boxW + (count - 1) * gap;
    const startX = (460 - totalW) / 2;

    items.forEach((item, idx) => {
      const x = startX + idx * (boxW + gap);
      const cx = x + boxW / 2;
      const cy = 72;
      const isMissing = idx === missingIndex;
      const stroke = isMissing ? (isRevealed ? '#059669' : '#6366f1') : '#cbd5e1';
      const fill = isMissing ? (isRevealed ? '#ecfdf5' : '#eef2ff') : '#ffffff';
      const dash = isMissing && !isRevealed ? 'stroke-dasharray="5,4"' : '';

      svg += `<rect x="${x}" y="22" width="${boxW}" height="100" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="2.5" ${dash} />`;
      svg += `<text x="${cx}" y="140" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#64748b" text-anchor="middle">${idx + 1}</text>`;

      if (isMissing && !isRevealed) {
        svg += `<text x="${cx}" y="${cy + 10}" font-family="'Plus Jakarta Sans', sans-serif" font-size="32" font-weight="800" fill="#4f46e5" text-anchor="middle">?</text>`;
      } else {
        if (item.svgShape) {
          svg += item.svgShape(cx, cy);
        } else {
          const fontSize = item.size || 36;
          svg += `<text x="${cx}" y="${cy + fontSize * 0.34}" font-size="${fontSize}" text-anchor="middle">${item.icon}</text>`;
        }
        if (item.label) {
          svg += `<text x="${cx}" y="112" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#334155" text-anchor="middle">${item.label}</text>`;
        }
      }
    });
    svg += `</svg>`;
    return svg;
  }

  function drawShapeToken(shape, color, size = 22) {
    return (cx, cy) => {
      if (shape === 'circle') {
        return `<circle cx="${cx}" cy="${cy - 4}" r="${size}" fill="${color}" />`;
      }
      if (shape === 'square') {
        return `<rect x="${cx - size}" y="${cy - 4 - size}" width="${size * 2}" height="${size * 2}" rx="4" fill="${color}" />`;
      }
      if (shape === 'triangle') {
        return `<polygon points="${cx},${cy - 4 - size} ${cx - size},${cy - 4 + size} ${cx + size},${cy - 4 + size}" fill="${color}" />`;
      }
      if (shape === 'star') {
        return `<text x="${cx}" y="${cy + 10}" font-size="${size * 1.7}" fill="${color}" text-anchor="middle">★</text>`;
      }
      if (shape === 'diamond') {
        return `<polygon points="${cx},${cy - 4 - size} ${cx + size},${cy - 4} ${cx},${cy - 4 + size} ${cx - size},${cy - 4}" fill="${color}" />`;
      }
      return `<circle cx="${cx}" cy="${cy}" r="${size}" fill="${color}" />`;
    };
  }

  const PRESCHOOL_SLIDES = {
    // --------------------------------------------------------
    // TRACK 1: PATTERNS (12 Numbered Problems)
    // --------------------------------------------------------
    patterns: [
      {
        question: 'Red circle, Blue circle, Red circle, Blue circle, Red circle... What comes next?',
        answerRaw: 'blue',
        answersAccepted: ['blue', 'blue circle', 'circle'],
        answerTitle: 'Answer: Blue Circle',
        explanation: 'This is an AB pattern that alternates between Red and Blue: Red, Blue, Red, Blue, Red, Blue.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { svgShape: drawShapeToken('circle', '#ef4444', 20), label: 'Red' },
          { svgShape: drawShapeToken('circle', '#2563eb', 20), label: 'Blue' },
          { svgShape: drawShapeToken('circle', '#ef4444', 20), label: 'Red' },
          { svgShape: drawShapeToken('circle', '#2563eb', 20), label: 'Blue' },
          { svgShape: drawShapeToken('circle', '#ef4444', 20), label: 'Red' },
          { svgShape: drawShapeToken('circle', '#2563eb', 20), label: 'Blue' }
        ], 5, isRevealed)
      },
      {
        question: 'Apple, Banana, Apple, Banana, Apple... What fruit comes next?',
        answerRaw: 'banana',
        answersAccepted: ['banana', 'a banana'],
        answerTitle: 'Answer: Banana',
        explanation: 'The pattern repeats Apple, Banana over and over. After Apple comes Banana.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { icon: '🍎', label: 'Apple' },
          { icon: '🍌', label: 'Banana' },
          { icon: '🍎', label: 'Apple' },
          { icon: '🍌', label: 'Banana' },
          { icon: '🍎', label: 'Apple' },
          { icon: '🍌', label: 'Banana' }
        ], 5, isRevealed)
      },
      {
        question: 'Circle, Square, Circle, Square, Circle... What shape comes next?',
        answerRaw: 'square',
        answersAccepted: ['square', 'a square'],
        answerTitle: 'Answer: Square',
        explanation: 'The shapes alternate between Circle and Square. After Circle comes Square.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { svgShape: drawShapeToken('circle', '#0284c7', 19), label: 'Circle' },
          { svgShape: drawShapeToken('square', '#d97706', 18), label: 'Square' },
          { svgShape: drawShapeToken('circle', '#0284c7', 19), label: 'Circle' },
          { svgShape: drawShapeToken('square', '#d97706', 18), label: 'Square' },
          { svgShape: drawShapeToken('circle', '#0284c7', 19), label: 'Circle' },
          { svgShape: drawShapeToken('square', '#d97706', 18), label: 'Square' }
        ], 5, isRevealed)
      },
      {
        question: 'Big star, Small star, Big star, Small star, Big star... What size star comes next?',
        answerRaw: 'small',
        answersAccepted: ['small', 'small star', 'little', 'little star'],
        answerTitle: 'Answer: Small Star',
        explanation: 'This size pattern alternates Big, Small, Big, Small, Big, Small.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { svgShape: drawShapeToken('star', '#eab308', 22), label: 'Big' },
          { svgShape: drawShapeToken('star', '#eab308', 12), label: 'Small' },
          { svgShape: drawShapeToken('star', '#eab308', 22), label: 'Big' },
          { svgShape: drawShapeToken('star', '#eab308', 12), label: 'Small' },
          { svgShape: drawShapeToken('star', '#eab308', 22), label: 'Big' },
          { svgShape: drawShapeToken('star', '#eab308', 12), label: 'Small' }
        ], 5, isRevealed)
      },
      {
        question: 'Sun, Sun, Moon, Sun, Sun... What comes next to finish the pattern?',
        answerRaw: 'moon',
        answersAccepted: ['moon', 'the moon'],
        answerTitle: 'Answer: Moon',
        explanation: 'This is an AAB pattern: two Suns followed by one Moon (Sun, Sun, Moon).',
        render: (isRevealed) => drawPreschoolPatternRow([
          { icon: '☀️', label: 'Sun' },
          { icon: '☀️', label: 'Sun' },
          { icon: '🌙', label: 'Moon' },
          { icon: '☀️', label: 'Sun' },
          { icon: '☀️', label: 'Sun' },
          { icon: '🌙', label: 'Moon' }
        ], 5, isRevealed)
      },
      {
        question: ' Frog, Duck, Duck, Frog, Duck... What animal comes next?',
        answerRaw: 'duck',
        answersAccepted: ['duck', 'a duck'],
        answerTitle: 'Answer: Duck',
        explanation: 'This ABB pattern uses one Frog followed by two Ducks: Frog, Duck, Duck.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { icon: '🐸', label: 'Frog' },
          { icon: '🦆', label: 'Duck' },
          { icon: '🦆', label: 'Duck' },
          { icon: '🐸', label: 'Frog' },
          { icon: '🦆', label: 'Duck' },
          { icon: '🦆', label: 'Duck' }
        ], 5, isRevealed)
      },
      {
        question: 'Red, Yellow, Green, Red, Yellow... What color comes next?',
        answerRaw: 'green',
        answersAccepted: ['green', 'green square'],
        answerTitle: 'Answer: Green',
        explanation: 'This three-color ABC pattern repeats in traffic-light order: Red, Yellow, Green.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { svgShape: drawShapeToken('square', '#ef4444', 18), label: 'Red' },
          { svgShape: drawShapeToken('square', '#eab308', 18), label: 'Yellow' },
          { svgShape: drawShapeToken('square', '#10b981', 18), label: 'Green' },
          { svgShape: drawShapeToken('square', '#ef4444', 18), label: 'Red' },
          { svgShape: drawShapeToken('square', '#eab308', 18), label: 'Yellow' },
          { svgShape: drawShapeToken('square', '#10b981', 18), label: 'Green' }
        ], 5, isRevealed)
      },
      {
        question: 'Triangle, Circle, Square, Triangle, Circle... What shape comes next?',
        answerRaw: 'square',
        answersAccepted: ['square', 'a square'],
        answerTitle: 'Answer: Square',
        explanation: 'The three-shape pattern repeats Triangle, Circle, Square.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { svgShape: drawShapeToken('triangle', '#7c3aed', 19), label: 'Triangle' },
          { svgShape: drawShapeToken('circle', '#0284c7', 19), label: 'Circle' },
          { svgShape: drawShapeToken('square', '#059669', 18), label: 'Square' },
          { svgShape: drawShapeToken('triangle', '#7c3aed', 19), label: 'Triangle' },
          { svgShape: drawShapeToken('circle', '#0284c7', 19), label: 'Circle' },
          { svgShape: drawShapeToken('square', '#059669', 18), label: 'Square' }
        ], 5, isRevealed)
      },
      {
        question: 'Look at box #4 with the question mark: Car, Bus, Car, [?], Car, Bus. What goes in box #4?',
        answerRaw: 'bus',
        answersAccepted: ['bus', 'a bus'],
        answerTitle: 'Answer: Bus',
        explanation: 'The pattern alternates Car and Bus, so position #4 between two Cars is a Bus.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { icon: '🚗', label: 'Car' },
          { icon: '🚌', label: 'Bus' },
          { icon: '🚗', label: 'Car' },
          { icon: '🚌', label: 'Bus' },
          { icon: '🚗', label: 'Car' },
          { icon: '🚌', label: 'Bus' }
        ], 3, isRevealed)
      },
      {
        question: 'Up arrow, Down arrow, Up arrow, Down arrow... Which arrow comes next?',
        answerRaw: 'up',
        answersAccepted: ['up', 'up arrow'],
        answerTitle: 'Answer: Up Arrow',
        explanation: 'The direction alternates Up, Down, Up, Down, so the 5th arrow points Up.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { icon: '⬆️', label: 'Up' },
          { icon: '⬇️', label: 'Down' },
          { icon: '⬆️', label: 'Up' },
          { icon: '⬇️', label: 'Down' },
          { icon: '⬆️', label: 'Up' }
        ], 4, isRevealed)
      },
      {
        question: '1 dot, 2 dots, 3 dots, 4 dots... How many dots come next in this growing pattern?',
        answerRaw: '5',
        answersAccepted: ['5', 'five', '5 dots', 'five dots'],
        answerTitle: 'Answer: 5 Dots',
        explanation: 'Each box adds 1 more dot: 1, 2, 3, 4, 5.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 150" width="100%" height="150" xmlns="http://www.w3.org/2000/svg">`;
          for (let i = 1; i <= 5; i++) {
            const x = 25 + (i - 1) * 85;
            const cx = x + 36;
            const isMissing = i === 5;
            svg += `<rect x="${x}" y="22" width="72" height="100" rx="14" fill="${isMissing ? (isRevealed ? '#ecfdf5' : '#eef2ff') : '#ffffff'}" stroke="${isMissing ? (isRevealed ? '#059669' : '#6366f1') : '#cbd5e1'}" stroke-width="2.5" />`;
            if (isMissing && !isRevealed) {
              svg += `<text x="${cx}" y="82" font-family="'Plus Jakarta Sans', sans-serif" font-size="32" font-weight="800" fill="#4f46e5" text-anchor="middle">?</text>`;
            } else {
              const positions = {
                1: [[0, 0]],
                2: [[-12, 0], [12, 0]],
                3: [[-15, 10], [0, -10], [15, 10]],
                4: [[-13, -12], [13, -12], [-13, 12], [13, 12]],
                5: [[-15, -14], [15, -14], [0, 0], [-15, 14], [15, 14]]
              }[i];
              positions.forEach(([dx, dy]) => {
                svg += `<circle cx="${cx + dx}" cy="${65 + dy}" r="6.5" fill="${isMissing ? '#059669' : '#2563eb'}" />`;
              });
              svg += `<text x="${cx}" y="112" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">${i}</text>`;
            }
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Flower, Leaf, Flower, Leaf, [?], Leaf. What is missing in box #5?',
        answerRaw: 'flower',
        answersAccepted: ['flower', 'a flower'],
        answerTitle: 'Answer: Flower',
        explanation: 'The pattern alternates Flower and Leaf. Box #5 comes after Leaf and before Leaf, so it is a Flower.',
        render: (isRevealed) => drawPreschoolPatternRow([
          { icon: '🌸', label: 'Flower' },
          { icon: '🍃', label: 'Leaf' },
          { icon: '🌸', label: 'Flower' },
          { icon: '🍃', label: 'Leaf' },
          { icon: '🌸', label: 'Flower' },
          { icon: '🍃', label: 'Leaf' }
        ], 4, isRevealed)
      }
    ],

    // --------------------------------------------------------
    // TRACK 2: COUNTING 1–5 (12 Numbered Problems)
    // --------------------------------------------------------
    counting: [
      {
        question: 'How many red apples are in the box?',
        answerRaw: '2',
        answersAccepted: ['2', 'two'],
        answerTitle: 'Answer: 2 Apples',
        explanation: 'Count them from left to right: 1, 2.',
        render: (isRevealed) => renderPreschoolCountingItems('🍎', 2, isRevealed)
      },
      {
        question: 'How many yellow ducks are swimming in the pond?',
        answerRaw: '3',
        answersAccepted: ['3', 'three'],
        answerTitle: 'Answer: 3 Ducks',
        explanation: 'Count each duck: 1, 2, 3 ducks in all.',
        render: (isRevealed) => renderPreschoolCountingItems('🦆', 3, isRevealed)
      },
      {
        question: 'How many stars do you see in the sky?',
        answerRaw: '4',
        answersAccepted: ['4', 'four'],
        answerTitle: 'Answer: 4 Stars',
        explanation: 'Count each star: 1, 2, 3, 4.',
        render: (isRevealed) => renderPreschoolCountingItems('⭐', 4, isRevealed)
      },
      {
        question: 'How many strawberries are on the plate?',
        answerRaw: '5',
        answersAccepted: ['5', 'five'],
        answerTitle: 'Answer: 5 Strawberries',
        explanation: 'Count all the strawberries across the row: 1, 2, 3, 4, 5.',
        render: (isRevealed) => renderPreschoolCountingItems('🍓', 5, isRevealed)
      },
      {
        question: 'How many orange basketballs are there?',
        answerRaw: '1',
        answersAccepted: ['1', 'one'],
        answerTitle: 'Answer: 1 Basketball',
        explanation: 'There is just 1 basketball in the center.',
        render: (isRevealed) => renderPreschoolCountingItems('🏀', 1, isRevealed)
      },
      {
        question: 'Look at the 5-frame. How many blue counters are inside the boxes?',
        answerRaw: '3',
        answersAccepted: ['3', 'three'],
        answerTitle: 'Answer: 3 Counters',
        explanation: 'Three of the five boxes have a blue counter inside: 1, 2, 3.',
        render: (isRevealed) => renderPreschoolFiveFrame(3, isRevealed)
      },
      {
        question: 'Look at the 5-frame. Every box is full! How many counters are there?',
        answerRaw: '5',
        answersAccepted: ['5', 'five'],
        answerTitle: 'Answer: 5 Counters',
        explanation: 'When a 5-frame is completely full, it holds 5 counters.',
        render: (isRevealed) => renderPreschoolFiveFrame(5, isRevealed)
      },
      {
        question: 'Which side has MORE cookies: Box A (4 cookies) or Box B (2 cookies)?',
        answerRaw: 'a',
        answersAccepted: ['a', 'box a', '4', 'four', 'left'],
        answerTitle: 'Answer: Box A (4 Cookies)',
        explanation: '4 is more than 2, so Box A has more cookies.',
        render: (isRevealed) => renderPreschoolCompareBoxes('🍪', 4, 2, 'MORE', isRevealed)
      },
      {
        question: 'Which side has FEWER balloons: Box A (1 balloon) or Box B (3 balloons)?',
        answerRaw: 'a',
        answersAccepted: ['a', 'box a', '1', 'one', 'left'],
        answerTitle: 'Answer: Box A (1 Balloon)',
        explanation: '1 is fewer than 3, so Box A has fewer balloons.',
        render: (isRevealed) => renderPreschoolCompareBoxes('🎈', 1, 3, 'FEWER', isRevealed)
      },
      {
        question: 'You have 2 green frogs, and 1 more frog hops over. How many frogs are there now?',
        answerRaw: '3',
        answersAccepted: ['3', 'three'],
        answerTitle: 'Answer: 3 Frogs',
        explanation: '2 frogs and 1 more frog make 3 frogs altogether (2 + 1 = 3).',
        render: (isRevealed) => renderPreschoolOneMore('🐸', 2, 1, isRevealed)
      },
      {
        question: 'You have 3 toy blocks, and you add 1 more block. How many blocks do you have now?',
        answerRaw: '4',
        answersAccepted: ['4', 'four'],
        answerTitle: 'Answer: 4 Blocks',
        explanation: '1 more than 3 is 4 (3 + 1 = 4).',
        render: (isRevealed) => renderPreschoolOneMore('🟦', 3, 1, isRevealed)
      },
      {
        question: 'What number is missing on this counting path: 1, 2, [?], 4, 5?',
        answerRaw: '3',
        answersAccepted: ['3', 'three'],
        answerTitle: 'Answer: 3',
        explanation: 'Counting in order from 1 to 5 goes: 1, 2, 3, 4, 5.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 150" width="100%" height="150" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<line x1="65" y1="75" x2="395" y2="75" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round" />`;
          for (let n = 1; n <= 5; n++) {
            const cx = 65 + (n - 1) * 82.5;
            const isMissing = n === 3;
            const fill = isMissing ? (isRevealed ? '#059669' : '#eef2ff') : '#2563eb';
            const stroke = isMissing ? (isRevealed ? '#047857' : '#6366f1') : '#1d4ed8';
            svg += `<circle cx="${cx}" cy="75" r="28" fill="${fill}" stroke="${stroke}" stroke-width="3" />`;
            const label = isMissing && !isRevealed ? '?' : String(n);
            const textColor = isMissing && !isRevealed ? '#4f46e5' : '#ffffff';
            svg += `<text x="${cx}" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="${textColor}" text-anchor="middle">${label}</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // --------------------------------------------------------
    // TRACK 3: SHAPES & SIZES (12 Numbered Problems)
    // --------------------------------------------------------
    shapes: [
      {
        question: 'Which shape is completely round and has 0 corners (Circle, Square, or Triangle)?',
        answerRaw: 'circle',
        answersAccepted: ['circle', 'a circle', '1', 'blue'],
        answerTitle: 'Answer: Circle',
        explanation: 'A circle has one curved edge and 0 corners.',
        render: (isRevealed) => renderPreschoolShapeChoices([
          { name: 'Circle', shape: 'circle', color: '#2563eb', correct: true },
          { name: 'Square', shape: 'square', color: '#d97706', correct: false },
          { name: 'Triangle', shape: 'triangle', color: '#7c3aed', correct: false }
        ], isRevealed)
      },
      {
        question: 'Which shape has exactly 3 straight sides and 3 corners?',
        answerRaw: 'triangle',
        answersAccepted: ['triangle', 'a triangle', '3', 'purple'],
        answerTitle: 'Answer: Triangle',
        explanation: 'A triangle has 3 straight sides and 3 sharp corners.',
        render: (isRevealed) => renderPreschoolShapeChoices([
          { name: 'Circle', shape: 'circle', color: '#2563eb', correct: false },
          { name: 'Square', shape: 'square', color: '#d97706', correct: false },
          { name: 'Triangle', shape: 'triangle', color: '#7c3aed', correct: true }
        ], isRevealed)
      },
      {
        question: 'Which shape has 4 equal sides and 4 corners?',
        answerRaw: 'square',
        answersAccepted: ['square', 'a square', '2', 'orange'],
        answerTitle: 'Answer: Square',
        explanation: 'A square has 4 sides that are all the same length and 4 corners.',
        render: (isRevealed) => renderPreschoolShapeChoices([
          { name: 'Circle', shape: 'circle', color: '#2563eb', correct: false },
          { name: 'Square', shape: 'square', color: '#d97706', correct: true },
          { name: 'Triangle', shape: 'triangle', color: '#7c3aed', correct: false }
        ], isRevealed)
      },
      {
        question: 'Count the corners on this triangle. How many corners does it have?',
        answerRaw: '3',
        answersAccepted: ['3', 'three'],
        answerTitle: 'Answer: 3 Corners',
        explanation: 'Every triangle has 3 points (corners) and 3 sides.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 170" width="100%" height="170" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<polygon points="230,28 155,142 305,142" fill="#ede9fe" stroke="#7c3aed" stroke-width="4" stroke-linejoin="round" />`;
          const pts = [[230, 28, '1'], [155, 142, '2'], [305, 142, '3']];
          pts.forEach(([x, y, num]) => {
            svg += `<circle cx="${x}" cy="${y}" r="13" fill="${isRevealed ? '#059669' : '#7c3aed'}" />`;
            if (isRevealed) {
              svg += `<text x="${x}" y="${y + 4}" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">${num}</text>`;
            }
          });
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Count the sides on this square. How many sides does it have?',
        answerRaw: '4',
        answersAccepted: ['4', 'four'],
        answerTitle: 'Answer: 4 Sides',
        explanation: 'A square has 4 straight sides: top, right, bottom, and left.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 170" width="100%" height="170" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="175" y="30" width="110" height="110" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="4" />`;
          if (isRevealed) {
            const labels = [[230, 22, '1'], [302, 90, '2'], [230, 158, '3'], [158, 90, '4']];
            labels.forEach(([x, y, num]) => {
              svg += `<circle cx="${x}" cy="${y - 4}" r="11" fill="#059669" />`;
              svg += `<text x="${x}" y="${y}" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${num}</text>`;
            });
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Which circle is the BIGGEST: A, B, or C?',
        answerRaw: 'c',
        answersAccepted: ['c', 'circle c', '3'],
        answerTitle: 'Answer: C is the Biggest',
        explanation: 'Comparing sizes from left to right: A is small, B is medium, and C is the biggest.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          const circles = [
            { label: 'A', x: 100, r: 16, win: false },
            { label: 'B', x: 220, r: 28, win: false },
            { label: 'C', x: 355, r: 44, win: true }
          ];
          circles.forEach(c => {
            const fill = isRevealed && c.win ? '#059669' : '#3b82f6';
            svg += `<circle cx="${c.x}" cy="75" r="${c.r}" fill="${fill}" />`;
            svg += `<text x="${c.x}" y="148" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="#1e293b" text-anchor="middle">${c.label}</text>`;
          });
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Which square is the SMALLEST: A, B, or C?',
        answerRaw: 'b',
        answersAccepted: ['b', 'square b', '2'],
        answerTitle: 'Answer: B is the Smallest',
        explanation: 'Square B in the middle takes up the least space, so it is the smallest.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          const boxes = [
            { label: 'A', x: 100, s: 56, win: false },
            { label: 'B', x: 230, s: 28, win: true },
            { label: 'C', x: 360, s: 76, win: false }
          ];
          boxes.forEach(b => {
            const fill = isRevealed && b.win ? '#059669' : '#f59e0b';
            svg += `<rect x="${b.x - b.s / 2}" y="${75 - b.s / 2}" width="${b.s}" height="${b.s}" rx="6" fill="${fill}" />`;
            svg += `<text x="${b.x}" y="148" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="#1e293b" text-anchor="middle">${b.label}</text>`;
          });
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Which tree is TALLER: Tree A or Tree B?',
        answerRaw: 'a',
        answersAccepted: ['a', 'tree a', 'left'],
        answerTitle: 'Answer: Tree A is Taller',
        explanation: 'Tree A reaches higher up than Tree B.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 170" width="100%" height="170" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<line x1="70" y1="135" x2="390" y2="135" stroke="#94a3b8" stroke-width="3" />`;
          // Tree A (tall)
          svg += `<rect x="142" y="95" width="16" height="40" fill="#92400e" />`;
          svg += `<polygon points="150,20 110,100 190,100" fill="${isRevealed ? '#059669' : '#16a34a'}" />`;
          svg += `<text x="150" y="156" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#0f172a" text-anchor="middle">Tree A</text>`;
          // Tree B (short)
          svg += `<rect x="304" y="110" width="12" height="25" fill="#92400e" />`;
          svg += `<polygon points="310,65 282,112 338,112" fill="#22c55e" />`;
          svg += `<text x="310" y="156" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#0f172a" text-anchor="middle">Tree B</text>`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Which pencil is LONGER: Pencil A or Pencil B?',
        answerRaw: 'b',
        answersAccepted: ['b', 'pencil b', 'bottom'],
        answerTitle: 'Answer: Pencil B is Longer',
        explanation: 'Both pencils start at the same line on the left, and Pencil B stretches further to the right.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 160" width="100%" height="160" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<line x1="90" y1="25" x2="90" y2="135" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4" />`;
          // Pencil A
          svg += `<text x="55" y="65" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#334155" text-anchor="middle">A</text>`;
          svg += `<rect x="90" y="48" width="140" height="22" rx="3" fill="#fbbf24" stroke="#d97706" stroke-width="2" />`;
          svg += `<polygon points="230,48 252,59 230,70" fill="#fde68a" stroke="#d97706" stroke-width="2" />`;
          // Pencil B
          svg += `<text x="55" y="115" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#334155" text-anchor="middle">B</text>`;
          svg += `<rect x="90" y="98" width="260" height="22" rx="3" fill="${isRevealed ? '#10b981' : '#fbbf24'}" stroke="${isRevealed ? '#047857' : '#d97706'}" stroke-width="2" />`;
          svg += `<polygon points="350,98 372,109 350,120" fill="#fde68a" stroke="${isRevealed ? '#047857' : '#d97706'}" stroke-width="2" />`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Look at the red ball and the brown box. Is the ball ON TOP of the box or UNDER the box?',
        answerRaw: 'on top',
        answersAccepted: ['on top', 'top', 'on', 'above'],
        answerTitle: 'Answer: On Top of the Box',
        explanation: 'The red ball is resting right on top of the box.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 170" width="100%" height="170" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="180" y="80" width="100" height="70" rx="8" fill="#d97706" stroke="#92400e" stroke-width="3" />`;
          svg += `<text x="230" y="120" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">BOX</text>`;
          svg += `<circle cx="230" cy="52" r="24" fill="#ef4444" stroke="${isRevealed ? '#059669' : '#b91c1c'}" stroke-width="3" />`;
          if (isRevealed) {
            svg += `<text x="335" y="56" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#047857">← ON TOP</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'Look at the blue bird and the yellow circle. Is the bird INSIDE or OUTSIDE the circle?',
        answerRaw: 'inside',
        answersAccepted: ['inside', 'in'],
        answerTitle: 'Answer: Inside the Circle',
        explanation: 'The bird is surrounded by the yellow ring, so it is inside the circle.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 170" width="100%" height="170" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<circle cx="230" cy="85" r="60" fill="#fef9c3" stroke="${isRevealed ? '#059669' : '#eab308'}" stroke-width="4" />`;
          svg += `<text x="230" y="98" font-size="40" text-anchor="middle">🐦</text>`;
          if (isRevealed) {
            svg += `<text x="230" y="162" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">INSIDE</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'If you put 2 identical squares side by side touching each other, what longer 4-sided shape do they make?',
        answerRaw: 'rectangle',
        answersAccepted: ['rectangle', 'a rectangle'],
        answerTitle: 'Answer: A Rectangle',
        explanation: 'Two squares joined side by side form a wider rectangle with 2 long sides and 2 short sides.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          if (!isRevealed) {
            svg += `<rect x="135" y="45" width="70" height="70" rx="4" fill="#60a5fa" stroke="#1d4ed8" stroke-width="3" />`;
            svg += `<text x="230" y="88" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="#475569" text-anchor="middle">+</text>`;
            svg += `<rect x="255" y="45" width="70" height="70" rx="4" fill="#60a5fa" stroke="#1d4ed8" stroke-width="3" />`;
          } else {
            svg += `<rect x="160" y="40" width="140" height="70" rx="4" fill="#d1fae5" stroke="#059669" stroke-width="3.5" />`;
            svg += `<line x1="230" y1="40" x2="230" y2="110" stroke="#059669" stroke-width="2" stroke-dasharray="4,4" />`;
            svg += `<text x="230" y="138" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">1 Wide Rectangle</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // --------------------------------------------------------
    // TRACK 4: SORTING & MATCHING (12 Numbered Problems)
    // --------------------------------------------------------
    sorting: [
      {
        question: 'Three of these are fruits and one is a vehicle: Apple, Banana, Car, Grapes. Which one does NOT belong?',
        answerRaw: 'car',
        answersAccepted: ['car', 'the car', '3', 'c'],
        answerTitle: 'Answer: Car',
        explanation: 'Apple, Banana, and Grapes are fruits you can eat. A Car is a vehicle you ride in.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🍎', label: 'Apple', odd: false },
          { icon: '🍌', label: 'Banana', odd: false },
          { icon: '🚗', label: 'Car', odd: true },
          { icon: '🍇', label: 'Grapes', odd: false }
        ], isRevealed)
      },
      {
        question: 'Look at the colors: Red Strawberry, Red Apple, Green Frog, Red Firetruck. Which one is a DIFFERENT color?',
        answerRaw: 'frog',
        answersAccepted: ['frog', 'green frog', 'green', '3', 'c'],
        answerTitle: 'Answer: Green Frog',
        explanation: 'The strawberry, apple, and firetruck are all red, while the frog is green.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🍓', label: 'Red', odd: false },
          { icon: '🍎', label: 'Red', odd: false },
          { icon: '🐸', label: 'Green Frog', odd: true },
          { icon: '🚒', label: 'Red', odd: false }
        ], isRevealed)
      },
      {
        question: 'Which item do you wear on your feet when it rains: Hat, Boots, Mittens, or Scarf?',
        answerRaw: 'boots',
        answersAccepted: ['boots', 'boot', '2', 'b'],
        answerTitle: 'Answer: Boots',
        explanation: 'Boots go on your feet. A hat goes on your head, mittens go on your hands, and a scarf goes around your neck.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🧢', label: 'Hat', odd: false },
          { icon: '🥾', label: 'Boots', odd: true },
          { icon: '🧤', label: 'Mittens', odd: false },
          { icon: '🧣', label: 'Scarf', odd: false }
        ], isRevealed)
      },
      {
        question: 'Which animal lives and swims underwater all the time: Dog, Cat, Fish, or Rabbit?',
        answerRaw: 'fish',
        answersAccepted: ['fish', 'a fish', '3', 'c'],
        answerTitle: 'Answer: Fish',
        explanation: 'Fish live underwater and breathe with gills, while dogs, cats, and rabbits live on land.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🐶', label: 'Dog', odd: false },
          { icon: '🐱', label: 'Cat', odd: false },
          { icon: '🐟', label: 'Fish', odd: true },
          { icon: '🐰', label: 'Rabbit', odd: false }
        ], isRevealed)
      },
      {
        question: 'Three of these shapes are Circles and one is a Triangle. Which box (#1, #2, #3, or #4) has the Triangle?',
        answerRaw: '4',
        answersAccepted: ['4', '#4', 'triangle', 'd', 'four'],
        answerTitle: 'Answer: Box #4 (Triangle)',
        explanation: 'Boxes #1, #2, and #3 all hold blue circles, while Box #4 holds an orange triangle.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { svgShape: drawShapeToken('circle', '#2563eb', 20), label: 'Circle' },
            { svgShape: drawShapeToken('circle', '#2563eb', 20), label: 'Circle' },
            { svgShape: drawShapeToken('circle', '#2563eb', 20), label: 'Circle' },
            { svgShape: drawShapeToken('triangle', isRevealed ? '#059669' : '#d97706', 20), label: 'Triangle' }
          ], -1, isRevealed);
        }
      },
      {
        question: 'What goes together with a Paintbrush to make a picture: A Paint Palette, a Shoe, or a Spoon?',
        answerRaw: 'paint',
        answersAccepted: ['paint', 'paint palette', 'palette', '1', 'a'],
        answerTitle: 'Answer: Paint Palette',
        explanation: 'You dip a paintbrush into paint on a palette to paint a picture.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🎨', label: 'Paint Palette', odd: true },
          { icon: '👟', label: 'Shoe', odd: false },
          { icon: '🥄', label: 'Spoon', odd: false }
        ], isRevealed)
      },
      {
        question: 'Which of these belongs in the sky: Bicycle, Boat, Airplane, or Train?',
        answerRaw: 'airplane',
        answersAccepted: ['airplane', 'plane', '3', 'c'],
        answerTitle: 'Answer: Airplane',
        explanation: 'An airplane has wings and flies in the sky. Bicycles and trains travel on land, and boats float on water.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🚲', label: 'Bicycle', odd: false },
          { icon: '⛵', label: 'Boat', odd: false },
          { icon: '✈️', label: 'Airplane', odd: true },
          { icon: '🚂', label: 'Train', odd: false }
        ], isRevealed)
      },
      {
        question: 'Count the items in this group: 3 Blue Stars and 2 Yellow Moons. How many Blue Stars are there?',
        answerRaw: '3',
        answersAccepted: ['3', 'three', '3 stars'],
        answerTitle: 'Answer: 3 Blue Stars',
        explanation: 'Sorting the group by type gives 3 Stars and 2 Moons.',
        render: (isRevealed) => {
          return drawPreschoolPatternRow([
            { icon: '⭐', label: isRevealed ? 'Star #1' : 'Star' },
            { icon: '🌙', label: 'Moon' },
            { icon: '⭐', label: isRevealed ? 'Star #2' : 'Star' },
            { icon: '🌙', label: 'Moon' },
            { icon: '⭐', label: isRevealed ? 'Star #3' : 'Star' }
          ], -1, isRevealed);
        }
      },
      {
        question: 'Which of these is COLD: Hot Soup, Campfire, Ice Cube, or Bright Sun?',
        answerRaw: 'ice',
        answersAccepted: ['ice', 'ice cube', '3', 'c'],
        answerTitle: 'Answer: Ice Cube',
        explanation: 'An ice cube is frozen water and feels very cold. Soup, fire, and the sun are hot.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🍲', label: 'Hot Soup', odd: false },
          { icon: '🔥', label: 'Campfire', odd: false },
          { icon: '🧊', label: 'Ice Cube', odd: true },
          { icon: '☀️', label: 'Sun', odd: false }
        ], isRevealed)
      },
      {
        question: 'Which baby animal grows up to be a Cat: Puppy, Kitten, or Duckling?',
        answerRaw: 'kitten',
        answersAccepted: ['kitten', 'a kitten', '2', 'b', 'cat'],
        answerTitle: 'Answer: Kitten',
        explanation: 'A kitten is a baby cat. A puppy grows up to be a dog, and a duckling grows up to be a duck.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '🐶', label: 'Puppy', odd: false },
          { icon: '🐱', label: 'Kitten', odd: true },
          { icon: '🐥', label: 'Duckling', odd: false }
        ], isRevealed)
      },
      {
        question: 'We sorted items into two baskets: Toys and Food. Where does a Teddy Bear belong (Toys or Food)?',
        answerRaw: 'toys',
        answersAccepted: ['toys', 'toy', 'toy basket'],
        answerTitle: 'Answer: Toys Basket',
        explanation: 'A Teddy Bear is something you play with, so it goes into the Toys basket.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<text x="230" y="45" font-size="38" text-anchor="middle">🧸</text>`;
          svg += `<rect x="65" y="75" width="140" height="70" rx="12" fill="${isRevealed ? '#ecfdf5' : '#f8fafc'}" stroke="${isRevealed ? '#059669' : '#cbd5e1'}" stroke-width="2.5" />`;
          svg += `<text x="135" y="115" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="800" fill="#0f172a" text-anchor="middle">🧸 Toys Basket</text>`;
          svg += `<rect x="255" y="75" width="140" height="70" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />`;
          svg += `<text x="325" y="115" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="800" fill="#0f172a" text-anchor="middle">🍎 Food Basket</text>`;
          svg += `</svg>`;
          return svg;
        }
      },
      {
        question: 'When do you usually see the Moon and Stars shining in a dark sky: Daytime or Nighttime?',
        answerRaw: 'nighttime',
        answersAccepted: ['nighttime', 'night', 'at night', '2', 'b'],
        answerTitle: 'Answer: Nighttime',
        explanation: 'At night, the sky grows dark and we can clearly see the moon and stars.',
        render: (isRevealed) => renderPreschoolOddOneOut([
          { icon: '☀️', label: 'Daytime', odd: false },
          { icon: '🌙', label: 'Nighttime', odd: true }
        ], isRevealed)
      }
    ]
  };

  function renderPreschoolCountingItems(icon, count, isRevealed) {
    let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect x="35" y="20" width="390" height="125" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />`;
    const spacing = 340 / (count + 1);
    for (let i = 0; i < count; i++) {
      const cx = 60 + spacing * (i + 1);
      svg += `<text x="${cx}" y="88" font-size="44" text-anchor="middle">${icon}</text>`;
      if (isRevealed) {
        svg += `<circle cx="${cx}" cy="122" r="12" fill="#059669" />`;
        svg += `<text x="${cx}" y="126" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
      }
    }
    svg += `</svg>`;
    return svg;
  }

  function renderPreschoolFiveFrame(filledCount, isRevealed) {
    let svg = `<svg viewBox="0 0 460 155" width="100%" height="155" xmlns="http://www.w3.org/2000/svg">`;
    const startX = 55;
    const cellW = 70;
    for (let i = 0; i < 5; i++) {
      const x = startX + i * cellW;
      const cx = x + cellW / 2;
      svg += `<rect x="${x}" y="35" width="${cellW}" height="75" fill="#ffffff" stroke="#334155" stroke-width="2.5" />`;
      if (i < filledCount) {
        svg += `<circle cx="${cx}" cy="72" r="21" fill="${isRevealed ? '#059669' : '#2563eb'}" />`;
        if (isRevealed) {
          svg += `<text x="${cx}" y="77" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
        }
      }
    }
    svg += `</svg>`;
    return svg;
  }

  function renderPreschoolCompareBoxes(icon, leftCount, rightCount, mode, isRevealed) {
    const leftWins = mode === 'MORE' ? leftCount > rightCount : leftCount < rightCount;
    let svg = `<svg viewBox="0 0 460 170" width="100%" height="170" xmlns="http://www.w3.org/2000/svg">`;
    const drawSide = (x, label, count, isWinner) => {
      const stroke = isRevealed && isWinner ? '#059669' : '#cbd5e1';
      const fill = isRevealed && isWinner ? '#ecfdf5' : '#ffffff';
      svg += `<rect x="${x}" y="20" width="180" height="125" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="2.5" />`;
      svg += `<text x="${x + 90}" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#334155" text-anchor="middle">${label}${isRevealed ? ` (${count})` : ''}</text>`;
      const step = 150 / (count + 1);
      for (let i = 0; i < count; i++) {
        svg += `<text x="${x + 15 + step * (i + 1)}" y="102" font-size="32" text-anchor="middle">${icon}</text>`;
      }
    };
    drawSide(30, 'Box A', leftCount, leftWins);
    drawSide(250, 'Box B', rightCount, !leftWins);
    svg += `</svg>`;
    return svg;
  }

  function renderPreschoolOneMore(icon, startCount, addCount, isRevealed) {
    let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect x="30" y="25" width="210" height="115" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
    for (let i = 0; i < startCount; i++) {
      const cx = 75 + i * 60;
      svg += `<text x="${cx}" y="92" font-size="36" text-anchor="middle">${icon}</text>`;
    }
    svg += `<text x="268" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="26" font-weight="800" fill="#475569" text-anchor="middle">+</text>`;
    svg += `<rect x="295" y="25" width="130" height="115" rx="14" fill="${isRevealed ? '#ecfdf5' : '#eef2ff'}" stroke="${isRevealed ? '#059669' : '#6366f1'}" stroke-width="2.5" />`;
    svg += `<text x="360" y="92" font-size="36" text-anchor="middle">${icon}</text>`;
    if (isRevealed) {
      svg += `<text x="230" y="156" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">${startCount} + ${addCount} = ${startCount + addCount} in all</text>`;
    }
    svg += `</svg>`;
    return svg;
  }

  function renderPreschoolShapeChoices(choices, isRevealed) {
    let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
    choices.forEach((c, idx) => {
      const x = 40 + idx * 135;
      const cx = x + 55;
      const cy = 74;
      const highlight = isRevealed && c.correct;
      svg += `<rect x="${x}" y="20" width="110" height="125" rx="14" fill="${highlight ? '#ecfdf5' : '#ffffff'}" stroke="${highlight ? '#059669' : '#cbd5e1'}" stroke-width="2.5" />`;
      svg += drawShapeToken(c.shape, c.color, 24)(cx, cy);
      svg += `<text x="${cx}" y="130" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">${c.name}</text>`;
    });
    svg += `</svg>`;
    return svg;
  }

  function renderPreschoolOddOneOut(items, isRevealed) {
    let svg = `<svg viewBox="0 0 460 165" width="100%" height="165" xmlns="http://www.w3.org/2000/svg">`;
    const count = items.length;
    const boxW = count <= 3 ? 115 : 94;
    const gap = count <= 3 ? 20 : 14;
    const totalW = count * boxW + (count - 1) * gap;
    const startX = (460 - totalW) / 2;

    items.forEach((item, idx) => {
      const x = startX + idx * (boxW + gap);
      const cx = x + boxW / 2;
      const highlight = isRevealed && item.odd;
      svg += `<rect x="${x}" y="22" width="${boxW}" height="120" rx="14" fill="${highlight ? '#ecfdf5' : '#ffffff'}" stroke="${highlight ? '#059669' : '#cbd5e1'}" stroke-width="2.5" />`;
      svg += `<text x="${cx}" y="84" font-size="38" text-anchor="middle">${item.icon}</text>`;
      svg += `<text x="${cx}" y="124" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">${item.label}</text>`;
    });
    svg += `</svg>`;
    return svg;
  }

// Global Exports
(typeof window !== "undefined" ? window : global).drawPreschoolPatternRow = drawPreschoolPatternRow;
(typeof window !== "undefined" ? window : global).drawShapeToken = drawShapeToken;
(typeof window !== "undefined" ? window : global).PRESCHOOL_SLIDES = PRESCHOOL_SLIDES;
(typeof window !== "undefined" ? window : global).renderPreschoolCountingItems = renderPreschoolCountingItems;
(typeof window !== "undefined" ? window : global).renderPreschoolFiveFrame = renderPreschoolFiveFrame;
(typeof window !== "undefined" ? window : global).renderPreschoolCompareBoxes = renderPreschoolCompareBoxes;
(typeof window !== "undefined" ? window : global).renderPreschoolOneMore = renderPreschoolOneMore;
(typeof window !== "undefined" ? window : global).renderPreschoolShapeChoices = renderPreschoolShapeChoices;
(typeof window !== "undefined" ? window : global).renderPreschoolOddOneOut = renderPreschoolOddOneOut;
