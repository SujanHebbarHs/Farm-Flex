const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async(req,res,next)=>{
    try{

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        //to get user data
        const user = await Register.findOne({_id:verifyUser._id});

        req.token = token;
        console.log("Agin: "+req.token)
        req.user=user;
        
        next();

    }catch(err){
        console.log(err);
        res.redirect("login");
    }
}

module.exports = auth;