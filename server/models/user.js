import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required."],
        },
    },
    { timestamps: true }
)

const User = model('User', userSchema);

export default User;