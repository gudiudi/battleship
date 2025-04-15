export default class UI {
	#appEl;
	#selfBoardEl;
	#opponentBoardEl;
	#dragged = null;

	constructor() {
		this.#appEl = document.getElementById("app");
	}

	init(selfBoard, size = 10) {
		this.#selfBoardEl = this.#createBoardContainer("self");
		this.#opponentBoardEl = this.#createBoardContainer("opponent", true);
		this.#createGrid(this.#selfBoardEl, size);
		this.#createGrid(this.#opponentBoardEl, size);
		this.#setupClickListener(this.#selfBoardEl, selfBoard);
		this.#setupDragStartListener(this.#selfBoardEl, selfBoard);
		this.#setupDropTargetListener(this.#selfBoardEl, selfBoard);
	}

	updateBoard(gameBoard, boardEl, hideShips = false) {
		this.#clearCellsState(boardEl);

		for (const [x, row] of gameBoard.entries()) {
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

	#setupClickListener(selfBoardEl, selfBoard) {
		selfBoardEl.addEventListener("click", (e) => {
			const cell = e.target.closest(".cell");
			if (!cell) return;

			const x = Number.parseInt(cell.dataset.x, 10);
			const y = Number.parseInt(cell.dataset.y, 10);

			const ship = selfBoard.getShipAtCoordinate(x, y);
			if (ship) this.#attemptChangeDirection(ship, selfBoard);

			this.updateBoard(selfBoard.boardSnapshot, selfBoardEl);
		});
	}

	#attemptChangeDirection(ship, selfBoard) {
		const success = selfBoard.changeShipDirection(ship);
		if (!success) this.#triggerShakeEffect(ship.coordinatesSnapshot);
		return success;
	}

	#setupDragStartListener(selfBoardEl, selfBoard) {
		selfBoardEl.addEventListener("dragstart", (e) => {
			const shipEl = e.target.closest(".ship");
			if (!shipEl) return;

			const x = Number.parseInt(shipEl.dataset.x, 10);
			const y = Number.parseInt(shipEl.dataset.y, 10);

			this.#dragged = shipEl;

			const ship = selfBoard.getShipAtCoordinate(x, y);
			this.#createGhostCell(ship.coordinatesSnapshot, e);
		});
	}

	#setupDropTargetListener(selfBoardEl, selfBoard) {
		selfBoardEl.addEventListener("dragenter", this.#preventDefault);
		selfBoardEl.addEventListener("dragover", this.#preventDefault);

		selfBoardEl.addEventListener("drop", (e) => {
			const cellEl = e.target.closest(".cell");
			if (!cellEl) return;
			e.preventDefault();

			const draggedX = Number.parseInt(this.#dragged.dataset.x, 10);
			const draggedY = Number.parseInt(this.#dragged.dataset.y, 10);
			const ship = selfBoard.getShipAtCoordinate(draggedX, draggedY);
			const success = this.#handleDrop(cellEl, ship, selfBoard);

			if (!success) {
				this.#triggerShakeEffect(ship.coordinatesSnapshot);
				return;
			}

			this.#dragged.removeAttribute("draggable");
			this.#dragged = null;
			this.updateBoard(selfBoard.boardSnapshot, selfBoardEl);
		});
	}

	#createGhostCell(shipCoords, event) {
		const isHorizontal = shipCoords[0][0] === shipCoords[shipCoords.length - 1][0];
		const cellSize = 2;

		const ghost = document.createElement("div");
		ghost.style.width = isHorizontal ? `${cellSize * shipCoords.length}em` : `${cellSize}em`;
		ghost.style.height = isHorizontal ? `${cellSize}em` : `${cellSize * shipCoords.length}em`;
		ghost.style.position = "absolute";
		ghost.style.outline = "2px solid #0065d8";
		ghost.style.border = "2px solid #0065d8";
		ghost.style.pointerEvents = "none";
		ghost.style.top = "-1000px";
		ghost.style.left = "-1000px";

		document.body.appendChild(ghost);
		event.dataTransfer.setDragImage(ghost, 0, 0);
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
			const shipPartEl = this.#selfBoardEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
			shipPartEl.classList.add("shake");
			shipPartEl.addEventListener("animationend", () => {
				shipPartEl.classList.remove("shake");
			}, { once: true });
		}
	}

	#preventDefault(e) {
		const cellEl = e.target.closest(".cell");
		if (!cellEl) return;
		e.preventDefault();
	}

	#handleDrop(cellEl, ship, selfBoard) {
		const thisX = Number.parseInt(cellEl.dataset.x, 10);
		const thisY = Number.parseInt(cellEl.dataset.y, 10);
		const thisDirection = selfBoard.getShipDirection(ship);

		return selfBoard.rePlaceShip(ship, thisX, thisY, thisDirection);
	}

	get selfBoardEl() {
		return this.#selfBoardEl;
	}

	get opponentBoardEl() {
		return this.#opponentBoardEl;
	}
}
