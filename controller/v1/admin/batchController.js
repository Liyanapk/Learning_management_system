import Batch from "../../../models/batch.js";
import httpError from "../../../utils/httpError.js";
import mongoose from "mongoose";

//add batch

export const addBatch = async (req, res, next) => {
  try {
    const { name, in_charge, type, status, duration } = req.body;

    //required
    if (!name || !in_charge || !type || !status || !duration) {
      return next(new httpError("All credentials are required", 400));
    }

    if (!duration.from || !duration.to) {
      return next(new httpError("both date feild required", 403));
    }

    //duration logic
    const from = new Date(duration.from);
    const to = new Date(duration.to);

    if (from < new Date().setHours(0, 0, 0, 0)) {
      return next(new httpError("Date must be a valid date", 401));
    }

    if (to < from) {
      return next(new httpError("Date must be after 'from' date ", 402));
    }

    //exist batch
    const batchExists = await Batch.findOne({ name });

    if (batchExists) {
      return next(new httpError("Batch name already exsist!", 404));
    }

    //create new batch
    const newBatch = new Batch({ name, in_charge, type, status, duration });

    await newBatch.save();

    const getBatch = await Batch.findById(newBatch._id).select(
      "-__v -createdAt -updatedAt -is_deleted"
    );
    res.status(201).json({
      status: true,
      message: "batch created successfully",
      data: getBatch,
      access_token: null,
    });
  } catch (error) {
    console.log("error is :", error);

    return next(new httpError("Error creating batch", 500));
  }
};

//FIND BATCH

export const listBatch = async (req, res, next) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    //filtering
    const filter = { "is_deleted.status": false };
    if (req.query.searchTerm) {
      filter.$or = [
        { name: { $regex: req.query.searchTerm, $options: "i" } },
        { type: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    //sorting
    const sort = {};
    if (req.query.sortBy) {
      const [field, order] = req.query.sortBy.split(":");
      sort[field] = order === "desc" ? -1 : 1;
    }

    //result
    const total = await Batch.countDocuments(filter);

    const allBatches = await Batch.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-password -is_deleted -__v -createdAt -updatedAt")
      .populate({
        path: "in_charge",
        select: " first_name last_name email status profile_image",
        populate: {
          path: "subject",
          select: "subject_name -_id",
        },
      });

    //response send
    res.status(200).json({
      message: "Batch retrieved successfully",
      data: allBatches,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    return next(new httpError("Internal server Error", 500));
  }
};

//find by id

export const findBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new httpError("Batch Id required!", 404));
    }
    const batch = await Batch.findOne({ _id: id, "is_deleted.status": false });

    if (!batch) {
      return next(new httpError("NO batch found", 400));
    }

    const getBatch = await Batch.findById(batch._id)
      .select("-password -is_deleted -__v -createdAt -updatedAt")
      .populate({
        path: "in_charge",
        select: " first_name last_name email status profile_image",
        populate: {
          path: "subject",
          select: "name",
        },
      });

    res
      .status(200)
      .json({ message: `batch founded successfully`, data: getBatch });
  } catch (error) {
    return next(new httpError("Internal server error", 500));
  }
};

//findOneAddUpdate

export const updateBatchDetailes = async (req, res, next) => {
  try {
    const { id } = req.params;

    //if id not present
    if (!id) {
      return next(new httpError("Not found", 400));
    }

    const { name, in_charge, type, status, duration } = req.body;

    if (req.file && req.file.path) {
      BatchData.profile_pic = req.file.path.slice(8);
    }
    const BatchData = { name, in_charge, type, status, duration };

    const updateBatch = await Batch.findOneAndUpdate(
      { _id: id },
      { $set: BatchData },
      { new: true, runValidators: true }
    );

    if (!updateBatch) {
      return next(new httpError("Batch not found", 404));
    }

    const getOneBatch = await Batch.findById(updateBatch._id)
      .select("-password -is_deleted -__v -createdAt -updatedAt")
      .populate([
        {
          path: "in_charge",
          select: "first_name last_name email status subject profile_image",
          populate: {
            path: "subject",
            select: "name",
          },
        },
      ]);

    res
      .status(200)
      .json({ message: `batch updated successfully`, data: getOneBatch });
  } catch (error) {
    console.log(error);
    return next(new httpError("internal server error"), 500);
  }
};



//findOneAndDelete

export const deleteManyBatches = async (req, res, next) => {
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

    const updateResult = await Batch.updateMany(
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
      return next(new httpError("No Batch found or already deleted", 404));
    }

    res.status(202).json({
      message: `Successfully deleted ${updateResult.modifiedCount} Batch.`,
    });
  } catch (error) {
    console.log("err", error);
    return next(new httpError("Error deleting Batch", 500));
  }
};
