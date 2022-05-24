import mongoose, { Schema } from 'mongoose';
import { Song } from '../interfaces/songs';

const SongSchema = new Schema({
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
  styles: {
    type: [String],
  },
  profile: {
    type: String,
    default: '',
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

export const SongModel = mongoose.model<Song & mongoose.Document>('songs', SongSchema);
