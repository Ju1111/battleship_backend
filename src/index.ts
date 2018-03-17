import * as express from 'express'

const app = express()

app
  .get('/users/:id([0-9]+)', (req, res) => {
    const userId: string = req.params.id
    if (Number(userId) === 123) {
      res.send({
        name: 'Jan Klaassen',
        age: 60
      })
    }
    else {
      res.status(404).send(`User ${userId} not found!`)
    }
  })
  .listen(12345, () => console.log('Listening on port 12345'))
