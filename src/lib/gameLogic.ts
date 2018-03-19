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
]

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
]

// start a game
// set maximium number of squares per ship here as well? (= define ships)
export const newGame = () => {
  return [board1, board2]
}

// give a square a hit value to be able to change class for css styling
export const hit = (board, x, y) => {
  board[x][y] += 'x'
  return board
}

// check if the hit is a ship and turn true if it is
export const isShip = (board, x, y) => {
  const value = board[x][y]
  return !value.includes('0')
}

// check how many times a value is present in a row
export const numberOfValues = (row, value) => {
  return row
    .filter(v => v === value)
    .length
}

// see if all of the ships squares have been hit
export const shipIsDestroyed = (board, value, shiplength) => {
  const count = board
    .map(r => numberOfValues(r, value))
    .reduce((sum, i) => sum + i, 0)
  return (count === shiplength)
}

// one player won if all ships are destroyed
export const gameWon = () => {

}
