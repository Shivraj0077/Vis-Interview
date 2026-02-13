const vosk = require('vosk');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Set log level for Vosk
vosk.setLogLevel(-1);

const MODEL_PATH = path.join(__dirname, '../vosk_models/vosk-model-small-en-us-0.15');

let model;

const initModel = () => {
    if (!model) {
        if (!fs.existsSync(MODEL_PATH)) {
            throw new Error(`Vosk model not found at ${MODEL_PATH}`);
        }
        model = new vosk.Model(MODEL_PATH);
    }
    return model;
};

/**
 * Transcribes an audio file using Vosk.
 * Converts input file to 16kHz mono PCM using FFmpeg.
 * @param {string} filePath Path to the audio file (e.g., .webm)
 * @returns {Promise<string>} Transcribed text
 */
const transcribeAudioVosk = async (filePath) => {
    return new Promise((resolve, reject) => {
        const currentModel = initModel();

        // Output temporary wav file
        const outputWav = `${filePath}.wav`;

        ffmpeg(filePath)
            .outputOptions([
                '-ar 16000',
                '-ac 1',
                '-f wav'
            ])
            .on('error', (err) => {
                console.error('FFmpeg Error:', err);
                reject(err);
            })
            .on('end', () => {
                try {
                    const wf = fs.readFileSync(outputWav);
                    const recognizer = new vosk.Recognizer({ model: currentModel, sampleRate: 16000 });

                    recognizer.acceptWaveform(wf);
                    const result = recognizer.finalResult();

                    // Clean up temp file
                    if (fs.existsSync(outputWav)) fs.unlinkSync(outputWav);

                    recognizer.free();
                    resolve(result.text || "");
                } catch (err) {
                    reject(err);
                }
            })
            .save(outputWav);
    });
};

module.exports = { transcribeAudioVosk };
