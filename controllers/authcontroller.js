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
            return res.status(400).json({errors : errors.array() });
        }

        //if no error then proceed 

        let {name , email , password } = req.body;

        // check existing 

        let user = await User.findOne({email});

        if(user)
        {
            res.status(400).json({message : "User Already Exists."});
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
            res.status(400).json({message : "Invalid Creds!"});
        }

        const isMatch = await bycrypt.compare(password, user.password);
        if(!isMatch)
        {
            res.status(400).json({message : "Invalid Creds!"});
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