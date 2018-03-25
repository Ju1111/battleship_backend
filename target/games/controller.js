"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const entity_1 = require("../users/entity");
const entities_1 = require("./entities");
const gameLogic_1 = require("./gameLogic");
const index_1 = require("../index");
let GameController = class GameController {
    async createGame(user) {
        const entity = await entities_1.Game.create().save();
        await entities_1.Player.create({
            game: entity,
            user,
            symbol: '1'
        }).save();
        const game = await entities_1.Game.findOneById(entity.id);
        if (!game)
            throw new routing_controllers_1.BadRequestError(`Game does not exist`);
        index_1.io.emit('action', {
            type: 'ADD_GAME',
            payload: game
        });
        return { board: game.board1, guessBoard: game.board2 };
    }
    async joinGame(user, gameId) {
        const game = await entities_1.Game.findOneById(gameId);
        if (!game)
            throw new routing_controllers_1.BadRequestError(`Game does not exist`);
        if (game.status !== 'pending')
            throw new routing_controllers_1.BadRequestError(`Game is already started`);
        game.status = 'started';
        await game.save();
        await entities_1.Player.create({
            game,
            user,
            symbol: '2'
        }).save();
        index_1.io.emit('action', {
            type: 'UPDATE_GAME',
            payload: gameLogic_1.gameToSend(game)
        });
        return { board: game.board2, guessBoard: game.board1 };
    }
    async getGame(user, id) {
        const game = await entities_1.Game.findOneById(id);
        if (!game)
            throw new routing_controllers_1.BadRequestError(`Game does not exist`);
        const toSend = gameLogic_1.gameToSend(game);
        const player = await entities_1.Player.findOne({ user, game });
        if (!player)
            return {
                game: toSend
            };
        if (player.symbol === '1')
            return {
                game: toSend,
                boards: {
                    board: game.board1,
                    guessBoard: toSend.board2
                }
            };
        if (player.symbol === '2')
            return {
                game: gameLogic_1.gameToSend(game),
                boards: {
                    board: game.board2,
                    guessBoard: toSend.board1
                }
            };
    }
    async getGames() {
        let games = await entities_1.Game.find();
        return games.map(game => gameLogic_1.gameToSend(game));
    }
    async updateGame(user, gameId, update) {
        let up;
        if (update.board) {
            up = JSON.parse(update.board);
        }
        const game = await entities_1.Game.findOneById(gameId);
        if (!game)
            throw new routing_controllers_1.NotFoundError(`Game does not exist`);
        const player = await entities_1.Player.findOne({ user, game });
        if (!player)
            throw new routing_controllers_1.ForbiddenError(`You are not part of this game`);
        if (game.status !== 'started')
            throw new routing_controllers_1.BadRequestError(`The game is not started yet`);
        if (game.p1ready && game.p2ready) {
            if (player.symbol !== game.turn)
                throw new routing_controllers_1.BadRequestError(`It's not your turn`);
            switch (player.symbol) {
                case '1':
                    game.board2 = gameLogic_1.hit(game.board2, update.x, update.y);
                    if (gameLogic_1.gameWon(game.board2)) {
                        game.winner = '1';
                        game.status = 'finished';
                    }
                    else {
                        game.turn = '2';
                    }
                    break;
                case '2':
                    game.board1 = gameLogic_1.hit(game.board1, update.x, update.y);
                    if (gameLogic_1.gameWon(game.board1)) {
                        game.winner = '2';
                        game.status = 'finished';
                    }
                    else {
                        game.turn = '1';
                    }
                    break;
                default:
                    break;
            }
        }
        if (player.symbol === '1' && !game.p1ready) {
            game.board1 = up;
            game.p1ready = true;
        }
        if (player.symbol === '2' && !game.p2ready) {
            game.board2 = up;
            game.p2ready = true;
        }
        console.log(game);
        await game.save();
        index_1.io.emit('action', {
            type: 'UPDATE_GAME',
            payload: gameLogic_1.gameToSend(game)
        });
        if (player.symbol === '1') {
            return { board: game.board1, guessBoard: gameLogic_1.getGuessBoard(game.board2) };
        }
        if (player.symbol === '2') {
            return { board: game.board2, guessBoard: gameLogic_1.getGuessBoard(game.board1) };
        }
    }
};
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/games'),
    routing_controllers_1.HttpCode(201),
    __param(0, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.default]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "createGame", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/games/:id([0-9]+)/players'),
    routing_controllers_1.HttpCode(201),
    __param(0, routing_controllers_1.CurrentUser()),
    __param(1, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.default, Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "joinGame", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/games/:id([0-9]+)'),
    __param(0, routing_controllers_1.CurrentUser()),
    __param(1, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.default, Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getGame", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/games'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getGames", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Patch('/games/:id([0-9]+)'),
    __param(0, routing_controllers_1.CurrentUser()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.default, Number, Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "updateGame", null);
GameController = __decorate([
    routing_controllers_1.JsonController()
], GameController);
exports.default = GameController;
//# sourceMappingURL=controller.js.map