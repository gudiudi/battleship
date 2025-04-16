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
		this.#selfBoardEl = this.#createBoardContainer("self");
		this.#opponentBoardEl = this.#createBoardContainer("opponent", true);
		this.#createGrid(this.#selfBoardEl, size);
		this.#createGrid(this.#opponentBoardEl, size);
		this.#setupListeners();
		this.#setupSubscribers();
	}

	updateSelfBoard(selfBoardSnapshot) {
		this.#updateBoard(selfBoardSnapshot, this.#selfBoardEl);
	}

	updateOpponentBoard(selfBoardSnapshot) {
		this.#updateBoard(selfBoardSnapshot, this.#opponentBoardEl);
	}

	#setupListeners() {
		this.#setupClickListener();
		this.#setupDragStartListener();
		this.#setupDropTargetListener();
	}

	#setupSubscribers() {
		this.#emitter.subscribe("updateSelfBoard", this.updateSelfBoard.bind(this));
		this.#emitter.subscribe("shakeShip", this.#triggerShakeEffect.bind(this));
		this.#emitter.subscribe("ghostCell", this.#createGhostCell);
		this.#emitter.subscribe(
			"resetDraggedElement",
			this.#resetDraggedElement.bind(this),
		);
	}

	#updateBoard(boardSnapshot, boardEl, hideShips = false) {
		this.#clearCellsState(boardEl);

		for (const [x, row] of boardSnapshot.entries()) {
			for (const [y, cell] of row.entries()) {
				const cellEl = boardEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
				if (cell?.hit) {
					cellEl.classList.add(cell.ship ? "hit" : "miss");
				} else if (!hideShips && cell?.ship) {
					cellEl.classList.add("ship");
					cellEl.setAttribute("draggable", "true");
				}
			}
		}
	}

	#setupClickListener() {
		this.#selfBoardEl.addEventListener("click", (e) => {
			const cellEl = e.target.closest(".cell");
			if (!cellEl) return;

			const x = Number.parseInt(cellEl.dataset.x, 10);
			const y = Number.parseInt(cellEl.dataset.y, 10);

			this.#emitter.publish("cellClick", { x, y });
		});
	}

	#setupDragStartListener() {
		this.#selfBoardEl.addEventListener("dragstart", (e) => {
			const shipEl = e.target.closest(".ship");
			if (!shipEl) return;

			const x = Number.parseInt(shipEl.dataset.x, 10);
			const y = Number.parseInt(shipEl.dataset.y, 10);

			this.#dragged = shipEl;

			this.#emitter.publish("dragStart", { x, y, e });
		});
	}

	#setupDropTargetListener() {
		this.#selfBoardEl.addEventListener("dragenter", this.#preventDefault);
		this.#selfBoardEl.addEventListener("dragover", this.#preventDefault);

		this.#selfBoardEl.addEventListener("drop", (e) => {
			const cellEl = e.target.closest(".cell");
			if (!cellEl) return;
			e.preventDefault();

			const draggedX = Number.parseInt(this.#dragged.dataset.x, 10);
			const draggedY = Number.parseInt(this.#dragged.dataset.y, 10);
			const thisX = Number.parseInt(cellEl.dataset.x, 10);
			const thisY = Number.parseInt(cellEl.dataset.y, 10);

			this.#emitter.publish("drop", { draggedX, draggedY, thisX, thisY });
		});
	}

	#resetDraggedElement() {
		this.#dragged.removeAttribute("draggable");
		this.#dragged = null;
	}

	#createGhostCell({ coordinates, e }) {
		const isHorizontal =
			coordinates[0][0] === coordinates[coordinates.length - 1][0];
		const cellSize = 2;

		const ghost = document.createElement("div");
		ghost.style.width = isHorizontal
			? `${cellSize * coordinates.length}em`
			: `${cellSize}em`;
		ghost.style.height = isHorizontal
			? `${cellSize}em`
			: `${cellSize * coordinates.length}em`;
		ghost.style.position = "absolute";
		ghost.style.outline = "2px solid #0065d8";
		ghost.style.border = "2px solid #0065d8";
		ghost.style.pointerEvents = "none";
		ghost.style.top = "-1000px";
		ghost.style.left = "-1000px";

		document.body.appendChild(ghost);
		e.dataTransfer.setDragImage(ghost, 0, 0);
		setTimeout(() => document.body.removeChild(ghost), 0);
	}

	#createGrid(boardContainer, size) {
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

		boardContainer.appendChild(fragment);
	}

	#createBoardContainer(className, disabled = false) {
		const board = document.createElement("div");
		board.classList.add("board", className);
		disabled && board.classList.add("disabled");
		this.#appEl.appendChild(board);
		return board;
	}

	#clearCellsState(boardEl) {
		for (const cell of boardEl.querySelectorAll(".cell")) {
			cell.classList.remove("ship", "hit", "miss");
		}
	}

	#triggerShakeEffect(shipCoords) {
		for (const [x, y] of shipCoords) {
			const shipPartEl = this.#selfBoardEl.querySelector(
				`[data-x="${x}"][data-y="${y}"]`,
			);
			shipPartEl.classList.add("shake");
			shipPartEl.addEventListener(
				"animationend",
				() => {
					shipPartEl.classList.remove("shake");
				},
				{ once: true },
			);
		}
	}

	#preventDefault(e) {
		const cellEl = e.target.closest(".cell");
		if (!cellEl) return;
		e.preventDefault();
	}

	get selfBoardEl() {
		return this.#selfBoardEl;
	}

	get opponentBoardEl() {
		return this.#opponentBoardEl;
	}
}
