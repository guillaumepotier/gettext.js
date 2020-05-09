(function () {
    describe('gettext.js test suite', function () {
        describe('General API', function () {
            it('should be defined', function () {
                expect(window.i18n).to.be.a('function');
            });
            it('should be instanciable', function () {
                expect(window.i18n()).to.be.an('object');
            });
            it('should have default locale', function () {
                var i18n = window.i18n();
                expect(i18n.getLocale()).to.be('en');
            });
            it('should allow to set locale', function () {
                var i18n = window.i18n({
                    locale: 'fr'
                });
                expect(i18n.getLocale()).to.be('fr');
            });
            it('should allow to set messages', function () {
                var i18n = window.i18n({
                    locale: 'fr',
                    messages: {
                        "apple": "pomme"
                    }
                });
                expect(i18n.getLocale()).to.be('fr');
                expect(i18n.gettext('apple')).to.be('pomme');
            });
            it('should handle contextualized msgid', function () {
                var i18n = window.i18n({
                    locale: 'fr',
                    plural_forms: 'nplurals=2; plural=n>1;',
                    messages: {
                        "foo": "bar",
                        "ctxt\u0004foo": "baz",
                        "There is %1 apple": [
                            "Il y a %1 pomme",
                            "Il y a %1 pommes"
                        ],
                        "ctxt\u0004There is %1 apple": [
                            "Il y a %1 pomme Golden",
                            "Il y a %1 pommes Golden"
                        ],
                    }
                });
                expect(i18n.gettext('foo')).to.be('bar');
                expect(i18n.gettext('ctxt\u0004foo')).to.be('baz');
                expect(i18n.gettext('ctxt\u0004baz')).to.be('baz');
                expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 2)).to.be("Il y a 2 pommes");
                expect(i18n.ngettext('ctxt\u0004There is %1 apple', 'There are %1 apples', 1)).to.be("Il y a 1 pomme Golden");
                expect(i18n.ngettext('ctxt\u0004There is %1 orange', 'There are %1 oranges', 1)).to.be("There is 1 orange");
                expect(i18n.ngettext('ctxt\u0004There is %1 orange', 'There are %1 oranges', 3)).to.be("There are 3 oranges");
            });
        });
        describe('methods', function () {
            var i18n;
            before(function () {
                i18n = new window.i18n();
            });

            describe('strfmt', function () {
                it('should be a i18n method', function () {
                    expect(i18n.strfmt).to.be.a('function');
                });
                it('should handle one replacement', function () {
                    expect(i18n.strfmt('foo %1 baz', 'bar')).to.be('foo bar baz');
                });
                it('should handle many replacements', function () {
                    expect(i18n.strfmt('foo %1 baz %2', 'bar', 42)).to.be('foo bar baz 42');
                });
                it('should handle order', function () {
                    expect(i18n.strfmt('foo %2 baz %1', 'bar', 42)).to.be('foo 42 baz bar');
                });
                it('should handle repeat', function () {
                    expect(i18n.strfmt('foo %1 baz %1', 'bar', 42)).to.be('foo bar baz bar');
                });
                it('should handle literal percent (%) signs', function () {
                    expect(i18n.strfmt('foo 1%% bar')).to.be('foo 1% bar');
                    expect(i18n.strfmt('foo %1%% bar', 10)).to.be('foo 10% bar');
                    expect(i18n.strfmt('foo %%1 bar')).to.be('foo %1 bar');
                    expect(i18n.strfmt('foo %%%1 bar', 10)).to.be('foo %10 bar');
                });
            });

            describe('expand_locale', function() {
                it('should be a i18n method', function() {
                    expect(i18n.expand_locale).to.be.a('function');
                });
                it('should handle simple locale', function() {
                    expect(i18n.expand_locale('fr')).to.eql(['fr']);
                });
                it('should handle complex locale', function() {
                    expect(i18n.expand_locale('de-CH-1996')).to.eql(['de-CH-1996', 'de-CH', 'de']);
                });
            });

            describe('gettext', function () {
                it('should handle peacefully singular untranslated keys', function () {
                    expect(i18n.gettext('not translated')).to.be('not translated');
                });
                it('should handle peacefully singular untranslated keys with extra', function () {
                    expect(i18n.gettext('not %1 translated', 'correctly')).to.be('not correctly translated');
                    expect(i18n.gettext('not %1 %2 translated', 'fully', 'correctly')).to.be('not fully correctly translated');
                });
                it('should fallback to father language', function() {
                    i18n = new window.i18n();
                    i18n.setMessages('messages', 'fr', {
                        "Mop": "Serpillière",
                    });
                    i18n.setMessages('messages', 'fr-BE', {
                        "Mop": "Torchon",
                    });

                    i18n.setLocale('fr-BE');
                    expect(i18n.gettext("Mop")).to.be("Torchon");

                    i18n.setLocale('fr');
                    expect(i18n.gettext("Mop")).to.be("Serpillière");

                    i18n.setLocale('fr-FR');
                    expect(i18n.gettext("Mop")).to.be("Serpillière");
                });
            });

            describe('ngettext', function () {
                it('should handle peacefully plural untranslated keys', function () {
                    // english default plural rule is n !== 1
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 0)).to.be('0 not translated plural');
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 1)).to.be('1 not translated singular');
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 3)).to.be('3 not translated plural');
                });
                it('should handle peacefully plural untranslated keys with extra', function () {
                    expect(i18n.ngettext('%1 not %2 singular', '%1 not %2 plural', 1, 'foo')).to.be('1 not foo singular');
                    expect(i18n.ngettext('%1 not %2 singular', '%1 not %2 plural', 3, 'foo')).to.be('3 not foo plural');
                });
                it('should use default english plural form for untranslated keys', function () {
                    i18n = new window.i18n({ locale: 'fr', plural_forms: 'nplurals=2; plural=n>1;' });
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 0)).to.be('0 not translated plural');
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 1)).to.be('1 not translated singular');
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 3)).to.be('3 not translated plural');
                });
                it('should handle correctly other language plural passed through setMessages method', function () {
                    i18n = new window.i18n({locale: 'fr'});
                    i18n.setMessages('messages', 'fr', {
                        "There is %1 apple": [
                            "Il y a %1 pomme",
                            "Il y a %1 pommes"
                        ]
                    }, 'nplurals=2; plural=n>1;');
                    expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 0)).to.be('Il y a 0 pomme');
                    expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 1)).to.be('Il y a 1 pomme');
                    expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 2)).to.be('Il y a 2 pommes');
                });
                it('should handle correctly other language plural passed through init options', function () {
                    i18n = new window.i18n({
                        locale: 'fr',
                        messages: {
                            "There is %1 apple": [
                                "Il y a %1 pomme",
                                "Il y a %1 pommes"
                            ]
                        },
                        plural_forms: 'nplurals=2; plural=n>1;'
                    });
                    expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 0)).to.be('Il y a 0 pomme');
                    expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 1)).to.be('Il y a 1 pomme');
                    expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 2)).to.be('Il y a 2 pommes');
                });
                it('should ignore a plural translation when requesting the singular form', function () {
                    i18n = new window.i18n({ locale: 'fr' });
                    i18n.setMessages('messages', 'fr', {
                        "apple": [
                            "pomme",
                            "pommes"
                        ]
                    }, 'nplurals=2; plural=n>1;');
                    expect(i18n.gettext('apple')).to.be('apple');
                    expect(i18n.ngettext('apple', 'apples', 1)).to.be('pomme');
                    expect(i18n.ngettext('apple', 'apples', 2)).to.be('pommes');
                });
                it('should ignore a singular translation when requesting the plural form', function () {
                    i18n = new window.i18n({ locale: 'fr' });
                    i18n.setMessages('messages', 'fr', {
                        "apple": "pomme"
                    });
                    expect(i18n.gettext('apple')).to.be('pomme');
                    expect(i18n.ngettext('apple', 'apples', 1)).to.be('apple');
                    expect(i18n.ngettext('apple', 'apples', 2)).to.be('apples');
                });
                it('should fail unvalid plural form', function () {
                    i18n = new window.i18n({ locale: 'foo' });
                    i18n.setMessages('messages', 'foo', {
                        "There is %1 apple": [
                            "Il y a %1 pomme",
                            "Il y a %1 pommes"
                        ]
                    }, 'nplurals=2; plural=[not valid];');

                    // do not throw error on default plural form if key does not have a translation
                    expect(i18n.ngettext('foo', 'bar', 2)).to.be('bar');

                    try {
                        i18n.ngettext('There is %1 apple', 'There are %1 apples', 42);
                    } catch (e) {
                        expect(e.message).to.be('The plural form "nplurals=2; plural=[not valid];" is not valid');
                    }
                });
                it('should handle multiple locale & pluals cohabitation', function () {
                    i18n = new window.i18n({ locale: 'foo' });
                    i18n.setMessages('messages', 'foo', {
                        "singular": [
                            "singular",
                            "plural"
                        ]
                    }, 'nplurals=2; plural=n>10;');
                    i18n.setMessages('messages', 'bar', {
                        "singular": [
                            "singulier",
                            "pluriel"
                        ]
                    }, 'nplurals=2; plural=n>100;');
                    expect(i18n.ngettext('singular', 'plural', 9)).to.be('singular');
                    expect(i18n.ngettext('singular', 'plural', 11)).to.be('plural');

                    i18n.setLocale('bar');
                    expect(i18n.ngettext('singular', 'plural', 9)).to.be('singulier');
                    expect(i18n.ngettext('singular', 'plural', 11)).to.be('singulier');
                    expect(i18n.ngettext('singular', 'plural', 111)).to.be('pluriel');
                });
                it('should fallback to singular form if there is a problem with plurals', function () {
                    // incorrect plural, more than nplurals
                    i18n = new window.i18n({ locale: 'foo' });
                    i18n.setMessages('messages', 'foo', {
                        "apple": [
                            "pomme",
                            "pommes"
                        ]
                    }, 'nplurals=2; plural=3;');
                    expect(i18n.ngettext('apple', 'apples', 1)).to.be('pomme');

                    // plural is correct, but according to nplurals there should be more translations
                    i18n = new window.i18n({ locale: 'ru' });
                    i18n.setMessages('messages', 'ru', {
                        "%1 apple": [
                            "%1 яблоко",
                            "%1 яблока"
                            // "%1 яблок" - missed translation
                        ]
                    }, "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);");
                    expect(i18n.ngettext('%1 apple', '%1 apples', 5)).to.be('5 яблоко');
                });
                it('should correctly handle substitution when an array of one message is provided in an nplurals=1 locale', function () {
                    i18n = new window.i18n({ locale: 'tdt' });
                    i18n.setMessages('messages', 'tdt', {
                        "%1 lesson left in %2.":
                        [
                            "%1 lisaun iha %2"
                        ],
                        "%1 lesson left.": [
                            "%1 lisaun iha."
                        ]
                    }, 'nplurals=1; plural=0;');
                    expect(i18n.ngettext('%1 lesson left.', '%1 lessons left.', 1)).to.be('1 lisaun iha.');
                    expect(i18n.ngettext('%1 lesson left.', '%1 lessons left.', 5)).to.be('5 lisaun iha.');
                    expect(i18n.ngettext('%1 lesson left in %2.', '%1 lessons left in %2.', 1, 'Mathematics')).to.be('1 lisaun iha Mathematics');
                    expect(i18n.ngettext('%1 lesson left in %2.', '%1 lessons left in %2.', 5, 'Mathematics')).to.be('5 lisaun iha Mathematics');
                });
            });

            describe('loadJSON', function () {
                it('should properly load json', function () {
                    var parsedJSON = {
                        "": {
                            "language": "fr",
                            "plural-forms": "nplurals=2; plural=n>1;"
                        },
                        "Loading...": "Chargement...",
                        "Save": "Sauvegarder",
                        "There is %1 apple": [
                            "Il y a %1 pomme",
                            "Il y a %1 pommes"
                        ],
                        "Checkout\u0004Save": "Sauvegarder votre panier"
                    },
                    i18n = window.i18n()
                        .loadJSON(JSON.stringify(parsedJSON))
                        .setLocale('fr');
                    expect(i18n.getLocale(), 'fr');
                    expect(i18n.textdomain(), 'messages');
                    expect(i18n.gettext('Save')).to.be('Sauvegarder');
                    expect(i18n.gettext('Loading...')).to.be('Chargement...');
                    expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 0)).to.be('Il y a 0 pomme');
                    expect(i18n.ngettext('There is %1 apple', 'There are %1 apples', 2)).to.be('Il y a 2 pommes');
                });
            });
        });
    });
}());
