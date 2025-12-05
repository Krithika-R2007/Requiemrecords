/**
 * MediaManager - Handles all video and audio playback
 */
class MediaManager {
    constructor() {
        this.introVideo = document.getElementById('intro-video');
        this.loopVideo = document.getElementById('loop-video');
        this.backgroundAudio = document.getElementById('background-audio');
        this.scaryAudio = null;
        this.backgroundMediaStarted = false;
        
        // Track created object URLs for cleanup
        this.objectURLs = new Set();
        
        // Ensure looping is set on media elements
        this.ensureLooping(this.loopVideo);
        this.ensureLooping(this.backgroundAudio);
        
        // Lazy load background media
        this.lazyLoadBackgroundMedia();
    }
    
    /**
     * Lazy load background media to improve initial page load
     */
    lazyLoadBackgroundMedia() {
        // Preload hint for background media
        if (this.loopVideo && !this.loopVideo.hasAttribute('preload')) {
            this.loopVideo.setAttribute('preload', 'none');
        }
        if (this.backgroundAudio && !this.backgroundAudio.hasAttribute('preload')) {
            this.backgroundAudio.setAttribute('preload', 'none');
        }
    }

    /**
     * Play intro video with completion callback
     * @param {Function} onComplete - Callback when video ends
     */
    playIntroVideo(onComplete) {
        if (!this.introVideo) {
            console.error('Intro video element not found');
            setTimeout(onComplete, 1000);
            return;
        }
        
        // Set up ended event handler
        const handleEnded = () => {
            console.log('Intro video ended');
            onComplete();
        };
        
        this.introVideo.addEventListener('ended', handleEnded, { once: true });
        
        // Attempt to play the video
        const playPromise = this.introVideo.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Intro video playing successfully');
                })
                .catch(error => {
                    console.error('Error playing intro video:', error);
                    // Fallback: skip to main after short delay
                    setTimeout(onComplete, 2000);
                });
        }
        
        // Timeout fallback for video load failures (30 seconds)
        const timeoutId = setTimeout(() => {
            if (!this.introVideo.ended && this.introVideo.readyState < 2) {
                console.warn('Intro video timeout or load failure, skipping to main');
                this.introVideo.removeEventListener('ended', handleEnded);
                onComplete();
            }
        }, 30000);
        
        // Clear timeout if video ends normally
        this.introVideo.addEventListener('ended', () => {
            clearTimeout(timeoutId);
        }, { once: true });
    }

    /**
     * Start background loop video
     */
    startBackgroundLoop() {
        try {
            if (!this.loopVideo) {
                console.error('Loop video element not found');
                throw new Error('Background video element not found');
            }
            
            // Check if video source is loaded
            if (!this.loopVideo.src && !this.loopVideo.currentSrc) {
                console.error('Loop video has no source');
                throw new Error('Background video source not loaded');
            }
            
            // Ensure looping is enabled
            this.ensureLooping(this.loopVideo);
            
            const playPromise = this.loopVideo.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Background loop video playing');
                        this.backgroundMediaStarted = true;
                    })
                    .catch(error => {
                        console.warn('Autoplay blocked for loop video - will retry on user interaction:', error.name, error.message);
                        // Don't throw - graceful degradation for autoplay restrictions
                    });
            }
        } catch (error) {
            console.error('Error starting background loop:', error);
            // Don't throw - allow app to continue without background video
        }
    }

    /**
     * Stop background loop video
     */
    stopBackgroundLoop() {
        if (this.loopVideo) {
            this.loopVideo.pause();
        }
    }

    /**
     * Play background music
     */
    playBackgroundMusic() {
        try {
            if (!this.backgroundAudio) {
                console.error('Background audio element not found');
                throw new Error('Background audio element not found');
            }
            
            // Check if audio source is loaded
            if (!this.backgroundAudio.src && !this.backgroundAudio.currentSrc) {
                console.error('Background audio has no source');
                throw new Error('Background audio source not loaded');
            }
            
            // Set volume to 50%
            this.backgroundAudio.volume = 0.5;
            
            // Ensure looping is enabled
            this.ensureLooping(this.backgroundAudio);
            
            const playPromise = this.backgroundAudio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Background music playing');
                        this.backgroundMediaStarted = true;
                    })
                    .catch(error => {
                        console.warn('Autoplay blocked for background audio - will retry on user interaction:', error.name, error.message);
                        // Don't throw - graceful degradation for autoplay restrictions
                    });
            }
        } catch (error) {
            console.error('Error playing background music:', error);
            // Don't throw - allow app to continue without background music
        }
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.backgroundAudio) {
            this.backgroundAudio.pause();
        }
    }

    /**
     * Ensure background media is playing (call on user interaction)
     * This handles autoplay restrictions by retrying playback on user interaction
     */
    ensureBackgroundMediaPlaying() {
        try {
            // Try to start background media if not already started
            if (!this.backgroundMediaStarted) {
                if (this.loopVideo && this.loopVideo.paused) {
                    this.loopVideo.play().catch(error => {
                        console.error('Error playing loop video on user interaction:', error.name, error.message);
                        // Graceful degradation - continue without video
                    });
                }
                
                if (this.backgroundAudio && this.backgroundAudio.paused) {
                    this.backgroundAudio.play().catch(error => {
                        console.error('Error playing background audio on user interaction:', error.name, error.message);
                        // Graceful degradation - continue without audio
                    });
                }
                
                this.backgroundMediaStarted = true;
            }
        } catch (error) {
            console.error('Error ensuring background media playing:', error);
            // Don't throw - graceful degradation
        }
    }

    /**
     * Play scary music for vinyl spinning
     * Note: This could be enhanced with additional scary audio files
     * For now, we maintain the background music for consistency
     */
    playScaryMusic() {
        // The background music (bg1.mp3) already provides the scary atmosphere
        // If additional scary music files are added to assets, they can be played here
        
        // Ensure background music is playing
        if (this.backgroundAudio && this.backgroundAudio.paused) {
            this.backgroundAudio.play().catch(error => {
                console.error('Error playing scary music:', error);
            });
        }
        
        // Optional: Could lower volume of background music and add additional layer
        // if (this.backgroundAudio) {
        //     this.backgroundAudio.volume = 0.7;
        // }
    }

    /**
     * Ensure media element is looping
     * @param {HTMLMediaElement} mediaElement - Media element to loop
     */
    ensureLooping(mediaElement) {
        if (mediaElement) {
            mediaElement.loop = true;
        }
    }

    /**
     * Create audio element from blob
     * @param {Blob} audioBlob - Audio blob
     * @returns {HTMLAudioElement} Audio element
     */
    createAudioElement(audioBlob) {
        const url = URL.createObjectURL(audioBlob);
        this.objectURLs.add(url);
        const audio = new Audio(url);
        
        // Clean up URL when audio is no longer needed
        audio.addEventListener('ended', () => {
            this.revokeObjectURL(url);
        }, { once: true });
        
        return audio;
    }
    
    /**
     * Revoke an object URL
     * @param {string} url - Object URL to revoke
     */
    revokeObjectURL(url) {
        if (this.objectURLs.has(url)) {
            try {
                URL.revokeObjectURL(url);
                this.objectURLs.delete(url);
            } catch (e) {
                console.warn('Failed to revoke object URL:', e);
            }
        }
    }
    
    /**
     * Clean up all object URLs
     */
    cleanup() {
        this.objectURLs.forEach(url => {
            try {
                URL.revokeObjectURL(url);
            } catch (e) {
                console.warn('Failed to revoke URL during cleanup:', e);
            }
        });
        this.objectURLs.clear();
    }
}
