const mongoose = require("mongoose");

const ThreadSchema = new mongoose.Schema(
    {
        tid: {
            type: String,
            required: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
        },

        subject: {
            type: String,
            required: true,
        },

        users: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Thread", ThreadSchema);
