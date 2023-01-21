// Import statements
import './style.css';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  EmailAuthProvider
} from 'firebase/auth';

import {
  getFirestore,
  addDoc,
  collection,
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  where,
} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

let db, auth;

const form = document.getElementById('leave-message');
const input = document.getElementById('message');

async function main(){

    // Firebase config
  const firebaseConfig = {

    apiKey: "AIzaSyC05K7n9cStnFrTQ06AOpQt7cAHyLZOf3Q",
  
    authDomain: "boilerliving.firebaseapp.com",
  
    projectId: "boilerliving",
  
    storageBucket: "boilerliving.appspot.com",
  
    messagingSenderId: "1020361690137",
  
    appId: "1:1020361690137:web:75d2525326961bd9c22e88",
  
    measurementId: "G-CT32RLKFEJ"
  
  };

  initializeApp(firebaseConfig);
  auth = getAuth();
  db = getFirestore();

// Firebase UI Config

const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // Handle sign-in.
      // Return false to avoid redirect.
      return false;
    },
  },
};
const ui = new firebaseui.auth.AuthUI(auth);

ui.start("#firebaseui-auth-container", uiConfig);

// Listen to the form submission
form.addEventListener('submit', async (e) => {
  // Prevent the default form redirect
  e.preventDefault();
  // Write a new message to the database collection "guestbook"
  addDoc(collection(db, 'guestbook'), {
    text: input.value,
    timestamp: Date.now(),
    name: auth.currentUser.displayName,
    userId: auth.currentUser.uid,
  });
  // clear message input field
  input.value = '';
  // Return false to avoid redirect
  return false;
});
}
main();