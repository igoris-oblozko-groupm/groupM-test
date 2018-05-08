var i = -1;
var rotations;
var mouseX;
var mouseDragActive = false;
var dragLimitReached = false;
var carouselTotalRotations = 12;
var carouselIterator = 0;
var domCController = document.getElementById('cController');
var domAnimatedContainer = document.getElementById('animatedContainer');
var itemCount = 0;

oneRotation();

function oneRotation() {
  i = (i >= itemCount-1) ? 0 : i+1;
  
  domCController.children[(i === 0) ? (itemCount - 1) : (i - 1)].className = '';
  domCController.children[i].className = 'active';
  domAnimatedContainer.children[(i === 0) ? (itemCount - 1) : (i - 1)].className = 'listItem';
  domAnimatedContainer.style['transform'] = 'translateX(-' + (100 / itemCount * i) + '%)';
  domAnimatedContainer.children[i].className += ' active';
  if (carouselIterator<carouselTotalRotations) {
    carouselIterator++;
    rotations = setTimeout(oneRotation, 3000);
  } else {
    clearTimeout(rotations);
  }
};

function slideTo(newPosition) {
  clearTimeout(rotations);
  i = newPosition;
  dragLimitReached = false;
  carouselIterator = carouselTotalRotations + 1;

  for (cActive = 0; cActive < itemCount; cActive++) {
    domCController.children[cActive].className = '';
    domAnimatedContainer.children[cActive].className = 'listItem';
  }
  domCController.children[i].className = 'active';
  domAnimatedContainer.children[i].className += ' active';
  domAnimatedContainer.style['transform'] = 'translateX(-' + (100 / itemCount * i) + '%)';
  if (carouselIterator<carouselTotalRotations) {
    rotations = setTimeout(oneRotation, 3000);
  } else {
    clearTimeout(rotations);
  }
};

function cDrag(e) {
  // mouse clicked state inside carousel bounds
  mouseDragActive = true;
  clearTimeout(rotations);
  mouseX = e.changedTouches || e.clientX;
  mouseX = (isNaN(mouseX)) ? mouseX[0].clientX : mouseX;
  isMovingX = mouseX;
};

function cRelease(e) {
  // mouse unclicked state inside carousel bounds
  var endMouseX = e.clientX || e.changedTouches[0];
  endMouseX = (isNaN(endMouseX)) ? endMouseX.clientX : endMouseX;
  mouseDragActive = false;

  if (endMouseX > mouseX) {
    i = ((i===0) ? 0 : i-1);
  } else {
    i = ((i>=itemCount-1) ? itemCount-1 : i+1);
  }
  slideTo(i);
}

function cDragging(e) {
  // mouse inside carousel bounds
  var crtMouseX = e.changedTouches || e.clientX;
  crtMouseX = (isNaN(crtMouseX)) ? crtMouseX[0].clientX : crtMouseX;
  if (mouseDragActive && !dragLimitReached) {
    clearTimeout(rotations);
    var currentTransform = domAnimatedContainer.style['transform'];
    currentTransform = Number(currentTransform.substr(currentTransform.indexOf('(')+1, (currentTransform.indexOf('%') - currentTransform.indexOf('(') - 1)));
    var transformDelta = (-4 / 100) * (mouseX - crtMouseX);
    var transformTo = currentTransform + transformDelta;
    if (transformTo > 10) { transformTo = 10; }
    if (transformTo < -85) { transformTo = -85; }
    if ((transformTo - (-100 / 4 * i) < -10) || (transformTo - (-100 / 4 * i) > 10)) {
      dragLimitReached = true;
    }
    domAnimatedContainer.style['transform'] = 'translateX(' + transformTo + '%)';
  } 
}

function cClearOrDrag(e) {
  // mouse out of carousel bounds
  var sendMouseX = e.changedTouches || e.clientX;
  var eToPass;
  if (mouseDragActive) {
    mouseDragActive = false;
    if (isNaN(sendMouseX)) {
      eToPass = { changedTouches: [ sendMouseX ] };
    } else {
      eToPass = { clientX: sendMouseX };
    }    
    cRelease(eToPass);
  }
}
