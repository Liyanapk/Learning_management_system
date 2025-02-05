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
type:{
    type :String,
    enum:['free','paid','crash course'],
    required: true,
},
status:{
    type :String,
    enum:['draft','inprogress','completed'],
    required: true,
},

    duration: {
        from: { 
          type: Date, 
          required: true 
        },
        to: { 
          type: Date, 
          required: true 
        }
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

},

classroom_link: {
    type: String,
    unique: true,
  },
  
  

}, {

timestamps:true

}

)


const Batch = mongoose.model ('Batch', testBatchSchema)
export default Batch