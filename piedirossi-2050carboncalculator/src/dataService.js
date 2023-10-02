import axios from 'axios';
import 'url-search-params-polyfill';

import * as inputsService from './inputsService.js';
import * as outputsService from './outputsService.js';


// this appState Object is not immutable (unlike the principle that stores use, where an immutable state-Object gets replaced instead of altered),
// it can be altered anywhere, it is made reactive by putting it on state in the App.vue component
// using this approach, because a store is too clumsy for this small app
export var appState = {
  activeTab: 0,  //only gets set inside outputsService.selectTab which also gets called over routing
                    //needs to be null on page-load (see App.vue and routeService)
  activeSubtab: 0, //only gets set inside outputsService.selectTab which also gets called over routing
  pathwayIndex: -1,
  userAction: [],
  yearsEditing: false,
  isMobile: undefined,
  inputLatency: 200, // latency for lever change, 500 normally
  mainScreenRouteString: '/',
  requestsPending: 0,
  lastAPIResponse: undefined,
  focusGroup1: [] // storing refs for cross component focussing
};

export function createURLParam() {
  let leverParamString = inputsService.getQueryparamStringFromLeverSettings();

  if(leverParamString) {
    //create empty URLSearchParams instance and append the levers parameter
    var urlParams = new URLSearchParams();
    urlParams.append('levers', leverParamString);
    // console.log('createURLParam ', urlParams);
    return urlParams;
  } else {
    return undefined;
  }
}

export function updateURL(params = new URLSearchParams(window.location.search)) {
  // params has a default value, which is evaluated each time updateURL() is called without parameters or is called with undefined
  // console.log('updateURL ', params);

  let routeString = createRouteString(params);

  // console.log('rewriteURL ', routeString);
  history.pushState({path: routeString}, null, routeString);
  appState.mainScreenRouteString = routeString;
  // console.log('updateURL ', routeString);
}

export function createRouteString(params) {
  let routeString = '/'+outputsService.getTabRoute(appState.activeTab) + "/";
  routeString += outputsService.getSubtabRoute(appState.activeTab,appState.activeSubtab)+"/";
  // console.log('params ', params);
  routeString += '?'+params.toString();
  // console.log('createRouteString ', routeString);
  return routeString;
}


var timerId; //for debouncing user input (fast tab changes)
var apiCall; // For cancelling old requests (only the last request should get processed, previous ones should get cancelled)
export function fetchData(debounceTime=0) {

  // not ideal to call getQueryparamStringFromLeverSettings() again,
  // because in most cases it already has been called in createURLParam already
  let leverSettings = inputsService.getQueryparamStringFromLeverSettings();
  let requestURL = '/pathways/' + leverSettings + '/data';

  // debouncing
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => {

    //cancelling pending axios request, if any
    if(apiCall) {
      apiCall.cancel(); //axios functionality
    }
    apiCall = axios.CancelToken.source(); //source() is a factory function

    appState.requestsPending++;

    //request body not necessary, backend only evaluates the url
    return axios.get(requestURL,{})
    .then(function (response) {
      outputsService.parseResponse(response.data);
      inputsService.initTooltips(response.data.choicesDescriptions);
      if(appState.requestsPending > 0) {
        appState.requestsPending--;
      }
      appState.userAction = []; //reset appState, optional here
      appState.lastAPIResponse = Date.now();
    })
    .catch(function (error) {
      console.log('error fetching', error);
      if(appState.requestsPending > 0) {
        appState.requestsPending--;
      }
      appState.userAction = []; //reset appState, optional here
      appState.lastAPIResponse = Date.now();
    });

  }, debounceTime);
}

export function getLeverInfos() {
  // on the backend use the server.rb from the /backend folder

  return axios.get('/leverinfos',{}).then(function (response) {
      // levers are to be used sync
      console.log('levers ', response, JSON.stringify(response.data.levers,null,2));

      // leverDescriptions are to be used async
      console.log('leverDescriptions ', JSON.stringify(response.data.leverDescriptions,null,2));
  })
  .catch(function (error) {
    console.log('error fetching', error);
  });

}
