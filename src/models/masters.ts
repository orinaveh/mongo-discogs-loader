import mongoose, { Schema } from 'mongoose';
import { Master } from '../interfaces/masters';

const SongSchema = new Schema({
  serialId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
}, {
  toJSON: {
    virtuals: true,
    transform(_doc, ret) {
      // eslint-disable-next-line no-param-reassign
      delete ret._id;
    },
  },
  versionKey: false,
  id: true,
});

const MasterSchema = new Schema({
  serialId: {
    type: String,
    required: true,
    unique: true,
  },
  artistIds: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tracklist: {
    type: [SongSchema],
    required: true,
  },
  styles: {
    type: [String],
  },
}, {
  toJSON: {
    virtuals: true,
    transform(_doc, ret) {
      // eslint-disable-next-line no-param-reassign
      delete ret._id;
    },
  },
  versionKey: false,
  id: true,
  timestamps: { createdAt: true, updatedAt: true },
});

export const MasterModel = mongoose.model<Master & mongoose.Document>('masters', MasterSchema);
