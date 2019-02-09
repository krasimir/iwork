const iwork = require('../iwork');

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
    const { describe: d, it: i, run, data } = iwork();

    d('Given', () => {
      d('when', () => {
        i('then', () => {
          
        });
      });
    });
  });
});