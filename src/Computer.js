import Participant from "./Participant";

export default class Computer extends Participant {
	makeAttack(opponent) {
		let attacked = false;
		while (!attacked) {
			const x = Math.floor(Math.random() * this.boardSnapshot.length);
			const y = Math.floor(Math.random() * this.boardSnapshot.length);
			attacked = opponent.receiveAttack(x, y);
		}

		return attacked;
	}
}
