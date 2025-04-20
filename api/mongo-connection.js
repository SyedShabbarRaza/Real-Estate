import mongoose from 'mongoose';
import env from 'dotenv';
env.config();

mongoose.connect("mongodb+srv://syedshabbarraza207:2071975@cluster0.zdgv7.mongodb.net/crud").then(function(){
    console.log("MONGO-DB connected");
})
.catch(function(err){
    console.log(err);
})

export default mongoose.connection;

