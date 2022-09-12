const mongoose = require("mongoose");
const { generate } = require("yourid");

const InviteSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            default: generate({
                length: 10,
            }),
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

module.exports = InviteSchema;
