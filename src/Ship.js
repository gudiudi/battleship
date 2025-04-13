export default class Ship {
	#ship;

	constructor(length) {
		this.#ship = { length, hits: 0 };
	}

	hit() {
		this.#ship.hits += 1;
	}

	isSunk() {
		return this.#ship.hits >= this.#ship.length;
	}

	get ship() {
		return this.#ship;
	}

	get length() {
		return this.#ship.length;
	}

	get hits() {
		return this.#ship.hits;
	}
}
