const { NOTE_TO_MIDI, NOTE_NAMES, getRelativeKey, getComplementaryMood } = require('../utils/musicTheory');
const { buildScale } = require('./scaleBuilder');
const { selectProgression, expandProgression } = require('./moodMapper');
const { applyRhythm } = require('./rhythmGenerator');

/**
 * Chord Change Patterns - Define when chord changes happen (in beats)
 * Each pattern is an array of beat counts that define chord durations
 * The sum of beats should match the total bars * 4 (beats per bar)
 * Patterns are organized by number of chords and total bars
 */
const CHORD_CHANGE_PATTERNS = {
  // 3-chord patterns
  3: {
    8: [  // 8 bars = 32 beats
      [8, 12, 12],     // Long-short-short
      [12, 12, 8],     // Short-short-long
      [12, 8, 12],     // Balanced
      [16, 8, 8],      // Very long start
      [8, 8, 16],      // Building to climax
    ],
    16: [ // 16 bars = 64 beats
      [24, 20, 20],    // Long intro
      [20, 24, 20],    // Long middle
      [20, 20, 24],    // Long outro
      [16, 24, 24],    // Balanced growth
      [24, 16, 24],    // Symmetric
    ],
    32: [ // 32 bars = 128 beats
      [48, 40, 40],    // Extended intro
      [40, 48, 40],    // Extended middle
      [40, 40, 48],    // Extended outro
      [44, 42, 42],    // Nearly balanced
    ]
  },
  // 4-chord patterns
  4: {
    4: [  // 4 bars = 16 beats
      [4, 4, 4, 4],    // One per bar (classic)
      [2, 6, 4, 4],    // Quick start
      [4, 4, 6, 2],    // Quick end
      [6, 2, 4, 4],    // Long-short-medium-medium
      [2, 4, 4, 6],    // Building
    ],
    8: [  // 8 bars = 32 beats
      [8, 8, 8, 8],    // Two bars each (classic)
      [4, 12, 8, 8],   // Quick start, long second
      [12, 4, 8, 8],   // Long start
      [8, 8, 4, 12],   // Building to end
      [6, 10, 8, 8],   // Slightly varied
      [8, 6, 10, 8],   // Middle emphasis
    ],
    16: [ // 16 bars = 64 beats
      [16, 16, 16, 16], // Four bars each
      [12, 20, 16, 16], // Extended second
      [20, 12, 16, 16], // Extended first
      [16, 16, 12, 20], // Building to climax
      [14, 18, 16, 16], // Subtle variation
    ],
    32: [ // 32 bars = 128 beats
      [32, 32, 32, 32], // Eight bars each
      [28, 36, 32, 32], // Extended second
      [36, 28, 32, 32], // Extended first
      [32, 32, 28, 36], // Building ending
    ]
  },
  // 5-chord patterns
  5: {
    8: [  // 8 bars = 32 beats
      [4, 8, 8, 8, 4],  // Bookend pattern
      [8, 4, 8, 8, 4],  // Quick middle
      [4, 4, 8, 8, 8],  // Building
      [8, 8, 8, 4, 4],  // Quick ending
      [6, 6, 8, 6, 6],  // Balanced center
    ],
    16: [ // 16 bars = 64 beats
      [12, 16, 12, 12, 12], // Extended second
      [16, 12, 12, 12, 12], // Long intro
      [12, 12, 12, 16, 12], // Middle emphasis
      [12, 12, 12, 12, 16], // Building climax
      [14, 14, 12, 12, 12], // Slight front load
    ],
    32: [ // 32 bars = 128 beats
      [24, 28, 24, 26, 26], // Balanced with variation
      [28, 24, 26, 24, 26], // Long start
      [24, 26, 28, 24, 26], // Middle emphasis
      [26, 26, 24, 24, 28], // Building end
    ]
  },
  // 6-chord patterns
  6: {
    8: [  // 8 bars = 32 beats
      [4, 4, 8, 6, 6, 4],   // Varied
      [6, 6, 4, 4, 8, 4],   // Middle shortening
      [4, 8, 4, 6, 6, 4],   // Early peak
      [8, 4, 4, 4, 8, 4],   // Bookends
      [6, 4, 6, 6, 4, 6],   // Alternating
    ],
    16: [ // 16 bars = 64 beats
      [12, 12, 10, 10, 10, 10], // Front-loaded
      [10, 10, 12, 12, 10, 10], // Middle emphasis
      [10, 10, 10, 12, 12, 10], // Late build
      [10, 10, 10, 10, 12, 12], // Climax ending
      [12, 10, 10, 10, 12, 10], // Symmetric bookends
    ],
    32: [ // 32 bars = 128 beats
      [20, 22, 20, 22, 22, 22], // Slight variation
      [24, 20, 20, 22, 22, 20], // Long intro
      [20, 20, 24, 20, 22, 22], // Middle peak
      [20, 22, 22, 20, 20, 24], // Building to end
    ]
  },
  // 7-chord patterns
  7: {
    8: [  // 8 bars = 32 beats
      [6, 4, 4, 6, 4, 4, 4], // Long-short pattern
      [4, 6, 4, 4, 6, 4, 4], // Alternating emphasis
      [4, 4, 6, 4, 4, 6, 4], // Wave pattern
      [4, 4, 4, 8, 4, 4, 4], // Center emphasis
      [8, 4, 4, 4, 4, 4, 4], // Strong start
    ],
    16: [ // 16 bars = 64 beats
      [10, 10, 8, 10, 8, 10, 8],  // Alternating
      [12, 8, 8, 10, 8, 10, 8],   // Front-loaded
      [8, 10, 8, 12, 8, 10, 8],   // Middle peak
      [8, 8, 10, 8, 10, 8, 12],   // Building climax
      [10, 8, 10, 8, 10, 8, 10],  // Balanced variation
    ],
    32: [ // 32 bars = 128 beats
      [20, 18, 18, 20, 16, 18, 18], // Subtle variation
      [22, 16, 18, 20, 16, 18, 18], // Strong start
      [16, 18, 20, 22, 16, 18, 18], // Mid emphasis
      [16, 18, 18, 16, 20, 18, 22], // Building end
    ]
  },
  // 8-chord patterns
  8: {
    16: [ // 16 bars = 64 beats
      [8, 8, 8, 8, 8, 8, 8, 8],     // Classic - one per 2 bars
      [10, 6, 8, 8, 8, 8, 8, 8],    // Varied start
      [8, 8, 10, 6, 8, 8, 8, 8],    // Mid variation
      [8, 8, 8, 8, 10, 6, 8, 8],    // Late variation
      [8, 8, 8, 8, 8, 8, 6, 10],    // Building end
    ],
    32: [ // 32 bars = 128 beats
      [16, 16, 16, 16, 16, 16, 16, 16], // Classic - 2 bars each
      [18, 14, 16, 16, 16, 16, 16, 16], // Slight variation
      [16, 16, 18, 14, 16, 16, 16, 16], // Mid variation
      [16, 16, 16, 16, 18, 14, 16, 16], // Late variation
    ]
  }
};

/**
 * Selects a chord change pattern that matches the number of chords and total bars
 * @param {number} numChords - Number of chords in the progression
 * @param {number} totalBars - Total number of bars
 * @returns {number[]} Array of beat durations for each chord
 */
function selectChordChangePattern(numChords, totalBars) {
  // Check if we have patterns for this chord count
  if (!CHORD_CHANGE_PATTERNS[numChords]) {
    // Fallback: distribute evenly
    const beatsPerChord = (totalBars * 4) / numChords;
    return Array(numChords).fill(beatsPerChord);
  }

  // Check if we have patterns for this bar count
  const patternsForBars = CHORD_CHANGE_PATTERNS[numChords][totalBars];
  if (!patternsForBars || patternsForBars.length === 0) {
    // Fallback: distribute evenly
    const beatsPerChord = (totalBars * 4) / numChords;
    return Array(numChords).fill(beatsPerChord);
  }

  // Select random pattern from available options
  const randomIndex = Math.floor(Math.random() * patternsForBars.length);
  return patternsForBars[randomIndex];
}

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
 * @param {Array} chords - Array of chord objects with notes and durationInBeats
 * @returns {Array} Chords with optimized voice leading (preserving durationInBeats)
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
      // Preserve durationInBeats and other properties from original chord
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
 * Extracts floating pad chords from generated clip MIDI notes with voice spreading
 * Creates sustained, airy chords from the same chord progression as the clip
 * Uses voice spreading (not voice leading) - chords span a large range with balanced distribution
 * Upper voicings move smoothly (2-3 notes difference) to create a constant floating feeling
 * @param {Object[]} midiNotes - Array of MIDI note objects from a generated clip
 * @param {number} bars - Total number of bars
 * @returns {Object[]} Array of pad MIDI notes with upper voicings
 */
function extractFloatingPadFromClip(midiNotes, bars) {
  if (!midiNotes || midiNotes.length === 0) {
    return [];
  }

  // Group notes by start_time to find all note events
  const notesByTime = {};
  midiNotes.forEach(note => {
    const time = note.start_time;
    if (!notesByTime[time]) {
      notesByTime[time] = [];
    }
    notesByTime[time].push(note);
  });

  // Sort time positions
  const timePositions = Object.keys(notesByTime).map(t => parseFloat(t)).sort((a, b) => a - b);

  // Identify actual chord changes (not just rhythm repetitions)
  // Two consecutive time positions represent the same chord if they have the same unique pitches
  const chordChanges = [];
  let previousChordSignature = null;

  for (let i = 0; i < timePositions.length; i++) {
    const startTime = timePositions[i];
    const notesAtTime = notesByTime[startTime];

    // Get unique pitches and sort them
    const uniquePitches = [...new Set(notesAtTime.map(n => n.pitch))].sort((a, b) => a - b);

    // Create a signature for this chord (string of all pitches)
    const chordSignature = uniquePitches.join(',');

    // Only add if this is a different chord from the previous one
    if (chordSignature !== previousChordSignature) {
      chordChanges.push({
        startTime: startTime,
        pitches: uniquePitches
      });
      previousChordSignature = chordSignature;
    }
  }

  const padNotes = [];
  let previousTopNotes = null;

  // For each actual chord change (not rhythm repetitions), create a wide-spread pad voicing
  for (let i = 0; i < chordChanges.length; i++) {
    const chordChange = chordChanges[i];
    const startTime = chordChange.startTime;
    const uniquePitches = chordChange.pitches;

    // Remove bass note (lowest note) to get the chord tones
    const chordTones = uniquePitches.slice(1);

    if (chordTones.length === 0) continue;

    const root = uniquePitches[0]; // Keep original root for reference

    // Calculate duration until next chord change or end of clip
    let duration;
    if (i < chordChanges.length - 1) {
      duration = chordChanges[i + 1].startTime - startTime;
    } else {
      // Last chord - hold until end of clip
      duration = (bars * 4) - startTime;
    }

    // Create wide-spread voicing across multiple octaves
    // Use voice spreading: distribute notes across a wide range with large intervals

    // LOW REGISTER: Root note in a low octave for foundation
    const lowNote = root + 12; // 1 octave above bass register

    // MID-LOW REGISTER: Use 2nd chord tone (3rd or 5th)
    const midLowNote = chordTones[0] + 12; // 1 octave up

    // MID-HIGH REGISTER: Use 3rd chord tone (5th or 7th) if available
    const midHighNote = chordTones.length > 1 ? chordTones[1] + 24 : chordTones[0] + 24;

    // HIGH REGISTER: Upper extensions (9th, 11th, 13th) for floating sound
    // These should move smoothly between chords
    let topNotes;

    if (previousTopNotes === null) {
      // First chord: add upper extensions spread wide
      topNotes = [
        root + 48 + 2,  // 9th, 4 octaves up
        root + 48 + 5,  // 11th, 4 octaves up
        root + 48 + 9   // 13th, 4 octaves up
      ];
    } else {
      // Subsequent chords: move each top note by only 1-3 semitones
      // to create smooth, constant floating feeling
      const targetNotes = [
        root + 48 + 2,  // Target 9th
        root + 48 + 5,  // Target 11th
        root + 48 + 9   // Target 13th
      ];

      topNotes = previousTopNotes.map((prevNote, i) => {
        const target = targetNotes[i];
        const diff = target - prevNote;

        // Move smoothly: if difference is large, move only 1-3 semitones at a time
        if (Math.abs(diff) <= 3) {
          return target;
        } else if (diff > 0) {
          return prevNote + Math.min(3, diff);
        } else {
          return prevNote + Math.max(-3, diff);
        }
      });
    }

    previousTopNotes = topNotes;

    // Combine all registers: LOW + MID-LOW + MID-HIGH + HIGH (3 top notes)
    // This creates a wide-spread, balanced chord across ~4 octaves
    const allPadNotes = [lowNote, midLowNote, midHighNote, ...topNotes];

    // Create sustained pad notes
    allPadNotes.forEach(pitch => {
      padNotes.push({
        pitch: pitch,
        start_time: startTime,
        duration: duration,
        velocity: 65 // Softer velocity for pad sound
      });
    });
  }

  return padNotes;
}

/**
 * Extracts sustained bass notes from generated clip MIDI notes
 * Finds the lowest note at each actual chord change and creates sustained bass notes
 * Ignores rhythm repetitions - only reacts to actual chord changes
 * @param {Object[]} midiNotes - Array of MIDI note objects from a generated clip
 * @param {number} bars - Total number of bars
 * @returns {Object[]} Array of sustained bass MIDI notes
 */
function extractSustainedBassFromClip(midiNotes, bars) {
  if (!midiNotes || midiNotes.length === 0) {
    return [];
  }

  // Group notes by start_time to find all note events
  const notesByTime = {};
  midiNotes.forEach(note => {
    const time = note.start_time;
    if (!notesByTime[time]) {
      notesByTime[time] = [];
    }
    notesByTime[time].push(note);
  });

  // Sort time positions
  const timePositions = Object.keys(notesByTime).map(t => parseFloat(t)).sort((a, b) => a - b);

  // Identify actual chord changes (not just rhythm repetitions)
  // Two consecutive time positions represent the same chord if they have the same unique pitches
  const chordChanges = [];
  let previousChordSignature = null;

  for (let i = 0; i < timePositions.length; i++) {
    const startTime = timePositions[i];
    const notesAtTime = notesByTime[startTime];

    // Get unique pitches and sort them
    const uniquePitches = [...new Set(notesAtTime.map(n => n.pitch))].sort((a, b) => a - b);

    // Create a signature for this chord (string of all pitches)
    const chordSignature = uniquePitches.join(',');

    // Only add if this is a different chord from the previous one
    if (chordSignature !== previousChordSignature) {
      chordChanges.push({
        startTime: startTime,
        lowestPitch: uniquePitches[0] // The bass note is the lowest pitch
      });
      previousChordSignature = chordSignature;
    }
  }

  const bassNotes = [];

  // For each actual chord change (not rhythm repetitions), create a sustained bass note
  for (let i = 0; i < chordChanges.length; i++) {
    const chordChange = chordChanges[i];
    const startTime = chordChange.startTime;
    const lowestPitch = chordChange.lowestPitch;

    // Calculate duration until next chord change or end of clip
    let duration;
    if (i < chordChanges.length - 1) {
      duration = chordChanges[i + 1].startTime - startTime;
    } else {
      // Last chord - hold until end of clip
      duration = (bars * 4) - startTime;
    }

    bassNotes.push({
      pitch: lowestPitch,
      start_time: startTime,
      duration: duration,
      velocity: 90 // Consistent velocity for sustained bass
    });
  }

  return bassNotes;
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

  // 3. NEW VERSION 1.2: Select chord change pattern based on progression length and total bars
  //    This determines WHEN chords change (in beats), completely decoupled from rhythm pattern
  const changePattern = selectChordChangePattern(progressionDegrees.length, params.bars);

  // 4. Build chords from degrees with automatic chord extensions
  const chords = progressionDegrees.map((degree, index) => {
    // Automatically select chord extension based on degree, position, and mood
    const chordType = selectChordExtension(degree, index, progressionDegrees.length, params.mood);

    return {
      degree,
      notes: buildChordFromDegree(scale, degree, chordType),
      name: getChordName(scale, degree),
      extension: chordType,
      durationInBeats: changePattern[index] // NEW: Assign duration from change pattern
    };
  });

  // 5. Apply voice leading if enabled
  let finalChords = params.voiceLeading ? applyVoiceLeading(chords) : chords;

  // 6. NEW VERSION 1.2: irregularChanges option is now deprecated - patterns handle all timing
  //    Keep the parameter for backward compatibility but don't use it

  // 7. Apply rhythm pattern (now only affects rhythmic subdivision, not chord timing)
  // VERSION 1.2: Rhythm patterns now flow continuously across chord changes
  // Random patterns are generated fresh for each clip, creating variation
  const bassOptions = {
    addBass: params.addBass || false,
    bassOctave: params.bassOctave || 2
  };

  // Pass true for irregularChanges since all chords now have durationInBeats set
  const midiNotes = applyRhythm(finalChords, params.rhythm, params.bars, true, bassOptions);

  // 8. Generate chord names string for preview
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
      changePattern: changePattern // Include the pattern used for debugging
    }
  };
}

/**
 * Generates complementary progressions with bass and pad clips:
 * 1. Original progression with original parameters
 * 2. Complementary progression in relative key with complementary mood
 * 3. Sustained bass from first progression
 * 4. Sustained bass from second progression
 * 5. Floating pad chords from first progression
 * 6. Floating pad chords from second progression
 *
 * @param {Object} params - Generation parameters
 * @returns {Object} { clip1, clip2, bass1, bass2, pad1, pad2 }
 */
function generateDualClips(params) {
  // VERSION 1.2: Each clip gets its own random pattern (if rhythm === 'random')
  // This creates variation between the two clips

  // Generate first clip with original parameters (including bass if requested)
  const clip1 = generateChords(params);

  // Calculate relative key and complementary mood for second clip
  const relativeKey = getRelativeKey(params.key, params.scale);
  const complementaryMood = getComplementaryMood(params.mood);

  // Generate second clip with complementary parameters (also including bass if requested)
  const clip2Params = {
    ...params,
    key: relativeKey.key,
    scale: relativeKey.scale,
    mood: complementaryMood
  };

  const clip2 = generateChords(clip2Params);

  // Extract sustained bass notes directly from the generated clips
  // This ensures the bass notes match exactly the bass notes in the chord clips
  const bassNotes1 = extractSustainedBassFromClip(clip1.notes, params.bars);
  const bassNotes2 = extractSustainedBassFromClip(clip2.notes, params.bars);

  // Extract floating pad chords directly from the generated clips
  // This ensures the pad chords use the SAME chord progression as the clip chords
  // but with voice spreading, no rhythm, and floating upper voicings
  const padNotes1 = extractFloatingPadFromClip(clip1.notes, params.bars);
  const padNotes2 = extractFloatingPadFromClip(clip2.notes, params.bars);

  return {
    clip1: {
      ...clip1,
      metadata: {
        ...clip1.metadata,
        clipType: 'original'
      }
    },
    clip2: {
      ...clip2,
      metadata: {
        ...clip2.metadata,
        clipType: 'complementary',
        originalKey: params.key,
        originalScale: params.scale,
        originalMood: params.mood
      }
    },
    bass1: {
      notes: bassNotes1,
      metadata: {
        key: params.key,
        scale: params.scale,
        mood: params.mood,
        clipType: 'sustained_bass',
        bars: params.bars,
        bassOctave: params.bassOctave || 2
      }
    },
    bass2: {
      notes: bassNotes2,
      metadata: {
        key: relativeKey.key,
        scale: relativeKey.scale,
        mood: complementaryMood,
        clipType: 'sustained_bass',
        bars: params.bars,
        bassOctave: params.bassOctave || 2
      }
    },
    pad1: {
      notes: padNotes1,
      metadata: {
        key: params.key,
        scale: params.scale,
        mood: params.mood,
        clipType: 'floating_pad',
        bars: params.bars
      }
    },
    pad2: {
      notes: padNotes2,
      metadata: {
        key: relativeKey.key,
        scale: relativeKey.scale,
        mood: complementaryMood,
        clipType: 'floating_pad',
        bars: params.bars
      }
    }
  };
}

module.exports = {
  generateChords,
  generateDualClips,
  buildChordFromDegree,
  getChordName
};
