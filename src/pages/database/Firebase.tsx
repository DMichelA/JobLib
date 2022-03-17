
import  firebase from 'firebase/compat/app';
const firebaseConfig = {
    apiKey: "AIzaSyDF-XFTCrdgZnPMnTDfwiygd13bwdwEnJg",
    authDomain: "joblib.firebaseapp.com",
    databaseURL: "https://joblib-default-rtdb.firebaseio.com",
    projectId: "joblib",
    storageBucket: "joblib.appspot.com",
    messagingSenderId: "146361808800",
    appId: "1:146361808800:web:a6151c291333c847f3d6c5"
};
firebase.initializeApp(firebaseConfig);

export default firebase;
