const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    name:String,
    description:String,
    category:String,
    image:String,
    location:String,
    postedAt:String,
    price:Number

}, {
    versionKey:false
})

const PostModel = mongoose.model("post",postSchema);

module.exports = { PostModel };