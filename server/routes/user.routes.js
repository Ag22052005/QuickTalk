const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { jwtmiddleware } = require("../jwt");
const { login, signUp,addContact , updateAvatar,UploadProfliePic,getContact} = require("../controllers/user.controller");
const {multermiddleware ,upload} = require("../middlewares/multer.middleware");

// router.get("/getUserInfo", jwtmiddleware, getUserInfo);
// router.post("/updateUser", jwtmiddleware,updateUser);
router.post("/signup", [
  body("name", "Name must be of 3 to 40 character").isLength({ min: 3 }),
  body("password", "Password atleast contains 8 characters").isLength({
    min: 6,
  }),
  body("phoneNumber","Invalid PhoneNumber").isLength({min:10,max:10}).isNumeric()
],signUp);
router.post("/login",login);
router.post('/addContact',jwtmiddleware,addContact)
router.get('/get-contacts',jwtmiddleware,getContact)
// router.get('/get-all-users',jwtmiddleware,getAllUsers)
router.patch("/updateAvatar",jwtmiddleware,updateAvatar)
router.post("/upload-profile-pic",upload.single("myfile"),jwtmiddleware,multermiddleware,UploadProfliePic);

module.exports = router;
