const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const biographySchema = mongoose.Schema(
  {
    userid:{type: mongoose.Schema.Types.ObjectId},
    Picture: {
      type: String,
      default: "",
    },
    Identity: {
      type: String,
      default: "",
    },
    SkillCertificate: {
      type: String,
      default: "", // 1 article, 2 image, 3 video
    },
    ProofFunds: {
      type: String,
      default: "",
    },
    signature: {
      type: String,
      default: "",
    },
    Face: {
      type: String,
      default: "", // 1 article, 2 image, 3 video
    },
    Location: {
      type: String,
      default: "",
    },
    Skills: {
      type: String,
      default: "",
    },
    Education: {
      type: String,
      default: "",
    },
    Experience: {
      type: String,
      default: "",
    },
    Wealth: {
      type: String,
      default: "",
    },
    Add: {
      type: String,
      default: "",
    },
    nda: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      default: 1, //1=pending 2=active 3=rejected 4=delete
    },
    textstatus: {
      type: Number,
      default: 1, //1=pending 2=active 3=rejected 4=delete
    },
    Identitystatus: {
      type: Number,
      default: 1, //1=pending 2=active 3=rejected 4=delete
    },
    SkillCertificatestatus: {
      type: Number,
      default: 1, //1=pending 2=active 3=rejected 4=delete
    },
    ProofFundsstatus: {
      type: Number,
      default: 1, //1=pending 2=active 3=rejected 4=delete
    },
    Signaturestatus: {
      type: Number,
      default: 1, //1=pending 2=active 3=rejected 4=delete
    },
  },
  {
    timestamps: true,
  }
);

biographySchema.plugin(aggregatePaginate);
biographySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Biography", biographySchema);
