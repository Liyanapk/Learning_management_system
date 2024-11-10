import express from 'express';
import dotenv from "dotenv";
import router from './routes/v1/testAdmin.js'
import { dbconnect } from './configs/dbconfig.js';


dotenv.config()
const app = express()
const PORT = process.env.PORT || 4001



app.use (express.json())
app.use('/',router)
dbconnect()



app.use(express.static('uploads'));

app.listen (PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})