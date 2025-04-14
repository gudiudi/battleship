import Computer from "./Computer";
import GameBoard from "./GameBoard";
import Player from "./Player";
import Ship from "./Ship";
import UI from "./UI";
import "./assets/style.css";

const ui = new UI();
ui.init();

/*
const makeFleet = (participant) => {
	const fleet = {
		5: 2,
		4: 3,
		2: 4,
		1: 5,
	};

	for (const [ship, count] of Object.entries(fleet)) {
		for (let i = 0; i < count; i++) {
			participant.placeShip(new Ship(Number(ship)));
		}
	}
};

(() => {
	const gameBoard = new GameBoard();
	const player = new Player(gameBoard);

	const carrier = new Ship(5);
	const destroyer = new Ship(4);
	const submarine = new Ship(3);
	const patrolBoat = new Ship(2);

	player.placeShip(carrier, 0, 0);
	player.placeShip(destroyer, 1, 5);
	player.placeShip(submarine, 2, 3);
	player.placeShip(patrolBoat, 4, 5);

	console.log(player.boardSnapshot);
})();

(() => {
	const computerBoard = new GameBoard();
	const computer = new Computer(computerBoard);

	makeFleet(computer);

	console.log(computer.boardSnapshot);
})();
*/
