define(['jison'], function(jison) {
    var Jison = require('jison'),
        bnf = require('jison/bnf'),
        generator,
        type = 'lalr',

        grammar = {
            'lex': {
                'macros': {
                    'digit': '[0-9]'
                },
                'startConditions': {
                    'IMMEDIATE': 0,
                    'CLEAR': 0,
                    'SHOWME':1
                },
                'rules': [
                    ['\\s+', '/* skip whitespace */'],
//                    ['quote for ', 'return "STOCK_QUOTE";'],

                    /*

                    lookup apple computers
                        (if it finds one, show immediately)
                        : display quote
                            "Would you like more details?"
                            > "Yes"
                                [STATE] : display full quote
                                : current position
                                : show a chart
                           > "More details"
                                : twitter
                                : scorecard
                                : news
                                > "Buy 200 shares"
                                > "Sell all"
                        (if it finds multiple, should ask please specify
                            1.) Apple Products
                            2.) Apple Computers
                     */

                    // Lookup
                    ['lookup', 'return "LOOKUP";'],
                    ['yes','return "CONTINUE_STATE";'],
                    ['analyze this', 'return "CONTINUE_STATE";'],

                    // Pin-Data
                    ['pin', 'return "PIN";'],
                    ['with charts' ,'return "WITH_CHARTS";'],

                    // Orders
                    ['buy', 'return "BUY";'],
                    ['by', 'return "BUY";'],
                    ['bye', 'return "BUY";'],
                    ['shares of\\b', 'return "SHARES";'],
                    ['{digit}+', 'return "QUANTITY";'],

                    // Analysis
                    ['analyze', 'return "ANALYZE";'],

                    // Symbol
                    ['\\#[a-zA-Z]+', 'return "SYMBOL";'],

                    // Commands
                    ['tracie speak up','return "ENABLE_SPEECH";'],
                    ['tracie zip it','return "DISABLE_SPEECH";'],
                    ['tracie listen up','return "ENABLE_LISTEN";'],
                    ['tracie don\'t listen','return "DISABLE_LISTEN";'],
                    ['tracy talk to me','return "ENABLE_SPEECH";'],
                    ['tracy zip it','return "DISABLE_SPEECH";'],
                    ['tracy listen up','return "ENABLE_LISTEN";'],
                    ['tracy don\'t listen','return "DISABLE_LISTEN";'],

                    ['log in', 'return "LOG_IN";'],
                    ['print', 'return "PRINT";'],
                    ['clear', 'this.begin("CLEAR");'],
                    [
                        ['CLEAR'],
                        'desktop',
                        'this.begin("INITIAL"); return "CLEAR_DESKTOP";'
                    ],
                    [
                        ['CLEAR'],
                        'history',
                        'this.begin("INITIAL"); return "CLEAR_HISTORY";'
                    ],

                    // Other characters
                    ['{digit}+','return "NUMBER";'],
                    ['[a-zA-Z]+', 'return "CHARS";'],
                    ['$','return "EOF";']
                ]
            },
            'start':'expressions',
            'bnf': {
                'expressions': [
                    ['e EOF', 'print($1); return $1;']
                ],
                'e': [
                    // LOOKUP
                    ['LOOKUP SYMBOL', 'T.core.lookup({symbol: $2,companyName:null}, true); return "Looking up " + $2;'],
                    ['LOOKUP CHARS', 'T.core.lookup({symbol:null,companyName:$2}, true); return "none";'],
                    // PIN DATA
                    ['PIN SYMBOL', 'T.core.pin({symbol:$2.replace("#","")}); return "Pinning symbol " + $2.replace("#","") + " to your board.";'],
                    ['PIN SYMBOL WITH_CHARTS', 'T.core.pin({symbol:$2.replace("#","")}, true); return "Pinning symbol " + $2.replace("#","") + " with charts to your board.";'],
                    ['PIN CHARS', 'T.core.pin({companyName: $2}); return "Pinning symbol " + $2 + " to your board.";'],
                    ['PIN CHARS WITH_CHARTS', 'T.core.pin({companyName:$2.replace(" with charts","")}, true); return "Pinning symbol " + $2 + " with charts to your board.";'],
                    // SHOW ME
                    ['POSITIONS', 'console.log("show positions"); return "test";'],
                    // ORDERS
                    ['BUY QUANTITY SHARES SYMBOL', 'T.core.buy.call({}, {symbol:$4.replace("#",""), quantity:$2}); return "Loading a quantity order form..";'],
                    ['BUY SHARES SYMBOL', 'T.core.buy.call({}, {symbol:$3.replace("#",""),quantity:null}); return "Loading a quantity order form.";'],
                    ['BUY QUANTITY SYMBOL', 'T.core.buy.call({}, {symbol:$3.replace("#",""), quantity:$2}); return "Loading a quantity order form.";'],
                    ['BUY SYMBOL', 'T.core.buy.call({}, {symbol:$2.replace("#","")}); return "Loading a quantity order form.";'],
                    ['BUY QUANTITY SHARES CHARS', 'T.core.buy.call({}, {companyName:$4, quantity:$2}); return "Loading a quantity order form.";'],
                    ['BUY SHARES CHARS', 'T.core.buy.call({}, {companyName:$3.replace("#",""),quantity:null}); return "Loading a quantity order form.";'],
                    ['BUY QUANTITY CHARS', 'T.core.buy.call({}, {companyName:$3.replace("#",""), quantity:$2}); return "Loading a quantity order form.";'],
                    ['BUY CHARS', 'T.core.buy.call({}, {companyName:$2}); return "Looking up the symbol for " + $2;'],
                    // ANALYSIS
                    ['ANALYZE SYMBOL', 'T.core.analyze({symbol:$2.replace("#",""),companyName:null}); return "Loading Analysis.";'],
                    ['ANALYZE CHARS', 'T.core.analyze({symbol: null, companyName: $2}); return "Loading Analysis.";'],
                    // COMMANDS
                    ['CONTINUE_STATE','T.core.continueState(); return "none";'],
                    ['LOG_IN','T.core.authorization.login(); return "Authorizing your account.";'],
                    ['ENABLE_SPEECH','T.features.enableSpeech(); return "I will now be speaking."'],
                    ['DISABLE_SPEECH','T.features.disableSpeech(); return "Disabling speech."'],
                    ['ENABLE_LISTEN','T.features.enableListen(); return "I\'m listening."'],
                    ['DISABLE_LISTEN','T.features.disableListen(); return "I\'m not listening anymore."'],
                    ['PRINT', ''],
                    ['CLEAR_DESKTOP', 'T.core.clearDesktop(); return "none";'],
                    ['CLEAR_HISTORY', 'T.core.clearHistory(); return "none";']
                ]
            }
        };

    generator = new Jison.Generator(grammar, {type: type});

    return generator.createParser();
});