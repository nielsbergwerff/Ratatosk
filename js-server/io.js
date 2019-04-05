module.exports = function(io,db){

function getGroupList(socket){
  db.getGroupList(socket.request.session.user,list=>{
    io.emit('set group list',list)
  })
}

io.on('connection',(socket)=>{

  getGroupList(socket)

  socket.on('set group',group=>{
    db.getGroup(group,result=>{
      if(result!=null) group = result
      socket.request.session.group = group
      io.emit('set group',group)
      db.getMemberList(socket.request.session.user,group.ID,result=>{
        io.emit('set member list',result)
      })
    })
  })

  socket.on('get messages',()=>{
    if(socket.request.session.group)db.getGroupMessages(socket.request.session.group.ID,messages=>{
      io.emit('get messages', messages)
    })
  })

  socket.on('add group',name=>{
    db.addGroup(socket.request.session.user,name)
    getGroupList(socket)
  })

  socket.on('chat message',msg=>{
    db.saveMessage(msg,socket.request.session.group.ID,socket.request.session.user,(err)=>{
      if(!err)io.emit('chat message',socket.request.session.user+": "+msg)
    })
  })

  socket.on('add member', (user,group,isAdmin)=>{
    db.addGroupMember(socket.request.session.user,user,group,isAdmin)
    socket.emit('add member',user)
  })

  socket.on('delete group', group=>{
    db.removeGroup(socket.request.session.user,group)
    socket.emit('delete group',group)
  })

  socket.on('remove member', member=>{
    db.removeMember(socket.request.session.user,socket.request.session.group.ID,member)
    socket.emit('remove member')
  })
})
}
