const express = require("express");
const bodyParser = require("body-parser");
const { TaskRouter } = require("./routes/TaskRoute.js");
const { ColumnRouter } = require("./routes/ColumnRoute.js");
const { sequelize } = require("./models");

class Server {
  app = express();

  constructor() {
    this.setConfiguration();
    this.setRoutes();
    this.error404Handler();
    this.handleError();
  }

  setConfiguration() {
    this.connectToPostGres()
    this.configureBodyParse()
  }

  connectToPostGres() {
    sequelize.sync({ force: false }).then(() => {
      console.log("Database & tables synced successfully");
    });
  }

  configureBodyParse() {
    console.log("Body parser configured")
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
  }

  setRoutes() {
    this.app.use("/api/v1/task/", TaskRouter);
    this.app.use("/api/v1/column/", ColumnRouter)
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Not Founed",
        status: 404,
      });
    });
  }

  handleError() {
    this.app.use((err, req, res, next) => {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong. Please try again",
        error: err,
      });
    });
  }
}

module.exports = Server;
