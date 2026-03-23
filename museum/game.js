const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define the total size of your museum
const museumWidth = window.innerWidth;
const museumHeight = 3500; 

canvas.width = museumWidth;
canvas.height = museumHeight;

// Player setup
let playerX = museumWidth / 2;
let playerY = 100; 
const playerSpeed = 8; // Adjust this to make walking faster or slower

// --- NEW: Track which keys are currently being pressed ---
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Define the museum
const museumLayout = [
    { x: 200, y: 0, w: 600, h: 800, color: '#3a3a50' }, 
    { x: 180, y: 0, w: 20, h: 800, color: '#111118' },  
    { x: 800, y: 0, w: 20, h: 800, color: '#111118' },  
    { x: 350, y: 800, w: 300, h: 1200, color: '#4a4a60' }, 
    { x: 330, y: 800, w: 20, h: 1200, color: '#111118' }, 
    { x: 650, y: 800, w: 20, h: 1200, color: '#111118' }, 
    { x: 100, y: 2000, w: 800, h: 1000, color: '#5a5a70' },
    { x: 100, y: 2000, w: 230, h: 20, color: '#111118' },
    { x: 650, y: 2000, w: 250, h: 20, color: '#111118' },
    { x: 80, y: 2000, w: 20, h: 1000, color: '#111118' },
    { x: 900, y: 2000, w: 20, h: 1000, color: '#111118' }
];

function drawMuseum() {
    museumLayout.forEach(rect => {
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    });
}

function update() {
    // --- NEW: Smooth, frame-based movement ---
    // If a key is held down, move the player. 
    if (keys.up && playerY > 0) playerY -= playerSpeed;
    if (keys.down && playerY < museumHeight) playerY += playerSpeed;
    if (keys.left) playerX -= playerSpeed;
    if (keys.right) playerX += playerSpeed;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMuseum();

    ctx.fillStyle = '#ff5555';
    ctx.fillRect(playerX - 16, playerY - 16, 32, 32); 

    // Force the browser to scroll with the player
    window.scrollTo(0, playerY - (window.innerHeight / 2));

    requestAnimationFrame(update);
}

// Center the camera initially
window.scrollTo(0, playerY - (window.innerHeight / 2));

// --- NEW: Input Listeners for WASD and Arrows ---

// When a key is pressed down, flip its switch to true
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase(); // .toLowerCase() makes 'W' and 'w' act the same
    
    if (key === 'arrowup' || key === 'w') keys.up = true;
    if (key === 'arrowdown' || key === 's') keys.down = true;
    if (key === 'arrowleft' || key === 'a') keys.left = true;
    if (key === 'arrowright' || key === 'd') keys.right = true;

    // Stop the browser from trying to scroll using its default arrow key behavior 
    // so it doesn't fight against our custom smooth scrolling
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
    }
});

// When a key is let go, flip its switch back to false
window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'arrowup' || key === 'w') keys.up = false;
    if (key === 'arrowdown' || key === 's') keys.down = false;
    if (key === 'arrowleft' || key === 'a') keys.left = false;
    if (key === 'arrowright' || key === 'd') keys.right = false;
});

// Start the game loop
update();