import express from 'express';
import dotenv from "dotenv";
import adminrouter from './routes/v1/testAdmin.js'
import teacherrouter from './routes/v1/testTeacher.js'
import subjectrouter from './routes/v1/testSubject.js'
import studentrouter from './routes/v1/testStudent.js'
import batchrouter from './routes/v1/testBatch.js'
import lecturerouter from './routes/v1/testLecture.js'
import { dbconnect } from './configs/dbconfig.js';


dotenv.config()
const app = express()
const PORT = process.env.PORT || 4001



app.use (express.json())
app.use('/',adminrouter)
app.use('/',teacherrouter)
app.use('/',subjectrouter)
app.use('/',studentrouter)
app.use('/',batchrouter)
app.use('/',lecturerouter)
dbconnect()


  

app.use(express.static('uploads'));

app.listen (PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})