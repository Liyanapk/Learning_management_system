
import Admin from "../../models/testAdmin.js";


//add admin

export const AddAdmin = async (req, res, next) => {

    try {
      const { first_name, last_name, email, age, phone_number, profile_pic, status, password } = req.body;
       const profilePicturePath = req.file.path.slice(8);  
  
      try {
        const newAdmin = new Admin(
            { first_name, last_name, email, age, phone_number, profile_pic :profilePicturePath, status, password} 
         );
    
        await newAdmin.save();

        res.status(201).json( { message: 'admin created successfully', data: newAdmin } );
        
      } catch (error) {
        console.log(error);
        
      }
    }   catch (error) {
        console.log(error)

        res.status(500).json( { message: 'Error creating user', error: error.message } );
    }
  };




  //find admin

  
export const findAdmin = async( req, res, next) =>{

    try {
        const { first_name, second_name } = req.params;
        const admin = await Admin.find({ first_name, last_name: second_name });

        if (admin.length === 0) {

            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: `${first_name} ${second_name} is found`, data: admin });
      

    } catch (error) {
        next(new Error("Error finding user: " + error.message));
    }

}


//find by id

export const findById = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const admin = await Admin.findById (id);
        
        res.status(200).json( { message:`admin is found` , data : admin} )
        
       
       
    }   catch (error) {
        next(new Error( "Error find admin: " + error.message ));

        res.status(500).json( { message:`Internal server error!` } )
    }

}




//findOneAddUpdate


export const findAndUpdate = async (req, res, next) =>{


    
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




//findOneAndDelete



export const finddelete = async ( req, res, next)=>{
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

