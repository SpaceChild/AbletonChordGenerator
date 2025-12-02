const { NOTE_TO_MIDI, NOTE_NAMES } = require('../utils/musicTheory');
const { buildScale } = require('./scaleBuilder');
const { selectProgression, expandProgression } = require('./moodMapper');
const { applyRhythm } = require('./rhythmGenerator');

/**
 * Builds a chord from a scale degree
 * @param {number[]} scale - Scale notes (MIDI numbers)
 * @param {number} degree - Scale degree (1-7)
 * @param {string} chordType - 'triad', 'seventh', 'ninth', 'eleventh', or 'thirteenth'
 * @returns {number[]} Array of MIDI notes forming the chord
 */
function buildChordFromDegree(scale, degree, chordType = 'triad') {
  // Scale has 8 notes (indices 0-7), but we need to wrap around for higher chord tones
  // and potentially jump octaves
  const scaleLength = 7; // We use 7-note scale (ignore octave for wrapping)

  const rootIndex = (degree - 1) % scaleLength;
  const thirdIndex = (degree - 1 + 2) % scaleLength;  // Skip one note (Terz)
  const fifthIndex = (degree - 1 + 4) % scaleLength;  // Skip three notes (Quinte)

  let root = scale[rootIndex];
  let third = scale[thirdIndex];
  let fifth = scale[fifthIndex];

  // If third or fifth wrapped around, add octave
  if (thirdIndex < rootIndex) {
    third += 12;  // Add one octave
  }
  if (fifthIndex < rootIndex) {
    fifth += 12;  // Add one octave
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
    // 9th = 2nd + octave (scale degree + 1)
    const ninthIndex = (degree - 1 + 1) % scaleLength;
    let ninth = scale[ninthIndex] + 12;  // Always one octave up
    chord.push(ninth);
  }

  if (chordType === 'eleventh' || chordType === 'thirteenth') {
    // 11th = 4th + octave (scale degree + 3)
    const eleventhIndex = (degree - 1 + 3) % scaleLength;
    let eleventh = scale[eleventhIndex] + 12;  // Always one octave up
    chord.push(eleventh);
  }

  if (chordType === 'thirteenth') {
    // 13th = 6th + octave (scale degree + 5)
    const thirteenthIndex = (degree - 1 + 5) % scaleLength;
    let thirteenth = scale[thirteenthIndex] + 12;  // Always one octave up
    chord.push(thirteenth);
  }

  return chord;
}

/**
 * Applies spread voicing to a chord
 * @param {number[]} chord - Chord notes
 * @returns {number[]} Voiced chord notes
 */
function applySpreadVoicing(chord) {
  if (chord.length === 3) {
    // Triad: Root one octave lower, Third in middle, Fifth one octave higher
    return [
      chord[0] - 12,      // Root (Bass)
      chord[1],           // Third
      chord[2] + 12       // Fifth (Top)
    ];
  } else if (chord.length === 4) {
    // Seventh: Root lower, Third + Fifth in middle, Seventh higher
    return [
      chord[0] - 12,      // Root (Bass)
      chord[1],           // Third
      chord[2],           // Fifth
      chord[3] + 12       // Seventh (Top)
    ];
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
    return Math.random() < 0.7 ? 'triad' : 'seventh';
  }

  // V chord (5th degree) sounds great with 7th
  if (degree === 5) {
    return Math.random() < 0.6 ? 'seventh' : 'ninth';
  }

  // ii chord (2nd degree) in jazzy moods gets extensions
  if (degree === 2 && mood === 'jazzy') {
    const extensions = ['seventh', 'ninth', 'eleventh'];
    return extensions[Math.floor(Math.random() * extensions.length)];
  }

  // I chord (tonic) can vary
  if (degree === 1) {
    const weights = [0.4, 0.3, 0.2, 0.1]; // triad, seventh, ninth, eleventh
    const rand = Math.random();
    if (rand < weights[0]) return 'triad';
    if (rand < weights[0] + weights[1]) return 'seventh';
    if (rand < weights[0] + weights[1] + weights[2]) return 'ninth';
    return 'eleventh';
  }

  // For jazzy mood, use more extensions
  if (mood === 'jazzy') {
    const extensions = ['seventh', 'ninth', 'eleventh', 'thirteenth'];
    return extensions[Math.floor(Math.random() * extensions.length)];
  }

  // For dark/tense moods, prefer seventh and ninth
  if (mood === 'dark' || mood === 'tense') {
    return Math.random() < 0.5 ? 'seventh' : 'ninth';
  }

  // Default distribution for other moods
  const rand = Math.random();
  if (rand < 0.4) return 'triad';
  if (rand < 0.7) return 'seventh';
  if (rand < 0.9) return 'ninth';
  return 'eleventh';
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
  const finalChords = params.voiceLeading ? applyVoiceLeading(chords) : chords;

  // 6. Apply rhythm pattern
  const midiNotes = applyRhythm(finalChords, params.rhythm, params.bars);

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
      bars: params.bars,
      bpm: params.bpm
    }
  };
}

module.exports = {
  generateChords,
  buildChordFromDegree,
  applySpreadVoicing,
  getChordName
};
