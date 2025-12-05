/**
 * AppController - Main application controller
 */
class AppController {
    constructor() {
        // Application states
        this.STATES = {
            INTRO: 'INTRO',
            MAIN: 'MAIN',
            RECORDING: 'RECORDING',
            LOG: 'LOG',
            VINYL_SPINNING: 'VINYL_SPINNING',
            STORY: 'STORY',
            SEANCE: 'SEANCE',
            SUMMONING: 'SUMMONING',
            GHOST_ENCOUNTER: 'GHOST_ENCOUNTER'
        };

        this.currentState = this.STATES.INTRO;
        this.isRecording = false;

        // Initialize services
        this.uiManager = new UIManager();
        this.mediaManager = new MediaManager();
        this.recordingService = new RecordingService();
        this.transcriptionService = new TranscriptionService();
        this.songService = new SongGenerationService();
        this.storyService = new StoryGenerationService();
        this.storageService = new StorageService();
        this.seanceService = new SeanceService();

        this.entries = [];
        
        // Audio player state management
        this.currentAudio = null;
        this.currentPlayingButton = null;
        
        // Object URLs for cleanup
        this.activeObjectURLs = new Set();
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            console.log('Initializing Haunted Vinyl Diary...');

            // Load saved entries with error handling
            try {
                this.entries = this.storageService.getAllEntries();
                console.log(`Loaded ${this.entries.length} entries from storage`);
            } catch (storageError) {
                console.error('Failed to load entries from storage:', storageError);
                this.entries = [];
                this.showError('Failed to load saved memories. Starting fresh...');
            }

            // Set up event listeners
            this.setupEventListeners();

            // Set up click-to-start overlay (handles autoplay restrictions)
            this.setupClickToStart();
        } catch (error) {
            console.error('Critical initialization error:', error);
            this.showError('The darkness failed to awaken. Please refresh the page.');
        }
    }
    
    /**
     * Set up click-to-start overlay
     */
    setupClickToStart() {
        const clickOverlay = document.getElementById('click-to-start');
        if (clickOverlay) {
            clickOverlay.addEventListener('click', () => {
                console.log('User clicked to start');
                // Hide overlay
                clickOverlay.classList.add('hidden');
                // Start intro sequence
                this.startIntroSequence();
            });
        } else {
            // Fallback if overlay doesn't exist
            this.startIntroSequence();
        }
    }
    
    /**
     * Start intro sequence
     */
    startIntroSequence() {
        try {
            this.transitionToState(this.STATES.INTRO);
            
            this.mediaManager.playIntroVideo(() => {
                this.onIntroComplete();
            });
        } catch (error) {
            console.error('Error starting intro sequence:', error);
            // Skip intro and go directly to main
            this.onIntroComplete();
        }
    }

    /**
     * Handle intro completion
     */
    onIntroComplete() {
        try {
            console.log('Intro complete, transitioning to main');
            this.transitionToState(this.STATES.MAIN);
            
            // Start background media with error handling
            try {
                this.mediaManager.startBackgroundLoop();
                this.mediaManager.playBackgroundMusic();
            } catch (mediaError) {
                console.error('Failed to start background media:', mediaError);
                // Continue without background media - graceful degradation
            }
        } catch (error) {
            console.error('Error completing intro:', error);
            this.showError('Failed to enter the main realm. Please try again.');
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Main navigation buttons with debouncing to prevent rapid clicks
        const startBtn = document.getElementById('start-btn');
        const logBtn = document.getElementById('log-btn');
        const nextBtn = document.getElementById('next-btn');

        console.log('Setting up event listeners...');
        console.log('Start button found:', !!startBtn);
        console.log('Log button found:', !!logBtn);
        console.log('Next button found:', !!nextBtn);

        if (startBtn) {
            console.log('Adding click listener to start button');
            startBtn.addEventListener('click', () => {
                console.log('START BUTTON CLICKED!');
                this.handleStartClick();
            });
        }
        if (logBtn) {
            console.log('Adding click listener to log button');
            logBtn.addEventListener('click', () => {
                console.log('LOG BUTTON CLICKED!');
                this.handleLogClick();
            });
        }
        if (nextBtn) {
            console.log('Adding click listener to next button');
            nextBtn.addEventListener('click', () => {
                console.log('NEXT BUTTON CLICKED!');
                this.handleNextClick();
            });
        }

        // Séance button
        const seanceBtn = document.getElementById('seance-btn');
        if (seanceBtn) {
            console.log('Adding click listener to séance button');
            seanceBtn.addEventListener('click', () => {
                console.log('SEANCE BUTTON CLICKED!');
                this.handleSeanceClick();
            });
        }

        // Recording screen buttons
        const recordButton = document.getElementById('record-button');
        const backToMainBtn = document.getElementById('back-to-main');
        
        if (recordButton) {
            recordButton.addEventListener('click', () => {
                console.log('Record button clicked');
                if (!this.isRecording) {
                    this.startRecording();
                } else {
                    this.stopRecording();
                }
            });
        }
        
        if (backToMainBtn) {
            backToMainBtn.addEventListener('click', () => {
                console.log('Back to main clicked');
                if (this.isRecording) {
                    this.stopRecording();
                }
                this.transitionToState(this.STATES.MAIN);
            });
        }
        
        // Close buttons
        const closeLogBtn = document.getElementById('close-log-btn');
        const closeVinylBtn = document.getElementById('close-vinyl-btn');
        const closeStoryBtn = document.getElementById('close-story-btn');
        const messageCloseBtn = document.getElementById('message-close-btn');
        const nextSongBtn = document.getElementById('next-song-btn');

        if (closeLogBtn) {
            closeLogBtn.addEventListener('click', () => this.transitionToState(this.STATES.MAIN));
        }
        if (closeVinylBtn) {
            closeVinylBtn.addEventListener('click', () => this.transitionToState(this.STATES.MAIN));
        }
        if (closeStoryBtn) {
            closeStoryBtn.addEventListener('click', () => this.transitionToState(this.STATES.LOG));
        }
        if (messageCloseBtn) {
            messageCloseBtn.addEventListener('click', () => this.uiManager.hideError());
        }
        if (nextSongBtn) {
            nextSongBtn.addEventListener('click', () => {
                console.log('Next song button clicked');
                this.uiManager.playNextSong();
            });
        }

        // Séance room buttons
        const summonBtn = document.getElementById('summon-btn');
        const backFromSeanceBtn = document.getElementById('back-from-seance-btn');
        const closeEncounterBtn = document.getElementById('close-encounter-btn');
        const revealHistoryBtn = document.getElementById('reveal-history-btn');
        const declineHistoryBtn = document.getElementById('decline-history-btn');

        if (summonBtn) {
            summonBtn.addEventListener('click', () => this.handleSummonClick());
        }
        if (backFromSeanceBtn) {
            backFromSeanceBtn.addEventListener('click', () => this.transitionToState(this.STATES.MAIN));
        }
        if (closeEncounterBtn) {
            closeEncounterBtn.addEventListener('click', () => this.handleCloseEncounter());
        }
        if (revealHistoryBtn) {
            revealHistoryBtn.addEventListener('click', () => this.handleRevealHistory());
        }
        if (declineHistoryBtn) {
            declineHistoryBtn.addEventListener('click', () => this.handleDeclineHistory());
        }

        // Listen for custom close encounter event
        document.addEventListener('closeGhostEncounter', () => this.handleCloseEncounter());

        // GLOBAL click handler - catch ALL clicks
        document.addEventListener('click', (e) => {
            console.log('CLICK DETECTED:', e.target);
            console.log('Click target ID:', e.target.id);
            console.log('Click target parent:', e.target.parentElement);
            
            // Check if click is on button or image inside button
            let clickedButton = e.target;
            if (e.target.tagName === 'IMG') {
                clickedButton = e.target.parentElement;
            }
            
            console.log('Clicked button:', clickedButton);
            console.log('Button ID:', clickedButton.id);
            
            // Handle button clicks
            if (clickedButton.id === 'start-btn' || e.target.id === 'start-btn') {
                console.log('START BUTTON CLICKED VIA GLOBAL HANDLER!');
                this.handleStartClick();
                return;
            }
            if (clickedButton.id === 'log-btn' || e.target.id === 'log-btn') {
                console.log('LOG BUTTON CLICKED VIA GLOBAL HANDLER!');
                this.handleLogClick();
                return;
            }
            if (clickedButton.id === 'next-btn' || e.target.id === 'next-btn') {
                console.log('NEXT BUTTON CLICKED VIA GLOBAL HANDLER!');
                this.handleNextClick();
                return;
            }
            
            // Log entry controls
            if (e.target.classList.contains('play-original')) {
                this.handlePlayOriginal(e.target.dataset.id);
            } else if (e.target.classList.contains('play-spooky')) {
                this.handleSpooky(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-entry')) {
                this.handleDeleteEntry(e.target.dataset.id);
            }
        });
        
        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // Escape key to close overlays
            if (e.key === 'Escape') {
                if (this.currentState === this.STATES.LOG) {
                    this.transitionToState(this.STATES.MAIN);
                } else if (this.currentState === this.STATES.VINYL_SPINNING) {
                    this.transitionToState(this.STATES.MAIN);
                } else if (!this.uiManager.elements.messageOverlay.classList.contains('hidden')) {
                    this.uiManager.hideError();
                }
            }
            
            // Space or Enter to activate focused button
            if (e.key === ' ' || e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.tagName === 'BUTTON') {
                    e.preventDefault();
                    activeElement.click();
                }
            }
        });
    }

    /**
     * Handle start button click
     * This transitions to the recording screen and starts recording automatically
     */
    async handleStartClick() {
        console.log('Start button clicked - going to recording screen');
        
        // Ensure background media is playing (handles autoplay restrictions)
        this.mediaManager.ensureBackgroundMediaPlaying();
        
        // Transition to recording screen
        this.transitionToState(this.STATES.RECORDING);
        
        // Auto-start recording after a brief delay (to let UI settle)
        // Use async/await to ensure proper error handling
        setTimeout(async () => {
            console.log('Auto-starting recording...');
            try {
                await this.startRecording();
            } catch (error) {
                console.error('Auto-start recording failed:', error);
                // Error is already handled in startRecording()
            }
        }, 500);
    }

    /**
     * Start recording
     */
    async startRecording() {
        try {
            console.log('=== START RECORDING CALLED ===');
            console.log('Current recording state:', this.isRecording);
            
            // Show loading message
            this.uiManager.displayScaryMessage('Awakening the darkness...');
            
            // Request microphone access and start recording
            console.log('Requesting microphone access...');
            await this.recordingService.startRecording();
            console.log('Recording service started');
            
            // Verify recording actually started
            if (!this.recordingService.isRecording()) {
                console.error('Recording service reports not recording after start!');
                throw new Error('Recording failed to start - service not in recording state');
            }
            
            console.log('✓ Recording verified as active');
            
            // NOTE: We do NOT start live transcription here because Web Speech API
            // will request microphone access again, causing permission prompts.
            // Instead, we'll transcribe the audio AFTER recording stops.
            console.log('✓ Transcription will occur after recording stops');
            
            // Update state
            this.isRecording = true;
            console.log('✓ App recording state set to true');
            
            // Update UI
            const recordBtn = document.getElementById('record-button');
            if (recordBtn) {
                recordBtn.classList.add('recording');
                const textSpan = recordBtn.querySelector('.record-text');
                if (textSpan) {
                    textSpan.textContent = 'Stop Recording';
                }
                console.log('✓ Record button UI updated');
            } else {
                console.warn('Record button not found!');
            }
            
            // Display message and show indicator
            this.uiManager.displayScaryMessage('Your voice feeds the darkness...');
            this.uiManager.showRecordingIndicator();
            console.log('✓ Recording indicator shown');
            
            // Start timer
            this.startRecordingTimer();
            console.log('✓ Recording timer started');
            
            // Auto-stop after 60 seconds (optional safety limit)
            this.recordingTimeout = setTimeout(() => {
                console.log('Auto-stopping recording after 60 seconds');
                this.stopRecording();
            }, 60000);
            
            console.log('=== RECORDING STARTED SUCCESSFULLY ===');
            
        } catch (error) {
            console.error('=== RECORDING START FAILED ===');
            console.error('Error details:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            
            this.isRecording = false;
            
            // Clean up recording service
            try {
                console.log('Cleaning up recording service...');
                this.recordingService.cleanup();
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
            
            // Reset UI
            const recordBtn = document.getElementById('record-button');
            if (recordBtn) {
                recordBtn.classList.remove('recording');
                const textSpan = recordBtn.querySelector('.record-text');
                if (textSpan) {
                    textSpan.textContent = 'Start Recording';
                }
            }
            
            // Hide recording indicator
            this.uiManager.hideRecordingIndicator();
            
            // Show user-friendly error
            let errorMessage = 'Failed to start recording. ';
            if (error.message.includes('permission') || error.message.includes('denied')) {
                errorMessage += 'Please allow microphone access in your browser settings.';
            } else if (error.message.includes('not found')) {
                errorMessage += 'No microphone detected. Please connect a microphone.';
            } else if (error.message.includes('in use')) {
                errorMessage += 'Microphone is being used by another application.';
            } else {
                errorMessage += error.message;
            }
            
            this.showError(errorMessage);
        }
    }
    
    /**
     * Start recording timer
     */
    startRecordingTimer() {
        this.recordingStartTime = Date.now();
        this.recordingTimerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            const timeDisplay = document.querySelector('.recording-time');
            if (timeDisplay) {
                timeDisplay.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }
    
    /**
     * Stop recording timer
     */
    stopRecordingTimer() {
        if (this.recordingTimerInterval) {
            clearInterval(this.recordingTimerInterval);
            this.recordingTimerInterval = null;
        }
    }

    /**
     * Stop recording and create entry
     */
    async stopRecording() {
        console.log('=== STOP RECORDING CALLED ===');
        console.log('Current recording state:', this.isRecording);
        
        if (!this.isRecording) {
            console.warn('Stop recording called but app not in recording state');
            return;
        }
        
        try {
            console.log('Stopping recording process...');
            
            // Stop timer
            this.stopRecordingTimer();
            console.log('✓ Timer stopped');
            
            // Clear timeout
            if (this.recordingTimeout) {
                clearTimeout(this.recordingTimeout);
                this.recordingTimeout = null;
                console.log('✓ Timeout cleared');
            }
            
            // Update UI
            const recordBtn = document.getElementById('record-button');
            if (recordBtn) {
                recordBtn.classList.remove('recording');
                const textSpan = recordBtn.querySelector('.record-text');
                if (textSpan) {
                    textSpan.textContent = 'Start Recording';
                }
                console.log('✓ Button UI updated');
            }
            
            // Check if recording service is actually recording
            const serviceRecording = this.recordingService.isRecording();
            console.log('Recording service state:', serviceRecording);
            
            if (!serviceRecording) {
                console.error('Recording service reports not recording!');
                this.isRecording = false;
                
                // Clean up recording service
                try {
                    this.recordingService.cleanup();
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
                
                this.showError('Recording was not active. Please try again.');
                this.transitionToState(this.STATES.MAIN);
                return;
            }
            
            // Stop recording and get audio data
            console.log('Calling recording service stop...');
            let audioBlob, duration;
            try {
                const result = await this.recordingService.stopRecording();
                audioBlob = result.audioBlob;
                duration = result.duration;
                console.log('✓ Recording stopped successfully');
                console.log('Audio blob size:', audioBlob.size, 'bytes');
                console.log('Duration:', duration, 'seconds');
            } catch (stopError) {
                console.error('Error stopping recording service:', stopError);
                this.isRecording = false;
                this.recordingService.cleanup();
                this.showError('Failed to stop recording. Please try again.');
                this.transitionToState(this.STATES.MAIN);
                return;
            }
            
            // Generate a haunting transcription placeholder
            // NOTE: Web Speech API cannot transcribe pre-recorded audio blobs.
            // For true transcription, you would need a server-side API like:
            // - Google Cloud Speech-to-Text
            // - AWS Transcribe
            // - Azure Speech Services
            // For now, we use atmospheric placeholder text
            console.log('Generating transcription placeholder...');
            const transcriptionPlaceholders = [
                'A whisper from beyond the veil, speaking of forgotten memories...',
                'Words echoing through the darkness, their meaning lost to time...',
                'A voice from the void, telling tales of what once was...',
                'Haunted words captured in the eternal night...',
                'A message from the shadows, preserved in spectral form...',
                'Echoes of the past, resonating through the darkness...',
                'A ghostly recording, its secrets hidden in the static...',
                'Words spoken into the abyss, now trapped forever...',
                'A memory crystallized in sound, waiting to be heard...',
                'The darkness has captured your voice, but not your soul...'
            ];
            const transcription = transcriptionPlaceholders[Math.floor(Math.random() * transcriptionPlaceholders.length)];
            console.log('✓ Transcription placeholder:', transcription);
            
            // Display message
            this.uiManager.displayScaryMessage('Your soul has been captured...');
            this.uiManager.hideRecordingIndicator();
            console.log('✓ UI updated');
            
            // Create voice entry with transcription
            console.log('Creating voice entry...');
            await this.createVoiceEntry(audioBlob, duration, transcription);
            console.log('✓ Voice entry created');
            
            // Update state
            this.isRecording = false;
            console.log('✓ Recording state set to false');
            
            // Show success message
            this.uiManager.displayScaryMessage('Memory stored in the void...');
            
            // Return to main after 3 seconds
            setTimeout(() => {
                this.transitionToState(this.STATES.MAIN);
            }, 3000);
            
            console.log('=== RECORDING STOPPED SUCCESSFULLY ===');
            
        } catch (error) {
            console.error('=== RECORDING STOP FAILED ===');
            console.error('Error details:', error);
            console.error('Error stack:', error.stack);
            this.showError(error.message || 'Failed to stop recording');
            this.isRecording = false;
            this.transitionToState(this.STATES.MAIN);
        }
    }

    /**
     * Create a voice entry from recording
     * @param {Blob} audioBlob - Recorded audio blob
     * @param {number} duration - Recording duration in seconds
     * @param {string} transcription - Transcribed text from recording
     */
    async createVoiceEntry(audioBlob, duration, transcription = '') {
        try {
            // Convert audio blob to base64 for storage
            const audioData = await blobToBase64(audioBlob);
            
            // Create voice entry object with transcription
            const entry = {
                id: generateId(),
                timestamp: Date.now(),
                audioData: audioData,
                audioDuration: duration,
                transcription: transcription,
                scaryLyrics: '',
                songAudioData: '',
                dateFormatted: formatDate(Date.now())
            };
            
            // Save to storage with error handling
            try {
                this.storageService.saveEntry(entry);
                
                // Add to entries array
                this.entries.push(entry);
                
                console.log('Voice entry created:', entry.id);
                console.log('Transcription saved:', transcription);
            } catch (storageError) {
                console.error('Failed to save entry to storage:', storageError);
                
                // Check if it's a quota error
                if (storageError.message.includes('quota')) {
                    this.showError('The void is full. Your memory cannot be stored. Delete old entries to make space.');
                } else {
                    this.showError('Failed to preserve your memory in the darkness.');
                }
                throw storageError;
            }
            
            // Trigger song generation asynchronously (don't block)
            this.generateSongForEntry(entry.id, transcription);
            
        } catch (error) {
            console.error('Error creating voice entry:', error);
            throw error;
        }
    }

    /**
     * Generate scary song for an entry
     * @param {string} entryId - Entry ID
     * @param {string} transcription - Transcribed text
     */
    async generateSongForEntry(entryId, transcription) {
        try {
            console.log('Generating song for entry:', entryId);
            
            // Generate complete song (lyrics + audio)
            const { lyrics, audioData } = await this.songService.generateCompleteSong(transcription);
            
            console.log('Song generated successfully:', entryId);
            console.log('Lyrics:', lyrics);
            
            // Update the entry with song data
            const entry = this.entries.find(e => e.id === entryId);
            if (entry) {
                entry.scaryLyrics = lyrics;
                entry.songAudioData = audioData || '';
                
                // Update storage
                this.storageService.saveEntry(entry);
                
                console.log('Entry updated with song data:', entryId);
            } else {
                console.warn('Entry not found for song update:', entryId);
            }
            
        } catch (error) {
            console.error('Error generating song for entry:', entryId, error);
            // Don't throw - song generation failure shouldn't break the app
        }
    }

    /**
     * Handle log button click
     */
    handleLogClick() {
        try {
            console.log('Log button clicked');
            this.transitionToState(this.STATES.LOG);
        } catch (error) {
            console.error('Error opening log:', error);
            this.showError('Failed to open the memory log. The past remains hidden.');
        }
    }

    /**
     * Handle next button click
     */
    handleNextClick() {
        try {
            console.log('Next button clicked');
            
            // Ensure background media is playing (handles autoplay restrictions)
            try {
                this.mediaManager.ensureBackgroundMediaPlaying();
                this.mediaManager.playScaryMusic();
            } catch (mediaError) {
                console.error('Failed to play scary music:', mediaError);
                // Continue without music - graceful degradation
            }
            
            this.transitionToState(this.STATES.VINYL_SPINNING);
        } catch (error) {
            console.error('Error navigating to vinyl spinning:', error);
            this.showError('The vinyl refuses to spin. The darkness is restless.');
        }
    }

    /**
     * Handle play original recording
     * @param {string} entryId - Entry ID
     */
    async handlePlayOriginal(entryId) {
        console.log('Play original:', entryId);
        
        const button = document.querySelector(`.play-original[data-id="${entryId}"]`);
        if (!button) return;
        
        // If this audio is currently playing, stop it
        if (this.currentAudio && this.currentPlayingButton === button) {
            this.stopCurrentAudio();
            this.mediaManager.playBackgroundMusic(); // Resume background music
            return;
        }
        
        // Stop any currently playing audio
        this.stopCurrentAudio();
        
        // Stop background music while playing entry
        this.mediaManager.stopBackgroundMusic();
        
        try {
            // Find the entry
            const entry = this.entries.find(e => e.id === entryId);
            if (!entry || !entry.audioData) {
                console.error('Entry or audio data not found:', entryId);
                return;
            }
            
            // Convert base64 to blob and create audio element
            const audioBlob = base64ToBlob(entry.audioData);
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Track URL for cleanup
            this.activeObjectURLs.add(audioUrl);
            
            this.currentAudio = new Audio(audioUrl);
            this.currentPlayingButton = button;
            
            // Update button text
            button.textContent = 'Stop';
            button.classList.add('playing');
            
            // Set up event listeners
            this.currentAudio.addEventListener('ended', () => {
                this.stopCurrentAudio();
            });
            
            this.currentAudio.addEventListener('error', (e) => {
                console.error('Audio playback error:', e);
                this.stopCurrentAudio();
                this.showError('Failed to play audio');
            });
            
            // Play the audio
            await this.currentAudio.play();
            
        } catch (error) {
            console.error('Error playing original audio:', error);
            this.stopCurrentAudio();
            this.showError('Failed to play audio');
        }
    }

    /**
     * Handle spooky story generation
     * @param {string} entryId - Entry ID
     */
    async handleSpooky(entryId) {
        console.log('Generating spooky story for:', entryId);
        
        try {
            // Find the entry
            const entry = this.entries.find(e => e.id === entryId);
            if (!entry) {
                console.error('Entry not found:', entryId);
                return;
            }
            
            // Show story container
            this.transitionToState(this.STATES.STORY);
            
            // Play intro video first
            const storyVideo = document.getElementById('story-intro-video');
            const storyContent = document.getElementById('story-content');
            
            console.log('Story elements:', { video: !!storyVideo, content: !!storyContent });
            
            if (storyVideo && storyContent) {
                // Show video, hide content
                console.log('Setting up video playback...');
                storyVideo.classList.remove('hidden');
                storyVideo.style.display = 'block';
                storyContent.classList.add('hidden');
                storyContent.style.display = 'none';
                
                // Reset video to start
                storyVideo.currentTime = 0;
                
                // Set up ended event BEFORE playing
                const onVideoEnd = () => {
                    console.log('Video ended event fired!');
                    this.showStoryContent(entry);
                };
                
                storyVideo.addEventListener('ended', onVideoEnd, { once: true });
                
                // Play video
                console.log('Starting video playback...');
                storyVideo.play().then(() => {
                    console.log('Video playing successfully');
                }).catch(err => {
                    console.error('Failed to play story video:', err);
                    // Skip to story if video fails
                    storyVideo.removeEventListener('ended', onVideoEnd);
                    this.showStoryContent(entry);
                });
                
                // Also add a timeout in case video doesn't end properly
                setTimeout(() => {
                    if (storyContent.style.display !== 'none' && !storyContent.classList.contains('hidden')) {
                        console.log('Story already showing, skipping timeout');
                        return;
                    }
                    console.log('Video timeout reached, forcing story display');
                    storyVideo.removeEventListener('ended', onVideoEnd);
                    this.showStoryContent(entry);
                }, 15000); // 15 second max for video
            } else {
                // If elements not found, show story directly
                console.log('Story elements not found, showing directly');
                this.showStoryContent(entry);
            }
            
        } catch (error) {
            console.error('Error generating spooky story:', error);
            this.showError('The darkness failed to weave your tale...');
        }
    }
    
    /**
     * Show story content after video
     * @param {Object} entry - Entry object
     */
    async showStoryContent(entry) {
        console.log('=== showStoryContent called ===');
        console.log('Entry transcription:', entry.transcription);
        
        const storyVideo = document.getElementById('story-intro-video');
        const storyContent = document.getElementById('story-content');
        const storyText = document.getElementById('story-text');
        
        console.log('Story elements found:', {
            video: !!storyVideo,
            content: !!storyContent,
            text: !!storyText
        });
        
        // COMPLETELY hide and disable video
        if (storyVideo) {
            console.log('Hiding video completely...');
            storyVideo.classList.add('hidden');
            storyVideo.style.display = 'none';
            storyVideo.style.visibility = 'hidden';
            storyVideo.style.opacity = '0';
            storyVideo.style.zIndex = '-1';
            storyVideo.pause();
            storyVideo.currentTime = 0;
        }
        
        // FORCE show story content
        if (storyContent) {
            console.log('Showing story content with force...');
            storyContent.classList.remove('hidden');
            storyContent.style.display = 'flex';
            storyContent.style.visibility = 'visible';
            storyContent.style.opacity = '1';
            storyContent.style.zIndex = '20';
        }
        
        // Generate story
        if (storyText) {
            console.log('Generating story text...');
            storyText.innerHTML = '<p style="text-align: center; font-style: italic; color: #1a0505;">Weaving your tale from the darkness...</p>';
            
            try {
                // Use transcription or fallback
                const transcriptionText = entry.transcription || 'A voice lost in the void';
                console.log('Using transcription:', transcriptionText);
                
                const story = await this.storyService.generateScaryStory(transcriptionText);
                console.log('Story generated successfully!');
                console.log('Story preview:', story.substring(0, 150) + '...');
                
                // Format story into paragraphs with animation delays
                const paragraphs = story.split('\n\n').map((p, index) => 
                    `<p style="--paragraph-index: ${index}">${p}</p>`
                ).join('');
                
                storyText.innerHTML = paragraphs;
                console.log('✓ Story text updated with', story.split('\n\n').length, 'paragraphs');
                console.log('✓ Story display complete!');
            } catch (error) {
                console.error('Error generating story:', error);
                storyText.innerHTML = '<p>The darkness consumed your words before they could be woven into a tale...</p>';
            }
        }
    }
    
    /**
     * Stop currently playing audio
     */
    stopCurrentAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            
            // Clean up audio element
            if (this.currentAudio.src) {
                const url = this.currentAudio.src;
                if (this.activeObjectURLs.has(url)) {
                    URL.revokeObjectURL(url);
                    this.activeObjectURLs.delete(url);
                }
            }
            
            this.currentAudio = null;
        }
        
        if (this.currentPlayingButton) {
            // Restore button text based on button class
            if (this.currentPlayingButton.classList.contains('play-original')) {
                this.currentPlayingButton.textContent = 'Play Original';
            } else if (this.currentPlayingButton.classList.contains('play-song')) {
                this.currentPlayingButton.textContent = 'Play Song';
            }
            this.currentPlayingButton.classList.remove('playing');
            this.currentPlayingButton = null;
        }
        
        // Resume background music if in log state
        if (this.currentState === this.STATES.LOG) {
            this.mediaManager.playBackgroundMusic();
        }
    }
    
    /**
     * Clean up all object URLs
     */
    cleanupObjectURLs() {
        this.activeObjectURLs.forEach(url => {
            try {
                URL.revokeObjectURL(url);
            } catch (e) {
                console.warn('Failed to revoke URL:', url, e);
            }
        });
        this.activeObjectURLs.clear();
    }

    /**
     * Handle delete entry
     * @param {string} entryId - Entry ID
     */
    handleDeleteEntry(entryId) {
        // Confirm deletion
        if (!confirm('Delete this haunted memory forever?')) {
            return;
        }
        
        try {
            // Find and remove from entries array
            const index = this.entries.findIndex(e => e.id === entryId);
            if (index !== -1) {
                this.entries.splice(index, 1);
            }
            
            // Delete from storage
            this.storageService.deleteEntry(entryId);
            
            // Refresh the log display
            this.uiManager.showLog(this.entries);
            
            console.log('Entry deleted:', entryId);
        } catch (error) {
            console.error('Error deleting entry:', error);
            this.showError('Failed to delete memory from the void.');
        }
    }

    /**
     * Transition to a new state
     * @param {string} newState - New application state
     */
    transitionToState(newState) {
        console.log(`Transitioning from ${this.currentState} to ${newState}`);
        
        // Stop any playing audio when leaving log
        if (this.currentState === this.STATES.LOG && newState !== this.STATES.LOG) {
            this.stopCurrentAudio();
        }
        
        // Clean up séance video tracking when leaving séance room
        if (this.currentState === this.STATES.SEANCE && newState !== this.STATES.SEANCE) {
            this.stopSeanceVideoLoopTracking();
            this.stopSeanceTimeout();
        }
        
        // Handle background music based on state
        if (newState === this.STATES.RECORDING || newState === this.STATES.LOG) {
            // Stop background music when recording or in log
            this.mediaManager.stopBackgroundMusic();
        } else if (newState === this.STATES.MAIN) {
            // Resume background music when returning to main
            this.mediaManager.playBackgroundMusic();
        } else if (newState === this.STATES.VINYL_SPINNING) {
            // Stop background music, vinyl section will play its own music
            this.mediaManager.stopBackgroundMusic();
        }
        
        this.currentState = newState;

        switch (newState) {
            case this.STATES.INTRO:
                this.uiManager.showIntro();
                break;
            case this.STATES.MAIN:
                this.uiManager.showMain();
                break;
            case this.STATES.RECORDING:
                this.uiManager.showRecording();
                break;
            case this.STATES.LOG:
                this.uiManager.showLog(this.entries);
                break;
            case this.STATES.VINYL_SPINNING:
                this.uiManager.showVinylSpinning();
                break;
            case this.STATES.STORY:
                this.uiManager.showStory();
                break;
            case this.STATES.SEANCE:
                this.uiManager.showSeance();
                // Stop background music for séance
                this.mediaManager.stopBackgroundMusic();
                break;
            case this.STATES.SUMMONING:
                this.uiManager.showSummoning();
                break;
            case this.STATES.GHOST_ENCOUNTER:
                // Ghost encounter is handled separately
                break;
        }
    }

    /**
     * Handle séance button click (from vinyl room)
     */
    handleSeanceClick() {
        console.log('Séance button clicked');
        this.transitionToState(this.STATES.SEANCE);
        
        // Start séance room timeout (20 seconds)
        this.startSeanceTimeout();
        
        // Track video loops for distorted text effect
        this.startSeanceVideoLoopTracking();
    }
    
    /**
     * Track séance video loops - after 2 loops, trigger distorted text effect
     */
    startSeanceVideoLoopTracking() {
        const seanceVideo = document.getElementById('seance-video');
        if (!seanceVideo) return;
        
        // Reset loop counter
        this.seanceVideoLoops = 0;
        
        // Remove any existing listener
        if (this.seanceVideoLoopHandler) {
            seanceVideo.removeEventListener('ended', this.seanceVideoLoopHandler);
        }
        
        // Create new handler
        this.seanceVideoLoopHandler = () => {
            this.seanceVideoLoops++;
            console.log(`Séance video loop ${this.seanceVideoLoops} completed`);
            
            if (this.seanceVideoLoops >= 2) {
                console.log('2 loops completed - triggering distorted text effect');
                this.triggerDistortedTextEffect();
            }
        };
        
        // Add listener
        seanceVideo.addEventListener('ended', this.seanceVideoLoopHandler);
    }
    
    /**
     * Stop tracking séance video loops
     */
    stopSeanceVideoLoopTracking() {
        const seanceVideo = document.getElementById('seance-video');
        if (seanceVideo && this.seanceVideoLoopHandler) {
            seanceVideo.removeEventListener('ended', this.seanceVideoLoopHandler);
            this.seanceVideoLoopHandler = null;
        }
        this.seanceVideoLoops = 0;
    }
    
    /**
     * Trigger distorted text effect after 2 video loops
     */
    async triggerDistortedTextEffect() {
        console.log('Triggering distorted text effect');
        
        // Stop video loop tracking
        this.stopSeanceVideoLoopTracking();
        
        // Stop séance timeout
        this.stopSeanceTimeout();
        
        // Darken borders first
        const seanceContainer = document.getElementById('seance-container');
        if (seanceContainer) {
            seanceContainer.classList.add('timeout-active');
        }
        
        // Wait 1 second for darkening
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Play heartbeat
        const heartbeatAudio = new Audio('assets/hb.mp3');
        heartbeatAudio.volume = 0.8;
        heartbeatAudio.play().catch(err => console.error('Failed to play heartbeat:', err));
        
        // Show distorted text overlay
        this.showDistortedTextOverlay();
        
        // After 5 seconds, return to main
        setTimeout(() => {
            this.hideDistortedTextOverlay();
            if (seanceContainer) {
                seanceContainer.classList.remove('timeout-active');
            }
            this.transitionToState(this.STATES.MAIN);
        }, 5000);
    }
    
    /**
     * Show distorted text overlay with random creepy messages
     */
    showDistortedTextOverlay() {
        const overlay = document.getElementById('distorted-text-overlay');
        const content = document.getElementById('distorted-text-content');
        
        if (!overlay || !content) return;
        
        // Creepy distorted messages
        const messages = [
            'YOU HAVE STAYED TOO LONG',
            'THE SPIRITS ARE WATCHING',
            'THEY KNOW YOUR NAME',
            'YOU CANNOT ESCAPE',
            'THE DARKNESS REMEMBERS',
            'YOUR SOUL BELONGS HERE',
            'TIME HAS NO MEANING',
            'WE ARE WAITING',
            'THE VOID CALLS TO YOU',
            'FOREVER TRAPPED',
            'NO ONE LEAVES',
            'YOU ARE ONE OF US NOW'
        ];
        
        // Pick random messages
        const selectedMessages = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * messages.length);
            selectedMessages.push(messages[randomIndex]);
        }
        
        // Create distorted text with individual letter animations
        const distortedText = selectedMessages.map(msg => {
            const letters = msg.split('').map((letter, index) => {
                return `<span style="--letter-index: ${index}">${letter}</span>`;
            }).join('');
            return `<div>${letters}</div>`;
        }).join('');
        
        content.innerHTML = distortedText;
        overlay.classList.add('active');
    }
    
    /**
     * Hide distorted text overlay
     */
    hideDistortedTextOverlay() {
        const overlay = document.getElementById('distorted-text-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * Start séance room timeout - if user stays too long, scary things happen
     */
    startSeanceTimeout() {
        // Clear any existing timeout
        if (this.seanceTimeout) {
            clearTimeout(this.seanceTimeout);
        }
        
        // After 20 seconds, start the scary sequence
        this.seanceTimeout = setTimeout(() => {
            this.triggerSeanceTimeout();
        }, 20000);
    }

    /**
     * Stop séance timeout
     */
    stopSeanceTimeout() {
        if (this.seanceTimeout) {
            clearTimeout(this.seanceTimeout);
            this.seanceTimeout = null;
        }
    }

    /**
     * Trigger scary timeout sequence in séance room
     */
    async triggerSeanceTimeout() {
        console.log('Séance timeout triggered - spirits are angry!');
        
        // Start scary effects
        this.uiManager.showSeanceTimeout();
        
        // Play heartbeat audio (hb.mp3) for 8 seconds
        const heartbeatAudio = new Audio('assets/hb.mp3');
        heartbeatAudio.volume = 0.8;
        heartbeatAudio.loop = false;
        heartbeatAudio.play().catch(err => console.error('Failed to play heartbeat audio:', err));
        
        // After 8 seconds of scary effects, force back to main
        setTimeout(() => {
            // Stop effects
            this.uiManager.hideSeanceTimeout();
            
            // Force back to main screen
            this.transitionToState(this.STATES.MAIN);
            
            // Show warning message
            this.showError('The spirits have rejected you. You stayed too long...');
        }, 8000);
    }

    /**
     * Handle summon button click
     */
    async handleSummonClick() {
        console.log('Summon button clicked');
        
        // Stop séance timeout since user is taking action
        this.stopSeanceTimeout();
        
        // Transition to summoning state
        this.transitionToState(this.STATES.SUMMONING);
        
        // Wait for summoning video to end
        const summoningVideo = document.getElementById('summoning-video');
        if (summoningVideo) {
            summoningVideo.addEventListener('ended', () => {
                this.showTransitionEffect();
            }, { once: true });
        } else {
            // Fallback if video not found
            setTimeout(() => this.showTransitionEffect(), 3000);
        }
    }

    /**
     * Show dramatic transition effect before ghost encounter
     */
    showTransitionEffect() {
        // Create black screen with shake effect
        const transitionOverlay = document.getElementById('transition-overlay');
        if (transitionOverlay) {
            transitionOverlay.classList.add('active');
            
            // After 2 seconds of dramatic effect, show ghost
            setTimeout(() => {
                transitionOverlay.classList.remove('active');
                this.showGhostEncounter();
            }, 2000);
        } else {
            // Fallback if overlay not found
            this.showGhostEncounter();
        }
    }

    /**
     * Show ghost encounter after summoning
     */
    showGhostEncounter() {
        // Summon a random ghost
        const ghost = this.seanceService.summonGhost();
        console.log('Ghost summoned:', ghost.name);
        
        // Transition to ghost encounter state
        this.currentState = this.STATES.GHOST_ENCOUNTER;
        this.uiManager.showGhostEncounter(ghost);
        
        // Resume background music from vinyl room
        this.mediaManager.playBackgroundMusic();
        
        // Start ghost-specific effects
        this.seanceService.startHeartbeat(ghost.dangerLevel);
        this.seanceService.ghostMusicAudio = this.seanceService.createGhostMusic(ghost.id);
        
        // Start idle timer
        this.seanceService.startIdleTimer(() => {
            this.uiManager.showIdleWarning();
        });
    }

    /**
     * Handle reveal history button click
     */
    handleRevealHistory() {
        const ghost = this.seanceService.currentGhost;
        if (ghost) {
            this.uiManager.showGhostHistory(ghost);
            
            // Reset idle timer
            this.seanceService.stopIdleTimer();
            this.uiManager.hideIdleWarning();
        }
    }

    /**
     * Handle decline history button click
     */
    async handleDeclineHistory() {
        console.log('User declined ghost history - triggering scary effect');
        
        // Show red vignette effect (ghost is angry!)
        const redVignette = document.getElementById('red-vignette-effect');
        if (redVignette) {
            redVignette.classList.add('active');
        }
        
        // Wait 2 seconds with red vignette
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Remove red vignette
        if (redVignette) {
            redVignette.classList.remove('active');
        }
        
        // Show static overlay with creepy words
        this.showStaticOverlay();
        
        // Play heartbeat
        const heartbeatAudio = new Audio('assets/hb.mp3');
        heartbeatAudio.volume = 0.8;
        heartbeatAudio.play().catch(err => console.error('Failed to play heartbeat:', err));
        
        // After 5 seconds, hide static and return to main
        setTimeout(() => {
            this.hideStaticOverlay();
            
            // Clean up séance service
            this.seanceService.reset();
            
            // Hide idle warning effects
            this.uiManager.hideIdleWarning();
            
            // Return to main screen
            this.transitionToState(this.STATES.MAIN);
        }, 5000);
    }
    
    /**
     * Show static overlay with creepy words
     */
    showStaticOverlay() {
        const overlay = document.getElementById('static-overlay');
        const content = document.getElementById('static-content');
        
        if (!overlay || !content) return;
        
        // Creepy messages for declining ghost
        const messages = [
            'YOU HAVE ANGERED THE SPIRITS',
            'THEY WILL NOT FORGET',
            'YOUR DISRESPECT IS NOTED',
            'THE DARKNESS GROWS STRONGER',
            'YOU WILL REGRET THIS',
            'THEY ARE COMING FOR YOU',
            'NO ESCAPE FROM THEIR WRATH',
            'YOUR FATE IS SEALED',
            'THE CURSE IS UPON YOU',
            'FOREVER HAUNTED',
            'THEY KNOW WHERE YOU LIVE',
            'SLEEP WILL NOT COME EASY'
        ];
        
        // Pick random messages
        const selectedMessages = [];
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * messages.length);
            selectedMessages.push(messages[randomIndex]);
        }
        
        // Create text with individual letter animations
        const creepyText = selectedMessages.map(msg => {
            const letters = msg.split('').map((letter, index) => {
                return `<span style="--letter-index: ${index}">${letter}</span>`;
            }).join('');
            return `<div style="margin: 1rem 0;">${letters}</div>`;
        }).join('');
        
        content.innerHTML = creepyText;
        overlay.classList.add('active');
    }
    
    /**
     * Hide static overlay
     */
    hideStaticOverlay() {
        const overlay = document.getElementById('static-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * Handle close encounter button click
     */
    handleCloseEncounter() {
        console.log('Closing ghost encounter');
        
        // Clean up séance service
        this.seanceService.reset();
        
        // Hide idle warning effects
        this.uiManager.hideIdleWarning();
        
        // Return to séance room
        this.transitionToState(this.STATES.SEANCE);
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     */
    showError(message) {
        this.uiManager.showError(message);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new AppController();
    app.initialize();
    
    // Make app globally accessible for debugging
    window.hauntedVinylApp = app;
});
