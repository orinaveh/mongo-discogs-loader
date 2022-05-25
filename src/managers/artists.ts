import XmlStream from 'xml-flow';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import fs from 'fs';
import { ArtistCsv } from '../interfaces/artists';
import { ArtistsRepository } from '../repositories/artists';
import { config } from '../config';

const { bulkSize } = config;
export class ArtistsManager {
  static async upsert(path: string) {
    let rows: any[] = [];

    const artistsStream = new Promise((resolve, reject) => {
      const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
      const artistLength = 8000000;
      let fulfilled = 0;

      bar.start(artistLength, 0);

      const stream = fs.createReadStream(path)
        .on('error', (err) => reject(err))
        .on('end', async () => {
          await ArtistsRepository.upsert(rows);
          bar.stop();
          console.log(chalk.green('Inserted artists'));
          resolve(null);
        });
      const xml = XmlStream(stream);
      xml.on('tag:artist', async (row: ArtistCsv) => {
        const {
          id, name, profile, variations,
        } = row;
        const artist = {
          filter: { serialId: id },
          update: {
            serialId: id,
            name,
            profile,
            variations,
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
      });
    });
    await artistsStream;
  }
}
