define([
    'require',
    './api',
    './speech',
    'text!tmpl/lookup.htm'
], function(require, api, speech, tmpl) {
    var tracieState = {
        currentState: 'start',
        symbol: null
    },
        stateOrder = ['start', 'moreInfo', 'confirmedMoreInfo', 'detailedAnalysis', 'analyzeThis', 'noop'],
        symbolLookup = function(sym) {

        },
        companyLookup = function(name) {
            var promise = api.companyLookup(name);

            promise.done(function(val) {
                if (val.length < 1) {
                    return;
                }

                var symbol = val[0],
                    vw = {
                        companyName: symbol.Description,
                        symbol: symbol.Name
                    },
                    $html = $(Mustache.to_html(tmpl, vw));

                $('.desktop').prepend($html);

                localStorage['symbol'] = JSON.stringify(symbol);

                $html.fadeIn();
            });
        },
        getNextState = function() {
            var currentIndex = _.indexOf(stateOrder, getCurrentState()),
                len = stateOrder.length - 1,
                nextIndex = currentIndex < len ? currentIndex + 1 : 0;

            return stateOrder[nextIndex];
        },
        saveCurrentState = function(state) {
            tracieState.currentState = state;
            localStorage['tracieState'] = JSON.stringify(tracieState);
        },
        getCurrentSymbol = function() {
            var symbol = localStorage['symbol'];

            if (symbol) {
                return JSON.parse(symbol);
            }
            else {
                return null;
            }
        },
        getCurrentState = function() {
            var state = localStorage['tracieState'];

            if (state) {
                tracieState = JSON.parse(state);
            } else {
                return 'start';
            }

            return tracieState.currentState;
        },
        LookupService = function() {
        };

    LookupService.prototype.lookup = function(opts, initial) {
        // find current state
        var
            transitions = {
                noop: function() {
                },
                moreInfo: function() {
                    var tts = 'Would you like more details?',
                        promise,
                        audible;

                    if (localStorage['speech']) {
                        var s = JSON.parse(localStorage['speech']);
                        audible = s.enabled;
                    }

                    if (audible) {
                        promise = speech.speak(tts);

                        promise.done(function(data) {
                            var $html = $('<div class="tracie response question">' + tts + '</div>');
                            $('.responseContainer').prepend($html);

                            $("#demo1player").html("<audio autoplay='autoplay' src='" + data.snd_url + "' />");
                            $html.fadeIn();
                        });
                    } else {
                        setTimeout(function() {
                            var $html = $('<div class="tracie response question">' + tts + '</div>');
                            $('.responseContainer').prepend($html);
                            $html.fadeIn();
                        }, 2000);
                    }
                },
                detailedAnalysis: function() {

                }
            },
            states = {
                start: function(opts) {
                    if (opts.symbol) {
                        return symbolLookup(opts.symbol);
                    } else {
                        return companyLookup(opts.companyName);
                    }
                },
                confirmedMoreInfo: function() {
                    var tts = 'Here is an overview.',
                        promise,
                        audible;

                    if (localStorage['speech']) {
                        var s = JSON.parse(localStorage['speech']);
                        audible = s.enabled;
                    }

                    if (audible) {
                        promise = speech.speak(tts);

                        promise.done(function(data) {
                            var $html = $('<div class="tracie response question">' + tts + '</div>');
                            $('.responseContainer').prepend($html);

                            $("#demo1player").html("<audio autoplay='autoplay' src='" + data.snd_url + "' />");
                            $html.fadeIn();

                            require(['text!tmpl/moreInfo.htm'], function(tmpl) {
                                var symbol = JSON.parse(localStorage['symbol']),
                                    vw = {
                                        companyName: symbol.Description
                                    },
                                    $html = $(Mustache.to_html(tmpl, vw));
                                $('.desktop').prepend($html);

                                $html.fadeIn();
                            });
                        });
                    } else {
                        setTimeout(function() {

                            var $html = $('<div class="tracie response question">' + tts + '</div>');
                            $('.responseContainer').prepend($html);

                            $html.fadeIn();

                            require(['text!tmpl/moreInfo.htm'], function(tmpl) {
                                var symbol = JSON.parse(localStorage['symbol']),
                                    vw = {
                                        companyName: symbol.Description
                                    },
                                    $html = $(Mustache.to_html(tmpl, vw));
                                $('.desktop').prepend($html);

                                $html.fadeIn();
                            });
                        }, 1000);
                    }

                },
                analyzeThis: function() {
                    var symbol = getCurrentSymbol(),
                        tts = "I've run a complex analysis for you.  I'm displaying the latest news, social sentiment, your positions and the stock's movement today.",
                        audible,
                        promise;

                    if (symbol) {
                        if (localStorage['speech']) {
                            var s = JSON.parse(localStorage['speech']);
                            audible = s.enabled;
                        }

                        if (audible) {
                            promise = speech.speak(tts);

                            promise.done(function(data) {
                                var $html = $('<div class="tracie response question">' + tts + '</div>');
                                $('.responseContainer').prepend($html);

                                $("#demo1player").html("<audio autoplay='autoplay' src='" + data.snd_url + "' />");
                                $html.fadeIn();

                                T.core.analyze({symbol: symbol.Name});
                            });

                        } else {
                            setTimeout(function() {
                                var $html = $('<div class="tracie response question">' + tts + '</div>');
                                $('.responseContainer').prepend($html);

                                $html.fadeIn();

                                T.core.analyze({symbol: symbol.Name});
                            }, 500);
                        }
                    }
                }
            },
            currentState = initial === true ? 'start' : getCurrentState(),
            nextState = initial === true ? 'moreInfo' : getNextState();

        saveCurrentState(nextState);
        states[currentState](opts);

        transitions[nextState](opts);
    };

    LookupService.prototype.continueState = function() {
        var currentIndex = _.indexOf(stateOrder, getCurrentState()),
            len = stateOrder.length - 1,
            nextIndex = currentIndex < len ? currentIndex + 1 : 0;

        var tracieState = {
            currentState: stateOrder[nextIndex]
        };

        localStorage['tracieState'] = JSON.stringify(tracieState);
        this.lookup();
    };

    return LookupService;
});