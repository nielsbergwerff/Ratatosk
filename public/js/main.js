var editGroup

//functie voor het laten verschijnen van #groupSettings op de klik van een knop bij de juiste groep
function setGroupSettingsListener(){
  $('.groupSettings').click(e=>{
    $('#editGroup')
      .css('display','block')
      .css('left',$(e.target).position().left)
      .css('top',$(e.target).position().top)
      .css('left', '+=20vw')
    editGroup = $(e.target).parent().parent().attr('id')
  })
}

function hideGroupSettings(){
  $('#editGroup').css('display','none')}

//functie om teksten te verzenden door middel van 'enter'
function textEnterListener(textElement,buttonElement){
  $(textElement).keypress(e=>{if(e.keyCode==13)$(buttonElement).trigger('click')})}

//functie om te detecteren wanneer naast een element geklikt wordt
function mouseUp(element, functionX, condition, element1) {
  $(document).mouseup(e=>{
    if(
      !element.is(e.target) &&
      element.has(e.target).length === 0 &&
      (!element1 || (!element1.is(e.target) &&
      element1.has(e.target).length === 0)) &&
      condition)
        functionX()})
}

function blurElement(element, size) {
  var filterVal = 'blur(' + size + 'px)';
  $(element).css({
    'filter':filterVal,
    'webkitFilter':filterVal,
    'mozFilter':filterVal,
    'oFilter':filterVal,
    'msFilter':filterVal,
    'transition':'all 0.2s ease-out',
    '-webkit-transition':'all 0.2s ease-out',
    '-moz-transition':'all 0.2s ease-out',
    '-o-transition':'all 0.2s ease-out'
  })
  $(element).delay(500).queue(next=>{
    $(element).css({
      'transition':'',
      '-webkit-transition':'',
      '-moz-transition':'',
      '-o-transition':''
    })
    next()
  })
}

$(document).ready(()=>{

  function setMouseUp() {
    $(document).off('mouseup')
    mouseUp(menu, toggleMenu, !toggle_menu, copyright)
    mouseUp(newGroup, toggleNewGroup, !toggle_newGroup, newGroupButton)
    mouseUp(copyright, toggleCopyright, !toggle_copyright, copyrightButton)
  }

  //e wordt niet gebruikt, maar wordt automatisch verzonden als arg door .click
  function toggleMenu(e,cb) {
    var width = (toggle_menu ? 1 : -1) * menu.width()
    menuButton.css('transform', 'translateX(' + (width * -toggle_menu) + 'px)' )
    if(!toggle_menu)menu.delay(5)
    menu.animate({ 'right': `+=${width}px` }, 200, 'linear',()=>{
      if(!toggle_menu)menu.css('right','')
      toggle_menu=!toggle_menu
      setMouseUp()
      cb && cb()
    })
  }

  function toggleNewGroup(){
    newGroup.fadeToggle('fast')
    newGroupImage.css('transform', 'rotate(' + toggle_newGroup * 45 + 'deg)')
    toggle_newGroup=!toggle_newGroup
    setMouseUp()
  }

  function toggleCopyright() {
    var height = (toggle_copyright ? 1 : -1) * 10
    blurElement('body > *:not(#copyright):not(#menu)', 3*toggle_copyright)
    copyright.slideToggle(200)
    copyrightButton.animate({'bottom': `+=${height}vh`})
    toggle_copyright=!toggle_copyright
    setMouseUp()
  }

  //als deze functie constant uitgevoerd zou worden, zou dat lelijk worden
  //daarom een interval
  function onResize() {
    clearInterval(resizeInterval)
    if($(window).width()<=900) {
      if(!toggle_menu) toggleMenu(null,()=>{menuButton.css('transform','')})
      else menuButton.css('transform','')
    }
    resizeInterval = setInterval(onResize,400)
  }

  var
  groupColumn = $('#groupColumn'),
  groupColumnClose = $('#groupColumnClose'),
  groupSettings = $('#editGroup'),
  newGroup = $('#newGroup'),
  newGroupButton = $('#newGroupButton'),
  newGroupImage = $('#newGroupImage'),
  menu = $('#menu'),
  menuButton = $('#menuButton'),
  copyright = $('#copyright'),
  copyrightButton = $('#copyrightButton'),

  toggle_menu = true,
  toggle_newGroup = true,
  toggle_copyright = true,

  resizeInterval = setInterval(onResize,400)

  textEnterListener('#messageBox','#sendMessage')
  textEnterListener('#newGroupName','#createNewGroup')
  textEnterListener('#addMember','#addMemberButton')

  menuButton.click(toggleMenu)
  newGroupButton.click(toggleNewGroup)
  copyrightButton.click(toggleCopyright)

  $(window).resize(()=>{
    if($(window).width()>900) {
      menuButton
        .css('transition-duration','0s')
        .css('transform', 'translateX(' + (menu.width() * (toggle_menu - 1)) + 'px)' )
      setTimeout(()=>{menuButton.css('transition-duration','')})
    }
  })
})
