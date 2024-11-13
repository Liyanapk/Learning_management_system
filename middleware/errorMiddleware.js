export const errorMiddleware =(req, res, next)=>{



const statuscode = err.code ?? 500

res.status(statuscode).json( { status:false , message:err.message })

}