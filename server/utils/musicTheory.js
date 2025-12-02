// Music Theory Constants for Chord Generation

// MIDI Note Mapping (Middle C = 60)
const NOTE_TO_MIDI = {
  'C': 60,
  'C#': 61,
  'Db': 61,
  'D': 62,
  'D#': 63,
  'Eb': 63,
  'E': 64,
  'F': 65,
  'F#': 66,
  'Gb': 66,
  'G': 67,
  'G#': 68,
  'Ab': 68,
  'A': 69,
  'A#': 70,
  'Bb': 70,
  'B': 71
};

// Scale/Mode Intervals (in semitones)
const MODE_INTERVALS = {
  'Major': [2, 2, 1, 2, 2, 2, 1],
  'Minor': [2, 1, 2, 2, 1, 2, 2],
  'Dorian': [2, 1, 2, 2, 2, 1, 2],
  'Phrygian': [1, 2, 2, 2, 1, 2, 2],
  'Lydian': [2, 2, 2, 1, 2, 2, 1],
  'Mixolydian': [2, 2, 1, 2, 2, 1, 2],
  'Aeolian': [2, 1, 2, 2, 1, 2, 2],  // Same as Natural Minor
  'Locrian': [1, 2, 2, 1, 2, 2, 2]
};

// Note names for chord naming
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

module.exports = {
  NOTE_TO_MIDI,
  MODE_INTERVALS,
  NOTE_NAMES
};
