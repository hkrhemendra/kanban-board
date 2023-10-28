const { db } = require("../models");
const Column = db.column;
const Task = db.task;
const Op = db.Sequelize.Op;

const getColumns = async (req, res, next) => {
  try {
    const columns = await Column.findAll();
    res.json({
      status: 200,
      data: columns,
    });
  } catch (err) {
    next(err);
  }
};

const addColumn = async (req, res, next) => {
  try {
    const column = {
      title: req.body.title,
    };

    console.info(Column);

    const newColumn = await Column.create(column);

    res.json({
      status: 200,
      data: newColumn,
    });
  } catch (err) {
    next(err);
  }
};

const createTaskInColumn = async (req, res, next) => {
  const { columnId } = req.params;
  const { content } = req.body;

  console.log("content------> ", content);

  const task = await Task.create({ content, columnId: parseInt(columnId) });
  res.json({
    status: 200,
    data: task,
  });
};

const getTaskByColumnId = async (req, res, next) => {
  const { columnId } = req.params;

  try {
    console.log("Column Id ------> ", columnId);

    const column = await Column.findByPk(parseInt(columnId), {
      include: Task,
    });

    console.log("Column Details ------> ", JSON.stringify(column));

    const tasks = column.tasks;
    res.json({
      status: 200,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTaskByColumnId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const column = await Column.findByPk(id);
    await column.destroy();
    res.json({ status: 200, message: "Column deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addColumn,
  getColumns,
  createTaskInColumn,
  getTaskByColumnId,
  deleteTaskByColumnId
};
