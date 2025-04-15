export default class UI {
	#appEl;
	#selfBoardEl;
	#opponentBoardEl;
	#dragged;

	constructor() {
		this.#appEl = document.getElementById("app");
		this.#dragged;
	}

	init(selfBoard, size = 10) {
		this.#selfBoardEl = this.#createBoardContainer("self");
		this.#opponentBoardEl = this.#createBoardContainer("opponent", true);
		this.#createGrid(this.#selfBoardEl, size);
		this.#createGrid(this.#opponentBoardEl, size);
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

	bindCellClickHandler(boardEl, handler) {
		boardEl.addEventListener("click", (e) => {
			const cell = e.target.closest(".cell");
			if (!cell) return;

			const x = Number.parseInt(cell.dataset.x, 10);
			const y = Number.parseInt(cell.dataset.y, 10);

			handler(x, y);
		});
	}

	bindCellDragStartHandler(boardEl, handler) {
		boardEl.addEventListener("dragstart", (e) => {
			const shipEl = e.target.closest(".ship");
			if (!shipEl) return;

			const x = Number.parseInt(shipEl.dataset.x, 10);
			const y = Number.parseInt(shipEl.dataset.y, 10);

			this.#dragged = shipEl;
			e.dataTransfer.setData("text/plain", JSON.stringify({ draggedX: x, draggedY: y }));

			//shipEl.classList.remove("ship");

			handler(x, y, e);
		});
	}

	#setupDropTargetListener(selfBoardEl, selfBoard) {
		selfBoardEl.addEventListener("dragenter", (e) => {
			const cellEl = e.target.closest(".cell");
			if (!cellEl) return;
			e.preventDefault();
		});

		selfBoardEl.addEventListener("dragover", (e) => {
			const cellEl = e.target.closest(".cell");
			if (!cellEl) return;
			e.preventDefault();
		});

		selfBoardEl.addEventListener("drop", (e) => {
			const cellEl = e.target.closest(".cell");
			if (!cellEl) return;
			e.preventDefault();

			const { draggedX, draggedY } = JSON.parse(e.dataTransfer.getData("text/plain"));
			const ship = selfBoard.getShipAtCoordinate(draggedX, draggedY);
			const shipCoords = ship.coordinatesSnapshot;
			const thisX = Number.parseInt(cellEl.dataset.x, 10);
			const thisY = Number.parseInt(cellEl.dataset.y, 10);
			const isHorizontal = shipCoords[0][0] === shipCoords[shipCoords.length - 1][0];
			const [dx, dy] = isHorizontal ? [0, 1] : [1, 0];

			const success = selfBoard.rePlaceShip(ship, thisX, thisY, dx, dy);
			this.updateBoard(selfBoard.boardSnapshot, selfBoardEl);
		});

		selfBoardEl.addEventListener("dragend", () => {
			if (!this.#dragged) return;
			this.#dragged.removeAttribute("draggable");
			this.#dragged = null;
		});
		
	}

	createGhostCell(shipCoords, event) {
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

	get selfBoardEl() {
		return this.#selfBoardEl;
	}

	get opponentBoardEl() {
		return this.#opponentBoardEl;
	}
}
