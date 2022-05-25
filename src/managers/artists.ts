import * as csv from 'fast-csv';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import fs from 'fs';
import { ArtistCsv, VariationsCsv } from '../interfaces/artists';
import { ArtistsRepository } from '../repositories/artists';
import { config } from '../config';

const { bulkSize } = config;
export class ArtistsManager {
  static async upsert(folderPath: string) {
    const variations: Record<string, any> = {};
    let rows: any[] = [];

    const end = new Promise((resolve, reject) => {
      fs.createReadStream(`${folderPath}artist_namevariation.csv`)
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => reject(error))
        .on('data', (row: VariationsCsv) => {
          const cell = variations[row.artist_id];
          cell ? cell.push(row.name) : variations[row.artist_id] = [row.name];
        })
        .on('end', () => {
          const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
          const artistLength = 8000000;
          let fulfilled = 0;

          bar.start(artistLength, 0);

          const stream = fs.createReadStream(`${folderPath}artist.csv`)
            .pipe(csv.parse({ headers: true }))
            .on('data', async (row: ArtistCsv) => {
              const { id, name, profile } = row;
              const artist = {
                filter: { serialId: id },
                update: {
                  serialId: id,
                  name,
                  profile,
                  variations: variations[id],
                },
                upsert: true,
              };
              rows.push({ updateOne: artist });
              if (rows.length === bulkSize) {
                stream.pause();
                await ArtistsRepository.upsert(rows);
                fulfilled += bulkSize;
                bar.update(fulfilled);
                rows = [];
                stream.resume();
              }
            })
            .on('end', async (rowCount: number) => {
              await ArtistsRepository.upsert(rows);
              bar.update(rowCount);
              bar.stop();
              console.log(chalk.green(`Inserted ${rowCount} artists`));
              resolve(null);
            });
        });
    });
    await end;
  }
}
