const config = require('../config.json')

new (require('sequelize-auto'))(config.database, config.user, config.password, {
  port: config.databasePort,
  additional: { timestamps: false }
}).run()
