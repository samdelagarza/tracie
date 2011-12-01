define([], function () {
    var scale = {
        '1' :1,
        '2' :0.1,
        '3' :0.01,
        '4' :0.001,
        '5' :0.0001,
        '6' :0.00001,
        /*'7' ://simplest fraction??? */
        '8' : 0.5,
        '9' : 0.25,
        '10' : 0.125,
        '11' :0.0625,
        '12' : 0.03125,
        '13' :0.015625,
        '14' :0.0078125,
        '15' :0.003906250,
        '16' :0.025,
        '17' :0.015625,
        '18' :0.0078125,
        '19' :0.00390625,
        '20' :0.003125,
        '21' :0.0078125,
        '22' :0.0015625,
        '23' : 0.000001
    };
    return function (quote) {
        if (!!quote.DisplayType) {
            quote.PriceScale = scale[quote.DisplayType];
        }
        if (_.isArray(quote)) {
            var len = quote.length, x = 0;
            for (; x < len; x++) {
                if (!!quote[x].DisplayType) {
                    quote[x].PriceScale = scale[quote[x].DisplayType];
                }
            }
        }
    };
});
