// sliders init

const sliderContainerHeader = '.slider-header';
const sliderHeader = new Slider({
  target: $(`${sliderContainerHeader} .slider-container`),
  dotsContainer: $(`${sliderContainerHeader} .slider-dots`),
  arrowLeft: $(`${sliderContainerHeader} .slider-arrow-left`),
  arrowRight: $(`${sliderContainerHeader} .slider-arrow-right`),
  transition: { speed: 350, easing: 'ease' },
  swipe: true,
  autoHeight: true,
  showSlides: 1,
  dataUrl: dataUrl.sliderHeader
});

const sliderContainerPost = '.slider-post';
const sliderPost = new Slider({
  target: $(`${sliderContainerPost} .slider-container`),
  dotsContainer: $(`${sliderContainerPost} .slider-dots`),
  arrowLeft: $(`${sliderContainerPost} .slider-arrow-left`),
  arrowRight: $(`${sliderContainerPost} .slider-arrow-right`),
  transition: { speed: 350, easing: 'ease' },
  swipe: false,
  autoHeight: true,
  defaultSlides: 3,
  showSlides: 3,
  dataUrl: dataUrl.sliderPost,

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

// navigation general
generateTemplate({
  element: '.navigation-general', 
  templateUrl: templateUrl.navigationGeneral, 
  dataUrl: dataUrl.navigation
});

// navigation burger
generateTemplate({
  element: '.navigation-burger', 
  templateUrl: templateUrl.navigationBurger, 
  dataUrl: dataUrl.navigation
});

// statistics
generateTemplate({
  element: '.list-statistics', 
  templateUrl: templateUrl.statistics, 
  dataUrl: dataUrl.statistics
});

// portfolio
generateTemplate({
  element: '.list-portfolio', 
  templateUrl: templateUrl.portfolio, 
  dataUrl: dataUrl.portfolio,
  showItems: {
    count: 4,
    buttonShowMore: '.show-more-portfolio-block button'
  }
});
