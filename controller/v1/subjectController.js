import Subject from "../../models/testSubject.js";

// Add subject

export const AddSubject = async ( req, res, next ) => {
  try {
    const { subject_name } = req.body;
    console.log(req.body);

    if (!subject_name) {
      return res.status(400).json( { message: "Subject name is required" } );
    }

    const newSubject = new Subject({
      subject_name,
    });
    await newSubject.save();

    res.status(201).json( { message: "Subject created successfully", data: newSubject } );

  } catch (error) {
    console.log(error);
    next(new Error("Error creating subject: " + error.message));
  }
};




//find


export const findsubject = async( req, res, next) =>{

    try {
        const { subject_name } = req.params;
        const subject = await Subject.find( { subject_name } );

        if (subject.length === 0) {

            return res.status(404).json({ message: 'subject not found' });
        }

        res.status(200).json({ message: ` subject is ${subject_name} `, data: subject });
      

    } catch (error) {
        next(new Error("Error finding subject: " + error.message));
    }

}




//find by id

export const findSubjectById = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const subject = await Subject.findById (id);
        
        res.status(200).json( { message:`subject founded successfully` , data : subject} )
        
       
       
    }   catch (error) {
        next(new Error( "Error find subject: " + error.message ));

        res.status(500).json( { message:`Internal server error!` } )
    }

}





//findOneAddUpdate


export const findAndUpdatesubject = async (req, res, next) =>{


    
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

            res.status(400).json({ message:`subject not found` })

        } else {

            res.status(200).json({ message:`subject name updated successfully` , data : updateSubject })
        }

    }   catch (error) {
        next( new Error("Error : " + error.message) );

        res.status(500).json({ message:`Internal server error!` })
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

            res.status(400).json({ message:`subject not find`, data:deleteOneSubject })
        }

            res.status(202).json({message:`subject deleted successfully` ,data:deleteOneSubject})

    }   catch (error) {
        next(new Error( "error deleting subject :" + error.message ))
    }
}



