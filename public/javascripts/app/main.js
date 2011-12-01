require.config({
    packagePaths: {
        'core': 'app/core/main'
    },
    'packages': ['core'],
    paths: {
        'jquery': '../lib/jquery',
        'underscore': '../lib/underscore-module',
        'socket.io': '../lib/socket.io-module',
        'jison': '../lib/jison',
        'text': '../lib/requirejs-plugins/text',
        'mustache': '../lib/mustache',
        'highstock': '../lib/highstock',
        'sparklines': '../lib/jquery-plugins/jquery.sparkline',

        'charts': '../app/core/charting/charts',
        'tracie': '../parser/tracie'
    }
});

require([
    'index',
    'core',
    'jquery',
    'mustache',
    'socket.io'
], function(app, core) {
    // capture enter event
    $(function() {
        var listen;

        listen = localStorage['listen'];

        if (listen) {
            listen = JSON.parse(listen);

            if (listen.enabled) {
                $('#speech').attr('speech', '');
                $('#speech').attr('x-webkit-speech', '');
                $('#speech').attr('x-webkit-grammar', '');
            } else {
                $('#speech').removeAttr('speech');
                $('#speech').removeAttr('x-webkit-speech');
                $('#speech').removeAttr('x-webkit-grammar');
            }
        }
        $('speech').on('keydown', function(e) {
            console.log(e());
            console.log(e.keyCode());
            if (e.keyCode == 13) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });

    app.init();
});