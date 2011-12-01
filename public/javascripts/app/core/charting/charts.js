define([
    'highcharts'
], function() {
    return {
        buildCharts: function(renderTo) {
            var chart = new window.Highcharts.Chart({
                chart: {
                    renderTo: renderTo,
                    backgroundColor: 'rgba(0,0,0,0)',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Twitter'
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function() {
                                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                            }
                        }
                    }
                },
                series: [
                    {
                        type: 'pie',
                        name: '',
                        data: [
                            {
                                name: 'Positive',
                                y: 36.8,
                                color: 'rgba(55, 196, 55, 1)'
                            },
                            {
                                name: 'Negative',
                                y: 63.2,
                                color: 'rgba(211, 0, 0, .8)'
                            }
                        ]
                    }
                ]});

            chart.setSize(150, 150);
            window.Highcharts = null;
        }
    };
});