"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board1 = [
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
];
const board2 = [
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
];
exports.newGame = () => {
    return [board1, board2];
};
exports.hit = (board, x, y) => {
    board[x][y] += 'x';
    return board;
};
exports.isShip = (board, x, y) => {
    const value = board[x][y];
    return !value.includes('0');
};
exports.numberOfValues = (row, value) => {
    return row
        .filter(v => v === value)
        .length;
};
exports.shipIsDestroyed = (board, value, shiplength) => {
    const count = board
        .map(r => exports.numberOfValues(r, value))
        .reduce((sum, i) => sum + i, 0);
    return (count === shiplength);
};
exports.gameWon = (board) => {
    return (exports.shipIsDestroyed(board, '1x', 2) &&
        exports.shipIsDestroyed(board, '2x', 3) &&
        exports.shipIsDestroyed(board, '3x', 3) &&
        exports.shipIsDestroyed(board, '4x', 4) &&
        exports.shipIsDestroyed(board, '5x', 5));
};
//# sourceMappingURL=gameLogic.js.map