import express from 'express'
// __dirname
import path from 'path'
import { config } from 'dotenv'
config({ path: path.resolve('config/config.env') })
// console.log(path.resolve('config/config.env'));
import initApp from './src/utils/initiateApp.js'

const app = express()
initApp(app, express)