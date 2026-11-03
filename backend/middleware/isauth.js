const jwt = require("jsonwebtoken");
require("dotenv").config();

const isauthuser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const verifytoken = jwt.verify(token, process.env.secretkey);

    if (!verifytoken) {
      return res.status(401).json({ message: "Token invalid" });
    }

  
    req.user = { id: verifytoken.id }; 

    next();
  } catch (error) {
   
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = isauthuser;