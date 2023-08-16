const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const salespitchsaveSchema = mongoose.Schema(
  {
    pitchid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Salespitch'},
    senderid: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

salespitchsaveSchema.plugin(aggregatePaginate);
salespitchsaveSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Salespitchsave", salespitchsaveSchema);
