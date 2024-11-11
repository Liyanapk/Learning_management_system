import mongoose from 'mongoose'





const testStudentSchema = new mongoose.Schema ({
    first_name : {
        type : String,
        required : true,
    },

    last_name : {
        type : String,
        required : true,
    },

    age : {
        type : Number,
        required : true,
    },

    email : {
        type : String,
        required : true,
    },
   
    phone_number : {
        type : Number,
        required : true,
    },

    profile_pic : {
        type : String,
        required : true,
    },

    gender : {
        type : String,
        enum : ['male','female','other'],
        required : true,
    },

    dob : {
        type : Date,
        required : true,
    },

    student_id : {
        type : String,
        unique :true,
        required : true,
    },

    status : {
        type : Boolean,
        required : true,
    },

    password : {
        type : String,
        required : true,
    },

    batch : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Batch', 
        required: true,
    }

}) 








const Student = mongoose.model ( 'Student' , testStudentSchema )
export default Student