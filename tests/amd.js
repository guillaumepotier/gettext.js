requirejs.config({
    baseUrl: '/dist',
    paths: {i18n: 'gettext.amd'}
});
requirejs(['i18n'], window.testGettext);
