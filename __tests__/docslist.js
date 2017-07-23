const docslistSuite = require('..');

it('returns null if option is falsy', () => {
  expect(docslistSuite({ docslist: false })).toBeFalsy();
});
