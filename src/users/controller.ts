import { JsonController, Post, Param, Get, Body, Authorized, HttpCode } from 'routing-controllers'
import User from './entity';
import {io} from '../index'

@JsonController()
export default class UserController {

  @Post('/users')
    @HttpCode(201)
    async signup(
      @Body() user: User
    ) {
      const {password, ...rest} = user
      const entity = User.create(rest)
      await entity.setPassword(password)
      await entity.save()
      const users = await User.find()
      io.emit('action', {
        type: 'UPDATE_USERS',
        payload: users
      })
      return entity
    }

  @Authorized()
  @Get('/users/:id([0-9]+)')
  getUser(
    @Param('id') id: number
  ) {
    return User.findOneById(id)
  }

  @Authorized()
  @Get('/users')
  allUsers() {
    return User.find()
  }
}
