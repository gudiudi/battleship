export default class UI {
	#appEl;
	#selfBoardEl;
	#opponentBoardEl;
	#dragged;

	constructor() {
		this.#appEl = document.getElementById("app");
		this.#dragged;
	}

	init(size = 10) {
		this.#selfBoardEl = this.#createBoardContainer("self");
		this.#opponentBoardEl = this.#createBoardContainer("opponent", true);
		this.#createGrid(this.#selfBoardEl, size);
		this.#createGrid(this.#opponentBoardEl, size);
	}

	updateBoard(gameBoard, boardEl, hideShips = false) {
		this.#clearCellsState(boardEl);

		for (const [x, row] of gameBoard.entries()) {
			for (const [y, cell] of row.entries()) {
				const cellEl = boardEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
				if (cell?.hit) {
					cellEl.classList.add(cell.ship ? "hit" : "miss");
				} else if (!hideShips && cell?.ship) {
					cellEl.setAttribute("draggable", "true");
					cellEl.classList.add("ship");
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

	bindDragAndDropHandlers(boardEl, fleetSnapshot) {
		for (const ship of fleetSnapshot) {
			for (const [x, y] of ship.coordinatesSnapshot) {
				const shipEl = boardEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
				console.log(shipEl);
				this.#dragstart(shipEl, ship.coordinatesSnapshot);
			}
		}
	}

	#dragstart(shipEl, shipCoords) {
		shipEl.addEventListener("dragstart", (event) => {
			this.#createGhostCell(shipCoords, event);

			this.#dragged = event.target;
			event.target.classList.add("dragging");
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

	get selfBoardEl() {
		return this.#selfBoardEl;
	}

	get opponentBoardEl() {
		return this.#opponentBoardEl;
	}
}
