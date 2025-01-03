const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { jwtmiddleware } = require("../jwt");
const { login, signUp,addContact ,userDetails, updateAvatar,getContacts} = require("../controllers/user.controller");

// router.get("/getUserInfo", jwtmiddleware, getUserInfo);
// router.post("/updateUser", jwtmiddleware,updateUser);
router.post("/signup", [
  body("name", "Name must be of 3 to 40 character").isLength({ min: 3 }),
  body("password", "Password atleast contains 8 characters").isLength({
    min: 8,
  }),
],signUp);
router.post("/login",login);
router.post('/addContact',jwtmiddleware,addContact)
// router.get('/get-all-users',jwtmiddleware,getAllUsers)
router.get("/userDetails",jwtmiddleware,userDetails);
router.patch("/updateAvatar",jwtmiddleware,updateAvatar)
router.get("/getContacts",jwtmiddleware,getContacts)


module.exports = router;
