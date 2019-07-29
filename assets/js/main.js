
const dataUrl = {
  sliderHeader: '../../data/slider-header.json',
  sliderPost: '../../data/slider-blog.json',
  navigation: '../../data/list-navigation.json',
  statistics: '../../data/list-statistics.json',
  portfolio: '../../data/list-portfolio.json'
}

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

// Handlebars

function insertAfter(elem, refNode) {
  refNode.parentNode.insertBefore(elem, refNode.nextSibling);
}

function generateTemplate(template) {
  const { templateId, element, dataUrl, showItems } = template;

  fetch(dataUrl)
    .then(handleResponse)
    .then(data => {
      const templateSource = document.querySelector(templateId).innerHTML;
      const compileTemplate = Handlebars.compile(templateSource);
      const elem = document.querySelector(element);

      elem.innerHTML = compileTemplate(data);

      // () => {
      //   if (!arguments.length) return;

      //   const buttonShowMore = document.querySelector(showItems.buttonShowMore);
      //   let showMoreTemplate = template;

      //   buttonShowMore.addEventListener('click', event => {
      //     delete showMoreTemplate.showItems;
      //     generateTemplate(showMoreTemplate);
      //   })
      // }
      if (showItems !== undefined) {
        const buttonShowMore = document.querySelector(showItems.buttonShowMore);
        let showMoreTemplate = template;

        buttonShowMore.addEventListener('click', event => {
          delete showMoreTemplate.showItems;
          generateTemplate(showMoreTemplate);
        })
      }
    })
    .then();
}

// navigation general
generateTemplate({
  templateId: '#navigation-general', 
  element: '.navigation-general', 
  dataUrl: dataUrl.navigation
});

// navigation burger
generateTemplate({
  templateId: '#navigation-burger', 
  element: '.navigation-burger', 
  dataUrl: dataUrl.navigation
});

// statistics
generateTemplate({
  templateId: '#list-statistics', 
  element: '.list-statistics', 
  dataUrl: dataUrl.statistics
});

// portfolio

const generatePortfolio = generateTemplate({
  templateId: '#list-portfolio', 
  element: '.list-portfolio', 
  dataUrl: dataUrl.portfolio,
  showItems: {
    count: 4,
    buttonShowMore: '.show-more-portfolio-block button'
  }
});