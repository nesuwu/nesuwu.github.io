// Canvas setup
const canvas = document.getElementById('fallingLeaves');
const ctx = canvas.getContext('2d');

// Check if device is mobile
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// Configuration
const config = {
  leafCount: isMobile ? 80 : 300,
  leafColor: '#2aff95',
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

// Utility functions
const random = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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
