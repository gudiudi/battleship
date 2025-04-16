import Participant from "./Participant";

export default class Computer extends Participant {
	makeAttack(opponent) {
		const cells = this.#getUnhittedCells(opponent.boardSnapshot);
		if (cells.length === 0) return null;

		const [x, y] = cells[Math.floor(Math.random() * cells.length)];
		const attack = opponent.receiveAttack(x, y);
		return attack;
	}

	#getUnhittedCells(snapshot) {
		const cells = [];
		for (const [x, row] of snapshot.entries()) {
			for (const [y, cell] of row.entries()) {
				if (cell?.hit) continue;
				cells.push([x, y]);
			}
		}

		return cells;
	}
}
