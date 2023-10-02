<template>
  <div id="outputs">
    <h2 class="hidden-heading">Outputs</h2>
    <div v-if="!appState.isMobile" id="output-tabs">
      <TabNavigation :tabs="tabs" :tab-index="appState.activeTab" title-prop="title" :callback="selectTab"
        single-tab-id-base="selected-tab-" aria-controls-attribute="output-charts"
      />
    </div>
    <div id="output-charts"
      aria-live="polite"
      :aria-labelledby="'selected-tab-'+appState.activeTab"
    >
      <div id="subtab-menu">
        <div v-for="(subtab, ind) in selTab.subtabs"
          class="subtab-menu-item"
          :class="{selected: ind === appState.activeSubtab}"
          :id="'selected-subtab-'+appState.activeSubtab"
          role="button" aria-controls="charts"
          :aria-current="(ind === appState.activeSubtab) ? 'true' : 'false'"
          v-on:mousedown.prevent="()=>{}"
          v-on:click.prevent="selectSubtab(ind)"
          v-on:keyup.enter="selectSubtab(ind)"
          tabindex="0"
          :key="subtab.title"
        >
          {{subtab.title}}
        </div>
      </div>

      <div id="charts"
        aria-live="polite"
        :aria-labelledby="'selected-subtab-'+appState.activeSubtab"
      >
        <h3 class="hidden-heading">{{selTab.title}} - {{selSubtab.title}}</h3>
        <!-- v-if="appState.userAction.indexOf('tabChange') < 0" initially necessary so that component immediately disappears on a tab-change
        still necessary here?-->
        <component v-bind:is="chartComponent" v-if="appState.userAction.indexOf('tabChange') < 0"
          :app-state="appState"
          :subtab="selSubtab"
          :key="selSubtab.title"
        ></component>

        <div id="emissions-warnings">
          <h4 class="hidden-heading">Total Emissions and Warnings</h4>
          <EmissionsBarMobile v-if="appState.isMobile" :app-state="appState"/>
          <EmissionsBarLight v-if="!appState.isMobile" :app-state="appState"/>
          <div id="warnings-container">
            <Warnings :app-state="appState"/>
          </div>
        </div>

      </div>

    </div>
    <Loading :open="appState.requestsPending > 0"/>
  </div>
</template>

<script>
import * as dataService from '../dataService.js';
import * as outputsService from '../outputsService.js';

import TabNavigation from './tabnavigation/TabNavigation.vue';
import EmissionsBarLight from './EmissionsBarLight.vue';
import Warnings from './Warnings.vue';
import Loading from './lib/Loading.vue';

import {Metadata} from '../config/metadata.js';

export default {
  name: 'Outputs',
  props: ['appState'],
  metaInfo() {
    return { title: Metadata[this.appState.activeTab][this.appState.activeSubtab].title }
  },
  components: {
    TabNavigation,
    EmissionsBarLight,
    Warnings,
    Loading,
    'EmissionsBarMobile' : () => import('./EmissionsBarMobile.vue'),
    'TwoCharts': () => import('./TwoCharts.vue'),
    'MapChart': () => import('./partials/MapChart.vue'),
    'Flows': () => import('./partials/Flows.vue')
    // 'OutputTesting':  () => import('./OutputTesting.vue')
  },
  // data() {
  //   return {
  //     activeTab: 0
  //   }
  // },
  created() {
    this.tabs = outputsService.tabs;
    // console.log('created ', this.tabs);
  },
  computed: {
    selTab() {
      return outputsService.tabs[this.appState.activeTab];
    },
    selSubtab() {
      return this.selTab.subtabs[this.appState.activeSubtab];
    },
    chartComponent() {
      return this.selSubtab.component;
    }
  },
  methods: {
    selectTab(ind) {
      if(ind === this.appState.activeTab) {
        return;
      }
      outputsService.selectTab(ind, 0);
      dataService.updateURL();
    },
    selectSubtab(ind) {
      outputsService.selectSubtab(ind);
      dataService.updateURL();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#outputs {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative; /*for automatic z-index,
  otherwise input-footer is not covered by box-shadow of #output-charts.
  But when giving position:relative to #outputs-charts, the little bar in TabNav
  won't overlap #output-charts anymore, that's why it's here*/
  z-index: 101;
}
#output-tabs {
  flex: none;
  box-sizing: border-box;
  width: 100%;
  height: 85px;
  background: linear-gradient(to top right, #00639c 0%, #0b7db9 100%);
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom: 5px solid #99cc00;
}
#output-charts {
  flex-grow: 1;
  background-color: white;
  border-top-left-radius: 3px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
}
#subtab-menu {
  flex: none;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  margin-left: 15px;
  margin-top: 11px;
  margin-bottom: 7px;
}
.subtab-menu-item {
  padding: 5px 0px;
  margin: 0px 10px;
  text-align: center;
  cursor: pointer;
  font-size: 18px;
  position: relative;
}
.subtab-menu-item::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  width: 100%;
  height: 2px;
  background-color: #003366;
  transform-origin: left;
  transform: scaleX(0);
}
.subtab-menu-item.selected {
  color: #003366;
}
.subtab-menu-item.selected::after {
  transform: scaleX(1);
  transition: transform 0.3s ease;
}
#charts {
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
}
#emissions-warnings {
  position: absolute;
  top: 15px;
  right: 18px;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3px;
}
#warnings-container {
  margin-top: 31px;
  width: 30px;
}
</style>
