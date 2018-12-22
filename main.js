//Als het document geladen is:
$(document).ready(() => {
  //Variabelen
  const $menu = $('.menu');
  const $header = $('.header');
  const $content = $('.content');
  const $container = $('.container')
  const $menuButton = $('#menuButton')

  //Als menuknop wordt ingedrukt:
  $menuButton.on('click', () => {
    $container.attr('id', 'menuActive');
    $menu.slideToggle('slow');
  });
});
