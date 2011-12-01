define([
    './data/stock-basic-line',
    //'highcharts',
    'highstock'
], function(dataSource) {
    return {
        buildStockChart: function(renderTo) {
            var stockChart = new window.Highcharts.StockChart({
                chart : {
                    renderTo : renderTo
                },

                rangeSelector : {
                    inputEnabled : false,
                    selected : 1
                },

                xAxis : {
                    maxZoom : 14 * 24 * 3600000 // fourteen days
                },

                scrollbar: {
                    enabled: false
                },
                zoomType: {
                    reflow: false
                },
                series : [
                    {
                        name : 'AAPL',
                        data : dataSource.data,
                        tooltip: {
                            yDecimals: 2
                        }
                    }
                ]
            });

            stockChart.setSize(455, 300);
            stockChart = null;
        }
    };
});