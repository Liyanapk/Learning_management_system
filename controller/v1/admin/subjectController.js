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
     
        const subject = await Subject.find();

        res.status(200).json( subject );
      

    } catch (error) {
        return next(newError("error finding subject",500))
    }

}




//find by id

export const findSubject = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const subject = await Subject.findById (id);
        
        res.status(200).json( { message:`subject founded successfully` , data : subject} )
        
       
       
    }   catch (error) {
        return next(new httpError("inetrnal server error",500))
    }

}





//findOneAddUpdate


export const updatesubjectDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
        const SubjectData = {...req.body};
        
        if(req.file && req.file.path){
         SubjectData.profile_pic = req.file.path.slice(8)
        }

       
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
        const deleteOneSubject = await Subject.findOneAndDelete(
            { _id: id }
        )

        if ( !deleteOneSubject ) {

            return next(new httpError("subject not found",400))
        }

            res.status(202).json({message:`subject deleted successfully` ,data:deleteOneSubject})

    }   catch (error) {
        return next(new httpError("internal server error",500))
    }
}



