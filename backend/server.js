import app from './src/app.js';
import dotenv from 'dotenv'
dotenv.config()
import DatabaseConnect from './src/config/database.js'
DatabaseConnect()

app.listen(3000,()=>{
    console.log("server is runnig")
})