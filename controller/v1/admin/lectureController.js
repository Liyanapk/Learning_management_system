import Lecture from "../../../models/lecture.js";
import httpError from '../../../utils/httpError.js'
import Batch from '../../../models/batch.js'
import Teacher from '../../../models/teacher.js'





export const addLecture = async(req, res, next)=>{

    try {

        const { slot, link, status, subject, batch, teacher, attendees, notes} = req.body

        if( ! slot || ! link || ! status || ! subject || ! batch || ! teacher || ! attendees || ! notes){
            return next(new httpError("all credentials are required!",400))
        }

        if(!slot.from || !slot.to){
            return next(new httpError("from and to dates are required",400))
        }

        if(! link.live && ! link.recorded){
            return next(new httpError("Live or recorded link needed!",400))
        }


      //slot logic
      const from = new Date(slot.from);
      const to = new Date(slot.to);

      if(from < new Date().setHours(0,0,0,0)){
        return next(new httpError("Date must be a valid date",401))
      }

      if(to < from ){
        return next(new httpError("Date must be after 'from' date ",402))
      }
      

      // Validate if batch and teacher  exist
        const batchExists = await Batch.findOne({ _id: batch, "is_deleted.status": false });
        if (!batchExists) {
            return next(new httpError("Batch not found", 404));
        }

        const teacherExists = await Teacher.findOne({ _id: teacher, "is_deleted.status": false });
        if (!teacherExists) {
            return next(new httpError("Teacher not found", 404));
        }

       
      

      const newLecture = new Lecture({ slot, link, status, subject, batch, teacher, attendees, notes });
      await newLecture.save();

      const getLecture = await Lecture.findById(newLecture._id).select('-__v -is_deleted -createdAt -updatedAt')
      .populate({
        path:'attendees',
        select:'first_name last_name status',
      })
      .populate({
        path: 'batch',
        select: 'name', 
    })
    .populate({
        path: 'teacher',
        select: 'first_name last_name email', 
    });


      res.status(201).json({
      status:true,
      message:"lecture created successfully",
      data:getLecture,
      access_token:null
      });
       
        
    } catch (error) {
    
        return next(new httpError("Internal server error",505))
        
    }
} 




//LIST ALL LECTURE



export const listLecture = async(req, res, next)=>{
    try {
        
        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        //filtering
        const filter = {"is_deleted.status": false};
        if(req.query.searchTerm){

            filter.$or=[
                { status : { $regex: req.query.searchTerm, $options: 'i' } }
              
            ]
        }

        //sorting
        const sort = {};
        if(req.query.sortBy){
            const [field,order] = req.query.sortBy.split(':');
            sort [field] = order === 'desc' ? -1 : 1;
        }
        

    


        //result
        const total = await Lecture.countDocuments(filter);

        const allLecture = await Lecture.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-__v -is_deleted -createdAt -updatedAt')
          .populate({
            path:'attendees',
            select:'first_name last_name status',
          })
          .populate({
            path: 'batch',
            select: 'name', 
        })
        .populate({
            path: 'teacher',
            select: 'first_name last_name email', 
        });
    


        //response send
        res.status(200).json({
            message: 'Lecture retrieved successfully',
            data: allLecture,
            totalPages: Math.ceil(total/limit),
            currentPage: page,
            totalItems: total,
          });



    } catch (error) {
        console.log(error)

        return next(new httpError("internal server error",505))
        
    }
}




//GET ONE LECTURE



export const findLecture = async( req, res, next) =>{

    try {
        const { id } = req.params;

        if(!id){
            return next(new httpError("Id not found",400))
        }

        const lecture = await Lecture.findOne( { _id: id ,"is_deleted.status": false });

        if (!lecture) {
            return next(new httpError("Lecture not found", 404));
        } 

        const getLecture = await Lecture.findById(lecture._id).select('-is_deleted -__v -createdAt -updatedAt -__v')
        .populate({
            path:'attendees',
            select:'first_name last_name status',
          })
          .populate({
            path: 'batch',
            select: 'name', 
        })
        .populate({
            path: 'teacher',
            select: 'first_name last_name email', 
        });
        
        res.status(200).json( { message:`lecture founded successfully` , data : getLecture} )
        
       
       
    }   catch (error) {
        console.log(error)
        return next(new httpError("internal server error",500))
    }

}



//UPDATE LECTURE

export const updateLecture = async(req, res, next)=>{

    try {

        const { id } = req.params;
        
        if(!id){
            return next(new httpError("ID not found!",400))
        }

        const { slot, link, status, subject, batch, teacher, attendees, notes} = req.body

        const updatedFeild ={};
    //slot logic
       
    if(slot){

      const from = new Date(slot.from);
      const to = new Date(slot.to);

      if(from < new Date().setHours(0,0,0,0)){
        return next(new httpError("Date must be a valid date",401))
      }
      if(to < from ){
        return next(new httpError("Date must be after 'from' date ",402))
      }
      updatedFeild.slot = slot
    }
      if(link) updatedFeild.link = link;
      if(status) updatedFeild.status = status;
      if(subject) updatedFeild.subject = subject;


      // Validate if batch and teacher  exist
      if(batch){

        const batchExists = await Batch.findOne({ _id: batch, "is_deleted.status": false });
        if (!batchExists) {
            return next(new httpError("Batch not found", 404));
        }
        updatedFeild.batch = batch;

      }
       
       if(teacher){
        const teacherExists = await Teacher.findOne({ _id: teacher, "is_deleted.status": false });
        if (!teacherExists) {
            return next(new httpError("Teacher not found", 404));
        }

        updatedFeild.teacher = teacher;

       }
       if (attendees) updatedFeild.attendees = attendees;
       if (notes) updatedFeild.notes = notes;



        const updateLecture = await Lecture.findOneAndUpdate (
            { _id: id },
            { $set: updatedFeild },
            { new: true, runValidators: true }
        );

      
      

      const getLecture = await Lecture.findById(updateLecture._id).select('-__v -is_deleted -createdAt -updatedAt')
      .populate({
        path:'attendees',
        select:'first_name last_name status',
      })
      .populate({
        path: 'batch',
        select: 'name', 
    })
    .populate({
        path: 'teacher',
        select: 'first_name last_name email', 
    });


      res.status(201).json({
      status:true,
      message:"lecture created successfully",
      data:getLecture,
      access_token:null
      });
       
        
    } catch (error) {
    console.log(error)
        return next(new httpError("Internal server error",505))
        
    }
} 




//DELETE LECTURE


export const deletelecture = async ( req, res, next)=>{
    try {
        const { id } = req.params;

        //id not present then
        if( !id ){
            return next( new httpError( "ID Not found",404 ) )
        }

        //soft delete
        const deleteOneLecture = await Lecture.findOneAndUpdate(
            { _id: id , "is_deleted.status":false },
            {
                $set:{
                    "is_deleted.status":true,
                    "is_deleted.deleted_by":req.Admin.id,
                    "is_deleted.deleted_at":new Date(),
                }
            },
            {new :true}
        );

        if ( !deleteOneLecture ) {

            return next(new httpError("No lecture found",400))
        }

            res.status(202).json({ message:`Lecture deleted successfully` })

    }   catch (error) {
        console.log(error)
        return next(new httpError("Error in deleting batch",500))
    }
}
