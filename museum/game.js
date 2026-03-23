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

// Define the museum (added the 'solid' property)
const museumLayout = [
    // --- ENTRANCE HALL ---
    { x: 200, y: 0, w: 600, h: 800, color: '#3a3a50', solid: false }, // Floor
    { x: 180, y: 0, w: 20, h: 800, color: '#111118', solid: true },  // Left Wall
    { x: 800, y: 0, w: 20, h: 800, color: '#111118', solid: true },  // Right Wall

    // --- LONG CORRIDOR HEADING SOUTH ---
    { x: 350, y: 800, w: 300, h: 1200, color: '#4a4a60', solid: false }, // Floor
    { x: 330, y: 800, w: 20, h: 1200, color: '#111118', solid: true }, // Left Wall
    { x: 650, y: 800, w: 20, h: 1200, color: '#111118', solid: true }, // Right Wall
    
    // --- MAIN EXHIBIT ROOM ---
    { x: 100, y: 2000, w: 800, h: 1000, color: '#5a5a70', solid: false }, // Floor
    { x: 100, y: 2000, w: 230, h: 20, color: '#111118', solid: true }, // Top Wall L
    { x: 650, y: 2000, w: 250, h: 20, color: '#111118', solid: true }, // Top Wall R
    { x: 80, y: 2000, w: 20, h: 1000, color: '#111118', solid: true }, // Left Wall
    { x: 900, y: 2000, w: 20, h: 1000, color: '#111118', solid: true } // Right Wall
];

function drawMuseum() {
    museumLayout.forEach(rect => {
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    });
}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y
    );
}
function update() {
    let isMoving = false;

    // Calculate how far we WANT to move this frame
    let dx = 0;
    let dy = 0;

    if (keys.up) dy -= playerSpeed;
    if (keys.down) dy += playerSpeed;
    if (keys.left) dx -= playerSpeed;
    if (keys.right) dx += playerSpeed;

    // --- X-AXIS COLLISION CHECK ---
    if (dx !== 0) {
        // Create a temporary rectangle representing where the player WILL be on the X axis
        let nextPlayerBoxX = { x: (playerX + dx) - 16, y: playerY - 16, w: 32, h: 32 };
        let hitWallX = false;

        // Check this future box against all solid walls
        for (let item of museumLayout) {
            if (item.solid && checkCollision(nextPlayerBoxX, item)) {
                hitWallX = true;
                break; // Stop checking, we hit something!
            }
        }

        // Only move on the X axis if we didn't hit a wall
        if (!hitWallX) {
            playerX += dx;
            isMoving = true;
        }
    }

    // --- Y-AXIS COLLISION CHECK ---
    if (dy !== 0) {
        // Create a temporary rectangle representing where the player WILL be on the Y axis
        let nextPlayerBoxY = { x: playerX - 16, y: (playerY + dy) - 16, w: 32, h: 32 };
        let hitWallY = false;

        for (let item of museumLayout) {
            if (item.solid && checkCollision(nextPlayerBoxY, item)) {
                hitWallY = true;
                break;
            }
        }

        // Only move on the Y axis if we didn't hit a wall, AND we stay on the canvas
        if (!hitWallY && (playerY + dy) > 0 && (playerY + dy) < museumHeight) {
            playerY += dy;
            isMoving = true;
        }
    }

    // --- DRAWING ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMuseum();

    ctx.fillStyle = '#ff5555';
    // Remember, playerX and playerY are the CENTER of the player, 
    // so we subtract 16 to draw the top-left corner of the 32x32 box
    ctx.fillRect(playerX - 16, playerY - 16, 32, 32); 

    // Only snap the camera to the player IF they successfully moved
    if (isMoving) {
        window.scrollTo(0, playerY - (window.innerHeight / 2));
    }

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