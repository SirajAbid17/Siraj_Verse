const Connection = require("../models/connectionmodel");
const Users = require("../models/user");

const senconnetion = async (req, res) => {
  try {
    let { id } = req.params;
    let sender = req.user.id;
    let user = await Users.findById(sender);

    if (sender == id) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    if (user.connection.includes(id)) {
      return res.status(400).json({ message: "You are already connected" });
    }

    let existingRequest = await Connection.findOne({
      $or: [
        { sender, receiver: id, status: "pending" },
        { sender: id, receiver: sender, status: "pending" }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already exists" });
    }

    let newRequest = await Connection.create({
      sender,
      receiver: id
    });


    await newRequest.populate('sender', 'firstname lastname profileimg headline location');
    
    return res.status(200).json(newRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptconnection = async (req, res) => {
  try {
    let { connectionid } = req.params;
    let connection = await Connection.findById(connectionid).populate('sender', '_id');
    
    if (!connection) {
      return res.status(400).json({ message: "Connection does not exist" });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request cannot be processed" });
    }

    connection.status = "accepted";
    await connection.save();

    await Users.findByIdAndUpdate(req.user.id, {
      $addToSet: { connection: connection.sender._id }
    });

    await Users.findByIdAndUpdate(connection.sender._id, {
      $addToSet: { connection: req.user.id }
    });

    return res.status(200).json({ message: "Connection accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const rejectconnection = async (req, res) => {
  try {
    let { connectionid } = req.params;
    let connection = await Connection.findById(connectionid);
    
    if (!connection) {
      return res.status(400).json({ message: "Connection does not exist" });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request cannot be processed" });
    }

    connection.status = "rejected";
    await connection.save();

    return res.status(200).json({ message: "Connection rejected" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



const getconnection = async (req, res) => {
  try {
    let targetUserId = req.params.user;
    const currentUserId = req.user.id;

    let connection = await Connection.findOne({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId }
      ]
    });

    if (!connection) {
      return res.json({ status: 'not-connected' });
    }

    return res.json({ status: connection.status });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getconnectionrequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      receiver: req.user.id,
      status: "pending"
    }).populate("sender", "firstname lastname profileimg headline location");
    
    res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  senconnetion,
  acceptconnection,
  rejectconnection,
  getconnectionrequests,
  getconnection,
  
};