const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const chatSchema = mongoose.Schema(
  {
    sendorid:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recieverid:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    numbers:{
        type:Number,
        default:1, // 1 = android 2 = IOS
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

chatSchema.plugin(aggregatePaginate);
chatSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Chat", chatSchema);
