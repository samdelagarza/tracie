//This is the TradeStation Streaming WebAPI JS Client Library
define([
    './authorization',
    'settings',
    './priceScaleLookup',
    'socket.io'
],
    function (auth, settings, priceScaleLookup) {
        var wsurl = settings.webSocketUrl, __socket;

        __socket = io.connect(wsurl, { port: settings.webSocketPort });

        function getStreamPromise(url) {
            var urlWithNoToken = url.split('?')[0],
                deferred = new $.Deferred(),
                promise = deferred.promise();
            promise.dataCallbacks = [];
            promise.errorCallbacks = [];
            promise.abort = function () {
                __socket.send("STOP:" + url);
                promise.dataCallbacks = null;
                return promise;
            };
            promise.data = function(callback) {
                promise.dataCallbacks.push(callback);
                return promise;
            };
            promise.error = function(callback) {
                promise.errorCallbacks.push(callback);
                return promise;
            };
            __socket.on('message', function (data) {
                var d, callbacksLength, i;
                try {
                    if ((data.id === urlWithNoToken || data.id === url) && data.chunk !== "" && data.chunk !== "END") {
                        d = JSON.parse(data.chunk);
                        if (!!data.chunk.Error) {
                            if (!!promise.errorCallbacks && promise.errorCallbacks.length > 0) {
                                callbacksLength = promise.errorCallbacks.length;
                                for (i = 0; i < callbacksLength; i++) {
                                    promise.errorCallbacks[i](d);
                                }
                            }
                        }
                        else if (!!promise.dataCallbacks && promise.dataCallbacks.length > 0) {
                            callbacksLength = promise.dataCallbacks.length;
                            for (i = 0; i < callbacksLength; i++) {
                                promise.dataCallbacks[i](d);
                            }
                        }
                    }
                    else if (data.chunk === "END") {
                        deferred.resolve();
                    }
                }
                catch (e) {
                    deferred.reject({ error: e, stack: e.stack, data: data.chunk });
                    console.error({ error: e, stack: e.stack, data: data.chunk });
                    promise.dataCallbacks = null;
                }
            });

            __socket.send(url);

            return promise;
        }

        function buildAuthString() {
            var authorization, token;
            if (settings.bypassAuth) {
                authorization = 'authorization=go';
                token = 'not null';
            }
            else {
                token = auth.__token;
                authorization = 'oauth_token=' + token;
            }
            return authorization;
        }
        return {
            getIsConnected: function () {
                return __socket.socket.connected;
            },
            data: {
                quoteSnapshots: function(symbols) {
                    var url = settings.webApiBaseUrl + "/stream/quote/snapshots/" + symbols + "?" + buildAuthString();
                    return getStreamPromise(url).data(priceScaleLookup);
                },
                quoteChanges: function (symbols) {
                    var url = settings.webApiBaseUrl + "/stream/quote/changes/" + symbols + "?" + buildAuthString();
                    return getStreamPromise(url).data(priceScaleLookup);
                },
                barchart: function(criteria) {
                    var url = settings.webApiBaseUrl + "/stream/barchart/" + criteria + "?" + buildAuthString();
                    return getStreamPromise(url);
                }
            },
            automation: {
                instances: function (instanceid) {
                    var url = settings.webapibaseurl + "/stream/automation/instances/" + instanceid + "?" + buildAuthString();
                    return getStreamPromise(url);
                }
            }
        };
    });