# Requirements Document

## Introduction

The Haunted Vinyl Diary is a gamified memory-recording web application that transforms voice recordings into a vintage vinyl record experience with a dark, haunting aesthetic. Users record their memories as voice entries, which are stored as tracks on a virtual vinyl record. The application features progression mechanics where users unlock new visual themes, audio filters, and vinyl skins as they continue recording. The experience is enhanced with looping background visuals, eerie music, and AI-generated scary song transformations of user entries.

## Glossary

- **Vinyl Diary System**: The web application that manages voice recordings, visual presentation, and gamification features
- **Voice Entry**: A single audio recording made by the user representing a memory or diary entry
- **Track**: A stored voice entry that appears as a track on the virtual vinyl record
- **Log Interface**: The display showing all previously recorded voice entries
- **Progression System**: The gamification mechanism that unlocks rewards based on user activity
- **Scary Song Transformation**: The AI-powered conversion of transcribed voice entries into disturbing song lyrics with audio
- **Vinyl Skin**: A visual theme or appearance for the virtual vinyl record
- **Audio Filter**: A sound effect or processing applied to recordings or playback

## Requirements

### Requirement 1

**User Story:** As a user, I want to see an immersive intro sequence when I first visit the website, so that I am drawn into the haunted vinyl experience.

#### Acceptance Criteria

1. WHEN the user first loads the website THEN the Vinyl Diary System SHALL play the intro video from assets/intro.mp4
2. WHEN the intro video completes playback THEN the Vinyl Diary System SHALL transition to the main interface
3. WHEN the intro video is playing THEN the Vinyl Diary System SHALL prevent user interaction until the video completes
4. WHEN the intro video fails to load THEN the Vinyl Diary System SHALL skip to the main interface after a timeout period

### Requirement 2

**User Story:** As a user, I want continuous atmospheric visuals and audio throughout my experience, so that the haunted ambiance is maintained.

#### Acceptance Criteria

1. WHEN the main interface loads THEN the Vinyl Diary System SHALL play the loop video from assets/loop.mp4 continuously in the background
2. WHEN the main interface loads THEN the Vinyl Diary System SHALL play the background music from assets/bg1.mp3 continuously
3. WHEN the loop video reaches its end THEN the Vinyl Diary System SHALL restart the video seamlessly
4. WHEN the background music reaches its end THEN the Vinyl Diary System SHALL restart the music seamlessly
5. WHEN the user navigates between different sections THEN the Vinyl Diary System SHALL maintain the looping video and audio without interruption

### Requirement 3

**User Story:** As a user, I want to access primary navigation controls from the main interface, so that I can start recording, view my log, or explore additional content.

#### Acceptance Criteria

1. WHEN the main interface displays THEN the Vinyl Diary System SHALL show the start button from assets/start.png positioned at the bottom center of the screen
2. WHEN the main interface displays THEN the Vinyl Diary System SHALL show the next button from assets/next.png positioned at the bottom right of the screen
3. WHEN the main interface displays THEN the Vinyl Diary System SHALL show the log button from assets/log.png positioned on the screen
4. WHEN the user hovers over any navigation button THEN the Vinyl Diary System SHALL provide visual feedback indicating interactivity
5. WHEN navigation buttons are displayed THEN the Vinyl Diary System SHALL ensure they remain visible and accessible regardless of screen size

### Requirement 4

**User Story:** As a user, I want to record my voice memories with haunting feedback, so that the experience feels immersive and thematic.

#### Acceptance Criteria

1. WHEN the user clicks the start button THEN the Vinyl Diary System SHALL display the text "life recording start" in Kirang Haerang font with a scary visual style
2. WHEN the recording starts THEN the Vinyl Diary System SHALL begin capturing audio from the user's microphone
3. WHEN the user stops the recording THEN the Vinyl Diary System SHALL display a scary phrase in Kirang Haerang font
4. WHEN the recording stops THEN the Vinyl Diary System SHALL save the audio recording as a new voice entry
5. WHEN the user denies microphone access THEN the Vinyl Diary System SHALL display an error message and prevent recording

### Requirement 5

**User Story:** As a user, I want my voice recordings to be transcribed and transformed into scary songs, so that my memories become part of the haunted experience.

#### Acceptance Criteria

1. WHEN a voice entry is saved THEN the Vinyl Diary System SHALL transcribe the audio into text
2. WHEN transcription completes THEN the Vinyl Diary System SHALL store the text alongside the original audio
3. WHEN text is stored THEN the Vinyl Diary System SHALL convert the transcribed text into disturbing song lyrics
4. WHEN song lyrics are generated THEN the Vinyl Diary System SHALL create an audio version of the scary song
5. WHEN the scary song is created THEN the Vinyl Diary System SHALL associate it with the original voice entry

### Requirement 6

**User Story:** As a user, I want to view all my previous recordings in a log, so that I can revisit my memories and see my collection grow.

#### Acceptance Criteria

1. WHEN the user clicks the log button THEN the Vinyl Diary System SHALL display the log interface showing all previous voice entries
2. WHEN the log interface displays THEN the Vinyl Diary System SHALL show each entry with its recording date and time
3. WHEN the log interface displays THEN the Vinyl Diary System SHALL provide playback controls for each voice entry
4. WHEN the log interface displays THEN the Vinyl Diary System SHALL provide access to the transcribed text for each entry
5. WHEN the log interface displays THEN the Vinyl Diary System SHALL provide access to the scary song version for each entry
6. WHEN the user selects a voice entry in the log THEN the Vinyl Diary System SHALL allow playback of the original recording or the scary song version

### Requirement 7

**User Story:** As a user, I want to explore additional haunting content through the next button, so that the experience extends beyond just recording.

#### Acceptance Criteria

1. WHEN the user clicks the next button THEN the Vinyl Diary System SHALL navigate to a new interface displaying the vinyl spinning animation from assets/nxt.png
2. WHEN the vinyl spinning interface loads THEN the Vinyl Diary System SHALL play scary and depressing music from available sources
3. WHEN the vinyl spinning interface loads THEN the Vinyl Diary System SHALL fetch and display haunting content from free APIs
4. WHEN the vinyl is displayed THEN the Vinyl Diary System SHALL animate it to spin continuously
5. WHEN the user is on the vinyl spinning interface THEN the Vinyl Diary System SHALL maintain the background loop video and audio

### Requirement 8

**User Story:** As a user, I want my recordings and progress to be saved locally, so that I can return to my haunted diary without losing my memories.

#### Acceptance Criteria

1. WHEN a voice entry is created THEN the Vinyl Diary System SHALL store the audio data in browser local storage
2. WHEN transcription completes THEN the Vinyl Diary System SHALL store the text in browser local storage
3. WHEN a scary song is generated THEN the Vinyl Diary System SHALL store the song data in browser local storage
4. WHEN the user returns to the website THEN the Vinyl Diary System SHALL load all previously saved voice entries from local storage
5. WHEN local storage is full THEN the Vinyl Diary System SHALL notify the user and prevent new recordings until space is available

### Requirement 9

**User Story:** As a user, I want the interface to use the Kirang Haerang font for scary messages, so that the visual style matches the haunted theme.

#### Acceptance Criteria

1. WHEN the Vinyl Diary System displays scary messages THEN the Vinyl Diary System SHALL render text using the Kirang Haerang font
2. WHEN the Kirang Haerang font is unavailable THEN the Vinyl Diary System SHALL fall back to a similar gothic or horror-themed font
3. WHEN scary text is displayed THEN the Vinyl Diary System SHALL apply visual styling that enhances the eerie atmosphere
4. WHEN the recording start message appears THEN the Vinyl Diary System SHALL use Kirang Haerang font
5. WHEN the recording stop message appears THEN the Vinyl Diary System SHALL use Kirang Haerang font

### Requirement 10

**User Story:** As a developer, I want the application to be built using standard web technologies, so that it is accessible and maintainable.

#### Acceptance Criteria

1. WHEN the application is implemented THEN the Vinyl Diary System SHALL use HTML for structure
2. WHEN the application is implemented THEN the Vinyl Diary System SHALL use CSS for styling and visual effects
3. WHEN the application is implemented THEN the Vinyl Diary System SHALL use JavaScript for interactivity and logic
4. WHEN the application requires external libraries THEN the Vinyl Diary System SHALL use only free and open-source libraries
5. WHEN the application is deployed THEN the Vinyl Diary System SHALL run in any modern web browser without requiring server-side processing for core features

### Requirement 11

**User Story:** As a user, I want the application to work smoothly across different browsers and devices, so that I can access my haunted diary anywhere.

#### Acceptance Criteria

1. WHEN the user accesses the website from any modern browser THEN the Vinyl Diary System SHALL display all interface elements correctly
2. WHEN the user accesses the website from a mobile device THEN the Vinyl Diary System SHALL adapt the layout for smaller screens
3. WHEN videos or audio fail to play due to browser restrictions THEN the Vinyl Diary System SHALL provide user controls to manually start playback
4. WHEN the user's device lacks microphone support THEN the Vinyl Diary System SHALL display an appropriate error message
5. WHEN the application encounters errors THEN the Vinyl Diary System SHALL handle them gracefully without crashing
