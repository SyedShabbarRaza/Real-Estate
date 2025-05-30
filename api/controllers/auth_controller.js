import express from 'express';
import User from '../models/user_model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import env from 'dotenv';
env.config();

export const signup= async(req,res,next)=>{
    try {
        let { userName, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(409).send('User Already exists');
        
        bcrypt.genSalt(12, async function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) res.status(504).send(err.message);
                else {
                    let createdUser = await User.create({
                        userName,
                        email,
                        password: hash
                    })
                if (!createdUser)return res.status(504).send('something went wrong');

                res.status(200).send({
                    "status":200,
                    "message":"User Created Successfully"
                });
                }
            })
        })
    } catch (err) {
        next(err);
    } 

}

export const signIn=async(req,res,next)=>{
try{
    let { email, password } = req.body
    let user = await User.findOne({ email })
    if (!user) return res.status(500).send({ "status": "500", "message": "Something went wrong" })

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign(
                {
                    id: user._id,
                },
                process.env.JWT_SECRET
            )
            const {password:pass,...rest}=user._doc
            res.cookie('access_token',token,{httpOnly:true,}).status(200).json(rest)
        }
        else {
           return next(errorHandler(401,"Wrong credentials"));
        }
    })
}catch(err){
    next(err)
}
}


export const google=async(req,res,next)=>{
try{
    let user = await User.findOne({ email:req.body.email })
    if (user) {
        let token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET
        )
        const {password:pass,...rest}=user._doc
        res.cookie('access_token',token,{httpOnly:true,}).status(200).json(rest)
        console.log("token",token);
    }else{
        const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
        const hashedPassword=bcrypt.hashSync(generatedPassword,10);
        const newUser=new User({userName:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo});
        await newUser.save();
        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=newUser._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
console.log(req.body);
    }
    }catch(err){
        console.log("error aya hai");
    next(err)
}
}

export const signOut=(req,res)=>{
    try{
        res.clearCookie('access_token');
        res.status(200).json("User has been logged out");
    }catch(error){
        next(error)
    }
}