import mongoose from 'mongoose'


const testBatchSchema = new mongoose.Schema ({
             
name : {
    type : String,
    required : true,
},

in_charge: {

    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher',                
    required: true

},
course:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',                
    required: true
},

students:[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student',                
    
}],

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