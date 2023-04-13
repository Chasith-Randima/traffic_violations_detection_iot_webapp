const express = require("express");
const router = express();

const caseController = require("../controllers/caseController");

router.use("/search", caseController.searchCases);
router.use("/searchCases", caseController.searchCityCases);

// -------------aggregate functions routes-------------------

// router.route("/handleVehicleNumber").get(caseController.handleNumberPlate);
router
  .route("/handleVehicleNumber/:vehicleNumber/:city")
  .get(caseController.handleNumberPlate);

router
  .route("/")
  .get(caseController.getAllCases)
  .post(caseController.createCase);

router
  .route("/:id")
  .get(caseController.getOneCase)
  .patch(caseController.updateOneCase)
  .delete(caseController.deleteOneCase);

module.exports = router;
