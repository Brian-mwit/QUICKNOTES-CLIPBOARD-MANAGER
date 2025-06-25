function renderClips(clips) {
    const clipList = document.getElementById('clipboardList');
    clipList.innerHTML = '';
    
    if (clips.length === 0) {
        clipList.innerHTML = '<p>No clips found. Copy something to get started!</p>';
        return;
    }
    
    clips.forEach(clip => {
        const clipElement = document.createElement('div');
        clipElement.className = 'clip-card';
        
        const contentElement = document.createElement('div');
        contentElement.textContent = clip.content;
        
        const metaElement = document.createElement('div');
        metaElement.className = 'clip-meta';
        metaElement.innerHTML = `
            <span>${formatDate(clip.timestamp)}</span>
            <button class="delete-btn" data-id="${clip.id}">Delete</button>
        `;
        
        clipElement.appendChild(contentElement);
        clipElement.appendChild(metaElement);
        clipList.appendChild(clipElement);
    });

    // Add delete event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const clipId = parseInt(e.target.dataset.id);
            const updatedClips = deleteClip(clipId);
            renderClips(updatedClips);
        });
    });
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleString();
}