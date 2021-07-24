new Swiper('.swiper-container', {
  allowTouchMove: true,
  loop: true,
  slidesPerView: 1,

  navigation: {
    prevEl: '.reviews__prev',
    nextEl: '.reviews__next',
  },

  pagination: {
    el: '.swiper__pagination',
    type: 'bullets',
    bulletClass: 'swiper__toggle',
    bulletActiveClass: 'swiper__toggle--active'
  },
});
