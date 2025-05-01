// Datos de la lotería
const loteriaData = {
    "numeros": [
        {"n":1,"d":"Martillo","i":"1.webp"},
        {"n":2,"d":"Palomas","i":"2.webp"},
        {"n":3,"d":"Piñas","i":"3.webp"},
        {"n":4,"d":"Brujas","i":"4.webp"},
        {"n":5,"d":"Jaulas","i":"5.webp"},
        {"n":6,"d":"Gallinas","i":"6.webp"},
        {"n":7,"d":"Falúas","i":"7.webp"},
        {"n":8,"d":"Pitos","i":"8.webp"},
        {"n":9,"d":"Pavos","i":"9.webp"},
        {"n":10,"d":"Culebras","i":"10.webp"},
        {"n":11,"d":"Damas","i":"11.webp"},
        {"n":12,"d":"Pescados","i":"12.webp"},
        {"n":13,"d":"Conejos","i":"13.webp"},
        {"n":14,"d":"Gatos","i":"14.webp"},
        {"n":15,"d":"Templos","i":"15.webp"},
        {"n":16,"d":"Venados","i":"16.webp"},
        {"n":17,"d":"Sillas","i":"17.webp"},
        {"n":18,"d":"Uvas","i":"18.webp"},
        {"n":19,"d":"Palacios","i":"19.webp"},
        {"n":20,"d":"Gusanos","i":"20.webp"},
        {"n":21,"d":"Tren","i":"21.webp"},
        {"n":22,"d":"Ahorcados","i":"22.webp"},
        {"n":23,"d":"Melones","i":"23.webp"},
        {"n":24,"d":"Adan y Eva","i":"24.webp"},
        {"n":25,"d":"Caballos","i":"25.webp"},
        {"n":26,"d":"Soldados","i":"26.webp"},
        {"n":27,"d":"Sol","i":"27.webp"},
        {"n":28,"d":"Mulas","i":"28.webp"},
        {"n":29,"d":"Fuertes","i":"29.webp"},
        {"n":30,"d":"Almirez","i":"30.webp"},
        {"n":31,"d":"Quinque","i":"31.webp"},
        {"n":32,"d":"Nopales","i":"32.webp"},
        {"n":33,"d":"Canastas","i":"33.webp"},
        {"n":34,"d":"Águilas","i":"34.webp"},
        {"n":35,"d":"Famas","i":"35.webp"},
        {"n":36,"d":"Cargadores","i":"36.webp"},
        {"n":37,"d":"Borrachos","i":"37.webp"},
        {"n":38,"d":"Clarines","i":"38.webp"},
        {"n":39,"d":"Monos","i":"39.webp"},
        {"n":40,"d":"Pabellones","i":"40.webp"},
        {"n":41,"d":"Mecedor","i":"41.webp"},
        {"n":42,"d":"Cometas","i":"42.webp"},
        {"n":43,"d":"Lunas","i":"43.webp"},
        {"n":44,"d":"Chu calabazo","i":"44.webp"},
        {"n":45,"d":"Maromero","i":"45.webp"},
        {"n":46,"d":"Sandías","i":"46.webp"},
        {"n":47,"d":"Negros","i":"47.webp"},
        {"n":48,"d":"Tiradores","i":"48.webp"},
        {"n":49,"d":"Sombreros","i":"49.webp"},
        {"n":50,"d":"Mariposas","i":"50.webp"},
        {"n":51,"d":"Chivos","i":"51.webp"},
        {"n":52,"d":"Navajas","i":"52.webp"},
        {"n":53,"d":"Indios","i":"53.webp"},
        {"n":54,"d":"Campanas","i":"54.webp"},
        {"n":55,"d":"Mangos","i":"55.webp"},
        {"n":56,"d":"Cachuchas","i":"56.webp"},
        {"n":57,"d":"Compás","i":"57.webp"},
        {"n":58,"d":"Corazones","i":"58.webp"},
        {"n":59,"d":"Sierras","i":"59.webp"},
        {"n":60,"d":"Granadas","i":"60.webp"},
        {"n":61,"d":"Toros","i":"61.webp"},
        {"n":62,"d":"Leones","i":"62.webp"},
        {"n":63,"d":"Bailarinas","i":"63.webp"},
        {"n":64,"d":"Coronas","i":"64.webp"},
        {"n":65,"d":"Volcanes","i":"65.webp"},
        {"n":66,"d":"Perro Lobos","i":"66.webp"},
        {"n":67,"d":"Palmas","i":"67.webp"},
        {"n":68,"d":"Dados","i":"68.webp"},
        {"n":69,"d":"Fresas","i":"69.webp"},
        {"n":70,"d":"Tecolotes","i":"70.webp"},
        {"n":71,"d":"Botas","i":"71.webp"},
        {"n":72,"d":"Arboles","i":"72.webp"},
        {"n":73,"d":"Rosas","i":"73.webp"},
        {"n":74,"d":"Pericos","i":"74.webp"},
        {"n":75,"d":"Botellas","i":"75.webp"},
        {"n":76,"d":"Higos","i":"76.webp"},
        {"n":77,"d":"Guitarras","i":"77.webp"},
        {"n":78,"d":"Manzanas","i":"78.webp"},
        {"n":79,"d":"Jarras","i":"79.webp"},
        {"n":80,"d":"Liras","i":"80.webp"},
        {"n":81,"d":"Vapor","i":"81.webp"},
        {"n":82,"d":"Anclas","i":"82.webp"},
        {"n":83,"d":"Garzas","i":"83.webp"},
        {"n":84,"d":"Globos","i":"84.webp"},
        {"n":85,"d":"Liberatos","i":"85.webp"},
        {"n":86,"d":"Ciprés","i":"86.webp"},
        {"n":87,"d":"Casas","i":"87.webp"},
        {"n":88,"d":"Flamingo","i":"88.webp"},
        {"n":89,"d":"Almohadillas","i":"89.webp"},
        {"n":90,"d":"Mundos","i":"90.webp"}
    ]
};

// Game state
const gameState = {
    numbers: loteriaData.numeros,
    drawnNumbers: [],
    isAutoMode: false,
    isPaused: false,
    intervalId: null,
    speed: 3,
    speechEnabled: true,
    imagesLoaded: 0,
    loadedImages: {},
    drawnNumbersHistory: []
};

// DOM Elements
const elements = {
    currentNumber: document.querySelector('.number-display'),
    currentImage: document.getElementById('current-image'),
    currentDescription: document.getElementById('current-description'),
    board: document.getElementById('board'),
    nextBtn: document.getElementById('next-btn'),
    autoBtn: document.getElementById('auto-btn'),
    winnerBtn: document.getElementById('winner-btn'),
    resetBtn: document.getElementById('reset-btn'),
    speedControl: document.getElementById('speed-control'),
    speedSlider: document.getElementById('speed-slider'),
    speedValue: document.getElementById('speed-value'),
    modeRadios: document.querySelectorAll('input[name="mode"]'),
    loadingScreen: document.getElementById('loading-screen'),
    loadingStatus: document.getElementById('loading-status'),
    container: document.querySelector('.container'),
    firstNumbers: document.getElementById('first-numbers'),
    lastNumbers: document.getElementById('last-numbers')
};

// Función para cargar imágenes
async function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            const fallback = document.createElement('div');
            fallback.className = 'fallback-image';
            fallback.textContent = path.split('.')[0];
            resolve(fallback);
        };
        img.src = path;
    });
}

// Precargar todas las imágenes
async function preloadAllImages() {
    const loadPromises = [];
    
    for (const item of gameState.numbers) {
        loadPromises.push(
            loadImage(item.i)
                .then(img => {
                    gameState.loadedImages[item.n] = img;
                    gameState.imagesLoaded++;
                    elements.loadingStatus.textContent = `Cargando imágenes: ${gameState.imagesLoaded}/90`;
                })
                .catch(error => {
                    console.warn('No se pudo cargar:', item.i, error);
                })
        );
    }
    
    await Promise.all(loadPromises);
}

// Configurar zoom para imágenes
function setupImageZoom() {
    const boardCells = document.querySelectorAll('.board-cell');
    
    boardCells.forEach(cell => {
        cell.removeEventListener('mouseenter', handleMouseEnter);
        cell.removeEventListener('mouseleave', handleMouseLeave);
        cell.removeEventListener('touchstart', handleTouchStart);
        
        cell.addEventListener('mouseenter', handleMouseEnter);
        cell.addEventListener('mouseleave', handleMouseLeave);
        cell.addEventListener('touchstart', handleTouchStart, { passive: false });
    });
    
    function handleMouseEnter() {
        if (window.matchMedia("(hover: hover)").matches && !this.classList.contains('selected')) {
            this.classList.add('hover-zoom');
        }
    }
    
    function handleMouseLeave() {
        this.classList.remove('hover-zoom');
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        const cell = e.currentTarget;
        if (!cell.classList.contains('selected')) {
            cell.classList.add('touch-zoom');
            setTimeout(() => cell.classList.remove('touch-zoom'), 2000);
        }
    }
}

// Initialize the game board with images
function initBoard() {
    elements.board.innerHTML = '';
    
    gameState.numbers.forEach(item => {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.number = item.n;
        
        const imgContainer = gameState.loadedImages[item.n] || 
            (() => {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-image';
                fallback.textContent = item.n;
                return fallback;
            })();
        
        if (imgContainer instanceof HTMLImageElement) {
            imgContainer.loading = "lazy";
            imgContainer.alt = item.d;
        }
        
        const numberText = document.createElement('div');
        numberText.className = 'number-text';
        numberText.textContent = item.n;
        
        cell.appendChild(imgContainer.cloneNode());
        cell.appendChild(numberText);
        elements.board.appendChild(cell);
    });
}

// Initialize the game
async function initGame() {
    try {
        elements.loadingScreen.style.display = 'flex';
        elements.container.style.display = 'none';
        
        await preloadAllImages();
        initBoard();
        setupImageZoom();
        setupEventListeners();
        
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported');
            gameState.speechEnabled = false;
        }
        
        elements.loadingScreen.style.display = 'none';
        elements.container.style.display = 'block';
    } catch (error) {
        console.error('Error inicializando juego:', error);
        elements.loadingStatus.textContent = `Error al cargar: ${error}`;
        setTimeout(() => {
            alert(`No se pudieron cargar las imágenes. Verifica que todos los archivos .webp estén en la misma carpeta.`);
        }, 500);
    }
}

// Set up event listeners
function setupEventListeners() {
    elements.modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            gameState.isAutoMode = e.target.value === 'auto';
            updateControls();
        });
    });
    
    elements.nextBtn.addEventListener('click', drawNextNumber);
    elements.autoBtn.addEventListener('click', toggleAutoMode);
    elements.winnerBtn.addEventListener('click', declareWinner);
    elements.resetBtn.addEventListener('click', resetGame);
    
    elements.speedSlider.addEventListener('input', (e) => {
        gameState.speed = parseInt(e.target.value);
        elements.speedValue.textContent = `${gameState.speed}s`;
        
        if (gameState.isAutoMode && !gameState.isPaused) {
            clearInterval(gameState.intervalId);
            startAutoMode();
        }
    });
}

// Update UI controls based on game state
function updateControls() {
    if (gameState.isAutoMode) {
        elements.nextBtn.style.display = 'none';
        elements.autoBtn.style.display = 'block';
        elements.speedControl.style.display = 'flex';
        startAutoMode();
    } else {
        elements.nextBtn.style.display = 'block';
        elements.autoBtn.style.display = 'none';
        elements.speedControl.style.display = 'none';
        stopAutoMode();
    }
    
    elements.winnerBtn.disabled = gameState.drawnNumbers.length === 90;
}

// Draw the next number
function drawNextNumber() {
    if (gameState.drawnNumbers.length >= 90) {
        alert('Todos los números han sido sorteados!');
        return;
    }
    
    const remainingNumbers = gameState.numbers.filter(
        num => !gameState.drawnNumbers.includes(num.n)
    );
    
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    const selectedNumber = remainingNumbers[randomIndex];
    
    gameState.drawnNumbers.push(selectedNumber.n);
    
    updateCurrentNumberDisplay(selectedNumber);
    updateBoard(selectedNumber.n);
    updateDrawnNumbersList(selectedNumber);
    announceNumber(selectedNumber);
    
    if (gameState.drawnNumbers.length === 90) {
        endGame();
    }
}

// Update the drawn numbers list in two columns
function updateDrawnNumbersList(numberData) {
    const totalDrawn = gameState.drawnNumbersHistory.length + 1;
    const isFirstHalf = totalDrawn <= 45;
    
    const container = isFirstHalf ? elements.firstNumbers : elements.lastNumbers;
    
    const numberElement = document.createElement('div');
    numberElement.className = 'drawn-number';
    numberElement.textContent = numberData.n;
    numberElement.dataset.description = numberData.d;
    numberElement.title = `${numberData.n}: ${numberData.d}`;
    
    container.appendChild(numberElement);
    gameState.drawnNumbersHistory.push(numberData);
}

// Update the current number display
function updateCurrentNumberDisplay(numberData) {
    elements.currentNumber.textContent = numberData.n;
    
    const img = new Image();
    img.onload = () => {
        elements.currentImage.src = numberData.i;
    };
    img.onerror = () => {
        elements.currentImage.style.display = 'none';
    };
    img.src = numberData.i;
    
    elements.currentImage.alt = numberData.d;
    elements.currentDescription.textContent = numberData.d;
}

// Update the board with the drawn number
function updateBoard(number) {
    const cell = document.querySelector(`.board-cell[data-number="${number}"]`);
    if (cell) {
        cell.classList.add('selected');
        const img = cell.querySelector('img, .fallback-image');
        if (img) {
            if (img instanceof HTMLImageElement) {
                img.style.filter = 'grayscale(0%) brightness(1)';
            } else {
                img.style.backgroundColor = '#e0e0e0';
            }
            
            img.style.transform = 'scale(1.1)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Announce the number using speech synthesis
function announceNumber(numberData) {
    if (!gameState.speechEnabled) return;

    const numberPronunciations = {
        1: { text: "un: martillo", pause: 0.3 },
        21: { text: "veintiún: tren", pause: 0.3 },
        31: { text: "treinta y un: kinkés", pause: 0.3 },
        41: { text: "cuarenta y un: mecedoras", pause: 0.3 },
        51: { text: "cincuenta y un: chivos", pause: 0.3 },
        61: { text: "sesenta y un: toros", pause: 0.3 },
        71: { text: "setenta y una: bota", pause: 0.3 },
        81: { text: "ochenta y un: vapor", pause: 0.3 },
    };

    const specialCase = numberPronunciations[numberData.n];
    const textToSpeak = specialCase ? specialCase.text : `${numberData.n}: ${numberData.d}`;
    const pauseDuration = specialCase ? specialCase.pause : 0.1;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = textToSpeak;
    utterance.lang = 'es-MX';
    utterance.rate = 1.2;
    utterance.pitch = 0.9;
    
    const configureVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
            v.lang === 'es-MX' && (v.name.includes('Female') || v.name.includes('Jorge')));
        
        utterance.voice = preferredVoice || voices.find(v => v.lang.startsWith('es'));
    };

    if (window.speechSynthesis.getVoices().length > 0) {
        configureVoice();
    } else {
        window.speechSynthesis.onvoiceschanged = configureVoice;
    }

    setTimeout(() => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }, pauseDuration * 1000);
}

// Start auto mode
function startAutoMode() {
    if (gameState.isPaused) {
        gameState.isPaused = false;
        elements.autoBtn.textContent = 'Pausar';
    } else {
        if (gameState.drawnNumbers.length === 0) {
            drawNextNumber();
        }
    }
    
    gameState.intervalId = setInterval(() => {
        if (!gameState.isPaused && gameState.drawnNumbers.length < 90) {
            drawNextNumber();
        } else if (gameState.drawnNumbers.length >= 90) {
            stopAutoMode();
        }
    }, gameState.speed * 1000);
}

// Stop auto mode
function stopAutoMode() {
    clearInterval(gameState.intervalId);
    gameState.intervalId = null;
}

// Toggle auto mode pause state
function toggleAutoMode() {
    gameState.isPaused = !gameState.isPaused;
    elements.autoBtn.textContent = gameState.isPaused ? 'Reanudar' : 'Pausar';
}

// Declare a winner
function declareWinner() {
    if (gameState.drawnNumbers.length === 0) {
        alert('No se ha sorteado ningún número todavía!');
        return;
    }
    
    stopAutoMode();
    showWinnerAnimation();
    elements.resetBtn.style.display = 'block';
}

// Show winner animation
function showWinnerAnimation() {
    const winnerDiv = document.createElement('div');
    winnerDiv.className = 'winner-animation';
    winnerDiv.innerHTML = `
        <div class="winner-message">
            <h2>¡Tenemos un ganador!</h2>
            <p>¡Felicidades!</p>
            <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
        </div>
    `;
    document.body.appendChild(winnerDiv);
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// End game when all numbers are drawn
function endGame() {
    stopAutoMode();
    elements.nextBtn.disabled = true;
    elements.autoBtn.disabled = true;
    elements.winnerBtn.disabled = true;
    elements.resetBtn.style.display = 'block';
}

// Reset the game
function resetGame() {
    gameState.drawnNumbers = [];
    gameState.isPaused = false;
    gameState.drawnNumbersHistory = [];
    elements.firstNumbers.innerHTML = '';
    elements.lastNumbers.innerHTML = '';
    
    elements.currentNumber.textContent = '--';
    elements.currentImage.src = '';
    elements.currentDescription.textContent = 'Presiona "Siguiente número" para comenzar';
    
    elements.nextBtn.disabled = false;
    elements.autoBtn.disabled = false;
    elements.winnerBtn.disabled = false;
    elements.resetBtn.style.display = 'none';
    
    document.querySelectorAll('.board-cell').forEach(cell => {
        cell.classList.remove('selected', 'hover-zoom', 'touch-zoom');
        const img = cell.querySelector('img, .fallback-image');
        if (img) {
            img.style.transition = 'all 0.5s ease';
            if (img instanceof HTMLImageElement) {
                img.style.filter = 'grayscale(100%) brightness(0.7)';
            } else {
                img.style.backgroundColor = '#F0F0F0';
            }
            img.style.transform = 'scale(1)';
            
            setTimeout(() => {
                img.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
            }, 500);
        }
    });
    
    document.querySelector('input[value="manual"]').checked = true;
    gameState.isAutoMode = false;
    updateControls();
    setTimeout(setupImageZoom, 100);
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);