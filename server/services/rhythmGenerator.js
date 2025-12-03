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
 * VERSION 1.2: Creates patterns that span multiple bars for continuous flow
 * @param {number} totalBeats - Total beats to fill (e.g., 32 for 8 bars)
 * @returns {Object[]} Array of timing objects
 */
function generateRandomPattern(totalBeats = 32) {
  // Available note durations (in beats)
  const noteDurations = [4.0, 2.0, 1.0, 0.5];  // whole, half, quarter, eighth

  const pattern = [];
  let currentTime = 0.0;

  // Fill the entire duration with random note values
  // This creates a pattern that flows across chord changes
  while (currentTime < totalBeats) {
    const remainingBeats = totalBeats - currentTime;

    // Filter available durations to only those that fit
    let validDurations = noteDurations.filter(d => d <= remainingBeats);

    // Prevent too many whole notes in a row for more variation
    if (pattern.length > 0 && pattern[pattern.length - 1].duration === 4.0 && Math.random() < 0.6) {
      // 60% chance to exclude whole note after a whole note
      validDurations = validDurations.filter(d => d < 4.0);
    }

    // If no valid durations left, use remaining beats
    if (validDurations.length === 0) {
      validDurations = [remainingBeats];
    }

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
 * VERSION 1.2: Patterns now flow continuously across chord changes
 * @param {Object[]} chordProgression - Array of chord objects with notes
 * @param {string} rhythmPattern - Pattern name ('random', 'quarters', etc.)
 * @param {number} bars - Number of bars
 * @param {boolean} irregularChanges - Whether chords have irregular durations
 * @param {Object} bassOptions - Bass note options {addBass: boolean, bassOctave: number}
 * @returns {Object[]} Array of MIDI note objects
 */
function applyRhythm(chordProgression, rhythmPattern, bars, irregularChanges = false, bassOptions = {}) {
  const notes = [];
  const totalBeats = bars * 4;

  // VERSION 1.2: Generate pattern for entire clip length
  let pattern;
  if (rhythmPattern === 'random') {
    // Generate random pattern spanning the entire clip
    pattern = generateRandomPattern(totalBeats);
  } else {
    // For predefined patterns, we need to repeat them across the clip
    const basePattern = RHYTHM_PATTERNS[rhythmPattern];
    if (!basePattern) {
      throw new Error(`Unknown rhythm pattern: ${rhythmPattern}`);
    }

    // Repeat the 4-beat pattern across all bars
    pattern = [];
    for (let bar = 0; bar < bars; bar++) {
      basePattern.forEach(timing => {
        pattern.push({
          start: (bar * 4) + timing.start,
          duration: timing.duration
        });
      });
    }
  }

  // Build a map of which chord is active at each beat
  const chordAtBeat = [];
  let currentBeat = 0;
  chordProgression.forEach(chord => {
    const chordDuration = chord.durationInBeats || 4;
    const endBeat = currentBeat + chordDuration;

    for (let beat = currentBeat; beat < endBeat; beat += 0.25) { // Check every 16th note
      chordAtBeat.push({
        time: beat,
        chord: chord
      });
    }

    currentBeat = endBeat;
  });

  // Apply pattern continuously across chord changes
  pattern.forEach(timing => {
    // Find which chord is active at this timing position
    const activeChordEntry = chordAtBeat.find(entry =>
      entry.time <= timing.start && entry.time + 0.25 > timing.start
    );

    if (!activeChordEntry) return;

    const activeChord = activeChordEntry.chord;

    // Add chord notes
    activeChord.notes.forEach(midiNote => {
      notes.push({
        pitch: midiNote,
        start_time: timing.start,
        duration: timing.duration,
        velocity: 80 + Math.floor(Math.random() * 20)
      });
    });

    // Add bass note if enabled
    if (bassOptions.addBass && activeChord.notes.length > 0) {
      const rootNote = activeChord.notes[0];
      const bassNote = rootNote - (12 * (bassOptions.bassOctave || 2));
      notes.push({
        pitch: bassNote,
        start_time: timing.start,
        duration: timing.duration,
        velocity: 85 + Math.floor(Math.random() * 15)
      });
    }
  });

  return notes;
}

module.exports = {
  RHYTHM_PATTERNS,
  applyRhythm,
  generateRandomPattern
};
