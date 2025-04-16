export default class GameBoard {
	#size;
	#board;
	#fleet;
	#sunkShipsCount;

	static #DIRECTIONS = {
		HORIZONTAL: { dx: 0, dy: 1 },
		VERTICAL: { dx: 1, dy: 0 },
	};

	constructor(size = 10) {
		this.#size = size;
		this.#board = this.#createBoard(size);
		this.#fleet = new Set();
		this.#sunkShipsCount = 0;
	}

	placeShip(ship, x, y, direction = GameBoard.#DIRECTIONS.HORIZONTAL) {
		if (!this.#canPlaceShip(ship, x, y, direction)) return false;

		this.#placeShipOnBoard(ship, x, y, direction);
		this.#fleet.add(ship);

		return true;
	}

	rePlaceShip(ship, newX, newY, newDirection) {
		if (!this.#fleet.has(ship)) return false;

		const [previousX, previousY, previousDirection] =
			this.#captureShipState(ship);

		const directionToUse = newDirection || previousDirection;

		this.#removeShipFromBoard(ship);

		const success = this.placeShip(ship, newX, newY, directionToUse);

		if (!success) {
			this.placeShip(ship, previousX, previousY, previousDirection);
			return false;
		}

		return true;
	}

	changeShipDirection(ship) {
		if (!this.#fleet.has(ship) || ship.length < 2) return false;

		const [previousX, previousY, previousDirection] =
			this.#captureShipState(ship);

		const newDirection = this.#getOppositeDirection(previousDirection);

		this.#removeShipFromBoard(ship);

		const success = this.placeShip(ship, previousX, previousY, newDirection);

		if (!success) {
			this.placeShip(ship, previousX, previousY, previousDirection);
			return false;
		}

		return true;
	}

	receiveAttack(x, y) {
		if (this.#isOutOfBounds(x, y))
			return { isShip: false, wasAlreadyHit: false };

		const cell = this.#board[x][y];

		if (cell?.hit === true) {
			return {
				isShip: Boolean(cell?.ship),
				wasAlreadyHit: true,
			};
		}

		if (!cell?.ship) {
			this.#board[x][y] = { hit: true };
			return { isShip: false, wasAlreadyHit: false };
		}

		const ship = cell.ship;
		const wasSunkBeforeHit = ship.isSunk;

		cell.hit = true;
		ship.hit();

		if (!wasSunkBeforeHit && ship.isSunk) this.#sunkShipsCount++;

		return { isShip: true, wasAlreadyHit: false };
	}

	getShipAtCoordinate(x, y) {
		if (this.#isOutOfBounds(x, y)) return null;
		const cell = this.#board[x][y];
		return cell?.ship || null;
	}

	getShipDirection(ship) {
		const coords = ship.coordinatesSnapshot;

		if (coords.length === 1) return GameBoard.#DIRECTIONS.HORIZONTAL;

		const [x1, y1] = coords[0];
		const [x2, y2] = coords[1];

		if (x1 === x2) return GameBoard.#DIRECTIONS.HORIZONTAL;
		if (y1 === y2) return GameBoard.#DIRECTIONS.VERTICAL;

		return null;
	}

	clearBoard() {
		this.#board = this.#createBoard(this.#size);
		this.#fleet.clear();
		this.#sunkShipsCount = 0;
	}

	get areAllShipsSunk() {
		return this.#fleet.size > 0 && this.#sunkShipsCount === this.#fleet.size;
	}

	get boardSnapshot() {
		return this.#board.map((row) =>
			row.map((cell) => (cell ? { ...cell } : null)),
		);
	}

	get fleetSnapshot() {
		return [...this.#fleet].map((ship) => ({
			length: ship.length,
			hits: ship.hits,
			isSunk: ship.isSunk,
			coordinatesSnapshot: ship.coordinatesSnapshot,
		}));
	}

	get size() {
		return this.#size;
	}

	#createBoard(size) {
		return [...Array(size)].map(() => new Array(size).fill(null));
	}

	#canPlaceShip(ship, x, y, direction) {
		if (!ship || this.#fleet.has(ship)) return false;
		if (!this.#isValidDirection(direction)) return false;

		const finalX = x + direction.dx * (ship.length - 1);
		const finalY = y + direction.dy * (ship.length - 1);
		if (this.#isOutOfBounds(x, y) || this.#isOutOfBounds(finalX, finalY))
			return false;

		if (!this.#areCellsAvailable(ship, x, y, direction)) return false;

		return true;
	}

	#placeShipOnBoard(ship, x, y, direction) {
		ship.clearCoordinates();
		for (let i = 0; i < ship.length; i++) {
			const currentX = x + direction.dx * i;
			const currentY = y + direction.dy * i;
			this.#board[currentX][currentY] = { ship: ship, hit: false };
			ship.addCoordinate(currentX, currentY);
		}
	}

	#removeShipFromBoard(ship) {
		const coords = ship.coordinatesSnapshot;
		if (!coords || coords.length === 0) return;
		for (const [x, y] of coords) {
			if (!this.#isOutOfBounds(x, y) && this.#board[x][y]?.ship === ship)
				this.#board[x][y] = null;
		}
		ship.clearCoordinates();
		this.#fleet.delete(ship);
	}

	#isOutOfBounds(x, y) {
		return x < 0 || y < 0 || x >= this.#size || y >= this.#size;
	}

	#isValidDirection(direction) {
		const { dx, dy } = direction;
		const { HORIZONTAL, VERTICAL } = GameBoard.#DIRECTIONS;
		return (
			(dx === HORIZONTAL.dx && dy === HORIZONTAL.dy) ||
			(dx === VERTICAL.dx && dy === VERTICAL.dy)
		);
	}

	#areCellsAvailable(ship, x, y, direction) {
		for (let i = 0; i < ship.length; i++) {
			const currentX = x + direction.dx * i;
			const currentY = y + direction.dy * i;

			if (this.#board[currentX][currentY] !== null) return false;

			if (this.#isAdjacentToOtherShip(currentX, currentY, ship)) return false;
		}

		return true;
	}

	#isAdjacentToOtherShip(x, y, excludeShip = null) {
		const adjacentOffsets = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			/*[0,0]*/
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1],
		];

		for (const [offsetX, offsetY] of adjacentOffsets) {
			const adjacentX = x + offsetX;
			const adjacentY = y + offsetY;

			if (this.#isOutOfBounds(adjacentX, adjacentY)) continue;

			const adjacentCell = this.#board[adjacentX][adjacentY];
			if (adjacentCell?.ship && adjacentCell.ship !== excludeShip) return true;
		}

		return false;
	}

	#getOppositeDirection(direction) {
		const { HORIZONTAL, VERTICAL } = GameBoard.#DIRECTIONS;

		if (!this.#isValidDirection(direction)) return null;

		return direction.dx === HORIZONTAL.dx ? VERTICAL : HORIZONTAL;
	}

	#captureShipState(ship) {
		const coords = ship.coordinatesSnapshot;
		if (!coords || coords.length === 0) return null;

		const [x, y] = coords[0];
		const direction = this.getShipDirection(ship);

		return [x, y, direction];
	}
}
