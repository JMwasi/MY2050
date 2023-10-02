<template>
  <div id="inputs" :class="{'maximized': appState.yearsEditing}">
    <div id="inputs-header">
      <div id="inputs-header-row">
        <a href="/" class="wrapper-link">
          <h1>MACKAY CARBON CALCULATOR</h1>
        </a>
        <a href="https://www.gov.uk/guidance/carbon-calculator" target="_blank" rel="noopener" class="wrapper-link">
          <img class="cursor-pointer" src="/img/info-i_darkblue.svg" alt="more information on the Mackay Carbon Calculator">
        </a>
      </div>
      <a id="beis-logo" href="/" class="wrapper-link">
        <img class="cursor-pointer" src="/img/beis_logo_black_one-line.svg"
          alt="department for business, energy and industrial strategy homepage"
        >
      </a>
    </div>

    <div id="inputs-pathways" class="hidden-heading-container">
      <h2 class="hidden-heading">Lever Settings</h2>
      <PathwaySelector :app-state="appState"/>
      <button id="reset-button" class="pill-button"
        v-on:click.prevent="resetLevers"
        v-on:mousedown.prevent="()=>{}"
      >
        reset levers
      </button>
    </div>

    <LeversTable :app-state="appState"></LeversTable>

    <div id="inputs-footer">
        <!--  setting focus again doesn't work well with normal button elements,
              because that would activate the button again, but works with a div
          -->
        <div id="conditions-button" ref="conditionsToggle"
          role="button"
          aria-label="information on terms and conditions"
          v-on:mousedown.prevent="()=>{}"
          v-on:click.prevent="toggleTermsAndConditions"
          v-on:keyup.enter.prevent="toggleTermsAndConditions"
          tabindex="0"
        >
          Conditions of Use
        </div>

        <button id="year-switch" class="pill-button tooltip-holder"
          v-on:click.prevent="switchYearMode(!appState.yearsEditing)"
          v-on:mousedown.prevent="()=>{}"
          :aria-describedby="!appState.yearsEditing ? 'description-2100-mode' : 'description-2050-mode'"
        >
          <span v-if="!appState.yearsEditing">switch to 2100 mode</span>
          <span v-if="appState.yearsEditing">go back to 2050 mode</span>
          <div id="description-2100-mode" v-if="!appState.yearsEditing" class="tooltip tooltip-top tooltip-blue">
            View pathway results out to 2100 and choose start and end date for each lever deployment.
            The default start and end times required for deployment are the earliest and fastest plausible according to experts
          </div>
          <div id="description-2050-mode" v-if="appState.yearsEditing" class="tooltip tooltip-top tooltip-blue">
            Changes to start and end years will be lost unless bookmarked
          </div>
        </button>
    </div>

    <ModalStrict :is-open="termsAndConditionsOpen" :closing-callback="closeTermsAndConditions"
      aria-labelled-by="terms-and-conditions-header"
      close-icon-path="/img/close.svg"
    >
      <div id="terms-and-conditions">
        <h2 id="terms-and-conditions-header" class="modal-header">Terms and Conditions</h2>
        <div class="modal-inner">
          <p>
            The Department for Business, Energy and Industrial Strategy provide no express or implied warranties concerning this tool and its content and, accordingly, accepts no liability arising from use of the tool or its content.
          </p>
          <p>
            The front end code used by this tool is owned by Climate Media Factory, Potsdam, apart from the code for the results graphs which is the property of Highsoft, Vik i Sogn.
          </p>
        </div>
      </div>
    </ModalStrict>

  </div>
</template>

<script>
import * as dataService from '../dataService.js';
import * as inputsService from '../inputsService.js';
import * as helpers from '../helpers.js';

import LeversTable from './LeversTable.vue';
import PathwaySelector from './PathwaySelector.vue';
import ModalStrict from './lib/ModalStrict.vue';


export default {
  name: 'Inputs',
  components: {
    LeversTable,
    PathwaySelector,
    ModalStrict
  },
  props: ['appState'],
  data() {
    return {
      termsAndConditionsOpen: false
    }
  },
  methods: {
    toggleTermsAndConditions() {
      this.termsAndConditionsOpen = !this.termsAndConditionsOpen;
    },
    closeTermsAndConditions() {
      this.termsAndConditionsOpen = false;
      this.$refs['conditionsToggle'].focus();
    },
    resetLevers() {
      if(this.appState.requestsPending > 0) {
        return;
      }
      inputsService.resetLevers();
      dataService.updateURL(dataService.createURLParam());
      dataService.fetchData(this.appState.inputLatency);
    },
    switchYearMode(isYearEditing) {
     inputsService.setYearMode(isYearEditing);

      // always start a fetch, also when switching to 2100 mode (because then the watch of the charts triggers due to the APIREsponse)
      // if not a second watch on appState.yearsEditing would be necessary, and then sometimes both watches would trigger
      // which doesn't look nice
      dataService.updateURL(dataService.createURLParam());
      dataService.fetchData(this.appState.inputLatency);

      //this triggers the HighCharts built-in redraw event. Not a very elegant solution, but very short
      helpers.triggerWindowResize();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#inputs {
  display: flex;
  flex-direction: column;
  max-width: 550px;
  min-width: 430px; /*otherwise the width jumps when map tab is opened*/
  max-height: 100vh; /*necessary for IE11*/
  background-color: #eceff0; /*necessary for IE11 and Edge, otherwise jumpy background color when scrolling the levers table*/
}
#inputs.maximized {
  min-width: 540px; /*just for desktop, mobile renders inputs-mobile component*/
}
#inputs-header {
  flex: none;
  height: 85px;
  padding: 10px 15px;
  box-sizing: border-box;
  background-color: white;
}
#inputs-header-row {
  display: flex;
  justify-content: space-between;
}
#inputs-header h1 {
  margin: 0px;
  font-size: 18px;
  color: #003366;
}
#beis-logo img {
  display: block;
  max-width: 100%;
  margin-top: 10px;
  width: 400px;
}

#inputs-pathways {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #d4d4d4;
}
#reset-button {
  margin-left: auto;
  margin-right: 20px;
  white-space: nowrap;
}

#inputs-footer {
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
  background-color: #f1f1f1;
  flex: none;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-right: 60px;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}

#year-switch {
  margin-left: 40px;
  min-width: 190px;
}
#year-switch-warning {
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  cursor: pointer;
  z-index: 10;
}
#year-switch-warning-icon {
  display: block;
  height: 100%;
}

#conditions-button {
  color: inherit;
  line-height: inherit;
  background-color: inherit;
  margin-left: 20px;
  font-size: 14px;
  font-weight: inherit;
  text-decoration: underline;
  cursor: pointer;
}
</style>
