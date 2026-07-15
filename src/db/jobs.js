const mongoose=require("mongoose");

const JobSchema=new mongoose.Schema({

    jobId:{
        type:String,
        unique:true
    },

    company:String,

    title:String,

    ats:String,

    detectedAt:{

        type:Date,

        default:Date.now

    }

});

module.exports=mongoose.model("Job",JobSchema);