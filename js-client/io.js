$(function () {

  var socket = io('http://localhost:80');

  function setGroupButtonListener(){
    $('.setGroupButton').click(function(e){
      socket.emit('set group',$(e.target).attr('id'));
    });
  }

  $('#sendMessage').click(function(e){
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  });

  //button to be added
  $('#createNewGroup').click(function(e){
    socket.emit('new group',$('#newGroupName').val());
  });

  socket.on('set group',(group)=>{
    socket.emit('get messages',group,0);
  });

  socket.on('chat message',(msg)=>{
    $('#chatColumn').append($('<p>').text(msg));
  });

  socket.on('get group list',(groupList)=>{
    socket.emit('set group',groupList[0]);
    for(var group of groupList)
      $('#groupColumn').append($('<div>').html('<p>'+group.Naam+'</p><img src="images/selectButton.png" id="'+group.ID+'" class="setGroupButton"></img>'));
    setGroupButtonListener();
  });

  socket.on('get messages',(messages)=>{
    for (var message of messages)
      $('#chatColumn').append($('<p>').text(message.AuteursID+": "+message.Bericht));
  });

});
