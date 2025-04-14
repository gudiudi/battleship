export default class Ship {
	#length;
	#hits;
	#coordinates;

	constructor(length) {
		if (!Number.isInteger(length) || length < 1) {
			throw new Error("Ship length must be a positive integer");
		}

		this.#length = length;
		this.#hits = 0;
		this.#coordinates = [];
	}

	hit() {
		if (!this.isSunk) this.#hits++;
	}

	addCoordinate(x, y) {
		this.#coordinates.push([x, y]);
	}

	get isSunk() {
		return this.#hits >= this.#length;
	}

	get length() {
		return this.#length;
	}

	get hits() {
		return this.#hits;
	}

	get coordinatesSnapshot() {
		return this.#coordinates.map(([x, y]) => [x, y]);
	}
}
