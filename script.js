const ships = [
    { length: 4 },
    { length: 3 },
    { length: 3 },
    { length: 2 },
    { length: 2 },
    { length: 2 },
    { length: 1 },
    { length: 1 },
    { length: 1 },
    { length: 1 }
]
let selectedI = 0
let firstShip = 0
let playerBoard = []
let botBoard = []

function drawPlayereShips() {
    const allShips = document.getElementById("allShips")
}

let boardProperties = {
    width: 12,
    height: 12,
    createBoard() {
        let boardArray = []
        for (let i = 0; i < this.height; i++) {
            boardArray[i] = []
            for (let j = 0; j < this.width; j++) {
                if (i == 0 || i == (this.height - 1)) {
                    boardArray[i][j] = -1
                }
                else {
                    if (j != 0 && j != (this.width - 1)) {
                        boardArray[i][j] = 0
                    }
                    else {
                        boardArray[i][j] = -1
                    }
                }
            }
        }
        return boardArray
    },
    createBattleField(boardOut, es) {
        // let boardOut = this.createBoard()
        const board = document.getElementById("board")
        const mainDiv = document.createElement("div")
        mainDiv.classList.add("mainBoard")
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (boardOut[i][j] != -1) {
                    const div = document.createElement("div")
                    div.classList.add("pieceOfShip")
                    if (es) {
                        div.onmouseover = drawingPlayerShips.drawingSelectedShip
                    }
                    div.setAttribute(`data-x`, j)
                    div.setAttribute(`data-y`, i)
                    mainDiv.append(div)
                    board.append(mainDiv)
                    if (boardOut[i][j] == 1) {
                        div.classList.add("pieceOfShipBlack")
                        mainDiv.append(div)
                        board.append(mainDiv)
                    }
                }
            }
        }
    }
}

let drawShips = {
    xyArray: [-1, 1],
    direction: null,
    drawDirection() {
        this.direction = this.xyArray[Math.floor(Math.random() * this.xyArray.length)]
    },
    drawShips(board) {
        for (let i = 0; i < ships.length; i++) {
            let chck = true
            while (chck) {
                this.drawDirection()
                if (this.direction == 1) { //kierunek poziomy
                    let x = Math.floor(Math.random() * 10) + 1
                    let y = Math.floor(Math.random() * 10) + 1
                    let xEnd = (x + ships[i].length) - 1

                    if (x + ships[i].length <= 11 && this.checkingAllAroundPoziom(x, y, xEnd, board)) {
                        for (let j = 0; j < ships[i].length; j++) {
                            board[y][x + j] = 1
                            chck = false
                        }
                    }
                } else if (this.direction == -1) { //kierunek pionowy
                    let x = Math.floor(Math.random() * 10) + 1
                    let y = Math.floor(Math.random() * 10) + 1
                    let yEnd = (y + ships[i].length) - 1

                    if (y + ships[i].length <= 11 && this.checkingAllAroundPion(x, y, yEnd, board)) {
                        for (let j = 0; j < ships[i].length; j++) {
                            board[y + j][x] = 1
                            chck = false
                        }
                    }
                }
            }
        }
        return board;
    },
    checkingAllAroundPoziom(xStart, yStart, xEnd, board) {
        if (board[yStart][xStart] != 1
            && board[yStart][xStart - 1] != 1
            && board[yStart][xStart + 1] != 1
            && board[yStart + 1][xStart] != 1
            && board[yStart - 1][xStart] != 1
            && board[yStart - 1][xStart - 1] != 1
            && board[yStart + 1][xStart - 1] != 1
            && board[yStart + 1][xStart + 1] != 1
            && board[yStart - 1][xStart + 1] != 1

            && board[yStart][xEnd] != 1
            && board[yStart][xEnd - 1] != 1
            && board[yStart][xEnd + 1] != 1
            && board[yStart + 1][xEnd] != 1
            && board[yStart - 1][xEnd] != 1
            && board[yStart - 1][xEnd - 1] != 1
            && board[yStart + 1][xEnd - 1] != 1
            && board[yStart + 1][xEnd + 1] != 1
            && board[yStart - 1][xEnd + 1] != 1

        ) { return true }
    },
    checkingAllAroundPion(xStart, yStart, yEnd, board) {
        if (board[yStart][xStart] != 1
            && board[yStart - 1][xStart] != 1
            && board[yStart - 1][xStart + 1] != 1
            && board[yStart - 1][xStart - 1] != 1
            && board[yStart][xStart + 1] != 1
            && board[yStart][xStart - 1] != 1
            && board[yStart + 1][xStart] != 1
            && board[yStart + 1][xStart + 1] != 1
            && board[yStart + 1][xStart - 1] != 1

            && board[yEnd][xStart] != 1
            && board[yEnd - 1][xStart] != 1
            && board[yEnd - 1][xStart + 1] != 1
            && board[yEnd - 1][xStart - 1] != 1
            && board[yEnd][xStart - 1] != 1
            && board[yEnd][xStart + 1] != 1
            && board[yEnd + 1][xStart] != 1
            && board[yEnd + 1][xStart + 1] != 1
            && board[yEnd + 1][xStart - 1] != 1

        ) { return true }
    }
}

let drawingPlayerShips = {
    selectedShipLenght: 4,
    light(d) {
        d = this
        const els = d.parentElement.children;
        for (let i = 0; i < els.length; i++)
            els[i].style.backgroundColor = "purple"
    },
    lightoff(d) {
        d = this
        const els = d.parentElement.children;
        for (let i = 0; i < els.length; i++) {
            els[i].style.backgroundColor = "white";
        }
    },
    selectedShip(d) {
        d = this
        const els = d.parentElement.children;
        drawingPlayerShips.selectedShipLenght = els.length
        if (selectedI == 0) {
            addFunctions()
            paintAll()
            for (let i = 0; i < els.length; i++) {
                els[i].style.backgroundColor = "yellow";
                els[i].onmouseover = null
                els[i].onmouseleave = null
            }
            selectedI++
        } else {
            addFunctions()
            for (let i = 0; i < els.length; i++) {
                els[i].style.backgroundColor = "yellow";
                els[i].onmouseover = null
                els[i].onmouseleave = null
            }
            selectedI = 0
        }
    },
    drawingSelectedShip(d) {
        for (let i = 0; i < 12; i++) {
            playerBoard[i] = []
            for (let j = 0; j < 12; j++) {
                if (i == 0 || i == (12 - 1)) {
                    playerBoard[i][j] = -1
                }
                else {
                    if (j != 0 && j != (12 - 1)) {
                        playerBoard[i][j] = 0
                    }
                    else {
                        playerBoard[i][j] = -1
                    }
                }
            }
        }
        paintAllBoard()
        d = this
        // console.log(d.parentElement.children);
        let allPiecesOfShips = d.parentElement.children

        const x = parseInt(d.getAttribute("data-x"))
        const y = parseInt(d.getAttribute("data-y"))

        console.log(x, y);
        //dodac pion i poziom
        const shipLength = drawingPlayerShips.selectedShipLenght
        console.log(shipLength);

        console.log(playerBoard);
        for (let i = 0; i < shipLength; i++) {
            if (x + shipLength < 12) {
                playerBoard[y][x + i] = 1
            } else {
                playerBoard[y][x] = 1
            }
        }
        console.log(playerBoard); //nie wiem co sie dzieje

    }
}

function paintAll() {
    const shipsHTML = document.getElementById("allShips")
    const shipsHTMLArray = shipsHTML.children;
    if (firstShip == 0) {
        for (let i = 0; i < shipsHTMLArray.length; i++) {
            let ship = shipsHTMLArray[i].children
            for (let j = 0; j < ship.length; j++) {
                if (i == 0 && j <= 3) {
                    ship[j].style.backgroundColor = "yellow";
                } else {
                    ship[j].style.backgroundColor = "white";
                }
            }
        }
        firstShip++
    } else {
        for (let i = 0; i < shipsHTMLArray.length; i++) {
            let ship = shipsHTMLArray[i].children
            for (let j = 0; j < ship.length; j++) {
                ship[j].style.backgroundColor = "white";
            }
        }
    }
}

function paintAllBoard() {
    const board = document.getElementsByClassName("mainBoard")[0]
    const boardChildren = board.children

    for (let i = 0; i < boardChildren.length; i++) {
        boardChildren[i].style.backgroundColor = "white";
    }
}

function addFunctions() {
    const shipsHTML = document.getElementById("allShips")
    const shipsHTMLArray = shipsHTML.children;
    // var selectedShipLenght = 4

    for (let i = 0; i < shipsHTMLArray.length; i++) {
        let ship = shipsHTMLArray[i].children
        for (let j = 0; j < ship.length; j++) {
            if (firstShip == 0 && i == 0 && j <= 3) {
                ship[j].onmouseover = null
                ship[j].onmouseleave = null
                ship[j].onclick = null
            } else {
                ship[j].onmouseover = drawingPlayerShips.light
                ship[j].onmouseleave = drawingPlayerShips.lightoff
                ship[j].onclick = drawingPlayerShips.selectedShip
                ship[j].style.backgroundColor = "white";
            }
        }
    }
}

function init() {
    playerBoard = boardProperties.createBoard()
    console.log(playerBoard);
    boardProperties.createBattleField(playerBoard, true)

    // botBoard = boardProperties.createBoard()
    // // console.log(botBoard);
    // drawShips.drawShips(botBoard)
    // boardProperties.createBattleField(botBoard, false)

    addFunctions()
    paintAll()
}

