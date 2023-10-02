<template>
  <div id="map">

    <div id="map-chart">

      <svg version="1.1" height="600" width="500.2597402597403" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 642 770"
        preserveAspectRatio="xMinYMin" style="overflow: hidden; position: relative;"
      >
        <image x="150" y="35" width="492" height="725" preserveAspectRatio="none" xlink:href="/img/uk.png"></image>
        <text x="15" y="25" text-anchor="start" fill="#000000" font-weight="bold">
          <tspan>Illustration of scale of land and sea use in 2050 (positions are arbitrary)</tspan>
        </text>

        <!-- Don't use v-for and v-if on one element, use
          1: the invisible template element for for-looping and v-if on the actual element, or
          2: use a computed property to filter the array so that v-if is not necessary anymore -->
        <template v-for="id in landBoxes">
          <g v-if="boxes[id] && typeof boxes[id].value !== 'undefined'" :key="id">
            <text x="395" v-bind:y="boxes[id].top-7"><tspan>{{id}}</tspan></text>
            <rect v-if="boxes[id].value > 3"
              x="396" v-bind:y="boxes[id].top" :width="boxes[id].value" :height="boxes[id].value"
            rx="0" ry="0" :fill="boxes[id].color" :stroke="boxes[id].color" fill-opacity="0.5"></rect>
            <text v-else x="396" v-bind:y="boxes[id].top+8"><tspan>-</tspan></text>
          </g>
        </template>

        <template v-for="id in seaBoxes">
          <g v-if="boxes[id] && typeof boxes[id].value !== 'undefined'" :key="id">
            <text x="80" v-bind:y="boxes[id].top-7"><tspan>{{id}}</tspan></text>
            <rect v-if="boxes[id].value > 3"
              x="81" v-bind:y="boxes[id].top" :width="boxes[id].value" :height="boxes[id].value"
              rx="0" ry="0" :fill="boxes[id].color" :stroke="boxes[id].color" fill-opacity="0.5">
            </rect>
            <text v-else x="81" v-bind:y="boxes[id].top+8"><tspan>-</tspan></text>
          </g>
        </template>

        <template v-for="id in overseaBoxes">
          <g v-if="boxes[id] && typeof boxes[id].value !== 'undefined'" :key="id">
            <text x="80" v-bind:y="boxes[id].top-7"><tspan>{{id}}</tspan></text>
            <rect v-if="boxes[id].value > 3"
              x="81" v-bind:y="boxes[id].top" :width="boxes[id].value" :height="boxes[id].value"
              rx="0" ry="0" :fill="boxes[id].color" :stroke="boxes[id].color" fill-opacity="0.5">
            </rect>
            <text v-else x="81" v-bind:y="boxes[id].top+8"><tspan>-</tspan></text>
          </g>
        </template>

        <g v-if="typeof waveLine.value !== 'undefined'">
          <text :x="600-10" :y="700-5" text-anchor="end">Wave</text>
          <line v-if="waveLine.value > 3" x1="600" x2="600" y1="700" :y2="700 - waveLine.value" stroke="#00a2ff" stroke-width="4px"></line>
          <text v-else :x="600-5" y="695"><tspan>-</tspan></text>
        </g>
      </svg>

    </div>

    <div id="map-units">
      <div><b>Number of thermal power stations in 2050:</b></div>
      <div v-for="title in powerPlantUnitOrder" class="map-unit" :key="title">
          <span class="map-unit-amount">{{powerPlantUnits[title].value}}</span>
          <span class="map-unit-delimiter">&#215;</span>
          <span class="map-unit-title">{{title}}</span>
      </div>
    </div>

  </div>
</template>

<script>
import * as outputsService from '../../outputsService.js';

export default {
  name: 'MapChart',
  // subtab not needed, but passed by default from <component>
  // if omitted here in the props it would be visible as a data-attribute in the html
  props: ['appState', 'subtab'],
  data() {
    return {
      // data-definition and order-definition are separated
      // because it allows more performant assignment of API data.
      // Instead of one array of objects, there is a combination of a data-object and an order-array.
      // order is defined in landBoxes, seaBoxes, overSeaBoxes
      boxes: {
        "Onshore Wind": {value: undefined, color: '#ff0000', top: undefined},
        "Hydroelectric": {value: undefined, color: '#ff0000', top: undefined},
        "Solar PV": {value: undefined, color: '#aa0000', top: undefined},
        "Bioenergy Growth": {value: undefined, color: '#ff0000', top: undefined}, //'VI.a.Biocrop': 'Energy crops',
        "Forest/Woodland": {value: undefined, color: '#408000', top: undefined},   //'VI.a.Forestry': 'Forest'
        "Offshore Wind": {value: undefined, color: '#00ff00', top: undefined},
        "Tidal Stream": {value: undefined, color: '#00ff00', top: undefined},
        "Tidal Range": {value: undefined, color: '#ffff00', top: undefined},
        "Bioenergy Growth Overseas": {value: undefined, color: '#cccc00', top: undefined}
      },
      waveLine: {output: "Wave", value: undefined, color: '#ff0000', top: undefined},
      powerPlantUnits: {
        "2 GW thermal power stations": {value: undefined},
        "1.2 GW CCS thermal power stations": {value: undefined},
        "3GW Nuclear Power Stations": {value: undefined},
        "1 GW standby generators": {value: undefined},
        "Number of Household, C&I and CDW to energy facilities": {value: undefined},
        "1.2 GW CCS Hydrogen Production Plants": {value: undefined}
      }
    }
  },
  computed: {
  },
  methods: {
    updateMapValues() {
      this.updateBoxValues('map');
      this.updateBoxPositions();
      this.updateWaveLine('map_distance');
      this.updatePowerPlantUnits('map_units');
    },
    updateBoxValues(pathwayProperty) {

      let apiOutputs = outputsService.apiData[pathwayProperty];
      if(!apiOutputs) {
        return;
      }

      apiOutputs.forEach((output) => {
        let title = output[0];
        let apiValue = output[this.index2050+1];
        console.log(title, apiValue);
        if(this.boxes[title]) {
          if(apiValue < 0) {
            apiValue = 0;
            // otherwise the sqrt() would give NaN
            // setting this.boxes[title].value to undefined is not ideal,
            // because then the label wouldn't even be shown on the map
          }
          this.boxes[title].value = Math.sqrt(apiValue * this.km2);
        }
      });

    },
    updateBoxPositions() {

      let margin = 40;
      let top;

      top = 100;
      this.landBoxes.forEach((id) => {
        let box = this.boxes[id];
        if(!box) {
          return;
        }
        box.top = top;
        top = top + margin + box.value;
      });

      top = 100;
      this.seaBoxes.forEach((id) => {
        let box = this.boxes[id];
        if(!box) {
          return;
        }
        box.top = top;
        top = top + margin + box.value;
      });

      let bottom = 720;
      this.overseaBoxes.forEach((id) => {
        let box = this.boxes[id];
        if(!box) {
          return;
        }
        box.top = bottom - box.value;
        bottom = box.top - margin;
      });

    },
    updateWaveLine(pathwayProperty) {

      let apiOutputs = outputsService.apiData[pathwayProperty];
      if(!apiOutputs) {
        return;
      }

      apiOutputs.forEach((output) => {
        let title = output[0];
        let apiValue = output[this.index2050+1];
        if(title === this.waveLine.output) {
          this.waveLine.value = apiValue * this.km;
        }
      });
    },
    updatePowerPlantUnits(pathwayProperty) {

      let apiOutputs = outputsService.apiData[pathwayProperty];
      if(!apiOutputs) {
        return;
      }

      apiOutputs.forEach((output) => {
        let title = output[0];
        let apiValue = output[this.index2050+1];
        if(this.powerPlantUnits[title]) {
          if(!Number.isInteger(apiValue)) {
            apiValue = Math.round(apiValue * 10) / 10;
          }
          this.powerPlantUnits[title].value = apiValue;
        }
      });

    }
  },
  created() {

    this.index2050 = outputsService.getIndexOfYear(2050);

    // why 0.69? (value is coming from the old version)
    // miles to km would be 0.62
    // guess it has sth to do with the map dimensions
    this.km = 0.69; //also needed by some output
    this.km2 = this.km*this.km;

    // missing:
    //'IV.b': 'Solar thermal',
    //'IV.c': 'Micro wind',
    this.landBoxes = ["Onshore Wind","Hydroelectric","Solar PV","Bioenergy Growth","Forest/Woodland"];

    // missing:
    // 'VI.c': 'Marine algae',
    this.seaBoxes = ["Offshore Wind","Tidal Stream","Tidal Range"];

    // missing:
    // 'VII.a': 'Solar PV',
    this.overseaBoxes = ["Bioenergy Growth Overseas"];

    this.powerPlantUnitOrder = [
      "2 GW thermal power stations",
      "1.2 GW CCS thermal power stations",
      "3GW Nuclear Power Stations",
      "1 GW standby generators",
      "Number of Household, C&I and CDW to energy facilities",
      "1.2 GW CCS Hydrogen Production Plants"
    ];

    this.updateMapValues();
    console.log('created ', this.boxes);
  },
  beforeDestroy() {
  },
  watch: {
    'appState.lastAPIResponse': function() {
      this.updateMapValues();
    }
  }
}
</script>

<style>
#map {
  display: flex;
  padding: 9px 15px 15px 15px;
  padding-right: 75px;
  flex-wrap: wrap;
}
#map-chart svg {
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
}
#map-chart svg text {
  font-size: 18px;
  fill: "#000000";
}
#map-units {
  /*this way the item takes as much space as possible but shrinks before it wraps*/
  flex-grow: 1;
  flex-basis: 0;
  min-width: 250px;
  padding-left: 20px;
}
.map-unit {
  display: flex;
  margin: 5px 0px;
}
.map-unit-amount {
  flex: none;
  width: 30px;
  text-align: right;
}
.map-unit-delimiter {
  margin: 0px 10px;
}
@media screen and (max-width: 1300px) {
  #map {
    flex-wrap: wrap;
  }
  #map-units {
    margin-top: 10px;
  }
}
</style>
