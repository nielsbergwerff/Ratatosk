//Als het document geladen is:
$(document).ready(() => {
      //Variabelen
      const $menu = $('.menu');
      const $header = $('.header');
      const $content = $('.content');
      const $container = $('.container');
      const $menuButton = $('#menuButton')

      //Als menuknop wordt ingedrukt:
      $menuButton.click(function() {
          if (!$container.attr('id', 'menuActive')) {
              $container.attr('id', 'menuActive');
            } else {
              $container.removeAttr('id', 'menuActive');
            }
            $menu.slideToggle('slow');
          });
      });
