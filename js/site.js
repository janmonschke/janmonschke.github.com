var navigationList = document.querySelector('.navigation-list');

var toggleMenu = function(){
  console.log('toggle')
  navigationList.classList.toggle('visible');
};

document.querySelector('.menu-opener').addEventListener('click', toggleMenu);