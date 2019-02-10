// import expect from 'expect';

describe('Given something', () => {
  describe('when something is changed', () => {
    it('then it should work', (done) => {
			setTimeout(function () {
        // aaa();
        // expect(1).toBe(2);
        done();
      }, 500);
    });
    it('then it should work', async () => {
			expect(1).toBe(1);
    });
  });
});
describe('Another suite', () => {
  it('should use the spread operator', () => {

  });
});