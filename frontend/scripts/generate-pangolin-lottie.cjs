#!/usr/bin/env node
/**
 * generate-pangolin-lottie.js
 * Generates a Lottie JSON animation for the Pangolin Chibi Bot
 * matching the reference art style: round head, big eyes, scale texture,
 * rosy cheeks, happy smile, sitting pose.
 *
 * Equivalent to: After Effects + Bodymovin export
 * Usage: node scripts/generate-pangolin-lottie.js
 * Output: public/assets/pangolin-bot.json
 */

const fs   = require('fs');
const path = require('path');

// ─── Color helpers ────────────────────────────────────────────────────────────
const hex2lc = h => [
  parseInt(h.slice(1,3),16)/255,
  parseInt(h.slice(3,5),16)/255,
  parseInt(h.slice(5,7),16)/255,
  1
];

// Palette matching reference images (warm golden pangolin)
const C = {
  scaleDark: '#9A6E22',  // dark scale (overlapping ovals on back/head)
  scaleMain: '#C8943A',  // main scale body colour
  bodyWarm:  '#D9A855',  // lighter warm body / head
  belly:     '#F0D5A0',  // cream belly
  limb:      '#D4A050',  // arms/legs
  brown:     '#5C3517',  // dark brown (nostrils, toes, brows)
  eye:       '#1E0C02',  // near-black eye
  cheek:     '#F4956A',  // rosy pink cheek
  snout:     '#B07040',  // snout/muzzle
  white:     '#FFFFFF',
  mouth:     '#8B4020',  // mouth line
};

const FPS    = 30;
const FRAMES = 120;  // 4-second loop

// ─── Keyframe / animation helpers ────────────────────────────────────────────
const kf = (t, s) => ({ i:{x:[0.5],y:[1]}, o:{x:[0.5],y:[0]}, t, s });

/** Oscillate a scalar between vLow and vHigh every halfPeriod frames */
function oscillate1D(vLow, vHigh, halfPeriod) {
  const k = [];
  for (let i = 0; ; i++) {
    const t = Math.round(i * halfPeriod);
    if (t > FRAMES) break;
    k.push(kf(t, [i % 2 === 0 ? vHigh : vLow]));
  }
  return { a:1, k };
}

/** Layer position Y bounce (moves up by amp px on bounce) */
function bouncePos(amp = 5, halfPeriod = 30) {
  const k = [];
  for (let i = 0; ; i++) {
    const t = Math.round(i * halfPeriod);
    if (t > FRAMES) break;
    k.push(kf(t, [0, i % 2 === 0 ? 0 : -amp]));
  }
  return { a:1, k };
}

/** Blink animation: scaleY briefly squishes to ~5% at a given frame */
function blinkScale(frame = 80) {
  return {
    a: 1,
    k: [
      kf(0,       [100, 100]),
      kf(frame-1, [100, 100]),
      kf(frame+3, [100,   5]),
      kf(frame+7, [100, 100]),
      kf(FRAMES-1,[100, 100]),
    ]
  };
}

// ─── Lottie shape primitives ──────────────────────────────────────────────────

/** Default static group transform */
const tr = (p=[0,0], a=[0,0], s=[100,100], r=0, o=100, animS=null) => ({
  ty: 'tr',
  p: { a:0, k: p },
  a: { a:0, k: a },
  s: animS || { a:0, k: s },
  r: { a:0, k: r },
  o: { a:0, k: o },
  sk: { a:0, k: 0 },
  sa: { a:0, k: 0 },
});

const fl  = (col, op=100) => ({ ty:'fl', nm:'F', c:{a:0,k:hex2lc(col)}, o:{a:0,k:op}, r:1 });
const st  = (col, w)      => ({ ty:'st', nm:'S', c:{a:0,k:hex2lc(col)}, o:{a:0,k:100}, w:{a:0,k:w}, lc:2, lj:2 });
const el  = (cx,cy,w,h)   => ({ ty:'el', nm:'E', d:1, p:{a:0,k:[cx,cy]}, s:{a:0,k:[w,h]} });

/** Simple filled ellipse group */
const eg  = (nm,cx,cy,w,h,col,op=100) => ({ ty:'gr', nm, it:[ el(cx,cy,w,h), fl(col,op), tr() ] });

/** Ellipse with animated opacity fill (for cheeks) */
const egOp = (nm,cx,cy,w,h,col,lo,hi,half) => ({
  ty:'gr', nm,
  it:[
    el(cx,cy,w,h),
    { ty:'fl', nm:'F', c:{a:0,k:hex2lc(col)}, o: oscillate1D(lo,hi,half), r:1 },
    tr()
  ]
});

/** Path (bezier) group with optional fill + stroke */
const pg = (nm, v, inn, out, closed, fillCol=null, fillOp=100, stCol=null, stW=0) => {
  const it = [{ ty:'sh', nm:'P', ks:{ a:0, k:{ i:inn, o:out, v, c:closed } } }];
  if (fillCol)       it.push(fl(fillCol, fillOp));
  if (stCol && stW)  it.push(st(stCol, stW));
  it.push(tr());
  return { ty:'gr', nm, it };
};

/** Row of scale ovals */
const scaleRow = (ys, xs, w, h, col) =>
  xs.map((x, i) => eg(`s${i}`, x, ys[i] ?? ys[0], w, h, col));

// ─── Character shapes (back → front) ─────────────────────────────────────────
function buildCharShapes() {
  const s = [];

  // ── TAIL ── (cascade of ellipses going right, with darker scales on top)
  s.push( eg('TE1', 130,150, 22,12, C.scaleMain) );
  s.push( eg('TE2', 139,138, 18, 9, C.scaleMain) );
  s.push( eg('TE3', 141,125, 13, 9, C.scaleMain) );
  s.push( eg('TE4', 136,115, 10, 8, C.scaleDark) );
  s.push( eg('TS1', 128,150, 17, 7, C.scaleDark) );
  s.push( eg('TS2', 137,138, 13, 6, C.scaleDark) );
  s.push( eg('TS3', 139,126, 10, 6, C.scaleDark) );

  // ── BODY (main) ──
  s.push( eg('Body', 100,140, 74,66, C.scaleMain) );

  // ── BODY SCALES (4 rows of overlapping darker ovals) ──
  const bScales = [
    { y:158, xs:[83,100,117],          w:18, h:13 },
    { y:147, xs:[79,95,111,127],       w:17, h:12 },
    { y:136, xs:[80,96,112,128],       w:17, h:12 },
    { y:125, xs:[85,100,115],          w:16, h:12 },
  ];
  for (const row of bScales) {
    for (const x of row.xs) s.push( eg('bs', x, row.y, row.w, row.h, C.scaleDark) );
  }

  // ── BELLY ──
  s.push( eg('Belly', 100,152, 44,40, C.belly) );

  // ── ARMS ──
  s.push( eg('ArmL', 71,150, 18,32, C.limb) );
  s.push( eg('ArmR', 129,150, 18,32, C.limb) );

  // ── CLASPED HANDS ──
  s.push( eg('HandsO', 100,167, 38,18, C.limb)  );
  s.push( eg('HandsI', 100,166, 30,13, C.belly) );
  // Paw knuckle line
  s.push( pg('PawLine',
    [[85,166],[100,173],[115,166]],
    [[-6,0],[0,-3],[6,0]],
    [[6,3],[0,3],[-6,3]],
    false, null, 100, C.scaleDark, 1.5
  ));

  // ── LEGS ──
  s.push( eg('LegL', 80,175, 22,16, C.limb) );
  s.push( eg('LegR', 120,175, 22,16, C.limb) );
  // Toes
  for (const x of [73,79,85])  s.push( eg('tL',x,179, 6,5, C.brown) );
  for (const x of [115,121,127]) s.push( eg('tR',x,179, 6,5, C.brown) );

  // ── HEAD (large chibi — overlaps body) ──
  s.push( eg('Head', 100,79, 88,84, C.bodyWarm) );

  // ── HEAD SCALES (3 rows across upper head) ──
  const hScales = [
    { ys:[51,49,49,51], xs:[75,92,109,124], w:19, h:14 },
    { ys:[63,61,61,63], xs:[73,90,109,124], w:20, h:14 },
    { ys:[74,72,72,75], xs:[79,96,115,129], w:18, h:13 },
  ];
  for (const row of hScales) {
    row.xs.forEach((x, i) => s.push( eg('hs', x, row.ys[i], row.w, row.h, C.scaleDark) ));
  }

  // ── EARS ──
  s.push( eg('EarL',    67, 49, 26,30, C.scaleMain) );
  s.push( eg('EarR',   133, 49, 26,30, C.scaleMain) );
  s.push( eg('EarInL',  67, 50, 16,19, C.bodyWarm) );
  s.push( eg('EarInR', 133, 50, 16,19, C.bodyWarm) );

  // ── CHEEKS (animated opacity pulse) ──
  s.push( egOp('CheekL',  78,91, 28,17, C.cheek, 33,62, 37) );
  s.push( egOp('CheekR', 122,91, 28,17, C.cheek, 33,62, 37) );

  // ── SNOUT ──
  s.push( eg('Snout',  100, 96, 32,22, C.snout)   );
  s.push( eg('Bridge', 100, 89, 22,14, C.bodyWarm) );
  s.push( eg('NostL',  93, 95,  5, 4,  C.brown)   );
  s.push( eg('NostR', 107, 95,  5, 4,  C.brown)   );

  // ── MOUTH (happy open smile) ──
  // White teeth area
  s.push( eg('Teeth', 100,105, 18, 9, C.white) );
  // Smile arc (stroke only)
  s.push( pg('Smile',
    [[88,101],[100,112],[112,101]],
    [[-5,0],[0,-4],[5,0]],
    [[5,5],[0,5],[-5,5]],
    false, null, 100, C.mouth, 2.8
  ));

  // ── EYEBROWS / forehead marks ──
  s.push( eg('BrowL',  84,64, 11,4, C.brown, 70) );
  s.push( eg('BrowR', 116,64, 11,4, C.brown, 70) );

  return s;
}

// ─── Eye shapes (separate layer for clean blink animation) ───────────────────
function buildEyeShapes() {
  // Each eye is a group of nested sub-groups (separate fills)
  // Outer group has animated scaleY for blink, pivoting from eye center

  const eyeGroup = (nm, cx, cy, shine1x, shine1y, shine2x, shine2y, blinkFrame) => ({
    ty: 'gr', nm,
    it: [
      // Dark iris
      { ty:'gr', nm:'Ball', it:[ el(cx,cy,24,26), fl(C.eye), tr() ] },
      // Large shine (top-left of eye)
      { ty:'gr', nm:'Sh1',  it:[ el(shine1x,shine1y,11,11), fl(C.white), tr() ] },
      // Small secondary shine
      { ty:'gr', nm:'Sh2',  it:[ el(shine2x,shine2y, 5, 5), fl(C.white,65), tr() ] },
      // Blink transform — pivot at eye center [cx,cy], p=[0,0] = no offset
      tr([0,0], [cx,cy], [100,100], 0, 100, blinkScale(blinkFrame))
    ]
  });

  return [
    eyeGroup('EyeL',  84,80,  79,74,  89,84, 82),
    eyeGroup('EyeR', 116,80, 111,74, 121,84, 82),
  ];
}

// ─── Layer ks (transform) ────────────────────────────────────────────────────
const staticKs = () => ({
  o: { a:0, k:100 },
  r: { a:0, k:0 },
  p: { a:0, k:[0,0] },
  a: { a:0, k:[0,0] },
  s: { a:0, k:[100,100] },
});

const bounceKs = (amp=5, half=30) => ({
  ...staticKs(),
  p: bouncePos(amp, half),
});

// ─── Assemble Lottie JSON ────────────────────────────────────────────────────
const lottie = {
  v:   '5.9.0',
  fr:  FPS,
  ip:  0,
  op:  FRAMES,
  w:   200,
  h:   200,
  nm:  'Pangolin Chibi Bot',
  ddd: 0,
  assets: [],
  layers: [
    // Layer 1: Ground shadow (static, behind everything)
    {
      ddd:0, ind:1, ty:4, nm:'Shadow', sr:1, bm:0,
      ks: staticKs(),
      ip:0, op:FRAMES, st:0,
      shapes: [ eg('Sh', 100,191, 60,10, '#000000', 14) ]
    },
    // Layer 2: Character body (with idle bounce)
    {
      ddd:0, ind:2, ty:4, nm:'Character', sr:1, bm:0,
      ks: bounceKs(5, 30),
      ip:0, op:FRAMES, st:0,
      shapes: buildCharShapes()
    },
    // Layer 3: Eyes (same bounce + blink animation in group)
    {
      ddd:0, ind:3, ty:4, nm:'Eyes', sr:1, bm:0,
      ks: bounceKs(5, 30),
      ip:0, op:FRAMES, st:0,
      shapes: buildEyeShapes()
    }
  ]
};

// ─── Write output ────────────────────────────────────────────────────────────
const outDir  = path.resolve(__dirname, '..', 'public', 'assets');
const outPath = path.join(outDir, 'pangolin-bot.json');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(lottie));

const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`✅  Pangolin Lottie JSON generated successfully!`);
console.log(`📁  ${outPath}`);
console.log(`📦  Size: ${kb} KB`);
console.log(`🎬  ${FRAMES} frames @ ${FPS}fps = ${FRAMES/FPS}s loop`);
console.log(`✨  Animations: idle bounce · blink · cheek pulse · tail`);
