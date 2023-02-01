require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;
const userModel = require("../models/user.model");
const dayjs = require("dayjs");
import { Response } from "express";

passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
  done(null, user);
});

type name = {
    givenName: string,
    familyName: string,
}

type email ={
    value: string
}

interface profile {
    emails: Array<email> ,
    name: name,
    id: string,
    role: string,

}
passport.use(new googleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/google/callback",
    passReqToCallback : true
}, async(request: any,accessToken:String, refreshToken:String, profile:any,done:any) =>{

    const email = profile?.emails[0]?.value
    const firstName = profile?.name?.givenName;
    const lastName = profile?.name?.familyName;
    const id = profile?.id;
    const role = 'user'
    const user = {id,email,firstName,lastName,role};

    // generate tokens
    console.log(accessToken)
    const ACCESS_TOKEN =  jwt.sign(user,process.env.ACCESS_TOKEN_KEY,{expiresIn: '15min'});
    const REFRESH_TOKEN =  jwt.sign(user,process.env.REFRESH_TOKEN_KEY,{expiresIn: '1y'});

    
    return done(null,user);
 }
))
 
