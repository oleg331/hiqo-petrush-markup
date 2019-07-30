
const dataUrl = {
  folder: '../../data/',
  sliderHeader: 'slider-header.json',
  sliderPost: 'slider-blog.json',
  navigation: 'list-navigation.json',
  statistics: 'list-statistics.json',
  portfolio: 'list-portfolio.json',
}

const templateUrl = {
  folder: '../../templates/',
  navigationGeneral: 'navigation-general.hbs',
  navigationBurger: 'navigation-burger.hbs',
  statistics: 'list-statistics.hbs',
  portfolio: 'list-portfolio.hbs'
}

const sources = [dataUrl, templateUrl];

sources.map(source => {
  const urls = Object.keys(source).slice(1);

  urls.forEach(url => {
    source[url] = source.folder + source[url];
  })
});

function getData(dataUrl) {
  return fetch(dataUrl).then(handleResponse);
}

function getTemplate(templateUrl) {
  return fetch(templateUrl).then(response => response.text());
}

function getCompiledElement(templateSource, data) {
  // const templateSource = document.querySelector(templateId).innerHTML;
  const compileTemplate = Handlebars.compile(templateSource);

  return createElementFromHTML(compileTemplate(data));
}

async function generateTemplate(template) {
  const { element, templateUrl, dataUrl, showItems } = template;

  const data = await getData(dataUrl);
  const templateSource = await getTemplate(templateUrl);
  const elem = document.querySelector(element);

  // Lazy loading data
  data.list.map(dataItem => {
    const compiledItem = getCompiledElement(templateSource, dataItem);
    elem.appendChild(compiledItem);
  })

  // Show more items into portfolio
  if (!showItems) return;
  const buttonShowMore = document.querySelector(showItems.buttonShowMore);

  buttonShowMore.addEventListener('click', () => {
    generateTemplate(template);
  })

}
