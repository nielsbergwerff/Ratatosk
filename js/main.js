//Als het document geladen is:
$(document).ready(function() {
  //Variabelen
  const $menu = $(".menu");
  const $header = $(".header");
  const $content = $(".content");
  const $container = $(".container");
  const $menuButton = $(".menuButton")

  $menuButton.click(function() {
    if ($container.hasClass("menuActive")) {
      $menu.toggle();
      $container.removeClass("menuActive");
      $('#menuButtonMenu').toggle();
      $('#menuButtonHeader').toggle();
    } else {
      $menu.toggle();
      $container.addClass("menuActive");
      $('#menuButtonMenu').toggle();
      $('#menuButtonHeader').toggle();
    }
  });
});
