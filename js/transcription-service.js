/**
 * TranscriptionService - Converts audio to text using Web Speech API
 */
class TranscriptionService {
    constructor() {
        this.recognition = null;
        this.isSupported = this.checkSupport();
        this.finalTranscript = '';
        this.transcriptionResolve = null;
        this.transcriptionReject = null;
    }

    /**
     * Check if Web Speech API is supported
     * @returns {boolean} Support status
     */
    checkSupport() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    /**
     * Transcribe audio blob to text
     * Note: Web Speech API doesn't directly accept audio blobs.
     * This method uses live transcription during recording instead.
     * For blob-based transcription, a server-side solution would be needed.
     * 
     * @param {Blob} audioBlob - Audio blob to transcribe
     * @returns {Promise<string>} Transcribed text
     */
    async transcribeAudio(audioBlob) {
        if (!this.isSupported) {
            console.warn('Speech recognition not supported in this browser');
            return '[Transcription not available - browser not supported]';
        }

        // Web Speech API limitation: cannot transcribe pre-recorded audio blobs
        // In a production app, this would call a server-side API
        console.warn('Web Speech API cannot transcribe audio blobs directly');
        return '[Transcription requires live audio - use startLiveTranscription during recording]';
    }

    /**
     * Start live transcription (for real-time recording)
     * This should be called when recording starts
     * @returns {Promise<string>} Promise that resolves with transcribed text when stopped
     */
    startLiveTranscription() {
        if (!this.isSupported) {
            console.warn('Speech recognition not supported in this browser');
            return Promise.resolve('[Transcription not available - browser not supported]');
        }

        return new Promise((resolve, reject) => {
            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                
                // Configure recognition
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';
                this.recognition.maxAlternatives = 1;

                // Reset transcript
                this.finalTranscript = '';

                // Store resolve/reject for later use
                this.transcriptionResolve = resolve;
                this.transcriptionReject = reject;

                // Handle results
                this.recognition.onresult = (event) => {
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            this.finalTranscript += event.results[i][0].transcript + ' ';
                        }
                    }
                };

                // Handle end
                this.recognition.onend = () => {
                    const transcript = this.finalTranscript.trim();
                    if (this.transcriptionResolve) {
                        this.transcriptionResolve(transcript || '[No speech detected]');
                        this.transcriptionResolve = null;
                        this.transcriptionReject = null;
                    }
                };

                // Handle errors
                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    
                    // Different error types
                    let errorMessage = '[Transcription failed]';
                    switch (event.error) {
                        case 'no-speech':
                            errorMessage = '[No speech detected]';
                            break;
                        case 'audio-capture':
                            errorMessage = '[Microphone error during transcription]';
                            break;
                        case 'not-allowed':
                            errorMessage = '[Microphone permission denied for transcription]';
                            break;
                        case 'network':
                            errorMessage = '[Network error during transcription]';
                            break;
                        case 'aborted':
                            errorMessage = '[Transcription aborted]';
                            break;
                    }
                    
                    // Resolve with error message instead of rejecting
                    // This allows the app to continue with a fallback message
                    if (this.transcriptionResolve) {
                        this.transcriptionResolve(errorMessage);
                        this.transcriptionResolve = null;
                        this.transcriptionReject = null;
                    }
                };

                // Start recognition
                this.recognition.start();
                console.log('Live transcription started');
                
            } catch (error) {
                console.error('Error starting transcription:', error);
                reject(error);
            }
        });
    }

    /**
     * Stop live transcription and return the final transcript
     * This should be called when recording stops
     */
    stopLiveTranscription() {
        if (this.recognition) {
            try {
                this.recognition.stop();
                console.log('Live transcription stopped');
            } catch (error) {
                console.error('Error stopping transcription:', error);
                // If stop fails, still resolve with current transcript
                if (this.transcriptionResolve) {
                    const transcript = this.finalTranscript.trim();
                    this.transcriptionResolve(transcript || '[No speech detected]');
                    this.transcriptionResolve = null;
                    this.transcriptionReject = null;
                }
            }
        } else {
            // No recognition instance - resolve immediately if there's a pending promise
            if (this.transcriptionResolve) {
                console.warn('stopLiveTranscription called but no recognition instance exists');
                this.transcriptionResolve('[Transcription not available]');
                this.transcriptionResolve = null;
                this.transcriptionReject = null;
            }
        }
    }

    /**
     * Check if transcription is currently active
     * @returns {boolean} True if transcription is active
     */
    isTranscribing() {
        return this.recognition !== null && this.transcriptionResolve !== null;
    }
}
