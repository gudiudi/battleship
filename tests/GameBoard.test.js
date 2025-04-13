import { beforeEach, describe, expect, it, vi } from "vitest";
import GameBoard from "../src/GameBoard";

describe("GameBoard", () => {
	let gameBoard;
	let ship;

	beforeEach(() => {
		gameBoard = new GameBoard(5);
		ship = {
			length: 3,
			hits: 0,
			hit: vi.fn(() => ship.hits++),
			isSunk: vi.fn(() => ship.hits >= ship.length),
		};
	});

	it("initializes an empty board of given size", () => {
		expect(gameBoard.board).toEqual([
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null],
		]);
	});

	it("adds a ship horizontally by default (dx=0, dy=1)", () => {
		expect(gameBoard.add(ship, 0, 0)).toBe(true);
		expect(gameBoard.board[0][0]).not.toBeNull();
		expect(gameBoard.board[0][1]).not.toBeNull();
		expect(gameBoard.board[0][2]).not.toBeNull();
	});

	it("adds a ship vertically when dx=1, dy=0", () => {
		expect(gameBoard.add(ship, 0, 0, 1, 0)).toBe(true);
		expect(gameBoard.board[0][0]).not.toBeNull();
		expect(gameBoard.board[1][0]).not.toBeNull();
		expect(gameBoard.board[2][0]).not.toBeNull();
	});

	it("fails to add a ship out of bounds", () => {
		expect(gameBoard.add(ship, 9, 8)).toBe(false);
		expect(gameBoard.add(ship, 9, 8, 1, 0)).toBe(false);
	});

	it("fails to place ship if space is already occupied", () => {
		const ship2 = { length: 2 };

		gameBoard.add(ship2, 0, 0);
		expect(gameBoard.add(ship, 0, 0)).toBe(false);
	});

	it("should mark the ship as hit and prevent multiple attacks on the same spot", () => {
		gameBoard.add(ship, 0, 0);
		gameBoard.attack(0, 0);
		expect(gameBoard.board[0][0].hit).toBe(true);
		expect(gameBoard.attack(0, 0)).toBe(false);
	});

	it("can't hit null coordinate", () => {
		gameBoard.add(ship, 3, 1);
		expect(gameBoard.attack(3, 4)).toBe(false);
		expect(gameBoard.attack(3, 0)).toBe(false);
		expect(gameBoard.attack(4, 1)).toBe(false);
	});
});
