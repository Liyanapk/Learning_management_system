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

    department : {
        type : String,
        required:true,
    },

    status : {
        type : Boolean,
        required : true,
    },

    password : {
        type : String,
        required : true,
    },

    subject : {
        type : Schema.Types.objectId,
        ref : 'subject',
        required: true,
    }

})

const Teacher = mongoose.model ('Teacher' , testTeacherSchema )

export default Teacher