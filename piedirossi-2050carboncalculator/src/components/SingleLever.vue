<template>
  <div class="single-lever" :class="{'deactivated': deactivated}"
    v-on:mouseleave="deactivateTooltipIfNecessary($event, true)"
  >

    <div v-for="(step, index) in lever.range" class="single-lever-step" :key="step"
      v-on:mouseenter="setTooltip(index)"
    >

      <div class="single-lever-step-button"
        :class="{empty: Math.ceil(lever.value) <= step, filled: Math.ceil(lever.value) > step, notrans: buttonFromEmptyToFilled}"
        role="button"
        :aria-labelledby="'single-lever-step-label-' + lever.id + '-'+index"
        v-on:click.prevent="stepClickFunc(step); blurOther()"
        v-on:mousedown.prevent="()=>{}"
        v-on:keydown.enter="stepClickFunc(step)"
        tabindex="0"
        v-on:focus="setTooltip(index)"
        v-on:blur="deactivateTooltipIfNecessary($event)"
      >
        <span v-if="(Math.ceil(lever.value) === step)"
          class="single-lever-step-partial" :style="{width: partialWidth + '%'}"
        >
        </span>
        <!-- <div v-if="!appState.isMobile && (Math.ceil(lever.value) === step)" class="single-lever-value"><span>{{lever.value}}</span></div> -->
        <div v-if="!appState.isMobile && (Math.floor(lever.value) === step)" class="single-lever-value"><span>{{lever.value}}</span></div>
      </div>

      <div :id="'single-lever-step-label-' + lever.id + '-'+index" class="hidden">
        <span>Changes the ambition level for {{lever.title}} to
        {{potentialValue(step, index)}}</span>
        <span>Current value is {{lever.value}}</span>
      </div>

    </div>

    <div class="single-lever-tooltip" :class="{'visible': tooltipVisible && tooltipText}">
      <div>Ambition Level {{lever.range[tooltipIndex]}}:</div>
      <div>{{tooltipText}}</div>
    </div>
    <div class="single-lever-step-connector" :class="{'visible': tooltipVisible && tooltipText}"

      :style="{left: (23*(tooltipIndex+1))-13-10+'px'}"
    >
      <!--
        left: 23*(tooltipIndex+1)-13-10
          23: width of single-lever-step including margin
          13: half of that with (the x-center)
          10: half the width of the single-lever-step-connector

        can't be inside .single-lever-step, otherwise not over single-lever-tooltip and box-shadow not covered,
        even if single-lever-tooltip is put above single-lever-step
    -->
    </div>

  </div>
</template>

<script>
import * as dataService from '../dataService.js';
import * as inputsService from '../inputsService.js';

export default {
  name: 'SingleLever',
  props: ['lever', 'tooltipVisible', 'activateTooltip', 'deactivateTooltip', 'appState', 'deactivated'],
  data() {
    return {
      tooltipText: '',
      tooltipIndex: undefined,
      buttonFromEmptyToFilled: false
    }
  },
  created() {
    this.timerId = undefined;
  },
  computed: {
    partialWidth: function() {
      let val = (this.lever.value % 1).toFixed(1)*100;
      return val === 0 ? 100 : val;
    }
  },
  methods: {
    blurOther() {
      // necessary because a button of a different lever might still have focus
      // and the click handler's prevent prevents this button from receiving focus
      document.activeElement.blur();
    },
    deactivateTooltipIfNecessary(evt, force) {
      // console.log('deactivateTooltipIfNecessary 1');
      let newFocusElement = evt.relatedTarget;
      if(force) {
        this.deactivateTooltip();
        return;
      }
      if(!newFocusElement) {
        this.deactivateTooltip();
        return;
      }
      if(newFocusElement && !newFocusElement.classList.contains('single-lever-step-button')) {
        // console.log('deactivateTooltipIfNecessary 2');
        this.deactivateTooltip();
        return;
      }
      // console.log('deactivateTooltipIfNecessary ', newFocusElement);
    },
    potentialValue(step) {
      let result;
      if(Math.ceil(this.lever.value) === step && Math.ceil(this.lever.value) > 1) {
        result = (this.lever.value-0.1).toFixed(1);
      } else {
        result = step;
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
      if(Math.ceil(this.lever.value) !== step) {
        newValue = step;
      } else {
        let val = Math.round( (this.lever.value-0.1) * 10) / 10;
        newValue = val <= 1 ? 1 : val;
      }

      inputsService.setValue(this.lever.id, newValue);
      //Desktop only
      if(!this.appState.isMobile) {
        dataService.updateURL(dataService.createURLParam());
        dataService.fetchData(this.appState.inputLatency);
      }
    },
    setTooltip(ind) {
      // console.log('setTooltip ', ind);
      var setTooltipInfo = () => {
        this.tooltipText = inputsService.getTooltipText(this.lever.id, ind);
        this.tooltipIndex = ind;
      };

      if(this.tooltipVisible) {
        setTooltipInfo();
      } else {
        this.activateTooltip(this.lever.id, false, setTooltipInfo);
      }
    }
  },
  watch: {
    // just watch the value property of the lever property-Object
    'lever.value': function(newVal, oldVal) {

      // prevents flickering in transition of button from empty state to filled state
      if(Math.floor(newVal) > Math.floor(oldVal)) {
        // triggers for oldVal = 1.5, newVal = 2.1
        //doesn't trigger for oldVal = 1.5, newVal = 1.9

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
.single-lever {
  position: relative;
  display: flex;
  height: 22px;
}
.single-lever-step {
  position: relative;
  flex: none;
  width: 22px;
  height: 100%;
  z-index: 2;
}
.single-lever-step-button {
  height: 100%;
  width: 100%;
  cursor: pointer;
  border: 1px solid #555559;
  border-left: none;
  border-top: none;
  background-color: #b3bfc5;

  box-sizing: border-box;
}
.single-lever-step:first-child .single-lever-step-button{
  border-left: 1px solid #555559;
}
.deactivated .single-lever-step-button {
  background-color: #cccccc;
  border-color: #b3b3b3;
  cursor: default;
}
.single-lever-step-button.filled {
  /* transition: all 0.2s ease; */
}
.single-lever-step-button.filled.notrans {
  /* transition: all 0s ease; */
}
.single-lever:hover .single-lever-step-button.filled {
  /*
    deactivate hover transition when already hovering inside the lever field
    only transition when leaving that field
  */
  /* transition: background-color 0s ease !important; */
  transition-duration: 0s;
}

.single-lever-step-button.empty {
  background-color: transparent !important;
  border-color: #555559;
}

.single-lever-step-partial {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  overflow: hidden;
  z-index: 10;
}
.single-lever-step-partial::after {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 22px;
  height: 22px;
  background-color: #b3bfc5;
  border: 1px solid #555559;
  border-left: none;
  border-top: none;
  box-sizing: border-box;
}
.single-lever-step:first-child .single-lever-step-partial::after {
  border-left: 1px solid #555559;
}
.deactivated .single-lever-step-partial::after {
  border-color: #b3b3b3 !important;
  background-color: #cccccc;
}
.single-lever-value {
  width: 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: white;
  opacity: 0;
  position: relative;
  left: -2px;
  z-index: 20;
}
.single-lever:hover .single-lever-value {
  /*leave transition for the .single-lever-value on hover,
  unlike .single-lever-step-partial::after or .single-lever-step-button.filled*/
  opacity: 1;
}

.single-lever:hover .single-lever-step-button.filled {
  background-color: #27aae1;
}

.single-lever:hover .single-lever-step-partial::after {
  background-color: #27aae1;
  /*
    deactivate hover transition when already hovering inside the lever field
    only transition when leaving that field
  */
  transition-duration: 0s;
}

.single-lever-tooltip.visible,
.single-lever-step-connector.visible {
  opacity: 1;
}


</style>
