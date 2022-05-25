import { ArtistModel } from '../models/artists';

export class ArtistsRepository {
  static async upsert(artists: any[]) {
    return ArtistModel.bulkWrite(artists);
  }
}
