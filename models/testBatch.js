import mongoose from 'mongoose'


const testBatchSchema = new mongoose.Schema ({
             
batch_name : {
    type : String,
    required : true,
},

teacher_id : {
    type : String,
    unique :true,
    required : true,
},


})


const Batch = mongoose.model ('Batch', testBatchSchema)
export default Batch