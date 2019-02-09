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
    const ifNode = (typeof process !== 'undefined') && (process.release.name === 'node');
    let processRef;

    if (ifNode) {
      processRef = process;
    } else {
      const uncaughtExceptionHandlers = [];
      const originalOnerrorHandler = window.onerror;
      processRef = {};
      processRef.removeListener = function(e, fn){
        if ('uncaughtException' == e) {
          if (originalOnerrorHandler) {
            window.onerror = originalOnerrorHandler;
          } else {
            window.onerror = function() {};
          }
          var i = uncaughtExceptionHandlers.findIndex(f => f === fn);
          if (i != -1) { uncaughtExceptionHandlers.splice(i, 1); }
        }
      };    
      processRef.on = function(e, fn){
        if ('uncaughtException' == e) {
          window.onerror = function(err, url, line){
            fn(new Error(err + ' (' + url + ':' + line + ')'));
            return true;
          };
          uncaughtExceptionHandlers.push(fn);
        }
      };
    }
    const cleanUpError = str => {
      return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }
    const formatError = error => {
      if (error.stack) {
        return error.stack;
      }
      return error.toString();
    }
    const api = {
      data: { text: 'Root', tests: [] }
    };
    let cursor = api.data;
    let report = [];

    const processTests = function (item, level, done) {
      let index = 0;
      (function processTest() {
        if (index < item.tests.length) {
          const test = item.tests[index];
          const uncaught = (error) => {
            console.log(error);
            return true;
          }

          if (test.text !== 'Root') {
            report.push({ test, level });
          }
          
          try {
            cursor = test;
            processRef.on('uncaughtException', uncaught);
            if (test.fn.length === 1) {
              test.fn(() => {
                index += 1;
                processRef.removeListener('uncaughtException', uncaught);
                processTest();
              }); 
            } else {
              test.fn();
              if (test.tests && test.tests.length > 0) {
                processTests(test, level + 1, () => {
                  index += 1;
                  processTest();
                });
              } else {
                index += 1;
                processTest();
              }
              processRef.removeListener('uncaughtException', uncaught);
            }
          } catch(error) {
            test.error = error;
            index++;
            processTest();
          }
        } else {
          done();
        }
      })();
    }

    api.describe = (text, fn) => {
      cursor.tests.push({ text, fn, tests: [] });
    }
    api.it = (text, fn) => {
      cursor.tests.push({ text, fn });
    }
    api.run = () => {
      return new Promise(done => {
        report = [];
        processTests(api.data, 0, () => {
          done(report);
        });
      });
    }
    api.reporters = {
      html(reportData) {
        let html = '';
        html += reportData.map(({ test, level }) => {
          const { text, error, tests } = test;
          const isExercise = !tests;
          if (error) {
            return `<div class="iwork iwork-error iwork-${ level }"><p>&#10006; ${ text }</p><pre>${ cleanUpError(formatError(error)) }</pre></div>`;
          }
          return `<div class="iwork iwork-${ level }"><p>${ isExercise ? '&#10004; ' : ''}${ text }</p></div>`;
        }).join('\n');
        return html;
      }
    }

    return api;
  };
}));