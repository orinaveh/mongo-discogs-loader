import { Artist } from '../interfaces/artists';
import { ArtistModel } from '../models/artists';

export class ArtistsRepository {
  static async upsert(artist: Artist) {
    return ArtistModel.findOneAndUpdate({ serialId: artist.serialId }, artist, { upsert: true }).exec();
  }
}
