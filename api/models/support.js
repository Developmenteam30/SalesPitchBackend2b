const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const supportSchema = mongoose.Schema(
  {
    sendorid:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recieverid:{type: String, default: 'admin'},
    numbers:{
        type:Number,
        default:1, // 1 = android 2 = IOS
    },
  },
  {
    timestamps: true,
  }
);

supportSchema.plugin(aggregatePaginate);
supportSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Support", supportSchema);
