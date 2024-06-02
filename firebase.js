// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDNQjNLMeJoeOBuhHpYmWAOmxPoXCm0mzg",
    authDomain: "resumeforger-4e81f.firebaseapp.com",
    projectId: "resumeforger-4e81f",
    storageBucket: "resumeforger-4e81f.appspot.com",
    messagingSenderId: "667211157120",
    appId: "1:667211157120:web:75366b1eb808cb95372065",
    measurementId: "G-07QKF47FK0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);