import mongoose from 'mongoose'


const testBatchSchema = new mongoose.Schema ({
             
batch_name : {
    type : String,
    required : true,
},

in_charge: {

    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher',                
    required: true

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


const Batch = mongoose.model ('Batch', testBatchSchema)
export default Batch