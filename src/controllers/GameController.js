export default class GameController {
	#self;
	#opponent;
	#emitter;

	constructor(self, opponent, emitter) {
		this.#self = self;
		this.#opponent = opponent;
		this.#emitter = emitter;
	}

	init() {
		this.#setupSubscribers();
	}

	#setupSubscribers() {
		this.#emitter.subscribe("cellClick", this.#handleCellClick.bind(this));
		this.#emitter.subscribe("dragStart", this.#handleDragStart.bind(this));
		this.#emitter.subscribe("drop", this.#handleDrop.bind(this));
	}

	#handleCellClick({ x, y }) {
		const ship = this.#self.getShipAtCoordinate(x, y);
		if (!ship) return;

		this.#attemptChangeShipDirection(ship);
		this.#emitter.publish("updateSelfBoard", this.#self.boardSnapshot);
	}

	#attemptChangeShipDirection(ship) {
		const success = this.#self.changeShipDirection(ship);
		if (!success) this.#emitter.publish("shakeShip", ship.coordinatesSnapshot);
		return success;
	}

	#handleDragStart({ x, y, e }) {
		const ship = this.#self.getShipAtCoordinate(x, y);
		if (!ship) return;

		this.#emitter.publish("ghostCell", {
			coordinates: ship.coordinatesSnapshot,
			e,
		});
	}

	#handleDrop({ draggedX, draggedY, thisX, thisY }) {
		const ship = this.#self.getShipAtCoordinate(draggedX, draggedY);
		if (!ship) return;

		const thisDirection = this.#self.getShipDirection(ship);
		const success = this.#self.rePlaceShip(ship, thisX, thisY, thisDirection);
		if (!success) {
			this.#emitter.publish("shakeShip", ship.coordinatesSnapshot);
			return;
		}
		this.#emitter.publish("resetDraggedElement", this.#self.boardSnapshot);
		this.#emitter.publish("updateSelfBoard", this.#self.boardSnapshot);
	}
}
