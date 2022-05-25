import chalk from 'chalk';
import { Command } from 'commander';
import mongoose from 'mongoose';
import { config } from './config';
import { ArtistsManager } from './managers/artists';
import { MastersManager } from './managers/masters';

const { dumpNames } = config;

const program = new Command();

program
  .name('Discogs Loader')
  .description('CLI to Load Discogs dumps into mongo')
  .version('0.0.1')
  .option('-o, --connection <String>', 'Mongo connection URL')
  .option('-r, --release <String>', 'Release XML path')
  .arguments('<Path>')
  .action(async (files: string, options) => {
    const { connection, release } = options;
    const filesArray = files.split(' ');
    await mongoose.connect(`${connection}/music`);
    console.log(chalk.green('Mongoose Connected Successfully'));

    await Promise.all(dumpNames.map(async (dumpName) => {
      const pathName = filesArray.find((fileName) => fileName.includes(dumpName));
      if (pathName) {
        console.log(chalk.underline(`Loading to Mongo - ${dumpName}`));
        switch (dumpName) {
          case 'artists':
            return ArtistsManager.upsert(pathName);
          case 'masters':
            return MastersManager.upsert(pathName, release);
          default: return null;
        }
      }
      return null;
    }));

    await mongoose.connection.close();
    console.log(chalk.green('Mongo Connection Closed Successfully'));
  });

program.parse(process.argv);
