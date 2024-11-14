import jwt from 'jsonwebtoken';
import httpError from '../utils/httpError.js';
import Admin from '../models/admin.js';

const secretKey = '5?#562@' 
export const adminAuth = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return next(new httpError("Authentication token required", 401));
        }

        const token = authHeader.split(" ")[1];
        
        
        jwt.verify(token, secretKey, async (err, decoded) => {

            if (err) {
                console.error("Token verification error:", err);
                return next(new httpError("Invalid or expired token", 401));
            }

            req.Admin = decoded;
            console.log(decoded);
            

            try {

                const validAdmin = await Admin.findOne({ _id: decoded.id, "isDeleted.status": false, status: "active" });

                if (!validAdmin) {
                    return next(new httpError("Unauthorized - Admin not found or inactive", 404));
                }

                next();
            } catch (dbError) {

                return next(new httpError("Database error during admin validation", 500));
            }

        });

    } catch (error) {

        return next(new httpError("Server error during authentication", 500));
    }
    
};