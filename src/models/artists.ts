import mongoose, { Schema } from 'mongoose';
import { Artist } from '../interfaces/artists';

const ArtistSchema = new Schema({
  serialId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  variations: {
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

export const ArtistModel = mongoose.model<Artist & mongoose.Document>('artists', ArtistSchema);
