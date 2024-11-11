import Batch from "../../models/testBatch.js";


//add batch

export const AddBatch = async ( req, res, next ) => {
    try {
      const { batch_name, teacher_id, } = req.body;
      console.log(req.body);
  
      if (!batch_name || !teacher_id) {
        return res.status(400).json( { message: "Batch name and teacher id is required" } );
      }
  
      const newBatch = new Batch({
        batch_name, teacher_id,
      });
      await newBatch.save();
  
      res.status(201).json( { message: "Batch created successfully", data: newBatch } );
  
    } catch (error) {
      console.log(error);
      next(new Error("Error creating batch: " + error.message));
    }
  };
  
  
//find batch

  export const findBatch = async( req, res, next) =>{

    try {
        const { batch_name } = req.params;
        const batch = await Batch.find( { batch_name } );

        if (batch.length === 0) {

            return res.status(404).json({ message: 'batch not found' });
        }

        res.status(200).json({ message: ` founded ${batch_name} successfully`, data: batch });
      

    } catch (error) {
        next(new Error("Error finding batch: " + error.message));
    }

}




//find by id



export const findBatchById = async( req, res, next) =>{

    try {
        const { id } = req.params;
        const batch = await Batch.findById (id);
        
        res.status(200).json( { message:`batch founded successfully` , data : batch} )
        
       
       
    }   catch (error) {
        next(new Error( "Error find batch: " + error.message ));

        res.status(500).json( { message:`Internal server error!` } )
    }

}



//findOneAddUpdate


export const findAndUpdateBatch = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
        const BatchData = {...req.body};
        
        if(req.file && req.file.path){
         BatchData.profile_pic = req.file.path.slice(8)
         
        }

       
         const updateBatch = await Batch.findOneAndUpdate (
            { _id: id },
            { $set: BatchData },
            { new: true, runValidators: true }
        );


        if (!updateBatch) {

            res.status(400).json({ message:`batch not found` })

        } else {

            res.status(200).json({ message:`batch updated successfully` , data : updateBatch })
        }

    }   catch (error) {
        next( new Error("Error : " + error.message) );

        res.status(500).json({ message:`Internal server error!` })
    }
}





//findOneAndDelete



export const deleteBatch = async ( req, res, next)=>{
    try {
        const { id } = req.params;
        const deleteOneBatch = await Batch.findOneAndDelete(
            { _id: id }
        )

        if ( !deleteOneBatch ) {

            res.status(400).json({ message:`batch not find`, data:deleteOneBatch })
        }

            res.status(202).json({ message:`batch deleted successfully` ,data:deleteOneBatch })

    }   catch (error) {
        next(new Error( "error deleting batch :" + error.message ))
    }
}



