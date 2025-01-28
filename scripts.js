// Canvas setup
const canvas = document.getElementById('fallingLeaves');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
  leafCount: 200,
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

// Initialize canvas size with proper DPI handling
function setCanvasSize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  ctx.lineWidth = 2;
}

// Load leaf images
async function loadLeafImages() {
  const imageUrls = [
    'leaves/leaf1.png',
    'leaves/leaf2.png',
    'leaves/leaf3.png',
    'leaves/leaf4.png',
    'leaves/leaf5.png',
  ];

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(createTintedLeaf(img));
      img.onerror = reject;
      img.src = url;
    });
  };

  try {
    leafImages = await Promise.all(imageUrls.map(loadImage));
    isLoading = false;
    initLeaves();
  } catch (error) {
    console.error('Error loading leaf images:', error);
  }
}

// Create a tinted version of the leaf
function createTintedLeaf(originalImage) {
  const offCanvas = document.createElement('canvas');
  offCanvas.width = originalImage.width;
  offCanvas.height = originalImage.height;
  const offCtx = offCanvas.getContext('2d');

  // Draw the original image
  offCtx.drawImage(originalImage, 0, 0);

  // Get image data for processing
  const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
  const data = imageData.data;

  // Convert leaf color to RGB
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.fillStyle = config.leafColor;
  tempCtx.fillRect(0, 0, 1, 1);
  const colorData = tempCtx.getImageData(0, 0, 1, 1).data;
  const [r, g, b] = [colorData[0], colorData[1], colorData[2]];

  // Apply tint while preserving transparency
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      data[i] = (data[i] * r) / 255;
      data[i + 1] = (data[i + 1] * g) / 255;
      data[i + 2] = (data[i + 2] * b) / 255;
    }
  }

  offCtx.putImageData(imageData, 0, 0);
  return offCanvas;
}

// Leaf class
class Leaf {
  constructor() {
    this.reset();
  }

  reset(initialSpawn = false) {
    this.image = leafImages[Math.floor(Math.random() * leafImages.length)];
    this.size = random(config.size.min, config.size.max);
    this.x = random(0, canvas.width);
    
    // If it's initial spawn, distribute leaves across the screen
    // Otherwise, reset them above the viewport
    if (initialSpawn) {
      this.y = random(-canvas.height, canvas.height);
    } else {
      this.y = -this.size - random(0, canvas.height * 0.5);
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
    if (this.x > canvas.width + this.size) {
      this.x = -this.size;
    } else if (this.x < -this.size) {
      this.x = canvas.width + this.size;
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

// Leaves array and animation state
function initLeaves() {
  leaves = Array.from({ length: config.leafCount }, () => {
    const leaf = new Leaf();
    leaf.reset(true); // Pass true for initial spawn
    return leaf;
  });
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  leaves.forEach(leaf => {
    leaf.update(deltaTime);
    leaf.draw();
  });

  animationFrame = requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('resize', () => {
  setCanvasSize();
  leaves.forEach(leaf => {
    if (leaf.x > canvas.width) {
      leaf.reset();
    }
  });
});

// Initialize everything
setCanvasSize();
loadLeafImages();
animate(0);
