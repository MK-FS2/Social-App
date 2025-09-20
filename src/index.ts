import dotenv from "dotenv"
import express, * as expressTypes from "express";
import Bootstrap from "./AppController";
dotenv.config()

const App = express()
Bootstrap(App)

App.listen(process.env.Port,():void=>{console.log(`Server is running as port ${process.env.Port}`)})
