$(document).ready(function() {

  //Menu openen en sluiten
  var $menu = $(".menu");
  var $menuButton = $(".menuButton");
  var $menuButtonHeader = $("#menuButtonHeader");
  $menuButton.click(function() {
    $menu.toggle("slide", {direction: 'right'});
    if ($menuButtonHeader.css("right") == "0px") {
      $menuButtonHeader.animate({"right":"20%"});
    } else {
      $menuButtonHeader.animate({"right":"0"});
    }
  });
  $menu.mouseleave(function() {
    $menu.hide("slide", {direction: 'right'});
    $menuButtonHeader.animate({"right":"0"});
  });

  //Groepmenu openen en sluiten
  var $newChat = $(".newChat");
  var $newChatButton = $(".newChatButton");
  var $newChatImage = $("#newChatImage");

  $newChatButton.click(function() {
    $newChat.fadeToggle("fast");
    if ($newChatImage.attr("src") == "images/plusButton.png") {
      $newChatImage.attr("src", "images/newChatClose.png");
    } else {
      $newChatImage.attr("src", "images/plusButton.png");
    }
  });
});
