const jwt = require('jsonwebtoken');

module.exports = function (req,res,next) {

    // get the authorization header
    const authheader = req.header('Authorization');
    if(!authheader)
    {
        return res.status(401).json({message : "No Token , Authorization Denied"});

    }

    const token = authheader.split(' ')[1];
    if(!token)
    {
        return res.status(401).json({message : "Token in Invalid"});

    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = {id : decoded.userId};
        next();
    }
    catch(err)
    {
        return res.status(401).json({message : "Invalid Token"});
    }
};