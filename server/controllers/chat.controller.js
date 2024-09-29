const User = require("../models/user.model")
const Message = require("../models/message.model")
const Chat = require("../models/chat.model")
const mongoose = require('mongoose')
const {io, getReceiverSocketId} = require('./../socket/socket')



const getChats =async (req,res)=>{
  const sender = req.user.userId;
  const senderId = new mongoose.Types.ObjectId(sender)
  const {id:receiverId} = req.params
  try {
    const conversation = await Chat.findOne({participants:{
      $all:[senderId,receiverId],
    }}).populate('messages');
    res.json(conversation)
    // console.log(conversation)
    
  } catch (error) {
    console.log(error)
    res.status(504).json(error)
  }
}

const sendMessage = async (req,res)=>{
  const sender = req.user.userId;
  const senderId = new mongoose.Types.ObjectId(sender)
  // console.log(sender)
  const {id:receiverId} = req.params
  // console.log(receiverId)
  const {message} = req.body;
  // console.log(message)
  try {
    const newMessage = await Message.create({senderId,receiverId,message});
    let conversation = await Chat.findOne({
      participants:{
        $all:[senderId,receiverId]
      }
    });
    conversation.messages.push(newMessage._id)
    await Promise.all([newMessage.save(),conversation.save()]);
    
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    
    res.status(201).json(newMessage)
  } catch (error) {
    console.log(error)
    res.status(504).json(error)
  }
}
module.exports = {sendMessage,getChats}