const express = require('express')
require('dotenv').config();
const db = require('./db.js')
const cors = require('cors')
const userRoutes = require('./routes/user.routes.js')
const chatRoutes = require('./routes/chat.routes.js');
const { app,server } = require('./socket/socket.js');
const PORT = 3000;
app.use(cors())
app.use(express.json())

app.use('/',userRoutes);
app.use('/',chatRoutes);


app.get("/", (req, res) => {
  res.send("Hello User");
});


server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
