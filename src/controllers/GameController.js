import Ship from "../core/Ship";

export default class GameController {
	#self;
	#opponent;
	#view;
	#emitter;

	constructor(self, opponent, view, emitter) {
		this.#self = self;
		this.#opponent = opponent;
		this.#emitter = emitter;
		this.#view = view;
	}

	init() {
		this.#view.init();
		this.#placeRandomShips(this.#self);
		this.#placeRandomShips(this.#opponent);
		this.#view.updateSelfBoard(this.#self.boardSnapshot);
		this.#view.updateOpponentBoard(this.#opponent.boardSnapshot);
		this.#setupSubscribers();
	}

	#placeRandomShips(participant) {
		const fleet = {
			4: 1,
			3: 2,
			2: 3,
			1: 4,
		};

		for (const [ship, count] of Object.entries(fleet)) {
			for (let i = 0; i < count; i++) {
				participant.placeShipAtRandom(new Ship(Number(ship)));
			}
		}
	}

	#setupSubscribers() {
		this.#emitter.subscribe("cellClick", this.#handleCellClick);
		this.#emitter.subscribe("dragStart", this.#handleDragStart);
		this.#emitter.subscribe("drop", this.#handleDrop);
	}

	#handleCellClick = ({ x, y }) => {
		const ship = this.#self.getShipAtCoordinate(x, y);
		if (!ship) return;

		this.#attemptChangeShipDirection(ship);
		this.#emitter.publish("updateSelfBoard", this.#self.boardSnapshot);
	};

	#attemptChangeShipDirection(ship) {
		const success = this.#self.changeShipDirection(ship);
		if (!success) this.#emitter.publish("shakeShip", ship.coordinatesSnapshot);
		return success;
	}

	#handleDragStart = ({ x, y, e }) => {
		const ship = this.#self.getShipAtCoordinate(x, y);
		if (!ship) return;

		this.#emitter.publish("ghostCell", {
			coordinates: ship.coordinatesSnapshot,
			e,
		});
	};

	#handleDrop = ({ draggedX, draggedY, targetX, targetY }) => {
		const ship = this.#self.getShipAtCoordinate(draggedX, draggedY);
		if (!ship) return;

		const targetDirection = this.#self.getShipDirection(ship);
		const success = this.#self.rePlaceShip(
			ship,
			targetX,
			targetY,
			targetDirection,
		);
		if (!success) {
			this.#emitter.publish("shakeShip", ship.coordinatesSnapshot);
			return;
		}
		this.#emitter.publish("resetDraggedElement", this.#self.boardSnapshot);
		this.#emitter.publish("updateSelfBoard", this.#self.boardSnapshot);
	};
}
