const express = require("express");
const router = express.Router();
const { jwtmiddleware } = require("../jwt");
const { sendMessage,getChats } = require("../controllers/chat.controller");

router.post('/send/:id',jwtmiddleware,sendMessage)
router.get('/get-chats/:id',jwtmiddleware,getChats)

module.exports = router