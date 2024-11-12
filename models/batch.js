import mongoose from 'mongoose'


const testBatchSchema = new mongoose.Schema ({
             
batch_name : {
    type : String,
    required : true,
},

teacher_incharge: {

    type: mongoose.Schema.Types.ObjectId, 
    ref: 'teacher',                
    required: true

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

}

)


const Batch = mongoose.model ('Batch', testBatchSchema)
export default Batch