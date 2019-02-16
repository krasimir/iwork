# &lt;code>: I work

* A micro testing framework for the browser. Only 2.1Kb.
* Bare minimum API (`describe`, `it`, `run` and HTML reporter)

🤘 [Demo](https://poet.codes/e/XDXZ41QnYCK#tester.js)

## Setup

* `<script src="https://unpkg.com/iwork"></script>`
* `yarn install iwork`

## Example:

```js
const { describe, it, run, reporters } = iwork();

describe('Given something', () => {
  describe('when something is changed', () => {
    it('then it should work', () => {
			expect(1).toBe(1);
    });
  });
});

run().then(report => {
  document.querySelector('#output').innerHTML = reporters.html(report);
});
```

Notice that iwork does not come with assertion library. The example above uses `expect` which I got from [here](https://www.npmjs.com/package/expect). It works in the browser too from [this](https://unpkg.com/expect@%3C21/umd/expect.min.js) URL.