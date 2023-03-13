const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.use(authController.protect);

router.patch("/updateMyPassword/:id", authController.updatePassword);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createOneUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateOneUser)
  .delete(userController.deleteOneUser);

module.exports = router;
