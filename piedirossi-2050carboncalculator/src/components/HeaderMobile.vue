<template>
  <div id="header-mobile">
    <div id="header-mobile-main">
      <a id="page-title" href="/" class="wrapper-link">
        <h2>MACKAY CARBON CALCULATOR</h2>
      </a>
      <!-- <img class="cursor-pointer" src="/img/info-i_darkblue.svg"> -->
      <a href="https://www.gov.uk/guidance/carbon-calculator" target="_blank" rel="noopener" class="wrapper-link">
        <img class="cursor-pointer" src="/img/info-i_darkblue.svg">
      </a>
    </div>

    <div v-if="appState.isMobile" id="output-tabs">
      <TabNavigation :tabs="tabs" :tab-index="appState.activeTab" title-prop="title" :callback="selectTab"/>
    </div>

  </div>
</template>

<script>
import * as dataService from '../dataService.js';
import * as outputsService from '../outputsService.js';

import TabNavigation from './tabnavigation/TabNavigation.vue';

export default {
  name: 'HeaderMobile',
  props: ['appState'],
  components: {
    TabNavigation
  },
  data() {
    return {
      tabs: [
        {title: 'Overview'},
        {title: 'Transport'},
        {title: 'Buildings'},
        {title: 'Industry'},
        {title: 'CO2 Removal & Gases'},
        {title: 'Electricity'},
        {title: 'Land Use & Bioenergy'},
        {title: 'Imports, Map & Flows'}
      ]
    }
  },
  created() {

  },
  computed: {
  },
  methods: {
    selectTab(ind) {
      if(ind === this.appState.activeTab) {
        return;
      }
      outputsService.selectTab(ind, 0);
      dataService.updateURL();
    }
  },
  mounted() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#header-mobile {
  position: fixed;
  z-index: 111;
  top: 0px;
  left: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.4);
}
#header-mobile-main {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  box-sizing: border-box;
}
#header-mobile #page-title h2 {
  margin: 0px;
  font-size: 14px;
  color: #003366;
}
</style>
