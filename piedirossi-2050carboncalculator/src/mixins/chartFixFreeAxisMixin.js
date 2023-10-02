export default {
  methods: {
    fixAxis() {
      let currMax = typeof this.chartData.yMax !== 'undefined' ? this.chartData.yMax : this.chart.yAxis[0].max;
      let currMin = typeof this.chartData.yMin !== 'undefined' ? this.chartData.yMin : this.chart.yAxis[0].min;

      // console.log('fixAxis ', currMax, currMin, this.chartData.yMax, this.chartData.yMin);
      this.axisFixed = true;

      // Highcharts still rounds to the next full values
      this.chart.yAxis[0].update({
        max: currMax,
        min: currMin
      });

    },
    freeAxis() {
      // console.log('freeAxis');
      this.axisFixed = false;

      // Highcharts now automatically calculates the value
      this.chart.yAxis[0].update({
        max: null,
        min: null
      });
    }
  }
}
