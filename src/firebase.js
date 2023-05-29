import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCFXq1B5tipr93qS3bAF7Sv4X8pKEPscNM",
    authDomain: "login-bafd5.firebaseapp.com",
    projectId: "login-bafd5",
    storageBucket: "login-bafd5.appspot.com",
    messagingSenderId: "74733482299",
    appId: "1:74733482299:web:30a18d8db161c9d232c71e"
  };
  
  // Initialize Firebase
  app.initializeApp(firebaseConfig);

  const db=app.firestore()
  const auth=app.auth()

  export{db,auth}