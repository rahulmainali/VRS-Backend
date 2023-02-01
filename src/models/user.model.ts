
import mongoose from "mongoose"
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    password: 'string',
    token: 'string',
    status: String,
    createdOn: Date,
})

userSchema.methods.matchPassword = async function (password : String){
    return await bcryptjs.compare(password,this.password)
}


module.exports = mongoose.model("users",userSchema)
