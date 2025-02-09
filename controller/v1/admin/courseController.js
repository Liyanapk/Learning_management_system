import Course from "../../../models/course.js"
import Teacher from "../../../models/teacher.js"
import httpError from "../../../utils/httpError.js"
import Stripe from "stripe";

export const courseAdd = async( req, res, next )=>{

    try {
        
        const { title, description, duration, teacher, disccountprice, originalPrice, videoUrl } = req.body
        
        if( !title || !description || !duration || !teacher || !disccountprice || !originalPrice || !videoUrl ){
            return next( new httpError( "All Credentials Are Required !",400))
        }

        if(!duration.startDate || !duration.endDate){
            return next (new httpError(" Both Dates Needed",400))
        }
 
        //duration logic
        const { startDate, endDate} = duration 

        const start = new Date(startDate)
        const end = new Date(endDate)
        
        if (start < new Date().setHours(0, 0 , 0 , 0)){
            return next(new httpError(" Starting Date must be a valid Date."),400)
        }

        if (end < start){
            return next(new httpError(" End Date must be a Date After Starting Date."),400)
        }

        const courseExsist = await Course.findOne( { title } )

        if (courseExsist){
            return next (new httpError("Already have a course in this title"),402)
        }

        const teacherExsist = await Teacher.findOne( {_id:teacher , "is_deleted.status":false } )
        if(! teacherExsist){
            return next (new httpError ("Teacher not found !"),402)
        }

        const newCourse = new Course({ title, description, duration, teacher, disccountprice, originalPrice, videoUrl })
        await newCourse.save();

        const getCourse = await Course.findById(newCourse._id).select('-__v -is_deleted -createdAt -updatedAt')
       
        res.status(200).json({
            status:true,
            message:"Course created Successfully",
            data:getCourse,
            access_token:null

        })

    } catch (error) {
        console.log(error);
        
        
    }

}



//get all course



export  const allCourse = async(req, res, next)=>{
    try {
        const courses = await Course.find().select('-__v -is_deleted -createdAt -updatedAt')

        if(!courses){
            return next(new httpError("No course Found",400))
        }

        res.status(200).json({
            status :true,
            message:"All Course fetched successfully",
            data:courses,
            access_token:null

        })
        
    } catch (error) {
        console.log(error);
        
    }

}


//find course by their id

export const oneCourse = async(req, res, next)=>{
    try {
         const { id } = req.params
         if(! id){
            return next (new httpError("Id required !"),400)
         }

         const getCourse = await Course.findById( { _id :id })

         res.status(200).json({
            status:true,
            message :"Course fetched Successfully",
            data: getCourse,
            access_token: null

         })
        
    } catch (error) {
        console.log(error);
        
    }
}




//stripe integration 

export const checkOutSession = async(req, res, next)=>{

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {

        const { courseId } = req.body

        if(! courseId){
            return next(new httpError("courde id not find"),400)
        }

        const findCourse = await Course.findById({ _id:courseId })

        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items : [
                {
                    price_data : {
                        currency : 'usd',
                        product_data:{
                            name : findCourse.title,
                            description : findCourse.description
                        },
                        unit_amount : Math.round(findCourse.disccountprice*100)
                    },
                    quantity:1
                }
            ],
            mode:'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            

        })
        res.status(200).json({ url: session.url })
        
    } catch (error) {
        console.log(error)
    }
}



