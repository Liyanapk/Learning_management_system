
import Assignment from '../../../models/assignment.js'
import httpError from '../../../utils/httpError.js'



//ADD ASSIGNMENT

export const createAssignment = async(req, res, next)=>{

   try {

    const { participants, status, lecture, last_date, questions} =req.body;

    

    if(!participants || ! status || ! lecture || ! last_date || ! questions){
        return next(new httpError("all credentials required!",400))
    }

    if(!participants || !participants.status || !participants.attachement || !participants.students ){
        return next(new httpError("participant detailes are required!",400))
    }

    
    const assignmentCreatedBy = req.Admin?.id;
    if (!assignmentCreatedBy) {
    return next(new httpError("Admin is not authenticated!", 401));
}

    const assignmentData = {
        participants,
        status,
        lecture,
        last_date,
        questions,
        created_by: assignmentCreatedBy,
    };
    const newAssignment = await Assignment(assignmentData)
    await newAssignment.save();

    const getAssignment = await Assignment.findById(newAssignment._id).select('-__v -is_deleted -createdAt -updatedAt ')
    .populate([
        {
            path: 'lecture',
            select: 'name',
            
            
        },
        {
            path: 'participants.students',
            select: 'first_name last_name email', 
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
  
    

    res.status(200).json({
        status: true,
        message: "Successfully created assignment",
        data: getAssignment,
        access_token: null,
    });
    
   } catch (error) {
    console.log(error)
    return next(new httpError("internal server error",505))
    
   }


}



//LIST ALL ASSIGNMENT




export const listAssignment = async( req, res, next) =>{

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
        const total = await Assignment.countDocuments(filter);

        const allAssignment = await Assignment.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select(' -is_deleted -__v -createdAt -updatedAt -__v')
          .populate([
            {
                path: 'lecture',
                select: 'name',
                
                
            },
            {
                path: 'participants.students',
                select: 'first_name last_name email', 
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
            message: 'assignment retrieved successfully',
            data: allAssignment,
            totalPages: Math.ceil(total/limit),
            currentPage: page,
            totalItems: total,
          });


    } catch (error) {
        console.log(error)
        return next(new httpError("Internal server error",500))
    }

}



//GET ONE ASSIGNMENT


