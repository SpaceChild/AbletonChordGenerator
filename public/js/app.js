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
                showStatus(
                    `✅ Success! Created ${result.data.noteCount} notes in Ableton on track ${params.targetTrack}. ` +
                    `Progression: ${result.data.metadata.chordNames}`,
                    'success'
                );
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
