let el = (function() {

  function el (tag, attrs, content) {
    let e = tag === 'fragment' ? document.createDocumentFragment() : document.createElement(tag);

    if (!attrs) {
      return e;
    }

    if (attrs.constructor !== Object) {
      content = attrs;
      attrs = {};
    }

    if (Array.isArray(content)) {
      content.forEach((child) => e.appendChild(typeof child === 'string' ? document.createTextNode(child) : child));
    } else if (typeof content === 'string') {
      e.textContent = content;
    } else if (content) {
      throw new Error(`unexpected content type: ${typeof content}`);
    }

    for (let k in attrs) {
      if (k.slice(0, 2) == 'on') {
        e.addEventListener(k.slice(2), attrs[k]);
      } else {
        e.setAttribute(k, attrs[k]);
      }
    }

    return e;
  }

  return el;

})();
