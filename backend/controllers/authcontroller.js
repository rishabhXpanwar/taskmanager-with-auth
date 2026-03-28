const User = require("../models/user");

const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");

const { validationResult } = require('express-validator');

exports.register = async (req,res , next ) => {
    try{

        // validate error 
        let errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({
                message: errors.array()[0]?.msg || "Validation failed",
                errors : errors.array()
            });
        }

        //if no error then proceed 

        let {name , email , password } = req.body;

        // check existing 

        let user = await User.findOne({email});

        if(user)
        {
            return res.status(400).json({message : "User Already Exists."});
        }

        // password ko hash kr lete hai 

        const salt = await bycrypt.genSalt(10);
        const hashed = await bycrypt.hash(password , salt);


        // new user ko databse me save kr diya 
        user = new User({name,email,password : hashed});
        await user.save();

        // now we will create token with the help of jwt 

        const payload = {userId : user._id};
        const token = jwt.sign(payload , process.env.JWT_SECRET,{ expiresIn : process.env.JWT_EXPIRES_IN});

        res.status(200).json({token});


    }
    catch(err)
    {
        next(err);
    }
};


exports.login = async (req,res,next) => {
    try {
        let errors = validationResult(req);

        if(!errors.isEmpty())
        {
           return  res.status(400).json({errors : errors.array()});
        }

        let {email , password} = req.body;

        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({message : "Invalid Creds!"});
        }

        const isMatch = await bycrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(400).json({message : "Invalid Creds!"});
        }


        const payload = {userId : user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES_IN});

        res.json({token});
    }
    catch(err)
    {
        next(err);
    }


}


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res, next) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google token nahi mila" });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // User pehle se hai — chahe normal signup se aaya ho ya Google se
            // Bas googleId update kar do agar pehle se nahi hai
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
          
        } else {
            // Bilkul naya user hai — banao
            user = new User({
                name,
                email,
                googleId,
            });
            await user.save();
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        next(err);
    }
};



exports.getMe = async (req, res, next) => {
    try {
        // req.user mein poora user already hai (auth middleware ne daal diya)
        res.json({ user: req.user });
    } catch (err) {
        next(err);
    }
};
