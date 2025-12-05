# Design Document: Haunted Vinyl Diary

## Overview

The Haunted Vinyl Diary is a single-page web application built with vanilla HTML, CSS, and JavaScript that creates an immersive, haunted vinyl record experience for voice journaling. The application features multiple interface states (intro, main, recording, log, vinyl spinning), persistent local storage for recordings, speech-to-text transcription, and AI-powered scary song generation. The design emphasizes atmospheric visuals with looping video backgrounds, continuous audio, and gothic typography.

## Architecture

### High-Level Architecture

The application follows a client-side MVC-inspired pattern:

```
┌─────────────────────────────────────────────────────┐
│                   Browser Environment                │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   UI Layer   │  │ Audio/Video  │  │  Storage  │ │
│  │  (HTML/CSS)  │  │   Manager    │  │  Manager  │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘ │
│         │                 │                 │        │
│  ┌──────┴─────────────────┴─────────────────┴────┐  │
│  │         Application Controller (JS)           │  │
│  │  - State Management                           │  │
│  │  - Event Handling                             │  │
│  │  - Navigation                                 │  │
│  └──────┬────────────────────────────────────────┘  │
│         │                                            │
│  ┌──────┴────────────────────────────────────────┐  │
│  │         Service Layer                         │  │
│  │  - Recording Service                          │  │
│  │  - Transcription Service (Web Speech API)    │  │
│  │  - Song Generation Service (API)             │  │
│  │  - Local Storage Service                     │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Application States

The application operates in distinct states:
1. **INTRO** - Playing intro video
2. **MAIN** - Main interface with navigation buttons
3. **RECORDING** - Active voice recording
4. **LOG** - Displaying previous entries
5. **VINYL_SPINNING** - Next section with spinning vinyl

## Components and Interfaces

### 1. UI Manager

Responsible for rendering and transitioning between different interface states.

**Interface:**
```javascript
class UIManager {
  showIntro()
  showMain()
  showRecording()
  showLog(entries)
  showVinylSpinning()
  displayScaryMessage(message)
  updateButtonStates(enabled)
}
```

### 2. Media Manager

Handles all video and audio playback including looping background media.

**Interface:**
```javascript
class MediaManager {
  playIntroVideo(onComplete)
  startBackgroundLoop()
  stopBackgroundLoop()
  playBackgroundMusic()
  playScaryMusic()
  ensureLooping(mediaElement)
}
```

### 3. Recording Service

Manages microphone access, audio recording, and audio data handling.

**Interface:**
```javascript
class RecordingService {
  requestMicrophoneAccess()
  startRecording()
  stopRecording()
  getAudioBlob()
  getAudioDuration()
}
```

### 4. Transcription Service

Converts recorded audio to text using the Web Speech API.

**Interface:**
```javascript
class TranscriptionService {
  transcribeAudio(audioBlob)
  isSupported()
}
```

### 5. Song Generation Service

Transforms transcribed text into scary song lyrics and generates audio.

**Interface:**
```javascript
class SongGenerationService {
  generateScaryLyrics(text)
  generateSongAudio(lyrics)
}
```

### 6. Storage Service

Manages persistent storage of recordings, transcriptions, and generated songs in browser local storage.

**Interface:**
```javascript
class StorageService {
  saveEntry(entry)
  getAllEntries()
  getEntry(id)
  deleteEntry(id)
  getStorageUsage()
  clearAll()
}
```

### 7. Application Controller

Central coordinator that manages application state and orchestrates interactions between components.

**Interface:**
```javascript
class AppController {
  initialize()
  handleStartClick()
  handleLogClick()
  handleNextClick()
  handleRecordingStop()
  transitionToState(newState)
}
```

## Data Models

### VoiceEntry

Represents a single recorded memory entry.

```javascript
{
  id: string,              // Unique identifier (timestamp-based)
  timestamp: number,       // Unix timestamp of creation
  audioData: string,       // Base64-encoded audio blob
  audioDuration: number,   // Duration in seconds
  transcription: string,   // Transcribed text
  scaryLyrics: string,     // Generated scary song lyrics
  songAudioData: string,   // Base64-encoded song audio (optional)
  dateFormatted: string    // Human-readable date
}
```

### AppState

Represents the current application state.

```javascript
{
  currentState: string,    // INTRO | MAIN | RECORDING | LOG | VINYL_SPINNING
  isRecording: boolean,
  entries: VoiceEntry[],
  mediaReady: boolean,
  microphoneGranted: boolean
}
```

## Data Models


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After reviewing the acceptance criteria, many are specific examples or edge cases that will be tested individually. The following properties represent universal behaviors that should hold across all inputs:

### Property 1: Background media persistence across state transitions

*For any* state transition in the application, the background loop video and background music should continue playing without interruption.

**Validates: Requirements 2.5**

### Property 2: Recording storage completeness

*For any* audio recording that is stopped, the system should create and store a complete VoiceEntry object in local storage containing the audio data.

**Validates: Requirements 4.4**

### Property 3: Transcription triggers for all entries

*For any* saved voice entry, the transcription service should be invoked to convert the audio to text.

**Validates: Requirements 5.1**

### Property 4: Transcription storage association

*For any* completed transcription, the resulting text should be stored in the same VoiceEntry object alongside the original audio data.

**Validates: Requirements 5.2**

### Property 5: Lyrics generation for all transcriptions

*For any* stored transcription text, the song generation service should be invoked to create scary lyrics.

**Validates: Requirements 5.3**

### Property 6: Song audio generation for all lyrics

*For any* generated scary lyrics, the system should attempt to create an audio version of the song.

**Validates: Requirements 5.4**

### Property 7: Song association with entries

*For any* generated scary song, the song data should be stored in the corresponding VoiceEntry object.

**Validates: Requirements 5.5**

### Property 8: Log displays all entries

*For any* set of stored voice entries, clicking the log button should display all entries in the log interface.

**Validates: Requirements 6.1**

### Property 9: Entry metadata display

*For any* voice entry displayed in the log, the interface should show the recording date and time.

**Validates: Requirements 6.2**

### Property 10: Playback controls for all entries

*For any* voice entry displayed in the log, playback controls should be available.

**Validates: Requirements 6.3**

### Property 11: Transcription access for all entries

*For any* voice entry displayed in the log, the transcribed text should be accessible to the user.

**Validates: Requirements 6.4**

### Property 12: Song access for all entries

*For any* voice entry displayed in the log that has a generated song, the scary song version should be accessible to the user.

**Validates: Requirements 6.5**

### Property 13: Playback functionality for selected entries

*For any* voice entry selected in the log, the user should be able to play either the original recording or the scary song version.

**Validates: Requirements 6.6**

### Property 14: Local storage persistence for entries

*For any* voice entry created, the audio data should be stored in browser local storage and retrievable.

**Validates: Requirements 8.1**

### Property 15: Local storage persistence for transcriptions

*For any* completed transcription, the text should be stored in browser local storage and retrievable.

**Validates: Requirements 8.2**

### Property 16: Local storage persistence for songs

*For any* generated scary song, the song data should be stored in browser local storage and retrievable.

**Validates: Requirements 8.3**

### Property 17: Storage round-trip consistency

*For any* set of voice entries saved to local storage, reloading the application should restore all entries with their complete data intact.

**Validates: Requirements 8.4**

### Property 18: Font consistency for scary messages

*For any* scary message displayed by the system, the text should be rendered using the Kirang Haerang font family.

**Validates: Requirements 9.1**

## Error Handling

### Microphone Access Errors

- **Permission Denied**: Display user-friendly error message explaining microphone access is required
- **Device Not Found**: Inform user that no microphone was detected
- **Already in Use**: Notify user that microphone is being used by another application

### Media Playback Errors

- **Autoplay Blocked**: Provide manual play button for user to start background media
- **File Not Found**: Display error and attempt to continue with remaining functionality
- **Codec Not Supported**: Provide fallback formats or graceful degradation

### Storage Errors

- **Quota Exceeded**: Notify user that storage is full and offer to delete old entries
- **Storage Unavailable**: Warn user that recordings won't persist and offer in-memory mode
- **Corrupted Data**: Attempt recovery or skip corrupted entries with user notification

### API Errors

- **Transcription Failure**: Store audio without transcription and allow manual retry
- **Song Generation Failure**: Store entry without song and allow manual retry
- **Network Timeout**: Provide retry mechanism with exponential backoff

### General Error Handling Strategy

- All errors should be caught and logged to console for debugging
- User-facing errors should use the scary aesthetic (Kirang Haerang font, dark styling)
- Critical errors should not crash the application
- Non-critical features should degrade gracefully

## Testing Strategy

### Unit Testing

The application will use **Jest** as the testing framework for unit tests. Unit tests will cover:

- **Component Initialization**: Verify each service and manager initializes correctly
- **State Transitions**: Test that state changes occur correctly for specific user actions
- **Data Transformation**: Test audio blob encoding/decoding, date formatting
- **Storage Operations**: Test saving and retrieving specific entries from localStorage
- **Error Handling**: Test specific error scenarios (permission denied, storage full, etc.)
- **UI Rendering**: Test that specific UI elements render with correct attributes

Example unit tests:
- Test that clicking start button transitions to RECORDING state
- Test that intro video completion triggers transition to MAIN state
- Test that VoiceEntry objects are created with all required fields
- Test that localStorage.setItem is called when saving entries
- Test that microphone permission denial shows error message

### Property-Based Testing

The application will use **fast-check** as the property-based testing library for JavaScript. Property-based tests will verify universal behaviors across many randomly generated inputs.

**Configuration**: Each property-based test should run a minimum of 100 iterations to ensure thorough coverage.

**Tagging**: Each property-based test must include a comment tag in this exact format:
```javascript
// Feature: haunted-vinyl-diary, Property {number}: {property_text}
```

**Implementation**: Each correctness property listed above must be implemented by a single property-based test.

Example property tests:
- **Property 1**: Generate random state transitions and verify background media continues
- **Property 2**: Generate random audio blobs and verify they're stored completely
- **Property 17**: Generate random sets of entries, save them, reload, and verify all data matches

### Integration Testing

- Test complete user flows from recording to playback
- Test application initialization and state restoration
- Test interaction between services (recording → transcription → song generation)

### Manual Testing

- Cross-browser compatibility testing (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing
- Audio quality verification
- Visual aesthetic verification (fonts, animations, styling)

## Implementation Notes

### Web Speech API for Transcription

The application will use the browser's built-in Web Speech API for speech-to-text transcription:

```javascript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = false;
```

**Fallback**: If Web Speech API is not supported, store entries without transcription and display a message.

### Song Generation API

For generating scary songs from transcribed text, the application will use free APIs:

**Option 1**: Use a text-to-speech API with scary voice effects
- **API**: ResponsiveVoice (free tier) or Web Speech Synthesis API
- **Process**: Transform lyrics → Apply creepy voice settings → Generate audio

**Option 2**: Use AI text generation for lyrics only
- **API**: Free tier of Hugging Face Inference API
- **Model**: GPT-2 or similar for generating disturbing lyrics
- **Audio**: Use Web Audio API to add effects to original recording

### Local Storage Strategy

**Storage Format**: JSON-serialized VoiceEntry objects stored as array
**Key**: `hauntedVinylDiary_entries`
**Size Management**: Monitor storage usage and warn at 80% capacity

**Audio Encoding**: Convert audio Blobs to Base64 strings for storage
```javascript
const reader = new FileReader();
reader.readAsDataURL(audioBlob);
// Store resulting base64 string
```

### CSS Animations

**Vinyl Spinning**: Use CSS keyframe animation
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

**Scary Text Effects**: Use text-shadow, color transitions, and subtle animations

### Font Loading

Load Kirang Haerang font from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Kirang+Haerang&display=swap" rel="stylesheet">
```

**Fallback Stack**: `'Kirang Haerang', 'Creepster', 'Nosifer', cursive, serif`

## File Structure

```
haunted-vinyl-diary/
├── index.html              # Main HTML file
├── css/
│   ├── main.css           # Main styles
│   ├── intro.css          # Intro screen styles
│   ├── recording.css      # Recording interface styles
│   ├── log.css            # Log interface styles
│   └── vinyl.css          # Vinyl spinning styles
├── js/
│   ├── app.js             # Application controller
│   ├── ui-manager.js      # UI management
│   ├── media-manager.js   # Media playback
│   ├── recording-service.js    # Recording functionality
│   ├── transcription-service.js # Speech-to-text
│   ├── song-service.js    # Song generation
│   ├── storage-service.js # Local storage operations
│   └── utils.js           # Utility functions
├── assets/
│   ├── intro.mp4
│   ├── loop.mp4
│   ├── bg1.mp3
│   ├── start.png
│   ├── next.png
│   ├── nxt.png
│   └── log.png
└── tests/
    ├── unit/
    │   ├── app.test.js
    │   ├── ui-manager.test.js
    │   ├── recording-service.test.js
    │   ├── storage-service.test.js
    │   └── ...
    └── property/
        ├── storage-properties.test.js
        ├── media-properties.test.js
        └── entry-properties.test.js
```

## Security Considerations

- **Microphone Access**: Request permissions only when needed, explain why
- **Local Storage**: Warn users that data is stored locally and not encrypted
- **XSS Prevention**: Sanitize any user-generated content before display
- **API Keys**: If using external APIs, implement key rotation and rate limiting
- **Content Security Policy**: Implement CSP headers to prevent injection attacks

## Performance Considerations

- **Lazy Loading**: Load assets only when needed
- **Audio Compression**: Use compressed audio formats (MP3, AAC) to reduce storage
- **Debouncing**: Debounce rapid user interactions to prevent duplicate operations
- **Memory Management**: Clean up audio blobs and media elements when not in use
- **Storage Monitoring**: Regularly check storage usage and clean up old entries if needed

## Accessibility Considerations

- **Keyboard Navigation**: Ensure all buttons are keyboard accessible
- **Screen Reader Support**: Add ARIA labels to interactive elements
- **Visual Feedback**: Provide clear visual indicators for recording state
- **Error Messages**: Make error messages clear and actionable
- **Alternative Input**: Consider text input as alternative to voice recording

## Future Enhancements

- **Gamification**: Implement unlock system for vinyl skins, backgrounds, and filters
- **Export**: Allow users to export recordings or share them
- **Cloud Sync**: Optional cloud backup of recordings
- **Advanced Effects**: More audio filters and voice transformation options
- **Social Features**: Share scary songs with other users
- **Themes**: Multiple visual themes beyond the default haunted aesthetic
