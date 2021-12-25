const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ContactTest', {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>{
    console.log("Mongoose has Connected Successfully");
}).catch((error)=>{
    console.log(error);
    console.log("Mongoose not Connected");
});