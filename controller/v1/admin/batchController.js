import Batch from "../../../models/batch.js";
import httpError from "../../../utils/httpError.js";


//add batch

export const addBatch = async ( req, res, next ) => {
    try {

      const { batch_name, teacher_incharge } = req.body;

      if(!batch_name || !teacher_incharge) {
        return next(new httpError("Batch name and teacher incharge is required" ,400))
      }
       

      const batchExists  = await Batch.findOne( { batch_name } )

       if(batchExists){
        return next(new httpError("Batch already exsist!",404))
      }
  
      const newBatch = new Batch({ batch_name, teacher_incharge });
        await newBatch.save();
  
      res.status(201).json(newBatch);
  
    } catch (error) {
        console.log("error is :",error);
        
        return next(new httpError("Error creating batch",500))
    }
  };
  
  
//find batch

  export const listBatch = async( req, res, next) =>{

    try {
    
        const batch = await Batch.find();

        res.status(200).json( batch );
      

    } catch (error) {
       return next(new httpError("Error finding batch",500))
    }

}




//find by id



export const findBatch = async( req, res, next) =>{

    try {
        const { id } = req.params;
        if(!id){
            return next(new httpError("Not found!",404))
        }
        const batch = await Batch.findById (id);
        
        res.status(200).json( { message:`batch founded successfully` , data : batch} )
        
       
       
    }   catch (error) {
        
        return next (new httpError("Internal server error",500))
 
    }

}



//findOneAddUpdate


export const updateBatchDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;
        if(!id){
            return next(new httpError("Not found",400))
        }
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

         return next(new httpError("Batch not found",404))

        } else {

            res.status(200).json({ message:`batch updated successfully` , data : updateBatch })
        }

    }   catch (error) {
        
            return next(new httpError("internal server error"),500)
    }
}





//findOneAndDelete



export const deleteBatch = async ( req, res, next)=>{
    try {
        const { id } = req.params;

        if(!id){
            return next(new httpError("Not found",404))
        }
        const deleteOneBatch = await Batch.findOneAndDelete(
            { _id: id }
        )

        if ( !deleteOneBatch ) {

            return next(new httpError("No batch found",400))
        }

            res.status(202).json({ message:`batch deleted successfully` ,data:deleteOneBatch })

    }   catch (error) {
        return next(new httpError("Error in deleting batch",500))
    }
}



