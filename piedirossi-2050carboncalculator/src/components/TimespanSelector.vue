<template>
  <div class="timespan-selector" :class="{'default-values':  lever.startdate === lever.defaultstart && lever.enddate === lever.defaultend}">
    <RangeSlider
      :min-value="2020"
      :max-value="2100"
      :start-value="lever.startdate"
      :end-value="lever.enddate"
      :step-size="5"
      :min-range-factor="2"
      :input-fields="false"
      :deactivated="appState.requestsPending > 0"
      :callback="setLeverRange"
      :hide-labels="(lever.startdate === lever.defaultstart && lever.enddate === lever.defaultend)"
    />
  </div>
</template>

<script>

import * as dataService from '../dataService.js';
import * as inputsService from '../inputsService.js';

import RangeSlider from './lib/RangeSlider.vue';

export default {
  name: 'TimespanSelector',
  components: {
    RangeSlider
  },
  props: ['lever', 'appState'],
  data() {
    return {
    }
  },
  methods: {
    setLeverRange(starttime, endtime) {
      //abort if params already match the current state
      if(this.lever.startdate === starttime && this.lever.enddate === endtime) {
        return;
      }

      inputsService.setLeverTimeRange(this.lever.id, starttime, endtime);

      //Desktop only
      if(!this.appState.isMobile) {
        dataService.updateURL(dataService.createURLParam());
        dataService.fetchData(this.appState.inputLatency);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.timespan-selector {
  height: 22px;
}
.timespan-selector.default-values .range-slider-track {
  background-color: #e6e6e6;
}
.timespan-selector.default-values .range-slider-range {
  background-color: #bfbfbf;
}
.timespan-selector.default-values .range-slider-knob {
  background-color: #bfbfbf;
  border: 1px solid grey;
}

/*give the range-slider labels a width in full pixel, so the range-track also has an integer value in pixel (important for vertical year-lines)*/
.range-slider-start, .range-slider-end {
  flex: none;
  width: 36px;
}
</style>
