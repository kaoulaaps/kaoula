const mongoose = require("mongoose");
const { generate } = require("yourid");

const ClassSchema = new mongoose.Schema({
    id: {
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
        required: true,
    },

    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
});

module.exports = mongoose.model("Class", ClassSchema);
