const { db } = require("../models");
const Task = db.task;
const Column = db.column;

const listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll();
    res.json({
      status: 200,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTaskById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);
    await task.destroy();
    res.json({ status: 200, message: "Column deleted" });
  } catch (err) {
    next(err);
  }
};

const moveTaskToColumn = async (req, res, next) => {
  const { taskId } = req.params;
  const { newColumnId } = req.body;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const newColumn = await Column.findByPk(parseInt(newColumnId));
    if (!newColumn) {
      return res.status(404).json({ error: "New column not found" });
    }

    task.columnId = newColumnId;
    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTasks,
  deleteTaskById,
  moveTaskToColumn,
};
