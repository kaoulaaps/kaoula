const mongoose = require("mongoose");
const { generate } = require("yourid");

const ClassSchema = new mongoose.Schema(
    {
        classId: {
            type: String,
            required: true,
            default: generate({
                length: 10,
                keyspace: "0123456789012345678901234567890123456789",
            }),
        },

        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        image: {
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
