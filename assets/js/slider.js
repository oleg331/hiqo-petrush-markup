// Global universal functions
function $(elem) {
  return document.querySelector(elem);
}

function hasClass(elem, className) {
  return elem.classList ? elem.classList.contains(className) : false;
}

function addClass(elem, className) {
  if (elem.classList) {
    elem.classList.add(className);
  } else {
    elem.className += ' ' + className;
  }
}

function removeClass(elem, className) {
  if (elem.classList) {
    elem.classList.remove(className);
  }
}

const Slider = (function () {

  const slider = function (settings) {

    this.state = {
      target: settings.target,
      dotsContainer: settings.dotsContainer,
      arrowLeft: settings.arrowLeft,
      arrowRight: settings.arrowRight,
      transition: settings.transition,
      swipe: true,
      autoHeight: true
    }

    this.init();
  }

  slider.prototype.buildDots = function () {

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');

      dot.setAttribute('data-slide', i + 1);
      dot.setAttribute('class', 'slider-dot');

      this.state.dotsContainer.appendChild(dot);
    }

    this.state.dotsContainer.addEventListener('click', (e) => {
      if (e.target) {
        this.currentSlide = e.target.getAttribute('data-slide');
        this.goToSlide();
      }
    }, false);
  }

  slider.prototype.getCurrentLeft = function () {
    this.currentLeft = parseInt(this.sliderInner.style.left.split('px')[0]);
  }

  slider.prototype.goToSlide = function () {

    this.sliderInner.style.transition = 'left ' + this.state.transition.speed / 1000 + 's ' + this.state.transition.easing;
    this.sliderInner.style.left = -this.currentSlide * this.slideW + 'px';

    addClass(this.state.target, 'isAnimating');

    setTimeout(() => {
      this.sliderInner.style.transition = '';
      removeClass(this.state.target, 'isAnimating');
    }, this.state.transition.speed);

    this.setDot();
    if (this.state.autoHeight) {
      this.state.target.style.height = this.allSlides[this.currentSlide].offsetHeight + "px";
    }
  }

  slider.prototype.init = function () {
    const self = this;

    function on_resize(c, t) {
      onresize = function () {
        clearTimeout(t);
        t = setTimeout(c, 100);
      }
      return onresize;
    }

    window.addEventListener("resize", on_resize(() => {
      self.updateSliderDimension();
    }), false);

    // Wrap slider-inner
    const currentHTML = this.state.target.innerHTML;
    this.state.target.innerHTML = '<div class="slider-inner">' + currentHTML + '</div>';

    this.allSlides = 0;
    this.currentSlide = 0;
    this.currentLeft = 0;
    this.totalSlides = this.state.target.querySelectorAll('.slider-slide').length;

    this.sliderInner = this.state.target.querySelector('.slider-inner');
    this.loadedCnt = 0;

    // Append clones
    const cloneFirst = this.state.target.querySelectorAll('.slider-slide')[0].cloneNode(true);
    this.sliderInner.appendChild(cloneFirst);

    const cloneLast = this.state.target.querySelectorAll('.slider-slide')[this.totalSlides - 1].cloneNode(true);
    this.sliderInner.insertBefore(cloneLast, this.sliderInner.firstChild);

    this.currentSlide++;
    this.allSlides = this.state.target.querySelectorAll('.slider-slide');

    this.sliderInner.style.width = (this.totalSlides + 2) * 100 + "%";
    for (let i = 0; i < self.totalSlides + 2; i++) {
      this.allSlides[i].style.width = 100 / (this.totalSlides + 2) + "%";
      this.updateSliderDimension();
    }

    this.buildDots();
    this.setDot();
    this.initArrows();

    function addListenerMulti(elem, eventNames, eventFunc) {
      eventNames.split(' ').forEach(function (e) {
        return elem.addEventListener(e, eventFunc, false);
      });
    }

    function removeListenerMulti(elem, eventNames, eventFunc) {
      eventNames.split(' ').forEach(function (e) {
        return elem.removeEventListener(e, eventFunc, false);
      });
    }

    if (this.state.swipe) {
      addListenerMulti(this.sliderInner, 'mousedown touchstart', startSwipe);
    }

    this.isAnimating = false;

    function startSwipe(e) {

      self.getCurrentLeft();
      if (!self.isAnimating) {
        if (e.type == 'touchstart') {
          touch = e.targetTouches[0] || e.changedTouches[0];
        }

        self.startX = e.pageX;
        self.startY = e.pageY;

        addListenerMulti(self.sliderInner, 'mousemove touchmove', swipeMove);
        addListenerMulti($('body'), 'mouseup touchend', swipeEnd);
      }
    }

    function swipeMove(e) {
      let touch = e;

      if (e.type == 'touchmove') {
        touch = e.changedTouches[0];
      }
      self.moveX = touch.pageX;
      self.moveY = touch.pageY;

      // for scrolling left and right
      if (Math.abs(self.moveX - self.startX) < 40) return;

      self.isAnimating = true;
      addClass(self.state.target, 'isAnimating');

      if (self.currentLeft + self.moveX - self.startX > 0 && self.currentLeft == 0) {
        self.currentLeft = -self.totalSlides * self.slideW;
      } else if (self.currentLeft + self.moveX - self.startX < -(self.totalSlides + 1) * self.slideW) {
        self.currentLeft = -self.slideW;
      }
      self.sliderInner.style.left = self.currentLeft + self.moveX - self.startX + "px";
    }

    function swipeEnd(e) {
      self.getCurrentLeft();

      if (Math.abs(self.moveX - self.startX) === 0) return;

      self.stayAtCur = Math.abs(self.moveX - self.startX) < 40 || typeof self.moveX === "unstateined" ? true : false;
      self.dir = self.startX < self.moveX ? 'left' : 'right';

      if (self.stayAtCur) { } else {
        self.dir == 'left' ? self.currentSlide-- : self.currentSlide++;
        if (self.currentSlide < 0) {
          self.currentSlide = self.totalSlides;
        } else if (self.currentSlide == self.totalSlides + 2) {
          self.currentSlide = 1;
        }
      }

      self.goToSlide();

      delete self.startX;
      delete self.startY;
      delete self.moveX;
      delete self.moveY;

      self.isAnimating = false;
      removeClass(self.state.target, 'isAnimating');
      removeListenerMulti(self.sliderInner, 'mousemove touchmove', swipeMove);
      removeListenerMulti($('body'), 'mouseup touchend', swipeEnd);
    }
  }

  slider.prototype.initArrows = function () {

    this.state.arrowLeft.addEventListener('click', () => {
      if (!hasClass(this.state.target, 'isAnimating')) {
        if (this.currentSlide == 1) {
          this.currentSlide = this.totalSlides + 1;
          this.sliderInner.style.left = -this.currentSlide * this.slideW + 'px';
        }
        this.currentSlide--;
        this.goToSlide();
      }
    }, false);

    this.state.arrowRight.addEventListener('click', () => {
      if (!hasClass(this.state.target, 'isAnimating')) {
        if (this.currentSlide == this.totalSlides) {
          this.currentSlide = 0;
          this.sliderInner.style.left = -this.currentSlide * this.slideW + 'px';
        }
        this.currentSlide++;
        this.goToSlide();
      }
    }, false);
  }

  slider.prototype.setDot = function () {
   let tardot = this.currentSlide - 1;

    for (let j = 0; j < this.totalSlides; j++) {
      removeClass(this.state.dotsContainer.querySelectorAll('.slider-dot')[j], 'slider-dot-active');
    }

    if (this.currentSlide - 1 < 0) {
      tardot = this.totalSlides - 1;
    } else if (this.currentSlide - 1 > this.totalSlides - 1) {
      tardot = 0;
    }

    addClass(this.state.dotsContainer.querySelectorAll('.slider-dot')[tardot], 'slider-dot-active');
  }

  slider.prototype.updateSliderDimension = function () {

    this.slideW = parseInt(this.state.target.querySelectorAll('.slider-slide')[0].offsetWidth);
    this.sliderInner.style.left = -this.slideW * this.currentSlide + "px";

    if (this.state.autoHeight) {
      this.state.target.style.height = this.allSlides[this.currentSlide].offsetHeight + "px";
    } else {
      for (let i = 0; i < this.totalSlides + 2; i++) {
        if (this.allSlides[i].offsetHeight > this.state.target.offsetHeight) {
          this.state.target.style.height = this.allSlides[i].offsetHeight + "px";
        }
      }
    }
  }

  return slider;
})();

const slider = new Slider({
  target: $('.slider-header .slider-container'),
  dotsContainer: $('.slider-dots'),
  arrowLeft: $('.slider-arrow-left'),
  arrowRight: $('.slider-arrow-right'),
  transition: { speed: 350, easing: 'ease' }
});
