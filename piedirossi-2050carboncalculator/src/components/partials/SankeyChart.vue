<template>
  <div class="chart-container">
    <div class="chart sankey-chart" ref="chart"></div>
  </div>
</template>

<script>
// import revertDataTableAutoFocusMixin from '../../mixins/revertDataTableAutoFocusMixin.js';
import chartUpdateAddSeriesMixin from '../../mixins/chartUpdateAddSeriesMixin.js';

import {sharedChartOptions} from "../../config/highchartsOptions.js";

import highcharts from "highcharts";
import sankey from "highcharts/modules/sankey";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import accessibility from "highcharts/modules/accessibility";
import seriesLabels from "highcharts/modules/series-label";

export default {
  name: 'SankeyChart',
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

    sankey(highcharts);
    exporting(highcharts);
    exportData(highcharts);
    accessibility(highcharts);
    seriesLabels(highcharts);

    this.chart = new highcharts.Chart({
      chart: {
        renderTo: container,
        spacingBottom: 1,
        marginBottom: 55,
        backgroundColor: sharedChartOptions.chart.backgroundColor,
        events: {
          // set aria-hidden=true
          // https://www.highcharts.com/forum/viewtopic.php?t=42144
          render: function() {
            if (this.renderer && this.renderer.box) {
              this.renderer.box.setAttribute('aria-hidden', true);
              this.seriesGroup.element.setAttribute('aria-hidden', true);
            }
          }
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<span></span>',
        nodeFormatter: function() {
          console.log('nodeFormatter ', this);
          return '<b>'+this.name+'</b>';
        },
        useHTML: true,
        pointFormatter: function() {
          return '<b>'+this.from + '<span>&rarr;</span> ' + this.to + ' : ' + Math.round(this.weight) + '</b>';
          // console.log('pointFormatter ', this);
        }
        // nodeFormat: '{point.fromNode.name} → {point.toNode.name}: <b>{point.weight}</b><br/>',
        // pointFormatter: '{point.fromNode.name} → {point.toNode.name}: <b>{point.weight}</b><br/>'
      },
      title: {
        text: this.chartData.title
      },
      exporting: {
        showTable: true,
        accessibility: {enabled: true},
        menuItemDefinitions: {
          // Custom definition
        },
        buttons: {
          contextButton: {
            x: sharedChartOptions.exporting.buttons.contextButton.x,
            y: sharedChartOptions.exporting.buttons.contextButton.y,
            menuItems: [
              "printChart",
              "separator",
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
        description: "Graph may give spurious information if the data table option is not activated."
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
.sankey-chart {
  min-height: 500px;
}
.hidden-line {
  opacity: 0;
  pointer-events: none;
}
.sankey-chart .highcharts-tooltip {
  z-index: 9000;
}
</style>
