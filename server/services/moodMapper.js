// Mood to Chord Progression Mapping

const MOOD_PROGRESSIONS = {
  happy: [
    [1, 5, 6, 4],  // I-V-vi-IV (classic pop progression)
    [1, 4, 5, 1],  // I-IV-V-I (traditional)
    [1, 6, 4, 5]   // I-vi-IV-V (50s progression)
  ],
  sad: [
    [6, 4, 1, 5],  // vi-IV-I-V (emotional)
    [1, 6, 3, 4],  // i-VI-III-IV (minor progression)
    [1, 4, 6, 5]   // i-iv-VI-V (melancholic)
  ],
  dark: [
    [1, 3, 6, 7],  // i-III-VI-VII (dramatic minor)
    [1, 7, 6, 7],  // i-VII-VI-VII (ominous)
    [1, 2, 1, 2]   // i-ii°-i-ii° (tense)
  ],
  jazzy: [
    [2, 5, 1, 1],  // ii-V-I (jazz turnaround)
    [1, 6, 2, 5],  // I-vi-ii-V (classic jazz)
    [3, 6, 2, 5]   // iii-vi-ii-V (extended turnaround)
  ],
  tense: [
    [1, 2, 1, 2],  // Chromatic/diminished movement
    [1, 7, 1, 7],  // Unresolved patterns
    [7, 1, 2, 1]   // Leading tone emphasis
  ],
  calm: [
    [1, 4, 1, 5],  // I-IV-I-V (gentle)
    [1, 3, 4, 5],  // I-iii-IV-V (smooth)
    [6, 4, 1, 5]   // vi-IV-I-V (peaceful)
  ]
};

/**
 * Selects a random progression for the given mood
 * @param {string} mood - Mood name (happy, sad, dark, jazzy, tense, calm)
 * @returns {number[]} Array of scale degrees (1-7)
 */
function selectProgression(mood) {
  const progressions = MOOD_PROGRESSIONS[mood];

  if (!progressions) {
    throw new Error(`Unknown mood: ${mood}`);
  }

  // Select random progression from the mood's options
  const index = Math.floor(Math.random() * progressions.length);
  return progressions[index];
}

/**
 * Expands a base progression to fill the target number of bars with variations
 * @param {number[]} baseProgression - Base progression (typically 4 degrees)
 * @param {number} targetBars - Target number of bars
 * @param {string} mood - Mood for selecting variations
 * @returns {number[]} Expanded progression with variations
 */
function expandProgression(baseProgression, targetBars, mood) {
  if (targetBars <= 4) {
    return baseProgression.slice(0, targetBars);
  }

  // For longer progressions, create variations instead of repeating
  const progressions = MOOD_PROGRESSIONS[mood];
  let fullProgression = [];

  while (fullProgression.length < targetBars) {
    // Pick a random progression from the mood's options
    const randomProgression = progressions[Math.floor(Math.random() * progressions.length)];
    fullProgression = fullProgression.concat(randomProgression);
  }

  // Trim to exact length
  return fullProgression.slice(0, targetBars);
}

module.exports = {
  MOOD_PROGRESSIONS,
  selectProgression,
  expandProgression
};
