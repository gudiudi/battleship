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
}
