"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const entities_1 = require("./entities");
let IsBoard = class IsBoard {
    validate(board) {
        return board.length === 10 &&
            board.every(row => row.length === 10 &&
                row.every(value => typeof (value) === 'string'));
    }
};
IsBoard = __decorate([
    class_validator_1.ValidatorConstraint()
], IsBoard);
exports.IsBoard = IsBoard;
exports.newGame = () => {
    return entities_1.emptyBoard;
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