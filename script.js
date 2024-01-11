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
        const board = document.getElementById("board")
        const playerBoardHTML = document.getElementById("playerBoardHTML")

        board.addEventListener("contextmenu", (e) => { e.preventDefault() })
        playerBoardHTML.addEventListener("contextmenu", (e) => { e.preventDefault() })
        if (es) {
            playerBoardHTML.innerHTML = ""
        }

        const mainDiv = document.createElement("div")
        mainDiv.classList.add("mainBoard")

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let div = document.createElement("div")
                switch (boardOut[i][j]) {
                    case 0:
                        div.classList.add("pieceOfShip")
                        if (es) {
                            div.addEventListener("contextmenu", drawingPlayerShips.changeDirection.bind(this))
                            div.addEventListener("mouseover", drawingPlayerShips.drawingSelectedShip)
                            div.addEventListener("mousedown", function (e) {
                                dis = this
                                putShipsOnBoard(e, dis)
                            });
                            // div.addEventListener("mouseout", function () {
                            //     console.log("ASDASD");
                            // })
                            div.setAttribute("data-x", j)
                            div.setAttribute("data-y", i)

                        }
                        break;
                    case 1:
                        div.classList.add("pieceOfShipBlack")
                        break;
                    case 2:
                        div.classList.add("potencialShip")
                        if (es) {
                            div.addEventListener("contextmenu", drawingPlayerShips.changeDirection)
                            div.addEventListener("mouseover", drawingPlayerShips.drawingSelectedShip)
                            div.addEventListener("mousedown", function (e) {
                                dis = this
                                putShipsOnBoard(e, dis)

                            });
                        }
                        div.setAttribute("data-x", j)
                        div.setAttribute("data-y", i)
                        break;
                    case 3:
                        div.classList.add("puttedShip")
                        break;
                }
                if (es) {
                    playerBoardHTML.append(div)
                } else {
                    mainDiv.append(div)
                }
            }
        }
        if (es) {
            board.append(playerBoardHTML)
        } else {
            board.append(mainDiv)
        }
    }
}

function putShipsOnBoard(e, dis) {

    if (e.button == 0) {
        const x = parseInt(dis.getAttribute("data-x"))
        const y = parseInt(dis.getAttribute("data-y"))
        const shipLength = drawingPlayerShips.selectedShipLenght
        console.log(shipLength);
        console.log(x, y);
        // console.log(playerBoard);
        console.log(directionShip);

        if (directionShip) { //poziom
            if (x + shipLength < 12) {
                for (let i = 0; i < shipLength; i++) {
                    playerBoard[y][x + i] = 3
                }
            } else { //wyjezdza poza plansze
                let diff = 11 - x
                for (let i = 1; i <= shipLength - diff; i++) {
                    playerBoard[y][x - i] = 3
                }
                for (let i = 0; i < diff; i++) {
                    playerBoard[y][x + i] = 3
                }
            }
        } else { //pion
            if (y + shipLength < 12) {
                for (let i = 0; i < shipLength; i++) {
                    playerBoard[y + i][x] = 3
                }
            } else { //wyjezdza poza plansze
                let diff = 11 - y
                for (let i = 1; i <= shipLength - diff; i++) {
                    playerBoard[y - i][x] = 3
                }
                for (let i = 0; i < diff; i++) {
                    playerBoard[y + i][x] = 3
                }
            }
        }
        boardProperties.createBattleField(playerBoard, true)
        drawingPlayerShips.selectedShipLenght = 0
    }
}

let drawShips = {
    xyArray: [-1, 1],
    direction: null,
    // funitoi: () =>{

    // },
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

                    if (x + ships[i].length <= 11 && this.checkingAllAroundPoziom(x, y, xEnd, board, 1)) {
                        for (let j = 0; j < ships[i].length; j++) {
                            board[y][x + j] = 1
                            chck = false
                        }
                    }
                } else if (this.direction == -1) { //kierunek pionowy
                    let x = Math.floor(Math.random() * 10) + 1
                    let y = Math.floor(Math.random() * 10) + 1
                    let yEnd = (y + ships[i].length) - 1

                    if (y + ships[i].length <= 11 && this.checkingAllAroundPion(x, y, yEnd, board, 1)) {
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
    checkingAllAroundPoziom(xStart, yStart, xEnd, board, num) {
        if (board[yStart][xStart] != num
            && board[yStart][xStart - 1] != num
            && board[yStart][xStart + 1] != num
            && board[yStart + 1][xStart] != num
            && board[yStart - 1][xStart] != num
            && board[yStart - 1][xStart - 1] != num
            && board[yStart + 1][xStart - 1] != num
            && board[yStart + 1][xStart + 1] != num
            && board[yStart - 1][xStart + 1] != num

            && board[yStart][xEnd] != num
            && board[yStart][xEnd - 1] != num
            && board[yStart][xEnd + 1] != num
            && board[yStart + 1][xEnd] != num
            && board[yStart - 1][xEnd] != num
            && board[yStart - 1][xEnd - 1] != num
            && board[yStart + 1][xEnd - 1] != num
            && board[yStart + 1][xEnd + 1] != num
            && board[yStart - 1][xEnd + 1] != num

        ) { return true }
    },
    checkingAllAroundPion(xStart, yStart, yEnd, board, num) {
        if (board[yStart][xStart] != num
            && board[yStart - 1][xStart] != num
            && board[yStart - 1][xStart + 1] != num
            && board[yStart - 1][xStart - 1] != num
            && board[yStart][xStart + 1] != num
            && board[yStart][xStart - 1] != num
            && board[yStart + 1][xStart] != num
            && board[yStart + 1][xStart + 1] != num
            && board[yStart + 1][xStart - 1] != num

            && board[yEnd][xStart] != num
            && board[yEnd - 1][xStart] != num
            && board[yEnd - 1][xStart + 1] != num
            && board[yEnd - 1][xStart - 1] != num
            && board[yEnd][xStart - 1] != num
            && board[yEnd][xStart + 1] != num
            && board[yEnd + 1][xStart] != num
            && board[yEnd + 1][xStart + 1] != num
            && board[yEnd + 1][xStart - 1] != num

        ) { return true }
    }
}

let directionShip = true
let drawingPlayerShips = {
    selectedShipLenght: 4,
    light() {
        const els = this.parentElement.children;
        for (let i = 0; i < els.length; i++)
            els[i].style.backgroundColor = "purple"
    },
    lightoff() {
        const els = this.parentElement.children;
        for (let i = 0; i < els.length; i++) {
            els[i].style.backgroundColor = "white";
        }
    },
    selectedShip() {
        const els = this.parentElement.children;
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
    goingOutOfBoard() {
        boardProperties.createBattleField(playerBoard, true)
        // paintAllBoard()
        console.log("WYJEACH:ES");
    },
    changeDirection() {
        directionShip = !directionShip
    },
    drawingSelectedShip() {
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
                if (i == 0 || i == (12 - 1)) {
                    playerBoard[i][j] = -1
                }
                else {
                    if (j != 0 && j != (12 - 1)) {
                        if (playerBoard[i][j] != 3) {
                            playerBoard[i][j] = 0
                        } else {
                        }
                    }
                    else {
                        playerBoard[i][j] = -1
                    }
                }
            }
        }
        // console.log(playerBoard);
        // console.log(e.k);
        const x = parseInt(this.getAttribute("data-x"))
        const y = parseInt(this.getAttribute("data-y"))
        // console.log(x, y);

        const shipLength = drawingPlayerShips.selectedShipLenght
        let xEnd = (x + shipLength) - 1
        let putShip = drawShips.checkingAllAroundPoziom(x, y, xEnd, playerBoard, 3)
        console.log(putShip);
        // drawShips.checkingAllAroundPoziom(xStart, yStart, xEnd, board)
        if (directionShip) { //poziom
            if (x + shipLength < 12) {
                if (putShip) {
                    for (let i = 0; i < shipLength; i++) {
                        playerBoard[y][x + i] = 2
                    }
                } else {
                    // playerBoard[y][x + i] = 4
                }
            } else { //wyjezdza poza plansze
                let diff = 11 - x
                for (let i = 1; i <= shipLength - diff; i++) {
                    playerBoard[y][x - i] = 2
                }
                for (let i = 0; i < diff; i++) {
                    playerBoard[y][x + i] = 2
                }
            }
        } else { //pion
            if (y + shipLength < 12) {
                for (let i = 0; i < shipLength; i++) {
                    playerBoard[y + i][x] = 2
                }
            } else { //wyjezdza poza plansze
                let diff = 11 - y
                for (let i = 1; i <= shipLength - diff; i++) {
                    playerBoard[y - i][x] = 2
                }
                for (let i = 0; i < diff; i++) {
                    playerBoard[y + i][x] = 2
                }
            }
        }
        boardProperties.createBattleField(playerBoard, true)
    },


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
    // drawShips.drawShips(botBoard)
    // console.log(botBoard);
    // boardProperties.createBattleField(botBoard, false)

    addFunctions()
    paintAll()
}