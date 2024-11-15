import Teacher from "../../../models/teacher.js";
import bcrypt from 'bcrypt'
import httpError from "../../../utils/httpError.js";

//create teacher



export const addTeacher = async ( req, res, next ) => {

    try {


const {first_name, last_name, dob, email, phone, gender, status, password, subject, address } =req.body

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



if( !first_name || !last_name || !dob || !email || !phone || !gender || !status || !password || !subject ||!address){
    return next (new httpError("all credentials are required!",403))
}

 
    //email

     const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
     if (!emailRegex.test(email)) {
    return next(new httpError("Invalid email format!", 404));
     }

    //password

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
    return next(new httpError("Password must be at least 8 characters long, include a letter, a number, and a special character.", 400));
    }

    //phone 

    const phoneRegex = /^\d{10}$/;
     if (!phoneRegex.test(phone)) {
    return next(new httpError("Phone number must be a 10-digit number.", 408));
    }



    // Check if teacher already exists
    const teacher = await Teacher.findOne( {$or: [ { email }, { phone } ] } )

    if (teacher) {
    return next(new httpError("teacher with this email or phone already exists!", 400));
    }

    //hashed password

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_VALUE));

    //picture path
    let profilePicturePath;
    if (req.file) {
    profilePicturePath = req.file.path.slice(8);   
    }

  
      
        const newTeacher = new Teacher({
          first_name,
          last_name,
          dob,
          email,
          phone,
          profile_pic: profilePicturePath,
          gender,
          status,
          password: hashedPassword,
          subject,
          age :calculateAge(dob),
          address,
        });
    
        await newTeacher.save();
        res.status(201).json ( { message: 'teacher created successfully', data: newTeacher } );
        
      
    } catch (error) {
        return next(new httpError("error creating teacher",500))
    }
  };





  //find teacher



  export const listTeacher = async( req, res, next) =>{

    try {

        const teacher = await Teacher.find({"is_deleted.status":false});

        res.status(200).json( teacher );
      

    } catch (error) {
       return next(new httpError("internal server error",500))
    }

}




//find by id

export const findTeacher = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const teacher = await Teacher.findOne( {_id: id ,"is_deleted.status": false } );
        if(!teacher){
            return next(new httpError("No teacher found",400))
        }
        
        res.status(200).json( { message:`teacher is found` , data:teacher} )
        
       
       
    }   catch (error) {
        console.log(error); 
        
        return next(new httpError("internal server error",500))
    }

}






//findOneAddUpdate


export const updateTeacherDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
        const {first_name, last_name, dob, email, phone, gender, status, password, subject, address } =req.body


    
        
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
    
        const updateData = {
            first_name,
            last_name,
            dob,
            email,
            phone,
            gender,
            status,
            subject,
            address,
         
          }; 
    
     
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

    
    //find teacher with same email or password exist
        const teacher = await Teacher.findOne({
            _id: { $ne: id },
            $or: [{ email }, { phone }]
        }); 

    if (teacher) {
    return next(new httpError("teacher with this email or phone already exists!", 400));
    }
    
    
         const updateTeacher = await Teacher.findOneAndUpdate (
            { _id: id },
            { $set: updateData },
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
        if(!id){
            return next(new httpError("no id found",404))
        }


        const deleteOneTeacher = await Teacher.findOneAndUpdate(
            { _id: id , "is_deleted.status":false},
            {
              $set:{
                "is_deleted.status":true,
                "is_delted.deleted_by":req.admin.id,
                "is_deleted.deleted_at":new Date()

              },
            },
            {new:true}
        )

        if ( !deleteOneTeacher ) {

            return next(new httpError("Teacher not found",400))
        }

            res.status(202).json({message:`teacher deleted successfully` ,data:deleteOneTeacher})

    }   catch (error) {
        
        return next(new httpError("internal server error",500))
    }
}