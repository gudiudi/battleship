export default class GameBoard {
	#size;
	#board;
	#ships;

	constructor(size) {
		this.#size = size;
		this.#board = [...Array(size)].map(() => new Array(size).fill(null));
		this.#ships = new Set();
	}

	add(ship, x, y, dx = 0, dy = 1) {
		if (
			x < 0 ||
			y < 0 ||
			dx < 0 ||
			dy < 0 ||
			dx > 1 ||
			dy > 1 ||
			(dx === 0 && dy === 0) ||
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
		const coord = this.#board[x][y];

		if (coord === null || coord.hit === true) return false;

		coord.hit = true;
		coord.ship.hit();

		return true;
	}

	get board() {
		return this.#board;
	}

	get ships() {
		return this.#ships;
	}
}
