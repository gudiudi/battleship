import { beforeEach, describe, expect, it } from "vitest";
import GameBoard from "../src/GameBoard";

describe("GameBoard", () => {
	let gameBoard;
	let ship;

	beforeEach(() => {
		gameBoard = new GameBoard(5);
		ship = { length: 3 };
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
		expect(gameBoard.board[0][0]).toBe(ship);
		expect(gameBoard.board[0][1]).toBe(ship);
		expect(gameBoard.board[0][2]).toBe(ship);
	});

	it("adds a ship vertically when dx=1, dy=0", () => {
		expect(gameBoard.add(ship, 0, 0, 1, 0)).toBe(true);
		expect(gameBoard.board[0][0]).toBe(ship);
		expect(gameBoard.board[1][0]).toBe(ship);
		expect(gameBoard.board[2][0]).toBe(ship);
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
});
