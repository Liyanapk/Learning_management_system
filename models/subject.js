import mongoose from 'mongoose'


const testSubjectSchema = new mongoose.Schema ( {

subject_name : {
    type : String,
    required : true,

},


isDeleted: {

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