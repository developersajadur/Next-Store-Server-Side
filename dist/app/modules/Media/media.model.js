"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModel = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const MediaSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
    },
    addedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileName: {
        type: String,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});
MediaSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
    next();
});
MediaSchema.pre('aggregate', function (next) {
    const pipeline = this.pipeline();
    const hasMatchStage = pipeline.some((stage) => '$match' in stage);
    if (!hasMatchStage) {
        pipeline.unshift({ $match: { isDeleted: false } });
    }
    next();
});
exports.MediaModel = (0, mongoose_1.model)('Media', MediaSchema);
