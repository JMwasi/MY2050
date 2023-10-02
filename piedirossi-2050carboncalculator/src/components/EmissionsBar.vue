<template>
  <div class="gauge">
    <div class="gauge-title">
      CO<sub>2</sub> Reduction in 2050
    </div>
    <div class="gauge-chart-cont" v-if="typeof value !== 'undefined'">
      <div class="gauge-ticks">
        <div class="gauge-tick gauge-long-tick" style="top: calc(0% - 9px);"><span>1990</span></div>
        <div class="gauge-tick gauge-short-tick" style="top: calc(10% - 10px);"></div>
        <div class="gauge-tick gauge-short-tick" style="top: calc(20% - 10px);"></div>
        <div class="gauge-tick gauge-short-tick" style="top: calc(30% - 10px);"></div>
        <div class="gauge-tick gauge-short-tick" style="top: calc(40% - 10px);"></div>
        <div class="gauge-tick gauge-short-tick" style="top: calc(50% - 10px);"></div>
        <div class="gauge-tick gauge-short-tick" style="top: calc(60% - 10px);"></div>
        <div class="gauge-tick gauge-short-tick" style="top: calc(70% - 10px);"></div>
        <div class="gauge-tick gauge-long-tick" style="top: calc(80% - 10px);"><span>-80%</span></div>
        <div class="gauge-tick gauge-short-tick" style="top: calc(90% - 10px);"></div>
        <div class="gauge-tick gauge-long-tick" style="top: calc(100% - 11px);"><span>-100%</span></div>
      </div>
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
            <span>{{value}}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as outputsService from '../outputsService.js';

export default {
  name: 'EmissionsBar',
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
  height: 400px;
  width: 120px;
  padding-right: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.gauge-chart-cont {
  display: flex;
  height: 100%;
  margin-top: 20px;
}
.gauge-ticks {
  flex-grow: 1;
  position: relative;
}
.gauge-tick {
  position: absolute;
  left: 0px;
  height: 20px;
  width: 100%;
  display: flex;
  align-items: center;
}
.gauge-tick::after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
  height: 1px;
  width: 15px;
  background-color: #a7b9ca;
  /* background-color: transparent; */
}
.gauge-long-tick::after {
  background-color: #003366;
}
.gauge-bar-cont {
  flex: none;
  width: 20px;
  height: 100%;
  position: relative;
}
.gauge-bar {
  height: 100%;
  width: 100%;
  background-color: #003366;
  border-radius: 4px;
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
}
.gauge-mark {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translate(-50%,-50%);
  width: calc(100% + 24px);
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
