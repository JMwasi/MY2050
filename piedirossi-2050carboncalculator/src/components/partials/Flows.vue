<template>
  <div id="flows">
    <div class="full-chart">
      <!-- the :key is important, otherwise charts are not replaced on tab-change,
      instead parts of the data gets replaced (bug) -->
      <SankeyChart
        v-if="Object.keys(chart1Data).length"
        :chart-data="chart1Data"
        :app-state="appState"
        :key="appState.activeTab"
      />
    </div>
  </div>
</template>

<script>
import * as outputsService from '../../outputsService.js';
import {SankeyOrder} from '../../config/sankeyOrder.js';

import SankeyChart from './SankeyChart.vue';

/*
Senders:
1 "Nuclear",
1 "Environmental Heat",
1 "Solar",
1 "Wind",
1 "Other Renewables",
1 "Interconnectors",
1 "Waste",
1 "UK Biomass",
1 "Bioenergy Imports",
1 "Hydrogen Imports",
1 "Natural Gas",
1 "Oil",
1 "Coal",
2 "Bio Conversion",
2 "Thermal Generation",
2 "Electricity",
2 "Hydrogen Production",
2 "Gas Grid Distribution"

receivers:
2 "Electricity",
2 "Bio Conversion",
2 "Thermal Generation",
3 "Exports",
2 "Hydrogen Production",
3 "Fossil Fuel Processing",
3 "Losses",
3 "Non energy use",
2 "Gas Grid Distribution",
3 "Buildings Heat",
3 "Industry",
3 "Agriculture",
3 "Light Vehicles",
3 "Heavy Vehicles",
3 "Aviation",
3 "GHG Removal",
3 "Buildings Appliances"

circular flows are problematic for visualisation:
for instance between Thermal Generation and Electricity

The ordering in general is not optimal, please advice more details.


*/


export default {
  name: 'Flows',
  components: {
    SankeyChart
  },
  props: ['appState', 'subtab'],
  data() {
    return {
      chart1Data: {},
    }
  },
  methods: {
    buildSankeyIndices(apiData) {
      this.sankeyIndices = {};
      apiData.map((entry) => {
        let from = entry[0];
        let to = entry[1];
        let index = SankeyOrder.findIndex((row) => {
          return row[0] === from && row[1] === to
        });
        if(!this.sankeyIndices[entry[0]]) {
          this.sankeyIndices[entry[0]] = {};
        }
        this.sankeyIndices[entry[0]][entry[1]] = index;
      });
      console.log('buildSankeyIndices');
    },
    buildChartData() {

      let apiData = outputsService.apiData[this.outputName];

      if(!apiData) {
        return {};
      }

      if(!this.sankeyIndices) {
        this.buildSankeyIndices(apiData);
      }

      let data = [];
      for(let i=0, len=SankeyOrder.length; i<len; i++) {
        let from = apiData[i][0];
        let to = apiData[i][1];
        let value = apiData[i][this.dataIndex];
        let index = this.sankeyIndices[from][to];

        data[index] = {
          from: from,
          to: to,
          color: value < 20 ? 'rgba(200,100,10,0)' : undefined,
          weight: value,
          className: value < 20 ? 'hidden-line' : undefined
        }
      }
      console.log('data', data);


      let chartData = {
        series: [{
          keys: ['from', 'to', 'weight'],
          data: data,
          clip: false,
          type: 'sankey',
          name: 'flows',
          nodes: [
            {id:"Nuclear", column: 0},
            {id:"Environmental Heat", column: 0},
            {id:"Solar", column: 0},
            {id:"Wind", column: 0},
            {id:"Other Renewables", column: 0},
            {id:"Interconnectors", column: 0},
            {id:"Waste", column: 0},
            {id:"UK Biomass", column: 0},
            {id:"Bioenergy Imports", column: 0},
            {id:"Hydrogen Imports", column: 0},
            {id:"Natural Gas", column: 0},
            {id:"Oil", column: 0},
            {id:"Coal", column: 0},
            {id:"Bio Conversion", column: 1},
            {id:"Thermal Generation", column: 2},
            {id:"Electricity", column: 3},
            {id:"Hydrogen Production", column: 2},
            {id:"Gas Grid Distribution", column: 3},
            {id:"Exports", column: 5},
            {id:"Fossil Fuel Processing", column: 5},
            // have to use percentage values for offset,
            // with fixed values there is no sweet spot for the position for big and small heights
            {id:"Losses", column: 5, offset: '0%'},
            {id:"Non energy use", column: 5},
            {id:"Buildings Heat", column: 5},
            {id:"Industry", column: 5},
            {id:"Agriculture", column: 5},
            {id:"Light Vehicles", column: 5},
            {id:"Heavy Vehicles", column: 5},
            {id:"Aviation", column: 5},
            {id:"GHG Removal", column: 5},
            {id:"Buildings Appliances", column: 5}
          ]
        }],
        title: "Flows"
      }

      if(chartData) {
        return chartData;
      }
    }
  },
  created() {
    //hardcoded
    this.dataIndex = 9; // 2050 value
    this.outputName = 'sankey';

    this.sankeyIndices = undefined;
    this.chart1Data = this.buildChartData();
  },
  watch: {
    'appState.lastAPIResponse': function() {
      // update charts on api change
      this.chart1Data = this.buildChartData();
    },
    'appState.activeTab': function() {
      this.chart1Data = this.buildChartData();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#flows {
  height: 100%;
  padding-right: 70px;
}
.full-chart {
  position: relative;
  height: 100%;
  min-height: 300px;
}
.chart {
  position: absolute;
  top: 8px;
  left: 15px;
  width: calc(100% - 30px);
  height: calc(100% - 16px);
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
}
#flows tbody tr th {
  display: none;
}
</style>
