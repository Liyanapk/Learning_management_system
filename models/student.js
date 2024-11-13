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
        validate: {
            validator: function(val) {
                return /^\d{10}$/.test(val.toString());
            },
            message: "Phone number must be exactly 10 digits."
        }
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
    },


    isDeleted: {

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