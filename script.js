// ===== Game Configuration =====
const CONFIG = {
    balloonColors: [
        { gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', name: 'Red' },
        { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', name: 'Blue' },
        { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', name: 'Green' },
        { gradient: 'linear-gradient(135deg, #ffd93d 0%, #ffb800 100%)', name: 'Yellow' },
        { gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', name: 'Purple' },
        { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', name: 'Pink' },
        { gradient: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)', name: 'Orange' }
    ],
    balloonSizes: [60, 80, 100, 120],
    
    // Educational Content Categories
    contentCategories: {
        alphabets: {
            items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            label: 'Letter',
            lang: 'en-US'
        },
        numbers: {
            items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            label: 'Number',
            lang: 'en-US'
        },
        hindiAlphabets: {
            items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ',
                    'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ',
                    'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ',
                    'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'],
            label: 'Hindi Letter',
            lang: 'hi-IN'
        },
        fruits: {
            items: ['🍎 Apple', '🍌 Banana', '🍊 Orange', '🍇 Grapes', '🍓 Strawberry',
                    '🍉 Watermelon', '🍑 Peach', '🍒 Cherry', '🍍 Pineapple', '🥭 Mango',
                    '🥝 Kiwi', '🍈 Melon', '🍋 Lemon', '🥥 Coconut', '🍐 Pear'],
            label: 'Fruit',
            lang: 'en-US'
        },
        animals: {
            items: ['🐶 Dog', '🐱 Cat', '🐭 Mouse', '🐹 Hamster', '🐰 Rabbit',
                    '🦊 Fox', '🐻 Bear', '🐼 Panda', '🐨 Koala', '🐯 Tiger',
                    '🦁 Lion', '🐮 Cow', '🐷 Pig', '🐸 Frog', '🐵 Monkey',
                    '🐔 Chicken', '🐧 Penguin', '🐦 Bird', '🦆 Duck', '🦅 Eagle',
                    '🐘 Elephant', '🦒 Giraffe', '🦓 Zebra', '🐴 Horse', '🐑 Sheep'],
            label: 'Animal',
            lang: 'en-US'
        },
        bodyParts: {
            items: ['👁️ Eye', '👂 Ear', '👃 Nose', '👄 Mouth', '👅 Tongue',
                    '🦷 Tooth', '🦴 Bone', '🧠 Brain', '❤️ Heart', '🫁 Lungs',
                    '✋ Hand', '🦶 Foot', '👆 Finger', '💪 Arm', '🦵 Leg',
                    '👶 Head', '🫀 Heart', '👂 Ear'],
            label: 'Body Part',
            lang: 'en-US'
        },
        colors: {
            items: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange',
                    'Black', 'White', 'Brown', 'Gray', 'Gold', 'Silver'],
            label: 'Color',
            lang: 'en-US'
        }
    },
    
    spawnInterval: 2000, // milliseconds
    balloonSpeed: 8000, // animation duration in ms
    pointsPerBalloon: 10
};

// ===== Game State =====
let gameState = {
    score: 0,
    level: 1,
    lives: 5,
    isPlaying: false,
    soundEnabled: true,
    balloons: [],
    spawnTimer: null,
    player: null // Store player data
};

// ===== API Functions =====
const API = {
    // Use Railway backend URL for production
    baseUrl: 'https://ballon-game-backend-production-cef7.up.railway.app/api',
    
    async registerUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error registering user:', error);
            return null;
        }
    },
    
    async updateScore(id, score) {
        try {
            await fetch(`${this.baseUrl}/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, score })
            });
        } catch (error) {
            console.error('Error updating score:', error);
        }
    },
    
    async getLeaderboard() {
        try {
            const response = await fetch(`${this.baseUrl}/leaderboard`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }
};

// ===== DOM Elements =====
const elements = {
    gameArea: document.getElementById('gameArea'),
    shooter: document.getElementById('shooter'),
    crosshair: document.getElementById('crosshair'),
    characterDisplay: document.getElementById('characterDisplay'),
    characterText: document.getElementById('characterText'),
    characterSubtitle: document.getElementById('characterSubtitle'),
    scoreValue: document.getElementById('score'),
    levelValue: document.getElementById('level'),
    livesValue: document.getElementById('lives'),
    instructionsOverlay: document.getElementById('instructionsOverlay'),
    gameOverOverlay: document.getElementById('gameOverOverlay'),
    finalScoreValue: document.getElementById('finalScore'),
    startButton: document.getElementById('startButton'),
    restartButton: document.getElementById('restartButton'),
    homeButton: document.getElementById('homeButton'),
    soundToggle: document.getElementById('soundToggle'),
    exitButton: document.getElementById('exitButton'),
    shootIndicator: document.getElementById('shootIndicator'),
    // New Elements
    registrationOverlay: document.getElementById('registrationOverlay'),
    registrationForm: document.getElementById('registrationForm'),
    leaderboardOverlay: document.getElementById('leaderboardOverlay'),
    leaderboardBody: document.getElementById('leaderboardBody'),
    showLeaderboardBtn: document.getElementById('showLeaderboardBtn'),
    closeLeaderboardBtn: document.getElementById('closeLeaderboard')
};

// ===== Audio System =====
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        console.log("esting");
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Speak character using Web Speech API
    speakCharacter(text, lang = 'en-US') {
        if (!this.enabled) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        utterance.lang = lang;
        
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
    }

    // Play pop sound using Web Audio API
    playPopSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Play shoot sound
    playShootSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

const audioSystem = new AudioSystem();

// ===== Balloon Class =====
class Balloon {
    constructor() {
        this.element = this.createElement();
        this.contentData = this.getRandomContent();
        this.colorData = null;
        this.isPopped = false;
        this.id = Date.now() + Math.random();
        
        this.setupBalloon();
        this.animate();
    }

    createElement() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        const body = document.createElement('div');
        body.className = 'balloon-body';
        
        const string = document.createElement('div');
        string.className = 'balloon-string';
        
        balloon.appendChild(body);
        balloon.appendChild(string);
        
        return balloon;
    }

    getRandomContent() {
        // Randomly select a category
        const categories = Object.keys(CONFIG.contentCategories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const category = CONFIG.contentCategories[randomCategory];
        
        // Get random item from that category
        const randomItem = category.items[Math.floor(Math.random() * category.items.length)];
        
        return {
            text: randomItem,
            label: category.label,
            lang: category.lang
        };
    }

    setupBalloon() {
        const size = CONFIG.balloonSizes[Math.floor(Math.random() * CONFIG.balloonSizes.length)];
        this.colorData = CONFIG.balloonColors[Math.floor(Math.random() * CONFIG.balloonColors.length)];
        const startX = Math.random() * (window.innerWidth - size);
        
        this.element.style.width = `${size}px`;
        this.element.style.height = `${size}px`;
        this.element.style.left = `${startX}px`;
        this.element.style.bottom = '-150px';
        
        const body = this.element.querySelector('.balloon-body');
        body.style.background = this.colorData.gradient;
        
        // Add click event
        this.element.addEventListener('click', () => this.pop());
    }

    animate() {
        // Animate balloon
        // Calculate speed based on level: Base speed (8s) - (Level * 0.5s)
        // Minimum speed is 2s
        const duration = Math.max(2000, CONFIG.balloonSpeed - ((gameState.level - 1) * 500));
        
        const animation = this.element.animate([
            { transform: `translateY(0) rotate(0deg)` },
            { transform: `translateY(-${window.innerHeight + 200}px) rotate(${Math.random() * 360}deg)` }
        ], {
            duration: duration,
            easing: 'linear'
        });

        animation.onfinish = () => {
            if (!this.isPopped && gameState.isPlaying) {
                this.remove();
                handleMissedBalloon();
            }
        };
    }

    pop() {
        if (this.isPopped) return;
        
        this.isPopped = true;
        clearTimeout(this.removeTimer);
        
        // Play pop animation
        this.element.classList.add('popping');
        
        // Create particle effect
        this.createParticles();
        
        // Play sound
        audioSystem.playPopSound();
        
        // Show character
        this.showCharacter();
        
        // Update score
        this.updateScore();
        
        // Remove balloon after animation
        setTimeout(() => {
            this.remove();
        }, 500);
    }

    createParticles() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const particleCount = 15;
        const colors = ['#ff6b6b', '#4facfe', '#43e97b', '#ffd93d', '#ff9a9e'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    showCharacter() {
        elements.characterText.textContent = this.contentData.text;
        elements.characterSubtitle.textContent = this.contentData.label;
        
        elements.characterDisplay.classList.add('show');
        
        // Speak the content and color
        setTimeout(() => {
            // First speak the content
            audioSystem.speakCharacter(this.contentData.text, this.contentData.lang);
            
            // Then speak the balloon color after a short delay
            setTimeout(() => {
                audioSystem.speakCharacter(`${this.colorData.name} balloon`, 'en-US');
            }, 1500);
        }, 200);
        
        // Hide after 3.5 seconds (increased to accommodate color speech)
        setTimeout(() => {
            elements.characterDisplay.classList.remove('show');
        }, 3500);
    }

    updateScore() {
        gameState.score += CONFIG.pointsPerBalloon;
        elements.scoreValue.textContent = gameState.score;
        
        // Update score in backend if player exists
        if (gameState.player) {
            API.updateScore(gameState.player.id, gameState.score);
        }
        
        // Level up every 100 points
        const newLevel = Math.floor(gameState.score / 100) + 1;
        if (newLevel > gameState.level) {
            gameState.level = newLevel;
            elements.levelValue.textContent = gameState.level;
            this.showLevelUp();
        }
    }

    showLevelUp() {
        const levelUpMsg = document.createElement('div');
        levelUpMsg.className = 'character-display show';
        levelUpMsg.innerHTML = `
            <div class="character-content">
                <div class="character-text">🎉</div>
                <div class="character-subtitle">Level ${gameState.level}!</div>
            </div>
        `;
        document.body.appendChild(levelUpMsg);
        
        setTimeout(() => {
            levelUpMsg.remove();
        }, 2000);
    }

    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // Remove from game state
        const index = gameState.balloons.indexOf(this);
        if (index > -1) {
            gameState.balloons.splice(index, 1);
        }
    }

    addToGame() {
        elements.gameArea.appendChild(this.element);
        gameState.balloons.push(this);
    }
}

// ===== Game Functions =====
function startGame() {
    // Reset game state
    gameState.score = 0;
    gameState.level = 1;
    gameState.lives = 5;
    gameState.isPlaying = true;
    gameState.balloons = [];
    
    // Update UI
    elements.scoreValue.textContent = '0';
    elements.levelValue.textContent = '1';
    updateLivesDisplay();
    
    elements.instructionsOverlay.classList.add('hidden');
    elements.gameOverOverlay.style.display = 'none';
    
    // Initialize audio
    audioSystem.init();
    
    // Start spawning balloons
    spawnBalloon();
    gameState.spawnTimer = setInterval(spawnBalloon, CONFIG.spawnInterval);
}

function handleMissedBalloon() {
    if (!gameState.isPlaying) return;
    
    gameState.lives--;
    updateLivesDisplay();
    
    // Play miss sound (optional)
    // audioSystem.playMissSound(); 
    
    if (gameState.lives <= 0) {
        gameOver();
    }
}

function updateLivesDisplay() {
    // Display hearts based on lives
    const hearts = '❤️'.repeat(Math.max(0, gameState.lives));
    const emptyHearts = '🖤'.repeat(Math.max(0, 5 - gameState.lives));
    elements.livesValue.textContent = hearts + emptyHearts;
}

function gameOver() {
    gameState.isPlaying = false;
    clearInterval(gameState.spawnTimer);
    
    // Remove all existing balloons
    document.querySelectorAll('.balloon').forEach(b => b.remove());
    gameState.balloons = [];
    
    // Show Game Over screen
    elements.finalScoreValue.textContent = gameState.score;
    elements.gameOverOverlay.style.display = 'flex';
    
    // Update high score if needed
    if (gameState.player) {
        API.updateScore(gameState.player.id, gameState.score);
    }
}

// Handle Registration
elements.registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('playerName').value,
        place: document.getElementById('playerPlace').value,
        age: Number(document.getElementById('playerAge').value),
        gender: document.getElementById('playerGender').value
    };
    
    let result = await API.registerUser(userData);
    
    // Fallback if API fails
    if (!result) {
        console.log('API failed, using offline mode');
        const randomId = Math.floor(Math.random() * 10000);
        result = {
            player: {
                id: randomId,
                name: userData.name || `Guest_${randomId}`,
                place: userData.place || 'Unknown',
                age: userData.age || 5,
                gender: userData.gender || 'Boy',
                highScore: 0,
                isOffline: true
            }
        };
    }
    
    if (result && result.player) {
        gameState.player = result.player;
        // Save to localStorage
        localStorage.setItem('balloonGameUser', JSON.stringify(result.player));
        
        elements.registrationOverlay.style.display = 'none';
        // Show instructions after registration
        elements.instructionsOverlay.classList.remove('hidden');
    } else {
        // This should rarely happen now with the fallback
        alert('Registration failed. Please try again.');
    }
});

// Restart Game
elements.restartButton.addEventListener('click', startGame);

// Home Button (Logout/Reset)
elements.homeButton.addEventListener('click', () => {
    elements.gameOverOverlay.style.display = 'none';
    elements.instructionsOverlay.classList.remove('hidden');
});

// Handle Leaderboard
elements.showLeaderboardBtn.addEventListener('click', async () => {
    const players = await API.getLeaderboard();
    
    elements.leaderboardBody.innerHTML = players.map((p, index) => `
        <tr>
            <td class="rank-${index + 1}">#${index + 1}</td>
            <td>${p.name}</td>
            <td>${p.place || '-'}</td>
            <td>${p.high_score}</td>
        </tr>
    `).join('');
    
    elements.leaderboardOverlay.style.display = 'flex';
});

elements.closeLeaderboardBtn.addEventListener('click', () => {
    elements.leaderboardOverlay.style.display = 'none';
});

function spawnBalloon() {
    if (!gameState.isPlaying) return;
    
    const balloon = new Balloon();
    balloon.addToGame();
}

function shoot() {
    if (!gameState.isPlaying) return;
    
    // Play shoot animation
    elements.shooter.classList.add('shooting');
    elements.crosshair.classList.add('active');
    
    // Play shoot sound
    audioSystem.playShootSound();
    
    // Check for balloon hits
    checkBalloonHit();
    
    // Reset animations
    setTimeout(() => {
        elements.shooter.classList.remove('shooting');
        elements.crosshair.classList.remove('active');
    }, 200);
}

function checkBalloonHit() {
    // Get crosshair position (center of screen, above shooter)
    const shooterRect = elements.shooter.getBoundingClientRect();
    const crosshairX = shooterRect.left + shooterRect.width / 2;
    const crosshairY = shooterRect.top - 60;
    
    // Check each balloon
    for (const balloon of gameState.balloons) {
        if (balloon.isPopped) continue;
        
        const balloonRect = balloon.element.getBoundingClientRect();
        
        // Check if crosshair is within balloon bounds
        if (
            crosshairX >= balloonRect.left &&
            crosshairX <= balloonRect.right &&
            crosshairY >= balloonRect.top &&
            crosshairY <= balloonRect.bottom
        ) {
            balloon.pop();
            break; // Only pop one balloon per shot
        }
    }
}

function toggleSound() {
    const enabled = audioSystem.toggle();
    gameState.soundEnabled = enabled;
    elements.soundToggle.textContent = enabled ? '🔊' : '🔇';
    elements.soundToggle.classList.toggle('muted', !enabled);
}

// ===== Mouse and Touch Tracking for Shooter =====
let mouseX = window.innerWidth / 2;

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    updateShooterPosition();
});

// Touch tracking for mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        updateShooterPosition();
    }
}, { passive: true });

// Update shooter position based on mouse/touch X
function updateShooterPosition() {
    const shooterContainer = elements.shooter.parentElement;
    const containerRect = shooterContainer.getBoundingClientRect();
    const shooterWidth = elements.shooter.offsetWidth;
    
    let newX = mouseX - containerRect.left - shooterWidth / 2;
    newX = Math.max(0, Math.min(newX, containerRect.width - shooterWidth));
    
    elements.shooter.style.transform = `translateX(${newX}px) scale(0.8)`;
}

// ===== Event Listeners =====
elements.startButton.addEventListener('click', startGame);

elements.soundToggle.addEventListener('click', toggleSound);

elements.exitButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to exit?')) {
        // Clear user session if needed, or just reload to go back to start
        window.location.reload();
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        shoot();
    }
});

// Click to shoot (alternative control)
elements.gameArea.addEventListener('click', (e) => {
    if (!gameState.isPlaying) return;
    
    // Check if clicked on a balloon
    if (e.target.closest('.balloon')) {
        // Balloon click is handled by the balloon itself
        return;
    }
    
    // Otherwise, treat as a shoot action
    shoot();
});

// ===== Initialize =====
function init() {
    console.log('🎈 Balloon Pop Adventure - Game Initialized!');
    
    // Check for saved user
    const savedUser = localStorage.getItem('balloonGameUser');
    if (savedUser) {
        try {
            gameState.player = JSON.parse(savedUser);
            console.log('Welcome back, ' + gameState.player.name);
            
            // Skip registration, show instructions directly
            elements.registrationOverlay.style.display = 'none';
            elements.instructionsOverlay.classList.remove('hidden');
        } catch (e) {
            console.error('Error parsing saved user', e);
            localStorage.removeItem('balloonGameUser');
        }
    } else {
        // Show registration form initially
        elements.instructionsOverlay.classList.add('hidden'); 
    }
    
    // Set initial shooter position
    const shooterContainer = elements.shooter.parentElement;
    const containerRect = shooterContainer.getBoundingClientRect();
    const shooterWidth = elements.shooter.offsetWidth;
    const centerX = (containerRect.width - shooterWidth) / 2;
    elements.shooter.style.transform = `translateX(${centerX}px) scale(0.8)`;
}

// Start the game
init();
