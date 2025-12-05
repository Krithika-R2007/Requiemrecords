/**
 * UIManager - Manages UI state transitions and rendering
 */
class UIManager {
    constructor() {
        this.containers = {
            intro: document.getElementById('intro-container'),
            main: document.getElementById('main-container'),
            recording: document.getElementById('recording-container'),
            log: document.getElementById('log-container'),
            vinyl: document.getElementById('vinyl-container'),
            story: document.getElementById('story-container')
        };
        
        this.elements = {
            recordingMessage: document.getElementById('recording-message'),
            recordingIndicator: document.getElementById('recording-indicator'),
            logEntries: document.getElementById('log-entries'),
            vinylApiContent: document.getElementById('vinyl-api-content'),
            messageOverlay: document.getElementById('message-overlay'),
            messageText: document.getElementById('message-text')
        };
        
        // Flag to track if playlist listener has been added
        this.playlistListenerAdded = false;
    }

    /**
     * Show intro screen
     */
    showIntro() {
        this.hideAll();
        this.containers.intro.classList.remove('hidden');
    }

    /**
     * Show main interface
     */
    showMain() {
        this.hideAll();
        this.containers.main.classList.remove('hidden');
    }

    /**
     * Show recording interface
     */
    showRecording() {
        this.hideAll();
        this.containers.recording.classList.remove('hidden');
    }

    /**
     * Show log interface
     * @param {Array} entries - Array of voice entries
     */
    showLog(entries) {
        this.hideAll();
        this.containers.log.classList.remove('hidden');
        this.renderLogEntries(entries);
    }

    /**
     * Show vinyl spinning interface
     */
    showVinylSpinning() {
        console.log('=== Showing vinyl spinning interface ===');
        this.hideAll();
        this.containers.vinyl.classList.remove('hidden');
        
        // Play the vinyl video
        const vinylVideo = document.getElementById('vinyl-video');
        if (vinylVideo) {
            vinylVideo.play().catch(err => {
                console.error('Failed to play vinyl video:', err);
            });
        }
        
        // Initialize and render playlist
        console.log('Initializing playlist...');
        this.initializePlaylist();
        console.log('Rendering playlist...');
        this.renderPlaylist();
        
        // Start rotating creepy messages
        console.log('Starting creepy messages...');
        this.startRotatingCreepyMessages();
        
        // Start playing music
        console.log('Starting music playback...');
        this.fetchAndPlayScaryMusic();
    }
    
    /**
     * Show story interface
     */
    showStory() {
        this.hideAll();
        const storyContainer = document.getElementById('story-container');
        if (storyContainer) {
            storyContainer.classList.remove('hidden');
        }
    }
    
    /**
     * Start rotating creepy messages that change every 8 seconds
     */
    startRotatingCreepyMessages() {
        // Clear any existing interval
        if (this.messageRotationInterval) {
            clearInterval(this.messageRotationInterval);
        }
        
        // Collection of creepy messages
        const creepyMessages = [
            { text: 'Your memories are not your own. They belong to the vinyl now, spinning endlessly in the dark.', author: 'The Void' },
            { text: 'Every recording you make feeds the darkness. It grows stronger with each whispered secret.', author: 'The Eternal Record' },
            { text: 'Time moves differently here. Your voice echoes through dimensions you cannot comprehend.', author: 'The Spinning Abyss' },
            { text: 'The vinyl remembers everything. Even the things you wish to forget.', author: 'The Keeper of Sounds' },
            { text: 'In the space between the grooves lies an eternity of sorrow.', author: 'The Haunted Melody' },
            { text: 'Listen closely... can you hear them? The voices of those who came before you.', author: 'The Whispers' },
            { text: 'Each spin of the record brings you closer to the truth you fear most.', author: 'The Revelation' },
            { text: 'Your voice will join the chorus. Forever trapped. Forever playing.', author: 'The Collection' },
            { text: 'The darkness watches. The darkness waits. The darkness remembers.', author: 'The Shadow' },
            { text: 'You cannot leave. Not really. Part of you stays here, always.', author: 'The Binding' },
            { text: 'In the silence between songs, something stirs. Something ancient.', author: 'The Awakening' },
            { text: 'Your fears are music to us. Play them again. And again. Forever.', author: 'The Audience' },
            { text: 'The vinyl spins. The needle drops. Your soul becomes the song.', author: 'The Transformation' },
            { text: 'Every memory you record here becomes a prison. Beautiful. Eternal. Inescapable.', author: 'The Curator' },
            { text: 'We have been waiting for you. The record player hungers for new voices.', author: 'The Hunger' }
        ];
        
        let currentMessageIndex = Math.floor(Math.random() * creepyMessages.length);
        
        // Display first message immediately
        this.displayCreepyMessage(creepyMessages[currentMessageIndex]);
        
        // Rotate messages every 8 seconds
        this.messageRotationInterval = setInterval(() => {
            currentMessageIndex = (currentMessageIndex + 1) % creepyMessages.length;
            this.displayCreepyMessage(creepyMessages[currentMessageIndex]);
        }, 8000); // Change every 8 seconds
    }
    
    /**
     * Display a creepy message in the center
     * @param {Object} message - Message object with text and author
     */
    displayCreepyMessage(message) {
        if (!this.elements.vinylApiContent) return;
        
        this.elements.vinylApiContent.classList.remove('loading');
        this.elements.vinylApiContent.innerHTML = `
            <h3>A Message from the Void</h3>
            <p>"${message.text}"</p>
            <p class="quote-author">— ${message.author}</p>
        `;
    }
    
    /**
     * Initialize horror music playlist from local assets
     */
    initializePlaylist() {
        // Local horror/dark music playlist from your assets folder
        this.horrorPlaylist = [
            { url: 'assets/darka.mp3', name: 'Dark Ambient' },
            { url: 'assets/horroatmo.mp3', name: 'Horror Atmosphere' },
            { url: 'assets/creepymusic.mp3', name: 'Creepy Music' },
            { url: 'assets/darkc.mp3', name: 'Dark Cinematic' },
            { url: 'assets/horror-background-atmosphere-06-199279.mp3', name: 'Gothic Horror' },
            { url: 'assets/scarya.mp3', name: 'Scary Ambient' },
            { url: 'assets/darkt.mp3', name: 'Dark Tension' },
            { url: 'assets/horrors.mp3', name: 'Horror Soundscape' },
            { url: 'assets/eerie.mp3', name: 'Eerie Melody' },
            { url: 'assets/hauntingtunes.mp3', name: 'Haunting Tones' },
        ];
        
        // Start with a random track when entering vinyl room
        this.currentTrackIndex = Math.floor(Math.random() * this.horrorPlaylist.length);
        console.log(`Starting with random track: ${this.currentTrackIndex + 1} - ${this.horrorPlaylist[this.currentTrackIndex].name}`);
        
        this.isPlaylistActive = false;
    }
    
    /**
     * Render the playlist in the sidebar
     */
    renderPlaylist() {
        const playlistContainer = document.getElementById('playlist-tracks');
        const currentTrackNumber = document.getElementById('current-track-number');
        const totalTracks = document.getElementById('total-tracks');
        
        if (!playlistContainer) {
            console.error('Playlist container not found');
            return;
        }
        
        // Update track counter
        if (currentTrackNumber) {
            currentTrackNumber.textContent = `Track ${this.currentTrackIndex + 1}`;
        }
        if (totalTracks) {
            totalTracks.textContent = this.horrorPlaylist.length;
        }
        
        // Render tracks
        playlistContainer.innerHTML = this.horrorPlaylist.map((track, index) => {
            const isActive = index === this.currentTrackIndex;
            return `
                <div class="playlist-track ${isActive ? 'active' : ''}" data-track-index="${index}">
                    <span class="track-number">${index + 1}.</span>
                    <span class="track-name">${track.name}</span>
                </div>
            `;
        }).join('');
        
        // Add click handlers using event delegation to prevent multiple handlers
        // Only add listener once - check if already added
        if (!this.playlistListenerAdded) {
            console.log('Adding playlist click listener for the first time');
            
            // Create handler
            this.playlistClickHandler = (e) => {
                // Find the clicked track element
                const trackEl = e.target.closest('.playlist-track');
                if (!trackEl) return;
                
                e.preventDefault();
                e.stopPropagation();
                
                const trackIndex = parseInt(trackEl.dataset.trackIndex);
                console.log(`Track ${trackIndex + 1} clicked via delegation!`);
                this.playTrackByIndex(trackIndex);
            };
            
            // Add single delegated listener to container
            playlistContainer.addEventListener('click', this.playlistClickHandler);
            this.playlistListenerAdded = true;
            console.log(`✓ Playlist click handler added for ${playlistContainer.querySelectorAll('.playlist-track').length} tracks`);
        } else {
            console.log('Playlist click listener already exists, skipping');
        }
    }
    
    /**
     * Play a specific track by index
     * @param {number} index - Track index to play
     */
    playTrackByIndex(index) {
        console.log(`=== playTrackByIndex called with index: ${index} ===`);
        
        if (index < 0 || index >= this.horrorPlaylist.length) {
            console.error('Invalid track index:', index);
            return;
        }
        
        console.log(`✓ User selected track ${index + 1}: ${this.horrorPlaylist[index].name}`);
        
        // Stop current audio completely
        if (this.scaryAudio) {
            console.log('Stopping current audio...');
            try {
                this.scaryAudio.pause();
                this.scaryAudio.currentTime = 0;
                this.scaryAudio.src = '';
                this.scaryAudio = null;
            } catch (stopError) {
                console.error('Error stopping audio:', stopError);
                this.scaryAudio = null;
            }
        }
        
        // Update current track index
        this.currentTrackIndex = index;
        
        // Reactivate playlist
        this.isPlaylistActive = true;
        
        // Update playlist UI
        this.renderPlaylist();
        
        // Play the selected track
        console.log(`✓ Starting playback of track ${index + 1}...`);
        this.fetchAndPlayScaryMusic();
    }
    
    /**
     * Fetch and play scary/gothic music from Pixabay playlist
     */
    async fetchAndPlayScaryMusic() {
        try {
            console.log('=== Starting horror music playlist ===');
            
            // Initialize playlist if not done
            if (!this.horrorPlaylist) {
                this.initializePlaylist();
            }
            
            // Get current track
            const currentTrack = this.horrorPlaylist[this.currentTrackIndex];
            console.log(`Playing track ${this.currentTrackIndex + 1}/${this.horrorPlaylist.length}: ${currentTrack.name}`);
            console.log('Track URL:', currentTrack.url);
            
            // Stop any existing audio
            if (this.scaryAudio) {
                console.log('Stopping previous audio');
                this.scaryAudio.pause();
                this.scaryAudio.src = '';
                this.scaryAudio = null;
            }
            
            // Create and play audio
            const scaryAudio = new Audio();
            scaryAudio.src = currentTrack.url;
            scaryAudio.volume = 0.7;
            scaryAudio.preload = 'auto';
            
            // Store reference for cleanup
            this.scaryAudio = scaryAudio;
            this.isPlaylistActive = true;
            
            // Update playlist UI to show current track
            this.renderPlaylist();
            
            // Add event listeners
            scaryAudio.addEventListener('error', (e) => {
                console.error('❌ Audio playback error for track:', currentTrack.name);
                console.error('Error code:', scaryAudio.error?.code);
                console.error('Error message:', scaryAudio.error?.message);
                console.error('Failed URL:', currentTrack.url);
                
                // Show error message instead of skipping
                if (this.elements.vinylApiContent) {
                    this.elements.vinylApiContent.innerHTML = `
                        <h3>Playback Error</h3>
                        <p>Failed to load "${currentTrack.name}"</p>
                        <p class="quote-author">Click another track to continue</p>
                    `;
                }
                
                // Mark as inactive so it doesn't auto-play
                this.isPlaylistActive = false;
                
                console.log('❌ Audio failed to load. Please select another track.');
            });
            
            scaryAudio.addEventListener('ended', () => {
                console.log(`✓ Track ${this.currentTrackIndex + 1} finished playing: ${currentTrack.name}`);
                // Don't auto-advance - let user choose next track
                // Just mark playlist as inactive so it doesn't auto-play
                this.isPlaylistActive = false;
                
                // Update the message to show song finished
                if (this.elements.vinylApiContent) {
                    this.elements.vinylApiContent.innerHTML = `
                        <h3>Song Complete</h3>
                        <p>"${currentTrack.name}" has finished its haunting melody...</p>
                        <p class="quote-author">Click a track or "Next Song" to continue the darkness</p>
                    `;
                }
                
                console.log('✓ Song finished. Waiting for user to select next track.');
            });
            
            scaryAudio.addEventListener('loadeddata', () => {
                console.log('Horror track loaded successfully');
            });
            
            scaryAudio.addEventListener('canplay', () => {
                console.log('Horror track ready to play');
            });
            
            scaryAudio.addEventListener('playing', () => {
                console.log('✓ Horror track is now playing!');
                
                // Update center message to show currently playing track
                if (this.elements.vinylApiContent) {
                    this.elements.vinylApiContent.innerHTML = `
                        <h3>Now Playing</h3>
                        <p>"${currentTrack.name}"</p>
                        <p class="quote-author">Track ${this.currentTrackIndex + 1} of ${this.horrorPlaylist.length}</p>
                        <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">Let the darkness embrace you...</p>
                    `;
                }
            });
            
            scaryAudio.addEventListener('pause', () => {
                console.log('Horror track paused');
            });
            
            // Play the audio
            console.log('Attempting to play audio...');
            try {
                const playPromise = scaryAudio.play();
                if (playPromise !== undefined) {
                    await playPromise;
                    console.log('✓ Successfully started playing horror music');
                }
            } catch (playError) {
                console.error('Play error:', playError.name, playError.message);
                if (playError.name === 'NotAllowedError') {
                    console.log('⚠ Autoplay blocked by browser. Music will start on user interaction.');
                    // Set up one-time click handler to start music
                    const startOnClick = () => {
                        console.log('User interaction detected, starting music...');
                        scaryAudio.play().then(() => {
                            console.log('✓ Music started after user interaction');
                        }).catch(err => {
                            console.error('Still failed to play:', err);
                        });
                        document.removeEventListener('click', startOnClick);
                    };
                    document.addEventListener('click', startOnClick, { once: true });
                } else {
                    console.error('❌ Unexpected play error:', playError);
                    // Show error message instead of skipping
                    if (this.elements.vinylApiContent) {
                        this.elements.vinylApiContent.innerHTML = `
                            <h3>Playback Error</h3>
                            <p>Failed to play "${currentTrack.name}"</p>
                            <p class="quote-author">Click another track to continue</p>
                        `;
                    }
                    this.isPlaylistActive = false;
                }
            }
            
        } catch (error) {
            console.error('❌ Error in fetchAndPlayScaryMusic:', error);
            // Show error message instead of skipping
            if (this.elements.vinylApiContent) {
                this.elements.vinylApiContent.innerHTML = `
                    <h3>Playback Error</h3>
                    <p>Failed to load track</p>
                    <p class="quote-author">Click another track to continue</p>
                `;
            }
            this.isPlaylistActive = false;
        }
    }
    
    /**
     * Play next track in the playlist automatically
     */
    playNextTrackInPlaylist() {
        if (!this.isPlaylistActive) {
            console.log('Playlist not active, skipping auto-play');
            return;
        }
        
        // Stop current audio
        if (this.scaryAudio) {
            this.scaryAudio.pause();
            this.scaryAudio = null;
        }
        
        // Check if we've reached the end of the playlist
        if (this.currentTrackIndex >= this.horrorPlaylist.length - 1) {
            console.log('Playlist completed. Click a track to play again.');
            this.isPlaylistActive = false;
            return;
        }
        
        // Move to next track
        this.currentTrackIndex = this.currentTrackIndex + 1;
        
        // Update playlist UI
        this.renderPlaylist();
        
        // Play next track
        this.fetchAndPlayScaryMusic();
    }
    
    /**
     * Play next song in vinyl section (manual skip)
     */
    playNextSong() {
        console.log('=== Manually skipping to next song ===');
        
        // If at end of playlist, restart from beginning
        if (this.currentTrackIndex >= this.horrorPlaylist.length - 1) {
            console.log('At end of playlist, restarting from beginning');
            this.playTrackByIndex(0);
        } else {
            // Move to next track
            this.playTrackByIndex(this.currentTrackIndex + 1);
        }
    }
    
    /**
     * Stop scary music and deactivate playlist
     */
    stopScaryMusic() {
        this.isPlaylistActive = false;
        
        if (this.scaryAudio) {
            this.scaryAudio.pause();
            this.scaryAudio.currentTime = 0;
            this.scaryAudio = null;
        }
    }

    /**
     * Fetch and display haunting content from API
     */
    async fetchAndDisplayHauntingContent() {
        if (!this.elements.vinylApiContent) {
            console.error('Vinyl API content element not found');
            return;
        }

        // Show loading state
        this.elements.vinylApiContent.innerHTML = '<p class="loading">Summoning dark content...</p>';
        this.elements.vinylApiContent.classList.add('loading');

        try {
            // Set a timeout for the API call
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            // Try to fetch a random depressing/dark quote
            // Using quotable.io API with tags for dark/depressing content
            const response = await fetch('https://api.quotable.io/random?tags=wisdom|philosophy&maxLength=200', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.error('API response not OK:', response.status, response.statusText);
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            
            if (!data || !data.content) {
                console.error('Invalid API response data:', data);
                throw new Error('Invalid API response');
            }
            
            // Transform the quote into something more haunting
            const hauntingQuote = this.makeQuoteHaunting(data.content);
            const author = data.author || 'Unknown';

            // Display the content
            this.elements.vinylApiContent.classList.remove('loading');
            this.elements.vinylApiContent.innerHTML = `
                <h3>A Message from the Void</h3>
                <p>"${hauntingQuote}"</p>
                <p class="quote-author">— ${author}</p>
            `;

        } catch (error) {
            console.error('Error fetching haunting content:', error);
            
            if (error.name === 'AbortError') {
                console.error('API request timed out');
            } else if (error.name === 'TypeError') {
                console.error('Network error or CORS issue');
            }
            
            // Fallback to local haunting content
            this.displayFallbackHauntingContent();
        }
    }

    /**
     * Make a quote more haunting by adding dark context
     * @param {string} quote - Original quote
     * @returns {string} Haunting version of the quote
     */
    makeQuoteHaunting(quote) {
        // Add some haunting prefixes/suffixes randomly
        const hauntingPrefixes = [
            'In the darkness of forgotten memories, ',
            'As the vinyl spins eternally, ',
            'From the depths of despair, ',
            'In the silence between heartbeats, ',
            'When all hope fades away, '
        ];

        const hauntingSuffixes = [
            '... and so the cycle continues.',
            '... forever echoing in the void.',
            '... until the end of all things.',
            '... as it was, as it shall always be.',
            '... and the darkness listens.'
        ];

        // Randomly decide whether to add prefix, suffix, or both
        const rand = Math.random();
        
        if (rand < 0.3) {
            // Add prefix only
            const prefix = hauntingPrefixes[Math.floor(Math.random() * hauntingPrefixes.length)];
            return prefix + quote.charAt(0).toLowerCase() + quote.slice(1);
        } else if (rand < 0.6) {
            // Add suffix only
            const suffix = hauntingSuffixes[Math.floor(Math.random() * hauntingSuffixes.length)];
            return quote + suffix;
        } else {
            // Return as is for variety
            return quote;
        }
    }

    /**
     * Display fallback haunting content when API fails
     */
    displayFallbackHauntingContent() {
        const fallbackQuotes = [
            {
                quote: 'Your memories are not your own. They belong to the vinyl now, spinning endlessly in the dark.',
                author: 'The Void'
            },
            {
                quote: 'Every recording you make feeds the darkness. It grows stronger with each whispered secret.',
                author: 'The Eternal Record'
            },
            {
                quote: 'Time moves differently here. Your voice echoes through dimensions you cannot comprehend.',
                author: 'The Spinning Abyss'
            },
            {
                quote: 'The vinyl remembers everything. Even the things you wish to forget.',
                author: 'The Keeper of Sounds'
            },
            {
                quote: 'In the space between the grooves lies an eternity of sorrow.',
                author: 'The Haunted Melody'
            }
        ];

        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

        this.elements.vinylApiContent.classList.remove('loading');
        this.elements.vinylApiContent.innerHTML = `
            <h3>A Message from the Void</h3>
            <p>"${randomQuote.quote}"</p>
            <p class="quote-author">— ${randomQuote.author}</p>
        `;
    }

    /**
     * Hide all containers
     */
    hideAll() {
        Object.values(this.containers).forEach(container => {
            if (container) container.classList.add('hidden');
        });
        
        // Stop scary music when hiding vinyl section
        this.stopScaryMusic();
        
        // Stop message rotation
        if (this.messageRotationInterval) {
            clearInterval(this.messageRotationInterval);
            this.messageRotationInterval = null;
        }
    }

    /**
     * Display scary message
     * @param {string} message - Message to display
     */
    displayScaryMessage(message) {
        if (this.elements.recordingMessage) {
            this.elements.recordingMessage.textContent = message;
        }
    }

    /**
     * Show recording indicator
     */
    showRecordingIndicator() {
        if (this.elements.recordingIndicator) {
            this.elements.recordingIndicator.classList.remove('hidden');
        }
    }

    /**
     * Hide recording indicator
     */
    hideRecordingIndicator() {
        if (this.elements.recordingIndicator) {
            this.elements.recordingIndicator.classList.add('hidden');
        }
    }

    /**
     * Render log entries
     * @param {Array} entries - Array of voice entries
     */
    renderLogEntries(entries) {
        try {
            if (!this.elements.logEntries) {
                console.error('Log entries element not found');
                return;
            }

            if (!Array.isArray(entries)) {
                console.error('Invalid entries data - not an array:', entries);
                this.elements.logEntries.innerHTML = '<div class="empty-log">Error loading memories...</div>';
                return;
            }

            if (entries.length === 0) {
                this.elements.logEntries.innerHTML = '<div class="empty-log">No memories captured yet...</div>';
                return;
            }

            try {
                this.elements.logEntries.innerHTML = entries.map(entry => {
                    // Validate entry has required fields
                    if (!entry || !entry.id) {
                        console.warn('Skipping invalid entry:', entry);
                        return '';
                    }
                    
                    const hasSong = entry.songAudioData && entry.songAudioData.length > 0;
                    
                    return `
                        <div class="entry-card" data-id="${entry.id}" role="listitem" aria-label="Memory entry from ${entry.dateFormatted || 'Unknown date'}">
                            <div class="entry-header">
                                <div class="entry-date" aria-label="Recording date">${entry.dateFormatted || 'Unknown date'}</div>
                                <div class="entry-duration" aria-label="Duration">${formatDuration(entry.audioDuration || 0)}</div>
                            </div>
                            <div class="entry-controls" role="group" aria-label="Playback controls">
                                <button class="control-button play-original" data-id="${entry.id}" aria-label="Play original recording">Play Original</button>
                                <button class="control-button play-spooky" data-id="${entry.id}" aria-label="Generate spooky story">Spooky</button>
                                <button class="control-button delete-entry" data-id="${entry.id}" aria-label="Delete this memory">Delete</button>
                            </div>
                        </div>
                    `;
                }).filter(html => html !== '').join('');
            } catch (renderError) {
                console.error('Error rendering entry HTML:', renderError);
                this.elements.logEntries.innerHTML = '<div class="empty-log" role="status">Error displaying memories...</div>';
            }
        } catch (error) {
            console.error('Error in renderLogEntries:', error);
        }
    }

    /**
     * Update button states
     * @param {boolean} enabled - Whether buttons should be enabled
     */
    updateButtonStates(enabled) {
        const buttons = document.querySelectorAll('.nav-button');
        buttons.forEach(button => {
            button.disabled = !enabled;
            button.style.pointerEvents = enabled ? 'auto' : 'none';
            button.style.opacity = enabled ? '1' : '0.5';
        });
    }

    /**
     * Show error message overlay
     * @param {string} message - Error message
     */
    showError(message) {
        if (this.elements.messageOverlay && this.elements.messageText) {
            this.elements.messageText.textContent = message;
            this.elements.messageOverlay.classList.remove('hidden');
        }
    }

    /**
     * Hide error message overlay
     */
    hideError() {
        if (this.elements.messageOverlay) {
            this.elements.messageOverlay.classList.add('hidden');
        }
    }
}
