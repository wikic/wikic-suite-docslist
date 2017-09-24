/* eslint-disable no-underscore-dangle */
module.exports = getList;

const defaultOptions = {
  /**
   * @param {Object} opts
   * @param {string} opts.title
   * @param {string} opts.address
   * @param {number} opts.index
   * @param {number} opts.level
   * @return {string}
   **/
  item(opts) {
    const { title, address } = opts;
    return `<li><a href="${address}">${title}</a></li>`;
  },

  /**
   * @param {Object} opts
   * @param {string} opts.body
   * @param {string} opts.typeSlug type(dirname)
   * @param {string} opts.typeName mapped type slug
   * @param {number} opts.index
   * @param {number} opts.level
   * @return {string}
   **/
  group(opts) {
    const { body, typeSlug, typeName, index, level } = opts;
    return `<li><p id="${level}-${index}" data-type="${typeSlug}">${typeName}</p><ul>${body}</ul></li>`;
  },

  /**
   * @param {Object} opts
   * @param {string} opts.body
   * @return {string}
   **/
  tree(opts) {
    const { body } = opts;
    return `<ul>${body}</ul>`;
  },
};

/**
 * @typedef {Object} TreeItem
 * @property {string} title
 * @property {string} address
 */

/**
 * @typedef {Object} TreeBase
 * @property {TreeItem[]} _docs
 * @property {TreeBase} x
 */

/**
 * @typedef {Object} Tree
 * @property {TreeItem[]} _docs
 * @property {TreeBase} x
 */

/**
 * @param {Function} typeMap
 * @param {Tree} infoTree
 * @param {Object} opts
 * @param {Function} [opts.tree]
 * @param {Function} [opts.group]
 * @param {Function} [opts.item]
 * @param {boolean} [set=false]
 * @param {string} [typeSlug=.]
 * @param {number} [level=0]
 * @param {number} [index=-1]
 * @return {string}
 **/
function getList(
  typeMap,
  infoTree,
  opts,
  set = false,
  typeSlug = '.',
  level = 0,
  index = -1
) {
  if (!infoTree) return '';
  let options;

  if (!set) {
    options = Object.assign({}, defaultOptions, opts);
  } else {
    options = opts;
  }

  const { item, group, tree } = options;

  let body = Object.keys(infoTree)
    .sort()
    .map((newTypeSlug, newIndex) => {
      if (newTypeSlug === '_docs') return '';
      return getList(
        typeMap,
        infoTree[newTypeSlug],
        options,
        true,
        newTypeSlug,
        level + 1,
        newIndex
      );
    })
    .join('');

  if (Array.isArray(infoTree._docs)) {
    body += infoTree._docs
      .map(({ title, address }, _index) =>
        item({
          title,
          address,
          level,
          index: _index,
        })
      )
      .join('');
  }

  if (level === 0) return tree({ body });
  return group({ body, typeSlug, index, level, typeName: typeMap(typeSlug) });
}
