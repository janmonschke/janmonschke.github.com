document.addEventListener('DOMContentLoaded', function() {
  FastClick.attach(document.body);
  var navigationList = document.querySelector('.navigation-list');

  var toggleMenu = function(){
    navigationList.classList.toggle('visible');
  };

  document.querySelector('.menu-opener').addEventListener('click', toggleMenu);
}, false);