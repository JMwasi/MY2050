const types = {
  "pattern-0": {
    path: "M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11",
  },
  "pattern-1": {
    path: "M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9",
  },
  "pattern-5": {
    path: "M 3 3 L 8 3 L 8 8 L 3 8 Z",
  },
  "pattern-6": {
    path: "M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0",
  }
}

export const getPattern = function(type, color) {
  let patternObj = types[type];
  if(!patternObj) {
    return '';
  }

  patternObj.width = 10;
  patternObj.height = 10;
  patternObj.color = color;

  return {
    pattern: patternObj
  };
};
