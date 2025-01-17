import mongoose from 'mongoose'


const assignmentSchema = new mongoose.Schema({



    participants:{

        status:{
            type:String,
            enum:['pending','complete'],
            required:true
        },
        attachement:{
            type:[String],
            required:true
        },
        students:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required:true,
        },

    },

    status:{
        type:String,
        enum:['active','inactive'],
        required:true
    },
    lecture:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required:true,
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required:true,
    },
        

    updated_by:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default:null,
    },

    last_date :{
    type:Date,
     required:true,

    },
    questions:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Question',
    required:true,

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
    
    timestamps:true
    
    }
    
    )

const Assignment = mongoose.model('Assigment',assignmentSchema)
export default Assignment