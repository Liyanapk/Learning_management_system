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
        required:true,
    },
    B:{
        type:String,
        required:true,
    },
    C:{
        type:String,
        default:null,
    },
    D:{
        type:String,
        default:null,
    },

  }, 

  answre:{
         type:String,
         required:true,
  },
  
  created_by:{
    type:mongoose.Schema.Types.ObjectId,
    refPath: 'AdminAndTeacher',
    required:true,
},
     AdminAndTeacher:{
     type:String,
     enum:['admin','teacher'],
     required:true

    },

    updated_by:{
        type:mongoose.Schema.Types.ObjectId,
        refPath: 'AdminAndTeacher',
        required:true,
    },
         AdminAndTeacher:{
         type:String,
         enum:['admin','teacher'],
         required:true

        },
    
    last_date :{
       type:Date,
       required:true,

    },


})


const Question = mongoose.model ( 'Assignment', questionSchema )
export default Question