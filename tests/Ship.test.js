import { beforeEach, describe, expect, it } from "vitest";
import Ship from "../src/Ship";

describe("Ship", () => {
	let ship;

	it("throws error for invalid length", () => {
		expect(() => new Ship(0)).toThrow();
		expect(() => new Ship(-1)).toThrow();
		expect(() => new Ship("3")).toThrow();
	});

	describe("Valid Ship", () => {
		beforeEach(() => {
			ship = new Ship(3);
		});

		it("tracks hits without exceeding length", () => {
			ship.hit();
			ship.hit();
			expect(ship.hits).toBe(2);

			// Try to over-hit
			ship.hit();
			ship.hit();
			expect(ship.hits).toBe(3);
		});

		it("isn't sunk when hits < length", () => {
			ship.hit();
			expect(ship.isSunk).toBe(false);
		});

		it("becomes sunk when hits >= length", () => {
			for (let i = 0; i < 3; i++) ship.hit();
			expect(ship.isSunk).toBe(true);
		});

		it("prevents hitting sunk ships", () => {
			for (let i = 0; i < 5; i++) ship.hit();
			expect(ship.hits).toBe(3);
		});
	});
});
