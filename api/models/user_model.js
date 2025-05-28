import mongoose from "mongoose";

    const User= mongoose.Schema({
        userName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        avatar:{
            type:String,
            default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQLHZh0aF5Og2DF4G19yPVx_QGjXfaBByFZA&s"
        }
    });

    export default mongoose.model("User",User);