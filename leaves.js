// leaves.js

const canvas = document.getElementById('fallingLeaves');
const ctx = canvas.getContext('2d');
const leaves = [];
const leafImages = [];
const tintedLeaves = [];
const numberOfLeaves = 100;

// Predefined leaf image filenames
const leafImageFilenames = [
  'leaf1.png',
  'leaf2.png',
  'leaf3.png',
  'leaf4.png',
  'leaf5.png'
];

// Use dark green color for leaves
const leafColor = '#006400'; // Dark green

// Utility function to generate a random number within a range
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Load all leaf images and overlay them with dark green color
function loadAndOverlayLeaves() {
  return new Promise((resolve, reject) => {
    let loadedImages = 0;
    const totalImages = leafImageFilenames.length;

    leafImageFilenames.forEach((filename, index) => {
      const img = new Image();
      img.src = `leaves/${filename}`;
      img.onload = () => {
        leafImages.push(img);
        overlayLeafImage(img, index);
        loadedImages++;
        if (loadedImages === totalImages) {
          resolve();
        }
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: leaves/${filename}`));
      };
    });
  });
}

// Overlay leaf image with dark green color while preserving transparency
function overlayLeafImage(image, index) {
  const offCanvas = document.createElement('canvas');
  offCanvas.width = image.width;
  offCanvas.height = image.height;
  const offCtx = offCanvas.getContext('2d');

  // Draw the original image
  offCtx.drawImage(image, 0, 0, image.width, image.height);

  // Set globalCompositeOperation to 'source-atop' to preserve transparency
  offCtx.globalCompositeOperation = 'source-atop';
  offCtx.fillStyle = leafColor;
  offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);

  // Reset composite operation
  offCtx.globalCompositeOperation = 'source-over';

  tintedLeaves.push({
    image: offCanvas,
    color: leafColor,
    index: index
  });
}

// Function to get a random tinted leaf image
function getRandomTintedLeaf() {
  const index = Math.floor(Math.random() * tintedLeaves.length);
  return tintedLeaves[index].image;
}

// Leaf class
class Leaf {
  constructor() {
    this.reset();
  }

  reset() {
    this.image = getRandomTintedLeaf();
    this.width = randomRange(50, 100); // Scale down from 200px
    this.height = this.width; // Maintain aspect ratio
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height; // Start above the canvas
    this.speed = randomRange(1, 3); // Falling speed
    this.angle = randomRange(0, Math.PI * 2); // Initial rotation angle
    this.rotationSpeed = randomRange(-0.02, 0.02); // Speed of rotation
    this.sway = randomRange(0.5, 2); // Amplitude of horizontal sway
    this.swayAngle = Math.random() * Math.PI * 2; // Initial phase for sway
  }

  update() {
    this.y += this.speed;
    this.angle += this.rotationSpeed;

    // Update horizontal position with sway
    this.swayAngle += 0.02;
    this.x += Math.sin(this.swayAngle) * this.sway * 0.5;

    // Reset leaf if it goes beyond the canvas boundaries
    if (
      this.y > canvas.height + this.height ||
      this.x < -this.width ||
      this.x > canvas.width + this.width
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

// Initialize canvas size
function setCanvasSize() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.scrollHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Initialize leaves
function initLeaves() {
  for (let i = 0; i < numberOfLeaves; i++) {
    leaves.push(new Leaf());
  }
  animate();
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  leaves.forEach((leaf) => {
    leaf.update();
    leaf.draw();
  });

  requestAnimationFrame(animate);
}

// Start the animation once all images are loaded
window.onload = async () => {
  try {
    await loadAndOverlayLeaves();
    initLeaves();
  } catch (error) {
    console.error(error);
  }
};
