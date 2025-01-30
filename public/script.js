let gridSize = 4;
let puzzleData = { numbers: [], solution: [] };
let startTime = null;
let timerInterval = null;
let finalTime = null;
let currentSeed = null;

document.addEventListener("DOMContentLoaded", () => {
    fetch("/random_szam.txt")
        .then(response => response.text())
        .then(seed => {
            currentSeed = parseInt(seed.trim());
            console.log("Betöltött seed:", currentSeed);
            startGame(currentSeed); // 🔄 Csak a meglévő seedet használjuk!
        })
        .catch(error => console.error("Hiba a seed betöltésekor:", error));

    document.getElementById("sizeSelector").addEventListener("change", () => {
        gridSize = parseInt(document.getElementById("sizeSelector").value);
        startGame(currentSeed); // 🔄 Méretváltás után újragenerálás, de a meglévő seed marad!
    });
});

function startGame(seed) {
    startTime = null;
    finalTime = null;
    clearInterval(timerInterval);
    document.getElementById("timer").textContent = "Idő: 00:00";

    if (!seed) {
        console.error("Seed nem elérhető, új generálás szükséges!");
        return;
    }

    currentSeed = seed; // 🔒 Seed megtartása
    generatePuzzle(currentSeed);
}

function generatePuzzle(seed) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${gridSize + 1}, 50px)`;
    grid.style.gridTemplateRows = `repeat(${gridSize + 1}, 50px)`;
    grid.style.gap = "5px";
    grid.style.margin = "20px auto";
    
    puzzleData.numbers = [];
    puzzleData.solution = [];
    let rowSums = Array(gridSize).fill(0);
    let colSums = Array(gridSize).fill(0);
    let rng = seed;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            rng = (rng * 1664525 + 1013904223) % 4294967296;
            let value = (rng % 9) + 1;
            puzzleData.numbers.push(value);

            let fixedIndex = (i * gridSize + j + seed) % (gridSize * gridSize);
            let isDeleted = (fixedIndex % 3) === 0;
            if (isDeleted) {
                puzzleData.solution.push(i * gridSize + j);
            } else {
                rowSums[i] += value;
                colSums[j] += value;
            }

            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = value;
            cell.dataset.index = i * gridSize + j;
            cell.addEventListener("click", () => toggleCellState(cell));
            grid.appendChild(cell);
        }

        const rowSumCell = document.createElement("div");
        rowSumCell.classList.add("cell", "sum-cell");
        rowSumCell.style.background = "#ddd";
        rowSumCell.style.fontWeight = "bold";
        rowSumCell.textContent = rowSums[i];
        grid.appendChild(rowSumCell);
    }

    for (let j = 0; j < gridSize; j++) {
        const colSumCell = document.createElement("div");
        colSumCell.classList.add("cell", "sum-cell");
        colSumCell.style.background = "#ddd";
        colSumCell.style.fontWeight = "bold";
        colSumCell.textContent = colSums[j];
        grid.appendChild(colSumCell);
    }

    const emptyCorner = document.createElement("div");
    emptyCorner.classList.add("cell", "sum-cell");
    emptyCorner.style.background = "#ddd";
    emptyCorner.textContent = "";
    grid.appendChild(emptyCorner);
}

function toggleCellState(cell) {
    if (!startTime) {
        startTime = Date.now();
        startTimer();
    }

    if (cell.classList.contains("delete")) {
        cell.classList.remove("delete");
        cell.classList.add("keep");
    } else if (cell.classList.contains("keep")) {
        cell.classList.remove("keep");
    } else {
        cell.classList.add("delete");
    }

    checkWinCondition();
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (finalTime === null) {
            let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
            document.getElementById("timer").textContent = `Idő: ${elapsedTime} másodperc`;
        }
    }, 100);
}

function checkWinCondition() {
    let allCorrectAsDeleted = true;
    let allCorrectAsKept = true;

    document.querySelectorAll(".cell").forEach((cell, index) => {
        if (!cell.dataset.index) return;

        let isSolution = puzzleData.solution.includes(parseInt(cell.dataset.index));

        if (isSolution && !cell.classList.contains("delete")) {
            allCorrectAsDeleted = false; 
        }

        if (!isSolution && !cell.classList.contains("keep")) {
            allCorrectAsKept = false; 
        }
    });

    if (allCorrectAsDeleted || allCorrectAsKept) {
        clearInterval(timerInterval);
        finalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        document.getElementById("timer").textContent = `Idő: ${finalTime} másodperc`;
        alert(`Gratulálok! Az időd: ${finalTime} másodperc`);

        document.querySelectorAll(".cell").forEach((cell, index) => {
            if (!cell.dataset.index) return;

            let isSolution = puzzleData.solution.includes(parseInt(cell.dataset.index));

            if (isSolution) {
                cell.classList.add("delete");
            } else {
                cell.classList.add("keep");
            }
        });
    }
}

function generateNewSeed() {
    fetch("/random_szam.txt", { method: "PUT" })
        .then(() => {
            fetch("/random_szam.txt")
                .then(response => response.text())
                .then(seed => {
                    console.log("Új seed generálva:", seed.trim());
                    currentSeed = parseInt(seed.trim());
                    startGame(currentSeed); // 🔄 Csak most generál új számot
                });
        })
        .catch(error => console.error("Hiba a seed generálásakor:", error));
}

function resetBoard() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("delete", "keep");
    });
}

function giveHint() {
    let unmarkedCells = Array.from(document.querySelectorAll(".cell"))
        .filter(cell => !cell.classList.contains("delete") && !cell.classList.contains("keep") && cell.dataset.index);

    if (unmarkedCells.length === 0) return; // Ha minden jelölve van, ne adjon tippet

    let hintCell = unmarkedCells[Math.floor(Math.random() * unmarkedCells.length)];
    let index = parseInt(hintCell.dataset.index);
    let isSolution = puzzleData.solution.includes(index);

    if (isSolution) {
        hintCell.style.backgroundColor = "rgba(255, 0, 0, 0.3)"; // Halvány piros, ha törlendő
    } else {
        hintCell.style.backgroundColor = "rgba(0, 255, 0, 0.3)"; // Halvány zöld, ha megtartandó
    }

    // 3 másodperc után visszaállítjuk az eredeti háttérszínt
    setTimeout(() => {
        hintCell.style.backgroundColor = "";
    }, 3000);
}

