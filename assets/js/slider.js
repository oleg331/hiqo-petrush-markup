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

  const Slider = function (settings) {

    const defaultState = {
      transition: { speed: 200, easing: 'ease' },
      showSlides: 3,
      swipe: false,
      autoHeight: false
    };

    this.state = {
      ...defaultState,
      ...settings
    };

    this.generateSlides().then(() => this.init());

  }

  Slider.prototype.getSlidesData = function () {
    const dataUrl = this.state.dataUrl;

    return fetch(dataUrl)
      .then(handleResponse)
      .then(data => {
        this.slides = data;
        console.log(this.slides);
        return data;
      })

  }

  Slider.prototype.generateSlides = function () {
    return new Promise((resolve) => {
      this.currentHTML = document.createElement('div');
      this.currentHTML.className = 'slider-inner';

      this.getSlidesData()
        .then(sliderData => {
          const sliderName = sliderData.name;
          const listSlides = sliderData.slides;

          listSlides.map(slideData => {
            const slide = document.createElement('div');
            const slideStructure = this.generateSlide(sliderName, slideData);
            slide.className = 'slider-slide';
            slide.innerHTML = slideStructure;

            this.currentHTML.appendChild(slide);
          })

          this.state.target.innerHTML = `
            <div class="slider-inner">
              ${this.currentHTML.innerHTML}
            </div>
          `;

          resolve();
        })

    })
  }

  Slider.prototype.generateSlide = function (sliderName, slideData) {
    if (sliderName === 'slider-header') {
      return `
        <h1 class="head-primary title-slider-slide">${slideData.title}</h1>
        <p class="description-slider-slide">${slideData.description}</p>
        <div class="slider-buttons">
          <a class="btn btn-slider-buttons btn-dark" href="#">Explore</a>
          <a class="btn btn-slider-buttons btn-dark" href="#">Learn more</a>
        </div>
      `;
    } else if (sliderName === 'slider-blog') {
      return `
        <div class="block-post">
          <div class="img-block-post"></div>
          <div class="content-block-post">
            <a class="title-post" href="#">${slideData.title}</a>
            <ul class="short-info-post">
              <li class="info-post-item">
                <i class="icons-blog icon-author"></i>
                ${slideData.author}
              </li>
              <li class="info-post-item">
                <i class="icons-blog icon-calendar"></i>
                ${slideData.date}
              </li>
              <li class="info-post-item">
                <i class="icons-blog icon-comment"></i>
                ${slideData.countComments}
              </li>
            </ul>
            <p class="description-post">${slideData.description}</p>
            <a class="btn btn-light read-more" href="#">Read more</a>
          </div>
        </div>
      `;
    }
  }

  Slider.prototype.buildDots = function () {

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

  Slider.prototype.getCurrentLeft = function () {
    this.currentLeft = parseInt(this.sliderInner.style.left.split('px')[0]);
  }

  Slider.prototype.goToSlide = function () {

    this.sliderInner.style.transition = 'left ' + this.state.transition.speed / 1000 + 's ' + this.state.transition.easing;
    this.sliderInner.style.left = -this.currentSlide * this.slideW + 'px';

    addClass(this.state.target, 'slider-animating');

    this.setDot();

    setTimeout(() => {
      this.sliderInner.style.transition = '';
      removeClass(this.state.target, 'slider-animating');
    }, this.state.transition.speed);

    if (this.state.autoHeight) {
      this.state.target.style.height = this.allSlides[this.currentSlide].offsetHeight + 'px';
    }
  }

  Slider.prototype.init = function () {
    const self = this;

    function onResize(c, t) {
      const onResize = function () {
        clearTimeout(t);
        t = setTimeout(c, 100);
      }
      return onResize;
    }

    window.addEventListener('resize', onResize(() => {
      self.updateSliderDimension();
    }), false);

    this.allSlides = 0;
    this.currentSlide = 0;
    this.currentLeft = 0;
    this.totalSlides = this.state.target.querySelectorAll('.slider-slide').length;

    this.sliderInner = this.state.target.querySelector('.slider-inner');
    this.loadedCnt = 0;

    // Append clones
    if (this.state.target.querySelectorAll('.slider-slide')[0]) {
      const cloneFirst = this.state.target.querySelectorAll('.slider-slide')[0].cloneNode(true);
      this.sliderInner.appendChild(cloneFirst);

      const cloneLast = this.state.target.querySelectorAll('.slider-slide')[this.totalSlides - 1].cloneNode(true);
      this.sliderInner.insertBefore(cloneLast, this.sliderInner.firstChild);
    }

    this.currentSlide++;
    this.allSlides = this.state.target.querySelectorAll('.slider-slide');

    this.sliderInner.style.width = (this.totalSlides + 2) * 100 + '%';
    for (let i = 0; i < self.totalSlides + 2; i++) {
      this.allSlides[i].style.width = (100 / (this.totalSlides + 2)) / this.state.showSlides + '%';
      this.updateSliderDimension();
    }

    this.buildDots();
    this.setDot();
    this.initArrows();

    if (this.state.swipe) {
      this.addListenerMulti(this.sliderInner, 'mousedown touchstart', startSwipe);
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

        self.addListenerMulti(self.sliderInner, 'mousemove touchmove', swipeMove);
        self.addListenerMulti($('body'), 'mouseup touchend', swipeEnd);
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
      addClass(self.state.target, 'slider-animating');

      if (self.currentLeft + self.moveX - self.startX > 0 && self.currentLeft == 0) {
        self.currentLeft = -self.totalSlides * self.slideW;
      } else if (self.currentLeft + self.moveX - self.startX < -(self.totalSlides + 1) * self.slideW) {
        self.currentLeft = -self.slideW;
      }
      self.sliderInner.style.left = self.currentLeft + self.moveX - self.startX + 'px';
    }

    function swipeEnd(e) {
      self.getCurrentLeft();

      if (Math.abs(self.moveX - self.startX) === 0) return;

      self.stayAtCur = Math.abs(self.moveX - self.startX) < 40 || typeof self.moveX === 'unstateined' ? true : false;
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
      removeClass(self.state.target, 'slider-animating');
      self.removeListenerMulti(self.sliderInner, 'mousemove touchmove', swipeMove);
      self.removeListenerMulti($('body'), 'mouseup touchend', swipeEnd);
    }
  }

  Slider.prototype.addListenerMulti = function (elem, eventNames, eventFunc) {
    eventNames.split(' ').forEach(function (e) {
      return elem.addEventListener(e, eventFunc, false);
    });
  }

  Slider.prototype.removeListenerMulti = function (elem, eventNames, eventFunc) {
    eventNames.split(' ').forEach(function (e) {
      return elem.removeEventListener(e, eventFunc, false);
    });
  }

  Slider.prototype.initArrows = function () {
    const self = this;

    function clickArrowLeft() {
      if (self.currentSlide == 1 && !hasClass(self.state.target, 'slider-animating')) {
        self.currentSlide = self.totalSlides + 1;
        self.sliderInner.style.left = -self.currentSlide * self.slideW + 'px';
      }

      self.currentSlide--;
      self.goToSlide();
    }

    function clickArrowRight() {
      if (self.currentSlide == self.totalSlides && !hasClass(self.state.target, 'slider-animating')) {
        self.currentSlide = 0;
        self.sliderInner.style.left = -self.currentSlide * self.slideW + 'px';
      }

      self.currentSlide++;
      self.goToSlide();
    }

    this.addListenerMulti(this.state.arrowLeft, 'click', clickArrowLeft)
    this.addListenerMulti(this.state.arrowRight, 'click', clickArrowRight)
  }

  Slider.prototype.setDot = function () {
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

  Slider.prototype.updateSliderDimension = function () {

    this.slideW = parseInt(this.state.target.querySelectorAll('.slider-slide')[0].offsetWidth);
    this.sliderInner.style.left = -this.slideW * this.currentSlide + 'px';

    if (this.state.autoHeight) {
      this.state.target.style.height = this.allSlides[this.currentSlide].offsetHeight + 'px';
    } else {
      for (let i = 0; i < this.totalSlides + 2; i++) {
        if (this.allSlides[i].offsetHeight > this.state.target.offsetHeight) {
          this.state.target.style.height = this.allSlides[i].offsetHeight + 'px';
        }
      }
    }

    const breakpoints = this.state.breakpoints;

    if (breakpoints) {

      let breakpointsNames = [];

      Object.keys(breakpoints).sort().forEach(key => {
        breakpointsNames.push(+key);
      });

      let updateDimensionForBreakpoints = false;

      const minBreakpoint = breakpointsNames[breakpointsNames.length - 1]

      if (breakpointsNames[0] > document.body.offsetWidth) {
        updateDimensionForBreakpoints = true;
      }

      if (breakpoints && updateDimensionForBreakpoints) {
        Object.keys(this.state.breakpoints).forEach((key, index) => {
          if (document.body.offsetWidth > breakpointsNames[0]) {
            this.state.showSlides = this.state.defaultSlides;
          } else if (document.body.offsetWidth < breakpointsNames[breakpointsNames.length - 1]) {
            this.state.showSlides = breakpoints[minBreakpoint].showSlides;
          } else if (document.body.offsetWidth < key) {
            this.state.showSlides = this.state.breakpoints[key].showSlides;
          }
        })

        for (let i = 0; i < this.totalSlides + 2; i++) {
          this.allSlides[i].style.width = (100 / (this.totalSlides + 2)) / this.state.showSlides + '%';
        }
      }
    }
  }