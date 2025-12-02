const { spawn } = require('child_process');
const path = require('path');

/**
 * Sends chord data to Ableton via Python OSC script
 * @param {Object} data - Data to send to Ableton
 * @returns {Promise<Object>} Result from Python script
 */
function sendToAbleton(data) {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON_PATH || 'python3';
    const scriptPath = path.join(__dirname, '../../python/osc_sender.py');

    // Use the virtual environment's Python if available
    const venvPythonPath = path.join(__dirname, '../../python/venv/bin/python');
    const fs = require('fs');
    const actualPythonPath = fs.existsSync(venvPythonPath) ? venvPythonPath : pythonPath;

    console.log(`Spawning Python process: ${actualPythonPath} ${scriptPath}`);

    const pythonProcess = spawn(actualPythonPath, [scriptPath]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      const msg = data.toString();
      stderr += msg;
      console.log('[Python stderr]:', msg);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);

      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (error) {
          reject(new Error(`Invalid JSON from Python script: ${stdout}`));
        }
      } else {
        reject(new Error(`Python script exited with code ${code}. stderr: ${stderr}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to spawn Python process: ${error.message}`));
    });

    // Send data to Python via stdin
    const jsonData = JSON.stringify(data);
    console.log(`Sending to Python: ${jsonData.substring(0, 200)}...`);
    pythonProcess.stdin.write(jsonData);
    pythonProcess.stdin.end();
  });
}

module.exports = {
  sendToAbleton
};
