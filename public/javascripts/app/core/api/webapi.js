//This is the TradeStation WebAPI JS Client Library
define([
    '../authorization',
    '../settings',
    './priceScaleLookup'
],
    function (auth, settings, performance, priceScaleLookup) {
        var authorization,
            token,
            baseUrl = settings.webApiBaseUrl;

        auth.init();

        token = decodeURIComponent(auth.getToken());

        authorization = 'oauth_token=' + encodeURIComponent(token);

        if (token === null) {
            console.error('missing auth token!');
        }

        return {
            baseUrl : settings.baseUrl,
            security: {

            },
            accounts: {
                balances: function (accountkey) {
                    return $.ajax({
                        url: baseUrl + '/accounts/' + accountkey + '/balances?' + authorization + '&callback=?',
                        dataType: 'jsonp'
                    });
                },
                positions_get: function (accountkey) {
                    $.ajax({
                        url: baseUrl + '/accounts/' + accountkey + '/positions?' + authorization + '&callback=?',
                        dataType: 'json',
                        success: onSuccess
                    });
                },
                orders_get: function (accountkey) {
                    $.ajax({
                        url: baseUrl + '/accounts/' + accountkey + '/orders?' + authorization + '&callback=?',
                        dataType: 'json',
                        success: onSuccess
                    });
                }
            },
            account: {
                positions: function (userid, accountNumber) {
                    var request = {
                        url: baseUrl + '/accounts/' + accountNumber + '/positions?' + authorization + '&callback=?',
                        dataType:'jsonp'
                    };

                    performXhrInterception.positions(request);

                    return $.ajax(request);
                }},
            users: {
                accounts: function (userid, onSuccess) {
                    $.ajax({
                        url: baseUrl + '/users/' + userid + '/accounts?' + authorization,
                        dataType: 'jsonp',
                        success: function(accountNumbers) {
                            ts.core.session.accountNumbers = accountNumbers;
                            onSuccess(accountNumbers);
                        }
                    });
                },
                authorizations: function (onSuccess) {

                    var userid = auth.userid;

                    $.ajax({
                        url: baseUrl + '/users/' + userid + '/authorization?' + 'authorization=go_' + userid + '&callback=?',
                        dataType: 'json',
                        success: onSuccess
                    });
                }
            },
            orders: {
                confirm: function(orderJson, onSuccess) {
                    $.ajax({
                        url: baseUrl + '/jsonp/orders/confirm?data=' + orderJson + '&' + authorization + '&callback=?',
                        dataType: 'json',
                        success: onSuccess,
                        error: function(err) {
                            alert(JSON.stringify(err));
                        }
                    });
                },
                send: function (orderJson, onSuccess) {
                    $.ajax({
                        url: baseUrl + '/jsonp/orders/send?data=' + orderJson + '&' + authorization + '&callback=?',
                        dataType: 'json',
                        // Just pass back the first response since this is a single order
                        success: function(response) {
                            if (response) {
                                onSuccess(response[0]);
                            }
                        }
                    });
                }
            },
            data: {
                quote: function (symbols) {
                    return $.ajax({
                        url: baseUrl + '/data/quote/' + symbols + '?' + authorization + '&callback=?',
                        dataType: 'jsonp'
                    });
                },
                symbolLookup: function(companyName) {
                    return $.ajax({
                        url: baseUrl + '/data/symbols/search/n=' + companyName + '?' + authorization + '&callback=?',
                        dataType: 'jsonp'
                    });
                },
                companyLookup: function(symbol) {
                    return $.ajax({
                        url: baseUrl + '/data/symbols/search/desc=' + symbol + '?' + authorization + '&callback=?',
                        dataType: 'jsonp'
                    });
                }
            }
        };
    });