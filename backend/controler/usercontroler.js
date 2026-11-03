const Users = require("../models/user");

const currentusers = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User not authenticated" });
    }

    const user = await Users.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Current User Error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const saveprofileusers = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User not authenticated" });
    }

    let skills, education, experience;

    try {
      skills =
        typeof req.body.skills === "string"
          ? JSON.parse(req.body.skills)
          : req.body.skills || [];
      education =
        typeof req.body.education === "string"
          ? JSON.parse(req.body.education)
          : req.body.education || [];
      experience =
        typeof req.body.experience === "string"
          ? JSON.parse(req.body.experience)
          : req.body.experience || [];
    } catch (parseError) {
      console.error("Parse Error:", parseError.message);
      return res
        .status(400)
        .json({ message: "Invalid data format for array fields" });
    }

    if (!req.body.firstname || !req.body.lastname || !req.body.username) {
      return res
        .status(400)
        .json({ message: "First name, last name, and username are required" });
    }

    const updateData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      headline: req.body.headline || "",
      location: req.body.location || "",
      gender: req.body.gender || undefined,
      skills,
      education,
      experience,
      updatedAt: new Date(),
    };

    if (req.files?.profileimg) {
      updateData.profileimg = req.files.profileimg[0].path;
    }
    if (req.files?.coverimg) {
      updateData.coverimg = req.files.coverimg[0].path;
    }

    const updatedUser = await Users.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Save Profile Error:", error.message);

    if (error.code === 11000 && error.keyPattern.username) {
      return res.status(400).json({
        message: "Username already exists",
        error: "Duplicate username",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

module.exports = { currentusers, saveprofileusers };
