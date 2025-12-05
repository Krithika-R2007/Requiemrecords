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
                
                // Check if recognition already exists and is active
                if (this.recognition) {
                    console.log('Stopping existing recognition before starting new one');
                    try {
                        this.recognition.stop();
                    } catch (e) {
                        console.warn('Error stopping existing recognition:', e);
                    }
                }
                
                this.recognition = new SpeechRecognition();
                
                // Configure recognition - IMPORTANT: Don't request microphone separately
                // The recording service already has microphone access
                this.recognition.continuous = true;
                this.recognition.interimResults = true; // Changed to true for better real-time capture
                this.recognition.lang = 'en-US';
                this.recognition.maxAlternatives = 3; // Increased for better accuracy

                // Reset transcript
                this.finalTranscript = '';

                // Store resolve/reject for later use
                this.transcriptionResolve = resolve;
                this.transcriptionReject = reject;

                // Handle results
                this.recognition.onresult = (event) => {
                    console.log('Speech recognition result received');
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const result = event.results[i];
                        const transcript = result[0].transcript;
                        
                        if (result.isFinal) {
                            console.log('Final transcript:', transcript);
                            this.finalTranscript += transcript + ' ';
                        } else {
                            // Log interim results for debugging
                            console.log('Interim transcript:', transcript);
                        }
                    }
                };

                // Handle end
                this.recognition.onend = () => {
                    const transcript = this.finalTranscript.trim();
                    console.log('Speech recognition ended. Final transcript:', transcript);
                    
                    if (this.transcriptionResolve) {
                        // If no transcript, provide a more helpful message
                        if (!transcript) {
                            console.warn('No speech was detected during recording');
                            this.transcriptionResolve('[No speech detected - try speaking louder or closer to microphone]');
                        } else {
                            this.transcriptionResolve(transcript);
                        }
                        this.transcriptionResolve = null;
                        this.transcriptionReject = null;
                    }
                };

                // Handle errors
                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    console.error('Error details:', event);
                    
                    // Different error types
                    let errorMessage = '[Transcription failed]';
                    switch (event.error) {
                        case 'no-speech':
                            errorMessage = '[No speech detected - please speak louder]';
                            console.warn('No speech detected - user may need to speak louder or closer to mic');
                            break;
                        case 'audio-capture':
                            errorMessage = '[Microphone error during transcription]';
                            console.error('Audio capture failed - microphone may be in use');
                            break;
                        case 'not-allowed':
                            errorMessage = '[Microphone permission denied for transcription]';
                            console.error('Permission denied - user needs to allow microphone access');
                            break;
                        case 'network':
                            errorMessage = '[Network error - transcription requires internet]';
                            console.error('Network error - check internet connection');
                            break;
                        case 'aborted':
                            errorMessage = '[Transcription stopped early]';
                            console.warn('Transcription was aborted');
                            break;
                        case 'service-not-allowed':
                            errorMessage = '[Speech service not available]';
                            console.error('Speech recognition service not allowed');
                            break;
                        default:
                            errorMessage = `[Transcription error: ${event.error}]`;
                            console.error('Unknown transcription error:', event.error);
                    }
                    
                    // Resolve with error message instead of rejecting
                    // This allows the app to continue with a fallback message
                    if (this.transcriptionResolve) {
                        this.transcriptionResolve(errorMessage);
                        this.transcriptionResolve = null;
                        this.transcriptionReject = null;
                    }
                };
                
                // Handle start event
                this.recognition.onstart = () => {
                    console.log('✓ Speech recognition started successfully');
                };
                
                // Handle audio start event
                this.recognition.onaudiostart = () => {
                    console.log('✓ Speech recognition audio capture started');
                };
                
                // Handle sound start event
                this.recognition.onsoundstart = () => {
                    console.log('✓ Speech recognition detected sound');
                };
                
                // Handle speech start event
                this.recognition.onspeechstart = () => {
                    console.log('✓ Speech recognition detected speech');
                };

                // Start recognition
                console.log('Starting speech recognition...');
                this.recognition.start();
                console.log('Speech recognition start() called');
                
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
