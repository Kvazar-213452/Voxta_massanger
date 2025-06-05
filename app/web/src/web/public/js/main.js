const swiper = new Swiper('.mySwiper', {
  loop: false,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  allowTouchMove: false,
  // autoHeight: false, // Вимкнути авто-висоту!
  navigation: false,
  pagination: false,
  on: {
    init: function() {
      // Ініціалізувати карту тільки для першого слайда
      if(this.activeIndex === 0) {
        initMap();
      }
    },
    slideChange: function() {
      // При зміні слайда перераховуємо карту
      if(this.activeIndex === 0) {
        setTimeout(initMap, 300); // Чекаємо завершення анімації
      }
    }
  }
});

$(document).ready(function() {
  if ($('.swiper-slide-active').has('#map-container').length) {
    initMap();
    $('.menu_item[data-slide="0"]').addClass('active');
  }

  $('.menu_item').on('click', function() {
    $('.menu_item').removeClass('active');
    $(this).addClass('active');

    const slideIndex = parseInt($(this).attr('data-slide'));
    swiper.slideTo(slideIndex);
  });

  swiper.on('slideChange', function() {
    $('.menu_item').removeClass('active');

    const activeSlideIndex = swiper.activeIndex;
    $(`.menu_item[data-slide="${activeSlideIndex}"]`).addClass('active');
  });
});





function load_chat() {
    $.ajax({
        url: "/get_chats_post",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(null),
        success: function (response) {
            console.log(response)
        }
    });
}

