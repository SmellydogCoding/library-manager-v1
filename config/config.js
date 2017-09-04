// load env file if in development environment
try { require('../env.js'); } catch(error) {}

module.exports = {
  "original": {
    "storage": "db/library.db",
    "port": 3000,
    "dialect": "sqlite"
  },
  "development": {
    "username": "Daniel",
    "password": process.env.localDBPass,
    "database": "library-manager",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.proDBUser,
    "password": process.env.proDBPass,
    "database": process.env.proDBUser,
    "host": "stampy.db.elephantsql.com",
    "port": 5432,
    "dialect": "postgres"
  }
}