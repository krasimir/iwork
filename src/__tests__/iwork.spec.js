const iwork = require('../iwork');
const e = require('expect');

describe('Given the iwork library', () => {
  it('should nest properly describes and its', () => {
    const { describe: d, it: i, run, data } = iwork();
    
    d('A', () => {
      i('exercise1', () => {

      });
    });

    
    return run().then(() => {
      expect(data).toStrictEqual({
        "text": "Root",
        "tests": [
          {
            "text": "A",
            fn: expect.any(Function),
            "tests": [
              {
                "text": "exercise1",
                fn: expect.any(Function),
              }
            ]
          }
        ]
      })
    });
  });
  it('should nest properly describes and its', () => {
    const { describe: d, it: i, run, data } = iwork();
    
    d('A1', () => {
      d('A2', () => {
        d('A3_1', () => {
          i('exercise1', () => {

          });
        });
        i('exercise2', () => {

        });
      });
    });

    d('B1', () => {
      d('B1', () => {
        i('exercise3', () => {

        });
      });
    });

    // console.log(JSON.stringify(data, null, 2));

    return run().then(() => {
    //   expect(data).toStrictEqual({
    //     "tests": [
    //       {
    //         "text": "given A",
    //         "fn": expect.any(Function),
    //         "tests": [
    //           {
    //             "text": "when A",
    //             "fn": expect.any(Function),
    //             "tests": [
    //               {
    //                 "text": "something else",
    //                 "fn": expect.any(Function),
    //                 "tests": [
    //                   {
    //                     "text": "test",
    //                     "fn": expect.any(Function),
    //                     "report": true
    //                   }
    //                 ]
    //               },
    //               {
    //                 "text": "then A",
    //                 "fn": expect.any(Function),
    //                 "report": true
    //               }
    //             ]
    //           }
    //         ]
    //       },
    //       {
    //         "text": "given B",
    //         "fn": expect.any(Function),
    //         "tests": [
    //           {
    //             "text": "when B",
    //             "fn": expect.any(Function),
    //             "tests": [
    //               {
    //                 "text": "then B",
    //                 "fn": expect.any(Function),
    //                 "report": true
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     ]
    //   });
    });
  });
  it('should run expectations', () => {
    const { describe: d, it: i, run, reporters } = iwork();

    d('Given', () => {
      d('when', () => {
        i('then A', () => {
          e(1).toBe(1);
        });
        i('then B', () => {
          e(1).toBe(2);
        });
      });
    });

    return run().then(report => {
      const html = reporters.html(report);

      e(html).toContain('<div class="iwork iwork-0"><p>Given</p></div>');
      e(html).toContain('<div class="iwork iwork-1"><p>when</p></div>');
      e(html).toContain('<div class="iwork iwork-2"><p>&#10004; then A</p></div>');
      e(html).toContain('<div class="iwork iwork-error iwork-2"><p>&#10006; then B</p>');
    });
  });
  it('should provide the error message and the stack in the html reporter', () => {
    const { describe: d, it: i, run, reporters } = iwork();

    d('Given', () => {
      i('then A', () => {
        var a = {};
        e(a.method()).toBe(1);
      });
    });

    return run().then(report => {
      const html = reporters.html(report);

      expect(html).toContain('<div class="iwork iwork-error iwork-1"><p>&#10006; then A</p><pre>TypeError: a.method is not a function');
    });
  });
  it('should support async tests', () => {
    const { describe: d, it: i, run, reporters } = iwork();
    const spy = jest.fn();

    d('Given', () => {
      i('then A', (done) => {
        setTimeout(() => {
          expect(1).toBe(1);
          spy();
          done();
        });
      });
    });

    return run().then(() => {
      expect(spy).toBeCalled();
    });
  });
  it.skip('should support async tests that fail', () => {
    const { describe: d, it: i, run, reporters } = iwork();
    const spy = jest.fn();

    d('Given', () => {
      i('then A', (done) => {
        setTimeout(() => {
          spy();
          expect(1).toBe(2);
          done();
        }, 20);
      });
    });

    return run().then(() => {
      expect(spy).toBeCalled();
    });
  });                      
});