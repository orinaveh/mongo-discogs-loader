import { Song } from '../interfaces/songs';
import { SongModel } from '../models/songs';

export class ArtistsRepository {
  static async upsert(songs: Song) {
    return SongModel.findOneAndUpdate({ serialId: songs.serialId }, songs, { upsert: true }).exec();
  }
}
