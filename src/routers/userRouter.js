const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const userController = require("../controllers/userController");

router.get("/", userController.getUser);
router.get("/:userId", userController.getUserById);
router.get("/:userId/favorite_movie", userController.getFavoriteMovie);
router.get("/register", userController.addNewUser);
router.get("/unregister", userController.removeUser);
router.get("/add_favorite_movie", userController.addFavoriteMovie);
router.get("/remove_favorite_movie", userController.removeFavoriteMovie);





module.exports = router;
