 function hasClass(el,class) {//elememt, class
  return el.className.match(new RegExp('(\\s|^)'+class+'(\\s|$)'));
};
