const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({

    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    pid:{
        type:String,
        default:"none"
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String
    }

})

const Query = new mongoose.model("Query",querySchema);

module.exports = Query;