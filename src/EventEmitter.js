export default class EventEmitter {
	#subscribers;

	constructor() {
		this.#subscribers = new Map();
	}

	subscribe(event, callback) {
		const callbacks = this.#callbacks(event);
		callbacks.add(callback);
		this.#subscribers.set(event, callbacks);
	}

	publish(event, data) {
		const callbacks = this.#callbacks(event);
		for (const callback of callbacks) {
			callback(data);
		}
	}

	unsubscribe(event, callback) {
		const callbacks = this.#callbacks(event);
		callbacks.delete(callback);
		if (callbacks.size === 0) this.#subscribers.delete(event);
	}

	#callbacks(event) {
		return this.#subscribers.get(event) || new Set();
	}
}
