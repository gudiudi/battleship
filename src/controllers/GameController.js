import Ship from "../core/Ship";

export default class GameController {
	#self;
	#opponent;
	#view;
	#emitter;
	#started = false;
	#turn = null;

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

	#startGame = () => {
		this.#emitter.unsubscribe("gameStart", this.#startGame);
		this.#emitter.publish("clearDraggableAttr");
		this.#emitter.publish("disableDragAndDropListeners");
		this.#started = true;
	};

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
		const subscriptions = {
			gameStart: this.#startGame,
			cellClick: this.#handleCellClick,
			dragStart: this.#handleDragStart,
			drop: this.#handleDrop,
		};

		for (const [event, handler] of Object.entries(subscriptions)) {
			this.#emitter.subscribe(event, handler);
		}
	}

	#handleCellClick = ({ x, y }) => {
		const ship = this.#self.getShipAtCoordinate(x, y);
		if (!ship) return;

		// pre-game phase
		if (!this.#started && !this.#turn) {
			this.#attemptChangeShipDirection(ship);
			this.#emitter.publish("updateSelfBoard", this.#self.boardSnapshot);
		}
		// else opponent's turn and player TODO
	};

	#attemptChangeShipDirection(ship) {
		const success = this.#self.changeShipDirection(ship);
		if (!success) this.#emitter.publish("shakeShip", ship.coordinatesSnapshot);
		return success;
	}

	#handleDragStart = ({ x, y, e }) => {
		if (this.#started) return;
		const ship = this.#self.getShipAtCoordinate(x, y);
		if (!ship) return;

		this.#emitter.publish("ghostCell", {
			coordinates: ship.coordinatesSnapshot,
			e,
		});
	};

	#handleDrop = ({ draggedX, draggedY, targetX, targetY }) => {
		if (this.#started) return;
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
