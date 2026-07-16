const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        company: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        },

        ats: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model("Job", jobSchema);