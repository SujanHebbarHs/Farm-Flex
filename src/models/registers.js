const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({

    firstname : {
        type:String,
        required:true
    },
    lastname : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    gender : {
        type:String,
        required:true,
    },
    phone : {
        type:Number,
        required:true,
        unique:true
    },
    age : {
        type:Number,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

//generating password
employeeSchema.methods.generateAuthToken = async function(){

    try{
        
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});
        await this.save();
        console.log("token: "+token);
        return token;
    }catch(err){

        res.status(400).send("wrong"+err);

    }

}


//hasing password
employeeSchema.pre("save",async function (next){

    if(this.isModified("password")){

        this.password = await bcrypt.hash(this.password,10);
        console.log("Hash password: "+this.password)
    }

    next();

})

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;
