<template>
  <div class="gauge-horizontal">
    <div class="gauge-horizontal-title">
      CO<sub>2</sub> Reduction in 2050 compared to 1990:
    </div>
    <div class="gauge-horizontal-chart-cont" v-if="typeof value !== 'undefined'">
      <div class="gauge-horizontal-bar-cont tooltip-holder"
        aria-describedby="gauge-description"
        tabindex="0"
        ref="gauge"
        v-on:keydown.up="focusPrevious($event)"
        v-on:keydown.down="focusNext($event)"
      >
        <div class="gauge-horizontal-bar">
          <!-- gauge-horizontal-empty needs to have width 100% so that scaleX works in parent percent -->
          <div class="gauge-horizontal-empty"
            :style="{'transform': 'scaleX('+value/100+')'}"
          ></div>
        </div>
        <!-- gauge-horizontal-mark-cont needs to have width 100% so that translateX works in parent percent -->
        <div class="gauge-horizontal-mark-cont"
          :style="{'transform': 'translateX('+markPosition+'%)'}"
        >
          <div class="gauge-horizontal-mark">
            <span>-{{value}}%</span>
          </div>
        </div>
        <div class="tooltip tooltip-blue tooltip-top" style="width: 200px;">
          <!-- set width specifically, the tooltip classes are for general behaviour -->
          <span>CO<sub>2</sub>e Reduction in 2050 compared to 1990</span>
        </div>
        <div id="gauge-description" class="hidden">
          <span>CO<sub>2</sub>e Reduction in 2050 compared to 1990. Current value: -{{value}} %</span>
        </div>
      </div>

      <!-- <div class="gauge-horizontal-ticks">
        <div class="gauge-horizontal-tick gauge-horizontal-long-tick" style="left: 0%;"><span>-100%</span></div>
        <div class="gauge-horizontal-tick gauge-horizontal-short-tick" style="left: 10%;"></div>
        <div class="gauge-horizontal-tick gauge-horizontal-long-tick" style="left: 20%;"><span>-80%</span></div>
        <div class="gauge-horizontal-tick gauge-horizontal-short-tick" style="left: 30%;"></div>
        <div class="gauge-horizontal-tick gauge-horizontal-short-tick" style="left: 40%;"></div>
        <div class="gauge-horizontal-tick gauge-horizontal-short-tick" style="left: 50%;"></div>
        <div class="gauge-horizontal-tick gauge-horizontal-short-tick" style="left: 60%;"></div>
        <div class="gauge-horizontal-tick gauge-horizontal-short-tick" style="left: 70%;"></div>
        <div class="gauge-horizontal-tick gauge-horizontal-short-tick" style="left: 80%;"></div>
        <div class="gauge-horizontal-tick gauge-horizontal-short-tick" style="left: 90%;"></div>
        <div class="gauge-horizontal-tick gauge-horizontal-long-tick" style="left: calc(100% - 1px);"><span>1990</span></div>
      </div> -->
    </div>

  </div>
</template>

<script>
import * as outputsService from '../outputsService.js';

export default {
  name: 'EmissionsBarMobile',
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
.gauge-horizontal {
  /* width: 400px; */
  padding-right: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
  /* overflow: hidden; */
}
.gauge-horizontal-chart-cont {
  /* display: flex; */
  height: 100%;
  padding: 0px 30px;
  box-sizing: border-box;
  margin-top: 10px;
}
.gauge-horizontal-ticks {
  /* flex-grow: 1; */
  height: 10px;
  position: relative;
}
.gauge-horizontal-tick {
  position: absolute;
  top: 3px;
  height: 10px;
  width: 1px;
  background-color: #a7b9ca;
  background-color: transparent;
}
.gauge-horizontal-long-tick {
  background-color: #003366;
}
.gauge-horizontal-tick span {
  position: absolute;
  top: 50%;
  left: 0;
  /* transform: translateX(-50%); */
  padding-top: 1px;
}
.gauge-horizontal-tick:last-child span {
  left: auto;
  right: 2px;
}
.gauge-horizontal-bar-cont {
  /* flex: none; */
  /* width: 20px; */
  /* height: 100%; */
  height: 20px;
  position: relative;
}
.gauge-horizontal-bar {
  height: 100%;
  width: 100%;
  background-color: #003366;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
.gauge-horizontal-empty {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  transform-origin: top right;
  transition: transform 0.2s ease;
  background-color: #ccd6e0;
}
.gauge-horizontal-mark-cont {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  transform-origin: 0 0;
  transition: transform 0.2s ease;
}
.gauge-horizontal-mark {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  padding: 0px 2px;
  height: 30px;
  text-align: center;
  border: 2px solid grey;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
