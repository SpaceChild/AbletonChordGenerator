// Rhythm Pattern Generation

const RHYTHM_PATTERNS = {
  whole: [
    { start: 0.0, duration: 4.0 }  // One chord per bar (whole note)
  ],
  half: [
    { start: 0.0, duration: 2.0 },
    { start: 2.0, duration: 2.0 }  // Two hits per bar (half notes)
  ],
  quarters: [
    { start: 0.0, duration: 1.0 },
    { start: 1.0, duration: 1.0 },
    { start: 2.0, duration: 1.0 },
    { start: 3.0, duration: 1.0 }  // Four hits per bar (quarter notes)
  ],
  eighths: [
    { start: 0.0, duration: 0.5 },
    { start: 0.5, duration: 0.5 },
    { start: 1.0, duration: 0.5 },
    { start: 1.5, duration: 0.5 },
    { start: 2.0, duration: 0.5 },
    { start: 2.5, duration: 0.5 },
    { start: 3.0, duration: 0.5 },
    { start: 3.5, duration: 0.5 }  // Eight hits per bar (eighth notes)
  ]
};

/**
 * Generates a structured random rhythm pattern with musical note values
 * Creates combinations like "whole, half, half" or "quarter, quarter, half, whole"
 * that add up to exactly 4 beats per bar
 * @returns {Object[]} Array of timing objects
 */
function generateRandomPattern() {
  // Available note durations (in beats)
  const noteDurations = [4.0, 2.0, 1.0, 0.5];  // whole, half, quarter, eighth

  const pattern = [];
  let currentTime = 0.0;

  // Fill the 4-beat bar with random note values
  while (currentTime < 4.0) {
    const remainingBeats = 4.0 - currentTime;

    // Filter available durations to only those that fit
    const validDurations = noteDurations.filter(d => d <= remainingBeats);

    // Pick a random valid duration
    const duration = validDurations[Math.floor(Math.random() * validDurations.length)];

    pattern.push({
      start: currentTime,
      duration: duration
    });

    currentTime += duration;
  }

  return pattern;
}

/**
 * Applies rhythm pattern to chord progression
 * @param {Object[]} chordProgression - Array of chord objects with notes
 * @param {string} rhythmPattern - Pattern name
 * @param {number} bars - Number of bars
 * @returns {Object[]} Array of MIDI note objects
 */
function applyRhythm(chordProgression, rhythmPattern, bars) {
  const notes = [];

  chordProgression.forEach((chord, barIndex) => {
    // Get the pattern for this rhythm
    const pattern = rhythmPattern === 'random'
      ? generateRandomPattern()
      : RHYTHM_PATTERNS[rhythmPattern];

    if (!pattern) {
      throw new Error(`Unknown rhythm pattern: ${rhythmPattern}`);
    }

    // Apply pattern to each chord
    pattern.forEach(timing => {
      chord.notes.forEach(midiNote => {
        notes.push({
          pitch: midiNote,
          start_time: (barIndex * 4.0) + timing.start,  // 4 beats per bar
          duration: timing.duration,
          velocity: 80 + Math.floor(Math.random() * 20)  // Velocity 80-100 (some variation)
        });
      });
    });
  });

  return notes;
}

module.exports = {
  RHYTHM_PATTERNS,
  applyRhythm,
  generateRandomPattern
};
