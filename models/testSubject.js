import mongoose from 'mongoose'


const testSubjectSchema = new mongoose.Schema ( {

subject_name : {
    type : String,
    required : true,

}

})


const Subject = mongoose.model ( 'Subject', testSubjectSchema )
export default Subject