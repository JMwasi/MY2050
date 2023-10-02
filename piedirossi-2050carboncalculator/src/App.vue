<template>
  <div id="app" :class="{'mobile': appState.isMobile}" data-app="true"><!--maybe global event necessary see bringpls-->

    <HeaderMobile v-if="appState.isMobile" :app-state="appState"/>

    <div id="main">


      <InputsMobile v-if="appState.isMobile" :app-state="appState"/>
      <Inputs v-if="!appState.isMobile" :app-state="appState"/>

      <Outputs :app-state="appState"/>

    </div>


  </div>
</template>

<script>
import * as dataService from './dataService.js';

import HeaderMobile from './components/HeaderMobile.vue';
import Inputs from './components/Inputs.vue';
import Outputs from './components/Outputs.vue';


export default {
  name: 'App',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '',
    // all titles will be injected into this template
    titleTemplate: 'MacKay Carbon Calculator - %s'
  },
  components: {
    HeaderMobile,
    Inputs,
    'InputsMobile': () => import('./components/InputsMobile.vue'),
    Outputs
  },
  data() {
    //every existing object put inside here will be transformed into reactive getter-setter construct
    return {
      appState: dataService.appState
    }
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100vh;
  padding: 0px;
  position: relative;
  overflow-x: hidden; /*necessary for the page-menu*/
  background-color: white;
}
#header-mask {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 56px;
  backdrop-filter: blur(2px);
  z-index: 109;
}
#main {
  flex-grow: 1;
  display: flex;
  max-width: 100%;
  min-height: 0; /*firefox flexbox overflow bug, https://stackoverflow.com/questions/28636832/firefox-overflow-y-not-working-with-nested-flexbox*/
}

</style>
