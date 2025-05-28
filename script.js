document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const numberGrid = document.getElementById('number-grid');
    const selectedCount = document.getElementById('selected-count');
    const confirmSelectionBtn = document.getElementById('confirm-selection');
    const cardsContainer = document.getElementById('cards-container');
    const regenerateCardsBtn = document.getElementById('regenerate-cards');
    const changeNumbersBtn = document.getElementById('change-numbers');
    const generateImagesBtn = document.getElementById('generate-images');
    const previewContainer = document.getElementById('preview-container');
    const backToCardsBtn = document.getElementById('back-to-cards');
    const loader = document.getElementById('loader');
    
    // Secciones del flujo
    const numberSelectionSection = document.getElementById('number-selection');
    const cardGenerationSection = document.getElementById('card-generation');
    const imagePreviewSection = document.getElementById('image-preview');
    
    // Estado de la aplicación
    let selectedNumbers = [];
    let bingoCards = [];
    
    // Inicializar la aplicación
    initNumberGrid();
    
    // Event listeners
    confirmSelectionBtn.addEventListener('click', generateBingoCards);
    regenerateCardsBtn.addEventListener('click', regenerateBingoCards);
    changeNumbersBtn.addEventListener('click', goBackToNumberSelection);
    generateImagesBtn.addEventListener('click', generateCardImages);
    backToCardsBtn.addEventListener('click', goBackToCardGeneration);
    
    // Funciones
    
    function initNumberGrid() {
        numberGrid.innerHTML = '';
        
        for (let i = 1; i <= 90; i++) {
            const numberCell = document.createElement('div');
            numberCell.className = 'number-cell';
            numberCell.dataset.number = i;
            
            // Crear elemento de imagen
            const img = document.createElement('img');
            img.src = `${i}.webp`;
            img.alt = `Número ${i}`;
            img.onerror = function() {
                // Si la imagen falla al cargar, mostrar un fondo de color
                this.style.display = 'none';
                numberCell.style.backgroundColor = '#6c757d';
                numberCell.querySelector('.number-text').style.textShadow = 'none';
            };
            
            // Crear elemento de texto para el número
            const numberText = document.createElement('div');
            numberText.className = 'number-text';
            numberText.textContent = i;
            
            numberCell.appendChild(img);
            numberCell.appendChild(numberText);
            
            numberCell.addEventListener('click', function() {
                toggleNumberSelection(i);
            });
            
            numberGrid.appendChild(numberCell);
        }
    }
    
    function toggleNumberSelection(number) {
        const index = selectedNumbers.indexOf(number);
        const numberCell = document.querySelector(`.number-cell[data-number="${number}"]`);
        
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
        confirmSelectionBtn.disabled = selectedNumbers.length !== 10;
    }
    
    function generateBingoCards() {
        if (selectedNumbers.length !== 10) {
            alert('Por favor selecciona exactamente 10 números.');
            return;
        }
        
        bingoCards = generateCardsWithDuplicates(selectedNumbers);
        displayBingoCards();
        
        numberSelectionSection.classList.remove('active-step');
        numberSelectionSection.classList.add('hidden-step');
        cardGenerationSection.classList.remove('hidden-step');
        cardGenerationSection.classList.add('active-step');
    }
    
    function generateCardsWithDuplicates(selectedNums) {
        const allNumbers = Array.from({length: 90}, (_, i) => i + 1);
        const otherNumbers = allNumbers.filter(num => !selectedNums.includes(num));
        
        const duplicatedSelected = [...selectedNums, ...selectedNums];
        shuffleArray(duplicatedSelected);
        shuffleArray(otherNumbers);
        
        const cards = [];
        
        const selectedDistribution = [
            duplicatedSelected.slice(0, 5),
            duplicatedSelected.slice(5, 10),
            duplicatedSelected.slice(10, 15),
            duplicatedSelected.slice(15, 20)
        ];
        
        const otherDistribution = [
            otherNumbers.slice(0, 20),
            otherNumbers.slice(20, 40),
            otherNumbers.slice(40, 55),
            otherNumbers.slice(55, 70)
        ];
        
        for (let i = 0; i < 4; i++) {
            let cardNumbers = [];
            let attempts = 0;
            const maxAttempts = 10;
            
            do {
                cardNumbers = [];
                cardNumbers.push(...selectedDistribution[i]);
                cardNumbers.push(...otherDistribution[i]);
                
                if (cardNumbers.length < 25) {
                    const needed = 25 - cardNumbers.length;
                    const availableNumbers = allNumbers.filter(
                        n => !cardNumbers.includes(n) && !selectedNums.includes(n)
                    );
                    shuffleArray(availableNumbers);
                    cardNumbers.push(...availableNumbers.slice(0, needed));
                }
                
                const uniqueNumbers = new Set(cardNumbers);
                if (uniqueNumbers.size === 25) break;
                
                attempts++;
                if (attempts >= maxAttempts) {
                    console.warn(`No se pudo generar cartilla ${i+1} sin duplicados`);
                    cardNumbers = Array.from(new Set(cardNumbers));
                    while (cardNumbers.length < 25) {
                        const randomNum = Math.floor(Math.random() * 90) + 1;
                        if (!cardNumbers.includes(randomNum)) {
                            cardNumbers.push(randomNum);
                        }
                    }
                    break;
                }
                
                shuffleArray(selectedDistribution[i]);
                shuffleArray(otherDistribution[i]);
            } while (true);
            
            if (cardNumbers.length !== 25) {
                cardNumbers = cardNumbers.slice(0, 25);
            }
            
            shuffleArray(cardNumbers);
            
            const card = [];
            for (let row = 0; row < 5; row++) {
                const rowNumbers = cardNumbers.slice(row * 5, (row + 1) * 5);
                card.push(rowNumbers);
            }
            
            cards.push(card);
        }
        
        return cards;
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
                    
                    if (selectedNumbers.includes(card[row][col])) {
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
        bingoCards = generateCardsWithDuplicates(selectedNumbers);
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
            
            // Generar todos los canvases
            const canvasPromises = bingoCards.map((card, i) => createCardImage(card, i + 1));
            const canvases = await Promise.all(canvasPromises);
            
            // Añadir los canvases al DOM
            canvases.forEach((canvas) => {
                const previewCard = document.createElement('div');
                previewCard.className = 'preview-card';
                previewCard.appendChild(canvas);
                previewContainer.appendChild(previewCard);
            });
            
            // Mostrar la sección de previsualización
            cardGenerationSection.classList.remove('active-step');
            cardGenerationSection.classList.add('hidden-step');
            imagePreviewSection.classList.remove('hidden-step');
            imagePreviewSection.classList.add('active-step');
        } catch (error) {
            console.error('Error generando imágenes:', error);
            alert('Ocurrió un error al generar las imágenes. Por favor verifica que todas las imágenes de números estén disponibles.');
        } finally {
            loader.style.display = 'none';
        }
    }
    
   async function createCardImage(cardNumbers, cardIndex) {
    return new Promise(async (resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Tamaño del canvas
        const cellSize = 150;
        const padding = 20;
        const width = 5 * cellSize + 2 * padding;
        const height = 5 * cellSize + 2 * padding;
        
        canvas.width = width;
        canvas.height = height;
        
        // Fondo blanco
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        
        // Dibujar las celdas
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const number = cardNumbers[row][col];
                const x = padding + col * cellSize;
                const y = padding + row * cellSize;
                
                // Dibujar el borde de la celda
                ctx.strokeStyle = selectedNumbers.includes(number) ? '#ca6702' : '#0a9396';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, cellSize, cellSize);
                
                try {
                    // Intentar cargar la imagen WEBP
                    const img = await loadImage(`${number}.webp`);
                    
                    // Dibujar la imagen en la celda (SIEMPRE A COLOR)
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
                    // Si falla, dibujar solo el número
                    ctx.fillStyle = selectedNumbers.includes(number) ? '#ca6702' : '#005f73';
                    ctx.font = 'bold 36px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(number, x + cellSize/2, y + cellSize/2);
                }
                
                // Dibujar el número en la esquina superior izquierda
                ctx.fillStyle = selectedNumbers.includes(number) ? '#FFD700' : 'rgba(255, 255, 255, 0.7)';
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.fillText(number, x + 10, y + 25);
                ctx.shadowColor = 'transparent';
            }
        }
        
        // Agregar marca de agua
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = 'italic 14px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Generado por E. Sanchez', 10, height - 10);
        
        // Esperar un breve momento para asegurar que todo se haya renderizado
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
});