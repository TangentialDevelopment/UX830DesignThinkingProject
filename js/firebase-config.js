const firebaseConfig = {
    apiKey: "AIzaSyAMJjBfhlSZ3hZ25eZ-KuBg0P-yeIyt7a4",
    authDomain: "verifact-b125c.firebaseapp.com",
    projectId: "verifact-b125c",
    storageBucket: "verifact-b125c.firebasestorage.app",
    messagingSenderId: "334938218468",
    appId: "1:334938218468:web:8b4cf1ecfe631e3ff6f1f1
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Multiple tabs open, persistence enabled in first tab only');
        } else if (err.code == 'unimplemented') {
            console.warn('Browser doesn\'t support persistence');
        }
    });

window.db = db;