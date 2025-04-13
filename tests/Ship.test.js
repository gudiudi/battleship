import { beforeEach, describe, expect, it } from "vitest";
import Ship from "../src/Ship";

describe("Ship", () => {
	let ship;

	beforeEach(() => {
		ship = new Ship(8);
	});

	it("Increase the number of hits by 1", () => {
		ship.hit();
		expect(ship.hits).toBe(1);
	});

	it("Ship should not be sunk if hits are less than length", () => {
		for (let i = 0; i < ship.length - 1; i++) {
			ship.hit();
		}
		expect(ship.sunk()).toBe(false);
	});

	it("Sunk the ship after enough hits", () => {
		for (let i = 0; i < ship.length; i++) {
			ship.hit();
		}
		expect(ship.sunk()).toBe(true);
	});
});
