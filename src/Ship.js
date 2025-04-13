export default class Ship {
	#data;

	constructor(length) {
		this.#data = { length, hits: 0 };
	}

	hit() {
		this.#data.hits += 1;
	}

	sunk() {
		return this.#data.hits >= this.#data.length;
	}

	get length() {
		return this.#data.length;
	}

	get hits() {
		return this.#data.hits;
	}
}
