const express = require("express");

const uploadFile = require("./services/multer");

const router = express.Router();

/* ************************************************************************* */
const userControllers = require("./controllers/userControllers");
const signup = require("./services/signup");
const { hashPassword, verifyPassword } = require("./services/hashPwd");
const { checkToken } = require("./services/jwt");

// Route to get a list of items
router.get("/users", userControllers.browse);

// Route to get a specific item by ID
router.get("/users/:id", userControllers.read);

// Route to add a new user
router.post("/users", signup, hashPassword, userControllers.add);
router.delete("/users/:id", userControllers.destroy);

router.put("/users/:id/addtheme", userControllers.editTheme);

router.post("/login", verifyPassword, userControllers.login);
router.get("/protected", checkToken, userControllers.refreshToken);
router.get("/logout", userControllers.logout);
/* ************************************************************************* */
const gridControllers = require("./controllers/gridControllers");

router.get("/grids", gridControllers.browse);

// Route to get a specific grid by ID
router.get("/grids/:id", gridControllers.read);

// get grid by user id
router.get("/users/:user_id/grids", gridControllers.readByUser);

// Route to add a new grid
router.post("/grids", gridControllers.add);

router.delete("/grids/:id", gridControllers.destroy);
/* ************************************************************************* */
const pixelControllers = require("./controllers/pixelControllers");
const { isPixelValid } = require("./middlewares/isPixelValid");

// Route to get all pixel in a specific grid
router.get("/grids/:grid_id/pixels", pixelControllers.browse);

// Route to get a specific pixel details in a specific grid
router.get("/grids/:grid_id/pixels/:id", pixelControllers.read);

// Route to add a new pixel in a specific grid
router.post("/grids/:grid_id/pixels", isPixelValid, pixelControllers.add);

router.delete("/grids/:grid_id/pixels/:id", pixelControllers.destroy);

/* ************************************************************************* */

module.exports = router;
