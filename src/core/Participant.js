export default class Participant {
	#gameBoard;

	constructor(gameBoard) {
		this.#gameBoard = gameBoard;
	}

	placeShip(ship, x, y, { dx, dy }) {
		return this.#gameBoard.placeShip(ship, x, y, { dx, dy });
	}

	placeShipAtRandom(ship) {
		let placed = false;
		while (!placed) {
			const cells = this.#getEmptyCells();
			if (cells.length < 1) return false;

			const [x, y] = cells[Math.floor(Math.random() * cells.length)];
			const isHorizontal = Math.random() < 0.5;
			const dx = isHorizontal ? 0 : 1;
			const dy = isHorizontal ? 1 : 0;

			placed = this.placeShip(ship, x, y, { dx, dy });
		}

		return placed;
	}

	rePlaceShip(ship, newX, newY, newDirection) {
		return this.#gameBoard.rePlaceShip(ship, newX, newY, newDirection);
	}

	receiveAttack(x, y) {
		return this.#gameBoard.receiveAttack(x, y);
	}

	getShipAtCoordinate(x, y) {
		return this.#gameBoard.getShipAtCoordinate(x, y);
	}

	getShipDirection(ship) {
		return this.#gameBoard.getShipDirection(ship);
	}

	changeShipDirection(ship) {
		return this.#gameBoard.changeShipDirection(ship);
	}

	get boardSnapshot() {
		return this.#gameBoard.boardSnapshot;
	}

	get hasLost() {
		return this.#gameBoard.areAllShipsSunk;
	}

	#getEmptyCells() {
		const cells = [];
		for (const [x, row] of this.boardSnapshot.entries()) {
			for (const [y, cell] of row.entries()) {
				if (cell) continue;
				cells.push([x, y]);
			}
		}

		return cells;
	}
}
