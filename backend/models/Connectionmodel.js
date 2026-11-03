const mongoose=require("mongoose")

let coneectionschema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
     receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    status:{
type:String,
enum:["pending","accepted","rejected"],
default:"pending"
    }

},{timestamps:true})

const connectionmodel=mongoose.model("Connections",coneectionschema)
module.exports=connectionmodel