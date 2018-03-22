import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Board, emptyBoard} from './entities';

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {

  validate(board: Board) {
    return board.length === 10 &&
      board.every(row =>
        row.length === 10 &&
        row.every(value => typeof(value)==='string')
      )
  }
}

// start a game
// set maximium number of squares per ship here as well? (= define ships)
export const newGame = () => {
  return emptyBoard
}

// give a square a hit value to be able to change class for css styling
export const hit = (board: Board, x: number, y: number) => {
  board[x][y] += 'x'
  return board
}

// check if the hit is a ship and turn true if it is
export const isShip = (board: Board, x: number, y: number) => {
  const value = board[x][y]
  return !value.includes('0')
}

// check how many times a value is present in a row
export const numberOfValues = (row: string[], value: string) => {
  return row
    .filter(v => v === value)
    .length
}

// see if all of the ships squares have been hit
export const shipIsDestroyed = (board: Board, value: string, shiplength: number) => {
  const count = board
    .map(r => numberOfValues(r, value))
    .reduce((sum, i) => sum + i, 0)
  return (count === shiplength)
}

// one player won if all ships are destroyed
export const gameWon = (board: Board) => {
  return (shipIsDestroyed(board, '1x', 2) &&
      shipIsDestroyed(board, '2x', 3) &&
      shipIsDestroyed(board, '3x', 3) &&
      shipIsDestroyed(board, '4x', 4) &&
      shipIsDestroyed(board, '5x', 5)
    )
}

export const getGuessBoard = (board: Board): Board => {
  console.log('*************'+typeof(board))
  const guessBoard = board.map(row => row.map(
    value=> {
      if (['1x','2x','3x','4x','5x'].includes(value))
        return 's'
      if (value==='0x')
        return 'w'
      return '0'
    }
  ))
  return guessBoard
}
