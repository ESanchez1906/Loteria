document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const designSelector = document.getElementById('design-style');
    const autoModeBtn = document.getElementById('auto-mode');
    const manualModeBtn = document.getElementById('manual-mode');
    const resetBtn = document.getElementById('reset-btn');
    const resetCurrentCardBtn = document.getElementById('reset-current-card');
    const numberGrid = document.getElementById('number-grid');
    const autoNumberGrid = document.getElementById('auto-number-grid');
    const selectedCount = document.getElementById('selected-count');
    const confirmSelectionBtn = document.getElementById('confirm-selection');
    const autoConfirmSelectionBtn = document.getElementById('auto-confirm-selection');
    const cardsContainer = document.getElementById('cards-container');
    const regenerateCardsBtn = document.getElementById('regenerate-cards');
    const changeNumbersBtn = document.getElementById('change-numbers');
    const generateImagesBtn = document.getElementById('generate-images');
    const previewContainer = document.getElementById('preview-container');
    const backToCardsBtn = document.getElementById('back-to-cards');
    const loader = document.getElementById('loader');
    const manualLayout = document.getElementById('manual-layout');
    const autoSelection = document.getElementById('auto-selection');
    const fillRandomBtn = document.getElementById('fill-random');
    const repeatsList = document.getElementById('repeats-list');
    const cardNavigation = document.getElementById('card-navigation');
    const cardGrid = document.getElementById('card-grid');
    const currentCardNumber = document.getElementById('current-card-number');
    const repeatedCount = document.getElementById('repeated-count');
    const remainingCount = document.getElementById('remaining-count');
    
    // Elementos del modal
    const modal = document.getElementById('card-modal');
    const modalCanvas = document.getElementById('modal-card-canvas');
    const modalCardNumber = document.getElementById('modal-card-number');
    const prevCardBtn = document.getElementById('prev-card');
    const nextCardBtn = document.getElementById('next-card');
    const closeModalBtn = document.querySelector('.close-modal');
    const openPlayPageBtn = document.getElementById('open-play-page');
    
    // Secciones del flujo
    const numberSelectionSection = document.getElementById('number-selection');
    const cardGenerationSection = document.getElementById('card-generation');
    const imagePreviewSection = document.getElementById('image-preview');
    
    // Estado de la aplicación
    let selectedNumbers = [];
    let bingoCards = [];
    let currentImageFormat = 'webp';
    let isManualMode = false;
    let currentManualCard = 0;
    let manualCardsNumbers = Array(4).fill().map(() => Array(5).fill().map(() => Array(5).fill(null)));
    let usedNumbers = new Map();
    let repeatedNumbersCount = 0;
    const MAX_REPEATED = 10;
    
    // Estado del modal
    let currentModalCardIndex = 0;
    
    // Inicializar la aplicación
    initApp();

    function initApp() {
        setupModeButtons();
        resetBtn.addEventListener('click', resetApp);
        resetCurrentCardBtn.addEventListener('click', resetCurrentCard);
        
        // Event listeners para el modal
        closeModalBtn.addEventListener('click', closeModal);
        prevCardBtn.addEventListener('click', showPrevCard);
        nextCardBtn.addEventListener('click', showNextCard);
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Event listeners principales
        confirmSelectionBtn.addEventListener('click', generateBingoCards);
        autoConfirmSelectionBtn.addEventListener('click', generateBingoCards);
        regenerateCardsBtn.addEventListener('click', regenerateBingoCards);
        changeNumbersBtn.addEventListener('click', goBackToNumberSelection);
        generateImagesBtn.addEventListener('click', generateCardImages);
        backToCardsBtn.addEventListener('click', goBackToCardGeneration);
        designSelector.addEventListener('change', function() {
            currentImageFormat = this.value;
            initNumberGrids();
        });
        fillRandomBtn.addEventListener('click', fillEmptyCellsRandomly);
        openPlayPageBtn.addEventListener('click', openPlayPage);

        initNumberGrids();
    }

    function resetCurrentCard() {
        const currentCard = manualCardsNumbers[currentManualCard];
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const num = currentCard[row][col];
                if (num !== null) {
                    const count = usedNumbers.get(num) || 0;
                    
                    if (count > 1) {
                        repeatedNumbersCount--;
                        usedNumbers.set(num, count - 1);
                    } else {
                        usedNumbers.delete(num);
                    }
                    
                    currentCard[row][col] = null;
                }
            }
        }
        
        updateCurrentCardGrid();
        updateUIForCurrentMode();
        updateNumberGridHighlights();
        updateRepeatsList();
    }
    
    function resetApp() {
        selectedNumbers = [];
        bingoCards = [];
        currentManualCard = 0;
        manualCardsNumbers = Array(4).fill().map(() => Array(5).fill().map(() => Array(5).fill(null)));
        usedNumbers = new Map();
        repeatedNumbersCount = 0;
        currentModalCardIndex = 0;
        
        manualLayout.style.display = 'none';
        autoSelection.style.display = 'block';
        numberSelectionSection.classList.remove('hidden-step');
        numberSelectionSection.classList.add('active-step');
        cardGenerationSection.classList.remove('active-step');
        cardGenerationSection.classList.add('hidden-step');
        imagePreviewSection.classList.remove('active-step');
        imagePreviewSection.classList.add('hidden-step');
        
        isManualMode = false;
        autoModeBtn.classList.add('active');
        manualModeBtn.classList.remove('active');
        
        updateUIForCurrentMode();
        initNumberGrids();
    }
    
    function setupModeButtons() {
        autoModeBtn.addEventListener('click', function() {
            isManualMode = false;
            manualLayout.style.display = 'none';
            autoSelection.style.display = 'block';
            autoModeBtn.classList.add('active');
            manualModeBtn.classList.remove('active');
            resetManualMode();
            initNumberGrids();
            updateUIForCurrentMode();
        });
        
        manualModeBtn.addEventListener('click', function() {
            isManualMode = true;
            manualLayout.style.display = 'grid';
            autoSelection.style.display = 'none';
            manualModeBtn.classList.add('active');
            autoModeBtn.classList.remove('active');
            resetManualMode();
            initNumberGrids();
            updateUIForCurrentMode();
        });
    }
    
    function resetManualMode() {
        manualCardsNumbers = Array(4).fill().map(() => Array(5).fill().map(() => Array(5).fill(null)));
        usedNumbers = new Map();
        repeatedNumbersCount = 0;
        currentManualCard = 0;
        selectedNumbers = [];
    }
    
    function initNumberGrids() {
        numberGrid.innerHTML = '';
        autoNumberGrid.innerHTML = '';
        
        // Grid manual (solo números)
        for (let i = 1; i <= 90; i++) {
            const numberCell = document.createElement('div');
            numberCell.className = 'number-cell';
            numberCell.dataset.number = i;
            numberCell.textContent = i;
            
            numberCell.addEventListener('click', function() {
                if (isManualMode) {
                    handleManualNumberSelection(i);
                }
            });
            
            numberGrid.appendChild(numberCell);
        }
        
        // Grid automático (con imágenes)
        if (!isManualMode) {
            for (let i = 1; i <= 90; i++) {
                const numberCell = document.createElement('div');
                numberCell.className = 'number-cell';
                numberCell.dataset.number = i;
                
                const img = document.createElement('img');
                img.alt = `Número ${i}`;
                
                const numberText = document.createElement('div');
                numberText.className = 'number-text visible';
                numberText.textContent = i;
                
                numberCell.appendChild(img);
                numberCell.appendChild(numberText);
                
                loadImageForCell(img, numberText, numberCell, i);
                
                numberCell.addEventListener('click', function() {
                    if (!isManualMode) {
                        toggleNumberSelection(i);
                    }
                });
                
                autoNumberGrid.appendChild(numberCell);
            }
        }
        
        if (isManualMode) {
            createCardNavigation();
            updateCurrentCardGrid();
            updateRepeatsList();
        }
    }
    
    function loadImageForCell(imgElement, textElement, cellElement, number) {
        let imagePath = currentImageFormat === 'jpgA' ? `${number}A.jpg` : `${number}.${currentImageFormat}`;
        imgElement.src = imagePath;
        
        imgElement.onload = function() {
            this.style.display = 'block';
            textElement.style.display = 'block';
            cellElement.style.backgroundColor = '';
        };
        
        imgElement.onerror = function() {
            if (currentImageFormat === 'jpgA') {
                this.src = `${number}.jpg`;
            } else {
                const fallbackFormat = currentImageFormat === 'webp' ? 'jpg' : 'webp';
                this.src = `${number}.${fallbackFormat}`;
            }
            
            this.onerror = function() {
                this.style.display = 'none';
                textElement.style.display = 'block';
                cellElement.style.backgroundColor = '#6c757d';
            };
        };
    }
    
    function updateUIForCurrentMode() {
        if (isManualMode) {
            currentCardNumber.textContent = currentManualCard + 1;
            repeatedCount.textContent = repeatedNumbersCount;
            remainingCount.textContent = 90 - usedNumbers.size;
            confirmSelectionBtn.disabled = !allCardsComplete() || repeatedNumbersCount !== MAX_REPEATED;
        } else {
            selectedCount.textContent = selectedNumbers.length;
            autoConfirmSelectionBtn.disabled = selectedNumbers.length !== 10;
        }
    }
    
    function allCardsComplete() {
        for (let i = 0; i < 4; i++) {
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (manualCardsNumbers[i][row][col] === null) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    function createCardNavigation() {
        cardNavigation.innerHTML = '';
        
        for (let i = 0; i < 4; i++) {
            const cardBtn = document.createElement('button');
            cardBtn.className = `card-nav-btn ${i === currentManualCard ? 'active' : ''}`;
            cardBtn.textContent = `Cartilla ${i + 1}`;
            cardBtn.addEventListener('click', () => {
                currentManualCard = i;
                document.querySelectorAll('.card-nav-btn').forEach(btn => btn.classList.remove('active'));
                cardBtn.classList.add('active');
                updateCurrentCardGrid();
                updateUIForCurrentMode();
                updateNumberGridHighlights();
            });
            cardNavigation.appendChild(cardBtn);
        }
    }
    
    function updateCurrentCardGrid() {
        cardGrid.innerHTML = '';
        currentCardNumber.textContent = currentManualCard + 1;
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'card-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const number = manualCardsNumbers[currentManualCard][row][col];
                if (number !== null) {
                    cell.textContent = number;
                    const count = usedNumbers.get(number) || 0;
                    if (count > 1) {
                        cell.classList.add('highlight');
                    }
                } else {
                    cell.innerHTML = '<i class="fas fa-plus" style="color: #6c757d;"></i>';
                    cell.classList.add('missing');
                }
                
                cell.addEventListener('click', function() {
                    handleManualCellClick(row, col);
                });
                
                cardGrid.appendChild(cell);
            }
        }
    }
    
    function handleManualCellClick(row, col) {
        const currentNumber = manualCardsNumbers[currentManualCard][row][col];
        if (currentNumber !== null) {
            const count = usedNumbers.get(currentNumber) || 0;
            
            if (count > 1) {
                repeatedNumbersCount--;
                usedNumbers.set(currentNumber, count - 1);
            } else {
                usedNumbers.delete(currentNumber);
            }
            
            manualCardsNumbers[currentManualCard][row][col] = null;
        }
        
        updateCurrentCardGrid();
        updateUIForCurrentMode();
        updateNumberGridHighlights();
        updateRepeatsList();
    }
    
    function handleManualNumberSelection(number) {
        let emptyCellFound = false;
        
        for (let row = 0; row < 5 && !emptyCellFound; row++) {
            for (let col = 0; col < 5 && !emptyCellFound; col++) {
                if (manualCardsNumbers[currentManualCard][row][col] === null) {
                    emptyCellFound = true;
                    
                    const currentCount = usedNumbers.get(number) || 0;
                    
                    if (currentCount >= 1) {
                        if (repeatedNumbersCount < MAX_REPEATED) {
                            usedNumbers.set(number, currentCount + 1);
                            repeatedNumbersCount++;
                        } else {
                            showCustomAlert(`Ya has alcanzado el máximo de ${MAX_REPEATED} números repetidos.`);
                            return;
                        }
                    } else {
                        usedNumbers.set(number, 1);
                    }
                    
                    manualCardsNumbers[currentManualCard][row][col] = number;
                }
            }
        }
        
        if (!emptyCellFound) {
            showCustomAlert('Esta cartilla ya está completa. Haz clic en un número existente para reemplazarlo.');
            return;
        }
        
        updateCurrentCardGrid();
        updateUIForCurrentMode();
        updateNumberGridHighlights();
        updateRepeatsList();
    }
    
    function fillEmptyCellsRandomly() {
        const currentCard = manualCardsNumbers[currentManualCard];
        const emptyCells = [];
        const availableNumbers = [];
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (currentCard[row][col] === null) {
                    emptyCells.push({row, col});
                }
            }
        }
        
        if (emptyCells.length === 0) {
            showCustomAlert('Esta cartilla ya está completa.');
            return;
        }
        
        const remainingRepeats = MAX_REPEATED - repeatedNumbersCount;
        const canAddMoreRepeats = remainingRepeats > 0;
        
        for (let num = 1; num <= 90; num++) {
            const count = usedNumbers.get(num) || 0;
            
            if (count === 0 || (count === 1 && canAddMoreRepeats)) {
                availableNumbers.push({
                    number: num,
                    canRepeat: count === 1
                });
            }
        }
        
        shuffleArray(availableNumbers);
        
        const nonRepeatedNumbers = availableNumbers.filter(item => !item.canRepeat);
        for (const cell of emptyCells) {
            if (nonRepeatedNumbers.length > 0) {
                const numObj = nonRepeatedNumbers.pop();
                currentCard[cell.row][cell.col] = numObj.number;
                usedNumbers.set(numObj.number, 1);
            }
        }
        
        const remainingEmptyCells = emptyCells.filter(cell => currentCard[cell.row][cell.col] === null);
        const repeatedNumbers = availableNumbers.filter(item => item.canRepeat);
        
        for (const cell of remainingEmptyCells) {
            if (repeatedNumbers.length > 0 && repeatedNumbersCount < MAX_REPEATED) {
                const numObj = repeatedNumbers.pop();
                currentCard[cell.row][cell.col] = numObj.number;
                usedNumbers.set(numObj.number, 2);
                repeatedNumbersCount++;
            } else {
                showCustomAlert('No hay números disponibles que cumplan las reglas de repetición.');
                break;
            }
        }
        
        updateCurrentCardGrid();
        updateUIForCurrentMode();
        updateNumberGridHighlights();
        updateRepeatsList();
    }
    
    function updateRepeatsList() {
        repeatsList.innerHTML = '';
        
        const repeatedNumbers = [];
        usedNumbers.forEach((count, num) => {
            if (count > 1) {
                repeatedNumbers.push({num, count});
            }
        });
        
        repeatedNumbers.sort((a, b) => a.num - b.num);
        
        repeatedNumbers.forEach(item => {
            const elem = document.createElement('div');
            elem.className = 'repeat-number';
            elem.textContent = item.num;
            elem.title = `Repetido ${item.count} veces`;
            repeatsList.appendChild(elem);
        });
        
        repeatedCount.textContent = repeatedNumbersCount;
        remainingCount.textContent = 90 - usedNumbers.size;
    }
    
    function updateNumberGridHighlights() {
        document.querySelectorAll('#number-grid .number-cell').forEach(cell => {
            const number = parseInt(cell.dataset.number);
            cell.classList.remove('selected', 'used');
            
            const count = usedNumbers.get(number) || 0;
            
            if (count > 1) {
                cell.classList.add('selected');
            } else if (count === 1) {
                cell.classList.add('used');
            }
        });
    }
    
    function toggleNumberSelection(number) {
        const index = selectedNumbers.indexOf(number);
        const numberCell = document.querySelector(`#auto-number-grid .number-cell[data-number="${number}"]`);
        
        if (index === -1) {
            if (selectedNumbers.length < 10) {
                selectedNumbers.push(number);
                numberCell.classList.add('selected');
            }
        } else {
            selectedNumbers.splice(index, 1);
            numberCell.classList.remove('selected');
        }
        
        selectedCount.textContent = selectedNumbers.length;
        autoConfirmSelectionBtn.disabled = selectedNumbers.length !== 10;
    }
    
    function generateBingoCards() {
        if (isManualMode) {
            for (let i = 0; i < 4; i++) {
                if (!isManualCardComplete(i)) {
                    const confirmFill = confirm(`La cartilla ${i + 1} no está completa. ¿Deseas rellenar los espacios vacíos automáticamente?`);
                    
                    if (confirmFill) {
                        currentManualCard = i;
                        fillEmptyCellsRandomly();
                    } else {
                        return;
                    }
                }
            }
            
            if (repeatedNumbersCount !== MAX_REPEATED) {
                const remaining = MAX_REPEATED - repeatedNumbersCount;
                const confirmAdjust = confirm(`Debes tener exactamente ${MAX_REPEATED} números repetidos. Actualmente tienes ${repeatedNumbersCount} (faltan ${remaining}). ¿Deseas que ajustemos automáticamente?`);
                
                if (confirmAdjust) {
                    if (!adjustRepeatedNumbersStrict()) {
                        showCustomAlert('No se pudo ajustar automáticamente. Por favor ajusta manualmente los números repetidos.');
                        return;
                    }
                } else {
                    return;
                }
            }
            
            const allNumbersPresent = validateAllNumbersPresent();
            if (!allNumbersPresent.missing.length) {
                bingoCards = manualCardsNumbers.map(card => {
                    const formattedCard = [];
                    for (let row = 0; row < 5; row++) {
                        formattedCard.push([...card[row]]);
                    }
                    return formattedCard;
                });
            } else {
                showCustomAlert(`Faltan los siguientes números: ${allNumbersPresent.missing.join(', ')}. Por favor inclúyelos en tus cartillas.`);
                return;
            }
        } else {
            if (selectedNumbers.length !== 10) {
                showCustomAlert('Por favor selecciona exactamente 10 números.');
                return;
            }
            
            try {
                bingoCards = generateCardsWithDuplicates(selectedNumbers);
            } catch (e) {
                showCustomAlert('Error al generar las cartillas: ' + e.message);
                return;
            }
        }
        
        displayBingoCards();
        
        numberSelectionSection.classList.remove('active-step');
        numberSelectionSection.classList.add('hidden-step');
        cardGenerationSection.classList.remove('hidden-step');
        cardGenerationSection.classList.add('active-step');
    }
    
    function generateCardsWithDuplicates(selectedNums) {
        if (selectedNums.length !== 10) {
            throw new Error('Deben seleccionarse exactamente 10 números');
        }

        const MAX_ATTEMPTS = 1000;
        let attempts = 0;
        let success = false;
        let cards = [];

        while (!success && attempts < MAX_ATTEMPTS) {
            attempts++;
            try {
                cards = attemptGenerateCardsWithRandomDistribution(selectedNums);
                success = validateCards(cards, selectedNums);
            } catch (e) {
                continue;
            }
        }

        if (!success) {
            throw new Error(`No se pudo generar las cartillas después de ${MAX_ATTEMPTS} intentos. Intenta con diferentes números.`);
        }

        return cards;
    }

    function attemptGenerateCardsWithRandomDistribution(selectedNums) {
        const duplicatedSelected = [...selectedNums, ...selectedNums];
        const otherNumbers = Array.from({length: 90}, (_, i) => i + 1)
            .filter(num => !selectedNums.includes(num));
        
        shuffleArray(duplicatedSelected);
        shuffleArray(otherNumbers);

        const cards = [];
        const selectedUsage = new Map(selectedNums.map(num => [num, 0]));

        for (let i = 0; i < 4; i++) {
            const cardNumbers = [];
            const usedInCard = new Set();

            let selectedInCard = 0;
            while (selectedInCard < 5) {
                const availableSelected = duplicatedSelected.filter(num => 
                    selectedUsage.get(num) < 2 && !usedInCard.has(num)
                );

                if (availableSelected.length === 0) {
                    throw new Error('No hay números seleccionados disponibles');
                }

                const randomIndex = Math.floor(Math.random() * availableSelected.length);
                const num = availableSelected[randomIndex];

                const insertPos = Math.floor(Math.random() * (cardNumbers.length + 1));
                cardNumbers.splice(insertPos, 0, num);
                
                usedInCard.add(num);
                selectedUsage.set(num, selectedUsage.get(num) + 1);
                selectedInCard++;
            }
            
            const remainingNumbers = otherNumbers.filter(num => !usedInCard.has(num));
            shuffleArray(remainingNumbers);
            
            for (const num of remainingNumbers.slice(0, 20)) {
                const insertPos = Math.floor(Math.random() * (cardNumbers.length + 1));
                cardNumbers.splice(insertPos, 0, num);
                usedInCard.add(num);
            }
            
            const card = [];
            for (let row = 0; row < 5; row++) {
                card.push(cardNumbers.slice(row * 5, (row + 1) * 5));
            }
            
            cards.push(card);
        }

        return cards;
    }

    function validateCards(cards, selectedNums) {
        const countMap = new Map(selectedNums.map(num => [num, 0]));
        
        cards.forEach(card => {
            card.forEach(row => {
                row.forEach(num => {
                    if (selectedNums.includes(num)) {
                        countMap.set(num, countMap.get(num) + 1);
                    }
                });
            });
        });
        
        for (const [num, count] of countMap) {
            if (count !== 2) {
                return false;
            }
        }
        
        for (const card of cards) {
            const uniqueNumbers = new Set(card.flat());
            if (uniqueNumbers.size !== 25) {
                return false;
            }
        }
        
        return true;
    }

    function validateAllNumbersPresent() {
        const presentNumbers = new Set();
        const missingNumbers = [];
        
        for (let cardIdx = 0; cardIdx < 4; cardIdx++) {
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    presentNumbers.add(manualCardsNumbers[cardIdx][row][col]);
                }
            }
        }
        
        for (let num = 1; num <= 90; num++) {
            if (!presentNumbers.has(num)) {
                missingNumbers.push(num);
            }
        }
        
        return {
            allPresent: missingNumbers.length === 0,
            missing: missingNumbers
        };
    }
    
    function adjustRepeatedNumbersStrict() {
        const needed = MAX_REPEATED - repeatedNumbersCount;
        
        if (needed > 0) {
            const singleUseNumbers = [];
            
            usedNumbers.forEach((count, num) => {
                if (count === 1) {
                    singleUseNumbers.push(num);
                }
            });
            
            shuffleArray(singleUseNumbers);
            
            let added = 0;
            for (const num of singleUseNumbers) {
                if (added >= needed) break;
                
                for (let cardIdx = 0; cardIdx < 4; cardIdx++) {
                    let addedInThisCard = false;
                    
                    for (let row = 0; row < 5 && !addedInThisCard; row++) {
                        for (let col = 0; col < 5 && !addedInThisCard; col++) {
                            if (manualCardsNumbers[cardIdx][row][col] === null) {
                                manualCardsNumbers[cardIdx][row][col] = num;
                                usedNumbers.set(num, 2);
                                repeatedNumbersCount++;
                                added++;
                                addedInThisCard = true;
                            }
                        }
                    }
                    
                    if (addedInThisCard) break;
                }
            }
            
            return added === needed;
        } else if (needed < 0) {
            const repeatedNums = [];
            
            usedNumbers.forEach((count, num) => {
                if (count > 1) {
                    repeatedNums.push(num);
                }
            });
            
            shuffleArray(repeatedNums);
            
            let removed = 0;
            for (const num of repeatedNums) {
                if (removed >= -needed) break;
                
                for (let cardIdx = 0; cardIdx < 4; cardIdx++) {
                    let removedInThisCard = false;
                    
                    for (let row = 0; row < 5 && !removedInThisCard; row++) {
                        for (let col = 0; col < 5 && !removedInThisCard; col++) {
                            if (manualCardsNumbers[cardIdx][row][col] === num) {
                                manualCardsNumbers[cardIdx][row][col] = null;
                                usedNumbers.set(num, 1);
                                repeatedNumbersCount--;
                                removed++;
                                removedInThisCard = true;
                            }
                        }
                    }
                    
                    if (removedInThisCard) break;
                }
            }
            
            return removed === -needed;
        }
        
        return true;
    }
    
    function isManualCardComplete(cardIdx) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (manualCardsNumbers[cardIdx][row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function displayBingoCards() {
        cardsContainer.innerHTML = '';
        
        bingoCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'bingo-card';
            
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            cardHeader.textContent = `Cartilla ${index + 1}`;
            cardElement.appendChild(cardHeader);
            
            const cardGrid = document.createElement('div');
            cardGrid.className = 'card-grid';
            
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'card-cell';
                    cell.textContent = card[row][col];
                    
                    if (isManualMode) {
                        const count = usedNumbers.get(card[row][col]) || 0;
                        if (count > 1) {
                            cell.classList.add('highlight');
                        }
                    } else if (selectedNumbers.includes(card[row][col])) {
                        cell.classList.add('highlight');
                    }
                    
                    cardGrid.appendChild(cell);
                }
            }
            
            cardElement.appendChild(cardGrid);
            cardsContainer.appendChild(cardElement);
        });
    }
    
    function regenerateBingoCards() {
        if (isManualMode) {
            bingoCards = manualCardsNumbers.map(card => {
                const formattedCard = [];
                for (let row = 0; row < 5; row++) {
                    formattedCard.push([...card[row]]);
                }
                return formattedCard;
            });
        } else {
            try {
                bingoCards = generateCardsWithDuplicates(selectedNumbers);
            } catch (e) {
                showCustomAlert('Error al regenerar las cartillas: ' + e.message);
                return;
            }
        }
        displayBingoCards();
    }
    
    function goBackToNumberSelection() {
        cardGenerationSection.classList.remove('active-step');
        cardGenerationSection.classList.add('hidden-step');
        numberSelectionSection.classList.remove('hidden-step');
        numberSelectionSection.classList.add('active-step');
    }
    
    function goBackToCardGeneration() {
        imagePreviewSection.classList.remove('active-step');
        imagePreviewSection.classList.add('hidden-step');
        cardGenerationSection.classList.remove('hidden-step');
        cardGenerationSection.classList.add('active-step');
    }
    
    async function generateCardImages() {
        loader.style.display = 'flex';
        
        try {
            previewContainer.innerHTML = '';
            
            const canvasPromises = bingoCards.map((card, i) => createCardImage(card, i + 1));
            const canvases = await Promise.all(canvasPromises);
            
            canvases.forEach((canvas, index) => {
                const previewCard = document.createElement('div');
                previewCard.className = 'preview-card';
                previewCard.appendChild(canvas);
                
                previewCard.addEventListener('click', () => {
                    openModal(index);
                });
                
                previewContainer.appendChild(previewCard);
            });
            
            cardGenerationSection.classList.remove('active-step');
            cardGenerationSection.classList.add('hidden-step');
            imagePreviewSection.classList.remove('hidden-step');
            imagePreviewSection.classList.add('active-step');
        } catch (error) {
            console.error('Error generando imágenes:', error);
            showCustomAlert('Ocurrió un error al generar las imágenes. Por favor verifica que todas las imágenes de números estén disponibles.');
        } finally {
            loader.style.display = 'none';
        }
    }
    
    function openModal(cardIndex) {
        currentModalCardIndex = cardIndex;
        updateModalCard();
        modal.style.display = 'block';
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }
    
    function showPrevCard() {
        if (currentModalCardIndex > 0) {
            currentModalCardIndex--;
            updateModalCard();
        }
    }
    
    function showNextCard() {
        if (currentModalCardIndex < bingoCards.length - 1) {
            currentModalCardIndex++;
            updateModalCard();
        }
    }
    
    async function updateModalCard() {
        modalCardNumber.textContent = `${currentModalCardIndex + 1}/${bingoCards.length}`;
        
        prevCardBtn.disabled = currentModalCardIndex === 0;
        nextCardBtn.disabled = currentModalCardIndex === bingoCards.length - 1;
        
        const ctx = modalCanvas.getContext('2d');
        const card = bingoCards[currentModalCardIndex];
        
        const cellSize = 150;
        const padding = 20;
        const margin = 40;
        const width = 5 * cellSize + 2 * padding + 2 * margin;
        const height = 5 * cellSize + 2 * padding + 2 * margin;
        
        modalCanvas.width = width;
        modalCanvas.height = height;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.strokeRect(margin/2, margin/2, width - margin, height - margin);
        ctx.setLineDash([]);
        
        const imagePromises = [];
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const number = card[row][col];
                const x = margin + padding + col * cellSize;
                const y = margin + padding + row * cellSize;
                
                ctx.strokeStyle = isManualMode 
                    ? ((usedNumbers.get(number) || 0) > 1 ? '#ca6702' : '#0a9396')
                    : (selectedNumbers.includes(number) ? '#ca6702' : '#0a9396');
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, cellSize, cellSize);
                
                imagePromises.push(
                    (async () => {
                        try {
                            let img;
                            try {
                                if (currentImageFormat === 'jpgA') {
                                    img = await loadImage(`${number}A.jpg`);
                                } else {
                                    img = await loadImage(`${number}.${currentImageFormat}`);
                                }
                            } catch (e) {
                                img = await loadImage(`${number}.jpg`);
                            }
                            
                            const imgPadding = 5;
                            ctx.drawImage(
                                img, 
                                x + imgPadding, 
                                y + imgPadding, 
                                cellSize - 2 * imgPadding, 
                                cellSize - 2 * imgPadding
                            );
                            
                        } catch (error) {
                            console.error(`Error cargando imagen para número ${number}:`, error);
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            ctx.fillRect(x + cellSize/2 - 25, y + cellSize/2 - 25, 50, 50);
                            
                            ctx.fillStyle = isManualMode
                                ? ((usedNumbers.get(number) || 0) > 1 ? '#ca6702' : '#005f73')
                                : (selectedNumbers.includes(number) ? '#ca6702' : '#005f73');
                            ctx.font = 'bold 36px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(number, x + cellSize/2, y + cellSize/2);
                        }
                        
                        if (currentImageFormat === 'webp') {
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                            ctx.fillRect(x + 5, y + 15, 40, 30);
                            
                            ctx.fillStyle = isManualMode
                                ? ((usedNumbers.get(number) || 0) > 1 ? '#FFD700' : 'white')
                                : (selectedNumbers.includes(number)) ? '#FFD700' : 'white';
                            ctx.font = 'bold 20px Arial';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                            ctx.shadowBlur = 3;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            ctx.fillText(number, x + 10, y + 30);
                            ctx.shadowColor = 'transparent';
                        }
                    })()
                );
            }
        }
        
        await Promise.all(imagePromises);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = 'italic 14px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Generado por E. Sanchez', margin + 10, height - margin - 3);
    }
    
    async function createCardImage(cardNumbers, cardIndex) {
        return new Promise(async (resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const cellSize = 150;
            const padding = 20;
            const margin = 40;
            const width = 5 * cellSize + 2 * padding + 2 * margin;
            const height = 5 * cellSize + 2 * padding + 2 * margin;
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            ctx.strokeRect(margin/2, margin/2, width - margin, height - margin);
            ctx.setLineDash([]);
            
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    const number = cardNumbers[row][col];
                    const x = margin + padding + col * cellSize;
                    const y = margin + padding + row * cellSize;
                    
                    ctx.strokeStyle = isManualMode 
                        ? ((usedNumbers.get(number) || 0) > 1 ? '#ca6702' : '#0a9396')
                        : (selectedNumbers.includes(number) ? '#ca6702' : '#0a9396');
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, cellSize, cellSize);
                    
                    try {
                        let img;
                        try {
                            if (currentImageFormat === 'jpgA') {
                                img = await loadImage(`${number}A.jpg`);
                            } else {
                                img = await loadImage(`${number}.${currentImageFormat}`);
                            }
                        } catch (e) {
                            img = await loadImage(`${number}.jpg`);
                        }
                        
                        const imgPadding = 5;
                        ctx.drawImage(
                            img, 
                            x + imgPadding, 
                            y + imgPadding, 
                            cellSize - 2 * imgPadding, 
                            cellSize - 2 * imgPadding
                        );
                        
                    } catch (error) {
                        console.error(`Error cargando imagen para número ${number}:`, error);
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                        ctx.fillRect(x + cellSize/2 - 25, y + cellSize/2 - 25, 50, 50);
                        
                        ctx.fillStyle = isManualMode
                            ? ((usedNumbers.get(number) || 0) > 1 ? '#ca6702' : '#005f73')
                            : (selectedNumbers.includes(number) ? '#ca6702' : '#005f73');
                        ctx.font = 'bold 36px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(number, x + cellSize/2, y + cellSize/2);
                    }
                    
                    if (currentImageFormat === 'webp') {
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        ctx.fillRect(x + 5, y + 15, 40, 30);
                        
                        ctx.fillStyle = isManualMode
                            ? ((usedNumbers.get(number) || 0) > 1 ? '#FFD700' : 'white')
                            : (selectedNumbers.includes(number)) ? '#FFD700' : 'white';
                        ctx.font = 'bold 20px Arial';
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                        ctx.shadowBlur = 3;
                        ctx.shadowOffsetX = 1;
                        ctx.shadowOffsetY = 1;
                        ctx.fillText(number, x + 10, y + 30);
                        ctx.shadowColor = 'transparent';
                    }
                }
            }
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.font = 'italic 14px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText('Generado por E. Sanchez', margin + 10, height - margin - 3);
            
            setTimeout(() => {
                resolve(canvas);
            }, 100);
        });
    }
    
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    function openPlayPage() {
        localStorage.setItem('bingoCards', JSON.stringify(bingoCards));
        localStorage.setItem('isManualMode', isManualMode);
        localStorage.setItem('usedNumbers', JSON.stringify(Array.from(usedNumbers.entries())));
        localStorage.setItem('selectedNumbers', JSON.stringify(selectedNumbers));
        localStorage.setItem('imageFormat', currentImageFormat);
        
        window.open('play.html', '_blank');
    }

    function showCustomAlert(message) {
        // Implementación de alerta personalizada para evitar el problema de iframe
        const alertDiv = document.createElement('div');
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.backgroundColor = 'white';
        alertDiv.style.padding = '20px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        alertDiv.style.zIndex = '9999';
        
        const messageP = document.createElement('p');
        messageP.textContent = message;
        alertDiv.appendChild(messageP);
        
        const okButton = document.createElement('button');
        okButton.textContent = 'Aceptar';
        okButton.style.marginTop = '10px';
        okButton.style.padding = '5px 15px';
        okButton.addEventListener('click', () => {
            document.body.removeChild(alertDiv);
        });
        alertDiv.appendChild(okButton);
        
        document.body.appendChild(alertDiv);
    }
});