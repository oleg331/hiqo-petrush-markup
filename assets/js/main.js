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

// Handlebars

const dataUrl = {
  navigation: '../../data/list-navigation.json',
  statistics: '../../data/list-statistics.json',
  portfolio: '../../data/list-portfolio.json'
}

function insertAfter(elem, refNode) {
  refNode.parentNode.insertBefore(elem, refNode.nextSibling);
}

function generateTemplate(template) {
  const { templateId, element, dataUrl, showItems } = template;
  if (element == '.list-portfolio' && !!eachLimitStatus) eachLimitStatus = true;

  fetch(dataUrl)
    .then(handleResponse)
    .then(data => {
      const templateSource = document.querySelector(templateId).innerHTML;
      const compileTemplate = Handlebars.compile(templateSource);
      const elem = document.querySelector(element);

      elem.innerHTML = compileTemplate(data);

      if (showItems !== undefined) {
        const buttonShowMore = document.querySelector(showItems.buttonShowMore);
        let showMoreTemplate = template;

        buttonShowMore.onclick = (event) => {
          const target = event.target;

          delete showMoreTemplate.showItems;

          generateTemplate(showMoreTemplate);
        }
      }
    });
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
})

// portfolio
generateTemplate({
  templateId: '#list-portfolio', 
  element: '.list-portfolio', 
  dataUrl: dataUrl.portfolio,
  showItems: {
    count: 4,
    buttonShowMore: '.show-more-portfolio-block button'
  }
})
