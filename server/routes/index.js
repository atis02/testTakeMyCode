const { Router } = require("express");
const router = Router();

const dataRouter = require("./dataRouter");

router.use("/v1", dataRouter);
module.exports = router;
