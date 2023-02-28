const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phone:Number,
    bio:String,
    profile_url:String,
    accessToken:String
}, {
    versionKey:false
})

const UserModel = mongoose.model("user",userSchema);

module.exports = { UserModel };