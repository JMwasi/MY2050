export function buildLineChartData(timeAxis, rawSeries) {
  // timeAxis: [..,2012,2013,2014,..]
  // rawSeries: [{name: "", id: "", color: "", data: [2,3,23,3,4,6,5,..]}, ..]

  let formattedSeries = [];

  rawSeries.forEach((series)=> {

    if(!series.data) {
      return;
    }

    let singleSeries = {
      name: series.name,
      id: series.id,
      data: series.data.map((value, index) => [timeAxis[index], value]),
    };
    if(series.color) {
      singleSeries.color = series.color;
    }
    // uncomment if patterns are used (see TwoCharts.vue)
    // if(series.label) {
    //   singleSeries.label = series.label;
    // }

    formattedSeries.push(singleSeries);
  });

  return formattedSeries;
}


function findNullstellen(timeAxis, seriesData, xTolerance=0.001) {
  // seriesData = [{id: "", data: [2,3,1,4,6,5,..]}]
  // returns all Nullstellen of all series in seriesData merged into one object (intermediateTimes)
  // ignores nullstellen that already land on a timeAxis-Stelle

  let intermediateTimes = []; //[{x: 2012.4, xBefore: 2012, xAfter: 2013}]
  // { "2012.4": [2012,2015], "nullstellenValue": [valueBefore, valueAfter]}
  // console.log('findNullstellen ', timeAxis, seriesData);

  let nullStellenBySeriesId = {}; // {"someId": [2012.4, 2015.6], ..}

  // let x0Before; //last nullstelle that was found

  seriesData.forEach((ser) => {

    let activePart = "positive";
    let valueBefore;

    for(let i=0, len=timeAxis.length; i<len; i++) {
      let x = timeAxis[i];
      let value = ser.data[i];
      let crossingFound;
      // console.log('findNullstellen ', ser.name, x, value, activePart);

      // switch activePart on sign change
      // zero values are ignored, because they are already part of the series
      // and duplicate datapoints would lead to bugs in rendering
      if(value < 0) {
        if(activePart === "positive" && i > 0 && i < len) {
          crossingFound = true;
        }
        activePart = "negative";
      }
      if(value > 0) {
        if(activePart === "negative" && i > 0 && i < len) {
          crossingFound = true;
        }
        activePart = "positive";
      }

      if(crossingFound) {

        let xBefore = timeAxis[i-1];

        let m = (value - valueBefore) / (x-xBefore); // x and xBefore are sometimes more than one unit apart!!
        let x0 = -1*valueBefore/m + xBefore; //y1/m + x1

        // console.log('crossingFound ', ser.name, x, x0);
        // don't add Nullstellen that already exist in the timeAxis, because duplicate datapoints lead to rendering errors
        // also don't add datapoints if the nullStelle is already within tolerance to an already existing datapoint
        if(timeAxis.indexOf(x0) >= 0 || x0 - xBefore < xTolerance || x - x0 < xTolerance) {
          continue;
        }
        //also skip a successive Nullstelle if the one before is within xTolerance
        // if(typeof x0Before !== "undefined" && x0 - x0Before < xTolerance) {
        //   continue;
        // }

        // setting toFixed() to 6 is important, if setting toFixed(2) sometimes it hits a round year
        // which results in double entries in data, because parseFloat is ignoring zero decimals.
        // parseFloat(2009.00) =>> 2009
        // also if there are two equal nullstellen which might happen with toFixed(2)
        // it also results in the error, that the highcharts updates are jumpy
        // I haven't been able to fully track down the error, but using .toFixed(6)
        // mitigates it and makes it much less likely to occur
        // let nullStelle = x0.toFixed(8); //string
        // console.log('nullstelle ', nullStelle, ser, x0, timeAxis.indexOf(x0) >= 0);
        //console.log('crossingFound ', ser.name, xBefore, year, valueBefore, value, 'm:', m, x0, nullStelle);
        // intermediateTimes[nullStelle] = [xBefore, x]; //mark that time for other series to fill in data point
        intermediateTimes.push({
          // x: nullStelle,
          x: x0,
          xBefore: xBefore,
          xAfter: x
        });
        if(nullStellenBySeriesId[ser.id]) {
          nullStellenBySeriesId[ser.id].push(x0);
        } else {
          nullStellenBySeriesId[ser.id] = [x0];
        }

        // x0Before = x0;
      }
      valueBefore = value;

    }
  });

  // console.log('intermediateTimes ', intermediateTimes);
  return [intermediateTimes, nullStellenBySeriesId];
}

function splitSeriesData(seriesData) {
  // all series.data needs to be sorted already

/*
  [{x:2015, y: 10},{x: 2015.5, y: 0},{x: 2016, y: 0},{x: 2017},{},{},{},{}]

  only y:0 are relevant
  when 0 is hit it get's written in the currentactivePart
  when a sign change happens to negative, the negative value gets written in the negativePart,
  but also the negativePart needs the 0 in it entered for the xBefore

  I always hit the 0, I never jump directly to negative values!
  If I hit the 0 and the next value has a different sign, then the 0 gets written in both parts

*/


  let positiveSeries = [];
  let negativeSeries = [];

  seriesData.forEach((series) => {

    let data = series.data;
    let positiveData = [];
    let negativeData = [];

    let activePart = positiveData;

    for(let i=0, len=data.length; i<len; i++) {
      let point = data[i];
      let y = data[i].y;

      if(y > 0) {
        positiveData.push(point);
        activePart = positiveData;
      }
      if(y < 0) {
        negativeData.push(point);
        activePart = negativeData;
      }
      if(y === 0) {
        //ignore when first or last entry
        // console.log('hit 1 ', series.name, data[i].x, i, len);
        if(i > 0 && i < len-1) {
          let yBefore = data[i-1].y;
          let yAfter= data[i+1].y;
          if(Math.sign(yBefore) !== Math.sign(yAfter)) {
            // push to both parts, when 0 is followed by a sign change
            // but disable the tooltip for one
            // console.log('hit 2 ', series.name, data[i].x);
            positiveData.push(point);
            negativeData.push({
              ...point, //spread operator
              noTooltip: true
            });
          } else {
            //when no sign change, just push to current active part
            // console.log('hit 3 ', series.name, data[i].x);
            activePart.push(point);
          }
        } else {
          // if 0 is first or last value it gets pushed to the current active part.
          // activePart is positiveData for i==0
          activePart.push(point);
        }
      }
    }

    positiveSeries.push({
      name: series.name,
      type: 'area',
      id: series.id ? series.id : series.name,
      data: positiveData,
      stack: 'positive',
      color: series.color ? series.color : undefined
      // uncomment if patterns are used:
      // label: series.label ? series.label : {enabled: true}
    });

    negativeSeries.push({
      name: series.name,
      type: 'area',
      linkedTo: series.id,
      id: series.id ? series.id +'neg' : series.name +'neg', //id also necessary for negative series (for animated data update) I guess
      data: negativeData,
      stack: 'negative',
      color: series.color ? series.color : undefined
      // uncomment if patterns are used
      // label: series.label ? series.label : {enabled: true}
    });

  });

  return [positiveSeries, negativeSeries];
}



function linearInterpolatePoint(x, xBefore, xAfter, yBefore, yAfter) {
  let y;

  if(typeof xBefore !== 'undefined' && typeof xAfter !== 'undefined' && typeof yBefore !== 'undefined' && typeof yAfter !== 'undefined') {
    let m = (yAfter - yBefore)/(xAfter-xBefore);
    y = m*(x-xBefore) + yBefore;
  }
  // y can be undefined
  return y;
}

function formatRawSeriesData(timeAxis, rawSeries) {

  let formattedSeries = [];

  rawSeries.forEach((series) => {
    let data = series.data;
    let dataArray = [];

  //  console.log('asd ', data, timeAxis);
    if(timeAxis && data && data.length === timeAxis.length) {
      data.forEach((value, index) => {
        dataArray.push({
          x:timeAxis[index],
          y: value
        });
      });
    }

    formattedSeries.push({
      name: series.name,
      id: series.id ? series.id : series.name,
      data: dataArray,
      color: series.color ? series.color : undefined
      // uncomment if patterns are used
      // label: series.label ? series.label : {enabled: true}
    });

  });

  return formattedSeries;
}


export function buildStackedAreaChartDataWithNegative(timeAxis, rawSeries) {
  // timeAxis: [..,2012,2013,2014,..]
  // rawSeries: [{name: "", id: "", color: "", data: [2,3,23,3,4,6,5,..]}, ..]

  // remove any coupling:
  // 1. series should be filtered already, everything inside series ends up in the chart
  // 2.   if(!outputs[outp.id] || !outputs[outp.id].data) {
  //        return;
  //      }
  // 3. outputs[outp.id].data[country]
  // 4.   if(!totalData.hasOwnProperty(timeAxis[index])) {
  //		    totalData[timeAxis[index]] = 0;
  //	    }
  // 5. name: outp.title ? outp.title : outputs[outp.id].title,



  let [nullstellen, nullStellenBySeriesId] = findNullstellen(timeAxis, rawSeries);
  // let totalSeries = getTotalData(timeAxis, rawSeries);
  // nullstellen does not contain any values, that are already part of te timeAxis
  // console.log('nullstellen ', nullstellen);
  // console.log('nullStellenBySeriesId ', nullStellenBySeriesId);

  let series = formatRawSeriesData(timeAxis, rawSeries);


  // calculate intermediate values for all series (necessary, otherwise gaps appear in areas where no data is defined)
  nullstellen.forEach((nullst) => {

    series.forEach((ser) => {
      let seriesContainsEntry = ser.data.some((point) => {
        return point.x === nullst.x;
      });
      if(!seriesContainsEntry) {
        let y;

        // console.log('!seriesContainsEntry ', ser.name, ser.id, nullStellenBySeriesId);
        if(nullStellenBySeriesId[ser.id] && nullStellenBySeriesId[ser.id].indexOf(nullst.x) >= 0) {
          y = 0;
        } else {
          //linear interpolation
          let pointBefore = ser.data.find((point) => point.x === nullst.xBefore);
          let pointAfter = ser.data.find((point) => point.x === nullst.xAfter);
          y = linearInterpolatePoint(nullst.x, nullst.xBefore, nullst.xAfter, pointBefore.y, pointAfter.y);
        }
        // console.log('intermediate values positive ', ser.name, y);

        if(typeof y !== "undefined") {
          ser.data.push({
            x: nullst.x,
            y: y,
            // states: {hover: {enabled: false}},
            // marker: {enabled: false},
            marker: {
              states: {
                hover: {
                  enabled: false
                }
              }
            },
            noTooltip: true
          });
        }
      }
    });
  });

  //sort all data arrays of all series (Highcharts need data to be sorted by x)
  series.forEach((ser)=> {
    ser.data.sort(function compare(a, b) {
      if (a.x < b.x) {
        return -1;
      }
      if (a.x > b.x) {
        return 1;
      }
      // a must be equal to b
      return 0;
    })
  });

  // split seriesData according to positive or negative stack
  // important! The series.data need to be sorted already!!
  let [positiveSeries, negativeSeries] = splitSeriesData(series);
  // console.log('positiveSeries, negativeSeries ', JSON.parse(JSON.stringify(positiveSeries)), JSON.parse(JSON.stringify(negativeSeries)));

  series = positiveSeries.concat(negativeSeries);



  // console.log('buildStackedAreaChartDataWithNegative series ', JSON.stringify(series, null, 2));
  return series;
}
