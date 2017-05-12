/* eslint-disable no-param-reassign, no-underscore-dangle */

const getList = require('./getList');

const docsList = (config) => {
  if (!(config.docsList && config.docsList.enable)) return null;

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
    const getListOpt = this.config.docsList ? this.config.docsList.listTemplate : null;
    self.list = getList(this.typeMap, self.infoTree, getListOpt);
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

module.exports = docsList;
