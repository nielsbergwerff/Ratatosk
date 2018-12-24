$(document).ready(function() {

  //Menu openen en sluiten
  var $menu = $(".menu");
  var $menuButton = $(".menuButton");
  $menuButton.click(function() {
    $menu.toggle("slide", {
      direction: 'right'
    });
  });

  //Groepmenu openen en sluiten
  var $newChat = $(".newChat");
  var $newChatButton = $(".newChatButton");
  var $newChatImage = $("#newChatImage");

  $newChatButton.click(function() {
    $newChat.fadeToggle("fast");
    if ($newChatImage.attr("src") == "images/plusButton.png") {
      $newChatImage.attr("src", "images/menuClose.png");
    } else {
      $newChatImage.attr("src", "images/plusButton.png");
    }
  });
});
