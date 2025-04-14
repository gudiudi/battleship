import Participant from "./Participant";

export default class Computer extends Participant {
	placeShip(ship) {
		let placed = false;
		while (!placed) {
			const cells = this.#getEmptyCells();
			if (cells.length < 1) return false;

			const [x, y] = cells[Math.floor(Math.random() * cells.length)];
			const isHorizontal = Math.random() < 0.5;
			const dx = isHorizontal ? 0 : 1;
			const dy = isHorizontal ? 1 : 0;

			placed = super.placeShip(ship, x, y, dx, dy);
		}

		return placed;
	}

	makeAttack(opponent) {
		let attacked = false;
		while (!attacked) {
			const x = Math.floor(Math.random() * this.boardSnapshot.length);
			const y = Math.floor(Math.random() * this.boardSnapshot.length);
			attacked = opponent.receiveAttack(x, y);
		}

		return attacked;
	}

	#getEmptyCells() {
		const cells = [];
		for (const [x, row] of this.boardSnapshot.entries()) {
			for (const [y, cell] of row.entries()) {
				if (cell) continue;
				cells.push([x, y]);
			}
		}

		return cells;
	}
}
