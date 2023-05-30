import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDve9Uu5F2L7Ma337flOid2fSsUNkkauqo",
  authDomain: "rubricatres.firebaseapp.com",
  projectId: "rubricatres",
  storageBucket: "rubricatres.appspot.com",
  messagingSenderId: "327244427232",
  appId: "1:327244427232:web:0a24bfb83ec5f7a8a40585"
  };
  
  // Initialize Firebase
  app.initializeApp(firebaseConfig);

  const db=app.firestore()
  const auth=app.auth()

  export{db,auth}