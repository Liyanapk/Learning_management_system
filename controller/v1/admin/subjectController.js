import Subject from "../../../models/subject.js";
import httpError from "../../../utils/httpError.js";

// Add subject


export const addSubject = async ( req, res, next ) => {
  try {
    const { name } = req.body;
    

    if (!name) {
      return next(new httpError("subject name is required!",400))
    }

    // Check if subject already exists
    const subject = await Subject.findOne( { name } )

    if (subject) {
    return next(new httpError("subject with this name already exists!", 300));
    }

    const subjectCreatedBy = req.Admin.id

        const newSubject = new Subject({ name, created_by: subjectCreatedBy })
        await newSubject.save()
        const getSubject  = await Subject.findById(newSubject._id).select('-__v -createdAt -updatedAt -is_deleted')


    res.status(201).json( { message: "Subject created successfully", data: getSubject } );

  } catch (error) {
  
   return next(new httpError("error in creating subject!",500))
  }
};




//find


export const listSubject = async( req, res, next) =>{

    try{
        
        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        //filtering
        const filter = {"is_deleted.status": false};
        if(req.query.searchTerm){

            filter.$or=[
                { name : { $regex: req.query.searchTerm, $options: 'i' } }           
            ]
        }

        //sorting
        const sort = {};
        if(req.query.sortBy){
            const [field,order] = req.query.sortBy.split(':');
            sort [field] = order === 'desc' ? -1 : 1;
        }
        

    


        //result
        const total = await Subject.countDocuments(filter);

        const allSubject = await Subject.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-is_deleted -__v');


        //response send
        res.status(200).json({
            message: 'Subject retrieved successfully',
            data: allSubject,
            totalPages: Math.ceil(total/limit),
            currentPage: page,
            totalItems: total,
          });

      

    } catch (error) {
        return next(new httpError("error finding subject",500))
    }

}




//find by id

export const findSubject = async( req, res, next) =>{

    try {
        const { id } = req.params;
        
        const subject = await Subject.findOne({_id:id ,"is_deleted.status": false });

        const getSubject = await Subject.findById(subject._id).select('-__v -is_deleted -createdAt -updatedAt')
        
        res.status(200).json( { message:`subject founded successfully` , data : getSubject} )
        
       
       
    }   catch (error) {
        console.log(error)
        return next(new httpError("inetrnal server error",500))
    }

}





//findOneAddUpdate


export const updatesubjectDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
        const { name }=req.body
        const subjectCreatedBy = req.Admin.id

        
        if(req.file && req.file.path){
         SubjectData.profile_pic = req.file.path.slice(8)
        }

        const SubjectData={ name }


       
         const updateSubject = await Subject.findOneAndUpdate (
            { _id: id },
            { $set: SubjectData,updated_by:subjectCreatedBy },
            { new: true, runValidators: true }
        );

        
       


        const getUpdatedSubject = await Subject.findById(updateSubject._id).select('-__v -is_deleted -createdAt -updatedAt')

        if (!updateSubject) {

            return next(new httpError("subject not found",404))

        }
        if(!subjectCreatedBy){
            return next(new httpError("unotherized action",300))
        }

            res.status(200).json({ message:`subject name updated successfully` , data : getUpdatedSubject })
       

    }  catch (error) {
        console.log(error)
        return next(new httpError("subject not updated!",500))
    }
}



//findOneAndDelete



export const deleteSubject = async ( req, res, next)=>{
    try {
        const { id } = req.params;
        const deleteOneSubject = await Subject.findOneAndUpdate(
            { _id: id,"is_deleted.status":false },
            {
                $set:{
                    "is_deleted.status":true,
                    "is_deleted.deleted_by":req.Admin.id,
                    "is_deleted.deleted_at":new Date(),
                }
            },
            {new :true}
        );
        

        if ( !deleteOneSubject ) {

            return next(new httpError("subject not found",400))
        }

            res.status(202).json({message:`subject deleted successfully` })

    }   catch (error) {
        return next(new httpError("internal server error",500))
    }
}



