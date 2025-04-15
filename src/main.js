import Computer from "./Computer";
import GameBoard from "./GameBoard";
import Player from "./Player";
import Ship from "./Ship";
import UI from "./UI";
import "./assets/style.css";

const makeFleet = (participant) => {
	const fleet = {
		4: 1,
		3: 2,
		2: 3,
		1: 4,
	};

	for (const [ship, count] of Object.entries(fleet)) {
		for (let i = 0; i < count; i++) {
			participant.placeShip(new Ship(Number(ship)));
		}
	}
};

const selfBoard = new GameBoard();
const self = new Player(selfBoard);
makeFleet(self);

const ui = new UI();
ui.init(selfBoard);
ui.updateBoard(selfBoard.boardSnapshot, ui.selfBoardEl);

// todo
/*
gamecontroller
draggable
*/

/*
const opponentBoard = new GameBoard();
const opponent = new Computer(opponentBoard);
makeFleet(opponent);
ui.updateBoard(opponentBoard.boardSnapshot, ui.opponentBoardEl, true);
ui.bindCellClickHandler(ui.opponentBoardEl, (x, y) => {
	const success = self.makeAttack(opponent, x, y);
	if (success) {
		console.log(opponentBoard.boardSnapshot);
		ui.updateBoard(opponentBoard.boardSnapshot, ui.opponentBoardEl, true);
	}
});
*/
