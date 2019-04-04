$(function () {

  var socket = io('localhost:80');

  function setGroupButtonListener(){
    $('.setGroupButton').click(function(e){
      socket.emit('set group',$(e.target).parent().attr('id'));
    });
  }

  $('#sendMessage').click(function(e){
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
  });

  $('#createNewGroup').click(function(e){
    socket.emit('add group',$('#newGroupName').val());
  });

  $('#addMemberButton').click(function(e){
    socket.emit('add member',$('#addMember').val(),editGroup,0)
  });

  $('#deleteGroup').click(function(e){
    socket.emit('delete group',editGroup)
  })

  socket.on('set group list',groupList=>{
    socket.emit('set group',groupList[0])
    $('#groupColumn').text('')
    for(var group of groupList)
      $('#groupColumn').append($('<div id="'+group.ID+'">').html('<input type="button" class="groupSettings"/><p>'+group.Naam+'</p><img src="images/selectButton.png" class="setGroupButton"></img>'))
    setGroupButtonListener()
    setGroupSettingsListener()
  })

  socket.on('set member list',memberList=>{
    $('#memberColumn').text('')
    for(var member of memberList)$('#memberColumn').append($('<div>').text(member))
  })

  socket.on('set group',group=>{
    $('#chat').text('')
    socket.emit('get messages')
  })

  socket.on('get messages',messages=>{
    for (var message of messages)
      $('#chat').append($('<p>').text(message.AuteursID+": "+message.Bericht))
  })

  socket.on('chat message',msg=>{
    $('#chat').append($('<p>').text(msg))
  })

  socket.on('add member',user=>{
    $('#memberColumn').append($('<div>').text(user))
  })

  socket.on('delete group',group=>{
    $('#'+group).remove()
    hideGroupSettings()
  })

})
