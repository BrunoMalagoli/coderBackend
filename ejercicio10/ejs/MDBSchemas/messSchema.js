const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const messageSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  lname: { type: String, required: true },
  age: { type: Number, required: true },
  alias: { type: String },
  avatar: { type: String, required: true },
});

let Message = mongoose.model("Message", messageSchema);
module.exports = Message;
