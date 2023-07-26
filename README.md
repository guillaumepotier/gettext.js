# gettext.js [![npm version](https://badge.fury.io/js/gettext.js.svg)](https://badge.fury.io/js/gettext.js)

gettext.js is a lightweight (3kB minified!) but complete and accurate GNU gettext port for Node.js and the browser.
Manage your i18n translations the right way in your JavaScript projects.

## Why another i18n JavaScript library?

Our aim is to port the famous GNU `gettext` and `ngettext` functions to JavaScript, Node.js and browser applications.

gettext.js should respect existing standards, and be lightweight, so:

- no dictionary loading management
- no extra features

The end-result is a tiny library (less than 200 lines of JavaScript) that implements the `gettext()` and `ngettext()` functions.
We have light JSON translation files: we only embed translated forms, and not much headers.

There are good i18n libraries, like [Jed](https://github.com/SlexAxton/Jed) and [i18n-next](http://i18next.com/).
But they are too complex and too heavy, or they do not fully embrace the gettext API and philosophy.

There's also the [`Orange-OpenSource/gettext.js`](https://github.com/Orange-OpenSource/gettext.js) package, which is pretty good, we were inspired by that project.
But that project has not been active since 2012 and doesn't have any tests.

## Installation

### Debian 9, codename Stretch

```bash
apt-get install libjs-gettext.js
```

### Node.js

1. Install the library with this command: `npm install gettext.js --save`
1. Require it in your project:
   ```javascript
   var i18n = require("gettext.js")();
   i18n.gettext("foo");
   ```

#### Third-party TypeScript definitions

For TypeScript definitions, use the third-party `@types/gettext.js` module.

### Browser

#### Get the archive

Download the latest [archive](https://github.com/guillaumepotier/gettext.js/archive/master.zip).

### Get it with Bower

1. `bower install gettext.js --save`

```html
<script src="/path/to/dist/gettext.iife.js" type="text/javascript"></script>
<script>
  var i18n = window.i18n(options);
  i18n.gettext("foo");
</script>
```

#### Alternatives to IFFE version

As well as the IIFE (Immediately Invoked Function Expression) version, we also have releases for:

- CommonJS for Node.js
- AMD
- ESM

#### Using a npm CDN

Instead of downloading `gettext.js`, you may use a npm CDN like unpkg or jsDelivr.

## Usage

### Load your messages

You can load your messages like this:

```javascript
// i18n.setMessages(domain, locale, messages, plural_form);
i18n.setMessages(
  "messages",
  "fr",
  {
    Welcome: "Bienvenue",
    "There is %1 apple": ["Il y a %1 pomme", "Il y a %1 pommes"],
  },
  "nplurals=2; plural=n>1;"
);
```

Or:

```javascript
// i18n.loadJSON(jsonData /*, domain */);
var json = {
  "": {
    language: "fr",
    "plural-forms": "nplurals=2; plural=n>1;",
  },
  Welcome: "Bienvenue",
  "There is %1 apple": ["Il y a %1 pomme", "Il y a %1 pommes"],
};
i18n.loadJSON(json, "messages");
```

Read the _Required JSON format_ section below for more info.

### Set the locale

#### In the DOM

You can set your `locale` in the DOM, like this:

```html
<html lang="fr"></html>
```

#### With JavaScript

Or use JavaScript:

```javascript
i18n.setLocale("fr");
```

### Gettext functions

| Name                                                   | Description                                                                                                                                                         | Shorthand |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `gettext(msgid)`                                       | Translate a string.                                                                                                                                                 | `__()`    |
| `ngettext(msgid, msgid_plural, n)`                     | Translate a pluralizable string.                                                                                                                                    | `_n()`    |
| `pgettext(msgctxt, msgid)`                             | Translate a string specified by context.                                                                                                                            | `_p()`    |
| `dcnpgettext(domain, msgctxt, msgid, msgid_plural, n)` | Translate a potentially pluralizable string, potentially specified by context, and potentially of a different domain (as specified in `setMessages` or `loadJSON`). | None.     |


### Plural forms

`ngettext` and `dcnpgettext` accept a `n` parameter to specify the plural form.

```javascript
i18n.ngettext('There is an apple', 'There are many apples', 1); // There is an apple
i18n.ngettext('There is an apple', 'There are many apples', 10); // There are many apples
i18n.ngettext('There is %1 apple', 'There are %1 apples', 10); // There are %1 apples
i18n.ngettext('There is %1 apple', 'There are %1 apples', 10, 10); // There are 10 apples
```

### Variabilized strings

All four functions above can take extra arguments for variablization.

`gettext('There are %1 in the %2', 'apples', 'bowl');` -> "There are apples in the bowl

`ngettext('One %2', '%1 %2', 10, 10, 'bananas');` -> "10 bananas"

It uses the public method `i18n.strfmt("string", var1, var2, ...)` which you may re-use elsewhere in your project.


#### Literal percent sign (%)

When you need to have literal percent sign followed by a number (common in Hebrew or Turkish) you can escape it using another percent sign, for example:

`gettext('My credit card has an interest rate of %%%1', 20);` -> "My credit card has an interest rate of %20"

Or without variables:

`gettext('My credit card has an interest rate of %%20');` -> "My credit card has an interest rate of %20"

## Required JSON format

You'll find in `/bin` a `po2json.js` converter, based on the excellent [po2json](https://github.com/mikeedwards/po2json) project that will dump your `.po` files into the proper JSON format below:

```json
{
  "": {
    "language": "en",
    "plural-forms": "nplurals=2; plural=(n!=1);"
  },
  "simple key": "It's translation",
  "another with %1 parameter": "It's %1 translation",
  "a key with plural": [
    "a plural form",
    "another plural form",
    "could have up to 6 forms with some languages"
  ],
  "a context\u0004a contextualized key": "translation here"
}
```

### Pretty formatting

Use `bin/po2json.js input.po output.json` or `bin/po2json.js input.po output.json -p` for pretty format.

## Parsers

You may use the [xgettext-php](https://github.com/Wisembly/xgettext-php) parser to parse your files.
It has helpful JavaScript and Handlebars parsers.

## License

MIT
