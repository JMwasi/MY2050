<template>
  <div id="levers" class="noselect">

      <div  class="levers-groups-cont">
        <div v-if="appState.yearsEditing" id="year-line-cont">
          <div class="year-line year-line-2020"></div>
          <div class="year-line year-line-2050"></div>
          <div class="year-line year-line-2100"></div>
        </div>
        <div v-for="(group, gIndex) in groups" :key="group.title" class="levers-group">
          <div
            class="levers-group-title-cont"
            :class="{'group-open': !group.hidden}"
          >
            <!-- v-on:click.prevent, v-on:mousedown.prevent prevent the focus onclick, focus only there when tabbing with keys -->
            <div class="levers-group-title levers-column1"
              v-on:click.prevent="toggleGroup(gIndex)"
              v-on:mousedown.prevent="()=>{}"
              v-on:keydown.enter="toggleGroup(gIndex)"
              tabindex="0"
              :aria-expanded="(group.hidden) ? 'false': 'true'"
              role="button"
            >
              <img src="/img/arrow-right.svg" class="levers-group-title-arrow" :class="{rotate90: !group.hidden}"
                alt=""
              >
              <span>{{group.title}}</span>
            </div>

            <span v-if="group.range" class="group-lever-cont levers-column2">
              <!--group control needs to update automatically when one of the inner lever changes, separate component-->
              <GroupLever
                :group="group" :app-state="appState"
              />
            </span>
            <span v-if="appState.yearsEditing" class="levers-column3"></span>
          </div>

          <!--
            needs to be wrapped in ConditionalAutoHeight with v-show on group-visib-status (default is visible) group.isHidden==true
            year selection needs to be in the same wrapper, multiple wrappers could be slightly out of sync
          -->
          <ConditionalAnimateHeight :visible="!group.hidden">
            <div v-for="leverid in group.levers" :key="leverid"
              class="levers-group-levers"
            >
              <span class="levers-title levers-column1"
                :class="{'title-tooltip-visible': (leverid===activeTooltip && titleTooltipOnly)}"
                v-on:mouseenter="activateTooltip(leverid,true)"
                v-on:mouseleave="deactivateTooltip()"
              >
                <span class="levers-title-text">
                  <a :href="'/lever-infos/lever-info-'+ parseInt(leverid+1) +'.pdf'" target="_blank"
                    :aria-describedby="'lever-description-'+leverid + ' lever-value-description-'+leverid"
                    v-on:focus="activateTooltip(leverid, true)"
                    v-on:blur="deactivateTooltip()"
                  >
                    {{levers[leverid].title}}
                  </a>
                </span>
                <div v-if="tooltips[leverid]" class="lever-descr-tooltip"
                  :id="'lever-description-'+leverid"
                >
                  <div>{{tooltips[leverid][0]}}</div>
                </div>
                <div :id="'lever-value-description-'+leverid" class="hidden">
                  Current value is {{levers[leverid].value}}
                </div>
              </span>

              <!--single controls (int/char) will be separate components-->
              <!-- list transition for entering/leaving countries-->
              <span class="single-lever-cont noselect levers-column2">
                <!--don't put single levers on data inside SingleLever, because SingleLever is toggled via v-if (ConditionalAnimateHeight)
                and not present on page-load, value in GroupLever wouldn't update -->
                <SingleLever
                  :lever="levers[leverid]" :app-state="appState"
                  :tooltip-visible="leverid===activeTooltip" :activate-tooltip="activateTooltip" :deactivate-tooltip="deactivateTooltip"
                />
              </span>
              <span v-if="appState.yearsEditing" class="levers-column3">
                <!-- years editing outside of single lever? Yes, more flexible this way-->
                <TimespanSelector :lever="levers[leverid]" :app-state="appState"/>
              </span>
            </div>
          </ConditionalAnimateHeight>

        </div>
      </div>

  </div>
</template>

<script>
import * as inputsService from '../inputsService.js';
import ConditionalAnimateHeight from './lib/ConditionalAnimateHeight.vue';
import GroupLever from './GroupLever.vue';
import SingleLever from './SingleLever.vue';
import TimespanSelector from './TimespanSelector.vue';

export default {
  name: 'Levers',
  components: {
    ConditionalAnimateHeight,
    SingleLever,
    TimespanSelector,
    GroupLever
  },
  props: ['selected', 'appState'],
  data() {
    return {
      groups: inputsService.leverGroups, //reactive because of .hidden property
      tooltips: inputsService.tooltips, //reactive because async data from API
      activeTooltip: undefined,
      titleTooltipOnly: undefined,
      levers: inputsService.levers  // reactive, because the lever values need to be.
      // Don't import single levers in SingleLever, just pass lever-objects
    }
  },
  created() {
    this.levers = inputsService.levers;
    this.timerId = undefined;
  },
  methods: {
    toggleGroup(gId) {
      if(this.groups[gId].hidden) {
        this.$delete(this.groups[gId], 'hidden');
      } else {
        this.$set(this.groups[gId], 'hidden', true);
      }
      //console.log('toggleGroup ', gId, this.groups);
    },
    activateTooltip(leverid, onlyForTitle, callback) {
      // console.log('activateTooltip');
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
      this.timerId = setTimeout( () => {
        if(callback) {
          callback()
        }
        this.activeTooltip = leverid;
        this.titleTooltipOnly = onlyForTitle;
        // console.log('activateTooltip inside ', this.activeTooltip);
      }, 500);
    },
    deactivateTooltip() {
      this.activeTooltip = undefined;
      this.titleTooltipOnly = undefined;
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
    }
  },
  mounted() {
    // console.log('Levers ', this.appState);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#levers {
  flex-grow: 1;
  padding: 11px 0px 15px 0px;
}
.levers-groups-cont {
  position: relative;
}
#year-line-cont {
  position: absolute;
  top: 0px;
  left: 400px;
  width: 72px;
  height: calc(100% - 20px);
}
.year-line {
  position: absolute;
  top: 0px;
  height: 100%;
  width: 1px;
  background-color: lightgrey;
}
.year-line-2020 {
  left: 0px;
}
.year-line-2050 {
  left: 37.5%;
}
.year-line-2100 {
  right: 0px;
}

.sector-title {
  padding-left: 5px;
  font-size: 17px;
  color: #2d2d2d;
  margin-top: 10px;
}
.levers-group {
  margin-top: 5px;
}
.levers-group-title-cont {
  display: flex;
  align-items: center;
  padding: 0px;
  border-top: 1px solid transparent;
}
.levers-group-title {
  padding-left: 15px;
  font-size: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.levers-group-title span {
  margin-left: 10px;
}
.levers-group-title-arrow {
  height: 10px;
  transform: rotate(0deg);
  transform-origin: center center;
  transition: transform 0.2s ease;
}
.levers-group-title-arrow.rotate90 {
  transform: rotate(90deg);
}
.levers-title {
  position: relative;
  padding-left: 31px;
  font-size: 16px;
  box-sizing: border-box;
  color: #5e5e5e;
  display: flex;
  align-items: center;
}
.levers-title-text {
  cursor: pointer;
}
.lever-descr-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 10px;
  background-color: #595959;
  color: white;
  padding: 6px;
  opacity: 0;
  min-height: 30px;
  line-height: 20px;
  font-size: 16px;
  width: 300px;
  border-radius: 4px;
  transition: opacity 0.0s ease;
  transition-delay: 0s;
  box-shadow: 1px 1px 3px 0px rgba(163,163,163,1);
  z-index: 1000;
  pointer-events: none;
}
.lever-descr-tooltip::after{
  content: '';
  position: absolute;
  bottom: -10px;
  left: 20px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 16px 10px 0 10px;
  border-color: #595959 transparent transparent transparent;
  z-index: 2000;
}

.levers-group-levers {
  display: flex;
  align-items: center;
  padding: 0px;
}
.levers-group-levers:last-child {
  padding-bottom: 15px;
}
.levers-group-title-cont:hover .levers-group-title, .levers-group-levers:hover .levers-title {
  color: #0099CC;
  transition-duration: 0s;
}

.levers-group-levers:hover .single-lever .single-lever-step-button.filled {
  /*
    deactivate hover transition when already hovering inside the lever field
    only transition when leaving that field
  */
  /* transition: background-color 0s ease !important; */
  transition-duration: 0s;
}
.levers-group-levers:hover .single-lever .single-lever-value {
  /*leave transition for the .single-lever-value on hover,
  unlike .single-lever-step-partial::after or .single-lever-step-button.filled*/
  opacity: 1;
}

.levers-group-levers:hover .single-lever .single-lever-step-button.filled {
  background-color: #0099CC;
}

.levers-group-levers:hover .single-lever .single-lever-step-partial::after {
  background-color: #0099CC;
  /*
    deactivate hover transition when already hovering inside the lever field
    only transition when leaving that field
  */
  transition-duration: 0s;
}
.levers-group-levers:hover .range-slider-start {
  opacity: 1 !important;
}
.levers-group-levers:hover .range-slider-end {
  opacity: 1 !important;
}


.levers-group-title-cont:hover .single-lever .single-lever-step-button.filled {
  /*
    deactivate hover transition when already hovering inside the lever field
    only transition when leaving that field
  */
  /* transition: background-color 0s ease !important; */
  transition-duration: 0s;
}
.levers-group-title-cont:hover .single-lever .single-lever-value {
  /*leave transition for the .single-lever-value on hover,
  unlike .single-lever-step-partial::after or .single-lever-step-button.filled*/
  opacity: 1;
}

.levers-group-title-cont:hover .single-lever .single-lever-step-button.filled {
  background-color: #0099CC;
}

.levers-group-title-cont:hover .single-lever .single-lever-step-partial::after {
  background-color: #0099CC;
  /*
    deactivate hover transition when already hovering inside the lever field
    only transition when leaving that field
  */
  transition-duration: 0s;
}

.single-lever-cont, .group-lever-cont {
  display: flex;
}

.single-lever-step-connector {
  position: absolute;
  top: -12px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 16px 10px 0 10px;
  border-color: #595959 transparent transparent transparent;
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
}

.single-lever-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0px;
  background-color: #595959;
  color: white;
  padding: 6px;
  opacity: 0;
  min-height: 30px;
  line-height: 20px;
  font-size: 16px;
  width: 300px;
  border-radius: 4px;
  transition: opacity 0.0s ease;
  transition-delay: 0s;
  box-shadow: 1px 1px 3px 0px rgba(163,163,163,1);
  z-index: 1000;
  pointer-events: none;
}
.levers-title.title-tooltip-visible .lever-descr-tooltip {
  opacity: 1;
}

.levers-title.title-tooltip-visible + .single-lever-cont .single-lever-tooltip.visible,
.levers-title.title-tooltip-visible + .single-lever-cont .single-lever-step-connector.visible {
  opacity: 0;
}

</style>
