const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const fridgesController = require("../controllers/fridges");
const itemsController = require("../controllers/items");
const middlewares = require("../controllers/middlewares");
const auth = require("../controllers/auth");

router.use("/auth/signin", auth.loginUser);
router.use("/auth/register", auth.registerUser);
router.use("/users/generate/:no_records", userController.generateFakeUsers);

router.use("/fridges/generate/:no_records", fridgesController.generateFakeFridge);
router.use("/fridges/create/:userId", middlewares.verifyToken, fridgesController.createFridge);
router.use("/fridges/update/:fridgeId", middlewares.verifyToken, fridgesController.updateFridge);
router.use("/fridges/delete/:fridgeId", middlewares.verifyToken, fridgesController.deleteFridge);
router.use("/fridges/:userId", fridgesController.getFridgeOfUser);

router.use("/items/generate/:no_records", itemsController.generateFakeItems);
router.use("/items/create/:fridgeId/:userId", middlewares.verifyToken, itemsController.addItem);
router.use("/items/update/:itemId", middlewares.verifyToken, itemsController.updateItem);
router.use("/items/delete/:itemId", middlewares.verifyToken, itemsController.deleteItem);


module.exports = router;
