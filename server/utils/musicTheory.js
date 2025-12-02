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

/**
 * Gets the relative key (parallel key) for a given key and scale
 * Major → Relative Minor (3 semitones down)
 * Minor → Relative Major (3 semitones up)
 * Other modes → Toggle between Major/Minor equivalent
 *
 * @param {string} key - The root note (e.g., 'C', 'D#')
 * @param {string} scale - The scale/mode name
 * @returns {Object} { key: string, scale: string }
 */
function getRelativeKey(key, scale) {
  const rootMidi = NOTE_TO_MIDI[key];

  // Determine if the scale is major-like or minor-like
  const majorLikeScales = ['Major', 'Lydian', 'Mixolydian'];
  const minorLikeScales = ['Minor', 'Aeolian', 'Dorian', 'Phrygian', 'Locrian'];

  let newMidi, newScale;

  if (majorLikeScales.includes(scale)) {
    // Major → Relative Minor (down 3 semitones)
    newMidi = rootMidi - 3;
    newScale = 'Minor';
  } else if (minorLikeScales.includes(scale)) {
    // Minor → Relative Major (up 3 semitones)
    newMidi = rootMidi + 3;
    newScale = 'Major';
  } else {
    // Default: just toggle the scale
    newMidi = rootMidi;
    newScale = scale === 'Major' ? 'Minor' : 'Major';
  }

  // Normalize MIDI to 0-11 range (within one octave)
  while (newMidi < 60) newMidi += 12;
  while (newMidi > 71) newMidi -= 12;

  // Find the note name for the new MIDI value
  const noteIndex = newMidi % 12;
  const newKey = NOTE_NAMES[noteIndex];

  return {
    key: newKey,
    scale: newScale
  };
}

/**
 * Gets the complementary mood for creating contrasting progressions
 * Happy ↔ Sad
 * Dark ↔ Calm
 * Jazzy ↔ Tense
 *
 * @param {string} mood - The original mood
 * @returns {string} The complementary mood
 */
function getComplementaryMood(mood) {
  const moodPairs = {
    'happy': 'sad',
    'sad': 'happy',
    'dark': 'calm',
    'calm': 'dark',
    'jazzy': 'tense',
    'tense': 'jazzy'
  };

  return moodPairs[mood] || mood;
}

module.exports = {
  NOTE_TO_MIDI,
  MODE_INTERVALS,
  NOTE_NAMES,
  getRelativeKey,
  getComplementaryMood
};
