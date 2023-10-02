import page from 'page';

import 'url-search-params-polyfill';

import * as dataService from './dataService.js';
import * as outputsService from './outputsService.js';
import * as inputsService from './inputsService.js';


import {appState} from './dataService.js';


/*
Cases:
  - all tabs and subtabs can be routed to through user entering URL, then main.js is run which triggers an API-fetch in any case
  - all tabs can theoretically be routed through through clicking on a page-internal link
    (especially when designing the tabs as links for accessibility reasons maybe)
    in that case the routeTab and routeSubtab need to be able to start a fetch
      --> but this fetch shouldn't happen when loading the page!
          --> fetching should be toggle-able
  - the home-route can be routed to through the logo-link, this ones needs to be able to start a fetch

*/

var shouldFetch = true; //default


function compareQueryParameter(qs1,qs2,key) {

  let params1 = new URLSearchParams(qs1);
  let params2 = new URLSearchParams(qs2);

  let matching = true;

  let param1 = params1.get(key);
  let param2 = params2.get(key);

  if(!param1 || param2 !== param1) {
    matching = false;
  }

  if(!param2 || param2 !== param1) {
    matching = false;
  }

  // console.log('matching ', matching);
  return matching;
}

// function compareQueryParameters(qs1,qs2) {
//   //IE11 doesn't support iterators, and it's hard to find a slim, working polyfill
//
//   // compares the parameters of two query strings, doesn't directly compare the strings with each other,
//   // because the order of parameters might be different, which is irrellevant when one wants to know
//   // if the parameters match.
//
//   let params1 = new URLSearchParams(qs1);
//   let params2 = new URLSearchParams(qs2);
//
//   let matching = true;
//
//   //params.keys() returns an iterator
//   for(let p of params1.keys()) {
//     if(!params2.has(p) || params2.get(p) !== params1.get(p)) {
//       matching = false;
//       break;
//     }
//   }
//
//   //need to be done for second paramset, because the params1 might be shorter than param2
//   for(let p of params2.keys()) {
//     // console.log('p ', p)
//     if(!params1.has(p) || params1.get(p) !== params2.get(p)) {
//       matching = false;
//       break;
//     }
//   }
//
//   // console.log('matching ', matching);
//   return matching;
// }


export function getURLParams(queryString, paramsToLookFor) {
  //console.log(leverData.levers);
  var results = {};

  const urlParams = new URLSearchParams(queryString);
  paramsToLookFor.forEach((name)=> {
    let param = urlParams.get(name);
    if(param) {
      results[name] = param;
    }
  });

  return results;
}

export function initRoutes() {
  /*set up routes*/
  page('/', routeHome);
  page('/:tab', routeTab);
  page('/:tab/:subtab', routeSubtab);
  page('*', routeNotFound);

  //activating
  page();
}

//todo: actually start a request on routeToTab and on startup
var routeHome = function() {

  let routeOfFirstTab = outputsService.getTabRoute(0);
  let routeOfFirstSubtab = outputsService.getSubtabRoute(0,0);

  if(routeOfFirstTab && routeOfFirstSubtab) {
    page.redirect('/'+routeOfFirstTab+'/'+routeOfFirstSubtab);
  }

};

var routeTab = function(context) {

  //redirects to the first subtab

  let tabname = context.params.tab;

  let tabIndex = outputsService.getTabIndex(tabname);

  let routeOfFirstSubtab;

  //check if tabname is valid and fetch route of its first subtab
  if(tabIndex >= 0) {
    routeOfFirstSubtab = outputsService.getSubtabRoute(tabIndex, 0);
  }

  if(routeOfFirstSubtab) {
    page.redirect('/'+tabname+'/'+routeOfFirstSubtab);
  } else {
    // if no valid tab / subtab was found redirect to home
    page.redirect('/');
  }
};

var routeSubtab = function(context) {
  // window.location.search is empty in some cases, even though it shouldn't be
  // context.querystring still works then
  console.log('routeSubTab');

  // abort if current route and levers are set already
  if(appState.mainScreenRouteString === context.path) {
    return;
  }

  //check context, correct to default values for routeOfTab and routeOfSubtab if necessary
  let tabname = context.params.tab;
  let subtabname = context.params.subtab;

  let tabIndex = outputsService.getTabIndex(tabname);
  let subtabIndex;

  // console.log('tabIndex tabname ', tabIndex, tabname, subtabname);

  // load first tab with first subtab by default if wrong tabname
  if(tabIndex < 0) {
    tabIndex = 0;
    subtabIndex = 0;
  } else {
    subtabIndex = outputsService.getSubtabIndex(tabname, subtabname);
    if(subtabIndex < 0) {
      subtabIndex = 0;
    }
  }

  // console.log('tabIndex subtabIndex ', tabIndex, subtabIndex);

  let routeQuerystring = context.querystring; //works

  let appStateQuerystring = appState.mainScreenRouteString.substring(appState.mainScreenRouteString.indexOf('?'));
  console.log('appStateQuerystring ', appStateQuerystring);
  console.log('routeQuerystring ', routeQuerystring);


  let paramsMatch = compareQueryParameter(routeQuerystring, appStateQuerystring, 'levers');
  // console.log('paramsMatch ', paramsMatch);

  // If the old and new querystrings didn't match, set all parameters again, even if only one might be different
  // resetting the whole state instead of changing it is a bit less efficient, but safer and less prone to bugs
  // --> disadvantage: prefetching a subtab is impossible, because it would start a new fetch here, because the URLs didn't match

  if(!paramsMatch) {
    let urlParameters = getURLParams(routeQuerystring, ['levers']);
    if(urlParameters.levers) {
      let pathwaySuccesfullySet = inputsService.setPathway(urlParameters.levers);
      // console.log('routeSubtab success ', pathwaySuccesfullySet);
      if(!pathwaySuccesfullySet) {
        inputsService.setExamplePathway(0);
      }
    }
  }

  appState.yearsEditing = inputsService.yearsDeviateFromDefaults(); // boolean

  if(appState.yearsEditing) {
    inputsService.maximizeAllGroups();
  } else {
    inputsService.maximizeGroup(1);
  }

  outputsService.selectTab(tabIndex,subtabIndex);

  // important: update the appState.mainScreenRouteString (after setting all state inside the app)
  // create the routeString from app data, not from window.location.pathname,
  // because the URL might be bad and the tabs might have been corrected to valid ones
  let appRouteString = dataService.createRouteString(dataService.createURLParam());
  appState.mainScreenRouteString = appRouteString

  // don't store anchor-links in appState.mainScreenRouteString
  if(context.hash) {
    appRouteString += '#'+context.hash;
  }

  // DON'T call history.pushState, use history.replaceState to correct or complete the URL (matching it against the appState)
  // Always work with full a URL that reflects the appState's get parameters, this is important when working with the
  // browser-history, so that when a user clicks back or forward, the URL always contains all necessary information to
  // rebuild the appState. Additional info that is not stored in the URL can optionally be stored in the history's stateObj
  history.replaceState({path: appRouteString}, null, appRouteString);

  if((!paramsMatch) && shouldFetch) {
    console.log('routeSubtab fetching');
    dataService.fetchData(0);
  }
};

var routeNotFound = function() {
  console.log('routeNotFound');

  page.redirect('/');
}
