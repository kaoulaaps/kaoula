const mongoose = require("mongoose");
const { generate } = require("yourid");

const ClassSchema = new mongoose.Schema(
    {
        invite: {
            type: String,
            required: true,
            default: generate({
                length: 10,
            }),
        },

        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        students: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
        },

        bans: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
        },

        private: {
            type: String,
            required: true,
            default: false,
        },

        maxStudents: {
            type: String,
            required: true,
            default: "30",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Class", ClassSchema);
