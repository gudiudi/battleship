import Participant from "./Participant";

export default class Computer extends Participant {
	makeAttack(opponent) {
		const cells = this.getUnhittedCells();
		if (cells.length === 0) return null;

		const [x, y] = cells[Math.floor(Math.random() * cells.length)];
		const attack = opponent.receiveAttack(x, y);
		return attack;
	}
}
