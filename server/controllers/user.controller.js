const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Chat = require("../models/chat.model");
const {io, getReceiverSocketId} = require('./../socket/socket')




const addContact = async (req, res) => {
  try {
    // Input validation
    const { contactNumber, contactName } = req.body;
    if (!contactNumber || !contactName) {
      return res.status(400).json({ 
        status: "error", 
        message: "Contact number and contact name are required" 
      });
    }

    const senderId = req.user.userId;
    const senderObjectId = new mongoose.Types.ObjectId(senderId);

    // Optimized parallel queries with specific field selection
    const [friend, senderData] = await Promise.all([
      User.findOne({ phoneNumber: contactNumber })
        .select('_id name phoneNumber profilePic')
        .lean(),
      User.findById(senderObjectId)
        .select('_id contacts name')
    ]);

    // Early validation checks
    if (!friend) {
      return res.status(404).json({ 
        status: "error", 
        message: "User is not registered on ChatApp" 
      });
    }

    if (!senderData) {
      return res.status(404).json({ 
        status: "error", 
        message: "Sender not found" 
      });
    }

    // Prevent adding self as contact
    if (senderData._id.equals(friend._id)) {
      return res.status(400).json({ 
        status: "error", 
        message: "Cannot add yourself as a contact" 
      });
    }

    // Check if contact already exists using optimized method
    const isAlreadyAdded = senderData.contacts.some(contact => 
      contact.userId.equals(friend._id)
    );
    
    if (isAlreadyAdded) {
      return res.status(409).json({ 
        status: "error", 
        message: "Contact already exists in your chat list" 
      });
    }

    const [updatedUser,updatedFriend ,existingChat] = await Promise.all([
      
      User.findByIdAndUpdate(
        senderObjectId,
        { $push: { contacts: { userId: friend._id, contactName } } },
        { new: true, select: 'contacts' }
      ),
      User.findByIdAndUpdate(
        friend._id,
        {$push:{contacts:{userId:senderObjectId,contactName:senderData.name||"unknown"}}},
        {new:true}
      ),
      // Check for existing chat in parallel
      Chat.findOne({
        participants: { $all: [senderObjectId, friend._id] }
      }).select('_id').lean()
    ]);

    console.log("updated friend",updatedFriend)

    // Create chat if it doesn't exist (non-blocking)
    if (!existingChat) {
      Chat.create({ participants: [senderId, friend._id] }).catch(error => {
        console.error("Error creating chat:", error);
      });
    }

    // Emit new contact event (uncomment if needed)
    // const receiverSocketId = getReceiverSocketId(senderObjectId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newContact", {
    //     userId: friend._id,
    //     contactName,
    //     userId: {
    //       _id: friend._id,
    //       name: friend.name,
    //       phoneNumber: friend.phoneNumber,
    //       profilePic: friend.profilePic
    //     }
    //   });
    // }

    res.status(201).json({ 
      status: "success", 
      message: "Contact added successfully",
      contact: {
        userId: friend._id,
        contactName,
        name: friend.name,
        phoneNumber: friend.phoneNumber,
        profilePic: friend.profilePic
      }
    });

  } catch (error) {
    console.error("Add contact error:", error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        status: "error", 
        message: "Invalid data provided",
        details: error.message 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        status: "error", 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      status: "error", 
      message: "Internal server error",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};

const signUp = async (req, res) => {
  try {
    // console.log("hereererere")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.status(504).json({errors: errors.array() });
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
    delete response.password
    const authToken = jwt.sign(payload, process.env.JWT_KEY);
    // console.log(authToken);
    res.status(200).json({ user:response, authToken: authToken });

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
    const isUser = await User.findOne({ phoneNumber:user.phoneNumber}).populate({
      path: "contacts.userId", // Path to populate
      select: "-password -contacts" // Fields to include from the referenced User
    });

    if (!isUser) {
      throw new Error("User Not Found");
    }
    const cmpPassword = await bcrypt.compare(user.password, isUser.password);
    if (!cmpPassword) {
      throw new Error("Password is Incorrect");
    }
    const payload = {
      userId: isUser._id,
    };
    const authToken = jwt.sign(payload, process.env.JWT_KEY);
    // console.log(authToken);
    delete isUser.password;
    console.log(isUser)
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

const updateAvatar = async (req,res)=>{
  const {phoneNumber,url }  = req.body
  console.log(phoneNumber,url)
  const user = await User.findOneAndUpdate({phoneNumber},{$set:{profilePic:url}},{new:true})
  res.status(200).json(user);
}

const UploadProfliePic = async (req,res)=>{
  const userId = req.user.userId
  console.log("userId", userId)
  const id = new mongoose.Types.ObjectId(userId);
  const secure_url = req.uploadResult.secure_url
  const user = await User.findOneAndUpdate(
    { _id: id },
    { profilePic: secure_url},
    { new: true, runValidators: true }
  );
  console.log("Profile url is updated")
  res.status(200).json(user);
}

module.exports = { signUp, login,addContact,updateAvatar ,UploadProfliePic};
