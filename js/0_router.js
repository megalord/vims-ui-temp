let router = (function() {

  let routes = {};

  let notFoundFn = function (path) {
    throw new Error(`No route matches ${path}`);
  }

  function matches(pathParts, routeParts) {
    if (pathParts.length !== routeParts.length) {
      return null;
    }

    let params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i][0] === ':') {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (pathParts[i] !== routeParts[i]) {
        return null;
      }
    }

    return params;
  }

  function parse(path) {
    let params;
    let pathParts = path.split('/');

    for (let route in routes) {
      if (route === 'else') {
        continue;
      }

      params = matches(pathParts, route.split('/'));
      if (params) {
        return routes[route].bind(null, params);
      }
    }
    return notFoundFn.bind(null, path);
  }

  function routeChangeHandler() {
    let path = location.pathname;

    if (path === '') {
      path = '/';
    }

    parse(path)();
  }

  function router(_routes) {
    routes = _routes;

    if ('else' in routes) {
      notFoundFn = routes.else;
    }

    document.addEventListener('click', function(event) {
      if (event.target.tagName != 'A' || event.ctrlKey || event.metaKey || ('button' in event && event.button != 0)) {
        return;
      }

      let href = event.target.getAttribute('href');
      if (!href || href.includes('http')) {
        return;
      }

      event.preventDefault();
      router.go(href);
    });

    window.onpopstate = routeChangeHandler;
    // Get the resources for the initial route.
    routeChangeHandler();
  }

  // Programatically navigate to a route.
  router.go = function(route, options) {
    options || (options = {});
    history[options.replace ? 'replaceState' : 'pushState'](null, '', route);

    // Adding a state entry does not trigger the `popstate` window event.
    routeChangeHandler();
  };

  return router;

})();

router.groupedRoutes = (function() {
  let recurse = (prefix, routes, pres) => {
    if (routes.pre) {
      pres = pres.concat([routes.pre]);
    }

    let ret = {};
    for (let route in routes) {
      if (route === 'pre') {
        continue;
      }

      let path = route === 'self' ? prefix : (prefix + route);
      if (routes[route].constructor === Function) {
        //ret[path] = (params) => console.log(path, params, pres.concat([routes[route]]));
        ret[path] = (params) => pres.concat([routes[route]]).every((fn) => fn(params) !== false);
      } else if (route === 'self') {
        throw new TypeError(`groupedRoutes for self on ${path} must be a Function, got ${routes.constructor}`);
      } else if (routes[route].constructor === Object) {
        Object.assign(ret, recurse(path, routes[route], pres));
      } else {
        throw new TypeError(`groupedRoutes for path ${path} expected Function or Object, got ${routes[route].constructor}`);
      }
    }
    return ret;
  };

  return (routes) => {
    if (routes.constructor !== Object) {
      throw new TypeError(`groupedRoutes expected Object, got ${routes.constructor}`);
    }

    return recurse('', routes, []);
  }
})();
