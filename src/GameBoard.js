export default class GameBoard {
	#size;
	#board;
	#fleet;
	#sunk;

	constructor(size = 10) {
		this.#size = size;
		this.#board = [...Array(size)].map(() => new Array(size).fill(null));
		this.#fleet = new Set();
		this.#sunk = 0;
	}

	placeShip(ship, x, y, dx = 0, dy = 1) {
		const isValidDirection = (dx === 0 && dy === 1) || (dx === 1 && dy === 0);
		if (!isValidDirection || this.#fleet.has(ship)) return false;

		const finalX = x + dx * (ship.length - 1);
		const finalY = y + dy * (ship.length - 1);
		if (finalX >= this.#size || finalY >= this.#size) return false;

		for (let i = 0; i < ship.length; i++) {
			if (this.#board[x + dx * i][y + dy * i] !== null) return false;
		}

		for (let i = 0; i < ship.length; i++) {
			this.#board[x + dx * i][y + dy * i] = { ship, hit: false };
		}

		this.#fleet.add(ship);

		return true;
	}

	receiveAttack(x, y) {
		if (x < 0 || y < 0 || x >= this.#size || y >= this.#size) return false;

		const cell = this.#board[x][y];
		if (!cell || cell.hit) return false;

		cell.hit = true;
		cell.ship.hit();

		if (cell.ship.isSunk) this.#sunk++;

		return true;
	}

	get areAllShipsSunk() {
		return this.#sunk === this.#fleet.size;
	}

	get boardSnapshot() {
		return this.#board.map((row) =>
			row.map((cell) => (cell ? { ...cell } : null)),
		);
	}
}
