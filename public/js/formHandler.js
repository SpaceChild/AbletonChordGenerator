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
        bpm: parseInt(formData.get('bpm')),
        rhythm: formData.get('rhythm'),
        voiceLeading: document.getElementById('voiceLeading').checked,
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
 * Shows preview data
 * @param {Object} data - Preview data from API
 */
function showPreview(data) {
    const previewBox = document.getElementById('previewBox');
    const previewContent = previewBox.querySelector('.preview-content');

    const { metadata, notes } = data.data;

    let html = `
        <p><strong>Key:</strong> ${metadata.key} ${metadata.scale}</p>
        <p><strong>Mood:</strong> ${metadata.mood}</p>
        <p><strong>Progression:</strong> ${metadata.chordNames}</p>
        <p><strong>Total Notes:</strong> ${notes.length}</p>
        <p><strong>Duration:</strong> ${metadata.bars} bars @ ${metadata.bpm} BPM</p>
    `;

    previewContent.innerHTML = html;
    previewBox.classList.remove('hidden');
}

/**
 * Sets loading state for buttons
 * @param {boolean} isLoading - Whether loading or not
 */
function setLoading(isLoading) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const previewBtn = document.getElementById('previewBtn');

    if (isLoading) {
        submitBtn.disabled = true;
        previewBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = '⏳ Generating...';
    } else {
        submitBtn.disabled = false;
        previewBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = '🎵 Generate in Ableton';
    }
}

/**
 * Updates the BPM display value
 * @param {number} value - BPM value
 */
function updateBPMDisplay(value) {
    const bpmDisplay = document.getElementById('bpmDisplay');
    if (bpmDisplay) {
        bpmDisplay.textContent = value;
    }
}
