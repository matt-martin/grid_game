document.addEventListener("DOMContentLoaded", function () {
    const submitWordButton = document.getElementById("submitWord");
    const codemasterInput = document.getElementById("codemasterInput");
    const codemasterSection = document.getElementById("codemasterSection");
    const gameSection = document.getElementById("gameSection");

    const newGameButton = document.getElementById("newGameButton");
    const gridTable = document.getElementById("gridTable");
    const inputArea = document.getElementById("inputArea");

    newGameButton.addEventListener("click", function() {
        // Clear previous game data
        gridTable.innerHTML = '';
        inputArea.innerHTML = '';
        message.innerHTML = '';

        // Reset and show the codemaster section
        codemasterInput.value = '';
        codemasterSection.style.display = "block";
        gameSection.style.display = "none";
    });

    submitWordButton.addEventListener("click", function() {
        const secretWord = codemasterInput.value.toUpperCase();
        if (secretWord && /^[A-Z]+$/.test(secretWord)) {
            codemasterSection.style.display = "none";
            gameSection.style.display = "block";
            generateGrid(secretWord);
        } else {
            alert("Please enter a valid word using only letters.");
        }
    });

    let currentRow = 13; // Middle row (in a 26x26 grid)
    let currentCol = 13; // Middle column

    let currentInputBox = null; // Variable to keep track of the current input box

    // Function to update currentInputBox on focus
    function updateCurrentInput(inputElement) {
        currentInputBox = inputElement;
    }

    // Function to highlight row and column
    function highlightRowAndColumn(row, col) {
        // Clear existing highlights
        document.querySelectorAll('.highlight').forEach(cell => cell.classList.remove('highlight'));

        // Highlight the selected row and column
        for (let i = 1; i <= 26; i++) {
            gridTable.rows[row].cells[i].classList.add('highlight');
            gridTable.rows[i].cells[col].classList.add('highlight');
        }
    }

    // Event listener for arrow key navigation
    document.addEventListener('keydown', function (event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            switch (event.key) {
                case 'ArrowUp':
                    currentRow = Math.max(1, currentRow - 1);
                    break;
                case 'ArrowDown':
                    currentRow = Math.min(26, currentRow + 1);
                    break;
                case 'ArrowLeft':
                    currentCol = Math.max(1, currentCol - 1);
                    break;
                case 'ArrowRight':
                    currentCol = Math.min(26, currentCol + 1);
                    break;
            }
            highlightRowAndColumn(currentRow, currentCol);
        }
    });

    // Function to generate the grid
    function generateGrid(secretWord) {
        const usedCoordinates = new Set(); // To track used coordinates

        // Function to generate a random coordinate
        function getRandomCoordinate() {
            let x = Math.floor(Math.random() * 26);
            let y = Math.floor(Math.random() * 26);
            return { x, y };
        }

        // Create the first row for column labels
        let headerRow = gridTable.insertRow();
        let cornerCell = headerRow.insertCell(); // Empty top-left corner cell
        cornerCell.className = 'grid-label'; // Add class to corner cell

        for (let i = 1; i <= 26; i++) {
            let cell = headerRow.insertCell();
            cell.innerHTML = i;
            cell.className = 'grid-label'; // Add class to column labels
        }

        // Create the grid with row labels
        for (let i = 0; i < 26; i++) {
            let row = gridTable.insertRow();
            let labelCell = row.insertCell();
            labelCell.innerHTML = String.fromCharCode('A'.charCodeAt(0) + i);
            labelCell.className = 'grid-label'; // Add class to row labels

            for (let j = 1; j <= 26; j++) {
                let cell = row.insertCell();
                cell.innerHTML = String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 26)); // Random letter
            }
        }

        // Place secret word letters in the grid
        for (let letter of secretWord) {
            let coordinate;
            do {
                coordinate = getRandomCoordinate();
            } while (usedCoordinates.has(`${coordinate.x}${coordinate.y}`));

            usedCoordinates.add(`${coordinate.x}${coordinate.y}`);
            gridTable.rows[coordinate.x + 1].cells[coordinate.y + 1].innerHTML = letter;

            // Create an input box with the coordinate label
            let inputBox = document.createElement("input");
            inputBox.type = "text";
            inputBox.maxLength = 1;
            inputBox.dataset.coordinate = `${String.fromCharCode('A'.charCodeAt(0) + coordinate.x)}${coordinate.y + 1}`;

            // Attach focus event listener to each input box
            inputBox.addEventListener('focus', function () {
                updateCurrentInput(this);
            });

            let label = document.createElement("span");
            label.innerHTML = inputBox.dataset.coordinate;
            label.className = 'input-label';

            let container = document.createElement("div");
            container.className = 'input-container';
            container.appendChild(inputBox);
            container.appendChild(label);

            inputArea.appendChild(container);
        }

        // Automatically focus the first input box
        if (inputArea.firstChild) {
            inputArea.firstChild.firstChild.focus();
        }

        currentRow = 13; // Middle row (in a 26x26 grid)
        currentCol = 13; // Middle column
    
        // Initial highlight of the middle row and column
        highlightRowAndColumn(currentRow, currentCol);
    
        // Add click event listener to each cell in the grid
        for (let i = 1; i < gridTable.rows.length; i++) {
            for (let j = 1; j < gridTable.rows[i].cells.length; j++) {
                gridTable.rows[i].cells[j].addEventListener('click', function () {
                    highlightRowAndColumn(i, j);
    
                    // Set the value in the currently selected input box
                    if (currentInputBox) {
                        currentInputBox.value = this.innerHTML;
                    }
                });
            }
        }
    

        // Check button event
        checkButton.addEventListener("click", function () {
            let correct = true;
            const inputs = inputArea.querySelectorAll("input");
            inputs.forEach((input, index) => {
                if (input.value.toUpperCase() !== secretWord.charAt(index)) {
                    input.classList.add("incorrect");
                    correct = false;
                } else {
                    input.classList.remove("incorrect");
                }
            });
    
            if (correct) {
                message.textContent = "Congratulations! You found the secret word!";
            } else {
                message.textContent = "Some letters are incorrect. Try again!";
            }
        });
    }
});
