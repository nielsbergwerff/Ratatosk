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
  var menu = $(".menu");
  var menuButton = $(".menuButton");
  var toggleMenu = true;

  function hideMenu() {
    $.when(menu.animate({"right": "-=20vw"})).then(function() {
      menu.css("visibility", "hidden")});
    menuButton.animate({"right": "-=0.5vw"});
    toggleMenu = true;
    $(document).off("mouseup");
  }

  function mouseUp(object,xFunction) {
    $(document).mouseup(function(e) {
      if(!object.is(e.target) && object.has(e.target).length === 0) {
        xFunction();
      }
    });
  }

  menuButton.click(function() {
    if (toggleMenu) {
      menu.animate({"right": "+=20vw"});
      menuButton.animate({"right": "+=0.5vw"});
      menu.css("visibility", "visible");
      toggleMenu = false;
      mouseUp(menu,hideMenu);
    } else {
      hideMenu();
    }
  });

  //Groepmenu openen en sluiten
  var newChat = $(".newChat");
  var newChatButton = $(".newChatButton");
  var newChatImage = $("#newChatImage");
  var toggleNewChat = false;

  newChatButton.click(function() {

    newChat.fadeToggle("fast");
    if(toggleNewChat){
      newChatImage.animateStep({from: 45, to: 0, step: $.fn.rotate});
      toggleNewChat = false;
    } else {
      newChatImage.animateStep({from: 0, to: 45, step: $.fn.rotate});
      toggleNewChat = true;
    }
  });

  var button = $(".footerButton");
  var footer = $(".footer");
  var footerToggle = true;

  function hideFooter() {
    footer.slideToggle();
    button.animate({"bottom": "-=10vh"});
    footerToggle = true;
    $(document).off("mouseup");
  }

  button.click(function() {

    if(footerToggle) {
      footer.slideToggle();
      button.animate({"bottom": "+=10vh"});
      footerToggle = false;
      mouseUp(footer,hideFooter);
    } else {
      hideFooter();
    }

  });
});
