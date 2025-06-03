document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cardsContainer = document.getElementById('cards-container');
    const resetMarksBtn = document.getElementById('reset-marks');
    const returnHomeBtn = document.getElementById('return-home');
    
    // Cargar datos desde localStorage
    const bingoCards = JSON.parse(localStorage.getItem('bingoCards'));
    const isManualMode = localStorage.getItem('isManualMode') === 'true';
    const usedNumbers = new Map(JSON.parse(localStorage.getItem('usedNumbers')));
    const selectedNumbers = JSON.parse(localStorage.getItem('selectedNumbers'));
    const imageFormat = localStorage.getItem('imageFormat') || 'webp';
    
    // Mostrar las cartillas
    displayCards();
    
    // Event listeners
    resetMarksBtn.addEventListener('click', resetAllMarks);
    returnHomeBtn.addEventListener('click', function() {
        window.location.href = 'cartillas.html';
    });
    
   function displayCards() {
    cardsContainer.innerHTML = '';
    
    bingoCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'bingo-card';
        cardElement.style.marginBottom = '20px';
        
        const cardTitle = document.createElement('h3');
        cardTitle.className = 'card-title';
        cardTitle.textContent = `Cartilla ${index + 1}`;
        cardElement.appendChild(cardTitle);
        
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const number = card[row][col];
                const cell = document.createElement('div');
                cell.className = 'card-cell';
                cell.dataset.number = number;
                cell.dataset.cardIndex = index;
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Marcar como repetido si es necesario
                if (isManualMode) {
                    if ((usedNumbers.get(number) || 0) > 1) {
                        cell.classList.add('repeated');
                        cell.style.borderColor = '#ca6702';
                        cell.style.borderWidth = '2px';
                    }
                } else if (selectedNumbers.includes(number)) {
                    cell.classList.add('repeated');
                    cell.style.borderColor = '#ca6702';
                    cell.style.borderWidth = '2px';
                }
                
                // Crear imagen
                const img = document.createElement('img');
                img.alt = `Número ${number}`;
                
                // Crear marcador de número (estilo igual al generador)
                const numberBadge = document.createElement('div');
                numberBadge.className = 'number';
                numberBadge.textContent = number;
                
                // Crear marcador de selección (círculo dorado)
                const marker = document.createElement('div');
                marker.className = 'marker';
                
                // Cargar imagen
                loadImageForCell(img, number);
                
                cell.appendChild(img);
                cell.appendChild(numberBadge);
                cell.appendChild(marker);
                
                // Evento para marcar/desmarcar
                cell.addEventListener('click', function() {
                    this.classList.toggle('marked');
                });
                
                cardGrid.appendChild(cell);
            }
        }
        
        cardElement.appendChild(cardGrid);
        cardsContainer.appendChild(cardElement);
    });
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
                // Si fallan todas las opciones, mostrar solo el número
                this.style.display = 'none';
                const parent = this.parentElement;
                parent.style.backgroundColor = isManualMode
                    ? ((usedNumbers.get(number) || 0) > 1 ? '#FFD700' : '#94d2bd')
                    : (selectedNumbers.includes(number) ? '#FFD700' : '#94d2bd');
                parent.querySelector('.number').style.backgroundColor = 'transparent';
                parent.querySelector('.number').style.color = 'black';
            };
        };
    }
    
    function resetAllMarks() {
        document.querySelectorAll('.card-cell').forEach(cell => {
            cell.classList.remove('marked');
        });
    }
});
