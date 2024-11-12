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
        validate: {
            validator: function(val) {
                return /^\d{10}$/.test(val.toString());
            },
            message: "Phone number must be exactly 10 digits."
        }
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

  
    status : {
        type : Boolean,
        required : true,
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

    subject: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject', 
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
    timestamps: true
}

)

const Teacher = mongoose.model ('Teacher' , testTeacherSchema )

export default Teacher;