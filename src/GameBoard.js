export default class GameBoard {
	#size;
	#board;

	constructor(size) {
		this.#size = size;
		this.#board = [...Array(size)].map(() => new Array(size).fill(null));
	}

	add(ship, x, y, dx = 0, dy = 1) {
		if (
			x + dx * (ship.length - 1) >= this.#size ||
			y + dy * (ship.length - 1) >= this.#size
		) {
			return false;
		}

		for (let i = 0; i < ship.length; i++) {
			if (this.#board[x + dx * i][y + dy * i] !== null) return false;
		}

		for (let i = 0; i < ship.length; i++) {
			this.#board[x + dx * i][y + dy * i] = ship;
		}

		return true;
	}

	get board() {
		return this.#board;
	}
}
