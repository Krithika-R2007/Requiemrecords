/**
 * StorageService - Manages persistent storage of voice entries
 */
class StorageService {
    constructor() {
        this.storageKey = 'hauntedVinylDiary_entries';
    }

    /**
     * Save a voice entry to local storage
     * @param {Object} entry - VoiceEntry object
     * @returns {boolean} Success status
     */
    saveEntry(entry) {
        try {
            // Validate entry before saving
            if (!this.validateEntry(entry)) {
                console.error('Attempted to save invalid entry:', entry);
                throw new Error('Invalid entry data');
            }
            
            const entries = this.getAllEntries();
            
            // Check if entry already exists (update instead of duplicate)
            const existingIndex = entries.findIndex(e => e.id === entry.id);
            if (existingIndex !== -1) {
                entries[existingIndex] = entry;
            } else {
                entries.push(entry);
            }
            
            // Attempt to save with optimized serialization
            try {
                const serialized = JSON.stringify(entries);
                localStorage.setItem(this.storageKey, serialized);
            } catch (storageError) {
                if (storageError.name === 'QuotaExceededError') {
                    console.error('Storage quota exceeded. Current usage:', this.getStorageUsage());
                    
                    // Attempt to free up space by removing oldest entries
                    if (entries.length > 1) {
                        console.log('Attempting to free space by removing oldest entry...');
                        entries.shift(); // Remove oldest entry
                        try {
                            localStorage.setItem(this.storageKey, JSON.stringify(entries));
                            console.log('Successfully freed space and saved entry');
                            return true;
                        } catch (retryError) {
                            throw new Error('Storage quota exceeded');
                        }
                    }
                    
                    throw new Error('Storage quota exceeded');
                }
                throw storageError;
            }
            
            return true;
        } catch (error) {
            console.error('Error saving entry:', error);
            throw error;
        }
    }

    /**
     * Get all voice entries from local storage
     * @returns {Array} Array of VoiceEntry objects
     */
    getAllEntries() {
        try {
            // Check if localStorage is available
            if (typeof localStorage === 'undefined') {
                console.error('localStorage is not available');
                throw new Error('Storage not available');
            }
            
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];
            
            let entries;
            try {
                entries = JSON.parse(data);
            } catch (parseError) {
                console.error('Failed to parse stored data - data may be corrupted:', parseError);
                // Attempt to backup corrupted data
                try {
                    localStorage.setItem(this.storageKey + '_corrupted_backup', data);
                    console.log('Corrupted data backed up');
                } catch (backupError) {
                    console.error('Failed to backup corrupted data:', backupError);
                }
                return [];
            }
            
            // Validate entries
            if (!Array.isArray(entries)) {
                console.error('Corrupted data: entries is not an array, got:', typeof entries);
                return [];
            }
            
            // Filter out invalid entries and log them
            const validEntries = [];
            const invalidEntries = [];
            
            entries.forEach(entry => {
                if (this.validateEntry(entry)) {
                    validEntries.push(entry);
                } else {
                    invalidEntries.push(entry);
                }
            });
            
            if (invalidEntries.length > 0) {
                console.warn(`Found ${invalidEntries.length} invalid entries that were filtered out`);
            }
            
            return validEntries;
        } catch (error) {
            console.error('Error loading entries:', error);
            throw error;
        }
    }

    /**
     * Validate a voice entry object
     * @param {Object} entry - Entry to validate
     * @returns {boolean} True if valid
     */
    validateEntry(entry) {
        if (!entry || typeof entry !== 'object') {
            console.warn('Invalid entry: not an object');
            return false;
        }
        
        const requiredFields = ['id', 'timestamp', 'audioData', 'audioDuration', 'dateFormatted'];
        for (const field of requiredFields) {
            if (!(field in entry)) {
                console.warn(`Invalid entry: missing field ${field}`);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Get a single entry by ID
     * @param {string} id - Entry ID
     * @returns {Object|null} VoiceEntry object or null
     */
    getEntry(id) {
        const entries = this.getAllEntries();
        return entries.find(entry => entry.id === id) || null;
    }

    /**
     * Update an existing entry
     * @param {string} id - Entry ID
     * @param {Object} updates - Fields to update
     * @returns {boolean} Success status
     */
    updateEntry(id, updates) {
        try {
            const entries = this.getAllEntries();
            const index = entries.findIndex(entry => entry.id === id);
            
            if (index === -1) {
                console.error('Entry not found for update:', id);
                throw new Error('Entry not found');
            }
            
            // Merge updates into existing entry
            const updatedEntry = { ...entries[index], ...updates };
            
            // Validate updated entry
            if (!this.validateEntry(updatedEntry)) {
                console.error('Update would create invalid entry:', updatedEntry);
                throw new Error('Invalid entry data after update');
            }
            
            entries[index] = updatedEntry;
            
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(entries));
            } catch (storageError) {
                if (storageError.name === 'QuotaExceededError') {
                    console.error('Storage quota exceeded during update');
                    throw new Error('Storage quota exceeded');
                }
                throw storageError;
            }
            
            return true;
        } catch (error) {
            console.error('Error updating entry:', error);
            throw error;
        }
    }

    /**
     * Delete an entry by ID
     * @param {string} id - Entry ID
     * @returns {boolean} Success status
     */
    deleteEntry(id) {
        try {
            const entries = this.getAllEntries();
            const filtered = entries.filter(entry => entry.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting entry:', error);
            return false;
        }
    }

    /**
     * Get storage usage information
     * @returns {Object} Storage usage stats
     */
    getStorageUsage() {
        try {
            const data = localStorage.getItem(this.storageKey) || '';
            const used = new Blob([data]).size;
            const total = 5 * 1024 * 1024; // Approximate 5MB limit
            return {
                used,
                total,
                percentage: (used / total) * 100
            };
        } catch (error) {
            console.error('Error calculating storage usage:', error);
            return { used: 0, total: 0, percentage: 0 };
        }
    }

    /**
     * Clear all entries
     * @returns {boolean} Success status
     */
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
}
