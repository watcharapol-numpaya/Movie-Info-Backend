const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const userController = require("../controllers/userController");
const auth = require('../middleware/auth')

router.get("/", userController.getAllUser);
router.get("/:userId", userController.getUserById);
router.get("/:userId/favorite_movie", userController.getFavoriteMovie);
router.post("/register", userController.addNewUser);
router.delete("/unregister/:userId", userController.removeUser);
router.put("/add_favorite_movie", userController.addFavoriteMovie);
router.put("/remove_favorite_movie", userController.removeFavoriteMovie);
router.post("/sign-in", userController.getLogin);


// router.post("/authentication" ,auth )
router.post("/authentication" ,auth.verifyAccessToken,userController.getAuthentication)
router.post("/refresh_token" ,auth.verifyRefreshToken,userController.getRefreshToken)

module.exports = router;
