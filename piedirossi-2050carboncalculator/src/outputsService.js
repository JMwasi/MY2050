import {Charts} from './config/charts.js';
import {Tabs} from './config/tabs.js';

import {appState} from './dataService.js';

export var charts = {};
export var tabs = [];

export var apiData = {};

export const TimeAxis = [2015, 2020, 2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070, 2075, 2080, 2085, 2090, 2095, 2100];


// internal structure
var routeMap = {};

export function initCharts() {
  charts = Charts;
}

export function initTabs() {
  tabs = Tabs;

  // init routeMap
  tabs.forEach((tab,index)=> {
    routeMap[tab.route] = {
      subtabs: [],
      index: index
    };
    if(tab.subtabs) {
      tab.subtabs.forEach((subtab) => {
        routeMap[tab.route].subtabs.push(subtab.route);
      });
    }
  });
}

export function getTabRoute(tabIndex) {
  let tab = tabs[tabIndex];
  if(tab) {
    return tabs[tabIndex].route;
  }
}

export function getSubtabRoute(tabIndex, subtabIndex) {
  // easier to have this as a get-function instead of an object that reflects the tab/subtab structure
  let tab = tabs[tabIndex];
  if(tab && Array.isArray(tab.subtabs) && tab.subtabs[subtabIndex]) {
    return tab.subtabs[subtabIndex].route;
  }
}

export function getTabIndex(tabRoute) {
  // it's better to have this in a function instead of just exposing the functional objects behind it
  // so that where it is needed it's more readable to just have a function call instead of doing some
  // other operations

  let tab = routeMap[tabRoute];
  return (tab && typeof tab.index !== 'undefined') ? tab.index : -1;
}

export function getSubtabIndex(tabRoute, subtabRoute) {
  let tab = routeMap[tabRoute];

  if(tab && tab.subtabs) {
    return tab.subtabs.indexOf(subtabRoute);
  } else {
    return -1;
  }
}

export function selectSubtab(ind) {
  appState.activeSubtab = ind; //import as appState, not as dataService.appState
  // console.log('selectSubTab ', ind)
}

export function selectTab(ind, subtabInd) {
  // this function assumes tabInd and subtabInd to be valid,
  // because the origin from which is called is build from a valid/existing structure

  appState.activeTab = ind;
  appState.activeSubtab = subtabInd;

}

export function getCurrentTimeAxis() {
  if(appState.yearsEditing) {
    return TimeAxis.slice(0)
  } else {
    let lastIndex = TimeAxis.indexOf(2050);
    return TimeAxis.slice(0, lastIndex+1);
  }
}

export function getIndexOfYear(year) {
  return TimeAxis.indexOf(year);
}

export function parseResponse(data) {
  //this functions also fixes poor design choices of the API

  apiData = data;
  // console.log('parseResponse data ', data);
  // console.log('parseResponse parsedData ', apiData);
  // console.log('parseResponse parsedData.warningsL4 ', apiData.warningsL4);


  //remove the top line of the sankey data, because that one is just a heading
  apiData.sankey.splice(0,1);
}
