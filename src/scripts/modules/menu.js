const navigation = document.querySelector('.main-nav');
const toggleButton = document.querySelector('.main-nav__toggle');

const toggleButtonClickHandler = (evt) => {
  evt.preventDefault();
  navigation.classList.toggle('main-nav--open');
};

toggleButton.addEventListener('click', toggleButtonClickHandler);
