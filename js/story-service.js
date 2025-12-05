/**
 * StoryGenerationService - Generates scary gothic stories from voice recordings
 */
class StoryGenerationService {
    constructor() {
        this.usedCombinations = new Set(); // Track used combinations to avoid repetition
        
        this.locations = [
            "the depths of a forgotten manor, where shadows dance with malevolent intent",
            "beneath the pale moonlight, in a graveyard long abandoned",
            "within the crumbling walls of an ancient cathedral",
            "deep in the mist-shrouded forest, where no light dares to tread",
            "in the bowels of a decrepit asylum, where madness reigns supreme",
            "the ruins of a Victorian mansion, consumed by creeping ivy and decay",
            "a lighthouse on a desolate shore, where the fog never lifts",
            "the catacombs beneath a forgotten city, where bones whisper secrets",
            "an abandoned opera house, where phantom melodies still echo",
            "the attic of a cursed estate, filled with portraits that watch",
            "a decrepit carnival ground, where rusted rides creak in the wind",
            "the depths of a coal mine, sealed after an unspeakable tragedy",
            "a monastery on a windswept cliff, abandoned by God himself",
            "the basement of a Victorian hospital, where experiments went wrong",
            "a bridge over black water, where the drowned call out to the living"
        ];
        
        this.themes = [
            { name: 'haunted', adjectives: ['spectral', 'ghostly', 'ethereal', 'phantom'] },
            { name: 'cursed', adjectives: ['hexed', 'doomed', 'blighted', 'accursed'] },
            { name: 'possessed', adjectives: ['corrupted', 'tainted', 'defiled', 'profaned'] },
            { name: 'undead', adjectives: ['risen', 'reanimated', 'deathless', 'unliving'] },
            { name: 'demonic', adjectives: ['infernal', 'hellish', 'diabolical', 'fiendish'] },
            { name: 'insane', adjectives: ['maddened', 'deranged', 'unhinged', 'fractured'] },
            { name: 'lost', adjectives: ['wandering', 'forsaken', 'abandoned', 'forgotten'] },
            { name: 'twisted', adjectives: ['warped', 'distorted', 'perverted', 'malformed'] }
        ];
        
        this.storyStyles = [
            'diary_entry', 'confession', 'warning', 'last_words', 'ritual', 
            'prophecy', 'testimony', 'curse', 'plea', 'revelation'
        ];
    }

    /**
     * Generate a scary gothic story from transcription
     * @param {string} transcription - Voice recording transcription
     * @returns {Promise<string>} Generated scary story
     */
    async generateScaryStory(transcription) {
        try {
            console.log('Generating scary story from:', transcription);
            
            // Get unique combination
            const { location, theme, style } = this.getUniqueCombination();
            
            // Extract meaningful content from transcription
            const analysis = this.analyzeTranscription(transcription);
            
            // Generate story based on style
            const story = this.weaveStory(location, theme, style, analysis, transcription);
            
            console.log('Story generated successfully');
            return story;
            
        } catch (error) {
            console.error('Error generating story:', error);
            return this.generateFallbackStory();
        }
    }
    
    /**
     * Get a unique combination of location, theme, and style
     * @returns {Object} Unique combination
     */
    getUniqueCombination() {
        let attempts = 0;
        let combination;
        
        do {
            const location = this.locations[Math.floor(Math.random() * this.locations.length)];
            const theme = this.themes[Math.floor(Math.random() * this.themes.length)];
            const style = this.storyStyles[Math.floor(Math.random() * this.storyStyles.length)];
            
            combination = `${location}-${theme.name}-${style}`;
            attempts++;
            
            // Reset if we've used all combinations
            if (attempts > 50) {
                this.usedCombinations.clear();
            }
        } while (this.usedCombinations.has(combination) && attempts < 100);
        
        this.usedCombinations.add(combination);
        
        return {
            location: this.locations[Math.floor(Math.random() * this.locations.length)],
            theme: this.themes[Math.floor(Math.random() * this.themes.length)],
            style: this.storyStyles[Math.floor(Math.random() * this.storyStyles.length)]
        };
    }
    
    /**
     * Analyze transcription for key elements
     * @param {string} transcription - Voice transcription
     * @returns {Object} Analysis results
     */
    analyzeTranscription(transcription) {
        const words = transcription.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        
        // Extract different types of words
        const emotionalWords = words.filter(w => 
            ['fear', 'scared', 'afraid', 'terror', 'dread', 'worry', 'anxious', 
             'happy', 'sad', 'angry', 'love', 'hate', 'hope', 'despair'].includes(w)
        );
        
        const actionWords = words.filter(w => 
            ['run', 'hide', 'escape', 'find', 'search', 'follow', 'chase', 
             'watch', 'listen', 'hear', 'see', 'feel', 'touch'].includes(w)
        );
        
        // Get key phrases (3-5 word chunks)
        const phrases = [];
        for (let i = 0; i < Math.min(3, words.length - 2); i += Math.floor(words.length / 3) || 1) {
            phrases.push(words.slice(i, i + 4).join(' '));
        }
        
        return {
            keyWords: words.slice(0, 8),
            emotionalWords,
            actionWords,
            phrases,
            length: transcription.length,
            wordCount: words.length
        };
    }

    /**
     * Weave a gothic horror story
     * @param {string} location - Story location
     * @param {Object} theme - Story theme
     * @param {string} style - Story style
     * @param {Object} analysis - Transcription analysis
     * @param {string} originalText - Original transcription
     * @returns {string} Complete story
     */
    weaveStory(location, theme, style, analysis, originalText) {
        const adjective = theme.adjectives[Math.floor(Math.random() * theme.adjectives.length)];
        
        // Transform the user's speech into a spooky narrative
        const transformedStory = this.transformIntoHorror(originalText, location, theme, adjective, style);
        
        return transformedStory;
    }
    
    /**
     * Transform user's actual speech into a horror story
     * @param {string} text - Original transcription
     * @param {string} location - Story location
     * @param {Object} theme - Story theme
     * @param {string} adjective - Theme adjective
     * @param {string} style - Story style
     * @returns {string} Transformed horror story
     */
    transformIntoHorror(text, location, theme, adjective, style) {
        // Split into sentences
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        // Get story structure based on style
        const structure = this.getStoryStructure(style, location);
        
        // Transform each sentence with horror elements
        const transformedSentences = sentences.map((sentence, index) => {
            return this.addHorrorTwist(sentence.trim(), theme, adjective, index, sentences.length);
        });
        
        // Build the complete story
        let story = `${structure.opening}\n\n`;
        
        // Add the transformed narrative
        story += transformedSentences.join(' ');
        
        // Add atmospheric conclusion
        story += `\n\n${this.generateAtmosphericEnding(theme, adjective, style)}`;
        
        return story;
    }
    
    /**
     * Get story structure based on style
     * @param {string} style - Story style
     * @param {string} location - Story location
     * @returns {Object} Story structure
     */
    getStoryStructure(style, location) {
        const structures = {
            diary_entry: {
                opening: `Diary Entry - Date Unknown\n\nFound in ${location}...`
            },
            confession: {
                opening: `A confession, recorded in ${location}:`
            },
            warning: {
                opening: `WARNING: This account was discovered in ${location}. Read at your own peril.`
            },
            last_words: {
                opening: `The final testimony, spoken in ${location}:`
            },
            ritual: {
                opening: `The ritual words, chanted in ${location}:`
            },
            prophecy: {
                opening: `A dark prophecy, foretold in ${location}:`
            },
            testimony: {
                opening: `Testimony recovered from ${location}:`
            },
            curse: {
                opening: `A curse, uttered in ${location}:`
            },
            plea: {
                opening: `A desperate plea, echoing from ${location}:`
            },
            revelation: {
                opening: `A terrible revelation, unveiled in ${location}:`
            }
        };
        
        return structures[style] || structures.diary_entry;
    }
    
    /**
     * Add horror twist to a sentence
     * @param {string} sentence - Original sentence
     * @param {Object} theme - Story theme
     * @param {string} adjective - Theme adjective
     * @param {number} index - Sentence index
     * @param {number} total - Total sentences
     * @returns {string} Transformed sentence
     */
    addHorrorTwist(sentence, theme, adjective, index, total) {
        const horrorPrefixes = [
            `In the ${adjective} darkness, `,
            `As the ${theme.name} presence grew stronger, `,
            `With a voice trembling with dread, `,
            `Through the veil of shadows, `,
            `In that cursed moment, `,
            `As reality began to fracture, `,
            `With ${adjective} certainty, `,
            `In the grip of terror, `,
            `As the ${theme.name} entity watched, `,
            `Through ${adjective} whispers, `
        ];
        
        const horrorSuffixes = [
            ` ...but something was listening.`,
            ` ...and the darkness answered.`,
            ` ...though it was already too late.`,
            ` ...awakening what should have stayed dormant.`,
            ` ...sealing a fate worse than death.`,
            ` ...and the ${theme.name} realm took notice.`,
            ` ...binding the soul to eternal torment.`,
            ` ...as the ${adjective} truth revealed itself.`,
            ` ...and reality itself began to unravel.`,
            ` ...summoning forces beyond comprehension.`
        ];
        
        // First sentence gets a prefix
        if (index === 0) {
            const prefix = horrorPrefixes[Math.floor(Math.random() * horrorPrefixes.length)];
            return prefix + sentence.charAt(0).toLowerCase() + sentence.slice(1);
        }
        
        // Last sentence gets a suffix
        if (index === total - 1) {
            const suffix = horrorSuffixes[Math.floor(Math.random() * horrorSuffixes.length)];
            return sentence + suffix;
        }
        
        // Middle sentences occasionally get atmospheric additions
        if (Math.random() > 0.6) {
            const transitions = [
                `The ${adjective} air grew cold as `,
                `With each word, the ${theme.name} presence strengthened, and `,
                `The shadows deepened, and `,
                `In the suffocating silence that followed, `,
                `As the ${theme.name} entity drew closer, `
            ];
            const transition = transitions[Math.floor(Math.random() * transitions.length)];
            return transition + sentence.charAt(0).toLowerCase() + sentence.slice(1);
        }
        
        return sentence;
    }
    
    /**
     * Generate atmospheric ending
     * @param {Object} theme - Story theme
     * @param {string} adjective - Theme adjective
     * @param {string} style - Story style
     * @returns {string} Atmospheric ending
     */
    generateAtmosphericEnding(theme, adjective, style) {
        const endings = [
            `The recording ended there. But the ${adjective} presence it awakened... that never ends. The ${theme.name} entity has claimed another soul, another voice for its eternal collection.`,
            
            `These were the last coherent words before the transformation. Now, only the ${adjective} echoes remain, trapped forever in the ${theme.name} realm between sound and silence.`,
            
            `The vinyl preserved these words, but at what cost? Every playback spreads the ${adjective} corruption further. The ${theme.name} curse lives on, waiting for the next listener.`,
            
            `And so the tale was told, the words were spoken, the fate was sealed. The ${theme.name} darkness has what it wanted. The ${adjective} price has been paid in full.`,
            
            `The voice faded into static, but the ${adjective} truth remained: some words should never be spoken, some stories never told. The ${theme.name} realm remembers everything.`,
            
            `This account ends here, but the horror continues. The ${adjective} presence grows stronger with each telling, the ${theme.name} entity more powerful with each voice it claims.`,
            
            `The recording device fell silent. But in the ${adjective} void that followed, something stirred. The ${theme.name} forces had been listening all along, and now they would never let go.`,
            
            `These words are all that remain. The speaker? Lost to the ${adjective} abyss. The ${theme.name} realm claims all who dare to record their truth in this cursed place.`
        ];
        
        return endings[Math.floor(Math.random() * endings.length)];
    }



    /**
     * Generate fallback story when transcription fails
     * @returns {string} Fallback story
     */
    generateFallbackStory() {
        return `In the depths of eternal darkness, a voice cried out—but the words were lost to the void.\n\nThe vinyl spun, capturing only silence. Yet within that silence, something stirred. Something ancient. Something hungry.\n\nThe recording device trembled as it tried to preserve what could not be preserved. The voice had been consumed by the darkness before it could be heard, transformed into something no longer human.\n\nNow, when the vinyl plays, only whispers remain. Whispers of what was said, what was meant, what was lost. The diary entry exists in a state between sound and silence, forever trapped in the liminal space where nightmares are born.\n\nAnd so the haunted vinyl diary claims another victim, another voice swallowed by the abyss. The record spins on, waiting for the next soul brave—or foolish—enough to speak into the darkness.`;
    }
}
