import Subject from "../../../models/subject.js";
import httpError from "../../../utils/httpError.js";

// Add subject


export const addSubject = async ( req, res, next ) => {
  try {
    const { subject_name } = req.body;
    console.log(req.body);

    if (!subject_name) {
      return next(new httpError("subject name is required!",400))
    }

    // Check if subject already exists
    const subject = await Subject.findOne( { subject_name } )

    if (subject) {
    return next(new httpError("subject with this name already exists!", 300));
    }

    const newSubject = new Subject({
      subject_name,
    });
    await newSubject.save();

    res.status(201).json( { message: "Subject created successfully", data: newSubject } );

  } catch (error) {
  
   return next(new httpError("error in creating subject!",500))
  }
};




//find


export const listSubject = async( req, res, next) =>{

    try {
     
        const subject = await Subject.find({ "is_deleted.status":false });

        res.status(200).json( subject );
      

    } catch (error) {
        return next(new httpError("error finding subject",500))
    }

}




//find by id

export const findSubject = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const subject = await Subject.find({_id: id ,"is_deleted.status": false });
        
        res.status(200).json( { message:`subject founded successfully` , data : subject} )
        
       
       
    }   catch (error) {
        return next(new httpError("inetrnal server error",500))
    }

}





//findOneAddUpdate


export const updatesubjectDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
        const { subject_name }=req.body
        
        if(req.file && req.file.path){
         SubjectData.profile_pic = req.file.path.slice(8)
        }

        const SubjectData={ subject_name }


       
         const updateSubject = await Subject.findOneAndUpdate (
            { _id: id },
            { $set: SubjectData },
            { new: true, runValidators: true }
        );


        if (!updateSubject) {

            return next(new httpError("subject not found",404))

        } else {

            res.status(200).json({ message:`subject name updated successfully` , data : updateSubject })
        }

    }   catch (error) {
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
                    "is_deleted.deleted_by":req.admin.id,
                    "is_deleted.deleted_at":new Date(),
                }
            },
            {new :true}
        );
        

        if ( !deleteOneSubject ) {

            return next(new httpError("subject not found",400))
        }

            res.status(202).json({message:`subject deleted successfully` ,data:deleteOneSubject})

    }   catch (error) {
        return next(new httpError("internal server error",500))
    }
}



