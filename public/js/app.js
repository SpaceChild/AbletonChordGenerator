// Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chordForm');
    const previewBtn = document.getElementById('previewBtn');
    const bpmInput = document.getElementById('bpm');

    // Initialize
    console.log('🎹 Ableton Chord Generator initialized');

    // BPM display update
    bpmInput.addEventListener('input', (e) => {
        updateBPMDisplay(e.target.value);
    });

    // Preview button handler
    previewBtn.addEventListener('click', async () => {
        console.log('Preview button clicked');
        setLoading(true);

        try {
            const params = getFormData();
            console.log('Preview params:', params);

            const result = await api.previewChords(params);
            console.log('Preview result:', result);

            if (result.success) {
                showPreview(result);
                showStatus('✅ Preview generated successfully!', 'success');
            } else {
                showStatus('❌ Preview failed: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Preview error:', error);
            showStatus('❌ Preview error: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    });

    // Form submission handler (Generate in Ableton)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        setLoading(true);

        try {
            const params = getFormData();
            console.log('Generate params:', params);

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

        // Ctrl/Cmd + P to preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            previewBtn.click();
        }
    });

    console.log('💡 Keyboard shortcuts: Ctrl/Cmd+Enter = Generate, Ctrl/Cmd+P = Preview');
});
