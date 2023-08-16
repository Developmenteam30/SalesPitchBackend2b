const FCMDB = require("../models/fcm");
const mongoose = require("mongoose");
const Helper = require("../helper/index");
const niv = require("node-input-validator");
const biography = require("../models/biography");
const User = require("../models/user");
const Notification = require("../models/notification");

exports.add = async (req, res, next) => {
//   const validator = new niv.Validator(req.body, {
//     Picture: "required",
//   });
//   const matched = await validator.check();
//   if (!matched) {
//     return res.status(422).send({
//       message: "Validation error",
//       errors: validator.errors,
//     });
//   }

  const { userid, Location, Skills, Education, Experience, Wealth, Add, textstatus, nda, comment, status, Identitystatus, SkillCertificatestatus, ProofFundsstatus, Signaturestatus } = req.body;

  try {
    let createObj = {};
    createObj.userid = userid;
    createObj.Location = Location;
    createObj.Skills = Skills;
    createObj.Education = Education;
    createObj.Experience = Experience;
    createObj.Wealth = Wealth;
    createObj.Add = Add;
    if(textstatus){
        createObj.textstatus = textstatus;
    }else{
        createObj.textstatus = 1;
    }
    createObj.nda = nda;
    createObj.comment = comment;
    createObj.status = status;
    createObj.Identitystatus = Identitystatus;
    createObj.SkillCertificatestatus = SkillCertificatestatus;
    createObj.ProofFundsstatus = ProofFundsstatus;
    createObj.Signaturestatus = Signaturestatus;

    if (req.files.ProofFunds) {
      if (
        req.files.ProofFunds[0].mimetype == "image/png" ||
        req.files.ProofFunds[0].mimetype == "image/jpg" ||
        req.files.ProofFunds[0].mimetype == "image/jpeg" ||
        req.files.ProofFunds[0].mimetype == "image/gif" ||
        req.files.ProofFunds[0].mimetype == 'application/octet-stream' ||
        req.files.ProofFunds[0].mimetype == "application/pdf"
      ) {
        createObj.ProofFunds = req.files.ProofFunds[0].path;
      } else {
        return res.status(500).json({
          message: "Only .png .jpg .jpeg and .gif format image files allowed!",
        });
      }
    } 
    if (req.files.Face) {
      if (
        req.files.Face[0].mimetype == "image/png" ||
        req.files.Face[0].mimetype == "image/jpg" ||
        req.files.Face[0].mimetype == "image/jpeg" ||
        req.files.Face[0].mimetype == 'application/octet-stream' ||
        req.files.Face[0].mimetype == "image/gif"
      ) {
        createObj.Face = req.files.Face[0].path;
      } else {
        return res.status(500).json({
          message: "Only image files allowed!"+req.files.Face[0].mimetype,
        });
      }
    }    
    if (req.files.Picture) {
      if (
        req.files.Picture[0].mimetype == "image/png" ||
        req.files.Picture[0].mimetype == "image/jpg" ||
        req.files.Picture[0].mimetype == "image/jpeg" ||
        req.files.Picture[0].mimetype == 'application/octet-stream' ||
        req.files.Picture[0].mimetype == "image/gif"
      ) {
        createObj.Picture = req.files.Picture[0].path;
      } else {
        return res.status(500).json({
          message: "Only image files allowed!"+req.files.Picture[0].mimetype,
        });
      }
    }
    if (req.files.Identity) {
      if (
        req.files.Identity[0].mimetype == "image/png" ||
        req.files.Identity[0].mimetype == "image/jpg" ||
        req.files.Identity[0].mimetype == "image/jpeg" ||
        req.files.Identity[0].mimetype == 'application/octet-stream' ||
        req.files.Identity[0].mimetype == "image/gif"
      ) {
        createObj.Identity = req.files.Identity[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }
    if (req.files.SkillCertificate) {
      if (
        req.files.SkillCertificate[0].mimetype == "image/png" ||
        req.files.SkillCertificate[0].mimetype == "image/jpg" ||
        req.files.SkillCertificate[0].mimetype == "image/jpeg" ||
        req.files.SkillCertificate[0].mimetype == 'application/octet-stream' ||
        req.files.SkillCertificate[0].mimetype == "image/gif"
      ) {
        createObj.SkillCertificate = req.files.SkillCertificate[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }
    if (req.files.signature) {
      if (
        req.files.signature[0].mimetype == "image/png" ||
        req.files.signature[0].mimetype == "image/jpg" ||
        req.files.signature[0].mimetype == "image/jpeg" ||
        req.files.signature[0].mimetype == 'application/octet-stream' ||
        req.files.signature[0].mimetype == "image/gif"
      ) {
        createObj.signature = req.files.signature[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }
    const exist = await biography.find({userid: req.body.userid});
    var result;
    if (exist && exist.length > 0) {
        var d = exist[0];
        if (!createObj.signature) {
            createObj.signature = d.signature;
        }
        if (!createObj.SkillCertificate) {
            createObj.SkillCertificate = d.SkillCertificate;
            createObj.SkillCertificatestatus = d.SkillCertificatestatus;
        }
        if (!createObj.Identity) {
            createObj.Identity = d.Identity;
            createObj.Identitystatus = Identitystatus;
        }
        if (!createObj.Picture) {
            createObj.Picture = d.Picture;
        }
        if (!createObj.Face) {
            createObj.Face = d.Face;
            createObj.status = d.status;
        }
        if (!createObj.ProofFunds) {
            createObj.ProofFunds = d.ProofFunds;
            createObj.ProofFundsstatus = d.ProofFundsstatus;
        }
        if (!createObj.signature){
            createObj.signature = d.signature;
            createObj.Signaturestatus = d.Signaturestatus;
        }
        result = await biography.findByIdAndUpdate(
          d._id,
          {
            $set: createObj,
          },
          {
            new: true,
          }
        );

    }else{
        result = new biography(createObj);
        await result.save();
        var objectIds = await User.findById(userid);
        var objectId = await User.findById('64c8d7ae44bb8a150be9d290');
        let message = "Biography pending Approval";
        const new_notification = new Notification({
          sender: objectIds._id,
          receiver: objectId._id,
          title: message,
          type: 12,
          unread_flag: 0,
          text: message,
        });
        const resultq = await new_notification.save();
    }


    res.status(201).json({
      message: "Post has been successfully added",
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occured. Please try again",
      error: err.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;

  const { userid, Location, Skills, Education, Experience, Wealth, Add, textstatus, nda, comment, status, Identitystatus, SkillCertificatestatus, ProofFundsstatus, ProofFunds1, Face1, Identity1, SkillCertificate1, signature1, Picture1, Signaturestatus } = req.body;

    let updateObj = {};
    updateObj.userid = userid;
    updateObj.Location = Location;
    updateObj.Skills = Skills;
    updateObj.Education = Education;
    updateObj.Experience = Experience;
    updateObj.Wealth = Wealth;
    updateObj.Add = Add;
    if(textstatus){
        updateObj.textstatus = textstatus;
    }
    updateObj.nda = nda;
    updateObj.comment = comment;
    updateObj.status = status;
    updateObj.Identitystatus = Identitystatus;
    updateObj.ProofFundsstatus = ProofFundsstatus;
    updateObj.SkillCertificatestatus = SkillCertificatestatus;
    updateObj.ProofFundsstatus = ProofFundsstatus;
    updateObj.Signaturestatus = Signaturestatus;
    const salespitc = await biography.findById(id);
    if(salespitc.Signaturestatus != Signaturestatus){
        let message;
        if (Signaturestatus == 1) message = "Your Bio has been successfully submitted";
        if (Signaturestatus == 2) message = "Your Bio has been Approved";
        if (Signaturestatus == 3) message = "Your Bio has been Rejected";
        const senderas = await User.findById(salespitc.userid);
        const new_notification = new Notification({
          sender: senderas._id,
          receiver: senderas._id,
          title: message,
          type: 8,
          text: message,
        });
        const resultssss = await new_notification.save();
    }
    if(textstatus && salespitc.textstatus && salespitc.textstatus != textstatus){
        let message;
        if (textstatus == 1) message = "Your Bio has been successfully submitted";
        if (textstatus == 2) message = "Your Bio has been Approved";
        if (textstatus == 3) message = "Your Bio has been Rejected";
        const senderas = await User.findById(salespitc.userid);
        const new_notification = new Notification({
          sender: senderas._id,
          receiver: senderas._id,
          title: message,
          type: 8,
          text: message,
        });
        const resultssss = await new_notification.save();
    }

    if(salespitc.status != status){
        let message;
        if (status == 1) message = "Your Bio has been successfully submitted";
        if (status == 2) message = "Your Bio has been Approved";
        if (status == 3) message = "Your Bio has been Rejected";
        const senderas = await User.findById(salespitc.userid);
        const new_notification = new Notification({
          sender: senderas._id,
          receiver: senderas._id,
          title: message,
          type: 8,
          text: message,
        });
        const resultssss = await new_notification.save();
    }
    if(salespitc.Identitystatus != Identitystatus){
        let message;
        if (Identitystatus == 1) message = "Your Bio has been successfully submitted";
        if (Identitystatus == 2) message = "Your Bio has been Approved";
        if (Identitystatus == 3) message = "Your Bio has been Rejected";
        const senderas = await User.findById(salespitc.userid);
        const new_notification = new Notification({
          sender: senderas._id,
          receiver: senderas._id,
          title: message,
          type: 8,
          text: message,
        });
        const resultssss = await new_notification.save();
    }
    if(salespitc.ProofFundsstatus != ProofFundsstatus){
        let message;
        if (ProofFundsstatus == 1) message = "Your Bio has been successfully submitted";
        if (ProofFundsstatus == 2) message = "Your Bio has been Approved";
        if (ProofFundsstatus == 3) message = "Your Bio has been Rejected";
        const senderas = await User.findById(salespitc.userid);
        const new_notification = new Notification({
          sender: senderas._id,
          receiver: senderas._id,
          title: message,
          type: 8,
          text: message,
        });
        const resultssss = await new_notification.save();
    }
    if(salespitc.SkillCertificatestatus != SkillCertificatestatus){
        let message;
        if (SkillCertificatestatus == 1) message = "Your Bio has been successfully submitted";
        if (SkillCertificatestatus == 2) message = "Your Bio has been Approved";
        if (SkillCertificatestatus == 3) message = "Your Bio has been Rejected";
        const senderas = await User.findById(salespitc.userid);
        const new_notification = new Notification({
          sender: senderas._id,
          receiver: senderas._id,
          title: message,
          type: 8,
          text: message,
        });
        const resultssss = await new_notification.save();
    }

    if (req.files.ProofFunds) {
      if (
        req.files.ProofFunds[0].mimetype == "image/png" ||
        req.files.ProofFunds[0].mimetype == "image/jpg" ||
        req.files.ProofFunds[0].mimetype == "image/jpeg" ||
        req.files.ProofFunds[0].mimetype == "image/gif" ||
        req.files.ProofFunds[0].mimetype == 'application/octet-stream' ||
        req.files.ProofFunds[0].mimetype == "application/pdf"
      ) {
        updateObj.ProofFunds = req.files.ProofFunds[0].path;
      } else {
        return res.status(500).json({
          message: "Only .png .jpg .jpeg and .gif format image files allowed!",
        });
      }
    } else{
        updateObj.ProofFunds = ProofFunds1;
    }
    if (req.files.Picture) {
      if (
        req.files.Picture[0].mimetype == "image/png" ||
        req.files.Picture[0].mimetype == "image/jpg" ||
        req.files.Picture[0].mimetype == "image/jpeg" ||
        req.files.Picture[0].mimetype == 'application/octet-stream' ||
        req.files.Picture[0].mimetype == "image/gif"
      ) {
        updateObj.Picture = req.files.Picture[0].path;
      } else {
        return res.status(500).json({
          message: "Only image files allowed!"+req.files.Picture[0].mimetype,
        });
      }
    }else{
        updateObj.Picture = Picture1;
    }
    if (req.files.Face) {
      if (
        req.files.Face[0].mimetype == "image/png" ||
        req.files.Face[0].mimetype == "image/jpg" ||
        req.files.Face[0].mimetype == "image/jpeg" ||
        req.files.Face[0].mimetype == 'application/octet-stream' ||
        req.files.Face[0].mimetype == "image/gif"
      ) {
        updateObj.Face = req.files.Face[0].path;
      } else {
        return res.status(500).json({
          message: "Only image files allowed!"+req.files.Face[0].mimetype,
        });
      }
    }else{
        updateObj.Face = Face1;
    }
    if (req.files.Identity) {
      if (
        req.files.Identity[0].mimetype == "image/png" ||
        req.files.Identity[0].mimetype == "image/jpg" ||
        req.files.Identity[0].mimetype == "image/jpeg" ||
        req.files.Identity[0].mimetype == 'application/octet-stream' ||
        req.files.Identity[0].mimetype == "image/gif"
      ) {
        updateObj.Identity = req.files.Identity[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }else{
        updateObj.Identity = Identity1;
    }
    if (req.files.SkillCertificate) {
      if (
        req.files.SkillCertificate[0].mimetype == "image/png" ||
        req.files.SkillCertificate[0].mimetype == "image/jpg" ||
        req.files.SkillCertificate[0].mimetype == "image/jpeg" ||
        req.files.SkillCertificate[0].mimetype == 'application/octet-stream' ||
        req.files.SkillCertificate[0].mimetype == "image/gif"
      ) {
        updateObj.SkillCertificate = req.files.SkillCertificate[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }else{
        updateObj.SkillCertificate = SkillCertificate1;
    }
    if (req.files.signature) {
      if (
        req.files.signature[0].mimetype == "image/png" ||
        req.files.signature[0].mimetype == "image/jpg" ||
        req.files.signature[0].mimetype == "image/jpeg" ||
        req.files.signature[0].mimetype == 'application/octet-stream' ||
        req.files.signature[0].mimetype == "image/gif"
      ) {
        updateObj.signature = req.files.signature[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }else{
        updateObj.signature = signature1;
    }
  try {
    const result = await biography.findByIdAndUpdate(
      id,
      {
        $set: updateObj,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      message: "Post updated successfully",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occured. Please try again",
      error: err.message,
    });
  }
};

exports.get = async (req, res) => {
  let { page, limit, search, type, userid, user, usertype } = req.query;

  if ([1, "", 0, undefined, null].includes(page)) {
    page = 1;
  }
  if (["", undefined, null].includes(search)) {
    search = "";
  }
  if ([1, "", 0, undefined, null].includes(limit)) {
    limit = 10;
  }
  let options = {
    page: page,
    limit: limit,
  };

  let matchObj = {};

  if (type) {
    matchObj.status = Number(type);
  }
  if(userid){
      matchObj.userid = mongoose.Types.ObjectId(userid);
  }
  var sender = false;
  var re = 0;

  try {
    const postAggregate = biography.aggregate([
      {
        $match: matchObj,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    const result = await biography.aggregatePaginate(postAggregate, options);
    if(sender){
        // result.docs.unshift(sender);
    }
    for (let i = 0; i < result.docs.length; i++) {
      const element = result.docs[i];
      element.user = await User.findById(element.userid);
      if (element.Picture) {
        element.Picture = await Helper.getImageUrl(element.Picture);
      }
      
      if (element.Face) {
        element.Face = await Helper.getImageUrl(element.Face);
      }
      if (element.Identity) {
        element.Identity = await Helper.getImageUrl(element.Identity);
      }
      if (element.SkillCertificate) {
        element.SkillCertificate = await Helper.getImageUrl(element.SkillCertificate);
      }
      if (element.signature) {
        element.signature = await Helper.getImageUrl(element.signature);
      }
      if (element.ProofFunds) {
        element.ProofFunds = await Helper.getImageUrl(element.ProofFunds);
      }
    }
    return res.status(200).json({
      message: "not biography has been retrieved ",
      result: result,
      matchObj: re
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};



exports.appGet = async (req, res) => {
  let { search, type } = req.query;
  let matchObj = {};
  if (search) {
    matchObj.title = { $regex: search, $options: "i" };
  }
  if (type) {
    matchObj.type = Number(type);
  }
  matchObj.flag = 1;
  try {
    const result = await biography.aggregate([
      {
        $match: matchObj,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },

    ]);

    // const result = await salespitchModel.aggregatePaginate(postAggregate, options);

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      element.user = await User.findById(element.userid);
      if (element.Picture) {
        element.Picture = await Helper.getImageUrl(element.Picture);
      }
      if (element.Face) {
        element.Face = await Helper.getImageUrl(element.Face);
      }
      if (element.Identity) {
        element.Identity = await Helper.getImageUrl(element.Identity);
      }
      if (element.SkillCertificate) {
        element.SkillCertificate = await Helper.getImageUrl(element.SkillCertificate);
      }
      if (element.signature) {
        element.signature = await Helper.getImageUrl(element.signature);
      }
      if (element.ProofFunds) {
        element.ProofFunds = await Helper.getImageUrl(element.ProofFunds);
      }
    }

    return res.status(200).json({
      message: "Posts has been retrieved ",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.change_status = async (req, res) => {
  const id = req.params.id;

  const Validator = new niv.Validator(req.body, {
    flag: "required|in:1,2,3",
  });

  const matched = await Validator.check();

  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: Validator.errors,
    });
  }
  const status = req.body.status;
  let updateObj = {};
  updateObj.status = status;
  try {
    let message;
    if (status == 1) message = "Your bio has been successfully submitted";
    if (status == 2) message = "Your Bio has been Approved";
    if (status == 3) message = "Your Bio has been Rejected";

    const result = await biography.findByIdAndUpdate(
      id,
      {
        $set: updateObj,
      },
      {
        new: true,
      }
    );

    return res.status(202).json({
      message: message,
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.getDetail = async (req, res) => {
  const id = req.params.id;
  let matchObj = {};
  matchObj._id = mongoose.Types.ObjectId(id);
  matchObj.status = {
    $in: [1, 2, 3, 4],
  };

  try {
    const result = await biography.aggregate([
      {
        $match: matchObj,
      },

    ]);

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      element.user = await User.findById(element.userid);
      if (element.Picture) {
        element.Picture = await Helper.getImageUrl(element.Picture);
      }
      if (element.Face) {
        element.Face = await Helper.getImageUrl(element.Face);
      }
      if (element.Identity) {
        element.Identity = await Helper.getImageUrl(element.Identity);
      }
      if (element.SkillCertificate) {
        element.SkillCertificate = await Helper.getImageUrl(element.SkillCertificate);
      }
      if (element.signature) {
        element.signature = await Helper.getImageUrl(element.signature);
      }
      if (element.ProofFunds) {
        element.ProofFunds = await Helper.getImageUrl(element.ProofFunds);
      }
    }

    return res.status(200).json({
      message: "biography has been retrieved ",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.deleteall = async (req, res) => {
  const id = req.params.id;
//   let matchObj = {};
//   matchObj._id = mongoose.Types.ObjectId(id);

  try {
    const result = await biography.remove({_id:id});

    return res.status(200).json({
      message: "biography has been deleted successfully  ",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
const sendPushNotfication = async (title, description, type) => {
  try {
    let usertokens = await FCMDB.find({});
    let message = {};
    message.title = title;
    message.body = description;
    message.type = type;
    const android_list = new Array();
    const ios_list = new Array();
    usertokens.map((userToken) => {
      if (userToken.type == 1) {
        android_list.push(userToken.token);
      }
      if (userToken.type == 2) {
        ios_list.push(userToken.token);
      }
    });
    android_list.map(async (android_lists) => {
      const registration_id = new Array();
      registration_id.push(android_lists);
      await Helper.call_msg_notification(registration_id, message);
    });
    ios_list.map(async (ios_lists) => {
      const registration_id = new Array();
      registration_id.push(ios_lists);
      await Helper.call_msg_ios_notification(registration_id, message);
    });
  } catch (error) {
    console.log(error);
  }
};
