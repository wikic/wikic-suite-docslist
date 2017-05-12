# wikic-suite-docslist

[![Build Status][build-badge]][build]
[![Coveralls][coverage-badge]][coverage]
[![version][version-badge]][package]

A suite for wikic, add `list` variable to nunjucks context, which content docs links of sites.

## Installation

``` bash
$ npm install --save wikic-suite-docslist
```

## Usage

**In `wikic.config.js`**

``` js
module.exports = {
  suites: [require('wikic-suite-docslist')]
  docslist: {
    enable: true,
    listTemplate: {
      headerTemplate: ({
        level,
        index,
        typeName,
        typeSlug,
      }) => `<label for="${level}-${index}">${typeName}</label>
<input type="checkbox" id="${level}-${index}" data-type="${typeSlug}">`,
    }
  }
}
```

See also `docslist.listTemplate`'s default value: [getList.js](getList.js)

**In layout for docs**

``` njk
<aside>
{{ list | safe }}
<aside/>
```

## LICENSE

[MIT](LICENCE)

[coverage]: https://coveralls.io/github/wikic/wikic-suite-docslist
[coverage-badge]: https://img.shields.io/coveralls/wikic/wikic-suite-docslist.svg
[build]: https://travis-ci.org/wikic/wikic-suite-docslist
[build-badge]: https://travis-ci.org/wikic/wikic-suite-docslist.svg?branch=master
[version-badge]: https://img.shields.io/npm/v/wikic-suite-docslist.svg
[package]: https://www.npmjs.com/package/wikic-suite-docslist
