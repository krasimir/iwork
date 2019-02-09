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
    const cleanUpError = str => {
      return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }
    const formatError = error => {
      return `${ error.toString() }` + (error.stack ? `\n\n${ error.stack }` : '');
    }
    const api = {
      report: [],
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

    const processTests = (level = 0) => {
      cursor.tests.forEach(item => {
        if (item.tests) {
          cursor = item;
        }
        let report = { text: item.text, level, report: item.report };
        try {
          item.fn();
        } catch(error) {
          report.error = error;
        }
        api.report.push(report);
        if (item.tests && item.tests.length > 0) {
          processTests(level + 1);
        }
      });
    }

    api.describe = (text, fn) => {
      cursor.tests.push(desc(text, fn));
    }
    api.it = (text, fn) => {
      cursor.tests.push(test(text, fn));
    }
    api.run = () => {
      cursor = api.data;
      api.report = [];
      return new Promise(done => {
        processTests();
        done(api.report);
      });
    }
    api.reporters = {
      html(report) {
        let html = '';
        html += report.map(({ text, level, error, report: r }) => {
          if (error) {
            return `<div class="iwork iwork-error iwork-${ level }"><p>&#10006; ${ text }</p><pre>${ cleanUpError(formatError(error)) }</pre></div>`;
          }
          return `<div class="iwork iwork-${ level }"><p>${ r ? '&#10004; ' : ''}${ text }</p></div>`;
        }).join('\n');
        return html;
      }
    }

    return api;
  };
}));