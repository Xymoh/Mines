setInterval(function () { time() }, 1000); // co sekundę wywołaj funkcje time
var sec = 0;
var gameEnabled = true;
var bombs = 0;
var bombsChecked = 0;

function time() {
    if (sec > -1) {
        $('#time').html(sec++);
    }
}

// create the board
var width = 5;
var height = 5;
var minesCount = 5;

var board = new Array(width)
for (var i = 0; i < board.length; i++) {
    board[i] = new Array(height);
    for (var j = 0; j < board[i].length; j++) {
        board[i][j] = 0;
    }
}

start();

// Funkcje
function randomMines() {
    var tmp = 0;
    while (tmp < minesCount) {
        var r = Math.floor((Math.random() * 5));
        var c = Math.floor((Math.random() * 5));
        if (board[r][c] != -1) {
            board[r][c] = -1;
            tmp++;
        }
    }
}

function countNeighbors() {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] != -1) {
                board[i][j] = countN(i, j);
            }
        }
    }
}

function countN(r, c) {
    var count = 0;

    for (var i = r - 1; i <= r + 1; i++) {
        for (var j = c - 1; j <= c + 1; j++) {
            if (i > -1 && i < board.length && j > -1 && j < board[i].length) {
                if (board[i][j] == -1) {
                    count++;
                }
            }
        }
    }
    return count;
}

function cellClick(obj) {
    if (gameEnabled) {
        // check if current cell is not revealed
        if (!obj.isRevealed) {
            const id = obj.id;
            const x = obj.x;
            const y = obj.y;
            $(`#${id}`).removeClass();
            switch (board[x][y]) {
                case -1:
                    // mine
                    $(`#${id}`).addClass('mine');
                    alert('Koniec gry');
                    $('#time').html(sec);
                    sec = -1;
                    DisplayMines();
                    gameEnabled = false;
                    break;
                case 0:
                    // empty field
                    $(`#${id}`).addClass('emptyN');
                    displayNeighbors(x, y);
                    break;
                default:
                    // other field
                    $(`#${id}`).addClass('empty');
                    break;
            }
            $(`#${id}`).html(board[x][y]);
            bombsChecked--;
            obj.isRevealed = true;
        }
    }
}

function mine(obj) {
    const id = obj.id;
    const x = obj.x;
    const y = obj.y;
    // check if current cell is flagged
    if (!obj.isRevealed) {
        if (obj.isFlagged) {
            obj.isFlagged = false;
            bombsChecked--;
            $(`#${id}`).html(' ');
            $(`#${id}`).removeClass('black');
        } else {
            obj.isFlagged = true;
            if (gameEnabled && !obj.isRevealed && bombsChecked < 5) {
                bombsChecked++;
                obj.isFlagged = true;
                $(`#${id}`).html('x');
                $(`#${id}`).removeClass();
                $(`#${id}`).addClass('black');
    
                if (board[x][y] == -1) {
                    bombs++;
                }
    
                if (bombs == 5) {
                    alert('Kim jesteś? Jesteś zwycięzcą!')
                }
            }
        }
    } 
}

function DisplayMines() {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var a = i + 1;
            var b = j + 1;
            if (board[i][j] == -1) {
                $(`#${a}_${b}`).removeClass();
                $(`#${a}_${b}`).addClass('mine');
                $(`#${a}_${b}`).html('-1');
            }
        }
    }
}

function displayNeighbors(x, y) {
    // display the cell
    let cell;
    const id = `${x + 1}_${y + 1}`;
    cell = document.getElementById(id);
    if (cell != null && !cell.isRevealed) {
        cellReveal(x, y);
        cell.isRevealed = true;
        // go up
        if ((x > 0 && board[x - 1][y] == 0)) {
            displayNeighbors(x - 1, y);
        }
        // go down
        if (x < height - 1 && board[x + 1][y] == 0) {
            displayNeighbors(x + 1, y);
        }
        // go left
        if (y > 0 && board[x][y - 1] == 0) {
            displayNeighbors(x, y - 1);
        }
        // go right
        if (y < width - 1 && board[x][y + 1] == 0) {
            displayNeighbors(x, y + 1);
        }
    }
}

function cellReveal(x, y) {
    // reveal the cell
    const id = `${x + 1}_${y + 1}`;
    cell = document.getElementById(id);
    if (cell != null && !cell.isRevealed) {
        cell.isRevealed = true;
        $(`#${id}`).removeClass();
        if (board[x][y] == -1) {
            $(`#${id}`).addClass('mine');
        } else if (board[x][y] == 0) {
            $(`#${id}`).addClass('emptyN');
        } else {
            $(`#${id}`).addClass('empty');
        }
    
        $(`#${id}`).html(board[x][y]);
    }
}

function start() {
    let element;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var a = i + 1;
            var b = j + 1;
            board[i][j] = 0;
            element = document.getElementById(`${a}_${b}`);
            element.x = i;
            element.y = j;
            element.isRevealed = false;
            element.isFlagged = false;
            $(`#${a}_${b}`).removeClass();
            $(`#${a}_${b}`).html('');
        }
    }

    randomMines();
    countNeighbors();

    sec = 0;
    bombs = 0;
    gameEnabled = true;
    bombsChecked = 0;
}

function Restart() {
    start();
}