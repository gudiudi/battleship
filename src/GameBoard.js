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
		const finalX = x + dx * (ship.length - 1);
		const finalY = y + dy * (ship.length - 1);
		if (this.#isOutOfBounds(finalX, finalY)) return false;

		if (!this.#isValidDirection(dx, dy) || this.#fleet.has(ship)) return false;

		if (!this.#areCellsAvailable(ship, x, y, dx, dy)) return false;

		this.#placeShipAndAdjacents(ship, x, y, dx, dy);

		this.#fleet.add(ship);

		return true;
	}

	receiveAttack(x, y) {
		if (x < 0 || y < 0 || x >= this.#size || y >= this.#size) return false;

		const cell = this.#board[x][y];

		if (cell?.hit) return false;

		if (!cell) {
			this.#board[x][y] = { hit: true };
			return true;
		}

		if (cell?.adjacent) {
			cell.hit = true;
			return true;
		}

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

	#isValidDirection(dx, dy) {
		return (dx === 0 && dy === 1) || (dx === 1 && dy === 0);
	}

	#isOutOfBounds(finalX, finalY) {
		return (
			finalX >= this.#size || finalY >= this.#size || finalX < 0 || finalY < 0
		);
	}

	#areCellsAvailable(ship, x, y, dx, dy) {
		for (let i = 0; i < ship.length; i++) {
			if (this.#board[x + dx * i][y + dy * i] !== null) {
				return false;
			}
		}
		return true;
	}

	#placeShipAndAdjacents(ship, x, y, dx, dy) {
		const adjacents = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1],
		];

		for (let i = 0; i < ship.length; i++) {
			const cx = x + dx * i;
			const cy = y + dy * i;

			this.#board[cx][cy] = { ship, hit: false };

			for (const [ox, oy] of adjacents) {
				const nx = cx + ox;
				const ny = cy + oy;

				if (
					nx >= 0 &&
					ny >= 0 &&
					nx < this.#size &&
					ny < this.#size &&
					this.#board[nx][ny] === null
				) {
					this.#board[nx][ny] = { adjacent: true, hit: false };
				}
			}
		}
	}
}
