const socketio = require('socket.io');
const User = require("./models/user");
const Chat = require("./models/chat");
const Messages = require("./models/messages");
const Support = require("./models/support");
const Supportmessages = require("./models/supportmessages");
const Notification = require("./models/notification");
var mongoose = require('mongoose');

async function getchatlist(sendorid){
    try {
        var results = await Chat.find({$or: [{sendorid: sendorid}, {recieverid: sendorid}]}).sort( { updatedAt: -1 } );
        var re = [];
        for (let i = 0; i < results.length; i++) {
            var e = results[i];
            if(e.recieverid){
                var q = await Messages.findOne({chatid: e._id}).sort( { _id: -1 } );
                var qc = await Messages.find({chatid: e._id, sendorid: {$ne : sendorid}, read: false}).count();
                // var qc = await Messages.find({chatid: e._id, sendorid: sendorid, read: false}).count();
                if(e.sendorid == sendorid){
                    var user = await User.findById(e.recieverid);
                    var merged = {chat: e, user: user, message: q, unread: qc};
                }else{
                    var user = await User.findById(e.sendorid);
                    var merged = {chat: e, user: user, message: q, unread: qc};
                }
                re.push(merged);
            }
        }
        return re;
    }catch(e){
        return false;
        console.log(e);
    }
}

async function getadminchatlist(sendorid){
    try {
        if(sendorid != 'admin'){
            var results = await Support.find({$or: [{sendorid: sendorid}, {recieverid: sendorid}]}).sort( { updatedAt: -1 } );
        }else{
            var results = await Support.find({}).sort( { updatedAt: -1 } );
        }
        var re = [];
        for (let i = 0; i < results.length; i++) {
            var e = results[i];
            if(e.recieverid){
                var q = await Supportmessages.findOne({chatid: e._id}).sort( { _id: -1 } );
                var qc = await Supportmessages.find({chatid: e._id, sendorid: {$ne : sendorid}, read: false}).count();
                // var qc = await Messages.find({chatid: e._id, sendorid: sendorid, read: false}).count();
                if(e.sendorid == sendorid){
                    var user = await User.findById(e.sendorid);
                    var merged = {chat: e, user: user, message: q, unread: qc};
                }else{
                    var user = await User.findById(e.sendorid);
                    var merged = {chat: e, user: user, message: q, unread: qc};
                }
                re.push(merged);
            }
        }
        return re;
    }catch(e){
        return false;
        console.log(e);
    }
}
module.exports = (http) => {
    const io = socketio(http);
    io.on("connection", (socket) => {
      console.log('connected');
      socket.emit('connected', {
        message: `has joined the chat room`,
      });
    //   socket.on('updatetime', async (data) => {
    //     await Chat.updateMany({}, {$set: {numbers: Math.floor(Date.now() / 1000),time: Math.floor(Date.now() / 1000)}});
    //     await Messages.updateMany({}, {$set: {time: Math.floor(Date.now() / 1000)}});
    //     await Supportmessages.updateMany({}, {$set: {time: Math.floor(Date.now() / 1000)}});
    //   });
      socket.on('createchat', async (data) => {
        const { sendorid, recieverid } = data;
        const results = await Chat.find({$or: [{sendorid: sendorid, recieverid: recieverid}, {sendorid: recieverid, recieverid: sendorid}]});
        var re = 0;
        results.forEach(async e=>{
            re++;
        })
        if(re == 0){
            const new_feedback = new Chat({
              sendorid: sendorid,
              recieverid: recieverid,
            });
            const feedback_res = await new_feedback.save();
            socket.emit('receive_user', {
              messages: feedback_res,
            });
        }else{
            socket.emit('receive_user', {
              messages: results[0],
            });
        }
        // const sender = await User.findById(senderid);
      });
      socket.on('create_admin_chat', async (data) => {
        var user = await User.find({});
        for (let i = 0; i < user.length; i++) {
            var e = user[i];
            var results = await Support.find({sendorid: e._id});
            var re = 0;
            results.forEach(async e=>{
                re++;
            })
            if(re == 0){
                const new_feedback = new Support({
                  sendorid: e._id,
                  recieverid: 'admin',
                });
                const feedback_res = await new_feedback.save();
                socket.emit('receive_user_admin', {
                  message: feedback_res,
                });
            }else{
                socket.emit('receive_user_admin', {
                  messages: results[0],
                });
            }

        }
      })
      socket.on('join_admin', async (data) => {
        const { sendorid } = data;
        var dd = await getadminchatlist(sendorid);
        if(dd){
            socket.join(sendorid);
            socket.emit('receive_users_admin', {
              messages: dd,
              roomid : sendorid
            });
        }
      });
    //   socket.on("upload", (file, callback) => {
    //     // console.log(file); // <Buffer 25 50 44 ...>
    //     writeFile("/uploads/chat", file, (err) => {
    //       callback({ message: err ? "failure" : "success" });
    //     });
    //   });
      socket.on('sendmessage_admin', async (data) => {
        const { sendorid, message, chatid, image, voice, video, recieverid } = data;
        const new_feedback = new Supportmessages({
          sendorid: sendorid,
          message: message,
          chatid: chatid,
          image: image, 
          voice: voice,
          video: video,
          read: false,
          time: Math.floor(Date.now() / 1000)
        });
        const feedback_res = await new_feedback.save();
        socket.to(chatid).emit('receive_messages_admin', {
          message: [feedback_res],
          roomid : chatid
        });
        socket.emit('receive_messages_admin', {
          message: [feedback_res],
          roomid : chatid
        });
        try{
            await Support.update({_id: chatid}, {$set: {numbers: Math.random()}});
            if(sendorid != 'admin'){
                var objectIds = await User.findById(sendorid);
                var objectId = await User.findById('64c8d7ae44bb8a150be9d290');
                let messagep = "Message pending Reply";
                const new_notification = new Notification({
                  sender: objectIds._id,
                  receiver: objectId._id,
                  title: messagep,
                  type: 11,
                  unread_flag: 0,
                  text: messagep,
                });
                const resultq = await new_notification.save();
                console.log(resultq);
            }
        }catch(e){
            console.error('error', e);
        }
        if(recieverid){
            console.log(recieverid);
            var dd = await getadminchatlist(recieverid);
            if(dd){
                socket.to(recieverid).emit('receive_users_admin', {
                  messages: dd,
                  roomid : recieverid
                });
            }
        }else{
            var q = await Support.findOne({_id: chatid});
            if(q.sendorid == sendorid){
                var srecieverid = q.recieverid;
            }else{
                var srecieverid = q.sendorid;
            }
            var ss = srecieverid.toString();
            var dd = await getadminchatlist(ss);
            if(dd){
                // console.log(dd);
                socket.to(ss).emit('receive_users_admin', {
                  messages: dd,
                  roomid : ss
                });
                // console.log(ss);
            }
        }

      });
      socket.on('join_chat_admin', async (data) => {
        const { userid, chatid } = data; // Data sent from client when join_room event emitted
        socket.join(chatid); // Join the user to a socket room
        let __createdtime__ = Date.now(); // Current timestamp

        var q = await Supportmessages.find({chatid: chatid}); //.sort( { _id: -1 } );
        socket.emit('receive_messages_admin', {
          message: q,
          roomid : chatid
        });
        var qs = await Supportmessages.updateMany({chatid: chatid, sendorid: {$ne : userid}}, {$set: {read: true}});
        var dd = await getadminchatlist(userid);
        if(dd){
            socket.emit('receive_users_admin', {
              messages: dd,
              roomid : userid
            });
        }
        console.log(socket.rooms);
      });
      socket.on('join_user', async (data) => {
        const { sendorid } = data;
        var dd = await getchatlist(sendorid);
        if(dd){
            socket.join(sendorid);
            socket.emit('receive_users', {
              messages: dd,
              roomid : sendorid,
              update: 'new'
            });
        }
      });
      socket.on('sendmessage', async (data) => {
        const { sendorid, message, chatid, image, voice, video, recieverid } = data;
        const new_feedback = new Messages({
          sendorid: sendorid,
          message: message,
          chatid: chatid,
          image: image, 
          voice: voice,
          video: video,
          read: false,
          time: Math.floor(Date.now() / 1000)
        });
        const feedback_res = await new_feedback.save();
        socket.to(chatid).emit('receive_messages', {
          message: [feedback_res],
          roomid : chatid
        });
        socket.emit('receive_messages', {
          message: [feedback_res],
          roomid : chatid
        });
        await Chat.update({_id: chatid}, {$set: {numbers: Math.floor(Date.now() / 1000),time: Math.floor(Date.now() / 1000)}});
        if(recieverid){
            var dd = await getchatlist(recieverid);
            if(dd){
            console.log('dd', recieverid);
                socket.to(recieverid).emit('receive_users', {
                  messages: dd,
                  roomid : recieverid,
                  update: 'update'
                });
            }
            var dd = await getchatlist(sendorid);
            if(dd){
            console.log('dds', sendorid);
                socket.emit('receive_users', {
                  messages: dd,
                  roomid : sendorid,
                  update: 'update'
                });
            }
        }else{
            var q = await Chat.findOne({_id: chatid});
            if(q.sendorid == sendorid){
                var srecieverid = q.recieverid;
            }else{
                var srecieverid = q.sendorid;
            }
            var ss = srecieverid.toString();
            var dd = await getchatlist(ss);
            if(dd){
                // console.log(dd);
                socket.emit('receive_users', {
                  messages: dd,
                  roomid : ss,
                  update: 'update'
                });
                // console.log(ss);
            }
        }

      });
      socket.on('join_chat', async (data) => {
        const { userid, chatid } = data; // Data sent from client when join_room event emitted
        socket.join(chatid); // Join the user to a socket room
        let __createdtime__ = Date.now(); // Current timestamp

        var q = await Messages.find({chatid: chatid}); //.sort( { _id: -1 } );
        socket.emit('receive_messages', {
          message: q,
          roomid : chatid
        });
        var qs = await Messages.updateMany({chatid: chatid, sendorid: {$ne : userid}}, {$set: {read: true}});
        var dd = await getchatlist(userid);
        if(dd){
            socket.emit('receive_users', {
              messages: dd,
              roomid : userid,
              update: 'new'
            });
        }
        console.log(socket.rooms);
      });
      socket.on('delete_chat', async (data) => {
        const { userid, chatid } = data; // Data sent from client when join_room event emitted
        await Chat.deleteMany({_id: chatid});
        await Messages.deleteMany({chatid: chatid});
        var dd = await getchatlist(userid);
        if(dd){
            socket.emit('receive_users', {
              messages: dd,
              roomid : userid,
              update: 'new'
            });
        }
        console.log(socket.rooms);
      });
    });

}
