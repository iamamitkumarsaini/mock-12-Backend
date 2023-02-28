const express = require("express");
const { PostModel } = require("../Model/Post.model");
require("dotenv").config();

const postRoutes = express.Router();


postRoutes.post("/add", async(req,res) => {

    try {
        const payload = req.body;
        const post = new PostModel(payload);
        await post.save()
        res.status(200).send({"Message":"Post Added Successfully", post})
    } 
    
    catch (err) {
        console.log(err)
        res.status(500).send({"Message":"Error while Adding Post"})
    }
})


postRoutes.get("/",async(req,res) => {

    const searched = req.query.search;
    const sortBy = req.query.sortby;
    const page = Number(req.query.page);
    const limitBy = Number(req.query.limit) || 10;
    const category = req.query.filterby;
    const order = req.query.order;


    if(searched && sortBy && page && limitBy){

        try {
            if(order == "asc"){
                const posts = await PostModel.find({name:{$regex:searched,$options:'i'}}).skip((page-1)*1).limit(limitBy).sort({postedAt:1})
                res.status(200).send(posts)
            }

               else if(order == "desc"){
                const posts = await PostModel.find({name:{$regex:searched,$options:'i'}}).skip((page-1)*1).limit(limitBy).sort({postedAt:-1})
                res.status(200).send(posts)
            }

               else res.status(404).send({"Message":"Something Went Wrong, searched After Sometimes"})
    }

    catch (err){
        console.log(err)
        res.status(500).send({"Message":"Something Went Wrong, searched After Sometimes"})
    }

}

if(searched && page && limitBy){

    try {
        const posts = await PostModel.find({name:{$regex:searched,$options:'i'}}).skip((page-1)*1).limit(limitBy)
        res.status(200).send(posts)
    } 
    
    catch (err){
        console.log(err)
        res.status(500).send({"Message":"Something Went Wrong, searched After Sometimes"})
    }
}

else if (sortBy && order && page && limitBy){

    try {
        if(order == "asc"){
            const posts = await PostModel.find().skip((page-1)*1).limit(limitBy).sort({postedAt:1})
            res.status(200).send(posts);
        }
        else if(order == "desc"){
            const posts = await PostModel.find().skip((page-1)*1).limit(limitBy).sort({postedAt:-1})
            res.status(200).send(posts);
        }
    }
    
    catch (err) {
        console.log(err)
        res.status(500).send({"Messsage":"Something Went Wrong"})
    }
}

else if (category){
    try {
        const posts = await PostModel.find({category}).skip((page-1)*1).limit(limitBy);
        res.status(200).send(posts);
    } 
    
    catch (err) {
        console.log(err)
        res.status(500).send({"Messsage":"Something Went Wrong"})
    }
}


else{

    try {
        const posts = await PostModel.find().skip((page-1)*1).limit(limitBy);
        res.status(200).send(posts);
    } 
    
    catch (err) {
        console.log(err)
        res.status(500).send({"Message":"Error while Getting Posts"})
    }
  }  
});


postRoutes.delete("/delete/:postID", async(req,res) => {

    try {
        const postID = req.params.postID;
        await PostModel.deleteOne({_id:postID});
        res.status(200).send({"Message":"Deleted Successfully"})
    } 
    
    catch (err) {
        console.log(err)
        res.send({"Message":"Error while editing Data"})
    }
})




module.exports = { postRoutes };
