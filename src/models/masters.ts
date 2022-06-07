import mongoose, { Schema } from 'mongoose';
import { Master } from '../interfaces/masters';

const MasterSchema = new Schema({
  serialId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: String,
  },
  artistIds: {
    type: [String],
    required: true,
  },
  artistNames: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tracklist: {
    type: [String],
    required: true,
  },
  styles: {
    type: [String],
  },
  genres: {
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

export const MasterModel = mongoose.model<Master & mongoose.Document>('albums', MasterSchema);
