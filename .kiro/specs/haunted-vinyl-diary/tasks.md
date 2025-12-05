# Implementation Plan

- [x] 1. Set up project structure and HTML foundation





  - Create index.html with semantic structure and meta tags
  - Set up CSS file structure (main.css, intro.css, recording.css, log.css, vinyl.css)
  - Set up JavaScript file structure (app.js, ui-manager.js, media-manager.js, recording-service.js, transcription-service.js, song-service.js, storage-service.js, utils.js)
  - Link Google Fonts for Kirang Haerang with fallback fonts
  - Create basic HTML containers for different application states
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 2. Implement intro sequence and media foundation




  - [x] 2.1 Create intro video player functionality


    - Write code to load and play intro.mp4 on page load
    - Implement video ended event handler to transition to main interface
    - Add timeout fallback for video load failures
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [x] 2.2 Implement background media looping system


    - Write code to load and loop loop.mp4 as background video
    - Write code to load and loop bg1.mp3 as background audio
    - Implement MediaManager class to handle all media playback
    - Ensure media elements persist across state transitions
    - Add autoplay fallback with manual play button for browser restrictions
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 11.3_
  
  - [x] 2.3 Write property test for background media persistence


    - **Property 1: Background media persistence across state transitions**
    - **Validates: Requirements 2.5**

- [x] 3. Build main interface with navigation buttons




  - [x] 3.1 Create main interface layout and styling


    - Write HTML structure for main interface state
    - Write CSS to position start.png button at bottom center
    - Write CSS to position next.png button at bottom right
    - Write CSS to position log.png button on screen
    - Add hover effects for buttons
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 3.2 Implement application state management


    - Write AppController class with state machine (INTRO, MAIN, RECORDING, LOG, VINYL_SPINNING)
    - Implement state transition methods
    - Write UIManager class to show/hide interface elements based on state
    - _Requirements: 1.2, 1.3_
  
  - [x] 3.3 Write unit tests for state transitions


    - Test intro to main transition
    - Test button click handlers
    - Test UI element visibility in each state
    - _Requirements: 1.2, 3.1, 3.2, 3.3_

- [x] 4. Implement voice recording functionality




  - [x] 4.1 Create RecordingService class

    - Write microphone access request functionality
    - Implement MediaRecorder setup and audio capture
    - Write start/stop recording methods
    - Implement audio blob retrieval and duration calculation
    - Add error handling for permission denied and device not found
    - _Requirements: 4.2, 4.5, 11.4_
  
  - [x] 4.2 Build recording UI and scary messages


    - Write code to display "life recording start" message in Kirang Haerang font when recording begins
    - Create array of scary phrases for recording stop
    - Write code to display random scary phrase in Kirang Haerang font when recording stops
    - Add CSS styling for scary text effects
    - _Requirements: 4.1, 4.3, 9.1, 9.2_
  
  - [x] 4.3 Implement recording workflow integration


    - Connect start button click to recording initiation
    - Implement stop recording trigger (button or automatic)
    - Create VoiceEntry object structure
    - Wire recording completion to entry creation
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 4.4 Write property test for recording storage


    - **Property 2: Recording storage completeness**
    - **Validates: Requirements 4.4**
  
  - [x] 4.5 Write unit tests for recording service


    - Test microphone permission request
    - Test recording start/stop
    - Test error handling for denied permissions
    - _Requirements: 4.2, 4.5_

- [x] 5. Implement local storage system




  - [x] 5.1 Create StorageService class


    - Write saveEntry method to store VoiceEntry in localStorage
    - Write getAllEntries method to retrieve all entries
    - Write getEntry method to retrieve single entry by ID
    - Write deleteEntry method for entry removal
    - Implement storage usage monitoring
    - Add error handling for quota exceeded
    - _Requirements: 8.1, 8.5_
  
  - [x] 5.2 Implement audio data encoding for storage


    - Write utility function to convert audio Blob to Base64 string
    - Write utility function to convert Base64 string back to Blob
    - Implement compression if needed for storage efficiency
    - _Requirements: 8.1_
  
  - [x] 5.3 Implement storage initialization and restoration


    - Write code to load entries from localStorage on app initialization
    - Implement data validation for loaded entries
    - Add error handling for corrupted data
    - _Requirements: 8.4_
  
  - [x] 5.4 Write property test for storage round-trip


    - **Property 17: Storage round-trip consistency**
    - **Validates: Requirements 8.4**
  
  - [x] 5.5 Write property tests for storage persistence


    - **Property 14: Local storage persistence for entries**
    - **Property 15: Local storage persistence for transcriptions**
    - **Property 16: Local storage persistence for songs**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  
  - [x] 5.6 Write unit tests for storage operations


    - Test saving and retrieving entries
    - Test storage quota exceeded handling
    - Test corrupted data handling
    - _Requirements: 8.1, 8.4, 8.5_

- [x] 6. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [-] 7. Implement transcription service


  - [x] 7.1 Create TranscriptionService class


    - Write code to initialize Web Speech API (SpeechRecognition)
    - Implement transcribeAudio method using speech recognition
    - Add browser compatibility check (isSupported method)
    - Implement fallback for unsupported browsers
    - Add error handling for transcription failures
    - _Requirements: 5.1_
  
  - [x] 7.2 Integrate transcription into recording workflow


    - Wire recording completion to transcription initiation
    - Update VoiceEntry with transcription text when complete
    - Update storage with transcription data
    - _Requirements: 5.1, 5.2, 8.2_
  
  - [x] 7.3 Write property tests for transcription


    - **Property 3: Transcription triggers for all entries**
    - **Property 4: Transcription storage association**
    - **Validates: Requirements 5.1, 5.2**
  
  - [x] 7.4 Write unit tests for transcription service








    - Test Web Speech API initialization
    - Test transcription success flow
    - Test transcription failure handling
    - _Requirements: 5.1, 5.2_

- [x] 8. Implement scary song generation






  - [x] 8.1 Create SongGenerationService class


    - Write generateScaryLyrics method to transform text into disturbing lyrics
    - Implement generateSongAudio method using text-to-speech with effects
    - Add integration with free API (Hugging Face or Web Speech Synthesis)
    - Implement error handling and retry logic
    - _Requirements: 5.3, 5.4_
  
  - [x] 8.2 Integrate song generation into workflow


    - Wire transcription completion to lyrics generation
    - Wire lyrics generation to audio generation
    - Update VoiceEntry with song data when complete
    - Update storage with song data
    - _Requirements: 5.3, 5.4, 5.5, 8.3_
  
  - [x] 8.3 Write property tests for song generation


    - **Property 5: Lyrics generation for all transcriptions**
    - **Property 6: Song audio generation for all lyrics**
    - **Property 7: Song association with entries**
    - **Validates: Requirements 5.3, 5.4, 5.5**
  
  - [x] 8.4 Write unit tests for song generation


    - Test lyrics generation
    - Test audio generation
    - Test API error handling
    - _Requirements: 5.3, 5.4_

- [x] 9. Build log interface for viewing entries





  - [x] 9.1 Create log interface HTML and CSS


    - Write HTML structure for log display
    - Write CSS for entry list styling with haunted aesthetic
    - Create entry card template with date, playback controls, and text access
    - Add scrolling for long lists
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 9.2 Implement log display functionality


    - Write code to render all entries when log button is clicked
    - Implement entry card rendering with date/time formatting
    - Add playback controls for original audio
    - Add playback controls for scary song version
    - Add transcription text display or toggle
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 9.3 Implement log playback functionality


    - Write audio playback handler for original recordings
    - Write audio playback handler for scary songs
    - Add play/pause/stop controls
    - Implement audio player state management
    - _Requirements: 6.6_
  
  - [x] 9.4 Write property tests for log display


    - **Property 8: Log displays all entries**
    - **Property 9: Entry metadata display**
    - **Property 10: Playback controls for all entries**
    - **Property 11: Transcription access for all entries**
    - **Property 12: Song access for all entries**
    - **Property 13: Playback functionality for selected entries**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
  
  - [x] 9.5 Write unit tests for log interface


    - Test log rendering with multiple entries
    - Test playback controls
    - Test empty log state
    - _Requirements: 6.1, 6.2, 6.3, 6.6_

- [x] 10. Implement vinyl spinning interface





  - [x] 10.1 Create vinyl spinning HTML and CSS


    - Write HTML structure for vinyl spinning state
    - Write CSS keyframe animation for vinyl rotation
    - Style vinyl using nxt.png asset
    - Add container for API-fetched content
    - _Requirements: 7.1, 7.4_
  
  - [x] 10.2 Implement vinyl spinning functionality


    - Write code to transition to vinyl spinning state on next button click
    - Implement vinyl spin animation trigger
    - Add scary/depressing music playback
    - Integrate free API for haunting content (quotes, images, etc.)
    - Display fetched content with haunted styling
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  

  - [x] 10.3 Write unit tests for vinyl spinning

    - Test state transition to vinyl spinning
    - Test animation application
    - Test API integration
    - Test background media persistence
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11. Implement font styling and scary aesthetics




  - [x] 11.1 Apply Kirang Haerang font to scary messages


    - Write CSS class for scary message styling
    - Apply font to recording start message
    - Apply font to recording stop messages
    - Apply font to error messages
    - Ensure font fallback chain is working
    - _Requirements: 9.1, 9.2_
  
  - [x] 11.2 Write property test for font consistency


    - **Property 18: Font consistency for scary messages**
    - **Validates: Requirements 9.1**

- [x] 12. Polish and error handling






  - [x] 12.1 Implement comprehensive error handling

    - Add try-catch blocks around all async operations
    - Implement user-friendly error messages with scary styling
    - Add error logging to console
    - Implement graceful degradation for failed features
    - _Requirements: 11.5_
  

  - [x] 12.2 Add responsive design improvements

    - Write media queries for mobile devices
    - Test and adjust button positioning for small screens
    - Ensure video backgrounds work on mobile
    - _Requirements: 11.2_
  

  - [x] 12.3 Write unit tests for error scenarios

    - Test microphone permission denied
    - Test storage quota exceeded
    - Test API failures
    - Test media load failures
    - _Requirements: 4.5, 8.5, 11.3, 11.4_

- [x] 13. Final checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Final integration and polish





  - [x] 14.1 Test complete user flows


    - Test full recording → transcription → song generation → storage flow
    - Test app reload and data restoration
    - Test all navigation paths
    - Verify all assets load correctly
    - _Requirements: All_
  
  - [x] 14.2 Performance optimization


    - Optimize audio encoding/decoding
    - Implement lazy loading for assets
    - Add debouncing to rapid interactions
    - Clean up unused media elements
    - _Requirements: 10.5_
  
  - [x] 14.3 Accessibility improvements


    - Add ARIA labels to all interactive elements
    - Ensure keyboard navigation works
    - Test with screen readers
    - Add focus indicators
    - _Requirements: 11.1_
