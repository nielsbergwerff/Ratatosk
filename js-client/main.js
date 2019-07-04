var editGroup

//functie voor het laten verschijnen van #groupSettings op de klik van een knop
function setGroupSettingsListener(){
  $('#groupSettings').click(e=>{
    $('#editGroup').css('display','block').css('left',$(e.target).position().left).css('top',$(e.target).position().top)
    $('#editGroup').css('left', '+=20vw')
    editGroup = $(e.target).parent().parent().attr('id')
  })
}

function hideGroupSettings(){
  $('#editGroup').css('display','none')
}

//functie om teksten te verzenden door middel van 'enter'
function textEnterListener(textElement,buttonElement){
  $(textElement).keypress(e=>{if(e.keyCode==13)$(buttonElement).trigger('click')})
}

//functie ...
function mouseUp(object, xFunction, object1) {
  $(document).mouseup(function(e) {
    if (!object.is(e.target) && object.has(e.target).length === 0 && !object1.is(e.target) && object1.has(e.target.length === 0)) {
      xFunction()
    }
  })
}

//NOTE: Waarom in dit format?
$.fn.extend({
  animateStep: function(options) {
    return this.each(function() {
      var elementOptions = $.extend({}, options, {
        step: options.step.bind($(this))
      })
      $({
        x: options.from
      }).animate({
        x: options.to
      }, elementOptions)
    })
  },
  rotate: function(value) {
    return this.css("transform", "rotate(" + value + "deg)")
  }
})

$(document).ready(()=>{

  function toggleMenu() {
    var width = (toggle_menu ? 1 : -1) * menu.width()
    menu.css("visibility", "visible")
    menu.animate({
      "right": "+="+width+"px"
    })
    toggle_menu=!toggle_menu
  }

  var groupColumn = $("#groupColumn")
  var groupColumnClose = $("#groupColumnClose")
  var groupSettings = $("#editGroup")
  var newGroup = $("#newGroup")
  var newGroupButton = $("#newGroupButton")
  var newGroupImage = $("#newGroupImage")
  var menu = $("#menu")
  var menuButton = $("#menuButton")

  var toggle_menu = true

  textEnterListener('#messageBox','#sendMessage')
  textEnterListener('#newGroupName','#createNewGroup')
  textEnterListener('#addMember','#addMemberButton')

  menuButton.click(toggleMenu)

  //Desktop
  if($(window).width() > 900) {

      //Groepopties sluiten als weggeklikt wordt

      $(document).mouseup(function(e) {
        if (!groupSettings.is(e.target) && groupSettings.has(e.target).length === 0) {
          groupSettings.hide()
        }
      })

      //Groepmenu openen en sluiten

      newGroupButton.click(function() {

        newGroup.fadeToggle("fast")
        if (toggleNewGroup) {
          newGroupImage.animateStep({
            from: 45,
            to: 0,
            step: $.fn.rotate
          })
          toggleNewGroup = false
        } else {
          newGroupImage.animateStep({
            from: 0,
            to: 45,
            step: $.fn.rotate
          })
          toggleNewGroup = true
        }
      })

      var copyrightButton = $(".copyrightButton")
      var copyright = $(".copyright")
      var copyrightToggle = true

      // Generic function to set blur radius of $ele
      var setBlur = function(ele, radius) {
          $(ele).css({
            "-webkit-filter": "blur(" + radius + "px)",
            "filter": "blur(" + radius + "px)"
          })
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
              setBlur(ele, this.blurRadius)
            },
            complete: function() {
              // Final callback to set the target blur radius
              // jQuery might not reach the end value
              setBlur(ele, endRadius)
            }
          })
        }

      function hideCopyright() {
        tweenBlur('#container > *:not(#copyright):not(#menu)', 3, 0)
        copyright.slideToggle()
        copyrightButton.animate({
          "bottom": "-=10vh"
        })
        copyrightToggle = true
        $(document).off("mouseup")
      }

      copyrightButton.click(function() {

        if (copyrightToggle) {
          tweenBlur('#container > *:not(#copyright):not(#menu)', 0, 3)
          copyright.slideToggle()
          copyrightButton.animate({
            "bottom": "+=10vh"
          })
          copyrightToggle = false
          mouseUp(copyright, hideCopyright, copyrightButton)
        } else {
          hideCopyright()
        }

      })

      $('textarea').keypress(function(e) {
        if (e.keyCode == 13) {
          console.log(13)
          e.preventDefault()
        }
      })
  }

  //Mobiel
  else {

    //groepen kolom openen en sluiten
    $(document).mouseup(function(e) {
      if (!newGroup.is(e.target) && newGroup.has(e.target).length === 0 && !groupColumn.is(e.target) && groupColumn.has(e.target).length === 0 && !toggleNewGroup) {
        hideGroupColumn()
        hideNewGroup()
      }
    })

    function hideNewGroup() {
      $.when(newGroup.animate({"left": "-=70vw"})).then(function() {
        newGroup.css("visibility", "hidden")
      })
      toggleNewGroup = true
    }

    function hideGroupColumn() {
      $.when(groupColumn.animate({"left": "-=70vw"})).then(function() {
        groupColumn.css("visibility", "hidden")
      })
    }

    newGroupButton.click(function() {
        groupColumn.animate({"left": "+=70vw"})
        newGroup.animate({"left": "+=70vw"})
        groupColumn.css("visibility", "visible")
        newGroup.css("visibility", "visible")
        toggleNewGroup = false
    })

    groupColumnClose.click(function() {
      hideGroupColumn()
      hideNewGroup()
    })
  }
})
