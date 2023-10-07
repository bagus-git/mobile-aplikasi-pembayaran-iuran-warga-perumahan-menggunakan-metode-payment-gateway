// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAN_a5-aHtazMPf357_uCbVAPWMGCRSNgg",
  authDomain: "iuran-gmj.firebaseapp.com",
  databaseURL: "https://iuran-gmj-default-rtdb.firebaseio.com",
  projectId: "iuran-gmj",
  storageBucket: "iuran-gmj.appspot.com",
  messagingSenderId: "419906515097",
  appId: "1:419906515097:web:7c75f0f136bd643bcc8808",
  measurementId: "G-DWDHTKPHDN",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
