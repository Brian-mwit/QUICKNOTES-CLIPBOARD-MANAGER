// storage.js - Complete Fixed Version

/**
 * Load clips from localStorage
 * @returns {Array} Array of clip objects
 */
function loadClips() {
    try {
        const clipsJSON = localStorage.getItem('quicknotes-clips');
        console.debug("[Storage] Loading clips from localStorage:", clipsJSON);
        return clipsJSON ? JSON.parse(clipsJSON) : [];
    } catch (error) {
        console.error("[Storage] Error loading clips:", error);
        return [];
    }
}

/**
 * Save clips to localStorage
 * @param {Array} clips - Array of clip objects to save
 */
function saveClips(clips) {
    try {
        console.debug("[Storage] Saving clips:", clips);
        localStorage.setItem('quicknotes-clips', JSON.stringify(clips));
    } catch (error) {
        console.error("[Storage] Error saving clips:", error);
        alert("Error saving clips: " + error.message);
    }
}

/**
 * Export clips as a JSON file
 */
function exportClips() {
    console.debug("[Export] Starting export process");
    
    try {
        const clips = loadClips();
        console.debug("[Export] Clips to export:", clips);

        if (!clips || clips.length === 0) {
            console.warn("[Export] No clips available to export");
            alert("No clips available to export!");
            return;
        }

        // Prepare download data
        const dataStr = JSON.stringify(clips, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);
        const fileName = `quicknotes-export-${new Date().toISOString().slice(0,10)}.json`;

        // Create and trigger download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        console.debug("[Export] Triggering download...");
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(dataUrl);
            console.debug("[Export] Export completed successfully");
        }, 100);

    } catch (error) {
        console.error("[Export] Export failed:", error);
        alert("Export failed: " + error.message);
    }
}

/**
 * Import clips from a JSON file
 * @param {Event} event - File input change event
 */
function importClips(event) {
    console.debug("[Import] Starting import process");
    
    const file = event.target.files[0];
    if (!file) {
        console.debug("[Import] No file selected");
        return;
    }

    // Verify file type
    if (!file.name.endsWith('.json')) {
        alert("Please select a JSON file");
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            console.debug("[Import] File content loaded");
            const importedData = JSON.parse(e.target.result);

            // Validate imported data
            if (!Array.isArray(importedData)) {
                throw new Error("Invalid file format: Expected an array of clips");
            }

            // Process imported clips
            const currentClips = loadClips();
            const newClips = importedData.map(clip => ({
                ...clip,
                // Ensure imported clips have required fields
                id: clip.id || Date.now() + Math.random().toString(36).substr(2, 9),
                timestamp: clip.timestamp || new Date().toISOString()
            }));

            // Merge and save
            const mergedClips = [...newClips, ...currentClips];
            saveClips(mergedClips);
            renderClips(mergedClips);
            
            console.debug("[Import] Successfully imported", newClips.length, "clips");
            alert(`Successfully imported ${newClips.length} clip(s)`);

        } catch (error) {
            console.error("[Import] Error processing file:", error);
            alert("Import failed: " + error.message);
        } finally {
            event.target.value = ''; // Reset input
        }
    };

    reader.onerror = function() {
        console.error("[Import] File reading error");
        alert("Error reading file. Please try again.");
        event.target.value = '';
    };

    console.debug("[Import] Reading file...");
    reader.readAsText(file);
}

// Utility function to add a new clip
function addClip(content, tags = []) {
    const newClip = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        content: content,
        tags: tags,
        isFavorite: false,
        timestamp: new Date().toISOString()
    };
    
    const clips = loadClips();
    clips.unshift(newClip);
    saveClips(clips);
    
    return newClip;
}