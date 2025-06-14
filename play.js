document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cardsContainer = document.getElementById('cards-container');
    const newGameBtn = document.getElementById('new-game');
    const returnHomeBtn = document.getElementById('return-home');
    const gameModeSelect = document.getElementById('game-mode');
    const howToPlayBtn = document.getElementById('how-to-play');
    const repeatedPanel = document.getElementById('repeated-panel');
    const repeatedNumbersContainer = document.getElementById('repeated-numbers');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const startMessage = document.getElementById('start-message');
    
    // Cargar datos desde localStorage
    const bingoCards = JSON.parse(localStorage.getItem('bingoCards'));
    const isManualMode = localStorage.getItem('isManualMode') === 'true';
    const selectedNumbers = JSON.parse(localStorage.getItem('selectedNumbers'));
    const imageFormat = localStorage.getItem('imageFormat') || 'webp';
    
    // Variables de estado
    let currentGameMode = 'traditional';
    let allNumbersGrid = null;
    let gameStarted = false;
    
    // Definir todos los patrones de victoria
    const winPatterns = {
        fila_0: [[0,0], [0,1], [0,2], [0,3], [0,4]],
        fila_1: [[1,0], [1,1], [1,2], [1,3], [1,4]],
        fila_2: [[2,0], [2,1], [2,2], [2,3], [2,4]],
        fila_3: [[3,0], [3,1], [3,2], [3,3], [3,4]],
        fila_4: [[4,0], [4,1], [4,2], [4,3], [4,4]],
        columna_0: [[0,0], [1,0], [2,0], [3,0], [4,0]],
        columna_1: [[0,1], [1,1], [2,1], [3,1], [4,1]],
        columna_2: [[0,2], [1,2], [2,2], [3,2], [4,2]],
        columna_3: [[0,3], [1,3], [2,3], [3,3], [4,3]],
        columna_4: [[0,4], [1,4], [2,4], [3,4], [4,4]],
        diagonal_principal: [[0,0], [1,1], [2,2], [3,3], [4,4]],
        diagonal_secundaria: [[0,4], [1,3], [2,2], [3,1], [4,0]],
        custom_1: [[0,0], [0,2], [1,1], [2,0], [2,2]],
        custom_2: [[0,1], [0,3], [1,2], [2,1], [2,3]],
        custom_3: [[0,2], [0,4], [1,3], [2,2], [2,4]],
        custom_4: [[1,0], [1,2], [2,1], [3,0], [3,2]],
        custom_5: [[1,1], [1,3], [2,2], [3,1], [3,3]],
        custom_6: [[1,2], [1,4], [2,3], [3,2], [3,4]],
        custom_7: [[2,0], [2,2], [3,1], [4,0], [4,2]],
        custom_8: [[2,1], [2,3], [3,2], [4,1], [4,3]],
        custom_9: [[2,2], [2,4], [3,3], [4,2], [4,4]],
        custom_10: [[0,0], [0,4], [2,2], [4,0], [4,4]],
        custom_11: [[0,0], [0,2], [2,1], [4,0], [4,2]],
        custom_12: [[0,1], [0,3], [2,2], [4,1], [4,3]],
        custom_13: [[0,2], [0,4], [2,3], [4,2], [4,4]],
        custom_14: [[0,0], [0,4], [1,2], [2,0], [2,4]],
        custom_15: [[1,0], [1,4], [2,2], [3,0], [3,4]],
        custom_16: [[2,0], [2,4], [3,2], [4,0], [4,4]],
        custom_17: [[0,1], [1,0], [2,2], [3,4], [4,3]],
        custom_18: [[0,0], [1,3], [2,2], [3,1], [4,4]],
        custom_19: [[0,3], [1,4], [2,2], [3,0], [4,1]],
        custom_20: [[0,4], [1,1], [2,2], [3,3], [4,0]],
        custom_21: [[0,1], [1,0], [1,1], [1,2], [2,1]],
        custom_22: [[0,2], [1,1], [1,2], [1,3], [2,2]],
        custom_23: [[0,3], [1,2], [1,3], [1,4], [2,3]],
        custom_24: [[1,1], [2,0], [2,1], [2,2], [3,1]],
        custom_25: [[1,2], [2,1], [2,2], [2,3], [3,2]],
        custom_26: [[1,3], [2,2], [2,3], [2,4], [3,3]],
        custom_27: [[2,1], [3,0], [3,1], [3,2], [4,1]],
        custom_28: [[2,2], [3,1], [3,2], [3,3], [4,2]],
        custom_29: [[2,3], [3,2], [3,3], [3,4], [4,3]],
        custom_30: [[0,2], [2,0], [2,2], [2,4], [4,2]],
        custom_31: [[0,1], [2,0], [2,1], [2,2], [4,1]],
        custom_32: [[0,2], [2,1], [2,2], [2,3], [4,2]],
        custom_33: [[0,3], [2,2], [2,3], [2,4], [4,3]],
        custom_34: [[0,2], [1,0], [1,2], [1,4], [2,2]],
        custom_35: [[1,2], [2,0], [2,2], [2,4], [3,2]],
        custom_36: [[2,2], [3,0], [3,2], [3,4], [4,2]],
        custom_37: [[2,2], [3,1], [3,3], [4,0], [4,4]],
        custom_38: [[1,2], [2,1], [2,3], [3,0], [3,4]],
        custom_39: [[0,2], [1,1], [1,3], [2,0], [2,4]],
        custom_40: [[0,0], [1,1], [2,2], [3,1], [4,0]],
        custom_41: [[0,1], [1,2], [2,3], [3,2], [4,1]],
        custom_42: [[0,2], [1,3], [2,4], [3,3], [4,2]],
        custom_43: [[0,0], [0,4], [1,1], [1,3], [2,2]],
        custom_44: [[1,0], [1,4], [2,1], [2,3], [3,2]],
        custom_45: [[2,0], [2,4], [3,1], [3,3], [4,2]],
        custom_46: [[0,4], [1,3], [2,2], [3,3], [4,4]],
        custom_47: [[0,3], [1,2], [2,1], [3,2], [4,3]],
        custom_48: [[0,2], [1,1], [2,0], [3,1], [4,2]]
    };
    
    // Mostrar las cartillas inmediatamente
    displayCards();
    updateRepeatedNumbersPanel();
    toggleGameMode();
    startMessage.style.display = 'none';
    
    // Event listeners
    newGameBtn.addEventListener('click', resetAllMarks);
    returnHomeBtn.addEventListener('click', () => window.location.href = 'cartillas.html');
    gameModeSelect.addEventListener('change', toggleGameMode);
    
    // Event listeners para el modal de instrucciones
    howToPlayBtn.addEventListener('click', openInstructionsModal);
    closeModalBtn.addEventListener('click', closeInstructionsModal);
    window.addEventListener('click', function(event) {
        if (event.target === instructionsModal) {
            closeInstructionsModal();
        }
    });
    
    // Manejar las pestañas del modal
    document.querySelectorAll('.tablinks').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.tabcontent').forEach(content => {
                content.style.display = 'none';
            });
            
            // Desactivar todos los botones
            document.querySelectorAll('.tablinks').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Mostrar el contenido seleccionado y activar el botón
            document.getElementById(tabId).style.display = 'block';
            this.classList.add('active');
        });
    });
    
    function openInstructionsModal() {
        instructionsModal.style.display = 'block';
    }
    
    function closeInstructionsModal() {
        instructionsModal.style.display = 'none';
    }
    
    function toggleGameMode() {
        currentGameMode = gameModeSelect.value;
        
        if (currentGameMode === 'beginner') {
            createNumbersGrid();
            cardsContainer.style.width = '75%';
            cardsContainer.style.float = 'right';
            cardsContainer.classList.add('beginner-mode');
            
            updateRepeatedNumbersPanel();
            syncNumberGridWithCards();
        } else if (currentGameMode === 'intermediate') {
            if (allNumbersGrid) {
                allNumbersGrid.remove();
                allNumbersGrid = null;
            }
            cardsContainer.style.width = '100%';
            cardsContainer.style.float = 'none';
            cardsContainer.classList.remove('beginner-mode');
            updateRepeatedNumbersPanel();
        } else { // Modo tradicional
            if (allNumbersGrid) {
                allNumbersGrid.remove();
                allNumbersGrid = null;
            }
            cardsContainer.style.width = '100%';
            cardsContainer.style.float = 'none';
            cardsContainer.classList.remove('beginner-mode');
            repeatedPanel.style.display = 'none';
        }
        
        updateCellsForCurrentMode();
    }
    
    function getRepeatedNumbers() {
        if (isManualMode) return [];
        
        // Contar ocurrencias de cada número
        const numberCounts = {};
        selectedNumbers.forEach(num => {
            numberCounts[num] = (numberCounts[num] || 0) + 1;
        });
        
        // Filtrar los que aparecen más de una vez
        return Object.keys(numberCounts)
            .filter(num => numberCounts[num] > 1)
            .map(num => parseInt(num));
    }
    
    function updateRepeatedNumbersPanel() {
        repeatedNumbersContainer.innerHTML = '';
        
        if (isManualMode || currentGameMode === 'traditional') {
            repeatedPanel.style.display = 'none';
            return;
        }
        
        const repeatedNumbers = getRepeatedNumbers();
        
        if (repeatedNumbers.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No hay números repetidos en estas cartillas';
            message.className = 'empty-message';
            repeatedNumbersContainer.appendChild(message);
        } else {
            // Ordenar y mostrar números repetidos
            repeatedNumbers.sort((a, b) => a - b).forEach(number => {
                const numElement = document.createElement('div');
                numElement.className = 'repeated-number';
                numElement.textContent = number;
                repeatedNumbersContainer.appendChild(numElement);
            });
        }
        
        repeatedPanel.style.display = repeatedNumbers.length > 0 ? 'block' : 'none';
    }
    
    function updateCellsForCurrentMode() {
        const repeatedNumbers = getRepeatedNumbers();
        
        document.querySelectorAll('.card-cell').forEach(cell => {
            const number = parseInt(cell.dataset.number);
            
            // Manejar clase 'repeated' según el modo
            if (currentGameMode === 'traditional') {
                cell.classList.remove('repeated');
            } else if (!isManualMode && repeatedNumbers.includes(number)) {
                cell.classList.add('repeated');
            } else {
                cell.classList.remove('repeated');
            }
        });
    }
    
    function createNumbersGrid() {
        if (allNumbersGrid) return;
        
        // Crear contenedor para el grid de números
        allNumbersGrid = document.createElement('div');
        allNumbersGrid.className = 'numbers-grid-container';
        
        const title = document.createElement('h3');
        title.textContent = 'Números';
        title.style.textAlign = 'center';
        title.style.marginBottom = '15px';
        title.style.color = '#005f73';
        allNumbersGrid.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'numbers-grid';
        
        // Obtener todos los números únicos de las cartillas
        const allNumbers = new Set();
        bingoCards.forEach(card => {
            card.forEach(row => {
                row.forEach(num => allNumbers.add(num));
            });
        });
        
        // Convertir a array y ordenar
        const sortedNumbers = Array.from(allNumbers).sort((a, b) => a - b);
        
        // Crear celdas para cada número
        sortedNumbers.forEach(number => {
            const cell = document.createElement('div');
            cell.className = 'number-cell';
            cell.textContent = number;
            cell.dataset.number = number;
            
            // Verificar si el número está marcado en alguna cartilla
            const isMarked = document.querySelector(`.card-cell[data-number="${number}"].marked`) !== null;
            if (isMarked) {
                cell.classList.add('marked');
            }
            
            cell.addEventListener('click', function() {
                if (gameModeSelect.disabled) return;
                
                this.classList.toggle('marked');
                const isMarked = this.classList.contains('marked');
                
                // Marcar/desmarcar todas las casillas con este número
                document.querySelectorAll(`.card-cell[data-number="${number}"]`).forEach(cardCell => {
                    cardCell.classList.toggle('marked', isMarked);
                    
                    // Verificar patrones para la cartilla afectada
                    const cardIndex = cardCell.dataset.cardIndex;
                    checkWinPatterns(cardIndex);
                });
                
                // Bloquear el selector de modo si es la primera marca
                if (!gameStarted) {
                    gameStarted = true;
                    gameModeSelect.disabled = true;
                    gameModeSelect.classList.add('disabled-select');
                    startMessage.style.display = 'none';
                }
            });
            
            grid.appendChild(cell);
        });
        
        allNumbersGrid.appendChild(grid);
        cardsContainer.parentNode.insertBefore(allNumbersGrid, cardsContainer);
    }
    
    function syncNumberGridWithCards() {
        if (!allNumbersGrid) return;
        
        allNumbersGrid.querySelectorAll('.number-cell').forEach(cell => {
            const number = cell.dataset.number;
            const isMarked = document.querySelector(`.card-cell[data-number="${number}"].marked`) !== null;
            cell.classList.toggle('marked', isMarked);
        });
    }
    
    function displayCards() {
        cardsContainer.innerHTML = '';
        
        bingoCards.forEach((card, index) => {
            const cardElement = createCardElement(card, index);
            cardsContainer.appendChild(cardElement);
        });
    }
    
    function createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'bingo-card';
        
        const cardTitle = document.createElement('h3');
        cardTitle.className = 'card-title';
        cardTitle.textContent = `Cartilla ${index + 1}`;
        cardElement.appendChild(cardTitle);
        
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const number = card[row][col];
                const cell = createCellElement(number, index, row, col);
                cardGrid.appendChild(cell);
            }
        }
        
        cardElement.appendChild(cardGrid);
        return cardElement;
    }
    
    function createCellElement(number, cardIndex, row, col) {
        const cell = document.createElement('div');
        cell.className = 'card-cell';
        cell.dataset.number = number;
        cell.dataset.cardIndex = cardIndex;
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        // Marcar como repetido solo si no es modo tradicional y no es manual
        if (currentGameMode !== 'traditional' && !isManualMode && getRepeatedNumbers().includes(number)) {
            cell.classList.add('repeated');
        }
        
        // Crear imagen
        const img = document.createElement('img');
        img.alt = `Número ${number}`;
        
        // Crear marcador de número
        const numberBadge = document.createElement('div');
        numberBadge.className = 'number';
        numberBadge.textContent = number;
        
        // Crear marcador de selección
        const marker = document.createElement('div');
        marker.className = 'marker';
        
        // Cargar imagen
        loadImageForCell(img, number);
        
        cell.appendChild(img);
        cell.appendChild(numberBadge);
        cell.appendChild(marker);
        
        cell.addEventListener('click', function() {
            const currentNumber = parseInt(this.dataset.number);
            const isMarked = this.classList.toggle('marked');
            
            // Bloquear el selector de modo si es la primera marca
            if (!gameStarted) {
                gameStarted = true;
                gameModeSelect.disabled = true;
                gameModeSelect.classList.add('disabled-select');
                startMessage.style.display = 'none';
            }
            
            if (currentGameMode !== 'traditional') {
                document.querySelectorAll(`.card-cell[data-number="${currentNumber}"]`).forEach(otherCell => {
                    if (otherCell !== this || currentGameMode === 'beginner') {
                        otherCell.classList.toggle('marked', isMarked);
                    }
                });
            }
            
            if (currentGameMode === 'beginner' && allNumbersGrid) {
                const numberCell = allNumbersGrid.querySelector(`.number-cell[data-number="${currentNumber}"]`);
                if (numberCell) {
                    numberCell.classList.toggle('marked', isMarked);
                }
            }
            
            if (currentGameMode !== 'traditional') {
                checkWinPatterns(cardIndex);
            }
        });
        
        return cell;
    }
    
    function loadImageForCell(imgElement, number) {
        let imagePath;
        
        if (imageFormat === 'jpgA') {
            imagePath = `${number}A.jpg`;
        } else {
            imagePath = `${number}.${imageFormat}`;
        }
        
        imgElement.src = imagePath;
        
        imgElement.onerror = function() {
            if (imageFormat === 'jpgA') {
                this.src = `${number}.jpg`;
            } else {
                const fallbackFormat = imageFormat === 'webp' ? 'jpg' : 'webp';
                this.src = `${number}.${fallbackFormat}`;
            }
            
            this.onerror = function() {
                this.style.display = 'none';
                const parent = this.parentElement;
                parent.style.backgroundColor = !isManualMode && selectedNumbers.includes(number) ? '#FFD700' : '#94d2bd';
                parent.querySelector('.number').style.backgroundColor = 'transparent';
                parent.querySelector('.number').style.color = 'black';
            };
        };
    }
    
    function resetAllMarks() {
        document.querySelectorAll('.card-cell').forEach(cell => {
            cell.classList.remove('marked');
            cell.classList.remove('win-pattern');
        });
        
        if (allNumbersGrid) {
            allNumbersGrid.querySelectorAll('.number-cell').forEach(cell => {
                cell.classList.remove('marked');
            });
        }
        
        gameStarted = false;
        gameModeSelect.disabled = false;
        gameModeSelect.classList.remove('disabled-select');
        startMessage.style.display = 'none';
    }
    
    function checkWinPatterns(cardIndex) {
        if (currentGameMode === 'traditional') return false;
        
        const cardCells = document.querySelectorAll(`.card-cell[data-card-index="${cardIndex}"]`);
        const markedCells = Array.from(cardCells).filter(cell => cell.classList.contains('marked'));
        
        // Verificar cada patrón
        for (const [patternName, pattern] of Object.entries(winPatterns)) {
            const isPatternComplete = pattern.every(([row, col]) => {
                return Array.from(cardCells).some(cell => 
                    parseInt(cell.dataset.row) === row && 
                    parseInt(cell.dataset.col) === col && 
                    cell.classList.contains('marked')
                );
            });
            
            if (isPatternComplete) {
                highlightWinningPattern(cardIndex, pattern);
                showWinNotification(patternName, cardIndex);
                return true;
            }
        }
        
        return false;
    }
    
    function highlightWinningPattern(cardIndex, pattern) {
        // Quitar cualquier resaltado previo
        document.querySelectorAll(`.card-cell[data-card-index="${cardIndex}"]`).forEach(cell => {
            cell.classList.remove('win-pattern');
        });
        
        // Resaltar las celdas del patrón ganador
        pattern.forEach(([row, col]) => {
            const cell = document.querySelector(
                `.card-cell[data-card-index="${cardIndex}"][data-row="${row}"][data-col="${col}"]`
            );
            if (cell) {
                cell.classList.add('win-pattern');
            }
        });
    }
    
    function showWinNotification(patternName, cardIndex) {
        const winNotification = document.getElementById('win-notification');
        const readableName = getPatternReadableName(patternName);
        
        winNotification.textContent = `¡Gana en la Cartilla ${cardIndex + 1}!`;
        winNotification.classList.add('show');
        
        setTimeout(() => {
            winNotification.classList.remove('show');
        }, 3000);
    }
    
    function getPatternReadableName(patternName) {
        if (patternName.startsWith('fila_')) {
            return `Fila ${parseInt(patternName.split('_')[1]) + 1}`;
        } else if (patternName.startsWith('columna_')) {
            return `Columna ${parseInt(patternName.split('_')[1]) + 1}`;
        } else if (patternName === 'diagonal_principal') {
            return 'Diagonal principal';
        } else if (patternName === 'diagonal_secundaria') {
            return 'Diagonal secundaria';
        } else if (patternName.startsWith('custom_')) {
            return `Patrón ${patternName.split('_')[1]}`;
        }
        return patternName;
    }
});