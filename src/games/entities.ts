import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Symbol = '1'|'2'
export type Row = [ string , string ,string ,string ,string ,string ,string ,string ,string ,string]
export type Board = [ Row, Row, Row, Row, Row, Row,Row, Row, Row, Row]

type Status = 'pending' | 'started' | 'finished'

//const emptyRow: Row = [null, null, null]
export const emptyBoard: Board = [
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0'],
  ['0','0','0','0','0','0','0','0','0','0']
]

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', {default: emptyBoard})
  board1: Board

  @Column('json', {default: emptyBoard})
  board2: Board

  @Column('boolean', {default: false})
  p1ready: boolean

  @Column('boolean', {default: false})
  p2ready: boolean

  @Column('char', {length:1, default: '1'})
  turn: Symbol

  @Column('text', {default: 'pending'})
  status: Status



  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]
}

@Entity()
@Index(['game', 'user'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @Column()
  userId: number
}
