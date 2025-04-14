export default class UI {
	#appEl;
	#playerBoardEl;
	#computerBoardEl;

	constructor() {
		this.#appEl = document.getElementById("app");
	}

	init(size = 10) {
		this.#playerBoardEl = this.#createBoardContainer("board");
		this.#computerBoardEl = this.#createBoardContainer("board");
		this.#createGrid(this.#playerBoardEl, size);
		this.#createGrid(this.#computerBoardEl, size);
	}

	updateBoard(gameBoard, boardEl, revealShips = false) {
		gameBoard.forEach((row, x) => {
			row.forEach((cell, y) => {
				const cellEl = boardEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
				if (cell?.hit) {
					cellEl.classList.add(cell.ship ? "hit" : "miss"); // check with board logic not this!
				} else if (revealShips && cell?.ship) {
					cellEl.classList.add("ship");
				}
			});
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

	#createBoardContainer(className) {
		const board = document.createElement("div");
		board.className = className;
		this.#appEl.appendChild(board);
		return board;
	}

	get playerBoardEl() {
		return this.#playerBoardEl;
	}

	get computerBoardEl() {
		return this.#computerBoardEl;
	}
}
