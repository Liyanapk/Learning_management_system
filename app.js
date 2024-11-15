import express from 'express';
import dotenv from "dotenv";
import adminrouter from './routes/v1/admin/adminRoutes.js'
import teacherrouter from './routes/v1/admin/teacherRoutes.js'
import subjectrouter from './routes/v1/admin/subjectRoutes.js'
import studentrouter from './routes/v1/admin/studentRoutes.js'
import batchrouter from './routes/v1/admin/batchRoutes.js'
import lecturerouter from './routes/v1/admin/lectureRoutes.js'
import { dbconnect } from './configs/dbconfig.js';
import { errorMiddleware, notFound } from './middleware/errorMiddleware.js';
import { specs } from './swagger.js';
import swaggerUi from 'swagger-ui-express'


dotenv.config()
const app = express()
const PORT = process.env.PORT || 4001

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

app.use(notFound)
app.use(errorMiddleware)


  



app.listen (PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})