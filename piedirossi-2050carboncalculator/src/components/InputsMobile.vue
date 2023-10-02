<template>
  <div id="inputs-mobile">
    <div id="open-levers">
      <div class="pill-button"
        v-on:click.prevent="switchYearMode(!appState.yearsEditing)"
        v-on:mousedown.prevent="()=>{}"
      >
        <span v-if="!appState.yearsEditing">switch to 2100 mode</span>
        <span v-if="appState.yearsEditing">go back to 2050 mode</span>
      </div>
      <div class="pill-button" v-on:click="openLevers">
          <span>Levers</span>
      </div>
    </div>

    <Modal ref="levermodal" :always-rendered="true">
      <div id="levers-modal">
        <PathwaySelector :app-state="appState"/>
        <LeversTable :app-state="appState"></LeversTable>
        <div id="levers-modal-footer">
          <button id="reset-button-mobile" class="pill-button"
            v-on:click="resetLevers"
          >
            Reset
          </button>
          <div id="levers-cancel" class="pill-button" v-on:click="cancel">
            <span>Cancel</span>
          </div>
          <div id="levers-calculate" class="pill-button" v-on:click="calculate">
            <span>Calculate</span>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import * as inputsService from '../inputsService.js';
import * as dataService from '../dataService.js';
import * as routeService from '../routeService.js';

import LeversTable from './LeversTable.vue';
import PathwaySelector from './PathwaySelector.vue';
import Modal from './lib/Modal.vue';

export default {
  name: 'InputsMobile',
  components: {
    LeversTable,
    PathwaySelector,
    Modal
  },
  props: ['appState'],
  data() {
    return {
    }
  },
  methods: {
    resetLevers() {
      inputsService.resetLevers();
      // don't perform any update of the URL or fetching at this point
    },
    openLevers() {
      this.$refs.levermodal.openModal();

      // the modalCloseLink is be frozen to the state of the mainscreen, when the modal was opened
      // although the mainScreenRouteString doesn't change unless the user hits 'calculate'
      // this.modalCloseLink = this.appState.mainScreenRouteString;
    },
    switchYearMode(isYearEditing) {
      inputsService.setYearMode(isYearEditing);
      dataService.updateURL(dataService.createURLParam());
      dataService.fetchData(this.appState.inputLatency);
    },
    cancel() {
      // reset levers to url-values, retrieve queryString from appState
      let appStateQuerystring = this.appState.mainScreenRouteString.substring(this.appState.mainScreenRouteString.indexOf('?'));
      let urlParameters = routeService.getURLParams(appStateQuerystring, ['levers']);
      inputsService.setPathway(urlParameters.levers);
      this.$refs.levermodal.closeModal();
    },
    calculate() {
      // just start a fetch
      // how is it visible here, that a fetch needs to be started?
      // --> lastAction is set!
      if(this.appState.userAction.length) {
        dataService.updateURL(dataService.createURLParam());
        dataService.fetchData(0);
      }
      this.$refs.levermodal.closeModal();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#inputs-mobile {
  position: relative;
}
#open-levers {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 40px;
  z-index: 500;
  background-color: white;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  padding: 0px 10px;
  justify-content: space-around;
}
#levers-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
#levers-modal-footer {
  flex: none;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
}
#reset-button-mobile {
  font-size: 16px;
  margin: 0px;
}
#levers-calculate {
  width: 90px;

}
</style>
