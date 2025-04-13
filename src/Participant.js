export default class Participant {
	constructor(gameBoard) {
		this.gameBoard = gameBoard;
	}

	placeShip(ship, x, y, dx = 0, dy = 1) {
		return this.gameBoard.placeShip(ship, x, y, dx, dy);
	}

	receiveAttack(x, y) {
		return this.gameBoard.receiveAttack(x, y);
	}

	get board() {
		return this.gameBoard.boardSnapshot;
	}

	get hasLost() {
		return this.gameBoard.areAllShipsSunk;
	}
}
