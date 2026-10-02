const DEFAULT_TEXT = '5000兆円';
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;

export function displayText(value) {
  const text = value.trim() || DEFAULT_TEXT;
  return /欲しい[！!]?$/.test(text) ? text.replace(/！/g, '!') : `${text}欲しい!`;
}

export function fitFontSize(text, availableWidth, maximum, measuredWidth) {
  const width = measuredWidth ?? Math.max(Array.from(text).length, 1) * maximum * .92;
  return Math.max(1, Math.min(maximum, Math.floor(maximum * availableWidth / Math.max(width, 1))));
}

function font(size, silver = false) {
  return silver
    ? `900 ${size}px "Noto Serif JP", "Noto Serif CJK JP", "Yu Mincho", serif`
    : `900 ${size}px "Noto Sans JP", "Noto Sans CJK JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`;
}

function metallicGradient(ctx, top, bottom, colors) {
  const gradient = ctx.createLinearGradient(0, top, 0, bottom);
  colors.forEach(([stop, color]) => gradient.addColorStop(stop, color));
  return gradient;
}

function drawOutlinedText(ctx, text, x, y, size, silver = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-.025);
  ctx.transform(1, 0, -.38, 1, 0, 0);
  ctx.font = font(size, silver);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  const metrics = ctx.measureText(text);
  const top = -metrics.actualBoundingBoxAscent;
  const bottom = metrics.actualBoundingBoxDescent;
  const gradient = colors => metallicGradient(ctx, top, bottom, colors);
  const chrome = gradient([
    [0, '#f9ffff'], [.18, '#91a6ba'], [.35, '#effbff'], [.47, '#293448'],
    [.5, '#e1f7ff'], [.73, '#faffff'], [.83, '#6b819a'], [1, '#e2f5ff'],
  ]);
  const gold = gradient([
    [0, '#ffffdc'], [.2, '#ffe651'], [.43, '#ae4300'], [.49, '#fffda4'],
    [.55, '#fff23d'], [.85, '#e88100'], [1, '#fffbc1'],
  ]);
  const depth = Math.max(7, Math.round(size * .065));
  ctx.lineWidth = size * .13;
  // Solid extrusion keeps the edges crisp, including on transparent PNGs.
  for (let offset = depth; offset > 0; offset -= 2) {
    ctx.strokeStyle = offset > depth - 4 ? '#08090b' : chrome;
    ctx.strokeText(text, offset * .25, offset);
    ctx.fillStyle = '#12151a';
    ctx.fillText(text, offset * .25, offset);
  }

  for (const [width, color] of [[.13, '#06080c'], [.106, chrome], [.083, '#10151d'], [.062, silver ? chrome : gold], [.034, '#fff9d9'], [.018, silver ? '#35506b' : '#820400']]) {
    ctx.lineWidth = size * width;
    ctx.strokeStyle = color;
    ctx.strokeText(text, 0, 0);
  }
  ctx.fillStyle = gradient(silver ? [
    [0, '#fff'], [.25, '#fff'], [.46, '#d7f0fa'], [.49, '#9fbed0'],
    [.51, '#f9ffff'], [.78, '#fff'], [1, '#bed9e8'],
  ] : [
    [0, '#ff3405'], [.15, '#ff1400'], [.48, '#d00000'], [.49, '#ff2609'],
    [.62, '#c10000'], [.83, '#570004'], [1, '#070003'],
  ]);
  // A narrow matching stroke gives fallback Japanese fonts a heavier face.
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = size * .012;
  ctx.strokeText(text, 0, 0);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawBackground(ctx) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function fittedCanvasSize(ctx, text, width, max, silver = false) {
  ctx.font = font(max, silver);
  let size = fitFontSize(text, width, max, ctx.measureText(text).width);
  ctx.font = font(size, silver);
  while (ctx.measureText(text).width > width && size > 1) {
    size -= 1;
    ctx.font = font(size, silver);
  }
  return size;
}

export function render(canvas, value, transparent) {
  const ctx = canvas.getContext('2d');
  const text = displayText(value);
  const suffix = '欲しい!';
  const headline = text.endsWith(suffix) ? text.slice(0, -suffix.length) : text;
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (!transparent) drawBackground(ctx);

  const mainSize = fittedCanvasSize(ctx, headline, 1270, 320);
  const suffixSize = fittedCanvasSize(ctx, suffix, 900, 290, true);
  drawOutlinedText(ctx, headline, 780, 300, mainSize);
  drawOutlinedText(ctx, suffix, 1010, 610, suffixSize, true);
}

function setup() {
  const canvas = document.querySelector('#preview');
  const amount = document.querySelector('#amount');
  const transparent = document.querySelector('#transparent');
  const sample = document.querySelector('#sample-button');
  const download = document.querySelector('#download-button');
  const notice = document.querySelector('#notice');
  const update = () => render(canvas, amount.value, transparent.checked);

  amount.addEventListener('input', update);
  transparent.addEventListener('change', update);
  sample.addEventListener('click', () => {
    amount.value = '3億円';
    amount.focus();
    update();
  });
  download.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = '5000choen-hoshii.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    notice.textContent = 'PNGを保存しました';
  });
  document.fonts.ready.then(update);
  update();
}

if (typeof document !== 'undefined') setup();
