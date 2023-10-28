const { Router } = require("express");
const {
  addColumn,
  getColumns,
  createTaskInColumn,
  getTaskByColumnId,
  deleteTaskByColumnId
} = require("../controllers/ColumnController");

class ColumnRouter {
  router = Router();

  constructor() {
    this.getRoutes();
    this.postRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get("/", getColumns);
    this.router.get("/:columnId/task", getTaskByColumnId);
  }

  postRoutes() {
    this.router.post("/", addColumn);
    this.router.post("/:columnId/task", createTaskInColumn);
  }

  deleteRoutes(){
    this.router.delete('/:id', deleteTaskByColumnId);
  }
}

module.exports = {
  ColumnRouter: new ColumnRouter().router,
};
