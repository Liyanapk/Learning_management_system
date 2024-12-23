import express from 'express';
import dotenv from "dotenv";
import adminrouter from './routes/v1/admin/adminRoutes.js'
import teacherrouter from './routes/v1/admin/teacherRoutes.js'
import subjectrouter from './routes/v1/admin/subjectRoutes.js'
import studentrouter from './routes/v1/admin/studentRoutes.js'
import batchrouter from './routes/v1/admin/batchRoutes.js'
import lecturerouter from './routes/v1/admin/lectureRoutes.js'
import questionrouter from './routes/v1/admin/questionRoute.js'
import assignmentrouter from './routes/v1/admin/assignmentRoutes.js'
import { dbconnect } from './configs/dbconfig.js';
import { errorMiddleware, notFound } from './middleware/errorMiddleware.js';
import { specs } from './swagger.js';
import swaggerUi from 'swagger-ui-express'
import cors from 'cors';


dotenv.config()
const app = express()
app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
  }));
  
const PORT = process.env.PORT

dbconnect()

app.use (express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.static('uploads'));

app.use('/api/v1/admin',adminrouter)
app.use('/api/v1/teacher',teacherrouter)
app.use('/api/v1/subject',subjectrouter)
app.use('/api/v1/student',studentrouter)
app.use('/api/v1/batch',batchrouter)
app.use('/api/v1/lecture',lecturerouter)
app.use('/api/v1/question',questionrouter)
app.use('/api/v1/assignment',assignmentrouter)


app.use(notFound)
app.use(errorMiddleware)


  



app.listen (PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})