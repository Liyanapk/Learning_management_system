import mongoose from 'mongoose'




const testAdminSchema = new mongoose.Schema ({

    
    first_name :{
        type : String,
        required : true,
    },


    last_name :{
        type : String,
        required : true,
    },


    email :{
        type : String,
        required : true,
    },


    age :{
        type : Number,
        required : true,
    },


    dob : {
        type : Date,
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

    profile_pic :{
        type : String,
        default:null,
    },


    role: {
        type:String,
        enum: ['superadmin', 'admin'],
        required: true
    },

    status: {
        type: String,
        enum: ['active', 'resigned'],
        required: true
    },

    password: {
        type: String,
        required: true,
        validate: {
            validator: function(val) {
                return /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/.test(val);
            },
            message: "Password must be at least 6 characters long and include at least one special character"
        }
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

    timestamps: true
    
}

)



const Admin = mongoose.model ( 'Admin', testAdminSchema )
export default Admin