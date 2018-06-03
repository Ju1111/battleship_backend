import {
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get,
  Body, Patch
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Player } from './entities'
import {getGuessBoard, hit, gameWon, gameToSend} from './gameLogic'
//import { Validate } from 'class-validator'
import {io} from '../index'

// class GameUpdate {
//   @Validate(IsBoard, {
//     message: 'Not a valid board'
//   })
//   board: Board
// }

@JsonController()
export default class GameController {

  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    @CurrentUser() user: User
  ) {
    const entity = await Game.create().save()

    await Player.create({
      game: entity,
      user,
      symbol: '1'
    }).save()

    const game = await Game.findOneById(entity.id)
    if (!game) throw new BadRequestError(`Game does not exist`)

    io.emit('action', {
      type: 'ADD_GAME',
      payload: game  //It doesn't matter to sent game as boards are still empty
    })

    return {board:game.board1 , guessBoard:game.board2}
  }


  @Authorized()
  @Post('/games/:id([0-9]+)/players')
  @HttpCode(201)
  async joinGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new BadRequestError(`Game does not exist`)
    if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

    //we only need two players so we set the status to started as soon as another player join a pending game
    game.status = 'started'
    await game.save()

    await Player.create({
      game,
      user,
      symbol: '2'
    }).save()

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: gameToSend(game)
    })

    return {board:game.board2, guessBoard:game.board1}
  }

  @Authorized()
  @Get('/games/:id([0-9]+)')
  async getGame(
    @CurrentUser() user: User,
    @Param('id') id: number
  ) {
    const game = await Game.findOneById(id)
    if (!game) throw new BadRequestError(`Game does not exist`)

    const player = await Player.findOne({ user, game })
    if (!player)
      throw new ForbiddenError('User not playing in the game')
    if (player.symbol==='1')
      return {
          board: game.board1
        }

    if (player.symbol==='2')
      return {
          board: game.board2
        }
  }

  @Authorized()
  @Get('/games')
  async getGames(
  ) {
    let games = await Game.find()
    return games.map(game => gameToSend(game))
  }

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch('/games/:id([0-9]+)')
  async updateGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    @Body() update: {x,y,board}
  ) {

    const game = await Game.findOneById(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)

    const player = await Player.findOne({ user, game })

    if (!player) throw new ForbiddenError(`You are not part of this game`)
    if (game.status !== 'started') throw new BadRequestError(`The game is not started yet`)

    if (game.p1ready && game.p2ready){
      if (player.symbol !== game.turn) throw new BadRequestError(`It's not your turn`)
      switch(player.symbol){
        case '1':
          //console.log(update.x)
          game.board2 = hit (game.board2, update.x, update.y)
          if(gameWon(game.board2)) {
            game.winner='1'
            game.status='finished'
          }
          else {
            game.turn = '2'
          }
          break

        case '2':
          game.board1 = hit (game.board1, update.x, update.y)
          if(gameWon(game.board1)) {
            game.winner='2'
            game.status='finished'
          }
          else {
            game.turn = '1'
          }
          break

        default:
          break
      }
    }

    if (player.symbol==='1' && !game.p1ready) {
      //console.log('1111111111111111')
      game.board1 = update.board
      game.p1ready= true
    }

    if (player.symbol==='2' && !game.p2ready) {
      //console.log('22222222222222222')
      game.board2 = update.board
      game.p2ready= true
    }

    //console.log(game)
    await game.save()

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: gameToSend(game)
    })


    return {
      message: 'Game successfully updated'
    }
  }
}
