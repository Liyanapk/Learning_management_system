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
   
    phone: {
        type: Number,
        required: true,
        
    },
    parent_name:{
        type: String,
        required: true,

    },
    parent_number:{
        type: Number,
        required: true,

    },
    profile_pic : {
        type : String,
        default: null,
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
        // unique :true,
        required : true,
    },

    status : {
        type : String,
        enum:['active','inactive','terminated'],
        required : true,
    },

    
    address:{
        type : String,
        required : true,
    },
    in_charge: {
    
     type: mongoose.Schema.Types.ObjectId,
         ref: 'Teacher'
         },
         password: {
            type: String,
            required: true,
        },        

    is_deleted: {

        status: { 
            type: Boolean ,
            default:false
        },

        deleted_by: { 
            type: mongoose.Schema.Types.ObjectId ,
            ref: 'admin',
            default: null
        },

        deleted_at: {
            type: Date,
            default: null
        },

    }


}, {

    timestamps:true





}) 








const Student = mongoose.model ( 'Student' , testStudentSchema )
export default Student