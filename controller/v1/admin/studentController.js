import Student from "../../../models/student.js";
import bcrypt from "bcrypt";
import httpError from "../../../utils/httpError.js";
import mongoose from "mongoose";





//create student

export const addStudent = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      gender,
      dob,
      status,
      parent_name,
      parent_number,
      address,
      password, 
    } = req.body;

    //age logic

    const calculateAge = (dob) => {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();
      if (
        month < birthDate.getMonth() ||
        (month === birthDate.getMonth() && day < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    // all feild required
    if (
      !first_name ||
      !last_name ||
      !email ||
      !dob ||
      !phone ||
      !status ||
      !gender ||
      !parent_name ||
      !parent_number ||
      !address ||
      !password
    ) {
      return next(new httpError("All credentials are Required!", 400));
    }

    //email

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new httpError("Invalid email format!", 400));
    }

    // //password

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
        return next(new httpError("Password must be at least 8 characters long, include a letter, a number, and a special character.", 400));
    }

    //phone

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone, parent_number)) {
      return next(
        new httpError("Phone number must be a 10-digit number.", 400)
      );
    }

    // Check if student already exists
    const studentExsist = await Student.findOne({
      $or: [{ email }, { phone }],
    });

    if (studentExsist) {
      return next(
        new httpError("student with this email or phone already exists!", 400)
      );
    }

    // //hashed password

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_VALUE));

    //picture path
    let profilePicturePath;
    if (req.file) {
      profilePicturePath = req.file.path.slice(8);
    }

    //student_id

    function studentID(firstName, phoneNumber, lastName) {
      const first = firstName.toUpperCase().slice(0, 2);
      const number = phoneNumber.toString().slice(7);
      const last = lastName.toLowerCase().slice(0, 1);
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart("0", 3);

      return `${first}${number}${last}${random}`;
    }

    const studentId = studentID(first_name, phone, last_name);

    const newStudent = new Student({
      first_name,
      last_name,
      email,
      phone,
      gender,
      dob,
      student_id: studentId,
      status,
      //   password: hashedPassword,
    
      profile_pic: profilePicturePath,
      age: calculateAge(dob),
      parent_name,
      parent_number,
      address,
      password: hashedPassword,
    });

    await newStudent.save();

    const getStudent = await Student.findById(newStudent._id)
      .select("-__v -is_deleted -createdAt -updatedAt")
      .populate({
          path: "in_charge",
          select: "first_name last_name",
      });
    res
      .status(201)
      .json({ message: "student created successfully", data: getStudent });
  } catch (error) {
    console.log(error);

    return next(new httpError("error creating student", 500));
  }
};

//list

export const listStudent = async (req, res, next) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;

    //filtering
    const filter = { "is_deleted.status": false };
    if (req.query.searchTerm) {
      filter.$or = [
        { first_name: { $regex: req.query.searchTerm, $options: "i" } },
        { last_name: { $regex: req.query.searchTerm, $options: "i" } },
        { status: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    //sorting
    const sort = {};
    if (req.query.sortBy) {
      const [field, order] = req.query.sortBy.split(":");
      sort[field] = order === "desc" ? -1 : 1;
    }

    //result
    const total = await Student.countDocuments(filter);

    const allStudent = await Student.find(filter)
      .sort(sort)
      .select("-password -is_deleted -__v -createdAt -updatedAt -__v")
      .populate({
          path: "in_charge",
          select: "first_name last_name",
      });

    //response send
    res.status(200).json({
      message: "Student retrieved successfully",
      data: allStudent,

      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    return next(new httpError("Internal server error", 500));
  }
};

// find by id
export const findStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ensure ID is provided in the request
    if (!id) {
      return next(new httpError("Id not found", 400));
    }

    // Find student by ID and ensure it's not deleted
    const student = await Student.findOne({
      _id: id,
      "is_deleted.status": false,
    })
      .select("-password -is_deleted -__v -createdAt -updatedAt")
      .populate({
        path: "in_charge",
        select: "first_name last_name",
      });

    // If no student found, return 404
    if (!student) {
      return next(new httpError("Student not found", 404));
    }

    res.status(200).json({
      message: "Student found successfully",
      data: student,
    });
  } catch (error) {
    console.log(error);
    return next(new httpError("Internal server error", 500));
  }
};

//findOneAddUpdate

export const updateStudentDetailes = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new httpError("No ID found", 400));
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      gender,
      dob,
      status,
      password,
      parent_name,
      parent_number,
      address,
    } = req.body;

    //age logic
    const calculateAge = (dob) => {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();
      if (
        month < birthDate.getMonth() ||
        (month === birthDate.getMonth() && day < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    //updated value
    const updateData = {
      first_name,
      last_name,
      email,
      phone,
      gender,
      dob,
      status,
      parent_name,
      parent_number,
      address,
    };

    //  email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (req.body.email && !emailRegex.test(email)) {
      return next(new httpError("Invalid email format!", 400));
    }

    //  phone
    const phoneRegex = /^\d{10}$/;

    if (
      (req.body.phone && !phoneRegex.test(req.body.phone)) ||
      (req.body.parent_number && !phoneRegex.test(req.body.parentNumber))
    ) {
      return next(
        new httpError("Phone number must be a 10-digit number.", 400)
      );
    }

    // validate and hash password
    if (req.body.password) {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordRegex.test(password)) {
        return next(
          new httpError(
            "Password must be at least 6 characters long, include a letter, a number, and a special character.",
            400
          )
        );
      }

      const saltRounds = process.env.SALT_VALUE
        ? parseInt(process.env.SALT_VALUE)
        : 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    // set age
    if (req.body.dob) {
      updateData.age = calculateAge(dob);
    }

    // set profile picture path
    if (req.file) {
      updateData.profile_pic = req.file.path.slice(8);
    }

    // Checking  student with email or phone already exists
    const studentExist = await Student.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: id },
    });
    if (studentExist) {
      return next(
        new httpError("A student with this email or phone already exists!", 400)
      );
    }

    const updateStudent = await Student.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const getUpdatedStudent = await Student.findById(updateStudent._id)
      .select("-password -is_deleted -__v -createdAt -updatedAt -__v")
      .populate({
          path: "in_charge",
          select: "first_name last_name",
       
      });

    if (!updateStudent) {
      return next(new httpError("Student not found", 404));
    } else {
      res.status(200).json({
        message: `Student updated successfully`,
        data: getUpdatedStudent,
      });
    }
  } catch (error) {
    return next(new httpError("Internal server error", 500));
  }
};

//findAndDelete

export const deleteManyStudents = async (req, res, next) => {
  try {
    const { ids } = req.body; // Expecting an array of MongoDB _id values in the request body

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new httpError("No MongoDB IDs provided", 400));
    }

    // Convert ids to ObjectId
    const objectIds = ids
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return mongoose.Types.ObjectId.createFromHexString(id); // Use the updated method here
        } else {
          return null;
        }
      })
      .filter(Boolean); // Remove invalid IDs

    if (objectIds.length === 0) {
      return next(new httpError("No valid MongoDB IDs provided", 400));
    }

    const updateResult = await Student.updateMany(
      {
        _id: { $in: objectIds },
        "is_deleted.status": false,
      },
      {
        $set: {
          "is_deleted.status": true,
          "is_deleted.deleted_by": req.Admin.id,
          "is_deleted.deleted_at": new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return next(new httpError("No students found or already deleted", 404));
    }

    res.status(202).json({
      message: `Successfully deleted ${updateResult.modifiedCount} students.`,
    });
  } catch (error) {
    console.log("err", error);
    return next(new httpError("Error deleting students", 500));
  }
};
