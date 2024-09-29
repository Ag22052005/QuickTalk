const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Chat = require("../models/chat.model");

const userDetails = async(req,res)=>{
  try {
    const senderId = req.user.userId;
    const senderObjectId = new mongoose.Types.ObjectId(senderId)
    const user = await User.findById(senderObjectId)
    // console.log(user)
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(504).json(error)
  }
}

const addContact = async(req,res)=>{
  try {
    const {contactNumber,contactName} = req.body
    const senderId = req.user.userId;
    const senderObjectId = new mongoose.Types.ObjectId(senderId)
    const friend = await User.findOne({phoneNumber:contactNumber});
    console.log('friend : ',friend)
    if(!friend){
      res.send("User is not on chatApp");
      return;
    }
    // console.log(senderId)
    // console.log(senderObjectId)
    const senderData = await User.findOne({_id:senderObjectId})
    // console.log("senderData : ",senderData)
    if(!senderData){
      res.send("not added")
      return;
    }
    let isAlreadyAdded = false;
    senderData.contacts.forEach((f)=>{
      if(f.userId == friend._id ) {
        isAlreadyAdded = true;
        return;
      }
    })
    if(isAlreadyAdded) {
      res.send("The Contact is Already there in your chatList")
      return;
    }
    senderData.contacts.push({userId:friend._id,contactName})
    const updatedSender = await senderData.save()
    const participants = [senderId,friend._id]
    const newConversation = await Chat.create({participants})
    const response = await newConversation.save();
    // console.log('addContact response :',response)
    res.send("add successfully")

  } catch (e) {
    console.log("Add to contact in userController : ",e)
    res.status(500).json({ status: "internal error", error: e });
  }
}
const signUp = async (req, res) => {
  try {
    // console.log("hereererere")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.status(504).json({ status: "err", errors: errors.array() });
      // console.log("hiiiiiiiiiiiiiiiiiiiiiii")
      return;
    }
    const data = req.body;
    // console.log(data);
    // password hashing
    const SALT = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(data.password, SALT);
    data.password = hashedpassword;
    // console.log(data);
    const user = new User(data);
    const response = await user.save();
    console.log("User is created");
    const payload = {
      userId: user.id
    };
    const authToken = jwt.sign(payload, process.env.JWT_KEY);
    // console.log(authToken);
    res.status(200).json({ user, authToken: authToken });
    res.status(201).json(response)
  } catch (e) {
    console.log(e);
    if (e.errorResponse && e.errorResponse.code === 11000) {
      res.status(504).json({ status: "user exists", error: e });
    } else {
      res.status(500).json({ status: "internal error", error: e });
    }
  }
};

const login = async (req, res) => {
  try {
    const user = req.body;
    const isUser = await User.findOne({ phoneNumber:user.phoneNumber})

    if (!isUser) {
      throw new Error("User Not Found");
    }
    const cmpPassword = await bcrypt.compare(user.password, isUser.password);
    if (!cmpPassword) {
      throw new Error("Password is Incorrect");
    }
    const payload = {
      userId: isUser.id,
    };
    const authToken = jwt.sign(payload, process.env.JWT_KEY);
    // console.log(authToken);
    res.status(200).json({ user: isUser, authToken: authToken });
  } catch (error) {
    console.log("login Error ", error)
    if (error.message === "User Not Found")
      res.status(404).json({ errmsg: error.message });
    else if (error.message === "Password is Incorrect")
      res.status(401).json({ errmsg: error.message });
    else {
      res.status(500).json({ errmsg: error.message });
    }
  }
};


module.exports = { signUp, login,addContact,userDetails };
