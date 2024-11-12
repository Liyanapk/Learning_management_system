
import Student from "../../../models/student.js";

import httpError from "../../../utils/httpError.js";


//create student



export const addStudent = async ( req, res, next ) => {

    try {


//age logic ( take age from dob )

const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
  
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
      age--;
    }

    return age;
  };


        const { first_name, last_name, email, phone, gender, dob, student_id, status, password, batch } = req.body ;
    
        let profilePicturePath 

        if(req.file){
            profilePicturePath = req.file.path.slice(8);
        }    
        const age = calculateAge(dob)
  
     
        const newStudent = new Student(
            {first_name, last_name, email, phone, profile_pic:profilePicturePath, gender, dob, student_id, status, password, batch, age } 
         );
    
        await newStudent.save();
        res.status(201).json ( { message: 'student created successfully', data: newStudent } );
        
      
    } catch (error) {
       return next(new httpError("error creating student",500))
    }
  };






//find


export const listStudent = async( req, res, next) =>{

    try {
        const student = await Student.find();

        res.status(200).json( student );
      

    } catch (error) {
        return next(new httpError("error finiding students",500))
    }

}



//find by id

export const findStudent = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const student = await Student.findById (id);
        
        res.status(200).json( { message:`student founded successfully` , data : student} )
        
       
       
    }   catch (error) {
        return next(new httpError("error finding students",500))
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

           return next(new httpError("student not found",404))

        } else {

            res.status(200).json({ message:`student updated successfully` , data : updateStudent })
        }

    }   catch (error) {
        return next(new httpError("internal server error",500))
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

            return next(new httpError("student not found",404))
        }

            res.status(202).json({message:`student deleted successfully` ,data:deleteOneStudent})

    }   catch (error) {
        return next(new httpError("error deleting student",500))
    }
}