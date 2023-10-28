const { Sequelize } = require("sequelize");
const taskModel = require("./task.model");


module.exports = (sequelize, Sequelize) => {

    const Column = sequelize.define("column", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
    })

    console.log('column start')
    Column.hasMany(
        require('./task.model')(sequelize, Sequelize),
        {
          foreignKey: "columnId",
          onDelete: "CASCADE",
        }
      )
    console.log('column end')

    // Column.hasman

    return Column;
    
}