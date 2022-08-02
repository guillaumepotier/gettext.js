/*! gettext.js - Guillaume Potier - MIT Licensed */
var i18n = function (options) {
 options = options || {};
 this && (this.__version = '1.1.1');

 // default values that could be overriden in i18n() construct
 var defaults = {
   domain: 'messages',
   locale: (typeof document !== 'undefined' ? document.documentElement.getAttribute('lang') : false) || 'en',
   plural_func: function (n) { return { nplurals: 2, plural: (n!=1) ? 1 : 0 }; },
   ctxt_delimiter: String.fromCharCode(4) // \u0004
 };

 // handy mixins taken from underscode.js
 var _ = {
   isObject: function (obj) {
     var type = typeof obj;
     return type === 'function' || type === 'object' && !!obj;
   },
   isArray: function (obj) {
     return toString.call(obj) === '[object Array]';
   }
 };

 var
   _plural_funcs = {},
   _locale = options.locale || defaults.locale,
   _domain = options.domain || defaults.domain,
   _dictionary = {},
   _plural_forms = {},
   _ctxt_delimiter = options.ctxt_delimiter || defaults.ctxt_delimiter;

   if (options.messages) {
     _dictionary[_domain] = {};
     _dictionary[_domain][_locale] = options.messages;
   }

   if (options.plural_forms) {
     _plural_forms[_locale] = options.plural_forms;
   }
 
   // language codes / language names associative arrays
   // Generated from https://github.com/unicode-org/cldr
   var _languageNames = {"af": "Afrikaans", "agq": "Aghem", "ak": "Akan", "am": "\u12a0\u121b\u122d\u129b", "ar": "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", "as": "\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be", "asa": "Kipare", "ast": "Asturianu", "az": "Az\u0259rbaycan", "bas": "\u0181\u00e0s\u00e0a", "be": "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f", "bem": "Ichibemba", "bez": "Hibena", "bg": "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438", "bm": "Bamanakan", "bn": "\u09ac\u09be\u0982\u09b2\u09be", "bo": "\u0f56\u0f7c\u0f51\u0f0b\u0f66\u0f90\u0f51\u0f0b", "br": "Brezhoneg", "brx": "\u092c\u0930\u2019", "bs": "Bosanski", "ca": "Catal\u00e0", "ccp": "\ud804\udd0c\ud804\udd0b\ud804\udd34\ud804\udd1f\ud804\udd33\ud804\udd26", "ce": "\u041d\u043e\u0445\u0447\u0438\u0439\u043d", "ceb": "Binisaya", "cgg": "Rukiga", "chr": "\u13e3\uab83\uab79", "ckb": "\u06a9\u0648\u0631\u062f\u06cc\u06cc \u0646\u0627\u0648\u06d5\u0646\u062f\u06cc", "cs": "\u010ce\u0161tina", "cy": "Cymraeg", "da": "Dansk", "dav": "Kitaita", "de": "Deutsch", "dje": "Zarmaciine", "doi": "\u0921\u094b\u0917\u0930\u0940", "dsb": "Dolnoserb\u0161\u0107ina", "dua": "Du\u00e1l\u00e1", "dyo": "Joola", "dz": "\u0f62\u0fab\u0f7c\u0f44\u0f0b\u0f41", "ebu": "K\u0129embu", "ee": "E\u028begbe", "el": "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac", "en": "English", "eo": "Esperanto", "es": "Espa\u00f1ol", "et": "Eesti", "eu": "Euskara", "ewo": "Ewondo", "fa": "\u0641\u0627\u0631\u0633\u06cc", "ff": "Pulaar", "fi": "Suomi", "fil": "Filipino", "fo": "F\u00f8royskt", "fr": "Fran\u00e7ais", "fur": "Furlan", "fy": "Frysk", "ga": "Gaeilge", "gd": "G\u00e0idhlig", "gl": "Galego", "gsw": "Schwiizert\u00fc\u00fctsch", "gu": "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", "guz": "Ekegusii", "gv": "Gaelg", "ha": "Hausa", "haw": "\u02bb\u014dlelo hawai\u02bbi", "he": "\u05e2\u05d1\u05e8\u05d9\u05ea", "hi": "\u0939\u093f\u0928\u094d\u0926\u0940", "hr": "Hrvatski", "hsb": "Hornjoserb\u0161\u0107ina", "hu": "Magyar", "hy": "\u0540\u0561\u0575\u0565\u0580\u0565\u0576", "ia": "Interlingua", "id": "Indonesia", "ig": "Igbo", "ii": "\ua188\ua320\ua259", "is": "\u00cdslenska", "it": "Italiano", "ja": "\u65e5\u672c\u8a9e", "jgo": "Nda\ua78ca", "jmc": "Kimachame", "jv": "Jawa", "ka": "\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8", "kab": "Taqbaylit", "kam": "Kikamba", "kde": "Chimakonde", "kea": "Kabuverdianu", "kgp": "Kanhg\u00e1g", "khq": "Koyra ciini", "ki": "Gikuyu", "kk": "\u049a\u0430\u0437\u0430\u049b \u0442\u0456\u043b\u0456", "kkj": "Kak\u0254", "kl": "Kalaallisut", "kln": "Kalenjin", "km": "\u1781\u17d2\u1798\u17c2\u179a", "kn": "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1", "ko": "\ud55c\uad6d\uc5b4", "kok": "\u0915\u094b\u0902\u0915\u0923\u0940", "ks": "\u06a9\u0672\u0634\u064f\u0631", "ksb": "Kishambaa", "ksf": "Rikpa", "ksh": "K\u00f6lsch", "ku": "Kurd\u00ee", "kw": "Kernewek", "ky": "\u041a\u044b\u0440\u0433\u044b\u0437\u0447\u0430", "lag": "K\u0268laangi", "lb": "L\u00ebtzebuergesch", "lg": "Luganda", "lkt": "Lak\u021f\u00f3l\u02bciyapi", "ln": "Ling\u00e1la", "lo": "\u0ea5\u0eb2\u0ea7", "lrc": "\u0644\u06ca\u0631\u06cc \u0634\u0648\u0645\u0627\u0644\u06cc", "lt": "Lietuvi\u0173", "lu": "Tshiluba", "luo": "Dholuo", "luy": "Luluhia", "lv": "Latvie\u0161u", "mai": "\u092e\u0948\u0925\u093f\u0932\u0940", "mas": "Maa", "mer": "K\u0129m\u0129r\u0169", "mfe": "Kreol morisien", "mg": "Malagasy", "mgh": "Makua", "mgo": "Meta\u02bc", "mi": "Te reo m\u0101ori", "mk": "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438", "ml": "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02", "mn": "\u041c\u043e\u043d\u0433\u043e\u043b", "mni": "\u09ae\u09c8\u09a4\u09c8\u09b2\u09cb\u09a8\u09cd", "mr": "\u092e\u0930\u093e\u0920\u0940", "ms": "Melayu", "mt": "Malti", "mua": "Munda\u014b", "my": "\u1019\u103c\u1014\u103a\u1019\u102c", "mzn": "\u0645\u0627\u0632\u0631\u0648\u0646\u06cc", "naq": "Khoekhoegowab", "nd": "Isindebele", "nds": "Neddersass\u2019sch", "ne": "\u0928\u0947\u092a\u093e\u0932\u0940", "nl": "Nederlands", "nmg": "Kwasio", "nnh": "Shw\u00f3\u014b\u00f2 ngiemb\u0254\u0254n", "no": "Norsk", "nus": "Thok nath", "nyn": "Runyankore", "om": "Oromoo", "or": "\u0b13\u0b21\u0b3c\u0b3f\u0b06", "os": "\u0418\u0440\u043e\u043d", "pa": "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", "pcm": "Naij\u00edri\u00e1 p\u00edjin", "pl": "Polski", "ps": "\u067e\u069a\u062a\u0648", "pt": "Portugu\u00eas", "qu": "Runasimi", "rm": "Rumantsch", "rn": "Ikirundi", "ro": "Rom\u00e2n\u0103", "rof": "Kihorombo", "ru": "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", "rw": "Kinyarwanda", "rwk": "Kiruwa", "sa": "\u0938\u0902\u0938\u094d\u0915\u0943\u0924 \u092d\u093e\u0937\u093e", "sah": "\u0421\u0430\u0445\u0430 \u0442\u044b\u043b\u0430", "saq": "Kisampur", "sat": "\u1c65\u1c5f\u1c71\u1c5b\u1c5f\u1c72\u1c64", "sbp": "Ishisangu", "sc": "Sardu", "sd": "\u0633\u0646\u068c\u064a", "se": "Davvis\u00e1megiella", "seh": "Sena", "ses": "Koyraboro senni", "sg": "S\u00e4ng\u00f6", "shi": "\u2d5c\u2d30\u2d5b\u2d4d\u2d43\u2d49\u2d5c", "si": "\u0dc3\u0dd2\u0d82\u0dc4\u0dbd", "sk": "Sloven\u010dina", "sl": "Sloven\u0161\u010dina", "smn": "Anar\u00e2\u0161kiel\u00e2", "sn": "Chishona", "so": "Soomaali", "sq": "Shqip", "sr": "\u0421\u0440\u043f\u0441\u043a\u0438", "su": "Basa sunda", "sv": "Svenska", "sw": "Kiswahili", "ta": "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", "te": "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", "teo": "Kiteso", "tg": "\u0422\u043e\u04b7\u0438\u043a\u04e3", "th": "\u0e44\u0e17\u0e22", "ti": "\u1275\u130d\u122d\u129b", "tk": "T\u00fcrkmen dili", "to": "Lea fakatonga", "tr": "T\u00fcrk\u00e7e", "tt": "\u0422\u0430\u0442\u0430\u0440", "twq": "Tasawaq senni", "tzm": "Tamazi\u0263t n la\u1e6dla\u1e63", "ug": "\u0626\u06c7\u064a\u063a\u06c7\u0631\u0686\u06d5", "uk": "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430", "ur": "\u0627\u0631\u062f\u0648", "uz": "O\u2018zbek", "vai": "\ua559\ua524", "vi": "Ti\u1ebfng vi\u1ec7t", "vun": "Kyivunjo", "wae": "Walser", "wo": "Wolof", "xh": "Isixhosa", "xog": "Olusoga", "yav": "Nuasue", "yi": "\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9", "yo": "\u00c8d\u00e8 yor\u00f9b\u00e1", "yrl": "Nhe\u1ebdgatu", "yue": "\u4e2d\u6587 (\u7cb5\u8a9e)", "zgh": "\u2d5c\u2d30\u2d4e\u2d30\u2d63\u2d49\u2d56\u2d5c", "zh": "\u666e\u901a\u8bdd", "zu": "Isizulu"};
   var _languageCodes= {"Afrikaans": "af", "Aghem": "agq", "Akan": "ak", "\u12a0\u121b\u122d\u129b": "am", "\u0627\u0644\u0639\u0631\u0628\u064a\u0629": "ar", "\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be": "as", "Kipare": "asa", "Asturianu": "ast", "Az\u0259rbaycan": "az", "\u0181\u00e0s\u00e0a": "bas", "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f": "be", "Ichibemba": "bem", "Hibena": "bez", "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438": "bg", "Bamanakan": "bm", "\u09ac\u09be\u0982\u09b2\u09be": "bn", "\u0f56\u0f7c\u0f51\u0f0b\u0f66\u0f90\u0f51\u0f0b": "bo", "Brezhoneg": "br", "\u092c\u0930\u2019": "brx", "Bosanski": "bs", "Catal\u00e0": "ca", "\ud804\udd0c\ud804\udd0b\ud804\udd34\ud804\udd1f\ud804\udd33\ud804\udd26": "ccp", "\u041d\u043e\u0445\u0447\u0438\u0439\u043d": "ce", "Binisaya": "ceb", "Rukiga": "cgg", "\u13e3\uab83\uab79": "chr", "\u06a9\u0648\u0631\u062f\u06cc\u06cc \u0646\u0627\u0648\u06d5\u0646\u062f\u06cc": "ckb", "\u010ce\u0161tina": "cs", "Cymraeg": "cy", "Dansk": "da", "Kitaita": "dav", "Deutsch": "de", "Zarmaciine": "dje", "\u0921\u094b\u0917\u0930\u0940": "doi", "Dolnoserb\u0161\u0107ina": "dsb", "Du\u00e1l\u00e1": "dua", "Joola": "dyo", "\u0f62\u0fab\u0f7c\u0f44\u0f0b\u0f41": "dz", "K\u0129embu": "ebu", "E\u028begbe": "ee", "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac": "el", "English": "en", "Esperanto": "eo", "Espa\u00f1ol": "es", "Eesti": "et", "Euskara": "eu", "Ewondo": "ewo", "\u0641\u0627\u0631\u0633\u06cc": "fa", "Pulaar": "ff", "Suomi": "fi", "Filipino": "fil", "F\u00f8royskt": "fo", "Fran\u00e7ais": "fr", "Furlan": "fur", "Frysk": "fy", "Gaeilge": "ga", "G\u00e0idhlig": "gd", "Galego": "gl", "Schwiizert\u00fc\u00fctsch": "gsw", "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0": "gu", "Ekegusii": "guz", "Gaelg": "gv", "Hausa": "ha", "\u02bb\u014dlelo hawai\u02bbi": "haw", "\u05e2\u05d1\u05e8\u05d9\u05ea": "he", "\u0939\u093f\u0928\u094d\u0926\u0940": "hi", "Hrvatski": "hr", "Hornjoserb\u0161\u0107ina": "hsb", "Magyar": "hu", "\u0540\u0561\u0575\u0565\u0580\u0565\u0576": "hy", "Interlingua": "ia", "Indonesia": "id", "Igbo": "ig", "\ua188\ua320\ua259": "ii", "\u00cdslenska": "is", "Italiano": "it", "\u65e5\u672c\u8a9e": "ja", "Nda\ua78ca": "jgo", "Kimachame": "jmc", "Jawa": "jv", "\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8": "ka", "Taqbaylit": "kab", "Kikamba": "kam", "Chimakonde": "kde", "Kabuverdianu": "kea", "Kanhg\u00e1g": "kgp", "Koyra ciini": "khq", "Gikuyu": "ki", "\u049a\u0430\u0437\u0430\u049b \u0442\u0456\u043b\u0456": "kk", "Kak\u0254": "kkj", "Kalaallisut": "kl", "Kalenjin": "kln", "\u1781\u17d2\u1798\u17c2\u179a": "km", "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1": "kn", "\ud55c\uad6d\uc5b4": "ko", "\u0915\u094b\u0902\u0915\u0923\u0940": "kok", "\u06a9\u0672\u0634\u064f\u0631": "ks", "Kishambaa": "ksb", "Rikpa": "ksf", "K\u00f6lsch": "ksh", "Kurd\u00ee": "ku", "Kernewek": "kw", "\u041a\u044b\u0440\u0433\u044b\u0437\u0447\u0430": "ky", "K\u0268laangi": "lag", "L\u00ebtzebuergesch": "lb", "Luganda": "lg", "Lak\u021f\u00f3l\u02bciyapi": "lkt", "Ling\u00e1la": "ln", "\u0ea5\u0eb2\u0ea7": "lo", "\u0644\u06ca\u0631\u06cc \u0634\u0648\u0645\u0627\u0644\u06cc": "lrc", "Lietuvi\u0173": "lt", "Tshiluba": "lu", "Dholuo": "luo", "Luluhia": "luy", "Latvie\u0161u": "lv", "\u092e\u0948\u0925\u093f\u0932\u0940": "mai", "Maa": "mas", "K\u0129m\u0129r\u0169": "mer", "Kreol morisien": "mfe", "Malagasy": "mg", "Makua": "mgh", "Meta\u02bc": "mgo", "Te reo m\u0101ori": "mi", "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438": "mk", "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02": "ml", "\u041c\u043e\u043d\u0433\u043e\u043b": "mn", "\u09ae\u09c8\u09a4\u09c8\u09b2\u09cb\u09a8\u09cd": "mni", "\u092e\u0930\u093e\u0920\u0940": "mr", "Melayu": "ms", "Malti": "mt", "Munda\u014b": "mua", "\u1019\u103c\u1014\u103a\u1019\u102c": "my", "\u0645\u0627\u0632\u0631\u0648\u0646\u06cc": "mzn", "Khoekhoegowab": "naq", "Isindebele": "nd", "Neddersass\u2019sch": "nds", "\u0928\u0947\u092a\u093e\u0932\u0940": "ne", "Nederlands": "nl", "Kwasio": "nmg", "Shw\u00f3\u014b\u00f2 ngiemb\u0254\u0254n": "nnh", "Norsk": "no", "Thok nath": "nus", "Runyankore": "nyn", "Oromoo": "om", "\u0b13\u0b21\u0b3c\u0b3f\u0b06": "or", "\u0418\u0440\u043e\u043d": "os", "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40": "pa", "Naij\u00edri\u00e1 p\u00edjin": "pcm", "Polski": "pl", "\u067e\u069a\u062a\u0648": "ps", "Portugu\u00eas": "pt", "Runasimi": "qu", "Rumantsch": "rm", "Ikirundi": "rn", "Rom\u00e2n\u0103": "ro", "Kihorombo": "rof", "\u0420\u0443\u0441\u0441\u043a\u0438\u0439": "ru", "Kinyarwanda": "rw", "Kiruwa": "rwk", "\u0938\u0902\u0938\u094d\u0915\u0943\u0924 \u092d\u093e\u0937\u093e": "sa", "\u0421\u0430\u0445\u0430 \u0442\u044b\u043b\u0430": "sah", "Kisampur": "saq", "\u1c65\u1c5f\u1c71\u1c5b\u1c5f\u1c72\u1c64": "sat", "Ishisangu": "sbp", "Sardu": "sc", "\u0633\u0646\u068c\u064a": "sd", "Davvis\u00e1megiella": "se", "Sena": "seh", "Koyraboro senni": "ses", "S\u00e4ng\u00f6": "sg", "\u2d5c\u2d30\u2d5b\u2d4d\u2d43\u2d49\u2d5c": "shi", "\u0dc3\u0dd2\u0d82\u0dc4\u0dbd": "si", "Sloven\u010dina": "sk", "Sloven\u0161\u010dina": "sl", "Anar\u00e2\u0161kiel\u00e2": "smn", "Chishona": "sn", "Soomaali": "so", "Shqip": "sq", "\u0421\u0440\u043f\u0441\u043a\u0438": "sr", "Basa sunda": "su", "Svenska": "sv", "Kiswahili": "sw", "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd": "ta", "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41": "te", "Kiteso": "teo", "\u0422\u043e\u04b7\u0438\u043a\u04e3": "tg", "\u0e44\u0e17\u0e22": "th", "\u1275\u130d\u122d\u129b": "ti", "T\u00fcrkmen dili": "tk", "Lea fakatonga": "to", "T\u00fcrk\u00e7e": "tr", "\u0422\u0430\u0442\u0430\u0440": "tt", "Tasawaq senni": "twq", "Tamazi\u0263t n la\u1e6dla\u1e63": "tzm", "\u0626\u06c7\u064a\u063a\u06c7\u0631\u0686\u06d5": "ug", "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430": "uk", "\u0627\u0631\u062f\u0648": "ur", "O\u2018zbek": "uz", "\ua559\ua524": "vai", "Ti\u1ebfng vi\u1ec7t": "vi", "Kyivunjo": "vun", "Walser": "wae", "Wolof": "wo", "Isixhosa": "xh", "Olusoga": "xog", "Nuasue": "yav", "\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9": "yi", "\u00c8d\u00e8 yor\u00f9b\u00e1": "yo", "Nhe\u1ebdgatu": "yrl", "\u7cb5\u8a9e": "yue", "\u4e2d\u6587 (\u7cb5\u8a9e)": "yue", "\u2d5c\u2d30\u2d4e\u2d30\u2d63\u2d49\u2d56\u2d5c": "zgh", "\u4e2d\u6587": "zh", "\u666e\u901a\u8bdd": "zh", "Isizulu": "zu"}

   // sprintf equivalent, takes a string and some arguments to make a computed string
   // eg: strfmt("%1 dogs are in %2", 7, "the kitchen"); => "7 dogs are in the kitchen"
   // eg: strfmt("I like %1, bananas and %1", "apples"); => "I like apples, bananas and apples"
   // NB: removes msg context if there is one present
   var strfmt = function (fmt) {
      var args = arguments;

      return fmt
       // put space after double % to prevent placeholder replacement of such matches
       .replace(/%%/g, '%% ')
       // replace placeholders
       .replace(/%(\d+)/g, function (str, p1) {
         return args[p1];
       })
       // replace double % and space with single %
       .replace(/%% /g, '%')
   };

   var removeContext = function(str) {
      // if there is context, remove it
      if (str.indexOf(_ctxt_delimiter) !== -1) {
        var parts = str.split(_ctxt_delimiter);
        return parts[1];
      }

    return str;
   };

   var expand_locale = function(locale) {
       var locales = [locale],
           i = locale.lastIndexOf('-');
       while (i > 0) {
           locale = locale.slice(0, i);
           locales.push(locale);
           i = locale.lastIndexOf('-');
       }
       return locales;
   };

   var normalizeLocale = function (locale) {
      // Convert locale to BCP 47. If the locale is in POSIX format, locale variant and encoding is discarded.
      locale = locale.replace('_', '-');
      var i = locale.search(/[.@]/);
      if (i != -1) locale = locale.slice(0, i);
      return locale;
   };

   var getPluralFunc = function (plural_form) {
     // Plural form string regexp
     // taken from https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
     // plural forms list available here http://localization-guide.readthedocs.org/en/latest/l10n/pluralforms.html
     var pf_re = new RegExp('^\\s*nplurals\\s*=\\s*[0-9]+\\s*;\\s*plural\\s*=\\s*(?:\\s|[-\\?\\|&=!<>+*/%:;n0-9_\(\)])+');

     if (!pf_re.test(plural_form))
       throw new Error(strfmt('The plural form "%1" is not valid', plural_form));

     // Careful here, this is a hidden eval() equivalent..
     // Risk should be reasonable though since we test the plural_form through regex before
     // taken from https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
     // TODO: should test if https://github.com/soney/jsep present and use it if so
     return new Function("n", 'var plural, nplurals; '+ plural_form +' return { nplurals: nplurals, plural: (plural === true ? 1 : (plural ? plural : 0)) };');
   };

   // Proper translation function that handle plurals and directives
   // Contains juicy parts of https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
   var t = function (messages, n, options /* ,extra */) {
     // Singular is very easy, just pass dictionnary message through strfmt
     if (!options.plural_form)
      return strfmt.apply(this, [removeContext(messages[0])].concat(Array.prototype.slice.call(arguments, 3)));

     var plural;

     // if a plural func is given, use that one
     if (options.plural_func) {
       plural = options.plural_func(n);

     // if plural form never interpreted before, do it now and store it
     } else if (!_plural_funcs[_locale]) {
       _plural_funcs[_locale] = getPluralFunc(_plural_forms[_locale]);
       plural = _plural_funcs[_locale](n);

     // we have the plural function, compute the plural result
     } else {
       plural = _plural_funcs[_locale](n);
     }

     // If there is a problem with plurals, fallback to singular one
     if ('undefined' === typeof plural.plural || plural.plural > plural.nplurals || messages.length <= plural.plural)
       plural.plural = 0;

     return strfmt.apply(this, [removeContext(messages[plural.plural]), n].concat(Array.prototype.slice.call(arguments, 3)));
   };

 return {
   strfmt: strfmt, // expose strfmt util
   expand_locale: expand_locale, // expose expand_locale util

   // Declare shortcuts
   __: function () { return this.gettext.apply(this, arguments); },
   _n: function () { return this.ngettext.apply(this, arguments); },
   _p: function () { return this.pgettext.apply(this, arguments); },

   setMessages: function (domain, locale, messages, plural_forms) {
     if (!domain || !locale || !messages)
       throw new Error('You must provide a domain, a locale and messages');

     if ('string' !== typeof domain || 'string' !== typeof locale || !_.isObject(messages))
       throw new Error('Invalid arguments');

     locale = normalizeLocale(locale);

     if (plural_forms)
       _plural_forms[locale] = plural_forms;

     if (!_dictionary[domain])
       _dictionary[domain] = {};

     _dictionary[domain][locale] = messages;

     return this;
   },
   loadJSON: function (jsonData, domain) {
     if (!_.isObject(jsonData))
       jsonData = JSON.parse(jsonData);

     if (!jsonData[''] || !jsonData['']['language'] || !jsonData['']['plural-forms'])
       throw new Error('Wrong JSON, it must have an empty key ("") with "language" and "plural-forms" information');

     var headers = jsonData[''];
     delete jsonData[''];

     return this.setMessages(domain || defaults.domain, headers['language'], jsonData, headers['plural-forms']);
   },
   setLanguage: function (language) {
    this.setLocale( _languageCodes[language] );
   },
   setLocale: function (locale) {
     _locale = normalizeLocale(locale);
     return this;
   },
   getLanguage: function (language) {
    return _languageNames[_locale];
   },
   getLanguageForLocale(locale) {
    return _languageNames[locale];
   },
   getLocale: function () {
     return _locale;
   },
   getLocaleForLanguage (language) {
     return _languageCodes[language];
   },
   // getter/setter for domain
   textdomain: function (domain) {
     if (!domain)
       return _domain;
     _domain = domain;
     return this;
   },
   gettext: function (msgid /* , extra */) {
     return this.dcnpgettext.apply(this, [undefined, undefined, msgid, undefined, undefined].concat(Array.prototype.slice.call(arguments, 1)));
   },
   ngettext: function (msgid, msgid_plural, n /* , extra */) {
     return this.dcnpgettext.apply(this, [undefined, undefined, msgid, msgid_plural, n].concat(Array.prototype.slice.call(arguments, 3)));
   },
   pgettext: function (msgctxt, msgid /* , extra */) {
     return this.dcnpgettext.apply(this, [undefined, msgctxt, msgid, undefined, undefined].concat(Array.prototype.slice.call(arguments, 2)));
   },
   dcnpgettext: function (domain, msgctxt, msgid, msgid_plural, n /* , extra */) {
     domain = domain || _domain;

     if ('string' !== typeof msgid)
       throw new Error(this.strfmt('Msgid "%1" is not a valid translatable string', msgid));

     var
       translation,
       options = { plural_form: false },
       key = msgctxt ? msgctxt + _ctxt_delimiter + msgid : msgid,
       exist,
       locale,
       locales = expand_locale(_locale);

     for (var i in locales) {
        locale = locales[i];
        exist = _dictionary[domain] && _dictionary[domain][locale] && _dictionary[domain][locale][key];

        // because it's not possible to define both a singular and a plural form of the same msgid,
        // we need to check that the stored form is the same as the expected one.
        // if not, we'll just ignore the translation and consider it as not translated.
        if (msgid_plural) {
          exist = exist && "string" !== typeof _dictionary[domain][locale][key];
        } else {
          exist = exist && "string" === typeof _dictionary[domain][locale][key];
        }
        if (exist) {
          break;
        }
     }

     if (!exist) {
       translation = msgid;
       options.plural_func = defaults.plural_func;
     } else {
       translation = _dictionary[domain][locale][key];
     }

     // Singular form
     if (!msgid_plural)
       return t.apply(this, [[translation], n, options].concat(Array.prototype.slice.call(arguments, 5)));

     // Plural one
     options.plural_form = true;
     return t.apply(this, [exist ? translation : [msgid, msgid_plural], n, options].concat(Array.prototype.slice.call(arguments, 5)));
   }
 };
};

export default i18n;
