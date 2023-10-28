const { Router } = require("express");
const {listTasks, deleteTaskById, moveTaskToColumn} = require("../controllers/TaskController.js");


class TaskRouter {
    
    router = Router();

    constructor(){  
        this.getRoutes();
        this.deleteRoutes();
        this.patchRoutes();
    }

    getRoutes(){
        this.router.get('/', listTasks);
    }

    patchRoutes(){
        this.router.patch('/:taskId', moveTaskToColumn)
    }

    deleteRoutes(){
        this.router.delete('/:id', deleteTaskById);
    }

}

module.exports = {
    TaskRouter: new TaskRouter().router,
};
