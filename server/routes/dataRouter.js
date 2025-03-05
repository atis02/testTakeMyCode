const Router = require("express");
const dataController = require("../controllers/dataController");
const router = new Router();

router.post("/data", dataController.createTestData);
router.get("/allData", dataController.getTestData);
router.post("/updateOrder", dataController.updateSortOrder);
router.post("/updateSelected", dataController.updateSelectedItems);

module.exports = router;
