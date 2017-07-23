/* eslint-disable no-param-reassign, no-underscore-dangle */

const getList = require('./getList');

const docslist = (config, wikic) => {
  if (!(config.docslist && config.docslist.enable)) return null;

  const self = {};

  self.beforeBuildDocs = function beforeBuildDocs() {
    self.infoTree = null;
  };

  self.beforeRender = function beforeRender(context) {
    if (!context.IS_DOC) return context;
    const list = self.list;
    const { renderContext: oldRenderContext } = context;
    const renderContext = Object.assign({}, oldRenderContext, { list });
    return Object.assign(context, { renderContext });
  };

  self.afterReadAllDocs = function afterReadAllDocs() {
    self.list = getList(
      wikic.typeMap,
      self.infoTree,
      wikic.config.docslist.listTemplate
    );
  };

  self.afterRead = function collectInfo(context) {
    if (!context.IS_DOC) return context;

    const { page } = context;
    if (!page) {
      throw Error('expect context to be a Object');
    }
    const { types, address, title, hide } = page;

    if (hide) return context;

    const info = {
      address,
      title,
    };

    if (!self.infoTree) self.infoTree = {};
    types.reduce((parent, type, index, arr) => {
      if (!parent[type]) {
        parent[type] = { _docs: [] };
      }
      if (index === arr.length - 1) {
        parent[type]._docs.push(info);
      }
      return parent[type];
    }, self.infoTree);

    return context;
  };
  return self;
};

module.exports = docslist;
