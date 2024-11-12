import Teacher from "../../../models/teacher.js";



//create teacher



export const addTeacher = async ( req, res, next ) => {

    try {
        const { first_name, last_name, dob, email, phone, profile_pic, gender, status, password, subject } = req.body ;
    
        const profilePicturePath = req.file.path.slice(8);  
  
      try {
        const newTeacher = new Teacher(
            { first_name, last_name, dob, email, phone, profile_pic:profilePicturePath, gender, status, password, subject } 
         );
    
        await newTeacher.save();
        res.status(201).json ( { message: 'teacher created successfully', data: newTeacher } );
        
      } catch (error) {
        console.log ( error );
        
      }
    } catch (error) {
        console.log( error )
      res.status(500).json( { message: 'Error creating teacher', error: error.message } );
    }
  };





  //find teacher



  export const listTeacher = async( req, res, next) =>{

    try {

        const teacher = await Teacher.find();

        res.status(200).json( teacher );
      

    } catch (error) {
        next(new Error("Error finding teacher: " + error.message));
    }

}




//find by id

export const findTeacher = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const teacher = await Teacher.findById (id);
        
        res.status(200).json( { message:`teacher is found` , data : teacher} )
        
       
       
    }   catch (error) {
        next(new Error( "Error find teacher: " + error.message ));

        res.status(500).json( { message:`Internal server error!` } )
    }

}






//findOneAddUpdate


export const updateTeacherDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
        const TeacherData = {...req.body};
        
        if(req.file && req.file.path){
         TeacherData.profile_pic = req.file.path.slice(8)
        }

       
         const updateTeacher = await Teacher.findOneAndUpdate (
            { _id: id },
            { $set: TeacherData },
            { new: true, runValidators: true }
        );


        if (!updateTeacher) {

            res.status(400).json({ message:`teacher not found` })

        } else {

            res.status(200).json({ message:`teacher updated` , data : updateTeacher })
        }

    }   catch (error) {
        next( new Error("Error : " + error.message) );

        res.status(500).json({ message:`Internal server error!` })
    }
}




//findOneAndDelete



export const deleteTeacher = async ( req, res, next)=>{
    try {
        const { id } = req.params;
        const deleteOneTeacher = await Teacher.findOneAndDelete(
            { _id: id }
        )

        if ( !deleteOneTeacher ) {

            res.status(400).json({ message:`teacher not find`, data:deleteOneTeacher })
        }

            res.status(202).json({message:`teacher deleted successfully` ,data:deleteOneTeacher})

    }   catch (error) {
        next(new Error( "error deleting teacher :" + error.message ))
    }
}