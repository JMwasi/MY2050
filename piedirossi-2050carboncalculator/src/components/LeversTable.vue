<template>
  <div id="levers-table-cont">
  <div id="levers-table">
    <div id="levers-header" :class="{'max-content': appState.yearsEditing}">
      <span class="levers-column1">
        <span>Lever settings:</span>
        <div class="info-button" id="levers-table-description-toggle" ref="descriptionToggle"
          role="button"
          aria-label="information on level table"
          style="top: -2px; left: 10px;"
          v-on:mousedown.prevent="()=>{}"
          v-on:click.prevent="toggleDescription"
          v-on:keyup.enter="toggleDescription"
          tabindex="0"
        >
        </div>
      </span>
      <span class="levers-column2">
        <div id="ambition-header">
          <div>Level of ambition</div>
        </div>
      </span>
      <span v-if="appState.yearsEditing" class="levers-column3" id="year-header">
        <div>Start and end year</div>
        <div id="year-header-years">
          <span>2020</span>
          <span>2050</span>
          <span>2100</span>
        </div>
      </span>
      <a class="skip-link" id="levertable-before" href="#levertable-after">skip to end of lever-table</a>

    </div>

    <div id="levers-main">
      <Levers :app-state="appState"/>
    </div>

    <ModalStrict :is-open="descriptionOpen" :closing-callback="closeDescription"
      aria-labelled-by="levers-table-description-header"
      close-icon-path="/img/close.svg"
    >
      <div id="levers-table-description">
        <h2 id="levers-table-description-header" class="modal-header">Lever table</h2>
        <div class="modal-inner">
          <p>Each lever can be assigned an ambition level. High levels reflect high ambition:</p>
          <ul>
            <li>1: The least effort possible</li>
            <li>2: Ambitious but reasonable</li>
            <li>3: Very ambitious needing technical breakthroughs</li>
            <li>4: The upper limit of what is considered plausible</li>
          </ul>
          <p>To select fractions, click ambition level repeatedly.</p>
        </div>
      </div>
    </ModalStrict>
  </div>
  <a class="skip-link" id="levertable-after" href="#levertable-before">skip to beginning of lever-table</a>

  </div>
</template>

<script>

import Levers from './Levers.vue';
import ModalStrict from './lib/ModalStrict.vue';

export default {
  name: 'LeversTable',
  components: {
    Levers,
    ModalStrict
  },
  props: ['appState'],
  data() {
    return {
      descriptionOpen: false
    }
  },
  methods: {
    toggleDescription() {
      this.descriptionOpen = !this.descriptionOpen;
    },
    closeDescription() {
      this.descriptionOpen = false;
      this.$refs['descriptionToggle'].focus();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/*levers grid*/
.levers-column1 {
  flex: none;
  width: 240px;
  margin-right: 5px;
}
.levers-column2 {
  flex: none;
  width: 100px;
}
.levers-column3 {
  flex: none;
  width: 160px;
  margin-left: 10px;
}
#levers-table-cont {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /*otherwise it stretches*/
  position: relative;
}

#levers-table {
  flex-grow: 1;
  overflow-y: scroll;
  overflow-x: auto;
  background-color: lightblue;
  background-color: white;
  background-color: lightgrey;
  background-color: #eceff0;
}
#levers-header {
  height: 48px;
  padding-top: 15px;
  padding-bottom: 2px;
  display: flex;
  font-size: 16px;
  position: sticky;
  top: 0px;
  background-color: #eceff0;
  z-index: 100;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
}
#levers-header .levers-column1 {
  position: relative;
  font-weight: bold;
  padding-left: 15px;
  box-sizing: border-box;
  display: flex;
}
#ambition-header-levels {
  display: flex;
  margin-top: 5px;
}
#ambition-header-levels span {
  flex: none;
  width: 22px;
  text-align: center;
}
#year-header {
  text-align: center;
}
#year-header-years {
  display: flex;
  justify-content: space-around;
}
#levers-main {
  display: flex;
  flex-direction: column;
  min-height: 0; /*firefox flexbox overflow bug, https://stackoverflow.com/questions/28636832/firefox-overflow-y-not-working-with-nested-flexbox*/
}
.skip-link {
  display: inline-block;
  position: absolute;
  z-index: 1000;
  font-size: 16px;
  background-color: white;
  padding: 1px 4px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
}
#levertable-before {
  bottom: 0px;
  left: 10px;
}
#levertable-after {
  bottom: 2px;
  left: 10px;
}
</style>
