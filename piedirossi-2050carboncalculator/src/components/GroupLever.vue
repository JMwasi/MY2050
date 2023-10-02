<template>
  <div class="single-lever group-lever" :class="{'deactivated': deactivated}">

    <div v-for="(step, index) in group.range" class="single-lever-step" :key="step">

      <div class="single-lever-step-button"
        :class="{empty: Math.ceil(value) <= step, filled: Math.ceil(value) > step, notrans: buttonFromEmptyToFilled}"
        role="button"
        :aria-labelledby="'group-lever-step-label-' + index"
        v-on:click.prevent="stepClickFunc(step)"
        v-on:mousedown.prevent="()=>{}"
        v-on:keydown.enter="stepClickFunc(step)"
        tabindex="0"
      >
        <span v-if="(Math.ceil(value) === step)"
          class="single-lever-step-partial" :style="{width: partialWidth + '%'}"
        >
        </span>
        <!-- <div v-if="!appState.isMobile" class="single-lever-value"><span>{{value}}</span></div> -->
        <div v-if="!appState.isMobile && (Math.floor(value) === step)" class="single-lever-value"><span>{{value}}</span></div>
        <!-- <div v-if="!appState.isMobile && (Math.ceil(value) === step)" class="single-lever-value"><span>{{value}}</span></div> -->

      </div>

      <div :id="'group-lever-step-label-' + index" class="hidden">
        <span>Changes the ambition level for all levers of the group {{group.title}} to {{potentialValue(step, index)}}</span>
        <span>Current value is {{value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as dataService from '../dataService.js';
import * as inputsService from '../inputsService.js';
import * as helpers from '../helpers.js';


export default {
  name: 'GroupLever',
  props: ['group', 'appState', 'deactivated'],
  data() {
    return {
      buttonFromEmptyToFilled: false
      //value: dataService.getGroupAverage(this.groupid, this.country) //not reactive, changes are not noticed
    }
  },
  computed: {
    partialWidth: function() {
      let val = (this.value % 1).toFixed(1)*100;
      return val === 0 ? 100 : val;
    },
    value: function() {
      let collected = [];

      //console.log('value computed');
      this.group.levers.forEach((levId) => {
        collected.push(inputsService.levers[levId].value);
      });
      if(collected.length) {
        return Math.round( helpers.arrayAverage(collected) * 10) / 10;
      }
      return undefined;
    }
  },
  methods: {
    potentialValue(step, index) {
      let result;
      if(Math.ceil(this.value) === step && Math.ceil(this.value) > 1) {
        result = (this.value-0.1).toFixed(1);
      } else {
        result = step;
      }
      if(this.group.title === 'Transport' && index === 0) {
        console.log('potentialValue ', step, this.value, result);
      }
      return result;
    },
    stepClickFunc(step) {

      if(this.appState.requestsPending > 0) {
        return;
      }

      if(this.deactivated) {
        return;
      }

      let newValue;
      if(Math.ceil(this.value) !== step) {
        newValue = step;
      } else {
        let val = Math.round( (this.value-0.1) * 10) / 10;
        newValue = val <= 1 ? 1 : val;
      }

      inputsService.setValues(this.group.levers, newValue);
      //Desktop only
      if(!this.appState.isMobile) {
        dataService.updateURL(dataService.createURLParam());
        dataService.fetchData(this.appState.inputLatency);
      }
    }
  },
  mounted() {
    //console.log('GRoupLever ', Math.round(helpers.arrayAverage(dataService.leverGroups[this.groupid].levers) * 10) / 10);
    //console.log('GroupLever ', dataService.getGroupAverage(this.groupid, this.country));
    // console.log('GroupLever ', this.appState);
  },
  watch: {
    //value is a computed property for GroupLevers
    value: function(newVal, oldVal) {
      //console.log('value watch ', oldVal, newVal, Math.floor(oldVal), Math.floor(newVal));
      if(Math.floor(newVal) > Math.floor(oldVal)) {
        // triggers for oldVal = 1.5, newVal = 2.1
        // doesn't trigger for oldVal = 1.5, newVal = 1.9

        this.buttonFromEmptyToFilled = true;

        //nextTick() is not enough. To make sure the change is visible, use window.requestAnimationFrame()
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            this.buttonFromEmptyToFilled = false;
          });
        });

      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.group-lever .single-lever-step-partial::after {
  background-color: #6d6e71;
  border-top: 1px solid #6d6e71;
}

/* .group-lever-cont .single-lever-step-button { */
.group-lever .single-lever-step-button {
  border: 1px solid #6d6e71;
  border-left: none;
  background-color: #6d6e71;
}

</style>
