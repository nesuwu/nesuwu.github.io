// Soft color theme setup (randomized on each page load)
const softThemeSeeds = [
  { name: 'mint', bgHue: 154, accentHue: 164 },
  { name: 'sage', bgHue: 98, accentHue: 112 },
  { name: 'sky', bgHue: 204, accentHue: 190 },
  { name: 'lavender', bgHue: 246, accentHue: 232 },
  { name: 'peach', bgHue: 28, accentHue: 16 },
  { name: 'rose', bgHue: 334, accentHue: 346 },
];

const random = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function normalizeHue(value) {
  return ((value % 360) + 360) % 360;
}

function hslToHex(h, s, l) {
  const hue = normalizeHue(h) / 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;

  if (sat === 0) {
    const gray = Math.round(light * 255);
    const part = gray.toString(16).padStart(2, '0');
    return `#${part}${part}${part}`;
  }

  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;

  const hueToRgb = (t) => {
    let channel = t;
    if (channel < 0) channel += 1;
    if (channel > 1) channel -= 1;
    if (channel < 1 / 6) return p + (q - p) * 6 * channel;
    if (channel < 1 / 2) return q;
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
    return p;
  };

  const r = Math.round(hueToRgb(hue + 1 / 3) * 255);
  const g = Math.round(hueToRgb(hue) * 255);
  const b = Math.round(hueToRgb(hue - 1 / 3) * 255);

  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const value = clean.length === 3
    ? clean.split('').map((char) => char + char).join('')
    : clean;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbaFromHex(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

function createAccentShades(accentHue, saturation, lightness) {
  return {
    100: hslToHex(accentHue, saturation - 22, lightness + 28),
    200: hslToHex(accentHue, saturation - 16, lightness + 20),
    300: hslToHex(accentHue, saturation - 10, lightness + 12),
    400: hslToHex(accentHue, saturation - 4, lightness + 6),
    500: hslToHex(accentHue, saturation, lightness),
    600: hslToHex(accentHue, saturation + 2, lightness - 8),
    700: hslToHex(accentHue, saturation + 4, lightness - 16),
  };
}

function applyRandomSoftTheme() {
  const seed = softThemeSeeds[Math.floor(Math.random() * softThemeSeeds.length)];
  const bgHue = normalizeHue(seed.bgHue + random(-7, 7));
  const accentHue = normalizeHue(seed.accentHue + random(-8, 8));

  const accentSat = random(44, 58);
  const accentLight = random(62, 70);
  const shades = createAccentShades(accentHue, accentSat, accentLight);

  const colors = {
    background: hslToHex(bgHue, random(20, 30), random(11, 16)),
    backgroundDeep: hslToHex(bgHue + random(-6, 6), random(24, 34), random(7, 11)),
    card: hslToHex(bgHue + random(-4, 4), random(18, 30), random(17, 24)),
    cardHover: hslToHex(bgHue + random(-4, 4), random(22, 34), random(25, 32)),
    text: hslToHex(bgHue + 28, random(18, 28), random(88, 94)),
    accent: shades[500],
    accentGlow: rgbaFromHex(shades[500], 0.44),
    accentSoft: rgbaFromHex(shades[500], 0.12),
    accentSoftStrong: rgbaFromHex(shades[500], 0.2),
    shadowSoft: rgbaFromHex(shades[500], 0.14),
    heroStart: rgbaFromHex(hslToHex(bgHue, 28, 12), 0.9),
    heroEnd: rgbaFromHex(hslToHex(bgHue + 4, 26, 18), 0.95),
  };

  const root = document.documentElement;
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-background-deep', colors.backgroundDeep);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-glow', colors.accentGlow);
  root.style.setProperty('--color-card', colors.card);
  root.style.setProperty('--color-card-hover', colors.cardHover);
  root.style.setProperty('--color-accent-soft', colors.accentSoft);
  root.style.setProperty('--color-accent-soft-strong', colors.accentSoftStrong);
  root.style.setProperty('--color-shadow-soft', colors.shadowSoft);
  root.style.setProperty('--color-hero-gradient-start', colors.heroStart);
  root.style.setProperty('--color-hero-gradient-end', colors.heroEnd);
  root.style.setProperty('--color-accent-100', shades[100]);
  root.style.setProperty('--color-accent-200', shades[200]);
  root.style.setProperty('--color-accent-300', shades[300]);
  root.style.setProperty('--color-accent-400', shades[400]);
  root.style.setProperty('--color-accent-500', shades[500]);
  root.style.setProperty('--color-accent-600', shades[600]);
  root.style.setProperty('--color-accent-700', shades[700]);

  return {
    leafColor: shades[400],
  };
}

const selectedTheme = applyRandomSoftTheme();

// Canvas setup
const canvas = document.getElementById('fallingLeaves');
const ctx = canvas.getContext('2d');

// Check if device is mobile
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// Configuration
const config = {
  leafCount: isMobile ? 80 : 300,
  leafColor: selectedTheme.leafColor,
  windSpeed: 0.05,
  windVariation: 0.1,
  fallingSpeed: { min: 0.05, max: 0.1 },
  rotationRange: { min: -0.8, max: 0.8 },
  swayFrequency: { min: 0.002, max: 0.004 },
  size: { min: 20, max: 40 },
  swayAmount: 0.1,
};

// Animation state
let lastTime = 0;
let animationFrame;
let isPageVisible = true;

// Leaf images array and loading state
let leafImages = [];
let isLoading = true;
let leaves = [];
// Track canvas CSS pixel size (separate from backing store size)
let canvasCssWidth = 0;
let canvasCssHeight = 0;

// Handle page visibility
document.addEventListener('visibilitychange', () => {
  isPageVisible = document.visibilityState === 'visible';
  
  if (isPageVisible) {
    lastTime = performance.now();
    if (!animationFrame) {
      animate(lastTime);
    }
  } else if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  const wasMobile = config.leafCount === 80;
  const isMobileNow = window.matchMedia('(max-width: 768px)').matches;
  
  // Only update if the device type changed
  if (wasMobile !== isMobileNow) {
    config.leafCount = isMobileNow ? 80 : 300;
    // Reinitialize leaves with new count
    leaves = Array.from({ length: config.leafCount }, () => {
      const leaf = new Leaf();
      leaf.reset(true);
      return leaf;
    });
  }
  
  setCanvasSize();
  leaves.forEach(leaf => {
    if (leaf.x > canvas.width) {
      leaf.reset();
    }
  });
});

// Initialize canvas size with proper DPI handling
function setCanvasSize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvasCssWidth = rect.width;
  canvasCssHeight = rect.height;

  canvas.width = canvasCssWidth * dpr;
  canvas.height = canvasCssHeight * dpr;
  
  // Reset transform before applying DPR scale so coordinates stay in CSS pixels
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.lineWidth = 2;
}

// Load leaf images
const leafImageUrls = [
  'leaves/leaf1.png',
  'leaves/leaf2.png',
  'leaves/leaf3.png',
  'leaves/leaf4.png',
  'leaves/leaf5.png',
];

let loadedImages = 0;
leafImageUrls.forEach(url => {
  const img = new Image();
  img.onload = () => {
    loadedImages++;
    leafImages.push(createTintedLeaf(img));
    if (loadedImages === leafImageUrls.length) {
      isLoading = false;
      initLeaves();
      animate(performance.now());
    }
  };
  img.src = url;
});

// Create a tinted version of the leaf
function createTintedLeaf(originalImage) {
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');
  
  offCanvas.width = originalImage.width;
  offCanvas.height = originalImage.height;
  
  // Draw original image
  offCtx.drawImage(originalImage, 0, 0);
  
  // Get image data
  const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
  const data = imageData.data;
  
  // Convert hex color to RGB
  const color = config.leafColor;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // Tint the image
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha > 0) {
      // Keep some of the original color for texture
      const factor = 0.8;
      data[i] = Math.round(r * factor + data[i] * (1 - factor));
      data[i + 1] = Math.round(g * factor + data[i + 1] * (1 - factor));
      data[i + 2] = Math.round(b * factor + data[i + 2] * (1 - factor));
    }
  }
  
  // Put the tinted image data back
  offCtx.putImageData(imageData, 0, 0);
  
  return offCanvas;
}

// Initialize leaves
function initLeaves() {
  leaves = Array.from({ length: config.leafCount }, () => {
    const leaf = new Leaf();
    leaf.reset(true);
    return leaf;
  });
}

// Leaf class
class Leaf {
  constructor() {
    this.reset();
  }

  reset(initialSpawn = false) {
    this.image = leafImages[Math.floor(Math.random() * leafImages.length)];
    this.size = random(config.size.min, config.size.max);
    this.x = random(0, canvasCssWidth);
    
    // If it's initial spawn, distribute leaves across the screen
    // Otherwise, reset them above the viewport
    if (initialSpawn) {
      this.y = random(-canvasCssHeight, canvasCssHeight);
    } else {
      this.y = -this.size - random(0, canvasCssHeight * 0.5);
    }
    
    this.speedY = random(config.fallingSpeed.min, config.fallingSpeed.max);
    this.speedX = 0;
    this.baseAngle = random(-0.4, 0.4);
    this.rotationRange = random(config.rotationRange.min, config.rotationRange.max);
    this.swayOffset = random(0, Math.PI * 2);
    this.swaySpeed = random(config.swayFrequency.min, config.swayFrequency.max);
    this.opacity = random(0.6, 1);
  }

  update(deltaTime) {
    // Update position with smoother movement
    this.y += this.speedY * deltaTime;
    
    // Gentler wind effect
    this.swayOffset += this.swaySpeed * deltaTime;
    this.speedX = (Math.sin(this.swayOffset) * config.swayAmount) * 0.5;
    this.x += (this.speedX + config.windSpeed * 0.2) * deltaTime;

    // Gentle swaying rotation
    this.angle = this.baseAngle + Math.sin(this.swayOffset) * this.rotationRange;

    // Reset when leaf hits the bottom of the document
    if (this.y > document.documentElement.scrollHeight) {
      this.y = -this.size - random(0, 50);
      this.x = random(-50, document.documentElement.clientWidth + 50);
      this.speedY = random(config.fallingSpeed.min, config.fallingSpeed.max);
      this.baseAngle = random(-0.4, 0.4);
      this.rotationRange = random(config.rotationRange.min, config.rotationRange.max);
      this.swayOffset = random(0, Math.PI * 2);
      this.swaySpeed = random(config.swayFrequency.min, config.swayFrequency.max);
    }

    // Only wrap horizontally
    if (this.x > canvasCssWidth + this.size) {
      this.x = -this.size;
    } else if (this.x < -this.size) {
      this.x = canvasCssWidth + this.size;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    
    const scale = this.size / this.image.width;
    ctx.drawImage(
      this.image,
      -this.image.width * scale / 2,
      -this.image.height * scale / 2,
      this.image.width * scale,
      this.image.height * scale
    );
    
    ctx.restore();
  }
}

// Animation loop
function animate(currentTime) {
  if (!isPageVisible) {
    animationFrame = null;
    return;
  }

  if (isLoading) {
    animationFrame = requestAnimationFrame(animate);
    return;
  }

  const deltaTime = Math.min((currentTime - lastTime) || 16.67, 32); // Cap at 32ms to prevent huge jumps
  lastTime = currentTime;

  ctx.clearRect(0, 0, canvasCssWidth, canvasCssHeight);

  leaves.forEach(leaf => {
    leaf.update(deltaTime);
    leaf.draw();
  });

  animationFrame = requestAnimationFrame(animate);
}

// Initial setup
setCanvasSize();
