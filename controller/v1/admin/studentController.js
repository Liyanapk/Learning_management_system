
import Student from "../../../models/student.js";




//create student



export const addStudent = async ( req, res, next ) => {

    try {
        const { first_name, last_name, email, phone, profile_pic, gender, dob, student_id, status, password, batch } = req.body ;
    
        const profilePicturePath = req.file.path.slice(8);  
  
      try {
        const newStudent = new Student(
            {first_name, last_name, email, phone, profile_pic:profilePicturePath, gender, dob, student_id, status, password, batch } 
         );
    
        await newStudent.save();
        res.status(201).json ( { message: 'student created successfully', data: newStudent } );
        
      } catch (error) {
        console.log ( error );
        
      }
    } catch (error) {
        console.log( error )
      res.status(500).json( { message: 'Error creating student', error: error.message } );
    }
  };






//find


export const listStudent = async( req, res, next) =>{

    try {
        const student = await Student.find();

        res.status(200).json( student );
      

    } catch (error) {
        next(new Error("Error finding student: " + error.message));
    }

}



//find by id

export const findStudent = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const student = await Student.findById (id);
        
        res.status(200).json( { message:`student founded successfully` , data : student} )
        
       
       
    }   catch (error) {
        next(new Error( "Error find student: " + error.message ));

        res.status(500).json( { message:`Internal server error!` } )
    }

}




//findOneAddUpdate


export const updateStudentDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
        const StudentData = {...req.body};
        
        if(req.file && req.file.path){
         StudentData.profile_pic = req.file.path.slice(8)
         
        }

       
         const updateStudent = await Student.findOneAndUpdate (
            { _id: id },
            { $set: StudentData },
            { new: true, runValidators: true }
        );


        if (!updateStudent) {

            res.status(400).json({ message:`student not found` })

        } else {

            res.status(200).json({ message:`student updated successfully` , data : updateStudent })
        }

    }   catch (error) {
        next( new Error("Error : " + error.message) );

        res.status(500).json({ message:`Internal server error!` })
    }
}





//findOneAndDelete



export const deleteStudent = async ( req, res, next)=>{
    try {
        const { id } = req.params;
        const deleteOneStudent = await Student.findOneAndDelete(
            { _id: id }
        )

        if ( !deleteOneStudent ) {

            res.status(400).json({ message:`student not find`, data:deleteOneStudent })
        }

            res.status(202).json({message:`student deleted successfully` ,data:deleteOneStudent})

    }   catch (error) {
        next(new Error( "error deleting student :" + error.message ))
    }
}