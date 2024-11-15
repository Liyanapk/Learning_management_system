import mongoose, { Schema } from 'mongoose'


const testLectureSchema = new  mongoose.Schema( {

   
    slot: {

            from: { type: Date, required: true },
            to: { type: Date, required: true }

    },

    link: {
      
            live: {type: String, default: null},
            recorded: {type: String, default: null}

    },

    status: {
        type: String,
        enum: ['draft','pending','progress','completed'],
        required: true
    },

    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },

    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },

    student: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Student',
        required: true
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

} )


const Lecture = mongoose.model ( 'Lecture', testLectureSchema )
export default Lecture