const express = require("express");
const isauthuser = require("../middleware/isauth");
const { currentusers, saveprofileusers } = require("../controler/usercontroler");
const uploads = require("../middleware/fileuploadmulter");
const Users = require("../models/user"); 

const userroute = express.Router();

userroute.get("/currentuser", isauthuser, currentusers);
userroute.put('/updateprofile', isauthuser, uploads.fields([{name:"profileimg",maxCount:1},{name:"coverimg",maxCount:1 }]), saveprofileusers);


userroute.get("/users", isauthuser, async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

userroute.get("/user/:id", isauthuser, async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

module.exports = userroute;