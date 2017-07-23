const docslistSuite = require('..');

test('beforeBuildDocs', () => {
  const config = {
    docslist: {
      enable: true,
    },
  };
  const suiteObj = docslistSuite(config, { config });
  const { beforeBuildDocs } = suiteObj;
  beforeBuildDocs();
  expect(suiteObj.infoTree).toBeFalsy();
});

describe('beforeRender', () => {
  const config = {
    docslist: {
      enable: true,
    },
  };
  const suiteObj = docslistSuite(config, { config });
  const { beforeRender } = suiteObj;
  suiteObj.list = 'something';

  it('returns origin context if IS_DOC is not true', () => {
    const context = {};
    const actual = beforeRender(context);
    expect(actual).toBe(context);
    expect(actual).toEqual({});
  });

  it('add docslist.list to renderContext', () => {
    const context = { IS_DOC: true };
    const actual = beforeRender(context);
    expect(actual.renderContext.list).toEqual(suiteObj.list);
  });
});

test('afterReadAllDocs', () => {
  const config = {
    docslist: {
      enable: true,
    },
  };
  const suiteObj = docslistSuite(config, { config });
  const { afterReadAllDocs } = suiteObj;
  suiteObj.list = undefined;
  suiteObj.infoTree = null;
  afterReadAllDocs({});
  expect(suiteObj.list).toBe('');
});
