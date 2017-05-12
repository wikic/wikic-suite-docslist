const docslistSuite = require('..');

const docslist = docslistSuite({
  docslist: {
    enable: true,
  },
});

const { afterRead: collectInfo, beforeBuildDocs, beforeRender, afterReadAllDocs } = docslist;

describe('docslist.afterRead: collectInfo', () => {
  beforeEach(() => {
    beforeBuildDocs();
  });

  it('should save property into context', () => {
    const result = collectInfo({
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
    collectInfo({
      IS_DOC: true,
      page: {
        title: 'the title',
        hide: true,
        address: '/1.html',
        types: ['a', 'b', 'c'],
      },
    });
    expect(docslist.infoTree).toBeFalsy();
  });

  it("should throw if can'n find context.page", () => {
    expect(() => {
      collectInfo({
        IS_DOC: true,
      });
    }).toThrow();
  });

  it('should fill info into infoTree', () => {
    collectInfo({
      IS_DOC: true,
      page: {
        title: 'the title',
        address: '/1.html',
        types: ['a', 'b', 'c'],
      },
    });
    collectInfo({
      IS_DOC: true,
      page: {
        title: 'another',
        address: '/2.html',
        types: ['a', 'b', 'd'],
      },
    });
    expect(docslist.infoTree).toEqual({
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
    docslist.infoTree = {};
    expect(
      collectInfo({
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
    expect(docslist.infoTree).toEqual({});
  });
});

describe('docslist', () => {
  it('returns null if option is falsy', () => {
    expect(docslistSuite({ docslist: false })).toBeFalsy();
  });

  test('beforeBuildDocs', () => {
    beforeBuildDocs();
    expect(docslist.infoTree).toBeFalsy();
  });

  describe('beforeRender', () => {
    beforeAll(() => {
      docslist.list = 'something';
    });

    it('returns origin context if IS_DOC is not true', () => {
      const wikic = {};
      const context = {};
      const actual = beforeRender.call(wikic, context);
      expect(actual).toBe(context);
      expect(actual).toEqual({});
    });

    it('add docslist.list to renderContext', () => {
      const wikic = {};
      const context = { IS_DOC: true };
      const actual = beforeRender.call(wikic, context);
      expect(actual.renderContext.list).toEqual(docslist.list);
    });
  });

  describe('afterReadAllDocs', () => {
    it('invokes getList', () => {
      docslist.list = undefined;
      docslist.infoTree = null;
      const wikic = { config: {} };
      afterReadAllDocs.call(wikic, {});
      expect(docslist.list).toBe('');
    });
  });
});
