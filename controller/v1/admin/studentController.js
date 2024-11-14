
import Student from "../../../models/student.js";
import bcrypt from 'bcrypt'
import httpError from "../../../utils/httpError.js";


//create student



export const addStudent = async ( req, res, next ) => {

    try {



        const {first_name, last_name, email, phone, gender, dob, status, password, batch} =req.body;

        //age logic

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


        // all feild required 
        if (!first_name || !last_name || !email || !dob || !phone || !status || !password || !batch || !gender) {
            return next(new httpError("All credentials are Required!", 400));
        }

         
        //email

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new httpError("Invalid email format!", 400));
        }

        //password

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return next(new httpError("Password must be at least 8 characters long, include a letter, a number, and a special character.", 400));
        }

        //phone 

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return next(new httpError("Phone number must be a 10-digit number.", 400));
        }



        // Check if student already exists
        const studentExsist = await Student.findOne({ $or: [{ email }, { phone }] });

        if (studentExsist) {
            return next(new httpError("student with this email or phone already exists!", 400));
        }

        //hashed password

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_VALUE));

        //picture path
        let profilePicturePath;
        if (req.file) {
            profilePicturePath = req.file.path.slice(8);
        }

        //student_id

         function studentID (firstName,phoneNumber,lastName){
            const first =firstName.toUpperCase().slice(0,2);
            const number =phoneNumber.toString().slice(7)
            const last = lastName.toLowerCase().slice(0,1)
            const random =Math.floor(Math.random()*1000).toString().padStart('0',3)

            return`${first}${number}${last}${random}`
        }

        const studentId = studentID(first_name,phone,last_name)
  
     
        const newStudent = new Student({
          first_name,
          last_name,
          email,
          phone,
          gender,
          dob,
          student_id:studentId,
          status,
          password: hashedPassword,
          batch,
          profile_pic: profilePicturePath,
          age: calculateAge(dob),
        }); 
         
    
        await newStudent.save();
        res.status(201).json ( { message: 'student created successfully', data: newStudent } );
        
      
    } catch (error) {
       console.log(error);
       
       return next(new httpError("error creating student",500))
    }
  };






//find


export const listStudent = async( req, res, next) =>{

    try {
        const student = await Student.find({ "is_deleted.status":false });

        if(!student){
            return next(new httpError("error finiding students",400))
        }

        res.status(200).json( student );
      

    } catch (error) {
        return next(new httpError("Internal server error",500))
    }

}



//find by id

export const findStudent = async( req, res, next) =>{

    try {
        const { id } = req.params;

        if(!id){
            return next(new httpError("Id not found",400))
        }

        const student = await Student.findOne(id,{ "is_deleted.status":false });
       
        
        res.status(200).json( { message:`student founded successfully` , data : student} )
        
       
       
    }   catch (error) {
        return next(new httpError("internal server error",500))
    }

}




//findOneAddUpdate


export const updateStudentDetailes = async (req, res, next) =>{


    try {
        const { id } = req.params;

        if (!id) {
            return next(new httpError("No ID found", 400));
        }

        const { first_name, last_name, email, phone, gender, dob, status, password, batch } = req.body;

        //age logic
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
        
        //updated value
        const updateData = { first_name, last_name, email, phone, gender, dob, status, batch };

        //  email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (req.body.email && !emailRegex.test(email)) {
            return next(new httpError("Invalid email format!", 400));
        }

        //  phone
        const phoneRegex = /^\d{10}$/;
        if (req.body.phone && !phoneRegex.test(phone)) {
            return next(new httpError("Phone number must be a 10-digit number.", 400));
        }

        // validate and hash password 
        if (req.body.password) {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
            if (!passwordRegex.test(password)) {
                return next(new httpError("Password must be at least 6 characters long, include a letter, a number, and a special character.", 400));
            }

            const saltRounds = process.env.SALT_VALUE ? parseInt(process.env.SALT_VALUE) : 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateData.password = hashedPassword;
        }

        // set age 
        if (req.body.dob) {
            updateData.age = calculateAge(dob);
        }

        // set profile picture path 
        if (req.file) {
            updateData.profile_pic = req.file.path.slice(8);
        }

        // Checking  student with email or phone already exists
        const studentExist = await Student.findOne({ $or: [{ email }, { phone }], _id: { $ne: id } });
        if (studentExist) {
            return next(new httpError("A student with this email or phone already exists!", 400));
        }

        const updateStudent = await Student.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updateStudent) {
            return next(new httpError("Student not found", 404));
        } else {
            res.status(200).json({ message: `Student updated successfully`, data: updateStudent });
        }

    } catch (error) {
        console.log("err", error);
        return next(new httpError("Internal server error", 500));
    }
};


//findOneAndDelete



export const deleteStudent = async ( req, res, next)=>{
    try {
        const { id } = req.params;

        if(!id){
            return next(new httpError("no id found",400))
        }

        const deleteOneStudent = await Student.findOneAndUpdate(
            { 
                _id: id, "is_deleted.status" :false }, 
            
             {
                $set:{"is_deleted.status":true,
                       "is_deleted.deleted_by": req.admin.id,
                        "is_deleted.deleted_at":new Date()
                }
             },
             {new :true}

        );

        if ( !deleteOneStudent ) {

            return next(new httpError("student not found",404))
        }

            res.status(202).json({message:`student deleted successfully` ,data:deleteOneStudent})

    }   catch (error) {
        return next(new httpError("error deleting student",500))
    }
}