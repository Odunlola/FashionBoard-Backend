const mongoose = require("../config/connection");
//making Comments mongoose Schema

const commentSchema = new mongoose.Schema (
    {
        rating:{
            type:Number,
            required:[true, "Please have a rating"],
            min:1,
            max:10
        },
        text:{
            type:String,
            trim:true
            //max
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:[true, "must be a user"]
        },
        brand:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"brand",
            required:[true, "must have a brand"]
        }

    },{
        timestamps:true
    }
);
//exporting module
const Comments = mongoose.model("comment", commentSchema);
module.exports = Comments;