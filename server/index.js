const express = require("express");
const { PORT } = require("./config");
const sequelize = require("./db");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log(
      "Connection to the database has been established successfully."
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT} `));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
start();
