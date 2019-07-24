// sliders init

const sliderHeader = new Slider({
  target: $('.slider-header .slider-container'),
  dotsContainer: $('.slider-header .slider-dots'),
  arrowLeft: $('.slider-header .slider-arrow-left'),
  arrowRight: $('.slider-header .slider-arrow-right'),
  transition: { speed: 350, easing: 'ease' },
  swipe: true,
  autoHeight: true,
  showSlides: 1,
  dataUrl: '../../data/slider-header.json'
});

const sliderPost = new Slider({
  target: $('.slider-post .slider-container'),
  dotsContainer: $('.slider-post .slider-dots'),
  arrowLeft: $('.slider-post .slider-arrow-left'),
  arrowRight: $('.slider-post .slider-arrow-right'),
  transition: { speed: 350, easing: 'ease' },
  swipe: false,
  autoHeight: true,
  defaultSlides: 3,
  showSlides: 3,
  dataUrl: '../../data/slider-blog.json',

  // for showSlides only
  breakpoints: {
    1200: {
      showSlides: 2,
    },
    675: {
      showSlides: 1
    }
  }
});
