const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        user: {
            type: [String],
            required: true,
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", PostSchema);
