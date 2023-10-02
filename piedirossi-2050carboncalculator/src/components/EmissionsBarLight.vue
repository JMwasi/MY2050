<template>
  <div class="gauge tooltip-holder"
    aria-describedby="gauge-description"
    tabindex="0"
    ref="gauge"
    v-on:keydown.up="focusPrevious($event)"
    v-on:keydown.down="focusNext($event)"
    v-on:keydown.left="focusPrevious($event)"
    v-on:keydown.right="focusNext($event)"
  >
    <!-- use horizontal gauge on mobile devices -->
    <div class="gauge-chart-cont" v-if="typeof value !== 'undefined'">
      <div class="gauge-tick" style="top: calc(0% - 10px);"><span>1990</span></div>
      <!-- <div class="gauge-tick" style="top: calc(80% - 10px);"><span>-80%</span></div>
      <div class="gauge-tick" style="top: calc(100% - 11px);"><span>-100%</span></div> -->
      <div class="gauge-bar-cont">
        <div class="gauge-bar">
          <div class="gauge-empty"
            :style="{'transform': 'scaleY('+value/100+')'}"
          ></div>
        </div>
        <div class="gauge-mark-cont"
          :style="{'transform': 'translateY(-'+markPosition+'%)'}"
        >
          <div class="gauge-mark">
            <span>-{{value}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tooltip tooltip-blue tooltip-left" style="width: 150px;">
      <!-- set width specifically, the tooltip classes are for general behaviour -->
      <span>CO<sub>2</sub>e Reduction in 2050 compared to 1990</span>
    </div>
    <div id="gauge-description" class="hidden">
      <span>CO<sub>2</sub>e Reduction in 2050 compared to 1990. Current value: -{{value}} %</span>
    </div>
  </div>
</template>

<script>
import focusGroupMixin from '../mixins/focusGroupMixin.js';

import * as outputsService from '../outputsService.js';

export default {
  name: 'EmissionsBarLight',
  mixins: [focusGroupMixin],
  props: ['appState'],
  data() {
    return {
      value: undefined
    }
  },
  computed: {
    markPosition() {
      return 100-(this.value > 100 ? 100 : this.value);
    }
  },
  methods: {
    setValue() {
      // console.log('setValue ', outputsService.apiData.mEreduction)
      if(outputsService.apiData.mEreduction && outputsService.apiData.mEreduction[1]) {
        this.value = Math.round(100*(1 - outputsService.apiData.mEreduction[1][1]));
      }
    }
  },
  created() {
    this.setValue();
    console.log('EmissionsBarLight ', focusGroupMixin);
  },
  mounted() {
    this.appState.focusGroup1[0] = this.$refs['gauge'];
  },
  beforeDestroy() {
  },
  watch: {
    'appState.lastAPIResponse': function() {
      this.setValue();
    }
  }
}
</script>

<style>
.gauge {
  height: 270px;
  width: 20px;
}
.gauge-chart-cont {
  height: 100%;
  position: relative;
}
.gauge-bar-cont {
  width: 20px;
  height: 100%;
  position: relative;
}
.gauge-bar {
  height: 100%;
  width: 100%;
  background-color: #003366;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}
.gauge-empty {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  transform-origin: 0 0;
  transition: transform 0.2s ease;
  background-color: #ccd6e0;
}
.gauge-mark-cont {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  transform-origin: 0 0;
  transition: transform 0.2s ease;
  pointer-events: none;
}
.gauge-mark {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translate(-50%,-50%);
  width: calc(100% + 32px);
  height: 30px;
  text-align: center;
  border: 1px solid #555559;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gauge-tick {
  position: absolute;
  /* right: calc(100% + 14px); */
  left: 50%;
  transform: translateX(-50%);
  padding: 1px 3px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #ccd6e0; */
  background-color: white;
  border: 1px solid #555559;
  border-radius: 4px;
  z-index: 10;
  min-width: 40px;
  box-sizing: border-box;
  /* border-right: none; */
}
/* .gauge-tick::after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 11px 0 11px 11px;
  border-color: transparent transparent transparent #003366;
} */

</style>
