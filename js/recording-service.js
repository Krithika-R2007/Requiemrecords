/**
 * RecordingService - Manages microphone access and audio recording
 */
class RecordingService {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.startTime = null;
    }

    /**
     * Request microphone access
     * @returns {Promise<boolean>} Success status
     */
    async requestMicrophoneAccess() {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error('getUserMedia is not supported in this browser');
                throw new Error('Microphone access not supported in this browser');
            }
            
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Microphone access granted');
            return true;
        } catch (error) {
            console.error('Microphone access error:', error);
            
            // Provide specific error messages based on error type
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                throw new Error('The spirits cannot hear you. Microphone permission denied.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                throw new Error('No microphone found in this realm.');
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                throw new Error('Microphone is already in use by another entity.');
            } else if (error.name === 'OverconstrainedError') {
                throw new Error('Microphone constraints cannot be satisfied.');
            } else if (error.name === 'SecurityError') {
                throw new Error('Microphone access blocked by security settings.');
            } else {
                throw new Error('Failed to access microphone: ' + error.message);
            }
        }
    }

    /**
     * Start recording audio
     * @returns {Promise<void>}
     */
    async startRecording() {
        try {
            if (!this.stream) {
                await this.requestMicrophoneAccess();
            }

            // Check if MediaRecorder is supported
            if (typeof MediaRecorder === 'undefined') {
                throw new Error('Audio recording not supported in this browser');
            }

            this.audioChunks = [];
            
            // Try to create MediaRecorder with error handling
            try {
                this.mediaRecorder = new MediaRecorder(this.stream);
            } catch (recorderError) {
                console.error('Failed to create MediaRecorder:', recorderError);
                throw new Error('Failed to initialize audio recorder: ' + recorderError.message);
            }
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
            };

            this.startTime = Date.now();
            
            try {
                this.mediaRecorder.start();
                console.log('Recording started successfully');
            } catch (startError) {
                console.error('Failed to start recording:', startError);
                throw new Error('Failed to start recording: ' + startError.message);
            }
        } catch (error) {
            console.error('Error in startRecording:', error);
            // Clean up on error
            this.cleanup();
            throw error;
        }
    }

    /**
     * Stop recording audio
     * @returns {Promise<Object>} Object with audioBlob and duration
     */
    stopRecording() {
        return new Promise((resolve, reject) => {
            try {
                if (!this.mediaRecorder) {
                    console.error('No MediaRecorder instance exists');
                    reject(new Error('No recording to stop'));
                    return;
                }
                
                if (this.mediaRecorder.state === 'inactive') {
                    console.error('MediaRecorder is already inactive');
                    reject(new Error('Recording is not active'));
                    return;
                }

                // Set up stop handler
                this.mediaRecorder.onstop = () => {
                    try {
                        if (this.audioChunks.length === 0) {
                            console.error('No audio data recorded');
                            reject(new Error('No audio data captured'));
                            return;
                        }
                        
                        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                        const duration = (Date.now() - this.startTime) / 1000;
                        
                        console.log(`Recording stopped. Duration: ${duration}s, Size: ${audioBlob.size} bytes`);
                        resolve({ audioBlob, duration });
                    } catch (blobError) {
                        console.error('Error creating audio blob:', blobError);
                        reject(new Error('Failed to process recorded audio'));
                    }
                };

                // Set up error handler
                this.mediaRecorder.onerror = (event) => {
                    console.error('MediaRecorder error during stop:', event.error);
                    reject(new Error('Recording error: ' + event.error));
                };

                // Attempt to stop
                try {
                    this.mediaRecorder.stop();
                } catch (stopError) {
                    console.error('Error calling stop():', stopError);
                    reject(new Error('Failed to stop recording: ' + stopError.message));
                }
            } catch (error) {
                console.error('Unexpected error in stopRecording:', error);
                reject(error);
            }
        });
    }

    /**
     * Get audio blob from recording
     * @returns {Blob|null} Audio blob
     */
    getAudioBlob() {
        if (this.audioChunks.length === 0) return null;
        return new Blob(this.audioChunks, { type: 'audio/webm' });
    }

    /**
     * Get recording duration in seconds
     * @returns {number} Duration in seconds
     */
    getAudioDuration() {
        if (!this.startTime) return 0;
        return (Date.now() - this.startTime) / 1000;
    }

    /**
     * Check if currently recording
     * @returns {boolean} Recording status
     */
    isRecording() {
        return this.mediaRecorder && this.mediaRecorder.state === 'recording';
    }

    /**
     * Clean up resources
     */
    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        this.mediaRecorder = null;
        this.audioChunks = [];
    }
}
