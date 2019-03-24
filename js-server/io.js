module.exports = function(io,db){
io.on('connection',(socket)=>{

  db.getGroupList(socket.request.session.user,list=>{
    io.emit('get group list',list);
  });

  socket.on('get messages',(group,offset)=>{
    db.getGroupMessages(group.ID,offset,output=>{
      io.emit('get messages', output);
    });
  });

  socket.on('set group',(group)=>{
    socket.request.session.group = group;
    io.emit('set group',group);
  });

  socket.on('chat message',(msg)=>{
    db.saveMessage(msg,socket.request.session.group.ID,socket.request.session.user,(err)=>{
      if(!err)io.emit('chat message',socket.request.session.user+": "+msg);
    });
  });

  socket.on('add group',(data)=>{});
});
}
