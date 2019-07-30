function handleResponse(response) {
  return response.text().then(text => {
    return text && JSON.parse(text);
  });
}

function insertAfter(elem, refNode) {
  refNode.parentNode.insertBefore(elem, refNode.nextSibling);
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}
