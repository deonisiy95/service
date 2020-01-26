module.exports = {
  PORT: process.env.PORT || 80,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/geos',
  jwt: {
    secret: 'geoservise',
    tokens: {
      access: {
        type: 'access',
        expiresIn: '15m'
      },
      refresh: {
        type: 'refresh',
        expiresIn: '1h'
      }
    }
  },
};
