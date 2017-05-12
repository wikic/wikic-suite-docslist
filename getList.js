/* eslint-disable no-underscore-dangle */
const defaultOptions = {
  /**
   * @param {Object} options
   * @return {String} header of sublist
   **/
  headerTemplate({
    level, // Number, level/depth of list
    index, // Number, index in the superlist
    typeName, // String, Mapped type name
    typeSlug, // String, type(dirname)
  }) {
    return `<p id="${level}-${index}" data-type="${typeSlug}">${typeName}</p>`;
  },

  /**
   * @param {Object} options, {sublist, index, typeSlug}
   * @return {String} template to wrap sublist
   **/
  subListTemplate({ sublist }) {
    return `<li>${sublist}</li>`;
  },

  /**
   * @param {Object} options, { title, address, index }
   * @return {String} template of document item link
   **/
  itemTemplate({ title, address }) {
    return `<li><a href="${address}">${title}</a></li>`;
  },

  listTemplate({ header, body }) {
    return `${header}<ul class="docs-list">${body}</ul>`;
  },
};

module.exports = function getList(
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

  const { headerTemplate, subListTemplate, itemTemplate, listTemplate } = options;

  const header = level === 0
    ? ''
    : headerTemplate({
      level,
      index,
      typeSlug,
      typeName: typeMap(typeSlug),
    });

  let body = Object.keys(infoTree)
    .sort()
    .map((newTypeSlug, newIndex) => {
      if (newTypeSlug === '_docs') return '';
      return subListTemplate({
        index: newIndex,
        typeSlug: newTypeSlug,
        sublist: getList(
          typeMap,
          infoTree[newTypeSlug],
          options,
          true,
          newTypeSlug,
          level + 1,
          newIndex
        ),
      });
    })
    .join('');

  if (Array.isArray(infoTree._docs)) {
    body += infoTree._docs
      .map(({ title, address }, idx) =>
        itemTemplate({
          title,
          address,
          index: idx,
        })
      )
      .join('');
  }

  return listTemplate({ header, body });
};
