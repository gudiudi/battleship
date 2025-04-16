import GameController from "./controllers/GameController";
import Computer from "./core/Computer";
import GameBoard from "./core/GameBoard";
import Player from "./core/Player";
import Ship from "./core/Ship";
import EventEmitter from "./utils/EventEmitter";
import GameView from "./views/GameView";
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

const emitter = new EventEmitter();
const view = new GameView(emitter);

const selfBoard = new GameBoard();
const self = new Player(selfBoard);
makeFleet(self);

const opponentBoard = new GameBoard();
const opponent = new Computer(opponentBoard);
makeFleet(opponent);

const gameController = new GameController(self, opponent, emitter);
gameController.init();

view.init();
view.updateSelfBoard(selfBoard.boardSnapshot);

/*
const opponentBoard = new GameBoard();
const opponent = new Computer(opponentBoard);
makeFleet(opponent);
ui.updateBoard(opponentBoard.boardSnapshot, ui.opponentBoardEl, false);
ui.bindCellClickHandler(ui.opponentBoardEl, (x, y) => {
	const success = self.makeAttack(opponent, x, y);
	if (success) {
		console.log(opponentBoard.boardSnapshot);
		ui.updateBoard(opponentBoard.boardSnapshot, ui.opponentBoardEl, true);
	}
});
*/
