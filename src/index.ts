import dotenv from "dotenv"
import express, * as expressTypes from "express";
import Bootstrap from "./AppController";
import InitiateSocket from "./Socket";
dotenv.config()

const App = express()
Bootstrap(App)

const server = App.listen(process.env.Port,():void=>{console.log(`Server is running as port ${process.env.Port}`)})

export const io = InitiateSocket(server)