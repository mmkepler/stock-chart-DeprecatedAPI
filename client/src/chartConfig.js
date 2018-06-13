const chartTheme = {
  accessibility: {
    enabled: true,
    keyboardNavigation: true
  },
  chart: {
    backgroundColor: 'white',
    style: {
      fontFamily: '\'Droid Serif\', sans-serif'
    }
  },
  colors: ['#009799', '#800080', '#ff0000', '#ffa500', '#0000ff'],
  legend: {
    enabled: true,
    align: 'center',
    borderColor: 'black',
    borderWidth: '1',
    backgroundColor: 'white',
    shadow: true,
    },
  rangeSelector: {
    inputBoxBorderColor: 'black',
    inputBoxBackgroundColor: 'white',
    inputStyle: {
    color: 'black',
    }
  }
}

const chartOptions = {
  title: {
    text: 'Stock Chart',
    style: {
      color: 'black',
      fontSize: '20px'
    }
  },
  subtitle: {
    text: 'Choose up to 5 stocks'
  },
  yAxis: {
    labels: {
      formatter: function() {
        return (this.value > 0 ? ' + ' : '') + this.value + '%';
      }
  },
  plotLines: [{
    value: 0,
    width: 2,
    color: 'silver'
    }]
  },

  plotOptions: {
    series: {
      compare: 'percent',
      showInNavigator: true
    }
  },
    tooltip: {
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
    valueDecimals: 2,
    split: true,
    valuePrefix: '$'
  },
  series: []
}

const chartConfig = Object.assign(chartTheme, chartOptions);
export default chartConfig;