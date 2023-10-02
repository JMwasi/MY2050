<template>
  <div id="warnings">

    <div v-for="warning in warnings"
      class="warning tooltip-holder"
      :key="warning.name"
      :ref="warning.name"
      :aria-describedby="warning.name"
      tabindex="0"
      v-on:mouseenter="allLoseFocus()"
      v-on:keydown.up="focusPrevious($event)"
      v-on:keydown.down="focusNext($event)"
      v-on:keydown.left="focusPrevious($event)"
      v-on:keydown.right="focusNext($event)"
    >
      <img class="warning-img" :src="(warning.active ? warning.imageActive : warning.imageInactive)"/>
      <div :id="warning.name" role="tooltip"
        class="tooltip" :class="{
        'tooltip-red': warning.active,
        'tooltip-blue': !warning.active,
        'tooltip-top': appState.isMobile,
        'tooltip-left': !appState.isMobile}"
      >
        {{warning.text}}
      </div>
    </div>
  </div>
</template>

<script>
import focusGroupMixin from '../mixins/focusGroupMixin.js';

import * as outputsService from '../outputsService.js';
import {warnings} from '../config/warnings.js';

export default {
  name: 'EmissionsBar',
  mixins: [focusGroupMixin],
  props: ['appState'],
  data() {
    return {
      warnings: warnings // need to be reactive
    }
  },
  computed: {
  },
  methods: {
    allLoseFocus() {
      Object.keys(this.$refs).forEach((ref) => {
        this.$refs[ref][0].blur();
      });
    },
    getWarnings() {
      this.warnings.forEach((warning) => {
        if(outputsService.apiData[warning.apiProp]) {
          // console.log('outputsService.apiData ', outputsService.apiData);
          let apiWarning = outputsService.apiData[warning.apiProp];
          let isActive = (apiWarning[0] && apiWarning[0][1]) ? apiWarning[0][1] : false;
          let warnText = (apiWarning[1] && apiWarning[1][1]) ? apiWarning[1][1] : '';
          this.$set(warning, 'active', isActive);
          this.$set(warning, 'text', warnText);
        }
      });
    }
  },
  created() {
    this.getWarnings();
  },
  mounted() {
    // not ideal, a bit too explicit
    // starting from 1, element 0 is the EmissionsBarLight
    this.appState.focusGroup1[1] = this.$refs['warning-l4'][0];
    this.appState.focusGroup1[2] = this.$refs['warning-ex'][0];
    this.appState.focusGroup1[3] = this.$refs['warning-bio'][0];
    // this.appState.focusGroup1[4] = this.$refs['warning-land'];
  },
  beforeDestroy() {
  },
  watch: {
    'appState.lastAPIResponse': function() {
      this.getWarnings();
    }
  }
}
</script>

<style>
#warnings {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.warning {
  width: 25px;
  margin-bottom: 5px;
}
.warning-img {
  display: block;
  width: 100%;
}
.warning-img.active svg path {
  fill: red;
}
#warnings .tooltip-top {
  width: 400px;
}
#warnings .tooltip-left {
  width: 460px;
}
#warnings .tooltip {
  max-width: 65vw;
}
</style>
