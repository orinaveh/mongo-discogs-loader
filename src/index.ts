#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import mongoose from 'mongoose';
import { config } from './config';
import { ArtistsManager } from './managers/artists';
import { MastersManager } from './managers/masters';

const { dumpNames } = config;

const program = new Command();

program
  .name('mongo-discogs-loader')
  .description('CLI to Load Discogs dumps into mongo')
  .version('0.0.1')
  .command('load')
  .option('-o, --connection <String>', 'Mongo connection URL')
  .option('-d, --db <String>', 'DB Name', 'music')
  .arguments('<Path>')
  .action(async (files: string, options) => {
    const { connection, db } = options;
    const filesArray = files.split(' ');
    await mongoose.connect(`${connection}/${db}`);
    console.log(chalk.green('Mongoose Connected Successfully'));

    await Promise.all(dumpNames.map(async (dumpName) => {
      const pathName = filesArray.find((fileName) => fileName.includes(dumpName));
      if (pathName) {
        console.log(chalk.underline(`Loading to Mongo - ${dumpName}`));
        switch (dumpName) {
          case 'artists':
            return ArtistsManager.upsert(pathName);
          case 'releases':
            return MastersManager.upsert(pathName);
          default: return null;
        }
      }
      return null;
    }));

    await mongoose.connection.close();
    console.log(chalk.green('Mongo Connection Closed Successfully'));
  });

program.parse(process.argv);
