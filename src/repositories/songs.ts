import { SongsModel } from '../models/songs';

export class SongsRepository {
  static async upsert(songs: any[]) {
    return SongsModel.bulkWrite(songs);
  }
}
