<template>
  <div id="levers-pathways">
    <div id="levers-pathways-select">
      <select v-on:change="selectPathway">
        <option disabled value="" :selected="appState.pathwayIndex < 0">Example Pathways</option>
        <!-- <option disabled value="" :selected="appState.pathwayIndex < 0"></option> -->
        <!-- <option disabled value="" :selected="!appState.pathwaySelected">-</option> -->
        <option v-for="(pathway, index) in examplePathways"
          :aria-label="'sets the pathway with the title: ' + pathway.title"
          :key="pathway.title"
          :value="index"
          :selected="appState.pathwayIndex == index"
        >{{pathway.title}}</option>
      </select>
      <div class="info-button" ref="descriptionToggle"
        role="button"
        aria-label="information on pathway descriptions"
        v-on:mousedown.prevent="()=>{}"
        v-on:click.prevent="toggleDescription"
        v-on:keyup.enter="toggleDescription"
        tabindex="0"
      ></div>
    </div>

    <!-- always-rendered is true, so that the scroll-position is remembered after closing-->
    <ModalStrict :is-open="descriptionOpen" :closing-callback="closeDescription"
      aria-labelled-by="pathway-headline"
      close-icon-path="/img/close.svg"
    >
      <div id="pathway-info">
        <h2 id="pathway-headline" class="modal-header">Pathway descriptions</h2>
        <div id="pathway-descriptions">
          <div class="pathway-details" v-for="pathway in examplePathways" :key="pathway.title">
            <div class="pathway-info-title">{{pathway.title}}:</div>
            <div class="pathway-info-description">{{pathway.description}}</div>
          </div>
        </div>
      </div>
    </ModalStrict>

  </div>
</template>

<script>
import * as dataService from '../dataService.js';
import * as inputsService from '../inputsService.js';
import ModalStrict from './lib/ModalStrict.vue';

export default {
  name: 'Inputs',
  components: {
    ModalStrict
  },
  props: ['appState'],
  data() {
    return {
      descriptionOpen: false
    }
  },
  created() {
    this.examplePathways = inputsService.examplePathways;
  },
  methods: {
    toggleDescription() {
      this.descriptionOpen = !this.descriptionOpen;
    },
    closeDescription() {
      this.descriptionOpen = false;
      this.$refs['descriptionToggle'].focus();
    },
    selectPathway(evt) {
      if(this.appState.requestsPending > 0) {
        return;
      }

      //the value attribute can be tampered with by the user, parseInt kind of filters the user-input
      //state radix for parseInt, because the value can be '0' and JS could choose octal OR decimal in that case
      var index = parseInt(evt.target.value, 10);
      if(!Number.isNaN(index) && this.examplePathways[index]) {
        inputsService.setExamplePathway(index);

        // Desktop only
        if(!this.appState.isMobile) {
          dataService.updateURL(dataService.createURLParam());
          dataService.fetchData(this.appState.inputLatency);
        }

      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#levers-pathways {
  background-color: #eceff0;
}
#levers-pathways-select {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 15px 15px;
  position: relative;
  box-sizing: border-box; /*safari*/
}
#levers-pathways-select select {
  height: 30px;
  font-size: 16px;
  padding: 0px 4px;
  background-color: white;
}
#pathway-info {
  display: flex;
  flex-direction: column;
  height: 100%;
}
#pathway-descriptions {
  flex-grow: 1;
  overflow: auto;
  padding: 0px 20px;
}
.pathway-details {
  margin: 20px 0px;
}
.pathway-info-title {
  font-weight: bold;
  margin-bottom: 3px;
}
</style>
