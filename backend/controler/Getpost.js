
const Postmodel = require("../models/Postmodels");

const Getposts = async (req, res) => {
  try {
    const userspost = await Postmodel.find()
      .populate(
        "author",
        "firstname lastname username profileimg headline location"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(userspost);

  } catch (error) {
    console.error("Get posts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch posts",
      error: error.message,
    });
  }
};

module.exports = { Getposts };
