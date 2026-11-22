let words = [];
let secretWord = "";
let currentRow = 0;
let currentCol = 0;
let guesses = Array(6).fill("").map(() => Array(5).fill(""));
let gameOver = false;

const wordsUrl = window.WORDS_JSON_URL || "../data/words_en.json";
const allowedLettersRegex = window.ALLOWED_LETTERS_REGEX || /^[a-zA-Z]$/;

function setStartMessage() {
    const msg = document.getElementById("game-message");
    if (msg) {
        msg.innerText = window.GAME_START_MESSAGE || "Введіть 5-буквене слово";
    }
}

function loadWords(callback) {
    fetch(wordsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Не вдалося завантажити словник");
            }
            return response.json();
        })
        .then(data => {
            words = data.filter(w => typeof w === "string" && w.trim().length === 5);
            if (callback) callback();
        })
        .catch(error => {
            console.error("Помилка JSON:", error);
            const msg = document.getElementById("game-message");
            if (msg) msg.innerText = "Помилка завантаження слів!";
        });
}

function pickRandomWord() {
    if (words.length === 0) return;
    secretWord = words[Math.floor(Math.random() * words.length)].trim().toUpperCase();
}

function createBoard() {
    const board = document.getElementById("board");
    if (!board) return;
    board.innerHTML = "";
    for (let r = 0; r < 6; r++) {
        let row = document.createElement("div");
        row.classList.add("board-row");
        for (let c = 0; c < 5; c++) {
            let cell = document.createElement("div");
            cell.classList.add("letter");
            cell.id = `cell-${r}-${c}`;
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function updateBoard() {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            let cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) cell.innerText = guesses[r][c];
        }
    }
}

window.addEventListener("keydown", (e) => {
    if (gameOver || words.length === 0) return;

    if (e.key === "Enter") {
        e.preventDefault();
        if (currentCol < 5) {
            const msg = document.getElementById("game-message");
            if (msg) msg.innerText = "Замало літер!";
            return;
        }
        checkGuess();
    } else if (e.key === "Backspace") {
        if (currentCol > 0) {
            currentCol--;
            guesses[currentRow][currentCol] = "";
            updateBoard();
        }
    } else if (allowedLettersRegex.test(e.key)) {
        if (currentCol < 5) {
            guesses[currentRow][currentCol] = e.key.toUpperCase();
            currentCol++;
            updateBoard();
        }
    }
});

function checkGuess() {
    let currentWord = guesses[currentRow].join("");
    let secretArray = secretWord.split("");
    let rowCells = [];

    for (let c = 0; c < 5; c++) {
        rowCells.push(document.getElementById(`cell-${currentRow}-${c}`));
    }

    for (let c = 0; c < 5; c++) {
        let letter = currentWord[c];
        if (letter === secretWord[c]) {
            rowCells[c].classList.add("correct");
            secretArray[secretArray.indexOf(letter)] = null;
        }
    }

    for (let c = 0; c < 5; c++) {
        let letter = currentWord[c];
        if (letter !== secretWord[c]) {
            if (secretArray.includes(letter)) {
                rowCells[c].classList.add("present");
                secretArray[secretArray.indexOf(letter)] = null;
            } else {
                rowCells[c].classList.add("absent");
            }
        }
    }

    const msg = document.getElementById("game-message");

    if (currentWord === secretWord) {
        if (msg) msg.innerText = "🎉 Вітаємо, ви перемогли!";
        gameOver = true;
        return;
    }

    currentRow++;
    currentCol = 0;

    if (currentRow === 6) {
        if (msg) msg.innerText = `😢 Гра закінчена! Слово було: ${secretWord}`;
        gameOver = true;
    }
}

function resetGame() {
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
    currentRow = 0;
    currentCol = 0;
    guesses = Array(6).fill("").map(() => Array(5).fill(""));
    gameOver = false;
    setStartMessage();
    createBoard();
    pickRandomWord();
}

createBoard();
loadWords(() => {
    setStartMessage();
    pickRandomWord();
});