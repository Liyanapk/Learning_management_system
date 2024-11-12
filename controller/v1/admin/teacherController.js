import Teacher from "../../../models/teacher.js";
import bcrypt from 'bcrypt'
import httpError from "../../../utils/httpError.js";

//create teacher



export const addTeacher = async ( req, res, next ) => {

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


        const { first_name, last_name, dob, email, phone, gender, status, password, subject } = req.body ;
    
        let profilePicturePath 

        if(req.file){
            profilePicturePath = req.file.path.slice(8);
        }  
        const age = calculateAge(dob)
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_VALUE));
  
      
        const newTeacher = new Teacher(
            { first_name, last_name, dob, email, phone, profile_pic:profilePicturePath, gender, status, password: hashedPassword, subject, age } 
         );
    
        await newTeacher.save();
        res.status(201).json ( { message: 'teacher created successfully', data: newTeacher } );
        
      
    } catch (error) {
        return next(new httpError("error creating teacher",500))
    }
  };





  //find teacher



  export const listTeacher = async( req, res, next) =>{

    try {

        const teacher = await Teacher.find();

        res.status(200).json( teacher );
      

    } catch (error) {
       return next(new httpError("internal server error",500))
    }

}




//find by id

export const findTeacher = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const teacher = await Teacher.findById (id);
        
        res.status(200).json( { message:`teacher is found` , data : teacher} )
        
       
       
    }   catch (error) {
        return next(new httpError("internal server error",500))
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

            return next(new httpError("Teacher not found",400))

        } else {

            res.status(200).json({ message:`teacher updated` , data : updateTeacher })
        }

    }   catch (error) {
        next( new Error("Error : " + error.message) );

        return next(new httpError("internal server error",500))
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

            return next(new httpError("Teacher not found",400))
        }

            res.status(202).json({message:`teacher deleted successfully` ,data:deleteOneTeacher})

    }   catch (error) {
        return next(new httpError("internal server error",500))
    }
}