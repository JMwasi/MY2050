<template>
<div class="range-slider" v-if="isValid">

  <div class="range-slider-start" :class="{'range-slider-label-hidden': hideLabels}">
    <input v-if="inputFields" type="number" :min="min" :max="max-step" :step="step" :value="start" v-on:change="inputHandler($event, setStartValue)">
    <span v-if="!inputFields">{{start}}</span>
  </div>

  <div class="range-slider-slider-container"
    v-on:click="setValueFromTrackClick($event)"
  >
    <div class="range-slider-slider" ref="slider">

      <div class="range-slider-track"
      ></div>

      <div class="range-slider-range"
        :class="{'range-slider-transition': transitioning}"
        :style="{transform: 'translate('+rangeLeft+'%, -50%) scaleX('+rangeWidth+') '}"
      ></div>

      <div class="range-slider-knob-container"
        :class="{'range-slider-transition': transitioning}"
        :style="{transform: 'translate('+rangeLeft+'%, -50%)'}"
      >
        <div class="range-slider-knob" ref="startknob"
          role="slider"
          :aria-valuemin="min"
          :aria-valuemax="max-(minRangeFactor*step)"
          :aria-valuenow="start+','+end"
          v-on:mousedown="activateMouseMove($event, setStartValue)"
          v-on:touchstart="activateTouchMove($event, setStartValue)"
          v-on:keydown.right="incrementStart"
          v-on:keydown.left="decrementStart"
          v-on:keydown.up="incrementStart"
          v-on:keydown.down="decrementStart"
          tabindex="0"
        ></div>
      </div>

      <div class="range-slider-knob-container"
        :class="{'range-slider-transition': transitioning}"
        :style="{transform: 'translate('+rangeRight+'%, -50%)'}"
      >
        <div class="range-slider-knob" ref="endknob"
          role="slider"
          :aria-valuemin="min+(minRangeFactor*step)"
          :aria-valuemax="max"
          :aria-valuenow="start+','+end"
          v-on:mousedown="activateMouseMove($event, setEndValue)"
          v-on:touchstart="activateTouchMove($event, setEndValue)"
          v-on:keydown.right="incrementEnd"
          v-on:keydown.left="decrementEnd"
          v-on:keydown.up="incrementEnd"
          v-on:keydown.down="decrementEnd"
          tabindex="0"
        ></div>
      </div>

    </div>
  </div>

  <div class="range-slider-end" :class="{'range-slider-label-hidden': hideLabels}">
    <input v-if="inputFields" type="number" :min="min+step" :max="max" :step="step" :value="end" v-on:change="inputHandler($event, setEndValue)">
    <span v-if="!inputFields">{{end}}</span>
  </div>

</div>
</template>

<script>

/*
drag event on ideal, because it creates a ghost image (it's not meant for this purpose) and it doesn't work on mobile
*/

export default {
  name: 'RangeSlider',
  props: {
    minValue: {type: Number, required: true},
    maxValue: {type: Number, required: true},
    stepSize: {type: Number, default: 1},
    minRangeFactor: {type: Number, default: 1},
    startValue: {type: Number, required: true},
    endValue: {type: Number, required: true},
    inputFields: {type: Boolean, default: true},
    hideLabels: {type: Boolean, default: false},
    deactivated: {type: Boolean, default: false},
    callback: {type: Function}
  },
  data() {
    return {
      isValid: this.integrityCheck(),
      min: this.minValue,
      max: this.maxValue,
      step: this.stepSize,
      start: this.startValue,
      end: this.endValue,
      transitioning: false
    }
  },
  computed: {
    rangeLeft: function() {
      // console.log('rangeLeft ', this.start, this.max, this.min, (this.start - this.min)*100/(this.max - this.min));
      return (this.start - this.min)*100/(this.max - this.min);
    },
    rangeRight: function() {
      // console.log('rangeRight ', this.end, this.max, this.min, (this.end - this.min)*100/(this.max - this.min));
      return (this.end - this.min)*100/(this.max - this.min);
    },
    rangeWidth: function() {
      // console.log('rangeWidth ', (this.end - this.start)/(this.max - this.min))
      return (this.end - this.start)/(this.max - this.min);
    }
  },
  methods: {
    setValueFromTrackClick(evt) {
      if(this.deactivated) {
        return;
      }
      if(evt.target === this.$refs.startknob || evt.target === this.$refs.endknob) {
        return;
      }
      this.transitioning = true;

      //first find out which knob is closer
      let startKnobClientRect = this.$refs.startknob.getBoundingClientRect();
      let endKnobClientRect = this.$refs.endknob.getBoundingClientRect();

      let startKnobCenter = startKnobClientRect.left + startKnobClientRect.width/2;
      let endKnobCenter = endKnobClientRect.left + endKnobClientRect.width/2;

      let setterFunction = (Math.abs(evt.clientX - startKnobCenter) < Math.abs(evt.clientX - endKnobCenter)) ? this.setStartValue : this.setEndValue;

      this.sliderRect = this.$refs.slider.getBoundingClientRect();
      let value = this.getClosestValueOfPosition(evt.clientX);
      setterFunction(value);

      if(setterFunction === this.setStartValue) {
        this.$refs.startknob.focus();
      }
      if(setterFunction === this.setEndValue) {
        this.$refs.endknob.focus();
      }
      // console.log('setValueFromTrackClick', setterFunction, startKnobCenter, endKnobCenter, evt.clientX);

    },
    incrementStart() {
      if(this.deactivated) {
        return;
      }
      this.transitioning = true;
      this.setStartValue(this.start+this.step);
    },
    decrementStart() {
      if(this.deactivated) {
        return;
      }
      this.transitioning = true;
      this.setStartValue(this.start-this.step);
    },
    incrementEnd() {
      if(this.deactivated) {
        return;
      }
      this.transitioning = true;
      this.setEndValue(this.end+this.step);
    },
    decrementEnd() {
      if(this.deactivated) {
        return;
      }
      this.transitioning = true;
      this.setEndValue(this.end-this.step);
    },
    activateTouchMove(evt, valueSetterFunction) {
      if(this.deactivated) {
        return;
      }
      // console.log('touchstart')
      evt.preventDefault();
      this.sliderRect = this.$refs.slider.getBoundingClientRect();

      this.transitioning = false;
      //Todo: throttle the move-eventhandler
      let touchmoveHandler = (evt) => {
        // evt.preventDefault();
        // console.log('touchmove');
        let value = this.getClosestValueOfPosition(evt.targetTouches[0].clientX);
        valueSetterFunction(value);
      };

      let touchendHandler = () => {
        // console.log('touchend');
        window.removeEventListener('touchmove', touchmoveHandler);
        window.removeEventListener('touchend', touchendHandler);
        // console.log('eventListeners removed');
      };

      // removing eventlisteners requires to state a non-anonymous handler function
      window.addEventListener('touchend', touchendHandler);
      window.addEventListener('touchmove', touchmoveHandler);
    },
    activateMouseMove(evt, valueSetterFunction) {
      if(this.deactivated) {
        return;
      }
      // console.log('mousedown');
      // evt.preventDefault();
      this.sliderRect = this.$refs.slider.getBoundingClientRect();

      this.transitioning = false;

      // Bug: mouseup not firing after mousemove:
      // workaround: add evt.preventDefault() to the mousedown and mousemove handler
      // https://stackoverflow.com/questions/9506041/javascript-events-mouseup-not-firing-after-mousemove
      // possible explanation:
      // So the reason for this bug is that once you move the mouse you start a system
      // level drag session.  At this point you don't get mouseup any more.
      // evt.preventDefault prevents that drag session from being started
      // https://bugzilla.mozilla.org/show_bug.cgi?id=43258

      //Todo: throttle the move-eventhandler
      let mousemoveHandler = (evt) => {
        evt.preventDefault();
        // console.log('moving');
        let value = this.getClosestValueOfPosition(evt.clientX);
        valueSetterFunction(value);
      };

      let mouseupHandler = (evt) => {
        evt.preventDefault();
        // console.log('mouseup');
        window.removeEventListener('mousemove', mousemoveHandler);
        window.removeEventListener('mouseup', mouseupHandler);
        // console.log('eventListeners removed');
      };

      // removing eventlisteners requires to state a non-anonymous handler function
      window.addEventListener('mouseup', mouseupHandler);
      window.addEventListener('mousemove', mousemoveHandler);
    },
    getClosestValueOfPosition(cursorClientX) {
      // console.log('getClosestValueOfPosition ', cursorClientX);

      let xRange = this.sliderRect.width;
      // let percentagePosition = (cursorClientX-this.sliderRect.x)/xRange; //clientRect.x not supported by Edge or IE, use .left instead
      let percentagePosition = (cursorClientX-this.sliderRect.left)/xRange;

      if(percentagePosition > 1) {
        percentagePosition = 1;
      }
      if(percentagePosition < 0) {
        percentagePosition = 0;
      }

      //the theoreticalValue is  the value between min and max, that matches the position in percent
      let theoreticalValue = (this.max-this.min)*percentagePosition + this.min; // returns a value between [min,max]

      //round the theoreticalValue to the nearest allowed value that's on a valid step
      let value = Math.round(theoreticalValue / this.stepSize) * this.stepSize; // returns a value between [min,max] that falls on a valid step

      // console.log('getClosestValueOfPosition ', value);
      return value;
    },
    setStartValue(value) {
      // console.log('setStartValue ', value)
      this.start = value;
      if(this.start > this.max-this.minRangeFactor*this.step) {
        this.start = this.max-this.minRangeFactor*this.step;
      }
      if(this.start < this.min) {
        this.start = this.min;
      }
      if(this.end - this.start < this.minRangeFactor*this.stepSize) {
        this.end = this.start + this.minRangeFactor*this.stepSize;
      }
      // if(this.start >= this.end) {
      //   this.end = this.start + this.minRangeFactor*this.stepSize;
      // }
      //in case the user messed with the min/max values
      this.isValid = this.integrityCheck();
      if(this.isValid) {
        this.callback(this.start, this.end);
      }
    },
    setEndValue(value) {
      this.end = value;

      if(this.end < this.min+this.minRangeFactor*this.step) {
        this.end = this.min+this.minRangeFactor*this.step;
      }
      if(this.end > this.max) {
        this.end = this.max;
      }
      if(this.end - this.start < this.minRangeFactor*this.stepSize) {
        this.start = this.end - this.minRangeFactor*this.stepSize;
      }
      // if(this.end <= this.start) {
      //   this.start = this.end - this.stepSize;
      // }
      //in case the user messed with the min/max values
      this.isValid = this.integrityCheck();
      if(this.isValid) {
        this.callback(this.start, this.end);
      }
    },
    inputHandler(evt, _callback) {
      // console.log('inputHandler');
      let value = parseFloat(evt.target.value);
      if(!isNaN(value)) {
        _callback(value);
      } else {
        this.isValid = false;
      }
    },
    integrityCheck() {
      if(this.min >= this.max) {
        console.log('slider min value invalid');
        return false;
      }
      if(this.max <= this.min) {
        console.log('slider max value invalid');
        return false;
      }
      if(this.step > this.max - this.min) {
        console.log('slider step value invalid');
        return false;
      }
      if(this.start < this.min) {
        console.log('slider start value invalid');
        return false;
      }
      if(this.end > this.max) {
        console.log('slider end value invalid');
        return false;
      }
      return true;
    }
  },
  created() {
    this.sliderRect = undefined;
  },
  mounted() {
  },
  watch: {
    startValue: function (newVal) {
      this.start = newVal;
      this.integrityCheck();
    },
    endValue: function (newVal) {
      this.end = newVal;
      this.integrityCheck();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.range-slider {
  display: flex;
  align-items: center;
  height: 100%;
}
.range-slider-label-hidden {
  opacity: 0;
}
.range-slider-slider-container {
  flex-grow: 1;
  overflow: hidden; /*so that the handle-containers don't lie over the inut fields*/
  align-self: stretch;
  padding: 0px 8px;
  cursor: pointer;
}
.range-slider-slider {
  position: relative;
  height: 100%;
}
.range-slider-track {
  position: absolute;
  top: 50%;
  left: 0px;
  right: 0px;
  height: 2px;
  transform: translateY(-50%);
  background-color: lightgrey;
}
.range-slider-range {
  position: absolute;
  top: 50%;
  left: 0px;
  width: 100%;
  height: 2px;
  transform-origin: left center;
  background-color: grey;
}
.range-slider-range.range-slider-transition {
  transition: all 0.2s ease;
}
.range-slider-knob-container {
  position: absolute;
  top: 50%;
  left: 0px;
  width: 100%;
  height: 2px;
  transform-origin: left center;
}
.range-slider-knob-container.range-slider-transition {
  transition: all 0.2s ease;
}
.range-slider-knob {
  position: absolute;
  top: 50%;
  left: -4px;
  width: 9px;
  height: 9px;
  border-radius: 100%;
  background-color: grey;
  border: 1px solid black;
  transform: translateY(-50%);
  transform-origin: center center;
  transition: all 0.2s ease;
  cursor: pointer;
}
.range-slider-knob:focus {
  outline: none;
  transform: translateY(-50%);
  background-color: #0099CC !important;
  border-color: black !important;
  border-width: 1px;
}
</style>
