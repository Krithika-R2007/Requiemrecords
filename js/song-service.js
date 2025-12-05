/**
 * SongGenerationService - Transforms text into scary songs
 */
class SongGenerationService {
    constructor() {
        this.apiEndpoint = null; // Will be configured for free API
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * Generate scary lyrics from transcribed text
     * @param {string} text - Original transcribed text
     * @returns {Promise<string>} Scary song lyrics
     */
    async generateScaryLyrics(text) {
        if (!text || text.trim().length === 0) {
            return 'In the darkness, silence screams...';
        }

        try {
            // Transform text into scary lyrics
            // This is a simple transformation - can be enhanced with AI API
            const words = text.toLowerCase().split(' ');
            const scaryWords = ['darkness', 'shadow', 'whisper', 'haunted', 'forgotten', 'eternal', 'void', 'nightmare'];
            
            let lyrics = '';
            words.forEach((word, index) => {
                if (index % 5 === 0 && scaryWords.length > 0) {
                    const scaryWord = scaryWords[Math.floor(Math.random() * scaryWords.length)];
                    lyrics += scaryWord + ' ';
                }
                lyrics += word + ' ';
            });

            lyrics += '\n...forever in the vinyl...';
            
            return lyrics.trim();
        } catch (error) {
            console.error('Error generating lyrics:', error);
            throw new Error('Failed to generate scary lyrics: ' + error.message);
        }
    }

    /**
     * Analyze text to determine horror music characteristics
     * @param {string} text - Input text to analyze
     * @returns {Object} Music parameters based on text
     */
    analyzeTextForMusic(text) {
        const words = text.toLowerCase().split(/\s+/);
        const wordCount = words.length;
        
        // Detect emotional keywords
        const sadWords = ['sad', 'cry', 'tears', 'lonely', 'empty', 'lost', 'miss', 'hurt', 'pain', 'sorrow'];
        const darkWords = ['dark', 'death', 'dead', 'kill', 'blood', 'fear', 'nightmare', 'horror', 'evil', 'demon'];
        const calmWords = ['sleep', 'quiet', 'still', 'silent', 'peace', 'rest', 'calm', 'soft'];
        const chaosWords = ['chaos', 'crazy', 'mad', 'insane', 'scream', 'rage', 'anger', 'hate', 'destroy'];
        
        let sadness = 0, darkness = 0, calmness = 0, chaos = 0;
        
        words.forEach(word => {
            if (sadWords.some(sw => word.includes(sw))) sadness++;
            if (darkWords.some(dw => word.includes(dw))) darkness++;
            if (calmWords.some(cw => word.includes(cw))) calmness++;
            if (chaosWords.some(chw => word.includes(chw))) chaos++;
        });
        
        // Calculate music parameters
        const tempo = Math.max(0.8, Math.min(2.0, 1.0 + (chaos - calmness) * 0.1)); // Speed
        const dissonance = Math.min(1.0, (darkness + chaos) * 0.15); // How dissonant/scary
        const melancholy = Math.min(1.0, sadness * 0.2); // How sad/slow
        const intensity = Math.min(1.0, (wordCount / 20) * 0.5 + darkness * 0.1); // Overall intensity
        
        return { tempo, dissonance, melancholy, intensity };
    }

    /**
     * Generate song audio from lyrics using Web Audio API
     * Creates a horror-themed musical composition that responds to text content
     * @param {string} lyrics - Scary song lyrics
     * @returns {Promise<string>} Base64 audio data
     */
    async generateSongAudio(lyrics) {
        try {
            console.log('Generating horror-themed musical composition...');
            
            // Analyze text to customize music
            const musicParams = this.analyzeTextForMusic(lyrics);
            console.log('Music parameters:', musicParams);
            
            // Use Web Audio API to create a musical scary composition
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const duration = 15; // 15 seconds of scary music
            const sampleRate = audioContext.sampleRate;
            const numSamples = duration * sampleRate;
            
            // Create audio buffer with 2 channels (stereo)
            const audioBuffer = audioContext.createBuffer(2, numSamples, sampleRate);
            const leftChannel = audioBuffer.getChannelData(0);
            const rightChannel = audioBuffer.getChannelData(1);
            
            // Horror scales - different moods
            const minorScale = [110.00, 123.47, 130.81, 146.83, 164.81, 174.61, 196.00, 220.00]; // A minor
            const diminishedScale = [110.00, 116.54, 130.81, 138.59, 155.56, 164.81, 185.00, 196.00]; // Diminished
            const phrygianScale = [110.00, 116.54, 130.81, 146.83, 164.81, 174.61, 195.00, 220.00]; // Phrygian (very dark)
            
            // Choose scale based on darkness level
            let scale = minorScale;
            if (musicParams.dissonance > 0.6) {
                scale = diminishedScale;
            } else if (musicParams.melancholy > 0.5) {
                scale = phrygianScale;
            }
            
            // Generate horror musical composition
            for (let i = 0; i < numSamples; i++) {
                const t = i / sampleRate;
                const adjustedT = t * musicParams.tempo; // Apply tempo
                
                // Deep bass drone (creates dark atmosphere)
                const bassFreq = 55 * (1 - musicParams.melancholy * 0.2); // Lower when sad
                const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.25;
                const subBass = Math.sin(2 * Math.PI * (bassFreq / 2) * t) * 0.15;
                
                // Main melody (changes based on text length and mood)
                const noteDuration = 1.5 / musicParams.tempo;
                const noteIndex = Math.floor(adjustedT / noteDuration) % scale.length;
                const melodyFreq = scale[noteIndex];
                
                // Add vibrato for eeriness
                const vibrato = 1 + 0.02 * Math.sin(2 * Math.PI * 5 * t);
                const melody = Math.sin(2 * Math.PI * melodyFreq * vibrato * t) * 0.18;
                
                // Harmony (creates tension)
                const harmonyOffset = musicParams.dissonance > 0.5 ? 1 : 4; // Dissonant or consonant
                const harmonyFreq = scale[(noteIndex + harmonyOffset) % scale.length];
                const harmony = Math.sin(2 * Math.PI * harmonyFreq * t) * 0.12;
                
                // High frequency whispers (ghostly effect)
                const whisperFreq = scale[(noteIndex + 7) % scale.length] * 4;
                const whisper = Math.sin(2 * Math.PI * whisperFreq * t) * 0.08 * musicParams.intensity;
                
                // Tremolo effect (creates unease and pulsing)
                const tremoloSpeed = 6 + musicParams.chaos * 4;
                const tremolo = 0.6 + 0.4 * Math.sin(2 * Math.PI * tremoloSpeed * t);
                
                // Dark ambient noise (more when chaotic)
                const noiseAmount = 0.03 + musicParams.intensity * 0.05;
                const noise = (Math.random() * 2 - 1) * noiseAmount;
                
                // Low frequency rumble (adds tension)
                const rumble = Math.sin(2 * Math.PI * 30 * t + Math.sin(2 * Math.PI * 0.5 * t)) * 0.1;
                
                // Master envelope (fade in and out)
                const fadeInTime = 2;
                const fadeOutTime = 3;
                const fadeIn = Math.min(1, t / fadeInTime);
                const fadeOut = Math.min(1, (duration - t) / fadeOutTime);
                const envelope = fadeIn * fadeOut;
                
                // Stereo panning effect (sound moves between ears)
                const pan = Math.sin(2 * Math.PI * 0.2 * t); // Slow pan
                const leftPan = (1 - pan) / 2;
                const rightPan = (1 + pan) / 2;
                
                // Combine all elements with stereo separation
                const monoSignal = (bass + subBass + melody * tremolo + harmony + whisper + noise + rumble) * envelope;
                
                leftChannel[i] = Math.max(-1, Math.min(1, monoSignal * (0.7 + leftPan * 0.3)));
                rightChannel[i] = Math.max(-1, Math.min(1, monoSignal * (0.7 + rightPan * 0.3)));
            }
            
            console.log('Horror composition generated, converting to WAV...');
            
            // Convert to WAV blob
            const wavBlob = await this.audioBufferToWav(audioBuffer);
            const base64 = await blobToBase64(wavBlob);
            
            console.log('Song audio generation complete');
            return base64;
        } catch (error) {
            console.error('Error generating song audio:', error);
            // Return null if generation fails - entry will still be saved
            return null;
        }
    }
    
    /**
     * Convert AudioBuffer to WAV Blob (supports stereo)
     * @param {AudioBuffer} audioBuffer - Audio buffer to convert
     * @returns {Promise<Blob>} WAV blob
     */
    async audioBufferToWav(audioBuffer) {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;
        
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;
        
        const length = audioBuffer.length;
        const dataLength = length * numChannels * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataLength);
        const view = new DataView(buffer);
        
        // Write WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        writeString(36, 'data');
        view.setUint32(40, dataLength, true);
        
        // Write audio data (interleaved for stereo)
        let offset = 44;
        for (let i = 0; i < length; i++) {
            for (let channel = 0; channel < numChannels; channel++) {
                const channelData = audioBuffer.getChannelData(channel);
                const sample = Math.max(-1, Math.min(1, channelData[i]));
                view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
                offset += 2;
            }
        }
        
        return new Blob([buffer], { type: 'audio/wav' });
    }



    /**
     * Generate complete scary song (lyrics + audio)
     * @param {string} transcription - Original transcription
     * @returns {Promise<Object>} Object with lyrics and audioData
     */
    async generateCompleteSong(transcription) {
        try {
            console.log('Generating scary song from:', transcription);
            
            const lyrics = await this.generateScaryLyrics(transcription);
            console.log('Generated lyrics:', lyrics);
            
            let audioData = null;
            try {
                audioData = await this.generateSongAudio(lyrics);
                console.log('Generated audio data:', audioData ? 'Success' : 'Failed');
            } catch (audioError) {
                // Log audio generation error but don't fail the whole operation
                console.error('Audio generation failed, continuing with lyrics only:', audioError);
            }

            return {
                lyrics,
                audioData
            };
        } catch (error) {
            console.error('Error generating complete song:', error);
            // Return default values instead of throwing
            return {
                lyrics: 'In darkness eternal, your voice echoes... forever lost in the void...',
                audioData: null
            };
        }
    }

    /**
     * Delay helper for retry logic
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     * @private
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
