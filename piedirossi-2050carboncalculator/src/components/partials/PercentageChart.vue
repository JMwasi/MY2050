<template>
  <div class="chart-container">
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
// import revertDataTableAutoFocusMixin from '../../mixins/revertDataTableAutoFocusMixin.js';
import chartUpdateAddSeriesMixin from '../../mixins/chartUpdateAddSeriesMixin.js';

import {sharedChartOptions} from "../../config/highchartsOptions.js";

import highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import accessibility from "highcharts/modules/accessibility";
import seriesLabels from "highcharts/modules/series-label";


export default {
  name: 'PercentageChart',
  mixins: [chartUpdateAddSeriesMixin],
  props: ['chartData', 'appState'], //chartData.title, chartData.timeAxis, chartData.series
  data: function() {
    return {
    }
  },
  watch: {
    chartData: {
      handler() {
        //console.log('output changed LineChart');
        this.updateChart();
      }
      //does't need to be a deep watch, because the whole Object get's replaced
    }
  },
  mounted() {
    var container = this.$refs.chart;

    exporting(highcharts);
    exportData(highcharts);
    accessibility(highcharts);
    seriesLabels(highcharts);

    this.chart = new highcharts.Chart({
      chart: {
        renderTo: container,
        spacingBottom: 12,
        backgroundColor: sharedChartOptions.chart.backgroundColor
        // events: {
        //   redraw: () => {
        //     this.restoreActiveElement();
        //   }
        // }
      },
      credits: {
        enabled: false
      },
      title: {
        text: this.chartData.title
      },
      legend: sharedChartOptions.legend,
      xAxis: {
        tickmarkPlacement: 'on',
        title: {
          enabled: false
        },
        tickInterval: 5 //5 years
      },
      yAxis: {
        labels: {
            format: '{value}%'
        },
        title: {
            enabled: false
        },
        max: 100,
        min: 0
      },
      tooltip: {
        split: true,
        backgroundColor: sharedChartOptions.tooltip.backgroundColor,
        valueDecimals: 0
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#666666'
          }
        },
        series: {
          animation: false,
          pointStart: this.chartData.timeAxis ? this.chartData.timeAxis[0] : undefined
        }
      },
      responsive: sharedChartOptions.responsive,
      exporting: {
        showTable: true,
        accessibility: {enabled: true},
        buttons: {
          contextButton: {
            x: sharedChartOptions.exporting.buttons.contextButton.x,
            y: sharedChartOptions.exporting.buttons.contextButton.y,
            menuItems: [
              // even though a toggle between fixed and free axis doesn't make much sense in this chart type
              // leave it included, so the chart options are consistent over all the different charts
              "printChart",
              "separator",
              "downloadPNG",
              "downloadJPEG",
              "downloadPDF",
              "downloadSVG",
              "separator",
              "downloadCSV",
              "downloadXLS",
              //"viewData",
              //"openInCloud"
            ]
          }
        }
      },
      accessibility: {
        //description: this.chartData.descriptionForScreenReader,
        announceNewData: {
          enabled: true
        }
      },
      series: this.chartData.series
    });
  },
  beforeDestroy() {
    this.chart.destroy();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
