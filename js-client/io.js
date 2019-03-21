$(function () {

  var socket = io('http://localhost:80');

  $('#sendMessage').click(function(e){
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  });

  //button to be added
  $('#createNewGroup').click(function(e){
    socket.emit('new group',$('#newGroupName').val());
  });

  $('[id^=group]').click(function(e){
    socket.emit('set group',$(e.target).attr('id').substring(5));
  });

  socket.on('set group',(groupID)=>{
    console.log(groupID);
  });

  socket.on('chat message',(msg)=>{
    $('#chatColumn').append($('<p>').text(msg));
  });

  socket.on('get group list',(groupList)=>{
    socket.emit('set group',groupList[0]);
    console.log(groupList);
  });

  socket.on('get messages',(messages)=>{
    console.log(messages);
  });

});
