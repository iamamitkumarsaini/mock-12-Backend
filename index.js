const express = require("express");
const { connection } = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { userRoutes } = require("./Routes/user.Routes");
const { profileRoutes } = require("./Routes/profile.Routes");
const { authentication } = require("./Middlewares/auth.middleware");



const app = express();

app.use(cors({
    origin:"*"
}))

app.use(express.json());

app.get("/", (req,res) => {
    res.send({"Message":"welcome to User Profile Page"})
})


app.use("/",userRoutes);






app.use(authentication)
app.use("/", profileRoutes)



app.listen(process.env.port, async() => {
    try {
        await connection;
        console.log("Connection to DB Success");
    } 
    
    catch (err) {
        console.log("Connection to DB Failed");
        console.log(err);
    }

    console.log(`running on port ${process.env.port}`)
});
