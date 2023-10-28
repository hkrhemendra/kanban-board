const { Sequelize } = require("sequelize");
const columnModel = require('./column.model')

module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("task", {
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    
    })

    return Task;

}