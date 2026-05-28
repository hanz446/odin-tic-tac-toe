class UIHandler {
    constructor () {
        this.heading = document.querySelector("h1");
        this.gameDisplay = document.getElementById("game-display");
        this.playerScoreDisplay = document.getElementById("player-score");
        this.compScoreDisplay = document.getElementById("comp-score");
        this.playBtn = document.getElementById("play-game");
        this.board = document.getElementById("board-container");
        this.squares = document.querySelectorAll(".square");

        this.playBtn.addEventListener("click", () => this.toggleUI());

        this.board.addEventListener("click", (event) => this.placeSymbol(event))
    }

    handleClick() {

    }

    toggleUI() {
        this.gameDisplay.classList.toggle("ongoing");
        this.heading.classList.toggle("ongoing");
        this.playBtn.classList.toggle("ongoing");
        this.playBtn.textContent === "Play Game" ? this.playBtn.textContent = "Reset" : this.playBtn.textContent = "Play Game";
    }

    placeSymbol(target, symbol) {
        target.textContent = symbol
        target.style.color = symbol === "O" ? "var(--secondary)" : "var(--primary)"
    }

    updateScore(winner, score) {
        winner === "player" ? this.playerScoreDisplay.textContent = `Player: ${score}` : this.compScoreDisplay.textContent = `Computer: ${score}`;
    }

    displayReset() {
        this.squares.forEach((item) => item.textContent = "")
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

    updateBoardState(pos, symbol) {
        const squarePos = pos.split(",").map((item) => Number(item));
        this.#boardState[squarePos[0]][squarePos[1]] = symbol;
    }

    toggleTurn() {
        this.#currentTurn = this.#currentTurn === "player" ? "computer" : "player";
    }

    checkWin(symbol, currTurn, pos) {
        const squarePos = pos.split(",").map((item) => Number(item));
        const row = squarePos[0];
        const column = squarePos[1];
        let j = 2;
        let count = 0;

        //check row
        for (let i = 0; i < 3; i++) {
            if (this.#boardState[row][i] === symbol) {
                count++;
            }
        }
        if (count === 3) {
            return currTurn
        }
        count = 0;

        //check column
        for (let i = 0; i < 3; i++) {
            if (this.#boardState[i][column] === symbol) {
                count++;
            }
        }
        if (count === 3) {
            return currTurn
        }
        count = 0;

        //check diagonals
        for (let i = 0; i < 3; i++) {
            if (this.#boardState[i][i] === symbol) {
                count++;
            }
        }
        if (count === 3) {
            return currTurn
        }
        count = 0;

        for (let i = 0; i < 3; i++) {
            if (this.#boardState[i][j] === symbol) {
                count++;
            }
            j--;
        }
        if (count === 3) {
            return currTurn
        }

        return null

    }

    updateScore(winner) {
        winner === "player" ? this.#playerScore++ : this.#computerScore++;
    }

    resetBoard() {
        this.#boardState = [[0,0,0],[0,0,0],[0,0,0]];
    }
}

const displayHandler = new UIHandler();
const gameBoard = new GameBoard();

displayHandler.board.addEventListener("click", (event) => {
    const targetSquare = event.target;
    const currTurn = gameBoard.currentTurn;
    const targetSquarePos = targetSquare.dataset.pos;
    
    symbol = currTurn === "player" ?  "O" : "X";
    gameBoard.toggleTurn();

    displayHandler.placeSymbol(targetSquare, symbol);
    gameBoard.updateBoardState(targetSquarePos, symbol);

    const roundWinner = gameBoard.checkWin(symbol, currTurn, targetSquarePos);

    if (roundWinner) {
        gameBoard.updateScore(roundWinner);
        const score = gameBoard.getScore(roundWinner);
        displayHandler.updateScore(roundWinner, score);
        setTimeout(() => {
            gameBoard.resetBoard();
            displayHandler.displayReset();
        }, 2000);
    }
})