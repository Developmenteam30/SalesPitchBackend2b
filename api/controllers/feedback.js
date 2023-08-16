const User = require("../models/user");
const Notification = require("../models/notification");
const Post = require("../models/post");
const salespitchModel = require("../models/salespitch");
const salespitchsaveModel = require("../models/salespitchsave");
const postsave = require("../models/postsave");
const introview = require("../models/introview");
const Feedback = require("../models/feedback");
const Chat = require("../models/chat");
exports.get_chats = async (req, res) => {
  try {
    // const sender = await User.findById(req.body.senderid);
    var results = await Chat.find({$or: [{sendorid: req.body.senderid, recieverid: req.body.recieverid}, {sendorid: req.body.recieverid, recieverid: req.body.senderid}]});
    return res.status(202).json({
      message: "Chat get successfully",
      result: results,
      data: 'ress'
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
  try {
    await salespitchsaveModel.deleteMany({});
    return res.status(201).send({
      message: "Deleted successfully",
    });
  } catch (err) {
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

exports.save_salespitch = async (req, res) => {
  try {
    const sender = await User.findById(req.body.senderid);
    const sender_name = sender.username;
    var usertype = 'Investor';
    if(sender.type == 3){
        usertype = 'Investor';
    }else if(sender.type == 4){
        usertype = 'Facilitator';
    }
    if (req.body.pitchid) {
      title = usertype+" is Interested in your Pitch!";
    } else {
      title = usertype+" is Interested in your Pitch!";
    }
    var data = {
      senderid: req.body.senderid,
      pitchid: req.body.pitchid,
    };
    const new_salespitchsave = new salespitchsaveModel(data);
    const salespitchsave_res = await new_salespitchsave.save();
    let message = "Notification and Liked to pitch successfully";
    const new_notification = new Notification({
      sender: req.body.senderid,
      receiver: req.body.receiverid,
      pitchid: req.body.pitchid,
      title: title,
      type: 5,
      unread_flag: 0,
      text: req.body?.description
        ? req.body.description
        : "You get notification for sales pitch",
    });
    const result = await new_notification.save();
    return res.status(202).json({
      message: message,
      result: message,
      feedback: salespitchsave_res,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.get_saved = async (req, res) => {
  try {
    // const sender = await User.findById(req.body.senderid);
    const results = await salespitchsaveModel.distinct("pitchid", {senderid: req.body.senderid});
    // var ress = [];
    // results.forEach(e=>{
    //     if(e != "6448e9494ff8f4cb69599465"){
    //         ress.push(e);
    //     }
    // })
    var result = await salespitchModel.find({_id : { $in : results}});
    return res.status(202).json({
      message: "All saved pitches get successfully",
      result: result,
      data: 'ress'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};


exports.get_owner_pitches = async (req, res) => {
  try {
    const result = await salespitchModel.find({userid: req.body.senderid});
    return res.status(202).json({
      message: "All saved pitches get successfully",
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

exports.deletesavedpitch = async (req, res) => {
  const id = req.params.id;
  const senderid = req.params.senderid;
  try {
    const result = await salespitchsaveModel.remove({pitchid:id, senderid: senderid});

    return res.status(200).json({
      message: "Salespitch has been removed successfully  ",
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

exports.save_post = async (req, res) => {
  try {
    //fatch sender name
    const sender = await User.findById(req.body.userid);
    const sender_name = sender.username;

    if (req.body.pitchid) {
      title = sender_name + " has liked your post ";
    } else {
      title = "You got feedback from " + sender_name;
    }

    const new_salespitchsave = new postsave({
      userid: req.body.userid,
      postid: req.body.postid,
      types: req.body.types,
    });
    const salespitchsave_res = await new_salespitchsave.save();

    let message = "Notification and Liked to post successfully";

    return res.status(202).json({
      message: message,
      result: message,
      feedback: salespitchsave_res,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.get_saved_post = async (req, res) => {
  try {
    // const sender = await User.findById(req.body.senderid);
    const results = await postsave.distinct("postid", {userid: req.body.senderid, types: req.body.types});
    var result = await Post.find({_id : { $in : results}});
    return res.status(202).json({
      message: "All saved post get successfully",
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

exports.deletesavedpost = async (req, res) => {
  const id = req.params.id;
  const senderid = req.params.senderid;
  try {
    const result = await postsave.remove({postid:id, userid: senderid});
    return res.status(200).json({
      message: "Post has been removed successfully  ",
      result: result,
      id: id
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};


exports.add_feedback = async (req, res) => {
  try {
    //fatch sender name
    const sender = await User.findById(req.body.senderid);
    const sender_name = sender.username;
    var usertype = 'Investor';
    if(sender.type == 3){
        usertype = 'Investor';
    }else if(sender.type == 4){
        usertype = 'Facilitator';
    }
    if(sender.log_type && sender.log_type == 5){
        usertype = 'Admin';
    }

    //fatch receiver name
    // const receiver =await User.findById(req.body.receiver)
    // const receiver_name = receiver.username

    //fatch file if user give feedback on post
    var title = "";
    if (req.body.postid) {
      // const post = await Post.findById(req.body.postid)
      // var post_file_name = post.file
      title = usertype + " gave you a feedback ";
    } else {
      title = "You got feedback from " + usertype;
    }

    const new_feedback = new Feedback({
      sender: req.body.senderid,
      receiver: req.body.receiverid,
      title: title,
      postid: req.body.postid,
      star: req.body.star,
      videoStar:req.body.videoStar,
      description: req.body?.description
        ? req.body.description
        : "You get feedback",
    });
    const feedback_res = await new_feedback.save();

    let message = "Notification and Feedback Add successfully";
    const new_notification = new Notification({
      sender: req.body.senderid,
      receiver: req.body.receiverid,
      postid: req.body.postid,
      title: title,
      star: req.body.star,
      videoStar:req.body.videoStar,
      type: 6,
      text: req.body?.description
        ? req.body.description
        : "You get notification for feedback",
    });
    const result = await new_notification.save();

    return res.status(202).json({
      message: message,
      result: result,
      feedback: feedback_res,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
exports.get_feedback = async (req, res) => {
  try {
    const result = await Feedback.find();
    return res.status(202).json({
      message: "All feedback get successfully",
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
exports.save_introview = async (req, res) => {
  try {
    const sender = await User.findById(req.body.senderid);
    var data = {
      senderid: req.body.senderid,
      view: 1,
    };
    const new_introview = new introview(data);
    const salespitchsave_res = await new_introview.save();
    let message = "Viewed";
    return res.status(202).json({
      message: message,
      result: message,
      feedback: salespitchsave_res,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.get_savedintro = async (req, res) => {
  try {
    // const sender = await User.findById(req.body.senderid);
    const result = await introview.find({senderid: req.body.senderid});
    return res.status(202).json({
      message: "All saved pitches get successfully",
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
exports.getuserdata = async (req, res) => {
  try {
    const sender = await User.findById(req.params.id);

    return res.status(202).json({
      message: 'fetched successfully',
      result: sender,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

