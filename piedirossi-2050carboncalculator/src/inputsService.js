import * as helpers from './helpers.js';

import {appState} from './dataService.js';

import {ExamplePathways} from './config/examplePathways.js';
import {ParamToValueMap, ValueToParamMap, YearToLetterMap, LetterToYearMap} from './config/pathwayValueMap.js';

export var leverGroups = [];
export var levers = {}; //each single entry will be reactive
export var leverOrder = [];

export var tooltips = {};

/*example-Pathways*/
export var examplePathways = ExamplePathways;


export function parseLeverData(data) {

  data.forEach((lever)=> {
    //maybe refactor sorting into leverGroup into separate function in order to keep functions short

    //skip if lever-id is already present (bad data)
    if(leverOrder.indexOf(lever.number) >= 0) {
      return;
    }

    //push id (=number) into leverOrder Array
    leverOrder.push(lever.number);

    //add entry in levers object
    levers[lever.number] = {
      id: lever.number,
      title: lever.name,
      startdate: lever.startdate,
      enddate: lever.enddate,
      defaultstart: lever.startdate,
      defaultend: lever.enddate,
      value: 1,
      range: lever.levels
    };

    //sort lever into leverGroups
    //Array.find() not supported in IE, using Array.some()
    let singleleverGroupObject;
    leverGroups.some((lg) => {
      if(lg.title === lever.group) {
        singleleverGroupObject = lg;
        return true;
      } else {
        return false;
      }
    });

    if(singleleverGroupObject) {
      // append lever to existing group
      singleleverGroupObject.levers.push(lever.number);
    } else {
      // create new group entry
      leverGroups.push({
        title: lever.group,
        levers: [lever.number],
        hidden: true
      });
    }
  });

  setGroupRanges();
  console.log('parseLeverData ', leverGroups, levers, leverOrder);
}

export function initTooltips(rawTooltips) {
  //unfortunately the tooltips come with every API response
  if(Object.keys(tooltips).length) {
    return;
  }
  leverOrder.forEach((id,index)=> {
    let tooltip = rawTooltips[index];
    if(tooltip) {
      tooltips[id] = tooltip;
    }
  });
}

export function getTooltipText(leverId, valueIndex) {
  // console.log('getTooltipText');

  let tooltipData = tooltips[leverId];
  let lever = levers[leverId];

  if(!tooltipData || !lever) {
    return "";
  }

  let tooltipText;
  if(tooltipData[valueIndex] && tooltipData[valueIndex+1]) {
    tooltipText = tooltipData[valueIndex+1].trim();

    //replace the endyear in the raw text with the currently set end year
    if(lever.defaultend !== lever.enddate) {
      tooltipText = tooltipText.replace(lever.defaultend,lever.enddate);
      console.log('asd', lever.defaultend, lever.enddate);
    }
  }
  return tooltipText;
}

export function maximizeGroup(index) {
  let group = leverGroups[index];
  if(group) {
    group.hidden = false;
  }
}

export function maximizeAllGroups() {
  leverGroups.forEach((group)=> {
    group.hidden = false;
  });
}

function setGroupRanges() {
  leverGroups.forEach((group)=> {

    let referenceRange = levers[group.levers[0]].range.slice();

    let leverRangesAreEqual = group.levers.every(function(levId) {
      return (helpers.arraysEqual(referenceRange,levers[levId].range.slice()));
    });
    if(leverRangesAreEqual) {
      group.range = referenceRange;
    }
  });
}

function resetLeverYears() {
  Object.keys(levers).forEach((num)=> {
    let lever = levers[num];
    lever.startdate = lever.defaultstart;
    lever.enddate = lever.defaultend;
  });
}

export function setYearMode(isYearEditing) {
  // isYearEditing: true  //2100 mode
  // isYearEditing: false //2050 mode
  appState.yearsEditing = isYearEditing;

  if(!appState.yearsEditing) {
    resetLeverYears();
  }

  if(appState.userAction.indexOf('yearModeChange') < 0) {
    appState.userAction.push('yearModeChange');
  }
}

export function setValue(leverid, value) {
  // this functions asusmes that leverid is valid, which is safe enough in this case
  // maybe move pathway and userAction change to separate functions

  levers[leverid].value = value;

  appState.pathwayIndex = -1;

  if(appState.userAction.indexOf('leverChange') < 0) {
    appState.userAction.push('leverChange');
  }
}

export function setValues(leverids, value) {
  // this functions asusmes that leverids are valid, which is safe enough in this case
  // works on an array of lever Ids,
  // actually the setValue function that just works on one scalar value can be replaced by this function

  leverids.forEach((levId)=>{
    levers[levId].value = value;
  });

  appState.pathwayIndex = -1;

  if(appState.userAction.indexOf('leverChange') < 0) {
    appState.userAction.push('leverChange');
  }
}

export function resetLevers() {
  Object.keys(levers).forEach((leverId) => {
    let lever = levers[leverId];
    lever.value = 1;
    lever.startdate = lever.defaultstart;
    lever.enddate = lever.defaultend;
  });
  appState.pathwayIndex = -1;
  if(appState.userAction.indexOf('leverChange') < 0) {
    appState.userAction.push('leverChange');
  }
}

export function setLeverTimeRange(leverid, startyear, endyear) {
  // this functions asusmes that leverid is valid, which is safe enough in this case

  levers[leverid].startdate = startyear;
  levers[leverid].enddate = endyear;

  appState.pathwayIndex = -1;

  if(appState.userAction.indexOf('leverChange') < 0) {
    appState.userAction.push('leverChange');
  }
}

export function yearsDeviateFromDefaults() {
  return Object.keys(levers).some((id) => {
    let lever = levers[id];
    return (lever.startdate !== lever.defaultstart || lever.enddate !== lever.defaultend);
  });
}

function validatePathway(pathwayString) {
  let numberOfLevers = leverOrder.length;
  if(pathwayString.length !== 3 * numberOfLevers) {
    return false;
  }
  for(let i=0; i<numberOfLevers; i++) {
    if(
      typeof ParamToValueMap[pathwayString[i]] === 'undefined' ||
      typeof LetterToYearMap[pathwayString[i+numberOfLevers]] === 'undefined' ||
      typeof LetterToYearMap[pathwayString[i+2*numberOfLevers]] === 'undefined'
    ) {
      return false
    }
  }
  return true;
}

export function setPathway(pathwayString) {
  // the pathwayString looks the same as the levers query string for now

  // [{value: , startdate: , enddate: }]
  // any changes should be atomic, only a valid pathway can be assigned
  // don't partially assign new values and stop midway, when hitting an invalid value
  // or, maybe better, validate the pathway first, no the validation should be part of this function
  // but can be in an external function that is called from here

  if(!pathwayString || !validatePathway(pathwayString)) {
    return false;
  }

  console.log('setPathway ', pathwayString);

  let numberOfLevers = leverOrder.length;

  for(let i=0; i<numberOfLevers; i++) {
    let lever = levers[leverOrder[i]];
    lever.value = ParamToValueMap[pathwayString[i]];
    lever.startdate = LetterToYearMap[pathwayString[i+numberOfLevers]];
    lever.enddate = LetterToYearMap[pathwayString[i+2*numberOfLevers]];
  }

  console.log('setPathway ', levers);
  return true;

  // should return a success boolean, so in case it failed, a new valid pathway can be loaded

}

export function setExamplePathway(index) {
  let examplePathway = examplePathways[index];
  console.log('setExamplePathway ', examplePathway);
  if(!examplePathway) {
    return;
  }
  let success = setPathway(examplePathway.values);
  if(success) {
    appState.pathwayIndex = index;
  }
  // appState.pathwayIndex = index;
}

export function getQueryparamStringFromLeverSettings() {
  let valueString = '';
  let startYearString = '';
  let endYearString = '';

  let queryString = '';

  Object.keys(levers).forEach((num)=>{
    let lever = levers[num];
    // if a value from a map is undefined then 'undefined' gets added and the length check will fail
    valueString += ValueToParamMap[lever.value];
    startYearString += YearToLetterMap[lever.startdate];
    endYearString += YearToLetterMap[lever.enddate];
  });

  queryString = valueString + startYearString + endYearString;

  if(queryString.length !== 3*Object.keys(levers).length) {
    console.log('querystring could not be created ', queryString);
    return '';
  }

  return queryString;
}
