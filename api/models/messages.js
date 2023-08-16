const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const messagesSchema = mongoose.Schema(
  {
    sendorid:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    chatid:{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
    message: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    voice: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    read: {
      type: Boolean,
      default: false, //1=pending 2=active 3=rejected 4=delete
    },
    time:{
        type:Number,
        default:0, // 1 = android 2 = IOS
    },
  },
  {
    timestamps: true,
  }
);

messagesSchema.plugin(aggregatePaginate);
messagesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Messages", messagesSchema);
