import Question from '../../../models/question.js'
import httpError from '../../../utils/httpError.js'




//ADD QUESTIONS



export const addQuestions = async (req, res, next)=>{

try {

    const { type, questions, options, answer, batch } = req.body;

      
        if (!type || !questions || !answer || !batch) {
            return next(new httpError("All credentials are required", 400));
        }

        if (type === "objective") {
          
            if (!options || !options.A || !options.B) {
                return next(new httpError("Options A and B are required for objective questions", 401));
            }

            // Validate answer for objective questions
            const validAnswers = ["A", "B", "C", "D"];
            if (!validAnswers.includes(answer)) {
                return next(new httpError("Answer must be one of the following: A, B, C, D", 402));
            }

        } else if (type === "subjective") {
        
            if (options) {
                return next(new httpError("Options are not required for subjective questions", 403));
            }
        } else {
            
            return next(new httpError("Invalid question type", 404));
        }

        const questionCreatedBy = req.Admin?.id;

        const questionData = {
            type,
            questions,
            answer,
            batch,
            created_by: questionCreatedBy,
        };

        // Include options only for objective questions
        if (type === "objective") {
            questionData.options = options;
        }

        const Questions = new Question(questionData);
        await Questions.save();

        const getQuestion = await Question.findById(Questions._id).select('-__v -is_deleted -createdAt -updatedAt ')

        res.status(200).json({
            status: true,
            message: "Successfully created questions",
            data: getQuestion,
            access_token: null,
        });

} catch (error) {
    console.log(error)
    return next(new httpError("Internal server error",505))
    
}


}



//LIST ALL QUESTIONS




export const listQuestions = async( req, res, next) =>{

    try{
        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        //filtering
        const filter = {"is_deleted.status": false};
        if(req.query.searchTerm){

            filter.$or=[
                { type : { $regex: req.query.searchTerm, $options: 'i' } }
              
            ]
        }

        //sorting
        const sort = {};
        if(req.query.sortBy){
            const [field,order] = req.query.sortBy.split(':');
            sort [field] = order === 'desc' ? -1 : 1;
        }
        

    


        //result
        const total = await Question.countDocuments(filter);

        const allQuestion = await Question.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select(' -is_deleted -__v -createdAt -updatedAt -__v')
          .populate([
            {
                path: 'batch',
                select: '-is_deleted -__v -createdAt -updatedAt -__v',
                populate: {
                    path: 'in_charge',
                    select: 'first_name last_name email status subject profile_image',
                    populate: {
                        path: 'subject',
                        select: 'name'
                    }
                }
            },
            {
                path: 'created_by',
                select: 'first_name last_name email  role subject',
            },
            {
                path: 'updated_by',
                select: 'first_name last_name email  role subject',
            },
        ])


        //response send
        res.status(200).json({
            message: 'Question retrieved successfully',
            data: allQuestion,
            totalPages: Math.ceil(total/limit),
            currentPage: page,
            totalItems: total,
          });


    } catch (error) {
        return next(new httpError("Internal server error",500))
    }

}



//GET ONE QUESTION


export const oneQuestion = async(req, res, next)=>{

   try {

    const { id } = req.params;

    if(!id){
        return next(new httpError("Id not found",400))
    }

    const question = await Question.findOne( {_id: id ,"is_deleted.status": false });

    const getQuestion = await Question.findById(question._id).select(' -is_deleted -__v -createdAt -updatedAt -__v')
    .populate([
        {
            path: 'batch',
            select: '-is_deleted -__v -createdAt -updatedAt -__v',
            populate: {
                path: 'in_charge',
                select: 'first_name last_name email status subject profile_image',
                populate: {
                    path: 'subject',
                    select: 'name'
                }
            }
        },
        {
            path: 'created_by',
            select: 'first_name last_name email  role subject',
        },
        {
            path: 'updated_by',
            select: 'first_name last_name email  role subject',
        },
    ])
    
    res.status(200).json( { message:`question founded successfully` , data : getQuestion} )
    
   
   
}   catch (error) {
    console.log(error)
    return next(new httpError("internal server error",500))
}


}




//UPDATE ONE QUESTION


export const updateQuestion = async (req, res, next) =>{


    
    try {
        const { id } = req.params;

        //if id not present
        if(!id){
            return next(new httpError(" ID Not found",400))
        }

        const { questions, answer, type, options, batch } = req.body;

        if (type === "objective") {

            if (!options || !options.A || !options.B) {

                return next(new httpError("options  are required for Objective type Question", 400));
            }

        } else if (type === "subjective" && options) {

            return next(new httpError("Options are not required for Subjective type Question", 400));
        }

        

        const updatedFields = {
            questions,
            options: type === "objective" ? options : undefined,
            answer,
            type,
            batch,
            updated_by: req.Admin.id, 
        };

        const updatedQuestion = await Question.findOneAndUpdate(
            { _id: id }, 
            { $set: updatedFields }, 
            { new: true } 
        );

        if (! updatedQuestion) {

            return next(new httpError("question not found", 400));
        }

        const getQuestion = await Question.findById(updatedQuestion._id).select('-__v -is_deleted -createdAt -updatedAt')

        res.status(200).json({
            message: "Question updated successfully",
            data: getQuestion,
            status: true,
            access_token: null,
        });


    }    catch (error) {
        console.log(error)
         return next(new httpError("internal server error"),500)
    }
}




//DELETE QUESTION


export const deleteQuestion = async(req, res, next)=>{

try {

    const { id } =req.params;

    if(! id){
        return next(new httpError("ID required",400))
    }

    const deleteOneQuestion = await Question.findOneAndUpdate(
        { 
            _id: id, "is_deleted.status" :false }, 
        
         {
            $set:{"is_deleted.status":true,
                   "is_deleted.deleted_by": req.Admin.id,
                    "is_deleted.deleted_at":new Date()
            }
         },
         {new :true}

    );

    if ( ! deleteOneQuestion ) {

        return next(new httpError("question not found",404))
    }

    

        res.status(202).json({message:`question deleted successfully` })

    
} catch (error) {

return next(new httpError("internal server error",505))
    
}

}