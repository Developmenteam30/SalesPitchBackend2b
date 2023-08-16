const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const postsaveSchema = mongoose.Schema(
  {
    types: {
      type: Number,
      required: true, // 1 interested, 2 notinterested
    },
    postid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    userid: {
      type: mongoose.Schema.Types.ObjectId
    },
  },
  {
    timestamps: true,
  }
);

postsaveSchema.plugin(aggregatePaginate);
postsaveSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Postsave", postsaveSchema);
