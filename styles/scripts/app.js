// app.js - Enhanced Version

// Constants
const TOAST_DURATION = 3000; // 3 seconds
const SEARCH_DEBOUNCE_TIME = 300; // 300ms

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        initApp();
    } catch (error) {
        console.error('Application initialization failed:', error);
        showToast('App failed to initialize', 'error');
    }
});

function initApp() {
    applySavedTheme();
    loadAndRenderClips();
    setupEventListeners();
    showToast('QuickNotes ready!', 'success');
}

// Core Functions
function loadAndRenderClips() {
    try {
        const clips = loadClips();
        renderClips(clips);
    } catch (error) {
        console.error('Error loading clips:', error);
        showToast('Error loading clips', 'error');
    }
}

function setupEventListeners() {
    try {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, SEARCH_DEBOUNCE_TIME));
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Export/Import functionality
        document.getElementById('exportBtn')?.addEventListener('click', exportClips);
        document.getElementById('importBtn')?.addEventListener('click', triggerImport);
        document.getElementById('importInput')?.addEventListener('change', handleFileImport);

        // Clipboard monitoring
        document.addEventListener('copy', handleClipboardCopy);
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
        showToast('Error setting up controls', 'error');
    }
}

// Event Handlers
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const clips = loadClips();
    
    const filteredClips = clips.filter(clip => {
        const contentMatch = clip.content.toLowerCase().includes(searchTerm);
        const tagsMatch = clip.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ?? false;
        return contentMatch || tagsMatch;
    });
    
    renderClips(filteredClips);
}

function triggerImport() {
    const importInput = document.getElementById('importInput');
    if (importInput) {
        importInput.value = ''; // Reset to allow re-importing same file
        importInput.click();
    }
}

function handleFileImport(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            showToast('Please select a JSON file', 'warning');
            return;
        }

        importClips(event);
    } catch (error) {
        console.error('Error handling file import:', error);
        showToast('Import failed', 'error');
    }
}

function toggleTheme() {
    try {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
            themeBtn.setAttribute('aria-pressed', isDarkMode);
        }
        
        localStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
        showToast(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`, 'success');
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

function applySavedTheme() {
    try {
        const savedTheme = localStorage.getItem('themePreference');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const themeBtn = document.getElementById('themeToggle');
            if (themeBtn) {
                themeBtn.textContent = 'Light Mode';
                themeBtn.setAttribute('aria-pressed', 'true');
            }
        }
    } catch (error) {
        console.error('Error applying saved theme:', error);
    }
}

function handleClipboardCopy(event) {
    try {
        const clipboardData = event.clipboardData || window.clipboardData;
        const copiedText = clipboardData.getData('text/plain').trim();
        
        if (copiedText.length > 0) {
            // Check for duplicates before adding
            const existingClips = loadClips();
            const isDuplicate = existingClips.some(clip => clip.content === copiedText);
            
            if (!isDuplicate) {
                addClip(copiedText);
                showToast('Clip saved!', 'success');
                loadAndRenderClips();
            } else {
                showToast('Clip already exists', 'info');
            }
        }
    } catch (error) {
        console.error('Error handling clipboard copy:', error);
    }
}

// UI Functions
function showToast(message, type = 'success') {
    try {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(toast);
        
        // Animation handling
        requestAnimationFrame(() => {
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, TOAST_DURATION);
        });
    } catch (error) {
        console.error('Error showing toast:', error);
        // Fallback to alert if toast system fails
        alert(message);
    }
}