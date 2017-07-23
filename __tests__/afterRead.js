const docslistSuite = require('..');

const config = {
  docslist: {
    enable: true,
  },
};
const suiteObj = docslistSuite(config, { config });

const { afterRead, beforeBuildDocs } = suiteObj;

describe('afterRead: collectInfo', () => {
  beforeEach(() => {
    beforeBuildDocs();
  });

  it('should save property into context', () => {
    const result = afterRead({
      IS_DOC: true,
      page: {
        title: 'the title',
        address: '/1.html',
        types: ['a', 'b', 'c'],
      },
      otherKey: true,
    });
    expect(result.otherKey).toBeTruthy();
  });

  it('should not add info if page.hide is true', () => {
    afterRead({
      IS_DOC: true,
      page: {
        title: 'the title',
        hide: true,
        address: '/1.html',
        types: ['a', 'b', 'c'],
      },
    });
    expect(suiteObj.infoTree).toBeFalsy();
  });

  it("should throw if can'n find context.page", () => {
    expect(() => {
      afterRead({
        IS_DOC: true,
      });
    }).toThrow();
  });

  it('should fill info into infoTree', () => {
    afterRead({
      IS_DOC: true,
      page: {
        title: 'the title',
        address: '/1.html',
        types: ['a', 'b', 'c'],
      },
    });
    afterRead({
      IS_DOC: true,
      page: {
        title: 'another',
        address: '/2.html',
        types: ['a', 'b', 'd'],
      },
    });
    expect(suiteObj.infoTree).toEqual({
      a: {
        _docs: [],
        b: {
          _docs: [],
          c: { _docs: [{ address: '/1.html', title: 'the title' }] },
          d: { _docs: [{ address: '/2.html', title: 'another' }] },
        },
      },
    });
  });

  it('should do nothing if IS_DOC not true', () => {
    suiteObj.infoTree = {};
    expect(
      afterRead({
        page: {
          title: 'the title',
          address: '/1.html',
          types: ['a', 'b', 'c'],
        },
      })
    ).toEqual({
      page: {
        title: 'the title',
        address: '/1.html',
        types: ['a', 'b', 'c'],
      },
    });
    expect(suiteObj.infoTree).toEqual({});
  });
});
