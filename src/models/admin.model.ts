import mongoose from "mongoose";
const bcryptjs = require("bcryptjs");

// create schema
const adminSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    createdOn: Date,
});
// match password method
adminSchema.methods.matchPassword = async function (password : String){
    return await bcryptjs.compare(password,this.password)
}

// create model and export
module.exports = mongoose.model("admins",adminSchema);
