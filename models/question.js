import mongoose from 'mongoose'




const questionSchema = new mongoose.Schema ({ 


  type :{
    type:String,
    enum:['objective','subjective'],
    required:true
  },

  questions:{
    type:String,
    required:true

  },

  options:{
    A:{
        type:String,
        required: false
    },
    B:{
        type:String,
        required: false
    },
    C:{
        type:String,
        required: false
    },
    D:{
        type:String,
        required: false
    },

  }, 

  answer:{
         type:String,
         required:true,
  },

  batch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Batch',
        required:true
  },
  
  created_by:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required:true,
},

  updated_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
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

},

{
  timestamps: true
}

)


const Question = mongoose.model ( 'questions', questionSchema )
export default Question