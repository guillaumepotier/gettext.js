(function () {
    describe('gettext.js test suite', function () {
        describe('General API', function () {
            it('should be defined', function () {
                expect(window.i18n).to.be.a('function');
            });
            it('should be instanciable', function () {
                expect(window.i18n()).to.be.an('object');
            });
            it('should allow to set locale', function () {
                var i18n = window.i18n();
                expect(i18n.getLocale()).to.be('en');
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
            });

            describe('gettext', function () {
                it('should handle peacefully singular untranslated keys', function () {
                    expect(i18n.gettext('not translated')).to.be('not translated');
                });
                it('should handle peacefully singular untranslated keys with extra', function () {
                    expect(i18n.gettext('not %1 translated', 'correctly')).to.be('not correctly translated');
                    expect(i18n.gettext('not %1 %2 translated', 'fully', 'correctly')).to.be('not fully correctly translated');
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
                it('should handle other plural forms than default one', function () {
                    i18n = new window.i18n({ plural_form: 'nplurals=2; plural=n>1;' });
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 0)).to.be('0 not translated singular');
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 1)).to.be('1 not translated singular');
                    expect(i18n.ngettext('%1 not translated singular', '%1 not translated plural', 3)).to.be('3 not translated plural');
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
