$.fn.extend({
  animateStep: function(options) {
    return this.each(function() {
      var elementOptions = $.extend({}, options, {
        step: options.step.bind($(this))
      });
      $({
        x: options.from
      }).animate({
        x: options.to
      }, elementOptions);
    });
  },
  rotate: function(value) {
    return this.css("transform", "rotate(" + value + "deg)");
  }
});
//Mobiel
if ($(window).width() < 901) {

  $(document).ready(function() {
    //contact kolom openen en sluiten
    var contactColumn = $(".contactColumn");
    var newChat = $(".newChat");
    var toggleNewChat = true;
    var newChatButton = $(".newChatButton");
    var contactClose = $(".contactClose");

    $(document).mouseup(function(e) {
      if (!newChat.is(e.target) && newChat.has(e.target).length === 0 && !contactColumn.is(e.target) && contactColumn.has(e.target).length === 0 && !toggleNewChat) {
        hideContactColumn();
        hideNewChat();
      }
    })

    function hideNewChat() {
      $.when(newChat.animate({"left": "-=70vw"})).then(function() {
        newChat.css("visibility", "hidden")
      });
      toggleNewChat = true;
    }

    function hideContactColumn() {
      $.when(contactColumn.animate({"left": "-=70vw"})).then(function() {
        contactColumn.css("visibility", "hidden")
      });
    }

    newChatButton.click(function() {
        contactColumn.animate({"left": "+=70vw"});
        newChat.animate({"left": "+=70vw"});
        contactColumn.css("visibility", "visible");
        newChat.css("visibility", "visible");
        toggleNewChat = false;
    });

    contactClose.click(function() {
      hideContactColumn();
      hideNewChat();
    });
  });
}
//Desktop
else {
  $(document).ready(function() {

    //Menu openen en sluiten
    var menu = $(".menu");
    var menuButton = $(".menuButton");
    var toggleMenu = true;

    function hideMenu() {
      $.when(menu.animate({
        "right": "-=20vw"
      })).then(function() {
        menu.css("visibility", "hidden")
      });
      menuButton.animate({
        "right": "-=0.5vw"
      });
      toggleMenu = true;
      $(document).off("mouseup");
    }

    function mouseUp(object, xFunction, object1) {
      $(document).mouseup(function(e) {
        if (!object.is(e.target) && object.has(e.target).length === 0 && !object1.is(e.target) && object1.has(e.target.length === 0)) {
          xFunction();
        }
      });
    }

    menuButton.click(function() {
      if (toggleMenu) {
        menu.animate({
          "right": "+=20vw"
        });
        menuButton.animate({
          "right": "+=0.5vw"
        });
        menu.css("visibility", "visible");
        toggleMenu = false;
        mouseUp(menu, hideMenu, menuButton);
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
      if (toggleNewChat) {
        newChatImage.animateStep({
          from: 45,
          to: 0,
          step: $.fn.rotate
        });
        toggleNewChat = false;
      } else {
        newChatImage.animateStep({
          from: 0,
          to: 45,
          step: $.fn.rotate
        });
        toggleNewChat = true;
      }
    });

    var copyrightButton = $(".copyrightButton");
    var copyright = $(".copyright");
    var copyrightToggle = true;

    // Generic function to set blur radius of $ele
    var setBlur = function(ele, radius) {
        $(ele).css({
          "-webkit-filter": "blur(" + radius + "px)",
          "filter": "blur(" + radius + "px)"
        });
      },

      // Generic function to tween blur radius
      tweenBlur = function(ele, startRadius, endRadius) {
        $({
          blurRadius: startRadius
        }).animate({
          blurRadius: endRadius
        }, {
          duration: 500,
          easing: 'swing', // or "linear"
          // use jQuery UI or Easing plugin for more options
          step: function() {
            setBlur(ele, this.blurRadius);
          },
          complete: function() {
            // Final callback to set the target blur radius
            // jQuery might not reach the end value
            setBlur(ele, endRadius);
          }
        });
      };

    function hideCopyright() {
      tweenBlur('.container > *:not(.copyright):not(.menu)', 3, 0);
      copyright.slideToggle();
      copyrightButton.animate({
        "bottom": "-=10vh"
      });
      copyrightToggle = true;
      $(document).off("mouseup");
    }

    copyrightButton.click(function() {

      if (copyrightToggle) {
        tweenBlur('.container > *:not(.copyright):not(.menu)', 0, 3);
        copyright.slideToggle();
        copyrightButton.animate({
          "bottom": "+=10vh"
        });
        copyrightToggle = false;
        mouseUp(copyright, hideCopyright, copyrightButton);
      } else {
        hideCopyright();
      }

    });
  });
}
