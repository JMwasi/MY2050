<template>
  <div class="chart-container">
    <div class="chart" :class="{'fixed-axis': axisFixed, 'free-axis': !axisFixed}" ref="chart"></div>
  </div>
</template>

<script>
// import revertDataTableAutoFocusMixin from '../../mixins/revertDataTableAutoFocusMixin.js';
import chartFixFreeAxisMixin from '../../mixins/chartFixFreeAxisMixin.js';
import chartUpdateAddSeriesMixin from '../../mixins/chartUpdateAddSeriesMixin.js';

import {sharedChartOptions} from "../../config/highchartsOptions.js";

import highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import accessibility from "highcharts/modules/accessibility";
import seriesLabels from "highcharts/modules/series-label";


export default {
  name: 'LineChart',
  mixins: [chartFixFreeAxisMixin, chartUpdateAddSeriesMixin],
  // mixins: [revertDataTableAutoFocusMixin],
  props: ['chartData', 'appState'], //chartData.title, chartData.timeAxis, chartData.series
  data: function() {
    return {
      // axisFixed: false
      axisFixed: (typeof this.chartData.yMin !== 'undefined') ? true : false
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
        title: {
          text: this.chartData.unit
        },
        min: (typeof this.chartData.yMin !== 'undefined') ? this.chartData.yMin : undefined,
        max: (typeof this.chartData.yMax !== 'undefined') ? this.chartData.yMax : undefined
      },
      tooltip: {
        split: true,
        backgroundColor: sharedChartOptions.tooltip.backgroundColor,
        padding: 5,
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
        menuItemDefinitions: {
          // Custom definition
          fixAxis: {
            onclick: this.fixAxis,
            text: 'Fixed axis'
          },
          freeAxis: {
            onclick: this.freeAxis,
            text: 'Auto axis'
          }
        },
        buttons: {
          contextButton: {
            x: sharedChartOptions.exporting.buttons.contextButton.x,
            y: sharedChartOptions.exporting.buttons.contextButton.y,
            menuItems: [
              "fixAxis",
              "freeAxis",
              "separator",
              // "printChart",
              // "separator",
              "downloadPNG",
              // "downloadJPEG",
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
