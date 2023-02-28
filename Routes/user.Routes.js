const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Models/User.Model");
require("dotenv").config();
const saltRounds = 4;
const passport = require('passport');
const { OAuth2Strategy } = require('passport-google-oauth');

const userRoutes = express.Router();

passport.use(new OAuth2Strategy({
    clientID: process.env.google_client_id,
        clientSecret: process.env.google_client_secret_value,
        callbackURL: "http://localhost:8090/auth/google/callback",
  }, 
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await UserModel.findOne({ email: profile.emails[0].value });
  
      if (existingUser) {
        return done(null, existingUser);
      }
  
      const newUser = new UserModel({
        email: profile.emails[0].value,
        accessToken,
      });
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }));





userRoutes.post("/register", async(req,res) => {

    const { email, password } = req.body;

    const userEmail = await UserModel.findOne({email});

    if(userEmail){
        res.status(409).send({"Message":"This Email is already registered"})
        
    }

    else{

        try {
            bcrypt.hash(password,saltRounds, async(err,myPassword) => {
                const user = new UserModel({email,password:myPassword})
                await user.save();
                res.status(200).send({"Message":"Signup Successfully"})
            })
        } 
        
        catch (err) {
            console.log(err);
            res.status(500).send({"Message":"Signup failed, try again"})
        }
    }
})


userRoutes.post("/login", async(req,res) => {

    try {
        
        const {email,password} = req.body;
        const byEmail = await UserModel.find({email});

        if(byEmail.length>0){
            const myPassword = byEmail[0].password;
            console.log(myPassword);
            bcrypt.compare(password, myPassword, (err,result) => {
                if(result){
                    const token = jwt.sign({userId:byEmail[0]._id},process.env.secret_key, {expiresIn:"1d"})
                    res.status(200).send({token,"Message":"Logged-In Successfully"});
                }
                else{
                    res.status(401).send({"Message":"The Password you Entered is Wrong"})
                    
                }
            })
        }

        else{
            res.status(404).send({"Message":"User not found"});
        }
    }

    catch (err) {
        console.log(err)
        res.status(500).send({"Message":"Login failed, Please try again later"});
    }
})


userRoutes.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

userRoutes.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    const token = jwt.sign({ email: req.user.email }, process.env.secret_key, { expiresIn: '1d' });
  
    return res.json({ token });
  });

module.exports = { userRoutes }