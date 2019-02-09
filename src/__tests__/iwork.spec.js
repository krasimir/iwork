const iwork = require('../iwork');
const expect = require('expect');

describe('Given the iwork library', () => {
  it('should nest properly describes and its', () => {
    const { describe: d, it: i, run, data } = iwork();
    
    d('given A', () => {
      d('when A', () => {
        d('something else', () => {
          i('test', () => {

          });
        });
        i('then A', () => {

        });
      });
    });

    d('given B', () => {
      d('when B', () => {
        i('then B', () => {

        });
      });
    });

    run();
    expect(data).toStrictEqual({
      "tests": [
        {
          "text": "given A",
          "fn": expect.any(Function),
          "tests": [
            {
              "text": "when A",
              "fn": expect.any(Function),
              "tests": [
                {
                  "text": "something else",
                  "fn": expect.any(Function),
                  "tests": [
                    {
                      "text": "test",
                      "fn": expect.any(Function),
                      "report": true
                    }
                  ]
                },
                {
                  "text": "then A",
                  "fn": expect.any(Function),
                  "report": true
                }
              ]
            }
          ]
        },
        {
          "text": "given B",
          "fn": expect.any(Function),
          "tests": [
            {
              "text": "when B",
              "fn": expect.any(Function),
              "tests": [
                {
                  "text": "then B",
                  "fn": expect.any(Function),
                  "report": true
                }
              ]
            }
          ]
        }
      ]
    });
  });
  it('should run expectations', () => {
    const { describe: d, it: i, run, reporters } = iwork();

    d('Given', () => {
      d('when', () => {
        i('then A', () => {
          expect(1).toBe(1);
        });
        i('then B', () => {
          expect(1).toBe(2);
        });
      });
    });

    return run().then(report => {
      expect(reporters.html(report)).toBe(`<div class="iwork iwork-0"><p>Given</p></div>
<div class="iwork iwork-1"><p>when</p></div>
<div class="iwork iwork-2"><p>&#10004; then A</p></div>
<div class="iwork iwork-error iwork-2"><p>&#10006; then B</p><pre>Error: expect(received).toBe(expected) // Object.is equality

Expected: 2
Received: 1</pre></div>`);
    });
  });
});