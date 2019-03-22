$(function () {

  var socket = io('http://localhost:80');

  $('#sendMessage').click(function(e){
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
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

  socket.on('set group list',(groupList)=>{
    console.log(groupList);
  });
});
