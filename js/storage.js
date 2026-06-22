// js/storage.js

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
    var data = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    return data ? JSON.parse(data) : [];
}

function saveClaims(claims) {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
}

function getSources() {
    var data = localStorage.getItem(STORAGE_KEYS.SOURCES);
    return data ? JSON.parse(data) : [];
}

function saveSources(sources) {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
}

function getComments() {
    var data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return data ? JSON.parse(data) : [];
}

function saveComments(comments) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
}

function saveClaimToStorage(claimData) {
    var claims = getClaims();
    var newClaim = {
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
    var claims = getClaims();
    return claims.find(function(claim) { return claim.id === id; });
}

function updateClaim(id, updates) {
    var claims = getClaims();
    var index = claims.findIndex(function(claim) { return claim.id === id; });
    if (index !== -1) {
        claims[index] = { ...claims[index], ...updates, updatedAt: new Date().toISOString() };
        saveClaims(claims);
        return claims[index];
    }
    return null;
}

function deleteClaim(id) {
    var claims = getClaims();
    var filtered = claims.filter(function(claim) { return claim.id !== id; });
    saveClaims(filtered);
    
    var sources = getSources();
    var filteredSources = sources.filter(function(source) { return source.claimId !== id; });
    saveSources(filteredSources);
    
    var comments = getComments();
    var filteredComments = comments.filter(function(comment) { return comment.claimId !== id; });
    saveComments(filteredComments);
}

function getSourcesForClaim(claimId) {
    var sources = getSources();
    return sources.filter(function(source) { return source.claimId === claimId; });
}

function saveSourceToStorage(claimId, sourceData) {
    var sources = getSources();
    var newSource = {
        id: Date.now().toString() + '_source',
        claimId: claimId,
        link: sourceData.link || sourceData,
        count: '0',
        count2: '0',
        createdAt: new Date().toISOString()
    };
    sources.push(newSource);
    saveSources(sources);
    return newSource;
}

function updateSource(id, updates) {
    var sources = getSources();
    var index = sources.findIndex(function(source) { return source.id === id; });
    if (index !== -1) {
        sources[index] = { ...sources[index], ...updates };
        saveSources(sources);
        return sources[index];
    }
    return null;
}

function getCommentsForSource(sourceId) {
    var comments = getComments();
    return comments.filter(function(comment) { return comment.sourceId === sourceId; });
}

function addComment(claimId, sourceId, text) {
    var comments = getComments();
    var newComment = {
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
    var comments = getComments();
    var filtered = comments.filter(function(comment) { return comment.id !== id; });
    saveComments(filtered);
}

function searchClaims(query) {
    var claims = getClaims();
    if (!query) return claims;
    var q = query.toLowerCase();
    return claims.filter(function(claim) {
        var claimMatch = claim.claim && claim.claim.toLowerCase().indexOf(q) !== -1;
        var textMatch = claim.text && claim.text.toLowerCase().indexOf(q) !== -1;
        var sourceMatch = claim.source && claim.source.toLowerCase().indexOf(q) !== -1;
        return claimMatch || textMatch || sourceMatch;
    });
}

initStorage();

window.getClaims = getClaims;
window.getClaimById = getClaimById;
window.saveClaimToStorage = saveClaimToStorage;
window.updateClaim = updateClaim;
window.deleteClaim = deleteClaim;
window.getSourcesForClaim = getSourcesForClaim;
window.saveSourceToStorage = saveSourceToStorage;
window.updateSource = updateSource;
window.getCommentsForSource = getCommentsForSource;
window.addComment = addComment;
window.deleteComment = deleteComment;
window.searchClaims = searchClaims;