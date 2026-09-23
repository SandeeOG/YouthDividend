/* Youth Dividend — line illustration library.
   Every stroke carries pathLength="1" so it can draw itself when it enters the viewport.
   White strokes = context, orange strokes/dots = the thing the story is about. */
(function () {
  const P = (d, o) => `<path d="${d}" pathLength="1"${o ? ' class="o"' : ''}/>`;
  const C = (cx, cy, r, o) => P(`M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`, o);
  const D = (cx, cy, r, o = true) => `<circle class="dot${o ? ' o' : ''}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const G = P('M0 262H400');

  const ART = {
    house: () =>
      G +
      P('M96 262V150L206 84L316 150V262') +
      P('M166 262V166L258 110L350 166V262', 1) +
      P('M236 262V206H280V262') +
      P('M374 262V72L400 55', 1) +
      D(120, 64, 7),

    bars: () =>
      G +
      P('M52 262V206H92V262') +
      P('M122 262V178H162V262') +
      P('M192 262V132H232V262') +
      P('M262 262V98H302V262') +
      P('M332 262V70H372V262') +
      P('M24 150H392', 1) +
      D(24, 150, 5),

    rooms: () =>
      P('M60 50H340V250H60Z') +
      P('M190 50V132') + P('M190 172V250') +
      P('M60 150H148') + P('M190 150H262') +
      P('M262 50V108') + P('M262 148V250', 1) +
      C(108, 96, 10) + C(124, 204, 10) + C(226, 96, 10) +
      C(228, 206, 10) + C(302, 90, 10, 1) + C(302, 204, 10),

    book: () =>
      G +
      P('M200 244C166 224 112 220 62 236V86C112 70 166 74 200 94V244') +
      P('M200 244C234 224 288 220 338 236V86C288 70 234 74 200 94') +
      P('M86 118C118 108 152 110 178 122') +
      P('M86 148C118 138 152 140 178 152') +
      P('M86 178C118 168 152 170 178 182') +
      P('M222 122C248 110 282 108 314 118', 1) +
      P('M222 152C248 140 282 138 314 148') +
      D(200, 40, 6),

    ladder: () => {
      const x1 = y => (150 + (262 - y) * (28 / 232)).toFixed(1);
      const x2 = y => (250 + (262 - y) * (28 / 232)).toFixed(1);
      let s = P('M0 262H400') + P('M150 262L178 30') + P('M250 262L278 30');
      [52, 94, 136, 178].forEach(y => { s += P(`M${x1(y)} ${y}H${x2(y)}`); });
      s += P('M40 258L128 244', 1) + D(200, 246, 9);
      return s;
    },

    grid: () => {
      const xs = [100, 200, 300], ys = [70, 150, 230];
      let s = '';
      ys.forEach(y => { s += P(`M109 ${y}H191`) + P(`M209 ${y}H291`); });
      xs.forEach(x => { s += P(`M${x} 79V141`) + P(`M${x} 159V221`); });
      ys.forEach(y => xs.forEach(x => { s += C(x, y, 9, x === 300 && y === 70); }));
      s += P('M107 223L193 157', 1) + P('M209 150H291', 1) + P('M300 141V79', 1) + D(300, 70, 4);
      return s;
    },

    pulse: () =>
      G +
      P('M20 190H120L142 140L166 238L192 96L214 190H240', 1) +
      P('M240 190H384') +
      D(192, 96, 5) +
      D(292, 168, 6, false) + D(322, 168, 6, false) + D(352, 168, 6, false),

    queue: () => {
      let s = G + P('M318 262V104H370V262') + D(330, 186, 3, false);
      [64, 124, 184, 244].forEach((x, i) => {
        const o = i === 3;
        s += C(x, 178, 11, o) + P(`M${x - 17} 262V226Q${x - 17} 204 ${x} 204Q${x + 17} 204 ${x + 17} 226V262`, o);
      });
      return s;
    },

    route: () =>
      G +
      P('M40 230C120 230 110 140 190 140S280 80 352 80', 1) +
      C(40, 230, 8) + C(190, 140, 8) + C(352, 80, 8) +
      C(300, 206, 34) + P('M300 206V184') + P('M300 206L318 216', 1) +
      D(352, 80, 4),

    phone: () =>
      P('M162 40H238Q254 40 254 56V244Q254 260 238 260H162Q146 260 146 244V56Q146 40 162 40Z') +
      P('M166 76H234') + P('M166 94H214') +
      P('M166 114H234V164H166Z', 1) +
      P('M166 184H226') + P('M166 202H204') +
      P('M280 110Q298 150 280 190', 1) + P('M300 88Q330 150 300 212', 1) +
      P('M120 110Q102 150 120 190') + P('M100 88Q70 150 100 212') +
      D(200, 240, 4),

    ballot: () =>
      G +
      P('M110 262V160H172') + P('M228 160H290V262') +
      P('M180 176V62H220V176') +
      P('M188 112L198 124L213 96', 1) +
      P('M150 212H250') +
      D(322, 62, 7),

    globe: () =>
      C(200, 150, 100) +
      P('M100 150H300') + P('M200 50V250') +
      P('M200 50C146 90 146 210 200 250') + P('M200 50C254 90 254 210 200 250') +
      P('M122 88C170 104 230 104 278 88') + P('M122 212C170 196 230 196 278 212') +
      P('M142 192C168 62 300 36 356 110', 1) +
      D(356, 110, 6) + D(142, 192, 4),

    clock: () => {
      let s = G + C(200, 136, 84);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r1 = i % 3 === 0 ? 64 : 70, r2 = 78;
        const f = n => n.toFixed(1);
        s += P(`M${f(200 + Math.sin(a) * r1)} ${f(136 - Math.cos(a) * r1)}L${f(200 + Math.sin(a) * r2)} ${f(136 - Math.cos(a) * r2)}`);
      }
      s += P('M200 136V84') + P('M200 136L250 164', 1) + D(200, 136, 4);
      return s;
    },

    wave: () =>
      G +
      P('M130 204A70 70 0 0 1 270 204', 1) +
      P('M200 110V88', 1) + P('M142 136L128 122', 1) + P('M258 136L272 122', 1) +
      P('M20 218q35 -14 70 0t70 0t70 0t70 0t70 0') +
      P('M20 242q35 -14 70 0t70 0t70 0t70 0t70 0') +
      D(200, 72, 5),

    town: () =>
      G +
      P('M34 262V212L64 186L94 212V262') +
      P('M104 262V222L130 200L156 222V262') +
      P('M156 262C214 256 236 206 292 196', 1) +
      P('M300 262V98H340V262') + P('M348 262V140H384V262') +
      P('M312 124H328') + P('M312 150H328') + P('M312 176H328') +
      D(292, 196, 5),

    screen: () =>
      P('M66 56H148V178') +
      P('M50 72H132V194H50Z') +
      P('M64 98H118') + P('M64 118H110') + P('M64 138H118') +
      P('M150 132H176', 1) +
      P('M182 76H310L262 150V224L230 240V150Z', 1) +
      D(246, 258, 5) +
      P('M300 196L344 240') + P('M344 196L300 240'),
  };

  const svg = (inner, vb = '0 0 400 300', cls = '', par = '') =>
    `<svg class="art ${cls}" viewBox="${vb}"${par ? ` preserveAspectRatio="${par}"` : ''} fill="none" aria-hidden="true" focusable="false">${inner}</svg>`;

  const hero = () => svg(
    P('M250 440V330L330 282L410 330V440') +
    D(298, 386, 6, false) + D(330, 386, 6, false) + D(362, 386, 6, false) +
    P('M430 440V214L590 110L750 214V440') +
    P('M530 440V236L668 146L806 236V440', 1) +
    P('M636 440V360H700V440') +
    P('M836 440V96L900 54', 1) +
    P('M40 440V404H120V440'),
    '0 0 900 440', 'art-hero', 'xMaxYMax meet'
  );

  /* Hero scene — "Bringing young lives to the table".
     A table under a lamp; three people already seated, one empty chair,
     and a young person (orange) who travels in and takes the seat at the centre.
     Delays (ms) are explicit so the scene reads as a short sequence. */
  const scene = () => {
    const S = (d, delay, cls = '') => `<path d="${d}" pathLength="1"${cls ? ` class="${cls}"` : ''} style="--d:${delay}"/>`;
    const dot = (cx, cy, r, delay) => `<circle class="dot" cx="${cx}" cy="${cy}" r="${r}" style="--d:${delay}"/>`;
    const person = (x, delay, i) =>
      `<g class="person" style="--b:${i}">` + dot(x, 150, 14, delay + 150) +
      S(`M${x - 30} 236C${x - 30} 194 ${x + 30} 194 ${x + 30} 236`, delay) + '</g>';
    const chair = (x, delay) => S(`M${x - 26} 236V178Q${x - 26} 166 ${x - 14} 166H${x + 14}Q${x + 26} 166 ${x + 26} 178V236`, delay);
    const talk = (d, i) => `<path class="talk" d="${d}" pathLength="1" style="--t:${i}"/>`;
    const trail = 'M20 350H170C250 350 282 112 402 94C502 80 566 104 600 150';

    return svg(
      // lamp (sways gently once drawn)
      '<g class="lamp">' +
        S('M600 0V46', 0, 'faint') + S('M572 76L586 46H614L628 76Z', 200) +
        S('M566 84L544 132', 450, 'faint') + S('M600 86V118', 500, 'faint') + S('M634 84L656 132', 450, 'faint') +
      '</g>' +
      // table
      S('M300 236H900L964 268H236Z', 300) +
      S('M236 268V282H964V268', 650) +
      S('M262 282V360', 850) + S('M938 282V360', 900) +
      S('M336 282V338', 950, 'faint') + S('M864 282V338', 1000, 'faint') +
      // papers on the table
      S('M402 248H450L455 259H397Z', 1150, 'faint') + S('M732 247H772L777 258H727Z', 1200, 'faint') +
      // people already at the table, and one chair still empty
      person(400, 1250, 0) + person(500, 1400, 1) + chair(700, 1500) + person(800, 1600, 2) +
      // the young person arrives
      S(trail, 1900, 'o trail') +
      `<circle class="traveller" r="14" cx="0" cy="0"><animateMotion begin="indefinite" dur="2.6s" fill="freeze" calcMode="spline" keyTimes="0;1" keyPoints="0;1" keySplines=".65 0 .35 1" path="${trail}"/></circle>` +
      S('M570 236C570 194 630 194 630 236', 4350, 'o') +
      S('M578 249H622L627 260H573Z', 4600, 'o') +
      // conversation, looping once everyone is seated
      talk('M414 124Q450 98 486 124', 0) + talk('M514 124Q550 98 586 124', 1) + talk('M614 122Q706 72 786 122', 2),
      '0 0 1200 360', 'art-scene'
    );
  };

  /* Minimal section rules — one small drawn motif per editorial section */
  const RULES = {
    dots: P('M0 22H136') + D(156, 22, 6) + D(176, 22, 6, false) + D(196, 22, 6, false),
    cross: P('M0 22H200') + P('M120 6V38', 1) + D(120, 22, 6),
  };
  const rule = name => svg(RULES[name] || RULES.dots, '0 0 200 44', 'rule');

  /* Small 32×32 line icons */
  const I = {
    house: P('M5 27V14L16 6l11 8v13') + P('M13 27v-7h6v7', 1),
    bars: P('M4 27h24') + P('M7 27v-6h4v6') + P('M14 27V15h4v12') + P('M21 27V8h4v19', 1),
    globe: C(16, 16, 11) + P('M5 16h22') + P('M16 5c-4.5 3-4.5 19 0 22') + P('M16 5c4.5 3 4.5 19 0 22', 1),
    book: P('M16 26c-3-2-7-2.5-11-1.5V8c4-1 8-.5 11 1.5V26') + P('M16 26c3-2 7-2.5 11-1.5V8c-4-1-8-.5-11 1.5', 1),
    ladder: P('M10 29L12 3') + P('M20 29L22 3') + P('M11.6 9h9.2') + P('M11.2 15h9.2') + P('M10.7 21h9.2', 1),
    pulse: P('M3 17h7l2-5 3 10 3-14 2 9h9', 1),
    route: P('M6 25c8 0 6-10 12-10s6-8 9-8', 1) + C(6, 25, 2.5) + C(27, 7, 2.5),
    phone: P('M11 4h10a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z') + P('M14 24h4', 1),
    people: C(11, 11, 3.5) + C(21, 11, 3.5, 1) + P('M4 26c0-4 3-7 7-7s7 3 7 7') + P('M18 20c1-.7 2-1 3-1 4 0 7 3 7 7', 1),
    check: C(16, 16, 11) + P('M11 16.5l3.5 3.5 6.5-7.5', 1),
    doc: P('M9 4h10l5 5v19H9z') + P('M19 4v5h5') + P('M13 16h8') + P('M13 21h6', 1),
  };
  const icon = name => svg(I[name] || I.house, '0 0 32 32', 'icon');

  window.YD_ART = {
    render: (name, cls) => svg((ART[name] || ART.house)(), '0 0 400 300', cls || ''),
    hero,
    scene,
    rule,
    icon,
  };
})();
