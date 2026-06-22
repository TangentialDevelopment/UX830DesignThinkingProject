const STORAGE_KEYS = {
    CLAIMS: 'verifact_claims',
    SOURCES: 'verifact_sources',
    COMMENTS: 'verifact_comments'
};

function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.CLAIMS)) {
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SOURCES)) {
        localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify([]));
    }
}

function getClaims() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIMS)) || [];
}

function saveClaims(claims) {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
}

function getSources() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SOURCES)) || [];
}

function saveSources(sources) {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
}

function getComments() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];
}

function saveComments(comments) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
}

function addClaim(claimData) {
    const claims = getClaims();
    const newClaim = {
        id: Date.now().toString(),
        ...claimData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    claims.unshift(newClaim);
    saveClaims(claims);
    return newClaim;
}

function getClaimById(id) {
    const claims = getClaims();
    return claims.find(claim => claim.id === id);
}

function updateClaim(id, updates) {
    const claims = getClaims();
    const index = claims.findIndex(claim => claim.id === id);
    if (index !== -1) {
        claims[index] = { ...claims[index], ...updates, updatedAt: new Date().toISOString() };
        saveClaims(claims);
        return claims[index];
    }
    return null;
}

function deleteClaim(id) {
    const claims = getClaims();
    const filtered = claims.filter(claim => claim.id !== id);
    saveClaims(filtered);

    const sources = getSources();
    const filteredSources = sources.filter(source => source.claimId !== id);
    saveSources(filteredSources);
    
    const comments = getComments();
    const filteredComments = comments.filter(comment => comment.claimId !== id);
    saveComments(filteredComments);
}

function getSourcesForClaim(claimId) {
    const sources = getSources();
    return sources.filter(source => source.claimId === claimId);
}

function addSource(claimId, sourceData) {
    const sources = getSources();
    const newSource = {
        id: Date.now().toString() + '_source',
        claimId: claimId,
        ...sourceData,
        count: '0',
        count2: '0',
        comments: [],
        createdAt: new Date().toISOString()
    };
    sources.push(newSource);
    saveSources(sources);
    return newSource;
}

function updateSource(id, updates) {
    const sources = getSources();
    const index = sources.findIndex(source => source.id === id);
    if (index !== -1) {
        sources[index] = { ...sources[index], ...updates };
        saveSources(sources);
        return sources[index];
    }
    return null;
}

function getCommentsForSource(sourceId) {
    const comments = getComments();
    return comments.filter(comment => comment.sourceId === sourceId);
}

function addComment(claimId, sourceId, text) {
    const comments = getComments();
    const newComment = {
        id: Date.now().toString() + '_comment',
        claimId: claimId,
        sourceId: sourceId,
        text: text,
        createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    saveComments(comments);
    return newComment;
}

function deleteComment(id) {
    const comments = getComments();
    const filtered = comments.filter(comment => comment.id !== id);
    saveComments(filtered);
}

function searchClaims(query) {
    const claims = getClaims();
    if (!query) return claims;
    const q = query.toLowerCase();
    return claims.filter(claim => {
        const claimMatch = claim.claim?.toLowerCase().includes(q) || false;
        const textMatch = claim.text?.toLowerCase().includes(q) || false;
        const sourceMatch = claim.source?.toLowerCase().includes(q) || false;
        return claimMatch || textMatch || sourceMatch;
    });
}

initStorage();

window.getClaims = getClaims;
window.getClaimById = getClaimById;
window.addClaim = addClaim;
window.updateClaim = updateClaim;
window.deleteClaim = deleteClaim;
window.getSourcesForClaim = getSourcesForClaim;
window.addSource = addSource;
window.updateSource = updateSource;
window.getCommentsForSource = getCommentsForSource;
window.addComment = addComment;
window.deleteComment = deleteComment;
window.searchClaims = searchClaims;