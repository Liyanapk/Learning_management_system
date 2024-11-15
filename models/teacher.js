import mongoose from 'mongoose'


  

const testTeacherSchema = new mongoose.Schema ( {

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
    dob : {
        type : Date,
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
    profile_pic : {
        type : String,
        default:null,
    },

    gender : {
        type : String,
        enum : ['male','female','other'],
        required : true,
    },

  
    status : {
        type : String,
        enum:['active','resigned','terminated' ,'on_leave'],
        required : true,
    },
    
    address:{
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: true,
    },

    subject: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject', 
        required: true,
    },


    
    is_deleted: {

        status: { 
            type: Boolean ,
            default:false
        },

        deleted_by: { 
            type: mongoose.Schema.Types.ObjectId ,
            ref: 'Admin',
            default: null
        },

        deleted_at: {
            type: Date,
            default: null
        },

    }

}, {
    timestamps: true
}

)

const Teacher = mongoose.model ('Teacher' , testTeacherSchema )

export default Teacher;