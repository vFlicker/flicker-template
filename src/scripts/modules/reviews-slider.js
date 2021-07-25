/* eslint-disable no-undef */
/* eslint-disable no-new */
new Swiper('.swiper-container', {
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
    bulletActiveClass: 'swiper__toggle--active',
  },
});
