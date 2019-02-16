const iwork = require('../iwork');
const e = require('expect');

function delay(time) {
  return new Promise(done => {
    setTimeout(done, time);
  })
}

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

    
    return run().then(() => {
      expect(JSON.stringify(data, null, 2)).toEqual(`{
  "text": "Root",
  "tests": [
    {
      "text": "A1",
      "tests": [
        {
          "text": "A2",
          "tests": [
            {
              "text": "A3_1",
              "tests": [
                {
                  "text": "exercise1"
                }
              ]
            },
            {
              "text": "exercise2"
            }
          ]
        }
      ]
    },
    {
      "text": "B1",
      "tests": [
        {
          "text": "B1",
          "tests": [
            {
              "text": "exercise3"
            }
          ]
        }
      ]
    }
  ]
}`);
      
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
  it('should support async tests #2', () => {
    const { describe: d, it: i, run, reporters } = iwork();
    const spy = jest.fn();

    d('Given', () => {
      d('when', () => {
        i('then A', async () => {
          await delay(200);
          spy();
        });
      });
    });

    return run().then(report => {
      expect(spy).toBeCalled();
    });
  });
  it('should continue even if async test fails', () => {
    const { describe: d, it: i, run, reporters } = iwork();
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const logic = async function () {
      await delay(200);
      throw new Error('Ops!');
    }

    d('Given', () => {
      d('when', () => {
        i('then A', async () => {
          spy1();
          await logic();
        });
      });
      d('when 2', () => {
        i('should work', () => {
          spy2();
        });
      });
    });

    return run().then(report => {
      expect(spy1).toBeCalled();
      expect(spy2).toBeCalled();
      expect(report[2].test.error.message).toBe('Ops!');
    });
  });   
});