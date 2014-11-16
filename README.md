# gettext.js

gettext.js is a lightweight yet complete and faithful GNU gettext port for
node and the browser. Manage your i18n translations the right way in your
javascript projects.


## Why another i18n javascript library?

gettext.js aim is to port the famous GNU gettext and ngettext functions to
javascript node and browser applications.
It should be standards respectful and lightweight (no dictionary loading
management, no extra features)

There are plenty good i18n libraries out there, notably
[Jed](https://github.com/SlexAxton/Jed) and [i18n-next](http://i18next.com/),
but either there are too complex and too heavy, or they do not embrace fully the
gettext API and philosophy.

There is also [gettext.js](https://github.com/Orange-OpenSource/gettext.js)
which is pretty good and heavily inspired this one, but not active since 2012
and without any tests.


## Installation

### Node

Install the lib with the following command: `npm install gettext.js --save`

Require it in your project:

```javascript
var i18n = require('gettext.js');
i18n.gettext('foo');
```

### Browser

```html
<script src="/PATH/TO/gettext.js" type="text/javascript"></script>
<script>
  window.i18n.gettext('foo');
</script>
```

## Usage

### Load your messages

### `gettext(msgid)`

Translate a string.

### `ngettext(msgid, msgid_plural, n)`

Translate a pluralizable string

## Supported JSON format

## Parsers

## License

MIT
