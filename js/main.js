//Als het document geladen is:
$(document).ready(function() {
  //Variabelen
  const $menu = $(".menu");
  const $header = $(".header");
  const $content = $(".content");
  const $container = $(".container");
  const $menuButton = $(".menuButton")

  function menuToggle() {
    $menu.toggle();
  }

  function menuClassToggle() {
    if ($container.hasClass("menuActive")) {
      $container.removeClass("menuActive");
    } else {
      $container.addClass("menuActive");
    }
  }


  $menuButton.click(function() {
    if ($container.hasClass("menuActive")) {
      $("#menuButtonMenu").toggle();
      $.when(menuToggle()).then(function() {
        menuClassToggle()
      }).then(function() {
        $("#menuButtonHeader").toggle();
      });
    } else {
      $("#menuButtonHeader").toggle();
      $.when(menuClassToggle()).then(function() {
        menuToggle();
      });
      $("#menuButtonMenu").toggle();
    }

  });
});
