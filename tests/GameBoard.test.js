import { beforeEach, describe, expect, it } from "vitest";
import GameBoard from "../src/GameBoard";
import Ship from "../src/Ship";

describe("GameBoard", () => {
	let gameBoard;
	let ship;

	beforeEach(() => {
		gameBoard = new GameBoard(5);
		ship = new Ship(3);
	});

	it("initializes empty board", () => {
		expect(gameBoard.boardSnapshot).toEqual(
			Array(5)
				.fill()
				.map(() => Array(5).fill(null)),
		);
	});

	it("places ships horizontally", () => {
		expect(gameBoard.place(ship, 0, 0)).toBe(true);
		for (let i = 0; i < ship.length; i++) {
			expect(gameBoard.boardSnapshot[0][i]).toEqual({ ship, hit: false });
		}
	});

	it("places ships vertically", () => {
		expect(gameBoard.place(ship, 0, 0, 1, 0)).toBe(true);
		for (let i = 0; i < ship.length; i++) {
			expect(gameBoard.boardSnapshot[i][0]).toEqual({ ship, hit: false });
		}
	});

	it("rejects invalid placements", () => {
		// Out of bounds
		expect(gameBoard.place(ship, 3, 3, 1, 0)).toBe(false);

		// Diagonal
		expect(gameBoard.place(ship, 0, 0, 1, 1)).toBe(false);

		// Overlapping
		gameBoard.place(new Ship(2), 0, 0);
		expect(gameBoard.place(ship, 0, 0)).toBe(false);
	});

	it("processes valid attacks", () => {
		gameBoard.place(ship, 0, 0);
		expect(gameBoard.receiveAttack(0, 0)).toBe(true);
		expect(gameBoard.boardSnapshot[0][0].hit).toBe(true);
	});

	it("rejects invalid attacks", () => {
		// Empty cell
		expect(gameBoard.receiveAttack(0, 0)).toBe(false);

		// Double attack
		gameBoard.place(ship, 1, 1);
		gameBoard.receiveAttack(1, 1);
		expect(gameBoard.receiveAttack(1, 1)).toBe(false);
	});

	it("tracks sunk ships", () => {
		const ship2 = new Ship(2);
		gameBoard.place(ship, 0, 0);
		gameBoard.place(ship2, 1, 1);

		// Sink first ship
		gameBoard.receiveAttack(0, 0);
		gameBoard.receiveAttack(0, 1);
		gameBoard.receiveAttack(0, 2);

		// Sink second ship
		gameBoard.receiveAttack(1, 1);
		gameBoard.receiveAttack(1, 2);

		expect(gameBoard.areAllShipsSunk).toBe(true);
	});
});
