import GameController from "./controllers/GameController";
import Computer from "./core/Computer";
import GameBoard from "./core/GameBoard";
import Player from "./core/Player";
import EventEmitter from "./utils/EventEmitter";
import GameView from "./views/GameView";
import "./assets/style.css";

const emitter = new EventEmitter();

const selfBoard = new GameBoard();
const self = new Player(selfBoard);

const opponentBoard = new GameBoard();
const opponent = new Computer(opponentBoard);

const view = new GameView(emitter);

const gameController = new GameController(self, opponent, view, emitter);
gameController.init();

/*
todo
add game over logic
*/
/*
const opponentBoard = new GameBoard();
const opponent = new Computer(opponentBoard);
makeFleet(opponent);
ui.updateBoard(opponentBoard.boardSnapshot, ui.opponentBoardEl, false);
ui.bindCellClickHandler(ui.opponentBoardEl, (x, y) => {
	
	if (success) {
		console.log(opponentBoard.boardSnapshot);
		ui.updateBoard(opponentBoard.boardSnapshot, ui.opponentBoardEl, true);
	}
});
*/
