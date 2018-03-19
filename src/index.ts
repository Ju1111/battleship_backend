import 'reflect-metadata'
import {createKoaServer} from "routing-controllers"
import UserController from './users/controller'
// import Controller from "./controller"
import setupDb from './db'


const app = createKoaServer({
   controllers: [UserController]
})

setupDb()
  .then(_ =>
    app.listen(4000, () => console.log('Listening on port 4000'))
  )
  .catch(err => console.error(err))
