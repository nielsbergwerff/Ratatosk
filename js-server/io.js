module.exports = function(io,db){

function getGroupList(socket){
  db.getGroupList(socket.request.session.user,list=>{
    socket.emit('set group list',list)
  })
}

io.on('connection',socket=>{

  socket.join(socket.request.session.user)
  getGroupList(socket)

  socket.on('set group',group=>{
    db.getGroup(group,result=>{
      if(result!=null) group = result
      if(socket.request.session.group)socket.leave(socket.request.session.group.ID)
      socket.request.session.group = group
      socket.emit('set group',group)
      socket.join('g'+group.ID)
      db.getMemberList(socket.request.session.user,group.ID,result=>{
        socket.emit('set member list',result)
      })
    })
  })

  socket.on('get messages',()=>{
    if(socket.request.session.group)db.getGroupMessages(socket.request.session.group.ID,messages=>{
      socket.emit('get messages', messages)
    })
  })

  socket.on('add group',name=>{
    db.addGroup(socket.request.session.user,name,group=>{
      socket.emit('add group',group)
    })
  })

  socket.on('chat message',msg=>{
    db.saveMessage(msg,socket.request.session.group.ID,socket.request.session.user,(err)=>{
      if(!err)io.to('g'+socket.request.session.group.ID).emit('chat message',socket.request.session.user+": "+msg)
    })
  })

  socket.on('add member', (user,group,isAdmin)=>{
    db.addGroupMember(socket.request.session.user,user,group,isAdmin)
    socket.emit('add member',user)
    console.log(socket.rooms)
    db.getGroup(group,result=>{io.to(user).emit('add group',result)})
  })

  socket.on('delete group', group=>{
    db.removeGroup(socket.request.session.user,group)
    io.emit('delete group',group)
  })

  socket.on('remove member', member=>{
    db.removeMember(socket.request.session.user,socket.request.session.group.ID,member)
    socket.emit('remove member')
  })
})
}
