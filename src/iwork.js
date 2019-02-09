(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
  } else {
    root.iwork = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {  
  return function () {
    const api = {
      data: {
        tests: []
      }
    };
    const desc = (text, fn) => {
      return { text, fn, tests: [] };
    }
    const test = (text, fn) => {
      return { text, fn, report: true };
    }
    let cursor = api.data;

    api.describe = (text, fn) => {
      cursor.tests.push(desc(text, fn));
    }
    api.it = (text, fn) => {
      cursor.tests.push(test(text, fn));
    }
    api.run = () => {
      cursor.tests.forEach(item => {
        if (item.tests) {
          cursor = item;
        }
        item.fn();
        if (item.tests && item.tests.length > 0) {
          api.run();
        }
      });
    }

    return api;
  };
}));