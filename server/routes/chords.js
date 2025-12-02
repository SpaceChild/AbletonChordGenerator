const express = require('express');
const router = express.Router();
const { generateDualClips } = require('../services/chordGenerator');
const { sendToAbleton } = require('../utils/pythonBridge');

/**
 * Validates chord generation parameters
 */
function validateParams(params) {
  const errors = [];

  const validKeys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
  const validScales = ['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
  const validMoods = ['happy', 'sad', 'dark', 'jazzy', 'tense', 'calm'];
  const validBars = [4, 8, 16, 32];
  const validRhythms = ['whole', 'half', 'quarters', 'eighths', 'random'];

  if (!params.key || !validKeys.includes(params.key)) {
    errors.push('Invalid key. Must be one of: ' + validKeys.join(', '));
  }

  if (!params.scale || !validScales.includes(params.scale)) {
    errors.push('Invalid scale. Must be one of: ' + validScales.join(', '));
  }

  if (!params.mood || !validMoods.includes(params.mood)) {
    errors.push('Invalid mood. Must be one of: ' + validMoods.join(', '));
  }

  if (!params.bars || !validBars.includes(parseInt(params.bars))) {
    errors.push('Invalid bar count. Must be one of: ' + validBars.join(', '));
  }

  if (!params.rhythm || !validRhythms.includes(params.rhythm)) {
    errors.push('Invalid rhythm. Must be one of: ' + validRhythms.join(', '));
  }

  if (params.targetTrack === undefined || params.targetTrack < 0 || params.targetTrack > 127) {
    errors.push('Invalid target track. Must be between 0 and 127');
  }

  if (params.targetSlot === undefined || params.targetSlot < 0 || params.targetSlot > 127) {
    errors.push('Invalid target slot. Must be between 0 and 127');
  }

  if (params.voiceLeading !== undefined && typeof params.voiceLeading !== 'boolean') {
    errors.push('Invalid voiceLeading. Must be a boolean');
  }

  if (params.irregularChanges !== undefined && typeof params.irregularChanges !== 'boolean') {
    errors.push('Invalid irregularChanges. Must be a boolean');
  }

  if (params.addBass !== undefined && typeof params.addBass !== 'boolean') {
    errors.push('Invalid addBass. Must be a boolean');
  }

  if (params.bassOctave !== undefined && (params.bassOctave < 1 || params.bassOctave > 3)) {
    errors.push('Invalid bassOctave. Must be between 1 and 3');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * POST /api/chords/generate
 * Generates chords and sends them to Ableton
 */
router.post('/generate', async (req, res) => {
  try {
    const params = req.body;

    console.log('Received generate request:', params);

    // Validate parameters
    const validation = validateParams(params);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Generate dual chord progressions with bass clips
    console.log('Generating dual chord progressions with bass clips...');
    const dualClipData = generateDualClips(params);

    console.log(`Generated clip 1: ${dualClipData.clip1.notes.length} notes`);
    console.log(`Generated clip 2: ${dualClipData.clip2.notes.length} notes`);
    console.log(`Generated bass 1: ${dualClipData.bass1.notes.length} notes`);
    console.log(`Generated bass 2: ${dualClipData.bass2.notes.length} notes`);

    // Send all 4 clips to Ableton via Python
    console.log('Sending 4 clips to Ableton...');
    const result = await sendToAbleton({
      clip1: {
        notes: dualClipData.clip1.notes,
        track: parseInt(params.targetTrack),
        slot: parseInt(params.targetSlot),
        clipLength: parseInt(params.bars)
      },
      clip2: {
        notes: dualClipData.clip2.notes,
        track: parseInt(params.targetTrack),
        slot: parseInt(params.targetSlot) + 1,  // Next slot below
        clipLength: parseInt(params.bars)
      },
      bass1: {
        notes: dualClipData.bass1.notes,
        track: parseInt(params.targetTrack) + 1,  // Track to the right
        slot: parseInt(params.targetSlot),
        clipLength: parseInt(params.bars)
      },
      bass2: {
        notes: dualClipData.bass2.notes,
        track: parseInt(params.targetTrack) + 1,  // Track to the right
        slot: parseInt(params.targetSlot) + 1,  // Next slot below
        clipLength: parseInt(params.bars)
      }
    });

    if (result.success) {
      res.json({
        success: true,
        message: '4 clips created in Ableton (2 chord + 2 bass)',
        data: {
          clip1: {
            metadata: dualClipData.clip1.metadata,
            noteCount: dualClipData.clip1.notes.length
          },
          clip2: {
            metadata: dualClipData.clip2.metadata,
            noteCount: dualClipData.clip2.notes.length
          },
          bass1: {
            metadata: dualClipData.bass1.metadata,
            noteCount: dualClipData.bass1.notes.length
          },
          bass2: {
            metadata: dualClipData.bass2.metadata,
            noteCount: dualClipData.bass2.notes.length
          }
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create clips in Ableton',
        details: result.error
      });
    }

  } catch (error) {
    console.error('Error in /generate:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
