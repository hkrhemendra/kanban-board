const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.column = require('./column.model.js')(sequelize, Sequelize);
db.task = require('./task.model.js')(sequelize, Sequelize);

db.column.hasMany(db.task, {foreingKey: 'columnId', })
db.task.belongsTo(db.column, {foreingKey: 'columnId'});

module.exports = {
  db,
  sequelize
};
