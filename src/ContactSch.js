const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// mongoose.Schema Creating
const UserSchemas = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        trim: true
    },LastName: {
        type: String,
        required: true,
        trim: true
    },UserName: {
        type: String,
        required: true,
        trim: true
    },Gender: {
        type: String,
        required: true
    },Email: {
        type: String,
        required: true,
        unique: true
    },Password: {
        type: String,
        required: true
    },ConfirmPassword: {
        type: String,
        required: true
    },
    token: [{
        dbtoken: {
            type: String,
            required: true
        }
    }]
})

//JWT for Signup // for registration of Contact Form

// also addding a secret key

UserSchemas.methods.generateAuthToken = async function (){
    try {
        const genToken = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.token = this.token.concat({dbtoken:genToken});
        await this.save();
        return genToken;    // here we will return always genrated token ok!
    } catch (error) {
        res.send(error);
    }
}

// bcript the Password
// for registration of Contact Form
/*----------------------------------------------------------------
    console.log(`The Current Password is ${this.Password}`);
    this.Password = await bcrypt.hash(this.Password, 10);
    this.ConfirmPassword = await bcrypt.hash(this.Password, 10);
    console.log(`After Encryption Password is ${this.Password}`);
    this.ConfirmPassword = undefined; we can undefiened also
----------------------------------------------------------------*/
UserSchemas.pre("save", async function(next){
    if(this.isModified("Password")){
        this.Password = await bcrypt.hash(this.Password, 10);
        this.ConfirmPassword = await bcrypt.hash(this.Password, 10);
    }
    next();
})

//Collection Creating
const UserData = new mongoose.model("UserData",UserSchemas);
module.exports = UserData;