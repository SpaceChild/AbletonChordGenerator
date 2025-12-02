// Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chordForm');
    const addBassCheckbox = document.getElementById('addBass');
    const bassOctaveGroup = document.getElementById('bassOctaveGroup');

    // Initialize
    console.log('🎹 Ableton Chord Generator initialized');

    // Load saved settings from localStorage
    loadSettings();

    // Bass checkbox toggle
    addBassCheckbox.addEventListener('change', (e) => {
        bassOctaveGroup.style.display = e.target.checked ? 'block' : 'none';
        saveSettings();
    });

    // Form submission handler (Generate in Ableton)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        setLoading(true);

        try {
            const params = getFormData();
            console.log('Generate params:', params);

            // Save settings before generating
            saveSettings();

            showStatus('⏳ Generating chords and sending to Ableton...', 'success');

            const result = await api.generateChords(params);
            console.log('Generate result:', result);

            if (result.success) {
                // Check if 6 clips were created (2 chord + 2 bass + 2 pad)
                if (result.data.clip1 && result.data.clip2 && result.data.bass1 && result.data.bass2 && result.data.pad1 && result.data.pad2) {
                    showStatus(
                        `✅ Success! Created 6 clips in Ableton:\n\n` +
                        `🎹 Chord Clips (Track ${params.targetTrack}):\n` +
                        `  Clip 1 (${result.data.clip1.metadata.key} ${result.data.clip1.metadata.scale}, ${result.data.clip1.metadata.mood}): ${result.data.clip1.noteCount} notes in slot ${params.targetSlot}\n` +
                        `  Clip 2 (${result.data.clip2.metadata.key} ${result.data.clip2.metadata.scale}, ${result.data.clip2.metadata.mood}): ${result.data.clip2.noteCount} notes in slot ${params.targetSlot + 1}\n\n` +
                        `🎸 Bass Clips (Track ${params.targetTrack + 1}):\n` +
                        `  Bass 1: ${result.data.bass1.noteCount} sustained notes in slot ${params.targetSlot}\n` +
                        `  Bass 2: ${result.data.bass2.noteCount} sustained notes in slot ${params.targetSlot + 1}\n\n` +
                        `☁️ Pad Clips (Track ${params.targetTrack + 2}):\n` +
                        `  Pad 1: ${result.data.pad1.noteCount} floating notes in slot ${params.targetSlot}\n` +
                        `  Pad 2: ${result.data.pad2.noteCount} floating notes in slot ${params.targetSlot + 1}`,
                        'success'
                    );
                }
                // Check if quad clips (4 clips) were created (backward compatibility)
                else if (result.data.clip1 && result.data.clip2 && result.data.bass1 && result.data.bass2) {
                    showStatus(
                        `✅ Success! Created 4 clips in Ableton:\n\n` +
                        `🎹 Chord Clips (Track ${params.targetTrack}):\n` +
                        `  Clip 1 (${result.data.clip1.metadata.key} ${result.data.clip1.metadata.scale}, ${result.data.clip1.metadata.mood}): ${result.data.clip1.noteCount} notes in slot ${params.targetSlot}\n` +
                        `  Clip 2 (${result.data.clip2.metadata.key} ${result.data.clip2.metadata.scale}, ${result.data.clip2.metadata.mood}): ${result.data.clip2.noteCount} notes in slot ${params.targetSlot + 1}\n\n` +
                        `🎸 Bass Clips (Track ${params.targetTrack + 1}):\n` +
                        `  Bass 1: ${result.data.bass1.noteCount} sustained notes in slot ${params.targetSlot}\n` +
                        `  Bass 2: ${result.data.bass2.noteCount} sustained notes in slot ${params.targetSlot + 1}`,
                        'success'
                    );
                }
                // Check if dual clips were created (backward compatibility)
                else if (result.data.clip1 && result.data.clip2) {
                    showStatus(
                        `✅ Success! Created 2 complementary clips in Ableton:\n` +
                        `Clip 1 (${result.data.clip1.metadata.key} ${result.data.clip1.metadata.scale}, ${result.data.clip1.metadata.mood}): ${result.data.clip1.noteCount} notes in slot ${params.targetSlot}\n` +
                        `Clip 2 (${result.data.clip2.metadata.key} ${result.data.clip2.metadata.scale}, ${result.data.clip2.metadata.mood}): ${result.data.clip2.noteCount} notes in slot ${params.targetSlot + 1}\n` +
                        `Track: ${params.targetTrack}`,
                        'success'
                    );
                } else {
                    // Backward compatibility for single clip
                    showStatus(
                        `✅ Success! Created ${result.data.noteCount} notes in Ableton on track ${params.targetTrack}. ` +
                        `Progression: ${result.data.metadata.chordNames}`,
                        'success'
                    );
                }
            } else {
                showStatus('❌ Failed to generate chords: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Generation error:', error);
            showStatus(
                '❌ Error: ' + error.message + ' - Make sure Ableton Live is running and AbletonOSC is active!',
                'error'
            );
        } finally {
            setLoading(false);
        }
    });

    // Health check on load
    api.healthCheck()
        .then(health => {
            console.log('✅ Server health check passed:', health);
        })
        .catch(error => {
            console.error('❌ Server connection failed:', error);
            showStatus('⚠️ Warning: Cannot connect to server. Make sure the server is running!', 'error');
        });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });

    // Save settings whenever any form field changes
    form.addEventListener('change', () => {
        saveSettings();
    });

    console.log('💡 Keyboard shortcuts: Ctrl/Cmd+Enter = Generate');
});
