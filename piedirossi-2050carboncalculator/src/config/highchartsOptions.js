export var sharedChartOptions = {
  chart: {
    backgroundColor: 'transparent'
  },
  legend: {
    align: 'right',
    verticalAlign: 'middle', //top
    layout: 'vertical',
    // backgroundColor: '#f1f1f1',
    x: 0,
    y: 14,
    width: 200,
    padding: 10,
    symbolHeight: 12,
    itemMarginTop: 0,
    itemMarginBottom: 0,
    useHTML: true,
    itemStyle: {
      fontSize: "14px",
      lineHeight: "16px"
    },
    accessibility: {enabled: false}
  },
  tooltip: {
    backgroundColor: '#ffffff'
  },
  responsive: {
    rules: [{
      condition: {
        maxWidth: 400
      },
      chartOptions: {
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal'
        }
      }
    }]
  },
  accessibility: {
    screenReaderSection: {
      beforeChartFormat: '<h3>{chartTitle}</h3><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div><div>{playAsSoundButton}</div><div>{viewTableButton}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div><div>{annotationsTitle}{annotationsList}</div>'
    }
  },
  exporting: {
    buttons: {
      contextButton: {
        x: 3,
        y: -5
      }
    }
  }
};
