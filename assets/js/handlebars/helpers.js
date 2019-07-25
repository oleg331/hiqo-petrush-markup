// navigation header
Handlebars.registerHelper('NavLink', (typeLink, item, index) => {
  const { url, text, classNameItem, classNameLink } = item;
  
  const isFirst = (index === 0);
  const isGeneral = (typeLink === 'general');

  const listItem = document.createElement('li');
  const link = document.createElement('a');

  listItem.setAttribute(
    'class', 
    `${classNameItem} ${isFirst ? 'active' : ''} ${isGeneral ? 'hidden-medium' : ''}`
  );

  link.setAttribute('href', url);
  link.setAttribute('class', classNameLink);
  link.innerHTML = text;

  listItem.appendChild(link);

  return new Handlebars.SafeString(listItem.outerHTML);
});

// portfolio

let templateStructure = [];
let eachLimitStatus = false;

Handlebars.registerHelper('eachLimit', (items, limitItems, options) => {
  templateStructure = [];

  if(!items || items.length == 0) {
    return options.inverse(this);
  }

  const result = [];

  let i = 0;
  while (i < items.length) {
    const item = options.fn(items[i]);

    if (i < limitItems) {
      result.push(item);
    }
    templateStructure.push(item);

    i++;
  }

  if(eachLimitStatus) {
    return templateStructure.join('');
  }
  
  eachLimitStatus = true;
  return result.join('');
});