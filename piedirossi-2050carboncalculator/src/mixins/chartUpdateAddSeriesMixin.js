export default {
  methods: {
    addSeries() {
      this.chartData.series.forEach((ser) => {
        this.chart.addSeries(ser);
      });
    },
    updateChart() {
      // if no series was set until now
      if(!this.chart.series.length) {
        this.addSeries();
        return;
      }

      this.chart.update({
        series: this.chartData.series
      });

      // //order new series by Id (can't safely assume that order of this.chartData.series and this.chart.series is identically in all cases)
      // let chartsById = {};
      // this.chartData.series.forEach((ser)=> {
      //   chartsById[ser.id] = ser;
      // });
      //
      // this.chart.series.forEach((charSer)=> {
      //   let source = chartsById[charSer.userOptions.id];
      //   if(source) {
      //     // charSer.setData(source.data, false); //single redraw later
      //     charSer.setData(source.data, false, true, false);
      //     // redraw: false (single redraw later)
      //     // animation: true (only possible, if updated data is the same length as the existing data), so won't work if nullStelle was added or removed
      //     // updatePoints: false, points need to be replaced when length of data changes!, otherwise highcharts keeps old points and shows data which is not there anymore
      //   }
      // });
      // // hide auto-positioned labels before updating, otherwise they fly around in weird directions
      // this.chart.update({ plotOptions: { series: {label: {enabled: false }}}});
      // this.chart.redraw();
      // setTimeout(() => {
      //   // activate auto-positioned labels again
      //   // unfortunately the elegant solution with setting this as a chart.animation.complete callback doesn't work
      //   this.chart.update({ plotOptions: { series: {label: {enabled: true }}}});
      // },350);
    }
  }
}
