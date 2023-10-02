/*
index.html.erb
 structure.choices


server_rb
data_from_model.rb

# Set the 9 decimal points between 1.1 and 3.9
FLOAT_TO_LETTER_MAP = Hash["abcdefghijklmnopqrstuvwxyzABCD".split('').map.with_index { |l,i| [(i/10.0)+1,l] }]
FLOAT_TO_LETTER_MAP[0.0] = '0'
FLOAT_TO_LETTER_MAP[1.0] = '1'
FLOAT_TO_LETTER_MAP[2.0] = '2'
FLOAT_TO_LETTER_MAP[3.0] = '3'
FLOAT_TO_LETTER_MAP[4.0] = '4'

LETTER_TO_FLOAT_MAP = FLOAT_TO_LETTER_MAP.invert


LETTER_TO_DATES_MAP = Hash[]
LETTER_TO_DATES_MAP['a'] = '2020'
LETTER_TO_DATES_MAP['b'] = '2025'
LETTER_TO_DATES_MAP['c'] = '2030'
LETTER_TO_DATES_MAP['d'] = '2035'
LETTER_TO_DATES_MAP['e'] = '2040'
LETTER_TO_DATES_MAP['f'] = '2045'
LETTER_TO_DATES_MAP['g'] = '2050'
LETTER_TO_DATES_MAP['h'] = '2055'
LETTER_TO_DATES_MAP['i'] = '2060'
LETTER_TO_DATES_MAP['j'] = '2065'
LETTER_TO_DATES_MAP['k'] = '2070'
LETTER_TO_DATES_MAP['l'] = '2075'
LETTER_TO_DATES_MAP['m'] = '2080'
LETTER_TO_DATES_MAP['n'] = '2085'
LETTER_TO_DATES_MAP['o'] = '2090'
LETTER_TO_DATES_MAP['p'] = '2095'
LETTER_TO_DATES_MAP['q'] = '2100'
*/


export const ParamToValueMap = {
  "4": 4,
  "D": 3.9,
  "C": 3.8,
  "B": 3.7,
  "A": 3.6,
  "z": 3.5,
  "y": 3.4,
  "x": 3.3,
  "w": 3.2,
  "v": 3.1,
  "3": 3,
  "t": 2.9,
  "s": 2.8,
  "r": 2.7,
  "q": 2.6,
  "p": 2.5,
  "o": 2.4,
  "n": 2.3,
  "m": 2.2,
  "l": 2.1,
  "2": 2,
  "j": 1.9,
  "i": 1.8,
  "h": 1.7,
  "g": 1.6,
  "f": 1.5,
  "e": 1.4,
  "d": 1.3,
  "c": 1.2,
  "b": 1.1,
  "1": 1
};

export const ValueToParamMap = {
  "1": "1",
  "1.1":"b",
  "1.2":"c",
  "1.3":"d",
  "1.4":"e",
  "1.5":"f",
  "1.6":"g",
  "1.7":"h",
  "1.8":"i",
  "1.9":"j",
  "2":  "2",
  "2.1":"l",
  "2.2":"m",
  "2.3":"n",
  "2.4":"o",
  "2.5":"p",
  "2.6":"q",
  "2.7":"r",
  "2.8":"s",
  "2.9":"t",
  "3":  "3",
  "3.1":"v",
  "3.2":"w",
  "3.3":"x",
  "3.4":"y",
  "3.5":"z",
  "3.6":"A",
  "3.7":"B",
  "3.8":"C",
  "3.9":"D",
  "4":  "4",
};


export const YearToLetterMap = {
  "2020":"a",
  "2025":"b",
  "2030":"c",
  "2035":"d",
  "2040":"e",
  "2045":"f",
  "2050":"g",
  "2055":"h",
  "2060":"i",
  "2065":"j",
  "2070":"k",
  "2075":"l",
  "2080":"m",
  "2085":"n",
  "2090":"o",
  "2095":"p",
  "2100":"q"
};

export const LetterToYearMap = {
  "a":2020,
  "b":2025,
  "c":2030,
  "d":2035,
  "e":2040,
  "f":2045,
  "g":2050,
  "h":2055,
  "i":2060,
  "j":2065,
  "k":2070,
  "l":2075,
  "m":2080,
  "n":2085,
  "o":2090,
  "p":2095,
  "q":2100
};
