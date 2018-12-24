$.fn.extend({
    animateStep: function(options) {
        return this.each(function() {
            var elementOptions = $.extend({}, options, {step: options.step.bind($(this))});
            $({x: options.from}).animate({x: options.to}, elementOptions);
        });
    },
    rotate: function(value) {
        return this.css("transform", "rotate(" + value + "deg)");
    }
});

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
    if ($newChatImage.css("transform") == "matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)") {
      $newChatImage.animateStep({from: 45, to: 0, step: $.fn.rotate});
    } else {
      $newChatImage.animateStep({from: 0, to: 45, step: $.fn.rotate});
    }
  });
});
