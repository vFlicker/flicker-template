const body = document.querySelector('body');
const navigation = body.querySelector('.main-nav');
const toggleButton = body.querySelector('.main-nav__toggle');

const toggleButtonClickHandler = (evt) => {
  evt.preventDefault();
  navigation.classList.toggle('main-nav--open');
  body.classList.toggle('scroll-lock');
};

toggleButton.addEventListener('click', toggleButtonClickHandler);
