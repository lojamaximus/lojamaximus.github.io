const firebaseConfig = {
  apiKey: "AIzaSyBpJ4-aOeZKW4xFLfH0WrbY_w_C1Fsu4TY",
  authDomain: "financeiro-db0b6.firebaseapp.com",
  projectId: "financeiro-db0b6",
  storageBucket: "financeiro-db0b6.appspot.com",
  messagingSenderId: "676018037418",
  appId: "1:676018037418:web:9deaed1f5ee35cb75966d3"
};

var didNotInitialize = true;

if (didNotInitialize) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    didNotInitialize = false;
}