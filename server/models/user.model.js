const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    unique: true,
    required: true, 
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {  
    type: String,
    default: "",
  },
  contacts: {
    type: [{
      userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
      },
      
      contactName: {
        type: String,
        required: true,
      },
    }],
    default: [],
  },
},{timestamps:true});

const User = mongoose.model("User", UserSchema);
module.exports = User;
