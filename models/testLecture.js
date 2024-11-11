import mongoose, { Schema } from 'mongoose'


const testLectureSchema = new  mongoose.Schema( {

    slot : {
        from : {
            type : Date,
            required : true,
        },

        to:{
            type : Date,
            required : true,
        },
    },
    
    status: {
        type: String,
        enum: ['draft', 'success', 'pending'], 
        required: true,
    },

    link: {
        live: {
            type: String,
            default: null, 
        },
        recorded: {
            type: String,
            default: null, 
        },
    },

    subject : {
        type : Schema.Types.objectId,
        ref : 'Subject',
        required: true,
    },

    student : {
        type : Schema.Types.objectId,
        ref : 'Student',
        required: true,
    },

    teacher : {
        type : Schema.Types.objectId,
        ref : 'Teacher',
        required: true,
    },

    batch : {
        type : Schema.Types.objectId,
        ref : 'Batch',
        required: true,
    }

} )


const Lecture = mongoose.model ( 'Lecture', testLectureSchema )
export default Lecture