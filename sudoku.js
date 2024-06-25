var boardArray = [];
var startingBoardArray = [];
var gameStart = false;
var gameOver = false;

var numSelected = null;
var tileSelected = null;

function getRandomInt(min, max) {
    // Math.floor to get it as an int
    // range +1 because Math.random generates from 0 to 1 not including 1, so gets it to include max num
    // + min to give correct range e.g from 0,8 to 1,9
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function solveSudoku(board) {
    const boardSize = 9;

    function findEmptyCell() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col] === 0) {
                    return { row, col };
                }
            }
        }
        return null;
         // no empty cell found
    }

    function isValid(board, row, col, num) {
        function inRow(board, row, num) {
            return board[row].includes(num);
        }

        function inCol(board, col, num) {
            for (let i = 0; i < boardSize; i++) {
                if (board[i][col] === num) {
                    return true;
                }
            }
            return false;
        }
            // Check if num exists in 3x3 subsquare

        function inSubSquare(board, row, col, num) {
            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[startRow + i][startCol + j] === num) {
                        return true;
                    }
                }
            }
            return false;
        }

        return !inRow(board, row, num) && !inCol(board, col, num) && !inSubSquare(board, row, col, num);
    }

    function solve() {
        const emptyCell = findEmptyCell();
        if (!emptyCell) {
            return true; 
            //solved
        }

        const { row, col } = emptyCell;
        for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve()) {
                    return true;
                }
                board[row][col] = 0;
                 //backtrack
            }
        }
        return false;
         // no valid number found
    }

    return solve();
}

function genRandBoard() {
    // put starting numbers in both boards
    // board used for player
    // solvedBoard will be the solution board
    const board = [];
    const solvedBoard = [];
    const boardSize = 9;

    // create empty rows
    for (let i = 0; i < boardSize; i++) {
        board.push([]);
        solvedBoard.push([]);
        // create columns and fill board with 0s
        for (let j = 0; j < boardSize; j++) {
            board[i].push(0);
            solvedBoard[i].push(0);
        }
    }

    // generate a random solved board
    solveSudoku(solvedBoard);

    // generate 27 starting random nums from solved board to be put in player board
    let startNums = 0;

    // give 27 random nums in random positions from solved board
    // to use as initial nums on player board
    while (startNums < 27) {
        let row = getRandomInt(0, 8);
        let col = getRandomInt(0, 8);
        // if cell is empty, copy number from solved board
        if (board[row][col] === 0) {
            board[row][col] = solvedBoard[row][col];
            startNums++;
        }
    }

    return [board, solvedBoard];
}

function newBoard() {
    numSelected = null;
    tileSelected = null;
    gameOver = false;
    [startingBoardArray, boardArray] = genRandBoard();

    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ''; // Clear previous board

    // Create and display the starting board's numbers in the board
    for (let r = 0; r < 9; r += 3) {
        for (let c = 0; c < 9; c += 3) {
            let subsquare = document.createElement("div");
            //making our subsquares bold inside the board
            subsquare.classList.add("subsquare");

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let tile = document.createElement("div");
                    tile.id = (r + i).toString() + "-" + (c + j).toString();
                    tile.classList.add("tile");

                    if (startingBoardArray[r + i][c + j] != 0) {
                        tile.innerText = startingBoardArray[r + i][c + j];
                    }

                    // Once tile clicked, call function
                    tile.addEventListener("click", function() {
                        if (tileSelected) {
                            // Get rid of selected property from any previous tile clicked
                            tileSelected.classList.remove("selected");
                        }
                        // Update to the current clicked tile
                        tileSelected = tile;
                        // Add property to clicked tile to change background color
                        tile.classList.add("selected");
                    });

                    subsquare.appendChild(tile);
                }
            }
            boardElement.appendChild(subsquare);
        }
    }

    gameStart = true;
}


newBoard();

function getCoords(tile_id) {
    let coordinates = tile_id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    return [r, c];
}

//keyboard input for missing tiles
//onkeydown instead of keypressed so can recognise backspace too

document.onkeydown = (event) => {
    //event.key being the key pressed
   // console.log(event.key);
   //testing if game is over and a tile is selected

   if(gameOver==false && tileSelected){
    if("123456789".indexOf(event.key) != -1){
       // console.log(event.key);
       numSelected=event.key;
       changeTile();
    }else if(event.key==="Backspace"){
        clearTile();

    }
   }
}
function clearTile(){
    if (tileSelected && tileSelected.innerText !== "") {
        tileSelected.innerText = "";
        tileSelected.classList.remove("wrong");
    }

}

function changeTile() {
    if (numSelected && tileSelected) {
        if (tileSelected.innerText !== "") {
            return;
        }
        let [r, c] = getCoords(tileSelected.id);
        tileSelected.innerText = numSelected;
        if (numSelected != boardArray[r][c]) {
            //make the font red if its wrong
            tileSelected.classList.add("wrong");
        } else {
            tileSelected.classList.remove("wrong");
        }
    }
}