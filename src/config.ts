export const config = {
  application: {
    environment: process.env.NODE_ENV || 'production',
  },
  dumpNames: ['artists', 'masters'],
  artistsCsvs: ['artist.csv', 'artist_namevariation.csv'],
};
