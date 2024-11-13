
import Admin from "../../../models/admin.js";
import jwt from 'jsonwebtoken';
import httpError from "../../../utils/httpError.js";
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET || "5?#562@";

//admin login


export const adminLogin = async( req, res, next ) =>{

           try {

            const { email,password }= req.body

            if( !email || !password ) {

                return next ( new httpError (" email and password Required!") )
            }
    
            const admin = await Admin.findOne( { email } )
            
            if( !admin ) {

                return next ( new httpError ( "Admin not found ", 400 ))
            }
            //comparing both password
            const passwordValid = await bcrypt.compare(password, admin.password);

           
            if (!passwordValid) {
                return next( new httpError ( "invalid credentials", 402))
            }
          

            //jwt token 

            const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: '24h' });

            res.json({message: "Login successfull" , token})

           } catch (error) {

             return next ( new httpError ("Failed to login",500))
           }

}



//add admin

export const addAdmin = async (req, res, next) => {

         try {


        const { first_name, last_name, email, dob, phone, status, password, role } = req.body;
         
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
        if (!first_name || !last_name || !email || !dob || !phone || !status || !password || !role) {
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



        // Check if admin already exists
        const adminExsist = await Admin.findOne({ $or: [{ email }, { phone }] });

        if (adminExsist) {
            return next(new httpError("Admin with this email or phone already exists!", 400));
        }

        //hashed password

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_VALUE));

        //picture path
        let profilePicturePath;
        if (req.file) {
            profilePicturePath = req.file.path.slice(8);
        }

        const newAdmin = new Admin({
            first_name,
            last_name,
            email,
            dob,
            phone,
            status,
            password: hashedPassword,
            role,
            profile_pic: profilePicturePath,
            age: calculateAge(dob),
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully', data: newAdmin });
    } catch (error) {
        console.log(error);
        return next(new httpError("Failed to create admin", 500));
    }
};


  //find admin

  
export const listAdmin = async( req, res, next) =>{

    try {
          //get all (not get soft deleted)
        const admin = await Admin.find({ "isDeleted.status":false});
        res.status(200).json(admin);

        

    } catch (error) {
        return next (new httpError(" Server Error " ,500 ));
    }

}


//find by id

export const getOneAdmin = async( req, res, next) =>{

    try {
        const { id } = req.params;

    if (!id) {
        
        return next (new httpError("Error finding admin",400))
    }
       //not show soft deleted
        const admin = await Admin.findOne( {_id: id ,"is_deleted.status": false } );

        if (!admin) {

            return next (new httpError("Admin not present!",402))
        }else {

            res.status(200).json( { message:`admin is found` , data : admin} )
        }
        
    } catch (error) {
        
        return next (new httpError("Internal Server Error",500))
    }

}




//findOneAddUpdate


export const updateAdminDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;

        if (!id) {
            return next(new httpError("Error finding admin", 400));
        }

        const { first_name, last_name, email, dob, phone, status, password, role } = req.body;

        // age logic
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

        // email 
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if ( !emailRegex.test(email)) {
            return next(new httpError("Invalid email format!", 400));
        }

        // password 
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return next(new httpError("Password must be at least 6 characters long, include a letter, a number, and a special character.", 400));
        }

        // phone 
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return next(new httpError("Phone number must be a 10-digit number.", 400));
        }

        //  profile pic path
        let profilePicturePath;
        if (req.file) {
            profilePicturePath = req.file.path.slice(8);
        }

        //check if the admin with same email or password is there (exclude the updating admin ID)
        const existingAdmin = await Admin.findOne( {$or: [ { email }, { phone } ], _id: { $ne: id } } )
        if(existingAdmin){
           return next(new httpError("admin with this email and phone already exist",300))
        }

        // hashed password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_VALUE));
 
       
        const AdminData = {
            first_name,
            last_name,
            email,
            dob,
            phone,
            status,
            password: hashedPassword,
            role,
            profile_pic: profilePicturePath,
            age: calculateAge(dob),
        };

        // detailes of updates admin
        const updateAdmin = await Admin.findOneAndUpdate(
            { _id: id },
            { $set: AdminData },
            { new: true, runValidators: true }
        );

     

        if (!updateAdmin) {
            return next(new httpError("Admin not updated!", 400));
        }

        res.status(200).json({ message: "Admin updated", data: updateAdmin });
    } catch (error) {
        console.error("Error in updateAdminDetailes:", error);
        return next(new httpError("Server Error", 500));  
    }
};



 //findOneAndDelete



export const deleteAdmin = async ( req, res, next)=>{
    try {
        const {id} = req.params;

        if (!id) {
            return next (new httpError("Error finding admin",400))
        }

        //soft delete
        const deleteOneAdmin = await Admin.findOneAndUpdate(
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
        

        if ( !deleteOneAdmin ) {

           return next (new httpError("No admin found!",400))
        }

            res.status(202).json({message:`admin deleted successfully` , data:deleteOneAdmin })

    }   catch (error) {
        return next (new httpError("Internal Server Error!",500))
    }
}

