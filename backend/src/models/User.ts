import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { requireEnv } from "../config/env";

interface IUser {
    name: string;
    email: string;
    password: string;
    avatar: string;
    isAdmin: boolean;
    stripeCustomerId?: string;
    isValidatedPassword(enteredPassword: string): Promise<boolean>;
    getSignedJwtToken(): string;
 }

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "https://res.cloudinary.com/ddgf7ijdc/image/upload/v1706787809/yami_lil00v.jpg" },
    isAdmin: { type: Boolean, default: false },
    stripeCustomerId: { type: String, index: true, sparse: true },
}, {
    timestamps: true,
});

// Hash the password before saving the user to the database
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, requireEnv("JWT_SECRET"), {
        expiresIn: (process.env.JWT_EXPIRE ?? "7d") as SignOptions["expiresIn"],
    });
};

// Compare the password of the user
userSchema.methods.isValidatedPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>("User", userSchema);

export { User, IUser}
