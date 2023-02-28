const express = require("express");
const { postRoutes } = require("./Routes/Post.Routes");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./config/db");



const app = express();

app.use(cors({
    origin:"*"
}))

app.use(express.json());

app.get("/", (req,res) => {
    res.send({"Message":"welcome to miniolx.com"})
})


app.use("/posts",postRoutes)


app.listen(process.env.port, async() => {
    try {
        await connection;
        console.log("Connection to DB Success");
    } 
    
    catch (err) {
        console.log("Connection to DB Failed",err);
        res.send({"Message":"Connection to Network Failed"});
    }
});