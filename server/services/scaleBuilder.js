const { MODE_INTERVALS } = require('../utils/musicTheory');

/**
 * Builds a scale starting from a root note
 * @param {number} rootNote - MIDI note number (0-127)
 * @param {string} mode - Mode/scale name (Major, Minor, Dorian, etc.)
 * @returns {number[]} Array of 8 MIDI notes (including octave)
 */
function buildScale(rootNote, mode) {
  const intervals = MODE_INTERVALS[mode];

  if (!intervals) {
    throw new Error(`Unknown mode: ${mode}`);
  }

  const scale = [rootNote];
  let currentNote = rootNote;

  for (const interval of intervals) {
    currentNote += interval;
    scale.push(currentNote);
  }

  return scale;  // Returns 8 notes (root through octave)
}

module.exports = {
  buildScale
};
