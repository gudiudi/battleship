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

	renderBoard(gameBoard, boardEl) {}

	#createGrid(boardContainer, size) {
		for (let cell = 0; cell < size * size; cell++) {
			const x = Math.floor(cell / size);
			const y = cell % size;
			const cellEl = document.createElement("div");
			cellEl.classList.add("cell");
			cellEl.dataset.x = x;
			cellEl.dataset.y = y;
			boardContainer.appendChild(cellEl);
		}
	}

	#createBoardContainer(className) {
		const board = document.createElement("div");
		board.className = className;
		this.#appEl.appendChild(board);
		return board;
	}
}
