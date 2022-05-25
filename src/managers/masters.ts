import XmlStream from 'xml-flow';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import fs from 'fs';
import { config } from '../config';
import { MastersRepository } from '../repositories/masters';
import { MasterXml } from '../interfaces/masters';

const { bulkSize } = config;
export class MastersManager {
  static async upsert(path: string, releasePath: string) {
    let rows: any[] = [];
    const mastersIds = new Map();

    const masterStream = new Promise((resolve, reject) => {
      const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
      const mastersLength = 2040000;
      let fulfilled = 0;

      bar.start(mastersLength, 0);

      const stream = fs.createReadStream(path)
        .on('error', (err) => reject(err))
        .on('end', async () => {
          bar.stop();
          console.log(chalk.green('Loaded masters ids'));
          resolve(null);
        });
      const xml = XmlStream(stream);
      xml.on('tag:master', async (row: any) => {
        const {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          main_release,
        } = row;
        mastersIds.set(main_release, 1);
        fulfilled += 1;
        bar.update(fulfilled);
      }).on('error', (err) => reject(err));
    });

    await masterStream;

    const end = new Promise((resolve, reject) => {
      const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
      const mastersLength = mastersIds.size;
      let fulfilled = 0;

      bar.start(mastersLength, 0);
      const stream = fs.createReadStream(releasePath)
        .on('error', (err) => reject(err))
        .on('end', async () => {
          await MastersRepository.upsert(rows);
          bar.stop();
          console.log(chalk.green('Inserted masters'));
          resolve(null);
        });
      const xml = XmlStream(stream);
      xml.on('tag:release', async (row: MasterXml) => {
        if (!mastersIds.get(row.id)) return;
        const {
          id, title, styles, genres, released, tracklist,
        } = row;
        const newTracklist = tracklist.map(({ title: songTitle, ...rest }) => ({
          name: songTitle,
          serialId: `${id}_${rest.position}`,
          ...rest,
        }));
        const tracklistSerials = newTracklist.map((track) => track.serialId);
        const masters = {
          filter: { serialId: id },
          update: {
            serialId: id,
            name: title,
            genres,
            styles,
            year: released,
            tracklist: tracklistSerials,
          },
          upsert: true,
        };

        rows.push({ updateOne: masters });
        if (rows.length === bulkSize) {
          stream.pause();
          await MastersRepository.upsert(rows);
          fulfilled += bulkSize;
          bar.update(fulfilled);
          rows = [];
          stream.resume();
        }
      }).on('error', (err) => reject(err));
    });
    await end;
  }
}
