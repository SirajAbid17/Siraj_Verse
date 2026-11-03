const mongoose=require('mongoose')


const botaischema=new mongoose.Schema({
text:{
     type:String,
    required:true
},
timestamps:{
    type:Date,
    default:Date.now
}
},{timestamps:true})

const botai=mongoose.model('botsai',botaischema)

module.exports=userai