// Mood to Chord Progression Mapping

const MOOD_PROGRESSIONS = {
  happy: [
    [1, 5, 6, 4],        // I-V-vi-IV (classic pop progression)
    [1, 4, 5, 1],        // I-IV-V-I (traditional)
    [1, 6, 4, 5],        // I-vi-IV-V (50s progression)
    [1, 4, 5],           // I-IV-V (simple and bright)
    [1, 5, 6, 3, 4],     // I-V-vi-iii-IV (extended pop)
    [1, 3, 4, 1, 5],     // I-iii-IV-I-V (circular)
    [1, 6, 4, 1, 5, 1],  // I-vi-IV-I-V-I (complete resolution)
    [4, 1, 5, 6, 4, 5, 1] // IV-I-V-vi-IV-V-I (extended uplifting)
  ],
  sad: [
    [6, 4, 1, 5],        // vi-IV-I-V (emotional)
    [1, 6, 3, 4],        // i-VI-III-IV (minor progression)
    [1, 4, 6, 5],        // i-iv-VI-V (melancholic)
    [6, 4, 5],           // vi-IV-V (simple sad)
    [1, 6, 4, 1, 5],     // i-VI-iv-i-V (extended sad)
    [2, 5, 1, 6],        // ii-V-i-VI (jazz sad)
    [1, 3, 6, 4, 1, 5],  // i-III-VI-iv-i-V (dramatic sad)
    [6, 3, 4, 1, 4, 5, 1] // VI-III-iv-i-iv-V-i (complex melancholic)
  ],
  dark: [
    [1, 3, 6, 7],        // i-III-VI-VII (dramatic minor)
    [1, 7, 6, 7],        // i-VII-VI-VII (ominous)
    [1, 2, 1, 2],        // i-ii°-i-ii° (tense)
    [1, 6, 7],           // i-VI-VII (dark and simple)
    [1, 3, 7, 6, 5],     // i-III-VII-VI-V (extended dark)
    [7, 6, 5, 1],        // VII-VI-V-i (descending darkness)
    [1, 2, 3, 7, 6, 1],  // i-ii°-III-VII-VI-i (complex dark)
    [1, 7, 3, 6, 2, 5, 1] // i-VII-III-VI-ii°-V-i (dramatic journey)
  ],
  jazzy: [
    [2, 5, 1, 1],        // ii-V-I (jazz turnaround)
    [1, 6, 2, 5],        // I-vi-ii-V (classic jazz)
    [3, 6, 2, 5],        // iii-vi-ii-V (extended turnaround)
    [2, 5, 1],           // ii-V-I (short turnaround)
    [1, 6, 2, 5, 1],     // I-vi-ii-V-I (complete turnaround)
    [3, 6, 2, 5, 1, 6],  // iii-vi-ii-V-I-vi (extended jazz)
    [1, 4, 3, 6, 2, 5, 1] // I-IV-iii-vi-ii-V-I (sophisticated jazz)
  ],
  tense: [
    [1, 2, 1, 2],        // Chromatic/diminished movement
    [1, 7, 1, 7],        // Unresolved patterns
    [7, 1, 2, 1],        // Leading tone emphasis
    [1, 2, 3],           // i-ii°-III (rising tension)
    [7, 6, 5, 4, 3],     // VII-VI-V-IV-III (descending tension)
    [1, 7, 6, 5, 1],     // i-VII-VI-V-i (tense resolution)
    [2, 1, 2, 3, 2, 1],  // ii°-i-ii°-III-ii°-i (complex tension)
    [1, 7, 6, 2, 3, 7, 1] // i-VII-VI-ii°-III-VII-i (dramatic tension)
  ],
  calm: [
    [1, 4, 1, 5],        // I-IV-I-V (gentle)
    [1, 3, 4, 5],        // I-iii-IV-V (smooth)
    [6, 4, 1, 5],        // vi-IV-I-V (peaceful)
    [1, 4, 5],           // I-IV-V (simple calm)
    [1, 3, 6, 4, 5],     // I-iii-vi-IV-V (extended peaceful)
    [4, 1, 5, 1],        // IV-I-V-I (gentle resolution)
    [1, 6, 3, 4, 1, 5],  // I-vi-iii-IV-I-V (flowing calm)
    [1, 3, 4, 1, 6, 4, 5, 1] // I-iii-IV-I-vi-IV-V-I (extended serenity)
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
  const progressions = MOOD_PROGRESSIONS[mood];
  let fullProgression = [];

  // Build progression until we have at least targetBars chords
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
