import mongoose from 'mongoose'


const testSubjectSchema = new mongoose.Schema ( {

name : {
    type : String,
    required : true,

},
created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
},

updated_by: {
    type: mongoose.Schema.Types.ObjectId,
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

}, {

timestamps: true

})


const Subject = mongoose.model ( 'Subject', testSubjectSchema )
export default Subject