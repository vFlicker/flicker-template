var navigation = document.querySelector('.main-nav');
var toggleButton = document.querySelector('.main-nav__toggle');

var toggleButtonClickHandler = function(evt) {
  evt.preventDefault();
  navigation.classList.toggle('main-nav--open');
};

toggleButton.addEventListener('click', toggleButtonClickHandler);
