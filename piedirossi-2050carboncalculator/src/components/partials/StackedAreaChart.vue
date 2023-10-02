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
// import patternFill from "highcharts/modules/pattern-fill";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import accessibility from "highcharts/modules/accessibility";


//https://api.highcharts.com/highcharts/plotOptions.series.label
//Series labels are placed as close to the series as possible in a natural way, seeking to avoid other series.
//The goal of this feature is to make the chart more easily readable, like if a human designer placed the labels in the optimal position.
import seriesLabels from "highcharts/modules/series-label";

export default {
  name: 'StackedAreaChart',
  mixins: [chartFixFreeAxisMixin, chartUpdateAddSeriesMixin],
  props: ['chartData', 'appState'], //chartData.title, chartData.timeAxis, chartData.series
  data: function() {
    return {
      axisFixed: (typeof this.chartData.yMin !== 'undefined') ? true : false
    }
  },
  watch: {
    chartData: {
      handler() {
        // console.log('output changed StackedAreaChart');
        this.updateChart();
      }
      //does't need to be a deep watch, because the whole Object gets replaced
    }
  },
  created() {
    // console.log('StackedAreaChart ', this.chartData);
    this.activeElement = undefined;
  },
  mounted() {

    window.activeEle = undefined;
    window.activeEleHasBlurListener = undefined;
    var container = this.$refs.chart;

    //activate highcharts plugins
    // patternFill(highcharts);
    exporting(highcharts);
    exportData(highcharts);
    accessibility(highcharts);
    seriesLabels(highcharts);

    this.chart = new highcharts.Chart({
      chart: {
        renderTo: container,
        type: 'area',
        spacingBottom: 12,
        animation: {
          duration: 300
        },
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
        max: (typeof this.chartData.yMax !== 'undefined') ? this.chartData.yMax : undefined,
        // min: undefined,
        // max: undefined,
        maxPadding: 0,
        plotLines: [{
          value: 0,
          color: 'black',
          dashStyle: 'solid',
          width: 2
        }]
      },
      // navigation: {
      //   buttonOptions: {
      //     align: 'left',
      //     // x: -217,
      //     // y: 0
      //     x: 21
      //   }
      // },
      tooltip: {
        // animation: false
        // split: true,
        backgroundColor: sharedChartOptions.tooltip.backgroundColor,
        // useHTML: true,
        padding: 5,
        valueDecimals: 0,
        style: {
          fontSize: '14px'
        },
        // headerFormat: '<span>{point.key}</span><br/>', //the default header-format sets the font-size to 10px!
        formatter: function() {
          // the first returned item is the header (x-label), subsequent items are the points
          if(this.point.noTooltip) {
            return false;
          }

          return ['<span><b>'+this.point.x+'</b></span><br/>',this.point.series.name + ': <b>' + Math.round(this.point.y)+'</b>'];
        }
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: 'white',
          lineWidth: 1,
          trackByArea: true,
          stickyTracking: false,
          connectNulls: true, // important, otherwise the areas connecting to null values can be cut off
        },
        line: {
          // stickyTracking: false
          // findNearestPointBy: 'x'
        },
        series: {
          animation: false,
          marker: {
            enabled: false,
            radius: 0 //necessary, because the accessibility module shows unwanted markers for nullstellen
          },
          states: {
            hover: {
              // enabled: false
            },
            inactive: {
              opacity: 1
            }
          },
          label: {
            // enabled: false
          },
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
      //series is an array of series-objects,
      //on data-update each single series has to be updated with Highcharts setData()
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
