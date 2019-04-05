$(function () {

  var socket = io('http://localhost:80');

  function setGroupButtonListener(){
    $('.setGroupButton').click(function(e){
      socket.emit('set group',$(e.target).parent().attr('id'));
    });
  }

  $('#sendMessage').click(function(e){
    socket.emit('chat message', $('#messageBox').val());
    $('#messageBox').val('');
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
    $('#groups').text('')
    for(var group of groupList)
      $('#groups').append($('<div id="'+group.ID+'">').html('<button class="groupSettings"><img src="images/gearIcon.png"/></button><p>'+group.Naam+'</p><button><img src="images/selectButton.png" class="setGroupButton"></img></button>'))
    setGroupButtonListener()
    setGroupSettingsListener()
  })

  socket.on('set member list',memberList=>{
    $('#members').text('')
    for(var member of memberList)$('#members').append($('<p>').text(member))
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
    $('#members').append($('<p>').text(user))
  })

  socket.on('delete group',group=>{
    $('#'+group).remove()
    hideGroupSettings()
  })

})
