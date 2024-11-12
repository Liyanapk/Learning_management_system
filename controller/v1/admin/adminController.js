
import Admin from "../../../models/admin.js";
import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT 

//admin login


export const adminLogin =async(req, res, next) =>{

    try {


        const { email, password } =req.body 
        const admin = await Admin.findOne( { email })
       const token =jwt.sign(
        { id: admin._id , role: admin.role } , process.env.JWT 

       )
       res.status(200).json({message:"hai"},token)
    } catch (error) {
        res.status(500)

        console.log(error);
        
    }



}





















//add admin

export const addAdmin = async (req, res, next) => {

    try {
      const { first_name, last_name, email, dob, phone, status, password, role,age } = req.body;
      let profilePicturePath

      if(req.file){
         profilePicturePath = req.file.path.slice(8);
      } 
       
        const newAdmin = new Admin(
            { first_name, last_name, email, dob, phone, status, password, role, profile_pic:profilePicturePath,age} 
         );
        await newAdmin.save();

        res.status(201).json( { message: 'admin created successfully', data: newAdmin } );
        
    }   catch (error) {
        console.log(error)

        res.status(500).json( { message: 'Error creating user', error: error.message } );
    }
  };




//   //find admin

  
export const listAdmin = async( req, res, next) =>{

    try {

        const admin = await Admin.find();
        res.status(200).json(admin);
      

    } catch (error) {
        next(new Error("Error finding user: " + error.message));
    }

}


//find by id

export const getOneAdmin = async( req, res, next) =>{

    const { id } = req.params;

    if (!id) {
        res.status(400).json( { message:` ID error!` } )
    }

        const admin = await Admin.findOne( {_id: id} );

        if (!admin) {

            res.status(404).json( { message:` ADMIN error!` } )
        }else {

            res.status(200).json( { message:`admin is found` , data : admin} )
        }

}




//findOneAddUpdate


export const updateAdminDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
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

            res.status(400).json({ message:`admin not found` })

        } else {

            res.status(200).json({ message:`admin updated` , data : updateAdmin })
        }

    }   catch (error) {
        next( new Error("Error : " + error.message) );

        res.status(500).json({ message:`Internal server error!` })
    }
}




// //findOneAndDelete



export const deleteAdmin = async ( req, res, next)=>{
    try {
        const {id} = req.params;
        const deleteOneAdmin = await Admin.findOneAndDelete(
            { _id: id }
        )

        if ( !deleteOneAdmin ) {

            res.status(400).json({ message:`admin not find`, data:deleteOneAdmin })
        }

            res.status(202).json({message:`admin deleted successfully` ,data:deleteOneAdmin})

    }   catch (error) {
        next(new Error( "error deleting admin :" + error.message ))
    }
}

