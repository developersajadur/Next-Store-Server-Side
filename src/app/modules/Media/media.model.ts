/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, model } from 'mongoose';
import { TMedia } from './media.interface';

const MediaSchema = new Schema<TMedia>(
  {
    url: {
      type: String,
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

MediaSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  this.find({ isDeleted: false });
  next();
});

MediaSchema.pre('aggregate', function (this: mongoose.Aggregate<any[]>, next) {
  const pipeline = this.pipeline();

  const hasMatchStage = pipeline.some((stage) => '$match' in stage);
  if (!hasMatchStage) {
    pipeline.unshift({ $match: { isDeleted: false } });
  }

  next();
});

export const MediaModel = model<TMedia>('Media', MediaSchema);
