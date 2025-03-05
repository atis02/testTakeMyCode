const express = require("express");
const { PORT } = require("./config");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", router);
app.use(errorHandler);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server started on port ${PORT} `));
  } catch (error) {
    console.error("Unable to connect:", error);
  }
};
start();
