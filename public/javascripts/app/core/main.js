define([
    'require',
    'text!tmpl/analysis.htm',
    'core/charting/stocks',
    './authorization',
    './api',
    './lookup'
], function(require, tmpl, stocks, authorization, api, LookupService) {
    // attach this to window
    var resetInput = function() {
        $('input.tracieInput').val('');
    },
        lookupService = new LookupService();

    if (!authorization.isLoggedIn()) {
        $(".desktop").prepend("<a href='javascript:T.core.authorization.login();'>Please log in.</a>");
    }

    localStorage['tracieState'] = '';

    T = {
        api: api,
        core: {
            continueState: function() {
                resetInput();
                return lookupService.continueState();
            },
            authorization: authorization,
            lookup: function(opts, initial) {
                resetInput();
                return lookupService.lookup(opts, initial);
            },
            util: {
                getRandom: function(options) {
                    var dataArray = [],
                        len = 0;

                    _.defaults(options, {
                        min: 0,
                        max: 100,
                        anInteger: true,
                        number: 10
                    });

                    len = options.number;

                    while (len) {
                        if (options.anInteger) {
                            dataArray.push(Math.floor(Math.random() * (options.max - options.min + 1)) + options.min);
                        }

                        dataArray.push(Math.random() * (options.max - options.min) + options.min);
                        len--;
                    }

                    return dataArray;
                }
            },
            clearDesktop: function() {
                resetInput();
                $('.desktop').children().slideUp(function() {
                    $(this).parent().html('');
                });
            },
            clearHistory: function() {
                resetInput();
                $('.responseContainer').html('');
            },
            pin: function(sym, withCharts) {
                var promise = sym.symbol ? T.api.symbolLookup(sym.symbol) : T.api.companyLookup(sym.companyName)

                promise.done(function(val) {
                    var symbol = val[0];

                    var quotePromise = T.api.getQuote(symbol.Name);

                    quotePromise.done(function(quote) {
                        require(['text!tmpl/stickynote.htm', 'sparklines'], function(tmpl, sparklines) {
                            var vm = quote[0],
                                $html = $(Mustache.to_html(tmpl, vm)),
                                lineSparkTimer,
                                data,
                                volumeData,
                                drawLine = function () {
                                    data = T.core.util.getRandom({min: 390, max: 392, anInteger: true, number: 6});
                                    volumeData = T.core.util.getRandom({min: 30000, max: 42000, anInteger: true, number: 4});
                                    $('.line', $html).sparkline(data);

                                    $('.barchart', $html).sparkline(volumeData, {type: 'bar'});
                                    lineSparkTimer = setTimeout(drawLine, 2000);
                                };

                            // add sticky to board
                            $('.corkboard').prepend($html);

                            $html.fadeIn();

                            if (withCharts) {
                                $html.addClass('charts');
                                drawLine();
                            }
                        });
                    });
                });
            },
            news: function() {
                resetInput();
                return 'msft is selling off!';
            },
            buy: function(opts) {
                var args = Array.prototype.slice.call(arguments),
                    qty = args[0].quantity || 500,
                    sym = args[0].symbol || undefined,
                    symbol = {name: undefined, description: undefined },
                    symPromise;

                symPromise = args[0].companyName ?
                    T.api.companyLookup(args[0].companyName) :
                    T.api.symbolLookup(args[0].symbol);

                symPromise.done(function(val) {
                    if (val.length < 1) {
                        return;
                    }

                    symbol.name = val[0].Name;
                    symbol.description = val[0].Description;

                    var quotePromise = T.api.getQuote(symbol.name);

                    quotePromise.done(function(quote) {
                        require(['text!tmpl/buy.htm'], function(tmpl) {
                            var vw = {
                                symbol: symbol.name,
                                quantity: qty,
                                companyName: symbol.description,
                                quote: quote[0]
                            },
                                $html = $(Mustache.to_html(tmpl, vw));

                            $('.desktop').prepend($html);
                            $html.slideDown('slow');
                        });

                        resetInput();
                    });
                });
            },
            analyze: function(query) {

                var promise = query.symbol === null ? T.api.companyLookup(query.companyName) : T.api.symbolLookup(query.symbol);

                promise.done(function(val) {
                    var symbol = val[0],
                        self = this,
                        vw = {
                            action: 'Buy',
                            score: 'B+',
                            symbol: symbol,
                            recommendation: 'hold',
                            price: {
                                bid: 368.54,
                                last: 367.54,
                                ask: 368.98
                            },
                            newsStories: [
                                {
                                    name: 'Google targets Microsoft\'s lucrative Office market',
                                    url: '#'
                                },
                                {
                                    name: 'Microsoft\'s Bill Gates due in court',
                                    url: '#'
                                },
                                {
                                    name: 'Gates to testify in $1B antitrust lawsuit',
                                    url: '#'
                                }
                            ],
                            positions: T.api.getMyPositions(undefined, symbol.Name),
                            relatedPositions: [
                                {
                                    symbol: 'MSFT',
                                    shares: '10,000',
                                    value: '$17,302',
                                    profitLoss: '-$3,028'
                                }
                            ]
                        },
                        $html = $(Mustache.to_html(tmpl, vw)),
                        stockChartElement = $('.stockChart', $html).get(0);

                    $(".desktop").prepend($html);

                    $($html).slideDown('slow', function() {
                        stocks.buildStockChart.call(self, stockChartElement);
                    });

                });

                resetInput();
            }
        },
        features: {
            disableListen: function() {
                resetInput();
                $('#speech').removeAttr('speech');
                $('#speech').removeAttr('x-webkit-speech');
                $('#speech').removeAttr('x-webkit-grammar');

                localStorage['listen'] = JSON.stringify({enabled:false});
            },
            enableListen: function() {
                resetInput();
                $('#speech')
                    .attr('speech', '')
                    .attr('x-webkit-speech', '')
                    .attr('x-webkit-grammar', 'grammars/trader-grammar.grxml');
                localStorage['listen'] = JSON.stringify({enabled:true});
            },
            enableSpeech: function() {
                resetInput();
                localStorage['speech'] = JSON.stringify({enabled: true});
            },
            disableSpeech: function() {
                resetInput();
                localStorage['speech'] = JSON.stringify({enabled: false});
            }
        }
    };
});