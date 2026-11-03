
const Connection = require("../models/Connectionmodel");
const Users = require("../models/user");

const senconnetion = async (req, res) => {
  try {
    const { id } = req.params;
    const sender = req.user.id;

    const user = await Users.findById(sender);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receiver = await Users.findById(id);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender === id) {
      return res.status(400).json({
        message: "You cannot send a request to yourself",
      });
    }

    if (user.connection.includes(id)) {
      return res.status(400).json({
        message: "You are already connected",
      });
    }

    const existingRequest = await Connection.findOne({
      $or: [
        { sender, receiver: id, status: "pending" },
        { sender: id, receiver: sender, status: "pending" },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already exists",
      });
    }

    const newRequest = await Connection.create({
      sender,
      receiver: id,
    });

    await newRequest.populate(
      "sender",
      "firstname lastname profileimg headline location"
    );

    return res.status(200).json(newRequest);
  } catch (error) {
    console.error("Send connection error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const acceptconnection = async (req, res) => {
  try {
    const { connectionid } = req.params;

    const connection = await Connection.findById(connectionid).populate(
      "sender",
      "_id"
    );

    if (!connection) {
      return res.status(404).json({
        message: "Connection does not exist",
      });
    }

    if (String(connection.receiver) !== String(req.user.id)) {
      return res.status(403).json({
        message: "You cannot accept this request",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Request cannot be processed",
      });
    }

    connection.status = "accepted";
    await connection.save();

    await Users.findByIdAndUpdate(req.user.id, {
      $addToSet: { connection: connection.sender._id },
    });

    await Users.findByIdAndUpdate(connection.sender._id, {
      $addToSet: { connection: req.user.id },
    });

    return res.status(200).json({
      message: "Connection accepted",
    });
  } catch (error) {
    console.error("Accept connection error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const rejectconnection = async (req, res) => {
  try {
    const { connectionid } = req.params;

    const connection = await Connection.findById(connectionid);

    if (!connection) {
      return res.status(404).json({
        message: "Connection does not exist",
      });
    }

    if (String(connection.receiver) !== String(req.user.id)) {
      return res.status(403).json({
        message: "You cannot reject this request",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Request cannot be processed",
      });
    }

    connection.status = "rejected";
    await connection.save();

    return res.status(200).json({
      message: "Connection rejected",
    });
  } catch (error) {
    console.error("Reject connection error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getconnection = async (req, res) => {
  try {
    const targetUserId = req.params.user;
    const currentUserId = req.user.id;

    const connection = await Connection.findOne({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId },
      ],
    });

    if (!connection) {
      return res.json({ status: "not-connected" });
    }

    return res.json({ status: connection.status });
  } catch (error) {
    console.error("Get connection error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getconnectionrequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      receiver: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "firstname lastname profileimg headline location"
    );

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Get connection requests error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  senconnetion,
  acceptconnection,
  rejectconnection,
  getconnectionrequests,
  getconnection,
};
