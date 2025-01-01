import Admin from "../../../models/admin.js";
import jwt from "jsonwebtoken";
import httpError from "../../../utils/httpError.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

//admin login

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new httpError(" email and password Required!"));
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return next(new httpError("Admin not found ", 400));
    }
    //comparing both password
    const passwordValid = await bcrypt.compare(password, admin.password);

    if (!passwordValid) {
      return next(new httpError("invalid credentials", 402));
    }

    //jwt token

    const token = jwt.sign(
      { id: admin.id, role: Admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({ message: "Login successfull", token });
  } catch (error) {
    return next(new httpError("Failed to login", 500));
  }
};

//add admin

export const addAdmin = async (req, res, next) => {
  try {
    const { first_name, last_name, email, dob, phone, status, password, role } =
      req.body;

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
      !password ||
      !role
    ) {
      return next(new httpError("All credentials are Required!", 400));
    }

    //email

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new httpError("Invalid email format!", 400));
    }

    //password

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

    //phone

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return next(
        new httpError("Phone number must be a 10-digit number.", 400)
      );
    }

    // Check if admin already exists
    const adminExsist = await Admin.findOne({ $or: [{ email }, { phone }] });

    if (adminExsist) {
      return next(
        new httpError("Admin with this email or phone already exists!", 400)
      );
    }

    //hashed password

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_VALUE)
    );

    //picture path
    let profilePicturePath;
    if (req.file) {
      profilePicturePath = req.file.path.slice(8);
    }

    const newAdmin = new Admin({
      first_name,
      last_name,
      email,
      dob,
      phone,
      status,
      password: hashedPassword,
      role,
      profile_pic: profilePicturePath,
      age: calculateAge(dob),
    });

    await newAdmin.save();

    const adminData = await Admin.findById(newAdmin._id).select(
      "-is_deleted -createdAt -updatedAt -__v "
    );

    res.status(201).json({
      status: true,
      message: "Admin created successfully",
      data: adminData,
      access_token: null,
    });
  } catch (error) {
    console.log(error);
    return next(new httpError("Failed to create admin", 500));
  }
};

//find admin

export const listAdmin = async (req, res, next) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

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
    const total = await Admin.countDocuments(filter);

    const allAdmins = await Admin.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-password -is_deleted -__v -createdAt -updatedAt");

    //response send
    res.status(200).json({
      status: true,
      message: "Admins retrieved successfully",
      data: allAdmins,
      access_token: null,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    return next(new httpError(" Server Error ", 500));
  }
};

//find by id

export const getOneAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new httpError("Error finding admin", 400));
    }
    //not show soft deleted
    const admin = await Admin.findOne({ _id: id, "is_deleted.status": false });

    const getAdmin = await Admin.findById(admin._id).select(
      "-__v -createdAt -updatedAt -is_deleted -password"
    );

    if (!admin) {
      return next(new httpError("Admin not present!", 402));
    } else {
      res.status(200).json({
        status: true,
        message: `admin is found`,
        data: getAdmin,
        access_token: null,
      });
    }
  } catch (error) {
    return next(new httpError("Internal Server Error", 500));
  }
};

//findOneAddUpdate

export const updateAdminDetailes = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new httpError("Error finding admin", 400));
    }

    const { first_name, last_name, email, dob, phone, status, password, role } =
      req.body;

    // age logic
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

    const updateData = {
      first_name,
      last_name,
      email,
      dob,
      phone,
      status,
      role,
    };

    //  email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (req.body.email && !emailRegex.test(email)) {
      return next(new httpError("Invalid email format!", 400));
    }

    //  phone
    const phoneRegex = /^\d{10}$/;
    if (req.body.phone && !phoneRegex.test(phone)) {
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

    //check if the admin with same email or password is there (exclude the updating admin ID)
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: id },
    });
    if (existingAdmin) {
      return next(
        new httpError("admin with this email and phone already exist", 300)
      );
    }

    // detailes of updates admin
    const updateAdmin = await Admin.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const getAdmin = await Admin.findById(updateAdmin._id).select(
      "-__v -createdAt -updatedAt -is_deleted"
    );

    if (!updateAdmin) {
      return next(new httpError("Admin not updated!", 400));
    }

    res.status(200).json({
      status: true,
      message: "Admin updated",
      data: getAdmin,
      access_token: null,
    });
  } catch (error) {
    console.error("Error in updateAdminDetailes:", error);
    return next(new httpError("Server Error", 500));
  }
};

//findOneAndDelete

export const deleteManyAdmins = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new httpError("No MongoDB IDs provided", 400));
    }

    const objectIds = ids
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return mongoose.Types.ObjectId.createFromHexString(id);
        } else {
          return null;
        }
      })
      .filter(Boolean);

    if (objectIds.length === 0) {
      return next(new httpError("No valid MongoDB IDs provided", 400));
    }

    const updateResult = await Admin.updateMany(
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
      return next(new httpError("No Admin found or already deleted", 404));
    }

    res.status(202).json({
      message: `Successfully deleted ${updateResult.modifiedCount} Admin.`,
    });
  } catch (error) {
    console.log("err", error);
    return next(new httpError("Error deleting admin", 500));
  }
};
