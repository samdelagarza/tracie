define([
    './api/webapi'
], function(webapi) {
    return {
        companyLookup: function(companyName) {
            var deferred = new $.Deferred(),
                promise = deferred.promise();

            promise = webapi.data.companyLookup(companyName);

            return promise;
        },
        symbolLookup: function(sym) {
            var deferred = new $.Deferred(),
                promise = deferred.promise();

            promise = webapi.data.symbolLookup(sym);

            return promise;
        },
        getQuote: function(sym) {
            return webapi.data.quote([sym]);
        },
        getMyPositions: function(account, sym) {
            return [
                {
                    symbol: sym.toUpperCase(),
                    shares: '50,000',
                    value: '$250,302',
                    profitLoss: '-$34,028'
                }
            ];
        }
    };
});