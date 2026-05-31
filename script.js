class UIHandler {
    constructor () {
        this.heading = document.querySelector("h1");
        this.gameDisplay = document.getElementById("game-display");
        this.playerScoreDisplay = document.getElementById("player-score");
        this.compScoreDisplay = document.getElementById("comp-score");
        this.playBtn = document.getElementById("play-game");
        this.board = document.getElementById("board-container");
        this.squares = document.querySelectorAll(".square");
    }

    toggleUI() {
        this.gameDisplay.classList.toggle("ongoing");
        this.heading.classList.toggle("ongoing");
        this.playBtn.classList.toggle("ongoing");
        this.playBtn.textContent === "Play Game" ? this.playBtn.textContent = "Reset" : this.playBtn.textContent = "Play Game";
    }

    displayCurrentTurn(currTurn) {
        switch (currTurn) {
            case "player":
                this.playerScoreDisplay.classList.add("active");
                this.compScoreDisplay.classList.remove("active");
                break;
            case "computer":
                this.compScoreDisplay.classList.add("active");
                this.playerScoreDisplay.classList.remove("active");
                break;
            case "reset":
                this.compScoreDisplay.classList.remove("active");
                this.playerScoreDisplay.classList.remove("active");
        }
    }

    placeSymbol(target, symbol) {
        target.textContent = symbol
        target.style.color = symbol === "O" ? "var(--player)" : "var(--computer)"
    }

    updateScore(winner, score) {
        winner === "player" ? this.playerScoreDisplay.textContent = `Player One: ${score}` : this.compScoreDisplay.textContent = `Player Two: ${score}`;
    }

    displayWinner(winner) {
        switch (winner) {
            case "player":
                this.gameDisplay.style.backgroundColor = "var(--win-out)";
                this.gameDisplay.style.borderColor = "var(--win-border)";
                this.board.style.backgroundColor = "var(--win-in)";
                this.board.style.borderColor = "var(--win-border)";
                this.squares.forEach((item) => item.style.borderColor = "var(--win-border)");
                break;
            case "computer":
                this.gameDisplay.style.backgroundColor = "var(--lose-out)";
                this.gameDisplay.style.borderColor = "var(--lose-border)";
                this.board.style.backgroundColor = "var(--lose-in)";
                this.board.style.borderColor = "var(--lose-border)";
                this.squares.forEach((item) => item.style.borderColor = "var(--lose-border)");
                break;
            case "draw":
                this.gameDisplay.style.backgroundColor = "var(--draw-out)";
                this.gameDisplay.style.borderColor = "var(--draw-border)";
                this.board.style.backgroundColor = "var(--draw-in)";
                this.board.style.borderColor = "var(--draw-border)";
                this.squares.forEach((item) => item.style.borderColor = "var(--draw-border)");
                break;
        }
    }

    resetScoreDisplay() {
        this.playerScoreDisplay.textContent = "Player One: 0";
        this.compScoreDisplay.textContent = "Player Two: 0";
    }

    resetBoardDisplay() {
        this.squares.forEach((item) => item.textContent = "");
        this.gameDisplay.style.backgroundColor = "var(--bg)";
        this.gameDisplay.style.borderColor = "var(--border)";
        this.board.style.backgroundColor = "var(--bg-light)";
        this.board.style.borderColor = "var(--border-muted)";
        this.squares.forEach((item) => item.style.borderColor = "var(--border-muted)");
    }
}

class GameBoard {
    #boardState;
    #playerScore;
    #computerScore;
    #currentTurn;

    constructor () {
        this.#boardState = [[0,0,0],[0,0,0],[0,0,0]];
        this.#playerScore = 0;
        this.#computerScore = 0;
        this.#currentTurn = "player";
        this.symbolsDrawn = 0;
        this.ongoing = false;
        this.allowClick = true;
    }

    get currentTurn() {
        return this.#currentTurn
    }

    getScore(player) {
        if (player === "player") {
            return this.#playerScore;
        }
        return this.#computerScore;
    }

    updateScore(winner) {
        switch (winner) {
            case "player":
                this.#playerScore++;
                break;
            case "computer":
                this.#computerScore++;
                break;
        }
    }

    updateBoardState(pos, symbol) {
        const squarePos = pos.split(",");
        this.#boardState[squarePos[0]][squarePos[1]] = symbol;
        this.symbolsDrawn++;
    }

    getSquareState(pos) {
        const squarePos = pos.split(",");
        return this.#boardState[squarePos[0]][squarePos[1]];
    }

    toggleTurn() {
        this.#currentTurn = this.#currentTurn === "player" ? "computer" : "player";
    }

    checkWin(symbol, currTurn, pos) {
        const squarePos = pos.split(",");
        const row = squarePos[0];
        const column = squarePos[1];

        //check row
        if (this.#boardState[row][0] === symbol && this.#boardState[row][1] === symbol && this.#boardState[row][2] === symbol) {
            return currTurn
        }

        //check column
        if (this.#boardState[0][column] === symbol && this.#boardState[1][column] === symbol && this.#boardState[2][column] === symbol) {
            return currTurn
        }

        //check diagonals
        if (row === column) {
            if (this.#boardState[0][0] === symbol && this.#boardState[1][1] === symbol && this.#boardState[2][2] === symbol) {
                return currTurn
            }
        }

        if (["0,2","1,1","2,0"].includes(pos)) {
            if (this.#boardState[0][2] === symbol && this.#boardState[1][1] === symbol && this.#boardState[2][0] === symbol) {
                return currTurn
            }
        }

        return null
    }

    resetBoard() {
        this.#boardState = [[0,0,0],[0,0,0],[0,0,0]];
        this.symbolsDrawn = 0;
    }

    resetScore() {
        this.#playerScore = 0;
        this.#computerScore = 0;
        this.#currentTurn = "player";
    }
}

const displayHandler = new UIHandler();
const gameBoard = new GameBoard();

displayHandler.playBtn.addEventListener("click", () => {
    displayHandler.toggleUI();
    if (gameBoard.ongoing) {
        gameBoard.ongoing = false;
        displayHandler.displayCurrentTurn("reset")
        displayHandler.resetBoardDisplay();
        displayHandler.resetScoreDisplay();
        gameBoard.resetBoard();
        gameBoard.resetScore();
    } else {
        gameBoard.ongoing = true;
        displayHandler.displayCurrentTurn(gameBoard.currentTurn);
    }
})

displayHandler.board.addEventListener("click", (event) => {
    const targetSquare = event.target;
    const currTurn = gameBoard.currentTurn;
    const targetSquarePos = targetSquare.dataset.pos;
    let roundWinner = null;

    if (gameBoard.getSquareState(targetSquarePos) === 0 && gameBoard.allowClick) {
        symbol = currTurn === "player" ?  "O" : "X";

        displayHandler.placeSymbol(targetSquare, symbol);
        gameBoard.updateBoardState(targetSquarePos, symbol);

        gameBoard.toggleTurn();
        displayHandler.displayCurrentTurn(gameBoard.currentTurn);

        roundWinner = gameBoard.checkWin(symbol, currTurn, targetSquarePos);

        if (gameBoard.symbolsDrawn === 9 && !roundWinner) {
            roundWinner = "draw";
        }
    }

    if (roundWinner && gameBoard.allowClick) {
        gameBoard.allowClick = false;
        displayHandler.displayWinner(roundWinner);
        displayHandler.displayCurrentTurn("reset");

        if (roundWinner !== "draw") {
            gameBoard.updateScore(roundWinner);

            const score = gameBoard.getScore(roundWinner);
            displayHandler.updateScore(roundWinner, score);
        }

        setTimeout(() => {
            gameBoard.resetBoard();
            displayHandler.resetBoardDisplay();
            gameBoard.allowClick = true;
            displayHandler.displayCurrentTurn(gameBoard.currentTurn);
        }, 2000);
    }
})