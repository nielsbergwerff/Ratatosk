$(document).ready(function() {

  //Menu openen en sluiten
  var $menu = $(".menu");
  var $menuButton = $(".menuButton");
  var $menuButton = $(".menuButton");

  $menuButton.click(function() {
    if ($menu.css("visibility") == "hidden") {
      $menu.animate({"right": "0"});
      $menu.css("visibility", "visible");
    } else {
      $.when($menu.animate({"right": "-20vw"})).then(function() {
      $menu.css("visibility", "hidden")});
    }

    if ($menuButton.css("right") == "20vw") {
      $menuButton.animate({"right": "40vw"});
    } else {
      $menuButton.animate({"right": "20vw"});
    }
  });

  $(document).mouseup(function(e) {
    if(!$menu.is(e.target) && $menu.has(e.target).length === 0) {
      $menuButton.animate({"right": "20vw"});
      $.when($menu.animate({"right": "-20vw"})).then(function() {
      $menu.css("visibility", "hidden")});
    }
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
