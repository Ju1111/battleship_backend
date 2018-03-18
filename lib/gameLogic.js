// fill the board with squares
module.exports.fillBoard

// return value of square
module.exports.squareValues = (rowOrCol, value) => {
  return rowOrCol
    .filter(v => v === value)
    .length
}

// count if all ships are placed -> board needs to have certain values
module.exports.areShipsPlaced = (board) => {
  return board
    .reduce((sum, row) => sum + this.numberOfValues(row, 1), 0) === 2
    .reduce((sum, row) => sum + this.numberOfValues(row, 2), 0) === 3
    .reduce((sum, row) => sum + this.numberOfValues(row, 3), 0) === 3
    .reduce((sum, row) => sum + this.numberOfValues(row, 4), 0) === 4
    .reduce((sum, row) => sum + this.numberOfValues(row, 5), 0) === 5
}

// ship has to be one line --> do something like the threeOrMoreInARow function?

module.exports.threeOrMoreInARow = (rowOrCol) => {
  const counts = rowOrCol
    .join('')
    .match(/([1-2]|0)\1*/g) || []
  //console.log(counts);

  const matches = []
    .concat
    .apply([], counts.map((m, i) =>
      new Array(m.length).fill(m.match(/0/) ? null : m.length)
    ))
    .map((l, i) => (l > 2 ? i : null))
    .filter((l) => (l !== null))
  return matches
  // const str = rowOrCol.join('')
  // const one = str.indexOf('111')
  // const two = str.indexOf('222')
  // if (one>-1)
  //   return ([one,one+1,one+2])
  // else if (two>-1)
  //   return ([two,two+1,two+2])
  // else
  //   return []
}
// or something like this:
module.exports.shipPlacementAllowed = (rowOrCol, value) => {
  if (this.numberOfValues(rowOrCol, value) < (rowOrCol.length/2))
    return true
  return false
}

// Return coordinates of filled (non-zero) positions on the board. Each position
// described as an array of the form [rowIndex, colIndex].
module.exports.filledPositions = (board) => {
  const pos = board.map((row, rowIndex) => {
    return row
      .map((col, colIndex) => (col === 0 ? null : [rowIndex, colIndex]))
      .filter(pos => pos !== null)
  })
  return [].concat.apply([], pos)
}
