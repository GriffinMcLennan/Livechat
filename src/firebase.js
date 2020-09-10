import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCZ1YpUyI-UyZu4Zam_u7v4xW11MUApbz8",
    authDomain: "livechat-ae0fb.firebaseapp.com",
    databaseURL: "https://livechat-ae0fb.firebaseio.com",
    projectId: "livechat-ae0fb",
    storageBucket: "livechat-ae0fb.appspot.com",
    messagingSenderId: "234418973666",
    appId: "1:234418973666:web:f90add015133bfa664e7bb",
    measurementId: "G-PF23G4L6M6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;