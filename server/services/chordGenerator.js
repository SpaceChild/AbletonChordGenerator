const { NOTE_TO_MIDI, NOTE_NAMES } = require('../utils/musicTheory');
const { buildScale } = require('./scaleBuilder');
const { selectProgression, expandProgression } = require('./moodMapper');
const { applyRhythm } = require('./rhythmGenerator');

/**
 * Builds a chord from a scale degree
 * @param {number[]} scale - Scale notes (MIDI numbers)
 * @param {number} degree - Scale degree (1-7)
 * @param {string} chordType - Chord type: 'triad', 'seventh', 'ninth', 'eleventh', 'thirteenth',
 *                              'diminished', 'augmented', 'maj7', 'min7', 'sus2', 'sus4'
 * @returns {number[]} Array of MIDI notes forming the chord
 */
function buildChordFromDegree(scale, degree, chordType = 'triad') {
  const scaleLength = 7;
  const rootIndex = (degree - 1) % scaleLength;
  let root = scale[rootIndex];

  // Special chord types with chromatic alterations
  if (chordType === 'diminished') {
    // Diminished: root + minor 3rd + diminished 5th + diminished 7th
    return [root, root + 3, root + 6, root + 9];
  }

  if (chordType === 'augmented') {
    // Augmented: root + major 3rd + augmented 5th
    return [root, root + 4, root + 8];
  }

  if (chordType === 'maj7') {
    // Major 7th: root + major 3rd + perfect 5th + major 7th
    return [root, root + 4, root + 7, root + 11];
  }

  if (chordType === 'min7') {
    // Minor 7th: root + minor 3rd + perfect 5th + minor 7th
    return [root, root + 3, root + 7, root + 10];
  }

  if (chordType === 'sus2') {
    // Suspended 2nd: root + major 2nd + perfect 5th (no 3rd)
    return [root, root + 2, root + 7];
  }

  if (chordType === 'sus4') {
    // Suspended 4th: root + perfect 4th + perfect 5th (no 3rd)
    return [root, root + 5, root + 7];
  }

  // Standard diatonic chord building from scale
  const thirdIndex = (degree - 1 + 2) % scaleLength;
  const fifthIndex = (degree - 1 + 4) % scaleLength;

  let third = scale[thirdIndex];
  let fifth = scale[fifthIndex];

  // If third or fifth wrapped around, add octave
  if (thirdIndex < rootIndex) {
    third += 12;
  }
  if (fifthIndex < rootIndex) {
    fifth += 12;
  }

  // Build base triad
  const chord = [root, third, fifth];

  // Add extensions based on chord type
  if (chordType === 'seventh' || chordType === 'ninth' || chordType === 'eleventh' || chordType === 'thirteenth') {
    const seventhIndex = (degree - 1 + 6) % scaleLength;
    let seventh = scale[seventhIndex];
    if (seventhIndex < rootIndex || seventhIndex <= fifthIndex) {
      seventh += 12;
    }
    chord.push(seventh);
  }

  if (chordType === 'ninth' || chordType === 'eleventh' || chordType === 'thirteenth') {
    const ninthIndex = (degree - 1 + 1) % scaleLength;
    let ninth = scale[ninthIndex] + 12;
    chord.push(ninth);
  }

  if (chordType === 'eleventh' || chordType === 'thirteenth') {
    const eleventhIndex = (degree - 1 + 3) % scaleLength;
    let eleventh = scale[eleventhIndex] + 12;
    chord.push(eleventh);
  }

  if (chordType === 'thirteenth') {
    const thirteenthIndex = (degree - 1 + 5) % scaleLength;
    let thirteenth = scale[thirteenthIndex] + 12;
    chord.push(thirteenth);
  }

  return chord;
}

/**
 * Automatically selects appropriate chord extension for a given degree and position
 * Uses musical rules to create interesting and varied progressions
 * @param {number} degree - Scale degree (1-7)
 * @param {number} position - Position in progression (0-based)
 * @param {number} totalChords - Total number of chords in progression
 * @param {string} mood - Current mood
 * @returns {string} Chord type ('triad', 'seventh', 'ninth', 'eleventh', 'thirteenth')
 */
function selectChordExtension(degree, position, totalChords, mood) {
  // Final chord tends to be simpler (triad or seventh)
  if (position === totalChords - 1) {
    const options = ['triad', 'seventh', 'maj7'];
    return options[Math.floor(Math.random() * options.length)];
  }

  // V chord (5th degree) sounds great with 7th or dominant variations
  if (degree === 5) {
    const options = ['seventh', 'ninth', 'sus4'];
    return options[Math.floor(Math.random() * options.length)];
  }

  // ii chord (2nd degree) - often gets interesting extensions
  if (degree === 2) {
    if (mood === 'jazzy') {
      const options = ['seventh', 'ninth', 'eleventh', 'min7'];
      return options[Math.floor(Math.random() * options.length)];
    }
    if (mood === 'dark' || mood === 'tense') {
      const options = ['diminished', 'min7', 'seventh'];
      return options[Math.floor(Math.random() * options.length)];
    }
  }

  // I chord (tonic) can vary
  if (degree === 1) {
    if (mood === 'jazzy') {
      const options = ['maj7', 'ninth', 'seventh', 'triad'];
      return options[Math.floor(Math.random() * options.length)];
    }
    const options = ['triad', 'seventh', 'maj7', 'sus2'];
    return options[Math.floor(Math.random() * options.length)];
  }

  // III chord - can be augmented in some contexts
  if (degree === 3 && (mood === 'tense' || mood === 'dark')) {
    const rand = Math.random();
    if (rand < 0.3) return 'augmented';
    if (rand < 0.6) return 'seventh';
    return 'triad';
  }

  // For jazzy mood, use more complex voicings
  if (mood === 'jazzy') {
    const options = ['seventh', 'ninth', 'eleventh', 'thirteenth', 'maj7', 'min7'];
    return options[Math.floor(Math.random() * options.length)];
  }

  // For dark/tense moods, use diminished and altered chords
  if (mood === 'dark' || mood === 'tense') {
    const options = ['seventh', 'ninth', 'diminished', 'min7', 'augmented'];
    return options[Math.floor(Math.random() * options.length)];
  }

  // For happy/calm moods, use major 7ths and suspended chords
  if (mood === 'happy' || mood === 'calm') {
    const options = ['triad', 'seventh', 'maj7', 'sus2', 'sus4', 'ninth'];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Default distribution for sad mood
  const options = ['triad', 'seventh', 'min7', 'ninth', 'eleventh'];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Applies voice leading to minimize note movement between chords
 * @param {Array} chords - Array of chord objects with notes
 * @returns {Array} Chords with optimized voice leading
 */
function applyVoiceLeading(chords) {
  if (chords.length === 0) return chords;

  const result = [chords[0]]; // Keep first chord as is

  for (let i = 1; i < chords.length; i++) {
    const prevChord = result[i - 1].notes;
    const currentChord = [...chords[i].notes];

    // Find best voicing by trying all inversions
    let bestVoicing = currentChord;
    let minDistance = calculateTotalDistance(prevChord, currentChord);

    // Try different octave positions for each note
    const octaves = [-12, 0, 12]; // One octave down, same, one octave up

    function tryAllVoicings(notes, index, current) {
      if (index === notes.length) {
        const distance = calculateTotalDistance(prevChord, current);
        if (distance < minDistance) {
          minDistance = distance;
          bestVoicing = [...current];
        }
        return;
      }

      for (const octave of octaves) {
        current[index] = notes[index] + octave;
        tryAllVoicings(notes, index + 1, current);
      }
    }

    tryAllVoicings(currentChord, 0, [...currentChord]);

    result.push({
      ...chords[i],
      notes: bestVoicing
    });
  }

  return result;
}

/**
 * Calculates total distance between two chords
 * @param {Array} chord1 - First chord notes
 * @param {Array} chord2 - Second chord notes
 * @returns {number} Total distance
 */
function calculateTotalDistance(chord1, chord2) {
  let totalDistance = 0;

  // For each note in chord2, find closest note in chord1
  for (const note2 of chord2) {
    let minDist = Infinity;
    for (const note1 of chord1) {
      const dist = Math.abs(note2 - note1);
      if (dist < minDist) {
        minDist = dist;
      }
    }
    totalDistance += minDist;
  }

  return totalDistance;
}

/**
 * Creates irregular chord changes - distributes chords with varying durations
 * @param {Object[]} chords - Array of chord objects
 * @param {number} totalBars - Total number of bars to fill
 * @returns {Object[]} Array of chord objects with duration property
 */
function createIrregularChordChanges(chords, totalBars) {
  const totalBeats = totalBars * 4; // 4 beats per bar

  // All possible beat durations (1 to 8 beats)
  const allDurations = [1, 2, 3, 4, 5, 6, 7, 8];

  const result = [];
  let currentBeat = 0;
  let chordIndex = 0;

  while (currentBeat < totalBeats) {
    const remainingBeats = totalBeats - currentBeat;

    // If we've used all chords, cycle back to the beginning
    if (chordIndex >= chords.length) {
      chordIndex = 0;
    }

    // Choose a random duration that fits within remaining beats
    let validDurations = allDurations.filter(d => d <= remainingBeats);

    // If no valid durations (shouldn't happen), use remaining beats
    if (validDurations.length === 0) {
      validDurations = [remainingBeats];
    }

    const duration = validDurations[Math.floor(Math.random() * validDurations.length)];

    result.push({
      ...chords[chordIndex],
      durationInBeats: duration
    });

    currentBeat += duration;
    chordIndex++;
  }

  return result;
}

/**
 * Gets the chord name from scale and degree
 * @param {number[]} scale - Scale notes
 * @param {number} degree - Scale degree
 * @returns {string} Chord name (e.g., "Cmaj", "Dm", "Bdim")
 */
function getChordName(scale, degree) {
  const rootMidi = scale[degree - 1] % 12;
  const rootName = NOTE_NAMES[rootMidi];

  // Build the chord to determine quality
  const chord = buildChordFromDegree(scale, degree);

  // Calculate interval from root to third (in semitones)
  const interval = (chord[1] - chord[0]) % 12;

  if (interval === 4) {
    return `${rootName}maj`;      // Major third (4 semitones)
  } else if (interval === 3) {
    return `${rootName}m`;         // Minor third (3 semitones)
  } else if (interval === 6) {
    return `${rootName}dim`;       // Tritone (diminished)
  }

  return rootName;
}

/**
 * Main chord generation function
 * @param {Object} params - Generation parameters
 * @returns {Object} Generated chord data with notes and metadata
 */
function generateChords(params) {
  // 1. Build the scale
  const rootMidi = NOTE_TO_MIDI[params.key];
  if (rootMidi === undefined) {
    throw new Error(`Invalid key: ${params.key}`);
  }

  const scale = buildScale(rootMidi, params.scale);

  // 2. Select progression based on mood
  const progressionDegrees = selectProgression(params.mood);

  // 3. Expand to fill target bar count
  const fullProgression = expandProgression(progressionDegrees, params.bars, params.mood);

  // 4. Build chords from degrees with automatic chord extensions
  const chords = fullProgression.map((degree, index) => {
    // Automatically select chord extension based on degree, position, and mood
    const chordType = selectChordExtension(degree, index, fullProgression.length, params.mood);

    return {
      degree,
      notes: buildChordFromDegree(scale, degree, chordType),
      name: getChordName(scale, degree),
      extension: chordType
    };
  });

  // 5. Apply voice leading if enabled
  let finalChords = params.voiceLeading ? applyVoiceLeading(chords) : chords;

  // 6. Apply irregular chord changes if enabled
  if (params.irregularChanges) {
    finalChords = createIrregularChordChanges(finalChords, params.bars);
  }

  // 7. Apply rhythm pattern
  const bassOptions = {
    addBass: params.addBass || false,
    bassOctave: params.bassOctave || 2
  };
  const midiNotes = applyRhythm(finalChords, params.rhythm, params.bars, params.irregularChanges, bassOptions);

  // 7. Generate chord names string for preview
  const chordNames = chords.map(c => c.name).join(' → ');

  return {
    notes: midiNotes,
    metadata: {
      key: params.key,
      scale: params.scale,
      mood: params.mood,
      progression: progressionDegrees,
      chordNames: chordNames,
      bars: params.bars
    }
  };
}

module.exports = {
  generateChords,
  buildChordFromDegree,
  getChordName
};
