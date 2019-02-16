# &lt;developer>: Hey code, are you broken?<br />&lt;code>: I work<br />&lt;developer>: prove it!<br />&lt;code>: hold my beer 🍺

* A micro testing framework for the browser. Only 2.1Kb.
* Bare minimum API (`describe`, `it`, `run` and HTML reporter)

🤘 [Demo](https://poet.codes/e/XDXZ41QnYCK#tester.js)

## Why I've made it

* There are not so many options for running tests client-side.
* I needed something simple as setup which I have full control of. And by control I mean (a) when and how to run the tests and (b) when and how to display the results of the tests. Frameworks like Mocha for example make some assumptions on the content of your page and are not so flexible in terms of rendering the test results.

## Setup

* `<script src="https://unpkg.com/iwork"></script>`
* `yarn install iwork`
* Use [`iwork.min.js`](https://github.com/krasimir/iwork/blob/master/iwork.min.js) directly

## Example:

```js
<script src="https://unpkg.com/iwork"></script>
<script>
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
</script>
```

Notice that iwork does not come with assertion library. The example above uses `expect` which I got from [here](https://www.npmjs.com/package/expect). It works in the browser too from [this](https://unpkg.com/expect@%3C21/umd/expect.min.js) URL.