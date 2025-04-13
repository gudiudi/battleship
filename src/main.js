import GameBoard from "./GameBoard";
import Player from "./Player";
import Ship from "./Ship";

const gameBoard = new GameBoard();
const player = new Player(gameBoard);

const destroyer = new Ship(2);
player.placeShip(destroyer, 0, 0);

console.log(player.board);
