const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const pinRoute = require("./routes/pins.js");
const userRoute = require("./routes/users.js");

//for processing .env file.
dotenv.config();

app.use(express.json());
// connection with mongoDB
mongoose.connect(process.env.MONGO_URL , {useNewUrlParser : true})
.then(()=>{
    console.log("MongoDB Connected!");
}).catch(err => {
    console.log(err);
})
app.use("/api/pins",pinRoute);
app.use("/api/users",userRoute);


app.listen(8000 , ()=>{
    console.log("Backend server is running");
});