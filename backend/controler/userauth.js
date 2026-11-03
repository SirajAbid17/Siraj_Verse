const Users = require("../models/user")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
require('dotenv').config()


const signup=async(req,res)=>{
try {
    let {firstname,lastname,username,email,password}=req.body
    let user=await Users.findOne({email})
    if(user){
        return res.status(400).json({message:"user already exists"})
    }

    else{
        const salt=await bcrypt.genSalt(10)
        const hashpassword=await bcrypt.hash(password,salt)
        const createuser=await Users.create({
            firstname,
            lastname,
            username,
            email,
            password:hashpassword
        })
        const result=await createuser.save()
        const token=jwt.sign({id:result._id},process.env.secretkey,{expiresIn:"7d"})
        res.cookie("token",token,{
             httpOnly: true,        
  secure: process.env.NODE_ENV === "production", 
  sameSite: "strict",     
  maxAge: 7 * 24 * 60 * 60 * 1000 
        })
       return res.status(201).json({user:result,token:token})
    }
} catch (error) {
    console.log(error)
     return res.status(500).json(error)
}
}


const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Incorrect password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.secretkey, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ success: true, message: "Login successful", token });
};


const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};



module.exports={signup,login,logout}