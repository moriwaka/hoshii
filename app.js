const DEFAULT_TEXT = '5000兆円';
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;

export function displayText(value) {
  const text = value.trim() || DEFAULT_TEXT;
  return /欲しい[！!]?$/.test(text) ? text.replace(/！/g, '!') : `${text}欲しい!`;
}

export function fitFontSize(text, availableWidth, maximum) {
  const estimatedCharacterWidth = maximum * 0.92;
  return Math.max(48, Math.min(maximum, Math.floor(availableWidth / Math.max(text.length, 1) / 0.92)));
}

function font(size) {
  return `900 ${size}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`;
}

function drawOutlinedText(ctx, text, x, y, size, fill, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.font = font(size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#201a17';
  ctx.lineWidth = Math.max(12, size * .11);
  ctx.strokeText(text, 0, 0);
  ctx.strokeStyle = '#fffaf0';
  ctx.lineWidth = Math.max(6, size * .045);
  ctx.strokeText(text, 0, 0);
  ctx.fillStyle = fill;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawBackground(ctx) {
  ctx.fillStyle = '#f5e6b9';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.save();
  ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  for (let i = 0; i < 24; i += 1) {
    ctx.rotate(Math.PI / 12);
    ctx.fillStyle = i % 2 ? '#f2bf43' : '#f8d66d';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(2000, -42);
    ctx.lineTo(2000, 42);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,.48)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function fittedCanvasSize(ctx, text, width, max) {
  let size = fitFontSize(text, width, max);
  ctx.font = font(size);
  while (ctx.measureText(text).width > width && size > 48) {
    size -= 2;
    ctx.font = font(size);
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

  const mainSize = fittedCanvasSize(ctx, headline, 1360, 245);
  const shadowSize = Math.max(64, Math.floor(mainSize * .46));
  ctx.save();
  ctx.globalAlpha = .25;
  drawOutlinedText(ctx, headline, 812, 506, mainSize, '#b92323', -.045);
  ctx.restore();
  drawOutlinedText(ctx, headline, 790, 462, mainSize, '#e53930', -.045);
  drawOutlinedText(ctx, '欲しい!', 1045, 672, shadowSize, '#f4bf2e', .08);
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
  update();
}

if (typeof document !== 'undefined') setup();
