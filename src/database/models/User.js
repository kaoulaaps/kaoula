const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        authId: {
            type: String,
            required: true,
        },

        uid: {
            type: String,
            required: true,
        },

        name: {
            type: String,
        },

        site_admin: {
            type: Boolean,
            default: false,
        },

        username: {
            type: String,
            required: true,
        },

        // Personal Information
        phone: {
            type: String,
        },

        email: {
            type: String,
        },

        birthday: {
            type: String,
        },

        address: {
            type: String,
        },

        // Class the user is in
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },

        provider: {
            type: String,
            required: true,
        },

        avatar: {
            type: String,
            required: true,
        },

        role: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
