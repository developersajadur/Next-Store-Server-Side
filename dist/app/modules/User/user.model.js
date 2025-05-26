"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Number is required'],
        match: [/^\d{11}$/, 'Invalid phone number format'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        select: 0,
        validate: {
            validator: function () {
                return this.loginType !== 'PASSWORD' || !!this.password;
            },
            message: 'Password is required for PASSWORD login type',
        },
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },
    profileImage: {
        type: String,
    },
    city: {
        type: String,
        default: 'N/A',
    },
    address: {
        type: String,
        default: 'N/A',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    loginType: {
        type: String,
        enum: Object.values(user_interface_1.LOGIN_TYPE),
        required: true,
        default: user_interface_1.LOGIN_TYPE.PASSWORD,
    },
}, {
    timestamps: true,
});
userSchema.pre('validate', function (next) {
    if (this.loginType === user_interface_1.LOGIN_TYPE.PASSWORD && !this.password) {
        this.invalidate('password', 'Password is required for PASSWORD login type');
    }
    next();
});
// Password hashing
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.loginType === user_interface_1.LOGIN_TYPE.PASSWORD) {
        const hashedPassword = await bcrypt_1.default.hash(user.password, Number(config_1.default.salt_rounds));
        user.password = hashedPassword;
    }
    next();
});
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
