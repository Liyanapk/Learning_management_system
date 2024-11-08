import express from 'express';
import dotenv from "dotenv";
import { dbconnect } from './configuration/config.js';


const app = express()
const PORT = process.env.PORT || 5001
dotenv.config()


app.use (express.json())

dbconnect()

app.listen (PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})