const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Chat = require("../models/chat.model");
const {io, getReceiverSocketId} = require('./../socket/socket')


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

const addContact = async (req, res) => {
  try {
    const { contactNumber, contactName } = req.body;
    const senderId = req.user.userId;
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    
    const friend = await User.findOne({ phoneNumber: contactNumber });
    if (!friend) {
      return res.status(404).send("User is not on chatApp");
    }

    const senderData = await User.findById(senderObjectId);
    if (!senderData) {
      return res.status(404).send("Sender not found");
    }

    const isAlreadyAdded = senderData.contacts.some(f => f.userId.equals(friend._id));
    if (isAlreadyAdded) {
      console.log("The Contact is Already there in your chatList");
      return res.status(400).send("The Contact is Already there in your chatList");
    }

    // Add the new contact
    senderData.contacts.push({ userId: friend._id, contactName });
    await senderData.save();

    // Check if a chat already exists between the sender and the friend
    const existingChat = await Chat.findOne({
      participants: { $all: [senderObjectId, friend._id] }
    });

    if (!existingChat) {
      // Create a new conversation only if it doesn't exist
      const participants = [senderId, friend._id];
      await Chat.create({ participants });
    }

    // Emit the new contact to the sender
    io.to(getReceiverSocketId(senderObjectId)).emit("newContact",senderData.contacts[senderData.contacts.length - 1]);
    res.send("Added successfully");
  } catch (e) {
    console.log("Add to contact in userController : ", e);
    res.status(500).json({ status: "internal error", error: e });
  }
};


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
