var editGroup;

//function voor het laten verschijnen van group settings
function setGroupSettingsListener(){
  $('.groupSettings').click(function(e){
    $('#editGroup').css('display','block').css('left',$(e.target).position().left).css('top',$(e.target).position().top);
    $('#editGroup').css('left', '+=20vw');
    editGroup = $(e.target).parent().parent().attr('id');
  })
}

function hideGroupSettings(){
  $('#editGroup').css('display','none')
}

//function om texten te verzenden door middel van 'enter'
function textEnter(textElement,buttonElement){
  $(textElement).keypress(e=>{if(e.keyCode==13)$(buttonElement).trigger('click')});
}

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
    //groepen kolom openen en sluiten
    var groupColumn = $("#groupColumn");
    var newGroup = $("#newGroup");
    var toggleNewGroup = true;
    var newGroupButton = $("#newGroupButton");
    var groupColumnClose = $("#groupColumnClose");

    $(document).mouseup(function(e) {
      if (!newGroup.is(e.target) && newGroup.has(e.target).length === 0 && !groupColumn.is(e.target) && groupColumn.has(e.target).length === 0 && !toggleNewGroup) {
        hideGroupColumn();
        hideNewGroup();
      }
    })

    function hideNewGroup() {
      $.when(newGroup.animate({"left": "-=70vw"})).then(function() {
        newGroup.css("visibility", "hidden")
      });
      toggleNewGroup = true;
    }

    function hideGroupColumn() {
      $.when(groupColumn.animate({"left": "-=70vw"})).then(function() {
        groupColumn.css("visibility", "hidden")
      });
    }

    newGroupButton.click(function() {
        groupColumn.animate({"left": "+=70vw"});
        newGroup.animate({"left": "+=70vw"});
        groupColumn.css("visibility", "visible");
        newGroup.css("visibility", "visible");
        toggleNewGroup = false;
    });

    groupColumnClose.click(function() {
      hideGroupColumn();
      hideNewGroup();
    });

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

  });
}
//Desktop
else {
  $(document).ready(function() {

    textEnter('#messageBox','#sendMessage')
    textEnter('#newGroupName','#createNewGroup')
    textEnter('#addMember','#addMemberButton')

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

    //Groepopties sluiten als weggeklikt wordt
    var groupSettings = $("#editGroup");

    $(document).mouseup(function(e) {
      if (!groupSettings.is(e.target) && groupSettings.has(e.target).length === 0) {
        groupSettings.hide();
      }
    });

    //Groepmenu openen en sluiten
    var newGroup = $("#newGroup");
    var newGroupButton = $("#newGroupButton");
    var newGroupImage = $("#newGroupImage");
    var toggleNewGroup = false;

    newGroupButton.click(function() {

      newGroup.fadeToggle("fast");
      if (toggleNewGroup) {
        newGroupImage.animateStep({
          from: 45,
          to: 0,
          step: $.fn.rotate
        });
        toggleNewGroup = false;
      } else {
        newGroupImage.animateStep({
          from: 0,
          to: 45,
          step: $.fn.rotate
        });
        toggleNewGroup = true;
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

    $('textarea').keypress(function(e) {
      if (e.keyCode == 13) {
        console.log(13)
        e.preventDefault();
      }
    })
  });
}
