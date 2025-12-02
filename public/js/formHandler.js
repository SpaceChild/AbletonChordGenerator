// Form Handler Utilities

/**
 * Gets all form data as an object
 * @returns {Object} Form data
 */
function getFormData() {
    const form = document.getElementById('chordForm');
    const formData = new FormData(form);

    return {
        key: formData.get('key'),
        scale: formData.get('scale'),
        mood: formData.get('mood'),
        bars: parseInt(formData.get('bars')),
        rhythm: formData.get('rhythm'),
        voiceLeading: document.getElementById('voiceLeading').checked,
        irregularChanges: document.getElementById('irregularChanges').checked,
        addBass: document.getElementById('addBass').checked,
        bassOctave: parseInt(formData.get('bassOctave')),
        targetTrack: parseInt(formData.get('targetTrack')),
        targetSlot: parseInt(formData.get('targetSlot'))
    };
}

/**
 * Shows a status message to the user
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showStatus(message, type = 'success') {
    const statusBox = document.getElementById('statusBox');
    const statusMessage = statusBox.querySelector('.status-message');

    statusBox.className = `status-box ${type}`;
    statusMessage.textContent = message;
    statusBox.classList.remove('hidden');

    // Auto-hide after 8 seconds
    setTimeout(() => {
        statusBox.classList.add('hidden');
    }, 8000);
}


/**
 * Sets loading state for buttons
 * @param {boolean} isLoading - Whether loading or not
 */
function setLoading(isLoading) {
    const submitBtn = document.querySelector('button[type="submit"]');

    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = '⏳ Generating...';
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = '🎵 Generate in Ableton';
    }
}

/**
 * Saves form settings to localStorage
 */
function saveSettings() {
    const settings = {
        key: document.getElementById('key').value,
        scale: document.getElementById('scale').value,
        mood: document.getElementById('mood').value,
        bars: document.getElementById('bars').value,
        rhythm: document.getElementById('rhythm').value,
        voiceLeading: document.getElementById('voiceLeading').checked,
        irregularChanges: document.getElementById('irregularChanges').checked,
        addBass: document.getElementById('addBass').checked,
        bassOctave: document.getElementById('bassOctave').value,
        targetTrack: document.getElementById('targetTrack').value,
        targetSlot: document.getElementById('targetSlot').value
    };

    localStorage.setItem('chordGeneratorSettings', JSON.stringify(settings));
    console.log('Settings saved to localStorage');
}

/**
 * Loads form settings from localStorage
 */
function loadSettings() {
    const savedSettings = localStorage.getItem('chordGeneratorSettings');

    if (!savedSettings) {
        console.log('No saved settings found');
        return;
    }

    try {
        const settings = JSON.parse(savedSettings);
        console.log('Loading saved settings:', settings);

        // Apply saved settings to form
        if (settings.key) document.getElementById('key').value = settings.key;
        if (settings.scale) document.getElementById('scale').value = settings.scale;
        if (settings.mood) document.getElementById('mood').value = settings.mood;
        if (settings.bars) document.getElementById('bars').value = settings.bars;
        if (settings.rhythm) document.getElementById('rhythm').value = settings.rhythm;
        if (settings.voiceLeading !== undefined) document.getElementById('voiceLeading').checked = settings.voiceLeading;
        if (settings.irregularChanges !== undefined) document.getElementById('irregularChanges').checked = settings.irregularChanges;
        if (settings.addBass !== undefined) {
            document.getElementById('addBass').checked = settings.addBass;
            document.getElementById('bassOctaveGroup').style.display = settings.addBass ? 'block' : 'none';
        }
        if (settings.bassOctave) document.getElementById('bassOctave').value = settings.bassOctave;
        if (settings.targetTrack !== undefined) document.getElementById('targetTrack').value = settings.targetTrack;
        if (settings.targetSlot !== undefined) document.getElementById('targetSlot').value = settings.targetSlot;

        console.log('Settings loaded successfully');
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}
