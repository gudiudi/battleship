export default class GameView {
	#emitter;
	#appEl;
	#selfBoardEl;
	#opponentBoardEl;
	#dragged = null;

	constructor(emitter) {
		this.#appEl = document.getElementById("app");
		this.#emitter = emitter;
	}

	init(size = 10) {
		this.#createBattlefields(size);
		this.#createStartButton();
		this.#setupListeners();
		this.#setupSubscribers();
	}

	updateSelfBoard = (snapshot) =>
		this.#updateBoard(snapshot, this.#selfBoardEl);

	updateOpponentBoard = (snapshot) =>
		this.#updateBoard(snapshot, this.#opponentBoardEl, true);

	#createBattlefields(size) {
		this.#selfBoardEl = this.#createBoard("self");
		this.#opponentBoardEl = this.#createBoard("opponent", true);
		this.#createGrid(this.#selfBoardEl, size);
		this.#createGrid(this.#opponentBoardEl, size);
	}

	#setupListeners() {
		this.#selfBoardEl.addEventListener("click", this.#handleCellClick);
		this.#opponentBoardEl.addEventListener("click", this.#handleCellClick);
		this.#setupDragAndDropListeners();
	}

	#setupSubscribers() {
		const subscriptions = {
			updateSelfBoard: this.updateSelfBoard,
			updateOpponentBoard: this.updateOpponentBoard,
			shakeShip: this.#triggerShakeEffect,
			ghostCell: this.#createGhostCell,
			resetDraggedElement: this.#resetDraggedElement,
			clearDraggableAttr: this.#clearDraggableAttr,
			disableDragAndDropListeners: this.#disableDragAndDropListeners,
			switchTurn: this.#toggleBoards,
		};

		for (const [event, handler] of Object.entries(subscriptions)) {
			this.#emitter.subscribe(event, handler);
		}
	}

	#updateBoard(snapshot, boardEl, hideShips = false) {
		this.#clearBoardState(boardEl);

		for (const [x, row] of snapshot.entries()) {
			for (const [y, cell] of row.entries()) {
				const cellEl = boardEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
				if (cell?.hit) {
					cellEl.classList.add(cell.ship ? "hit" : "miss");
				} else if (!hideShips && cell?.ship) {
					cellEl.classList.add("ship");
					cellEl.draggable = true;
				}
			}
		}
	}

	#toggleDragAndDropListeners(enable) {
		const method = enable ? "addEventListener" : "removeEventListener";
		const handlers = {
			dragstart: this.#handleDragStart,
			dragenter: this.#preventDefault,
			dragover: this.#preventDefault,
			drop: this.#handleDrop,
		};

		for (const [event, handler] of Object.entries(handlers)) {
			this.#selfBoardEl[method](event, handler);
		}
	}

	#setupDragAndDropListeners() {
		this.#toggleDragAndDropListeners(true);
	}

	#disableDragAndDropListeners = () => {
		this.#toggleDragAndDropListeners(false);
	};

	#handleCellClick = (e) => {
		const cellEl = e.target.closest(".cell");
		if (!cellEl) return;

		const { x, y } = cellEl.dataset;
		this.#emitter.publish("cellClick", { x: +x, y: +y });
	};

	#handleDragStart = (e) => {
		const shipEl = e.target.closest(".ship");
		if (!shipEl) {
			e.preventDefault();
			return;
		}

		this.#dragged = shipEl;

		const { x, y } = shipEl.dataset;
		this.#emitter.publish("dragStart", { x: +x, y: +y, e });
	};

	#handleDrop = (e) => {
		const cellEl = e.target.closest(".cell");
		if (!cellEl) return;
		e.preventDefault();

		const { x: draggedX, y: draggedY } = this.#dragged.dataset;
		const { x: targetX, y: targetY } = cellEl.dataset;
		this.#emitter.publish("drop", {
			draggedX: +draggedX,
			draggedY: +draggedY,
			targetX: +targetX,
			targetY: +targetY,
		});
	};

	#createGhostCell({ coordinates, e }) {
		const isHorizontal = coordinates[0][0] === coordinates.at(-1)[0];
		const ghost = document.createElement("div");
		const length = coordinates.length;

		ghost.className = "ghost";
		ghost.style.width = `${isHorizontal ? length * 2 : 2}em`;
		ghost.style.height = `${isHorizontal ? 2 : length * 2}em`;

		document.body.appendChild(ghost);
		e.dataTransfer.setDragImage(ghost, 0, 0);
		setTimeout(() => ghost.remove(), 0);
	}

	#createStartButton() {
		const buttonEl = document.createElement("button");
		buttonEl.textContent = "Start";
		buttonEl.className = "start";
		buttonEl.addEventListener("click", this.#handleGameStart);
		this.#opponentBoardEl.parentNode.appendChild(buttonEl);
	}

	#handleGameStart = (e) => {
		e.target.remove();
		this.#emitter.publish("gameStart");
	};

	#createBoard(className, disabled = false) {
		const battlefieldEl = document.createElement("div");
		const boardEl = document.createElement("div");
		battlefieldEl.className = `battlefied_${className}`;
		boardEl.className = `board ${className} ${disabled ? "disabled" : ""}`;
		battlefieldEl.appendChild(boardEl);
		this.#appEl.appendChild(battlefieldEl);
		return boardEl;
	}

	#toggleBoards = () => {
		const boards = [this.#selfBoardEl, this.#opponentBoardEl];
		for (const board of boards) {
			board.classList.contains("disabled")
				? board.classList.remove("disabled")
				: board.classList.add("disabled");
		}
	};

	#createGrid(boardEl, size) {
		const fragment = document.createDocumentFragment();

		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				const cellEl = document.createElement("div");
				cellEl.classList.add("cell");
				cellEl.dataset.x = x;
				cellEl.dataset.y = y;
				fragment.appendChild(cellEl);
			}
		}

		boardEl.appendChild(fragment);
	}

	#clearBoardState(boardEl) {
		for (const cell of boardEl.querySelectorAll(".cell")) {
			cell.classList.remove("ship", "hit", "miss");
			cell.removeAttribute("draggable");
		}
	}

	#clearDraggableAttr = () => {
		for (const cell of this.#selfBoardEl.querySelectorAll(".cell")) {
			cell.removeAttribute("draggable");
		}
	};

	#triggerShakeEffect = (coordinates) => {
		for (const [x, y] of coordinates) {
			const cell = this.#selfBoardEl.querySelector(
				`[data-x="${x}"][data-y="${y}"]`,
			);
			cell?.classList.add("shake");
			cell?.addEventListener(
				"animationend",
				() => cell.classList.remove("shake"),
				{ once: true },
			);
		}
	};

	#resetDraggedElement = () => {
		this.#dragged?.removeAttribute("draggable");
		this.#dragged = null;
	};

	#preventDefault(e) {
		if (e.target.closest(".cell")) e.preventDefault();
	}

	get selfBoardEl() {
		return this.#selfBoardEl;
	}

	get opponentBoardEl() {
		return this.#opponentBoardEl;
	}
}
