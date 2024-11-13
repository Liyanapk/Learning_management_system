import Batch from "../../../models/batch.js";
import httpError from "../../../utils/httpError.js";


//add batch

export const addBatch = async ( req, res, next ) => {
    try {

      const { batch_name, in_charge } = req.body;
      
      //required
      if(!batch_name || !in_charge) {
        return next(new httpError("Batch name and teacher incharge is required" ,400))
      }
       
      //exist batch
      const batchExists  = await Batch.findOne( { batch_name } )

       if(batchExists){
        return next(new httpError("Batch name already exsist!",404))
      }
      

      //create new batch
      const newBatch = new Batch({ batch_name, in_charge });
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
    
        const batch = await Batch.find( { "is_deleted.status":false });

        if(!batch){
            return next(new httpError("Error finding batch",400))
        }
        res.status(200).json( batch );
      

    } catch (error) {
       return next(new httpError("Internal server Error",500))
    }

}




//find by id



export const findBatch = async( req, res, next) =>{

    try {
        const { id } = req.params;
        if(!id){
            return next(new httpError("Not found!",404))
        }
        const batch = await Batch.findOne( {_id: id ,"is_deleted.status": false });
        
        if(!batch){
            return next(new httpError("NO batch found",400))
        }

        res.status(200).json( { message:`batch founded successfully` , data : batch} )
        
       
       
    }   catch (error) {
        
        return next (new httpError("Internal server error",500))
 
    }

}



//findOneAddUpdate


export const updateBatchDetailes = async (req, res, next) =>{


    
    try {
        const { id } = req.params;

        //if id not present
        if(!id){
            return next(new httpError("Not found",400))
        }

        const { batch_name, in_charge } = req.body;
        

        //required
        if(!batch_name || !in_charge) {
            return next(new httpError("Batch name and teacher incharge is required" ,400))
          }

        if(req.file && req.file.path){
         BatchData.profile_pic = req.file.path.slice(8)
         
        }
        const BatchData = { batch_name, in_charge }
       
         const updateBatch = await Batch.findOneAndUpdate (
            { _id: id },
            { $set: BatchData },
            { new: true, runValidators: true }
        );


        if (!updateBatch) {

         return next(new httpError("Batch not found",404))

        } 
         res.status(200).json({ message:`batch updated successfully` , data : updateBatch })
        

    }    catch (error) {
        
         return next(new httpError("internal server error"),500)
    }
}





//findOneAndDelete



export const deleteBatch = async ( req, res, next)=>{
    try {
        const { id } = req.params;

        //id not present then
        if( !id ){
            return next( new httpError( "Not found",404 ) )
        }

        //soft delete
        const deleteOneBatch = await Batch.findOneAndUpdate(
            { _id: id , "is_deleted.status":false },
            {
                $set:{
                    "is_deleted.status":true,
                    "is_deleted.deleted_by":req.admin.id,
                    "is_deleted.deleted_at":new Date(),
                }
            },
            {new :true}
        );

        if ( !deleteOneBatch ) {

            return next(new httpError("No batch found",400))
        }

            res.status(202).json({ message:`batch deleted successfully` , data:deleteOneBatch })

    }   catch (error) {
        return next(new httpError("Error in deleting batch",500))
    }
}



