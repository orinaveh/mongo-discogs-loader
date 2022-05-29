export const config = {
  application: {
    environment: process.env.NODE_ENV || 'production',
  },
  dumpNames: ['artists', 'releases'],
  bulkSize: 10000,
};
