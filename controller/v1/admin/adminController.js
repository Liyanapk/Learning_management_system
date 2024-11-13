
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

     

      //body feild
      const { first_name, last_name, email, dob, phone, status, password, role } = req.body;
       

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
           




      //validation check
      if( !first_name || !last_name || !email || !dob || !phone || !status || !password || !role ){
        return next (new httpError("All credentials are Required!"))
      }

      //check the admin allready exist
   
      const adminExsist = await Admin.findOne({ $or: [{ email }, { phone }] })
    
      if (!adminExsist) {
         
          return next(new httpError("no admin exist!",404))
        
      }


      //add admin detailes
     

      

      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_VALUE));

      let profilePicturePath
      
      if(req.file){
         profilePicturePath = req.file.path.slice(8);
      } 
       
        const newAdmin = new Admin(
            { first_name, last_name, email, dob, phone, status, password: hashedPassword, role, profile_pic:profilePicturePath, age:calculateAge(dob) } 
         );

        await newAdmin.save();

        res.status(201).json( { message: 'admin created successfully', data: newAdmin } );
        
    }   catch (error) {
        console.log(error)

        return next(new httpError("Failed to create admin",500))
    }
  };




  //find admin

  
export const listAdmin = async( req, res, next) =>{

    try {

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

        const admin = await Admin.findOne( {_id: id} );

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
            return next (new httpError("Error finding admin",400))
        }
        const AdminData = {...req.body};
        
        if(req.file && req.file.path){
         AdminData.profile_pic = req.file.path.slice(8)
        }
 
       
         const updateAdmin = await Admin.findOneAndUpdate (
            { _id: id },
            { $set: AdminData },
            { new: true, runValidators: true }
        );


        if (!updateAdmin) {

           return next (new httpError("Admin not updated!",400))

        } else {

            res.status(200).json({ message:`admin updated` , data : updateAdmin })
        }

    }   catch (error) {
        return next (new httpError("Server Error",400))
    }
}




 //findOneAndDelete



export const deleteAdmin = async ( req, res, next)=>{
    try {
        const {id} = req.params;

        if (!id) {
            return next (new httpError("Error finding admin",400))
        }
        const deleteOneAdmin = await Admin.findOneAndDelete(
            { _id: id }
        )

        if ( !deleteOneAdmin ) {

           return next (new httpError("No admin found!",400))
        }

            res.status(202).json({message:`admin deleted successfully` ,data:deleteOneAdmin})

    }   catch (error) {
        return next (new httpError("Internal Server Error!",500))
    }
}

