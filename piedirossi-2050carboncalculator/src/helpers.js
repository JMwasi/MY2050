export function emptyObject(obj) {
  //Object keys only goes through the enumerable properties
  Object.keys(obj).forEach(function (prop) {
    delete obj[prop];
  });
}

export function throttled(delay, fn) {
  //that's nothing more than a closure construct
  let lastCall = 0;
  return function (...args) { //all other parameters except delay and fn (those, that haven't been assigned)
    //console.log('throttled ', lastCall);
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

export function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length) {
      return false;
    }
    for(let i = arr1.length-1; i >= 0; i--) {
        if(arr1[i] !== arr2[i]) {
          return false;
        }
    }
    return true;
}

export function arrayAverage(arr) {
  //a for loop is faster than reduce()
  var sum = 0;
  for(var i=0, n=arr.length; i < n; i++) {
    sum += arr[i];
  }
  return sum/arr.length;
}

export function multiplyArrayByScalar(a,s) {
  for(let i=0, len=a.length; i<len; i++) {
    a[i] *= s;
  }
}

//maybe move it to the store
export function triggerWindowResize() {
  window.requestAnimationFrame(()=>{
    var resizeEvent = window.document.createEvent('UIEvents');
    resizeEvent .initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(resizeEvent);
  });
  console.log('triggerWindowResize');
}
