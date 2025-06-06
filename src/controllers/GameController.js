import Ship from "../core/Ship";

export default class GameController {
	#self;
	#opponent;
	#view;
	#emitter;
	#started = false;
	#over = false;
	#turn = null;

	constructor(self, opponent, view, emitter) {
		this.#self = self;
		this.#opponent = opponent;
		this.#emitter = emitter;
		this.#view = view;
	}

	init() {
		this.#view.init();
		this.#populateBoards();
		this.#setupSubscribers();
	}

	#populateBoards() {
		this.#placeRandomShips(this.#self);
		this.#placeRandomShips(this.#opponent);
		this.#view.updateSelfBoard(this.#self.boardSnapshot);
		this.#view.updateOpponentBoard(this.#opponent.boardSnapshot);
	}

	#startGame = () => {
		this.#emitter.publish("clearDraggableAttr");
		this.#emitter.publish("disableDragAndDropListeners");
		this.#started = true;
		this.#switchTurn();
		this.#emitter.publish("updateSelfStats", this.#self.fleetSnapshot);
		this.#emitter.publish("updateOpponentStats", this.#opponent.fleetSnapshot);
	};

	#restartGame = () => {
		this.#started = false;
		this.#turn = null;
		this.#over = false;
		this.#self.clearBoard();
		this.#opponent.clearBoard();
		this.#populateBoards();
		this.#emitter.publish("enableDragAndDropListeners");
		this.#emitter.publish("updateSelfStats", this.#self.fleetSnapshot);
		this.#emitter.publish("updateOpponentStats", this.#opponent.fleetSnapshot);
	};

	#gameOver() {
		const winner = this.#turn === this.#self ? "self" : "opponent";
		this.#emitter.publish("gameOver", winner);
		this.#over = true;
	}

	#switchTurn() {
		this.#emitter.publish("switchTurn");
		this.#turn = this.#turn === this.#self ? this.#opponent : this.#self;
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
		const subscriptions = {
			gameStart: this.#startGame,
			restartGame: this.#restartGame,
			cellClick: this.#handleCellClick,
			dragStart: this.#handleDragStart,
			drop: this.#handleDrop,
		};

		for (const [event, handler] of Object.entries(subscriptions)) {
			this.#emitter.subscribe(event, handler);
		}
	}

	#handleCellClick = async ({ x, y }) => {
		if (this.#over) return;

		// pre-game phase
		if (!this.#started && !this.#turn) {
			const ship = this.#self.getShipAtCoordinate(x, y);
			if (!ship) return;
			this.#attemptChangeShipDirection(ship);
			this.#emitter.publish("updateSelfBoard", this.#self.boardSnapshot);
		}

		// player's turn
		if (this.#turn === this.#self) {
			const attack = this.#self.makeAttack(this.#opponent, x, y);

			this.#emitter.publish(
				"updateOpponentBoard",
				this.#opponent.boardSnapshot,
			);
			this.#emitter.publish(
				"updateOpponentStats",
				this.#opponent.fleetSnapshot,
			);

			if (this.#opponent.areAllShipsSunk) {
				this.#gameOver();
				return;
			}
			if (attack.wasAlreadyHit) return;
			if (!attack.isShip) this.#switchTurn();
		}

		// opponent's turn
		if (this.#turn === this.#opponent) {
			this.#opponentMakeAttack();
		}
	};

	#opponentMakeAttack = async () => {
		const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
		await delay(500);

		const attack = this.#opponent.makeAttack(this.#self);
		if (!attack) return;

		this.#emitter.publish("updateSelfBoard", this.#self.boardSnapshot);
		this.#emitter.publish("updateSelfStats", this.#self.fleetSnapshot);

		if (this.#self.areAllShipsSunk) {
			this.#gameOver();
			return;
		}

		// unlikely because we already use unhitted cells on opponent.makeAttack
		if (attack.wasAlreadyHit) {
			console.log("attack.wasAlreadyHit");
			await this.#opponentMakeAttack();
			return;
		}

		if (!attack.isShip) {
			this.#switchTurn();
			return;
		}

		await this.#opponentMakeAttack();
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
