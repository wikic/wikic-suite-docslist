const getList = require('../getList');

describe('getList', () => {
  const infoTree = {
    a: {
      _docs: [
        { address: '/1.html', title: 'the title1' },
        { address: '/2.html', title: 'the title2' },
      ],
      b: {
        _docs: [
          { address: '/3.html', title: 'the title3' },
          { address: '/4.html', title: 'the title4' },
        ],
        c: { _docs: [{ address: '/5.html', title: 'the title5' }] },
      },
    },
  };

  const wikic = {
    infoTree,
    typeMap(type) {
      return type;
    },
  };

  it('works', () => {
    expect(getList(wikic.typeMap, wikic.infoTree)).toMatch(
      '<a href="/3.html">the title3</a>'
    );
  });

  it('template', () => {
    expect(
      getList(wikic.typeMap, wikic.infoTree, {
        group({ body, typeSlug, index, level, typeName }) {
          return `<li><p data-list="${level}-${index}" data-type="${typeSlug}">${typeName}</p><ul class="docs-list">${body}</ul></li>`;
        },
      })
    ).toMatch('<p data-list="1-0" data-type="a">a</p>');
  });
});
