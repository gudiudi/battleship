export default class UI {
	#appEl;
	#selfBoardEl;
	#opponentBoardEl;

	constructor() {
		this.#appEl = document.getElementById("app");
	}

	init(size = 10) {
		this.#selfBoardEl = this.#createBoardContainer("self");
		this.#opponentBoardEl = this.#createBoardContainer("opponent", true);
		this.#createGrid(this.#selfBoardEl, size);
		this.#createGrid(this.#opponentBoardEl, size);
	}

	updateBoard(gameBoard, boardEl, hideShips = false) {
		gameBoard.forEach((row, x) => {
			row.forEach((cell, y) => {
				const cellEl = boardEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
				if (cell?.hit) {
					cellEl.classList.add(cell.ship ? "hit" : "miss");
				} else if (!hideShips && cell?.ship) {
					cellEl.classList.add("ship");
				}
			});
		});
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

	get selfBoardEl() {
		return this.#selfBoardEl;
	}

	get opponentBoardEl() {
		return this.#opponentBoardEl;
	}
}
