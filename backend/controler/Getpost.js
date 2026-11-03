const Postmodel = require("../models/Postmodels")

const Getposts=async(req,res)=>{

    try {
        const userspost=await Postmodel.find().populate("author","firstname lastname username profileimg headline location")
        return res.status(200).json(userspost)
    } catch (error) {
        console.log(error)
    } 


}

module.exports={Getposts}