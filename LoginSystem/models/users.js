const mongoose=require("mongoose")


const usersSchema= new mongoose.Schema({
    email:String,
    password:String,
    pass:String,

})
const User=new mongoose.model('User',usersSchema)
module.exports=User