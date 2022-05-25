import chalk from 'chalk';
import { Command } from 'commander';
import mongoose from 'mongoose';
import open from 'open';
import path from 'path';
import { config } from './config';
import { ArtistsManager } from './managers/artists';

const { dumpNames } = config;

const program = new Command();

program
  .name('Discogs Loader')
  .description('CLI to Load Discogs dumps into mongo')
  .version('0.0.1')
  .option('-o, --connection <String>', 'Mongo connection URL')
  .option('-s, --skip', 'Skip Csv Conversion')
  .arguments('<Path>')
  .action(async (files: string, options) => {
    const { connection, skip } = options;
    const filesArray = files.split(' ');
    await mongoose.connect(`${connection}/music`);
    console.log(chalk.green('Mongoose Connected Successfully'));

    if (!skip) {
      await open(`/C ${__dirname}\\exe\\discogs.exe ${files}`, { wait: true, app: { name: 'cmd' } });
      console.log(chalk.green('Finished Creating CSV'));
    } else {
      console.log(chalk.underline('Skipping CSV Creation'));
    }

    await Promise.all(dumpNames.map(async (dumpName) => {
      const pathName = filesArray.find((fileName) => fileName.includes(dumpName));
      if (pathName) {
        const folderPath = path.join(pathName, '/../');
        console.log(chalk.underline(`Loading to Mongo - ${dumpName}`));
        switch (dumpName) {
          case 'artists':
            return ArtistsManager.upsert(folderPath);
          case 'releases':
            console.log('dasdsa');
            break;
          default: return null;
        }
      }
      return null;
    }));

    await mongoose.connection.close();
    console.log(chalk.green('Mongo Connection Closed Successfully'));
  });

program.parse(process.argv);
