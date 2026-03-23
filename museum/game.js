const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerY = window.innerHeight / 2;
const playerSpeed = 5;

// Basic game loop
function update() {
    // Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a placeholder pixel art character (a red square for now)
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / 2, window.innerHeight / 2, 32, 32); 
    
    // Note: In this method, the player stays in the center of the screen, 
    // but the background elements would be drawn relative to playerY!

    requestAnimationFrame(update);
}

// Listen for arrow keys to move and force the browser to scroll
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        playerY += playerSpeed;
        window.scrollTo(0, playerY); // Forces the webpage to scroll down
    } else if (e.key === 'ArrowUp') {
        playerY -= playerSpeed;
        window.scrollTo(0, playerY);
    }
});

// Start the game loop
update();