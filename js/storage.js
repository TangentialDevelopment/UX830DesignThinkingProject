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
        claim: claimData.claim || claimData.text,
        text: claimData.text || claimData.claim,
        source: claimData.source || '',
        reliabilityScore: '0',
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    claims.unshift(newClaim);
    saveClaims(claims);
    return newClaim;
}

function getClaimById(id) {
    var claims = getClaims();
    for (var i = 0; i < claims.length; i++) {
        if (claims[i].id === id) {
            return claims[i];
        }
    }
    return null;
}

function updateClaim(id, updates) {
    var claims = getClaims();
    for (var i = 0; i < claims.length; i++) {
        if (claims[i].id === id) {
            if (updates.reliabilityScore !== undefined) {
                var score = parseInt(updates.reliabilityScore);
                if (score < 0) updates.reliabilityScore = '0';
                if (score > 1) updates.reliabilityScore = '1';
            }
            claims[i] = { ...claims[i], ...updates, updatedAt: new Date().toISOString() };
            saveClaims(claims);
            return claims[i];
        }
    }
    return null;
}

function deleteClaimFromStorage(id) {
    var claims = getClaims();
    var filtered = [];
    for (var i = 0; i < claims.length; i++) {
        if (claims[i].id !== id) {
            filtered.push(claims[i]);
        }
    }
    saveClaims(filtered);
    
    var sources = getSources();
    var filteredSources = [];
    for (var i = 0; i < sources.length; i++) {
        if (sources[i].claimId !== id) {
            filteredSources.push(sources[i]);
        }
    }
    saveSources(filteredSources);
    
    var comments = getComments();
    var filteredComments = [];
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].claimId !== id) {
            filteredComments.push(comments[i]);
        }
    }
    saveComments(filteredComments);
}

function getSourcesForClaim(claimId) {
    var sources = getSources();
    var result = [];
    for (var i = 0; i < sources.length; i++) {
        if (sources[i].claimId === claimId) {
            result.push(sources[i]);
        }
    }
    return result;
}

function saveSourceToStorage(claimId, sourceData) {
    var sources = getSources();
    var link = typeof sourceData === 'string' ? sourceData : (sourceData.link || '');
    var newSource = {
        id: Date.now().toString() + '_source',
        claimId: claimId,
        link: link,
        reliabilityScore: '0',
        comments: [],
        createdAt: new Date().toISOString()
    };
    sources.push(newSource);
    saveSources(sources);
    return newSource;
}

function updateSource(id, updates) {
    var sources = getSources();
    for (var i = 0; i < sources.length; i++) {
        if (sources[i].id === id) {
            if (updates.reliabilityScore !== undefined) {
                var score = parseInt(updates.reliabilityScore);
                if (score < 0) updates.reliabilityScore = '0';
                if (score > 1) updates.reliabilityScore = '1';
            }
            sources[i] = { ...sources[i], ...updates };
            saveSources(sources);
            return sources[i];
        }
    }
    return null;
}

function getCommentsForSource(sourceId) {
    var comments = getComments();
    var result = [];
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].sourceId === sourceId) {
            result.push(comments[i]);
        }
    }
    return result;
}

function addCommentToStorage(claimId, sourceId, text) {
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

function deleteCommentFromStorage(id) {
    var comments = getComments();
    var filtered = [];
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].id !== id) {
            filtered.push(comments[i]);
        }
    }
    saveComments(filtered);
}

function searchClaims(query) {
    var claims = getClaims();
    if (!query) return claims;
    var q = query.toLowerCase();
    var result = [];
    for (var i = 0; i < claims.length; i++) {
        var claim = claims[i];
        var claimMatch = claim.claim && claim.claim.toLowerCase().indexOf(q) !== -1;
        var textMatch = claim.text && claim.text.toLowerCase().indexOf(q) !== -1;
        var sourceMatch = claim.source && claim.source.toLowerCase().indexOf(q) !== -1;
        if (claimMatch || textMatch || sourceMatch) {
            result.push(claim);
        }
    }
    return result;
}

initStorage();

window.getClaims = getClaims;
window.getClaimById = getClaimById;
window.saveClaimToStorage = saveClaimToStorage;
window.updateClaim = updateClaim;
window.deleteClaimFromStorage = deleteClaimFromStorage;
window.getSourcesForClaim = getSourcesForClaim;
window.saveSourceToStorage = saveSourceToStorage;
window.updateSource = updateSource;
window.getCommentsForSource = getCommentsForSource;
window.addCommentToStorage = addCommentToStorage;
window.deleteCommentFromStorage = deleteCommentFromStorage;
window.searchClaims = searchClaims;