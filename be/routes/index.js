const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const fridgesController = require("../controllers/fridges");
const auth = require("../controllers/auth");

router.use("/auth/signin", auth.loginUser);
router.use("/auth/register", auth.registerUser);
router.use("/users/generate/:no_records", userController.generateFakeUsers);
router.use("/fridges/generate/:no_records", fridgesController.generateFakeFridge);
module.exports = router;
