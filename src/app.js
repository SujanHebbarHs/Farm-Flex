require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
require("./db/conn");
const Register = require("./models/registers");
const Query = require("./models/reachUs");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 3000;
const static_path = path.join(__dirname,"../public");
const templates_path = path.join(__dirname,"../templates","views");
const partials_path = path.join(__dirname,"../templates","partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",templates_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/query",auth,(req,res)=>{
    res.render("query");
})

app.post("/query",async(req,res)=>{

    try {
        const userQuery = new Query({

            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            pid:req.body.pid,
            category:req.body.category,
            description:req.body.description

        })
        console.log(userQuery.firstname);
        console.log(userQuery.pid);
        await userQuery.save();
        res.status(201).render("index");

    }catch (err) {
        res.status(404).send(err);
    }
})

app.get("/logout",auth,async(req,res)=>{
    try{

//Logout only the current user

        // req.user.tokens = req.user.tokens.filter((obj)=>{
        //     return (obj.token !==req.token);
        // })

//Logout all users

        req.user.tokens=[];
        
        res.clearCookie("jwt");
        console.log("Logout successful");

        await req.user.save();

        res.render("login");

    }catch(err){
        res.sendStatus(500);
    }
})


app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",async(req,res)=>{
    
    try{

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){

            const registerEmployee = new Register({

                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : password

            })

            console.log("Id is: "+registerEmployee._id);
            console.log("Password is: "+registerEmployee.password);

            const token = await registerEmployee.generateAuthToken();
            console.log("Token: "+token);

            res.cookie("jwt",token,{
                expires:new Date(Date.now() + 60000),
                httpOnly:true
            });

            const registered= await registerEmployee.save();
            res.status(201).render("index");

        }
        else {
            res.send("Password are not matching");
        }

    }catch(err) {

        res.status(400).send(err)
    }

})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",async(req,res)=>{

try {

    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({email});

    const isMatch = await bcrypt.compare(password , useremail.password);

    const token = await useremail.generateAuthToken();
    console.log("Token: "+token);

    res.cookie("jwt",token,{
        expires:new Date(Date.now() + 30000),
        httpOnly:true
    })

    if(isMatch){
        res.status(201).render("index");
    }
    else{
        res.send("Invalid login details");
    }

}catch(err) {
    res.status(400).send("Invalid login details");
}

})

app.get("*",(req,res)=>{
    res.render("404")
})

app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Server running on port : ${PORT}`);
});
