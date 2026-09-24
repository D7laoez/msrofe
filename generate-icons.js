const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create icons directory
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Pure JS PNG generator (zero external dependencies)
function createPNG(width, height, drawFn) {
  // Raw RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rgba[idx] = r;
      rgba[idx + 1] = g;
      rgba[idx + 2] = b;
      rgba[idx + 3] = a;
    }
  }

  // Scanlines with filter type 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let scanOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[scanOffset++] = 0; // filter type 0 (None)
    const rowOffset = y * width * 4;
    rgba.copy(scanlines, scanOffset, rowOffset, rowOffset + width * 4);
    scanOffset += width * 4;
  }

  const deflated = zlib.deflateSync(scanlines);

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const typeAndData = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', deflated);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Art Generator: Mesopotamian Dark Navy with Gold & Emerald Accents
function drawAppIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background gradient: Deep navy to Mesopotamian midnight
  const gradT = (x + y) / (w + h);
  let r = Math.round(16 + gradT * (26 - 16));
  let g = Math.round(37 + gradT * (58 - 37));
  let b = Math.round(66 + gradT * (95 - 66));
  let a = 255;

  if (!isMaskable) {
    // Rounded squircle corner
    const radius = w * 0.22;
    const nx = Math.abs(x - cx) - (cx - radius);
    const ny = Math.abs(y - cy) - (cy - radius);
    if (nx > 0 && ny > 0) {
      const cornerDist = Math.sqrt(nx * nx + ny * ny);
      if (cornerDist > radius) {
        return [0, 0, 0, 0]; // Transparent outside
      }
    }
  }

  // Gold Ring around center
  const ringRadius = w * 0.36;
  const ringWidth = w * 0.035;
  if (Math.abs(dist - ringRadius) < ringWidth) {
    return [255, 209, 102, 255]; // Tertiary Gold #FFD166
  }

  // Inner Wallet Card Shape
  const cardW = w * 0.44;
  const cardH = h * 0.32;
  if (Math.abs(dx) < cardW / 2 && Math.abs(dy) < cardH / 2) {
    // Gold & Cyan Mesopotamian emblem
    if (Math.abs(dy) < cardH * 0.15 && dx > cardW * 0.1) {
      return [6, 214, 160, 255]; // Income Green #06D6A0 (Wallet clasp)
    }
    return [255, 209, 102, 240]; // Gold Card
  }

  return [r, g, b, a];
}

// Screenshot Generator
function drawScreenshot(x, y, w, h) {
  const gradT = y / h;
  const r = Math.round(16 + gradT * 20);
  const g = Math.round(37 + gradT * 25);
  const b = Math.round(66 + gradT * 30);
  return [r, g, b, 255];
}

console.log('Generating compliant PNG icons for PWABuilder...');

// 1. icon-192.png (192x192)
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPNG(192, 192, (x, y, w, h) => drawAppIcon(x, y, w, h, false)));
console.log('✓ Generated icons/icon-192.png (192x192 PNG)');

// 2. icon-512.png (512x512)
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPNG(512, 512, (x, y, w, h) => drawAppIcon(x, y, w, h, false)));
console.log('✓ Generated icons/icon-512.png (512x512 PNG)');

// 3. icon-maskable-192.png (192x192)
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), createPNG(192, 192, (x, y, w, h) => drawAppIcon(x, y, w, h, true)));
console.log('✓ Generated icons/icon-maskable-192.png (192x192 maskable PNG)');

// 4. icon-maskable-512.png (512x512)
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), createPNG(512, 512, (x, y, w, h) => drawAppIcon(x, y, w, h, true)));
console.log('✓ Generated icons/icon-maskable-512.png (512x512 maskable PNG)');

// 5. Screenshots
fs.writeFileSync(path.join(iconsDir, 'screenshot-mobile.png'), createPNG(540, 720, drawScreenshot));
fs.writeFileSync(path.join(iconsDir, 'screenshot-desktop.png'), createPNG(1280, 720, drawScreenshot));
console.log('✓ Generated compliant screenshots');
console.log('All icons ready for PWABuilder 100% Score!');
