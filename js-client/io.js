$(function () {

  var socket = io();

  socket.emit('set group');

  $('#sendMessage').click(function(e){
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  });

  $('[id^=group]').click(function(e){
    console.log(e.target.attr('id').substring(0,5));
    socket.emit('set group',e.target.attr('id').substring(0,5));
  });

  socket.on('chat message', function(msg){
    $('#chatColumn').append($('<p>').text(msg));
  });

});
