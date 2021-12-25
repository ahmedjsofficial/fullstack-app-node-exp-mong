require('dotenv').config();
const express = require('express');
const server = express();
const path = require('path');
const bcrypt = require('bcryptjs');

require('./ConDB.js');
const UserData = require('../src/ContactSch.js');
const port = process.env.PORT || 9000;
const stacticPath = path.join(__dirname,"../public");

server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.use(express.static(stacticPath));

server.get("/",(req , res)=>{
    res.send();
})
// server.get("/signin.html",(req , res)=>{
//     res.send();
// });
// Working 100%
server.post("/register", async (req,res)=>{
    try {    
        const psw =  req.body.Password;
        const cpsw = req.body.ConfirmPassword;
        if(psw === cpsw){
            const registerUser = new UserData({
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                UserName: req.body.UserName,
                Gender: req.body.Gender,
                Email:  req.body.Email,
                Password: req.body.Password,
                ConfirmPassword: req.body.ConfirmPassword
            })
        const token = await registerUser.generateAuthToken();
        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + 30000),
        //     httpOnly: true
        //     // secure: true
        // });
        const userRegistered = await registerUser.save();
        // res.status(201).redirect("/");
        res.status(201).redirect("/");
        }else{
            res.send("Password are not Macthing");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})
//Going to Login and Working 100%
server.post("/login", async (req,res)=>{
    try {
        const Email = req.body.Email;
        const Password = req.body.Password;
        const userEmail = await UserData.findOne({Email:Email});
        const isMatch = await bcrypt.compare(Password, userEmail.Password);
        
        const token = await userEmail.generateAuthToken();
        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + 30000),
        //     httpOnly: true
        //     // secure: true
        // });

        if (isMatch) {
            console.log("Password has match");
            res.status(201).redirect("/");
        } else {
            res.send("Inavlid Password");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

server.listen(port,()=>{
    console.log(`Server is Listhening at http://localhost:${port}`);
});