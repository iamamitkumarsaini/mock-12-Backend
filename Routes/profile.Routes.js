const express = require("express");
const { UserModel } = require("../Models/User.Model");

const profileRoutes = express.Router();

profileRoutes.get("/getProfile", async(req,res) => {

    const userId = req.body.userId;
    console.log("userId",userId)

    try {
        const user = await UserModel.findById({_id:userId});
        res.status(200).send(user)
    } 
    
    catch (err) {
        console.log(err);
        res.status(400).send("Bad Request, Please try again later")
    }
})


profileRoutes.patch("/getProfile/:id", async(req,res) => {

    const userId = req.params.id;
    const payload = req.body;

    try {
        const user = await UserModel.findByIdAndUpdate(userId,payload);
        res.status(200).send({"Message": "Details Updated", user})
    } 
    
    catch (err) {
        console.log(err);
        res.status(400).send("Bad Request, Please try again later")
    }
})


module.exports = { profileRoutes }