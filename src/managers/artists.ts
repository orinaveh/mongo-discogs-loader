import * as csv from 'fast-csv';
import fs from 'fs';
import { Artist, ArtistCsv, VariationsCsv } from '../interfaces/artists';
import { ArtistsRepository } from '../repositories/artists';

export class ArtistsManager {
  static async upsert(folderPath: string) {
    const variations: Record<string, any> = {};

    const end = new Promise((resolve, reject) => {
      fs.createReadStream(`${folderPath}artist_namevariation.csv`)
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => reject(error))
        .on('data', (row: VariationsCsv) => {
          const cell = variations[row.artist_id];
          cell ? cell.push(row.name) : variations[row.artist_id] = [row.name];
        })
        .on('end', () => {
          fs.createReadStream(`${folderPath}artist.csv`)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: ArtistCsv) => {
              const { id, name, profile } = row;
              const artist: Artist = {
                serialId: id,
                name,
                profile,
                variations: variations[id],
              };
              ArtistsRepository.upsert(artist);
            })
            .on('end', (rowCount: number) => {
              resolve(`Parsed ${rowCount} rows`);
            });
        });
    });
    await end;
  }
}
