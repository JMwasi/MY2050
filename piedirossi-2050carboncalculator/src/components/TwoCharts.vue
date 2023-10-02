<template>
  <div id="two-charts">
    <div class="single-chart hidden-heading-container" id="chart-one">
      <h4 class="hidden-heading">{{chart1Data.title}}</h4>
      <!-- the :key is important, otherwise charts are not replaced on tab-change,
      instead parts of the data gets replaced (bug) -->
      <component v-bind:is="chartOneComponent"
        v-if="Object.keys(chart1Data).length"
        :chart-data="chart1Data"
        :app-state="appState"
        :key="appState.activeTab"
      ></component>
    </div>
    <div class="single-chart hidden-heading-container" id="chart-two">
      <h4 class="hidden-heading">{{chart2Data.title}}</h4>
      <component v-bind:is="chartTwoComponent"
        v-if="Object.keys(chart2Data).length"
        :chart-data="chart2Data"
        :app-state="appState"
        :key="appState.activeTab"
      ></component>
    </div>
  </div>
</template>

<script>
import * as outputsService from '../outputsService.js';
import {buildLineChartData, buildStackedAreaChartDataWithNegative} from '../chartSeriesBuilders.js';
import {Colors} from '../config/colors.js';

// when using patterns:
// import {getPattern} from '../config/patternFactory.js';



export default {
  name: 'TwoCharts',
  components: {
    'StackedAreaChart': () => import('./partials/StackedAreaChart.vue'),
    'LineChart': () => import('./partials/LineChart.vue'),
    'PercentageChart': () => import('./partials/PercentageChart.vue')
  },
  props: ['appState', 'subtab'],
  data() {
    return {
      chart1Data: {},
      chart2Data: {}
    }
  },
  methods: {
    buildChartData(chartInfo, timeAxis) {
      // Better: move this to external module as a functon with the parameters (chartInfo, lastYearIndex)

      let apiOutputsForThisChartArray = outputsService.apiData[chartInfo.pathwayProperty];

      if(!apiOutputsForThisChartArray) {
        return {};
      }
      // console.log('apiOutputsForThisChartArray  ', apiOutputsForThisChartArray);
      let apiOutputsForThisChartObject = {};

      apiOutputsForThisChartArray.forEach((apiOutputArray) => {
        // the API response has a weird format, the first entry is the title, followed by the actual values
        // these different types of information are separated here
        let outputTitle = apiOutputArray[0];
        let outputValues = apiOutputArray.slice(1);
        apiOutputsForThisChartObject[outputTitle] = outputValues;
      });

      let rawSeries = [];
      let totalSeries;

      chartInfo.outputs.forEach((entry)=> {
        // console.log('entry.id ', entry.id)

        // cut data to length of timeAxis
        let data = apiOutputsForThisChartObject[entry.id].slice(0,timeAxis.length);

        if(!data) {
          return;
        }

        if(entry.isTotal) {
          totalSeries = {
            type: 'line',
            name: entry.id,
            id: entry.id,
            color: 'black',
            data: data.map((value, index) => [timeAxis[index], value])
          }
          return;
        }

        let singleSeries = {
          name: entry.id,
          id: entry.id,
          data: data
        };

        if(entry.color && Colors[entry.color]) {
          singleSeries.color = Colors[entry.color];

          // if patterns are used:
          // if(entry.pattern) {
          //   singleSeries.color = getPattern(entry.pattern,Colors[entry.color]);
          //   // disable the series label on the pattern:
          //   singleSeries.label = {enabled: false};
          // } else {
          //   singleSeries.color = Colors[entry.color];
          // }
        }

        rawSeries.push(singleSeries);
      });



      let formattedSeries;
      if(chartInfo.chart.component === "StackedAreaChart") {
        formattedSeries = buildStackedAreaChartDataWithNegative(timeAxis, rawSeries);
        if(totalSeries) {
          formattedSeries.push(totalSeries);
        }
      }
      if(chartInfo.chart.component === "LineChart" || chartInfo.chart.component === "PercentageChart") {
        formattedSeries = buildLineChartData(timeAxis, rawSeries);
      }

      let chartData = {
        series: formattedSeries,
        title: chartInfo.chart.title,
        unit: chartInfo.chart.unit,
        yMax: chartInfo.chart.yMax,
        yMin: chartInfo.chart.yMin,
        timeAxis: timeAxis
      }

      if(chartData) {
        return chartData;
      }
      //possible to add color info, css classes, sort the series etc
    }
  },
  computed: {
    chartOne() {
      return outputsService.charts[this.subtab.charts[0]];
    },
    chartTwo() {
      return outputsService.charts[this.subtab.charts[1]];
    }
  },
  created() {

    this.chartOneComponent = this.chartOne.chart.component;
    this.chartTwoComponent = this.chartTwo.chart.component;

    this.chart1Data = this.buildChartData(this.chartOne, outputsService.getCurrentTimeAxis());
    this.chart2Data = this.buildChartData(this.chartTwo, outputsService.getCurrentTimeAxis());
  },
  watch: {
    'appState.lastAPIResponse': function() {
      // update charts on api change
      this.chart1Data = this.buildChartData(this.chartOne, outputsService.getCurrentTimeAxis());
      this.chart2Data = this.buildChartData(this.chartTwo, outputsService.getCurrentTimeAxis());
    },
    'appState.activeTab': function() {
      this.chart1Data = this.buildChartData(this.chartOne, outputsService.getCurrentTimeAxis());
      this.chart2Data = this.buildChartData(this.chartTwo, outputsService.getCurrentTimeAxis());
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#two-charts {
  height: 100%;
  padding-right: 70px;
}

.single-chart {
  position: relative;
  height: 50%;
  min-height: 235px;
}
#chart-one {

}
#chart-two {

}
.chart {
  position: absolute;
  top: 8px;
  left: 15px;
  width: calc(100% - 30px);
  height: calc(100% - 16px);
  /* border makes interface look too complicated
  any chart background-color doesn't look nice, white is best for charts.
  box shadow groups content, looks subtle and doesn't make things look complicated*/
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
}
</style>
