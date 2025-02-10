import jwt from "jsonwebtoken";
import httpError from "../utils/httpError.js";
import Student from "../models/student.js";

export const studentAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new httpError("Authentication token required", 401));
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(new httpError("Invalid or expired token", 401));
    }

    // Assign student ID to req.student
    req.student = { id: decoded.id };

    // Validate student from database
    try {
      const validStudent = await Student.findOne({
        _id: decoded.id,
        status: "active",
      });

      if (!validStudent) {
        return next(new httpError("Unauthorized - Student not found", 404));
      }

      next();
    } catch (dbError) {
      return next(new httpError("Database error during student validation", 500));
    }

  } catch (error) {
    return next(new httpError("Server error during authentication", 500));
  }
};
