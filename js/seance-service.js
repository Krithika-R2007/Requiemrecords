/**
 * SeanceService - Manages ghost summoning and encounters
 */
class SeanceService {
    constructor() {
        this.ghosts = [
            {
                id: 1,
                name: 'Watcher in the Hall',
                image: 'ghost1.png',
                probability: 'Common',
                dangerLevel: 3, // 1-10 scale
                history: 'In the suffocating silence of the midnight shift, a security guard\'s heart stopped beating... but his duty never ended. Now he patrols these halls in eternal damnation, his hollow footsteps echoing through dimensions. He sees you. He always sees you. The building remembers his final breath, and so does he. Every. Single. Night. His eyes, once human, now burn with the cold fire of the damned. He believes you\'re an intruder in his domain... and intruders must be dealt with.',
                greeting: 'Still on patrol... even in death. You shouldn\'t be here after hours.',
                historyPrompt: 'Do you want to know why I never left my post?',
                encounterTrigger: 'Appears when recording in dark or late at night',
                color: '#82FFF0'
            },
            {
                id: 2,
                name: 'The Hollow Bride',
                image: 'ghost2.png',
                probability: 'Uncommon',
                dangerLevel: 6,
                history: 'On what should have been the happiest night of her existence, she was found in her wedding dress, cold and lifeless, her lips sewn shut with black thread by hands unknown. The bouquet she clutched had wilted to ash, yet she refuses to let go. Her throat was cut before she could say "I do," and now she wanders the void between worlds, desperately searching for the voice that was stolen from her. The silence around her is deafening. She cannot scream. She cannot cry. She can only stare with eyes that have seen the abyss. Some say if you listen closely in the dead of night, you can hear the phantom sound of her trying to speak... a wet, gurgling whisper that never forms words.',
                greeting: '.....................', // Silent greeting
                historyPrompt: 'Will you speak the vows I never could?',
                encounterTrigger: 'Appears when the player records silence instead of words',
                color: '#82FFF0'
            },
            {
                id: 3,
                name: 'The Bone Lantern Child',
                image: 'ghost3.png',
                probability: 'Rare',
                dangerLevel: 4,
                history: 'A small boy, no older than seven, was left on a lighthouse rock during a storm. His father promised to return. He never did. For three days and three nights, the child held his lantern high, waving it desperately at every passing ship, his small voice screaming into the howling wind until his throat bled. The ships saw his light. They all saw it. But none came. On the fourth day, the waves claimed him, dragging his tiny body into the black depths. Now he rises from the water, his lantern made of his own bones, still glowing with the hope that someone—anyone—will finally come for him. But those who follow his light never return. The sea keeps them. Just like it kept him.',
                greeting: 'I can show you the way... but will you follow?',
                historyPrompt: 'Do you want to hear about the night the ships stopped coming?',
                encounterTrigger: 'When the player asks for "help" or "guidance"',
                color: '#82FFF0'
            },
            {
                id: 4,
                name: 'The Doppel-Skin',
                image: 'ghost4.png',
                probability: 'Very Rare',
                dangerLevel: 9,
                history: 'It was human once. A person with a name, a face, a life. But something went wrong during a forbidden ritual—an attempt to cheat death by stealing another\'s identity. The spell worked... too well. Now it exists as a parasitic entity that peels away the faces and souls of the living, wearing them like masks. It looks exactly like you. It knows your memories. It mimics your voice perfectly. But the smile... the smile is always wrong. Too wide. Too many teeth. Eyes that don\'t blink at the right moments. It has worn hundreds of faces, and each one screams silently from within its hollow form. When you see it, you\'re looking at your own future. Because soon, very soon, it will shed your face too... and move on to the next victim. The worst part? No one will know you\'re gone. They\'ll think the thing wearing your skin IS you.',
                greeting: 'I know you... because I AM you. Or will be soon.',
                historyPrompt: 'Want to know whose face I wore before yours?',
                encounterTrigger: 'Shows up when the story repeats the player\'s own words',
                color: '#82FFF0'
            },
            {
                id: 5,
                name: 'The Red-Eyed Scribe',
                image: 'ghost5.png',
                probability: 'Uncommon',
                dangerLevel: 7,
                history: 'He was a scholar who believed that knowledge was power—that if he could document every fear, every nightmare, every terror that plagued humanity, he could control them all. So he began carving. First on parchment. Then on walls. Then on his own flesh. Every inch of his skin became a canvas for the darkest secrets of the human psyche. He carved until there was no unmarked flesh left. Until his eyes bled red from the strain. Until his mind shattered under the weight of infinite horror. But he didn\'t stop. Even in death, he continues his work. And now, fresh scars appear on his corpse-like body, forming words in languages that shouldn\'t exist. Your name is there. Freshly carved. Still bleeding. He knows your fears before you do. He\'s already written your ending.',
                greeting: 'Your name... it\'s already written on me. How curious.',
                historyPrompt: 'Shall I read you the chapter about YOUR fears?',
                encounterTrigger: 'Appears when the player deletes an audio entry',
                color: '#82FFF0'
            },
            {
                id: 6,
                name: 'The Mourning Cellist',
                image: 'ghost6.png',
                probability: 'Rare',
                dangerLevel: 5,
                history: 'She played at every funeral in town for forty years. Her cello sang the sorrow of widows, the grief of parents, the loneliness of the forgotten. She poured her soul into every note, giving the dead the beautiful farewell they deserved. But when her time came, when her heart finally gave out in her small, cold apartment, no one came. No flowers. No mourners. No music. They buried her in silence, in an unmarked grave, as if she had never existed. Now she wanders with her cello, its bow carved from her own femur, its strings made from the tendons of her hands. The music she plays is wrong—discordant, maddening, beautiful in its horror. It changes based on who listens. If you\'re sad, it will make you weep blood. If you\'re afraid, it will make you scream. And if you\'re happy... it will remind you that all joy ends in the grave.',
                greeting: 'Every life deserves a requiem... even yours.',
                historyPrompt: 'Would you like to hear the song no one played for me?',
                encounterTrigger: 'When the player plays vinyl tracks repeatedly',
                color: '#82FFF0'
            },
            {
                id: 7,
                name: 'The Whisper Collector',
                image: 'ghost7.png',
                probability: 'Uncommon',
                dangerLevel: 8,
                history: 'She was an oracle, gifted with the ability to hear the thoughts of others. But the gift became a curse. The voices never stopped. Thousands of whispers, millions of secrets, an endless cacophony of human consciousness flooding her mind every waking moment. She went mad trying to silence them. So she found a way to harvest them instead—to pull the voices from people\'s throats and trap them in chains that hang from her skeletal frame. Each chain holds a soul, a memory, a final whisper. She collects them obsessively, hungrily, desperately. The chains rattle with the screams of the stolen. And now she\'s listening to you. Your thoughts. Your secrets. Your voice. She wants to add you to her collection. To hang your whispers alongside the others. Forever. Screaming. Unheard.',
                greeting: 'Shhh... I\'m listening to all the voices I\'ve collected. Yours will join them.',
                historyPrompt: 'Want to hear the last words of those who whispered to me?',
                encounterTrigger: 'When the player whispers instead of speaks',
                color: '#82FFF0'
            },
            {
                id: 8,
                name: 'The Clock-Eater',
                image: 'ghost8.png',
                probability: 'Very Rare',
                dangerLevel: 10,
                history: 'He had one perfect moment. One single, beautiful instant where everything was right. His wife smiled. His children laughed. The sun was warm. He wanted to live in that moment forever. So he made a deal with forces beyond comprehension, performing a ritual to freeze time itself. It worked. But not the way he wanted. Instead of preserving that moment, he became trapped in it—forced to watch it decay, rot, and twist into a nightmare. His family\'s smiles became screams. The sun turned black. And he... he began to hunger. To consume. Every second that passes near him is devoured, pulled into the void where his soul used to be. Clocks stop. Time skips. Reality fractures. He is the end of all moments, the death of all memories. And he\'s so, so hungry. Your time... he can taste it. And it tastes like regret.',
                greeting: 'Time... it tastes like regret. And you have so much of it.',
                historyPrompt: 'Do you want to know which moment I\'m stuck in?',
                encounterTrigger: 'If the player pauses mid-recording too long',
                color: '#82FFF0'
            },
            {
                id: 9,
                name: 'The Curtain of Names',
                image: 'ghost9.png',
                probability: 'Rare',
                dangerLevel: 6,
                history: 'It began as a sacred ritual—a way to honor the dead by writing their names on a ceremonial veil, ensuring they would never be forgotten. For generations, it worked. The names of the departed were lovingly inscribed, and their spirits found peace. But something changed. The veil began writing names on its own. Names of people who were still alive. At first, it was dismissed as a mistake. Until those people started dying. One by one. Exactly as the veil predicted. Now the curtain flutters in an impossible wind, covered in thousands upon thousands of names—some faded, some fresh, some still being written by invisible hands. Your name is there. Glowing. Pulsing. Waiting. The veil knows when you will die. It\'s already mourning you.',
                greeting: 'Your name... it\'s already here. How strange.',
                historyPrompt: 'Would you like to see whose names appeared before yours?',
                encounterTrigger: 'After reading too many past story logs',
                color: '#82FFF0'
            },
            {
                id: 10,
                name: 'The Crying Nurse',
                image: 'ghost10.png',
                probability: 'Common',
                dangerLevel: 4,
                history: 'She was a good nurse. Dedicated. Caring. She loved her patients like family. But one night, during a chaotic emergency, she made a mistake. A small mistake. A wrong dosage. A missed symptom. And the patient she cared about most—the one who reminded her of her own father—died in her arms. She tried to save him. She tried so hard. But it wasn\'t enough. The guilt consumed her. She couldn\'t eat. Couldn\'t sleep. Couldn\'t forgive herself. Eventually, she took her own life in the same hospital room where he died. Now she\'s trapped in that moment, reliving it over and over, desperately trying to rewrite fate. But no matter how many times she tries, he always dies. And she always fails. Her tears never stop. Her hands are forever stained with his blood. And she asks everyone she meets the same question: "Who did you fail to save?"',
                greeting: 'I tried to save them... I really did. Who did you fail to save?',
                historyPrompt: 'Do you want to know what it feels like to lose someone forever?',
                encounterTrigger: 'When the player expresses sadness',
                color: '#82FFF0'
            },
            {
                id: 11,
                name: 'The Forgotten Grandmother',
                image: 'ghost11.png',
                probability: 'Common',
                dangerLevel: 2,
                history: 'She raised three children. Loved them with every fiber of her being. Sacrificed everything for their happiness. But as she grew old, as her mind began to fade and her body grew frail, they stopped visiting. First it was once a month. Then once a year. Then... never. She died alone in a cold nursing home room, calling out names that no one answered. The nurses found her three days later, still clutching a knitted blanket she\'d made for a grandchild who never came. Now she wanders, humming lullabies to the empty air, knitting phantom blankets for children who will never wrap themselves in her love. She\'s harmless, really. She just wants company. She just wants someone to sit with her. To remember her. To prove that she existed. That she mattered. Please... don\'t leave her alone again.',
                greeting: 'Oh dear... you look so lonely. I\'ll sit with you. I won\'t leave.',
                historyPrompt: 'Would you like to hear about the day everyone stopped visiting?',
                encounterTrigger: 'If the player says "alone"',
                color: '#82FFF0'
            }
        ];

        this.currentGhost = null;
        this.idleTimer = null;
        this.idleWarningShown = false;
        this.heartbeatAudio = null;
        this.ghostMusicAudio = null;
        this.recentGhosts = []; // Track recently summoned ghosts to avoid repetition
        this.maxRecentGhosts = 3; // Remember last 3 ghosts
    }

    /**
     * Summon a random ghost based on probability weights
     * Avoids repeating recently summoned ghosts for better variety
     * @returns {Object} Selected ghost
     */
    summonGhost() {
        // Probability weights
        const weights = {
            'Common': 40,
            'Uncommon': 25,
            'Rare': 20,
            'Very Rare': 15
        };

        // Create weighted array, excluding recently summoned ghosts
        const weightedGhosts = [];
        this.ghosts.forEach(ghost => {
            // Skip if this ghost was recently summoned (unless all ghosts are recent)
            const isRecent = this.recentGhosts.includes(ghost.id);
            const allGhostsRecent = this.recentGhosts.length >= this.ghosts.length - 1;
            
            if (!isRecent || allGhostsRecent) {
                const weight = weights[ghost.probability] || 10;
                // Reduce weight for recent ghosts if we have to include them
                const adjustedWeight = (isRecent && allGhostsRecent) ? Math.max(1, Math.floor(weight / 4)) : weight;
                
                for (let i = 0; i < adjustedWeight; i++) {
                    weightedGhosts.push(ghost);
                }
            }
        });

        // Select random ghost
        const randomIndex = Math.floor(Math.random() * weightedGhosts.length);
        this.currentGhost = weightedGhosts[randomIndex];
        
        // Track this ghost as recently summoned
        this.recentGhosts.push(this.currentGhost.id);
        if (this.recentGhosts.length > this.maxRecentGhosts) {
            this.recentGhosts.shift(); // Remove oldest
        }
        
        console.log(`Summoned: ${this.currentGhost.name} (${this.currentGhost.probability})`);
        console.log(`Recent ghosts: ${this.recentGhosts.join(', ')}`);
        
        return this.currentGhost;
    }

    /**
     * Get danger level description
     * @param {number} level - Danger level (1-10)
     * @returns {string} Danger description
     */
    getDangerDescription(level) {
        if (level <= 2) return 'Harmless';
        if (level <= 4) return 'Unsettling';
        if (level <= 6) return 'Dangerous';
        if (level <= 8) return 'Extremely Dangerous';
        return 'LETHAL';
    }

    /**
     * Get danger color
     * @param {number} level - Danger level (1-10)
     * @returns {string} Color hex code
     */
    getDangerColor(level) {
        if (level <= 2) return '#4CAF50'; // Green
        if (level <= 4) return '#FFC107'; // Yellow
        if (level <= 6) return '#FF9800'; // Orange
        if (level <= 8) return '#F44336'; // Red
        return '#8B0000'; // Dark red
    }

    /**
     * Start heartbeat sound for high danger encounters
     * @param {number} dangerLevel - Ghost danger level
     */
    startHeartbeat(dangerLevel) {
        // Stop any existing heartbeat
        this.stopHeartbeat();
        
        if (dangerLevel >= 5) {
            // Use actual heartbeat audio file
            this.heartbeatAudio = new Audio('assets/hb.mp3');
            this.heartbeatAudio.loop = true;
            
            // Adjust volume and playback rate based on danger level
            // Danger 5-6: Slow, quiet heartbeat
            // Danger 7-8: Faster, louder heartbeat
            // Danger 9-10: Very fast, loud heartbeat
            if (dangerLevel <= 6) {
                this.heartbeatAudio.volume = 0.3;
                this.heartbeatAudio.playbackRate = 0.8; // Slower
            } else if (dangerLevel <= 8) {
                this.heartbeatAudio.volume = 0.5;
                this.heartbeatAudio.playbackRate = 1.0; // Normal speed
            } else {
                this.heartbeatAudio.volume = 0.7;
                this.heartbeatAudio.playbackRate = 1.3; // Faster, more intense
            }
            
            // Play heartbeat
            this.heartbeatAudio.play().catch(err => {
                console.error('Failed to play heartbeat:', err);
            });
            
            console.log(`Heartbeat started for danger level ${dangerLevel}`);
        }
        
        // Add black vignette effect based on danger level
        this.applyVignetteEffect(dangerLevel);
    }

    /**
     * Stop heartbeat sound
     */
    stopHeartbeat() {
        if (this.heartbeatAudio) {
            this.heartbeatAudio.pause();
            this.heartbeatAudio.currentTime = 0;
            this.heartbeatAudio = null;
        }
        
        // Remove vignette effect
        this.removeVignetteEffect();
    }
    
    /**
     * Apply black vignette effect based on danger level
     * @param {number} dangerLevel - Ghost danger level
     */
    applyVignetteEffect(dangerLevel) {
        const encounterContainer = document.getElementById('ghost-encounter-container');
        if (!encounterContainer) return;
        
        // Remove existing vignette classes
        encounterContainer.classList.remove('vignette-low', 'vignette-medium', 'vignette-high', 'vignette-extreme');
        
        // Apply vignette based on danger level
        if (dangerLevel <= 3) {
            // No vignette for low danger
        } else if (dangerLevel <= 5) {
            encounterContainer.classList.add('vignette-low');
        } else if (dangerLevel <= 7) {
            encounterContainer.classList.add('vignette-medium');
        } else if (dangerLevel <= 9) {
            encounterContainer.classList.add('vignette-high');
        } else {
            encounterContainer.classList.add('vignette-extreme');
        }
        
        console.log(`Vignette applied for danger level ${dangerLevel}`);
    }
    
    /**
     * Remove vignette effect
     */
    removeVignetteEffect() {
        const encounterContainer = document.getElementById('ghost-encounter-container');
        if (encounterContainer) {
            encounterContainer.classList.remove('vignette-low', 'vignette-medium', 'vignette-high', 'vignette-extreme');
        }
    }

    /**
     * Create scary ambient music for ghost encounter
     * @param {number} ghostId - Ghost ID for unique sound
     */
    createGhostMusic(ghostId) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create different eerie tones based on ghost ID
        const frequencies = [110, 146.83, 164.81, 196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392];
        const baseFreq = frequencies[ghostId - 1] || 220;
        
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.frequency.value = baseFreq;
        oscillator2.frequency.value = baseFreq * 1.5; // Dissonant harmony
        
        oscillator1.type = 'sine';
        oscillator2.type = 'triangle';
        
        gainNode.gain.value = 0.1; // Subtle background
        
        oscillator1.start();
        oscillator2.start();
        
        return { audioContext, oscillator1, oscillator2, gainNode };
    }

    /**
     * Stop ghost music
     */
    stopGhostMusic() {
        if (this.ghostMusicAudio) {
            try {
                this.ghostMusicAudio.oscillator1.stop();
                this.ghostMusicAudio.oscillator2.stop();
                this.ghostMusicAudio.audioContext.close();
            } catch (e) {
                console.error('Error stopping ghost music:', e);
            }
            this.ghostMusicAudio = null;
        }
    }

    /**
     * Start idle timer for séance room
     * @param {Function} callback - Function to call when idle
     */
    startIdleTimer(callback) {
        this.stopIdleTimer();
        
        // After 30 seconds of idle, trigger scary effects
        this.idleTimer = setTimeout(() => {
            if (!this.idleWarningShown) {
                callback();
                this.idleWarningShown = true;
            }
        }, 30000);
    }

    /**
     * Stop idle timer
     */
    stopIdleTimer() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
        this.idleWarningShown = false;
    }

    /**
     * Reset service state
     */
    reset() {
        this.stopHeartbeat();
        this.stopGhostMusic();
        this.stopIdleTimer();
        this.currentGhost = null;
    }
}
