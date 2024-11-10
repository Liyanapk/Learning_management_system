import mongoose from 'mongoose'




const testAdminSchema = new mongoose.Schema ({
    first_name :{
        type : String,
        required : true
    },
    last_name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    age :{
        type : Number,
        required : true
    },
    phone_number :{
        type : Number,
        required : true
    },
    profile_pic :{
        type : String,
        default : null,
    },
    status :{
        type : Boolean,
        required : true
    },
    password :{
        type : String,
        required : true
    },

})



const Admin = mongoose.model ( 'Admin', testAdminSchema )
export default Admin