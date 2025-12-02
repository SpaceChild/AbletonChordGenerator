// API Client for Chord Generator

const API_BASE = '/api';

const api = {
    /**
     * Generates chords and sends to Ableton
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} Result
     */
    async generateChords(params) {
        const response = await fetch(`${API_BASE}/chords/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.details?.join(', ') || 'Generation failed');
        }

        return response.json();
    },

    /**
     * Previews chord generation without sending to Ableton
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} Preview data
     */
    async previewChords(params) {
        const response = await fetch(`${API_BASE}/chords/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.details?.join(', ') || 'Preview failed');
        }

        return response.json();
    },

    /**
     * Health check for server
     * @returns {Promise<Object>} Health status
     */
    async healthCheck() {
        const response = await fetch(`${API_BASE}/health`);
        return response.json();
    }
};
