/* eslint-disable no-nested-ternary */
import XmlStream from 'xml-flow';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import fs from 'fs';
import { config } from '../config';
import { MastersRepository } from '../repositories/masters';
import { MasterXml } from '../interfaces/masters';
import { SongsRepository } from '../repositories/songs';

const { bulkSize } = config;
export class MastersManager {
  static async upsert(path: string) {
    let rows: any[] = [];
    let songsRows: any[] = [];

    const releaseStream = new Promise((resolve, reject) => {
      const multibar = new cliProgress.MultiBar({ hideCursor: true }, cliProgress.Presets.shades_classic);

      const releasesBar = multibar.create(15000000, 0);
      const songsBar = multibar.create(150000000, 0);

      const stream = fs.createReadStream(path)
        .on('error', (err) => reject(err))
        .on('end', async () => {
          await MastersRepository.upsert(rows);
          await SongsRepository.upsert(songsRows);
          releasesBar.stop();
          songsBar.stop();
          multibar.stop();
          console.log(chalk.green('Inserted masters to mongo'));
          resolve(null);
        });
      const xml = XmlStream(stream);
      xml.on('tag:release', async (row: MasterXml) => {
        if (row.master_id && row.master_id.$attrs.is_main_release === 'false') return;
        const {
          $attrs: { id }, title, styles, genres, released, tracklist, artists,
        } = row;

        const arrayTracklist = !Array.isArray(tracklist) ? [tracklist] : tracklist;
        const arrayArtists = !Array.isArray(artists) ? [artists] : artists;

        const artistsSerials = arrayArtists.map((artist) => artist.id);
        const artistNames = arrayArtists.map((artist) => artist.name);

        const newTracklist = arrayTracklist.flatMap((track, index) => (track?.title ? [{
          name: track.title,
          serialId: `${id}_${track.position ?? index}`,
          position: track.position ?? index,
          styles,
          genres,
          artistIds: Array.isArray(track.artists)
            ? track.artists.map((artist) => artist.id)
            : track.artists ? [track.artists.id] : artistsSerials,
          artistNames: Array.isArray(track.artists)
            ? track.artists.map((artist) => artist.name)
            : track.artists ? [track.artists.name] : artistNames,
        }] : []));

        const tracklistSerials = newTracklist.map((track) => track.serialId);

        const masters = {
          filter: { serialId: id },
          update: {
            serialId: id,
            name: title,
            genres,
            styles,
            date: released,
            tracklist: tracklistSerials,
            artistIds: artistsSerials,
            artistNames,
          },
          upsert: true,
        };

        newTracklist.forEach((track, index) => songsRows.push({
          updateOne: ({
            filter: { serialId: `${id}_${track.position ?? index}` },
            update: track,
            upsert: true,
          }),
        }));

        rows.push({ updateOne: masters });
        if (songsRows.length > bulkSize) {
          stream.pause();
          await SongsRepository.upsert(songsRows);
          await MastersRepository.upsert(rows);
          releasesBar.increment(rows.length);
          songsBar.increment(songsRows.length);
          rows = [];
          songsRows = [];
          stream.resume();
        }
        if (rows.length === bulkSize) {
          stream.pause();
          await MastersRepository.upsert(rows);
          releasesBar.increment(bulkSize);
          rows = [];
          stream.resume();
        }
      }).on('error', (err) => reject(err));
    });
    await releaseStream;
  }
}
