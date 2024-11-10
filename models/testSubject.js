import mongoose from 'mongoose'


const testSubjectSchema = new mongoose.Schema ( {

subject_nmae : {
    type : String,
    required : true,

}

})


const Subject = mongoose.model ( 'Subject', testSubjectSchema )
export default Subject