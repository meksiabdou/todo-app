const router = require("express").Router();
const validator = require("../middlewares/validator");
const users = require("../services/usersService");

router.post("/login", validator.Login, users.Login);

router.post("/register", validator.Register, users.Register);

router.post("/get-user-by-token", users.getUserByToken);


module.exports = router;
