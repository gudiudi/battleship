export default class GameBoard {
	#size;
	#board;
	#ships;
	#sunk;

	constructor(size) {
		this.#size = size;
		this.#board = [...Array(size)].map(() => new Array(size).fill(null));
		this.#ships = new Set();
		this.#sunk = 0;
	}

	add(ship, x, y, dx = 0, dy = 1) {
		if (
			x < 0 ||
			y < 0 ||
			(dx !== 0 && dx !== 1) ||
			(dy !== 0 && dy !== 1) ||
			(dx === 0 && dy === 0) ||
			(dx === 1 && dy === 1) ||
			this.#ships.has(ship) ||
			x + dx * (ship.length - 1) >= this.#size ||
			y + dy * (ship.length - 1) >= this.#size
		) {
			return false;
		}

		for (let i = 0; i < ship.length; i++) {
			if (this.#board[x + dx * i][y + dy * i] !== null) return false;
		}

		for (let i = 0; i < ship.length; i++) {
			this.#board[x + dx * i][y + dy * i] = { ship, hit: false };
		}

		this.#ships.add(ship);

		return true;
	}

	attack(x, y) {
		if (x < 0 || y < 0 || x >= this.#size || y >= this.#size) return false;

		const coord = this.#board[x][y];
		if (!coord || coord.hit) return false;

		coord.hit = true;
		coord.ship.hit();

		if (coord.ship.isSunk()) this.#sunk++;

		return true;
	}

	allSunk() {
		return this.#sunk === this.#ships.size;
	}

	get board() {
		return this.#board.map((row) =>
			row.map((cell) => (cell ? { ...cell } : null)),
		);
	}
}
