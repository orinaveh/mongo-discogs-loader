import mongoose, { Schema } from 'mongoose';

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
  position: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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
});

export const SongsModel = mongoose.model<mongoose.Document>('songs', SongSchema);
