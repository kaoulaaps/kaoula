const mongoose = require("mongoose");

const HomeworkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        subject: {
            type: String,
            required: true,
        },

        teacher: {
            type: "String",
            required: true,
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },

        dueDate: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Homework", HomeworkSchema);
