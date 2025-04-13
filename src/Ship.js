export default class Ship {
	#length;
	#hits;

	constructor(length) {
		if (!Number.isInteger(length) || length < 1) {
			throw new Error("Ship length must be a positive integer");
		}

		this.#length = length;
		this.#hits = 0;
	}

	hit() {
		if (!this.isSunk) this.#hits++;
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
}
