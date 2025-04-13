import Participant from "./Participant";

export default class Player extends Participant {
	makeAttack(opponent, x, y) {
		return opponent.receiveAttack(x, y);
	}
}
