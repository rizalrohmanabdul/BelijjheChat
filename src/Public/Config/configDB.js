import Firebase from 'firebase';

let config = {
    apiKey: "AIzaSyBrl9g0c113XKhK9BeTpwq8uvTHF6FBAmE",
    authDomain: "sibelijje.firebaseapp.com",
    databaseURL: "https://sibelijje.firebaseio.com",
    projectId: "sibelijje",
    storageBucket: "",
    messagingSenderId: "630974383765",
    appId: "1:630974383765:web:03c82eb6d6cabe53"
}

let app = Firebase.initializeApp(config);

export const Database = app.database();
export const Auth = app.auth();