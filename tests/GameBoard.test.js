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
			sunk: vi.fn(() => ship.hits >= ship.length),
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
		expect(gameBoard.place(ship, 0, 0)).toBe(true);
		expect(gameBoard.board[0][0]).not.toBeNull();
		expect(gameBoard.board[0][1]).not.toBeNull();
		expect(gameBoard.board[0][2]).not.toBeNull();
	});

	it("adds a ship vertically when dx=1, dy=0", () => {
		expect(gameBoard.place(ship, 0, 0, 1, 0)).toBe(true);
		expect(gameBoard.board[0][0]).not.toBeNull();
		expect(gameBoard.board[1][0]).not.toBeNull();
		expect(gameBoard.board[2][0]).not.toBeNull();
	});

	it("fails to add a ship out of bounds", () => {
		expect(gameBoard.place(ship, 9, 8)).toBe(false);
		expect(gameBoard.place(ship, 9, 8, 1, 0)).toBe(false);
	});

	it("fails to place ship if space is already occupied", () => {
		const ship2 = { length: 2 };

		gameBoard.place(ship2, 0, 0);
		expect(gameBoard.place(ship, 0, 0)).toBe(false);
	});

	it("should mark the ship as hit and prevent multiple attacks on the same spot", () => {
		gameBoard.place(ship, 0, 0);
		gameBoard.hit(0, 0);
		expect(gameBoard.board[0][0].hit).toBe(true);
		expect(gameBoard.hit(0, 0)).toBe(false);
	});

	it("can't hit null coordinate", () => {
		gameBoard.place(ship, 3, 1);
		expect(gameBoard.hit(3, 4)).toBe(false);
		expect(gameBoard.hit(3, 0)).toBe(false);
		expect(gameBoard.hit(4, 1)).toBe(false);
	});

	it("returns true when all ships have been sunk", () => {
		const ship2 = {
			length: 2,
			hits: 0,
			hit: vi.fn(() => ship2.hits++),
			sunk: vi.fn(() => ship2.hits >= ship2.length),
		};

		expect(gameBoard.place(ship, 0, 0, 0, 1)).toBe(true);
		expect(gameBoard.place(ship2, 1, 0, 1, 0)).toBe(true);

		expect(gameBoard.hit(0, 0)).toBe(true);
		expect(gameBoard.hit(0, 1)).toBe(true);
		expect(gameBoard.hit(0, 2)).toBe(true);

		expect(gameBoard.lost()).toBe(false);

		expect(gameBoard.hit(1, 0)).toBe(true);
		expect(gameBoard.hit(2, 0)).toBe(true);

		expect(gameBoard.lost()).toBe(true);
	});
});
