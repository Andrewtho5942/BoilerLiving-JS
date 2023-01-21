// Import statements
import './style.css';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
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

const form = document.getElementById('send-message');
const input = document.getElementById('message');
const chat = document.getElementById('chat');
const startButton = document.getElementById('signIn');

let chatListener = null;

const disabledLink = '#';
const abledLink = 'https://js-kddsga.stackblitz.io';

async function main() {
  console.log('main');
  // Firebase config
  const firebaseConfig = {
    apiKey: 'AIzaSyC05K7n9cStnFrTQ06AOpQt7cAHyLZOf3Q',

    authDomain: 'boilerliving.firebaseapp.com',

    projectId: 'boilerliving',

    storageBucket: 'boilerliving.appspot.com',

    messagingSenderId: '1020361690137',

    appId: '1:1020361690137:web:75d2525326961bd9c22e88',

    measurementId: 'G-CT32RLKFEJ',
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

  //link testing
  console.log('open');
  document.getElementById('link').onclick = function () {
    console.log('link clicked');
  };

  startButton.addEventListener('click', () => {
    if (auth.currentUser) {
      //user is signed in -> allows user to sign out
      signOut(auth);
    } else {
      //no user is signed in -> allows user to sign in
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });

  var images = document.getElementsByClassName('locImg');
  onAuthStateChanged(auth, (user) => {
    if (user) {
      startButton.textContent = 'LOGOUT';
      console.log('logged in');
      images = document.getElementsByClassName('locImg');
      [].forEach.call(images, function (image) {
        console.log(abledLink);
        image.href = abledLink;
      });
      //Subscribe to chat collection
      subscribeChat();
    } else {
      startButton.textContent = 'Sign In To Chat';
      images = document.getElementsByClassName('locImg');
      [].forEach.call(images, function (image) {
        image.href = disabledLink;
      });
    }
  });

  // Listen to the form submission
  form.addEventListener('submit', async (e) => {
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "guestbook"
    addDoc(collection(db, 'chat'), {
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

  function getTime(timestamp) {
    //timestamp should be int
    var jsTime = new Date(timestamp);
    var hours = '' + jsTime.getHours();
    hours = hours.padStart(2, '0');
    var minutes = '' + jsTime.getMinutes();
    minutes = minutes.padStart(2, '0');
    var seconds = '' + jsTime.getSeconds();
    seconds = seconds.padStart(2, '0');
    return '' + hours + ':' + minutes + ':' + seconds;
  }

  function subscribeChat() {
    // Create query for messages
    const q = query(collection(db, 'chat'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snaps) => {
      // Reset page
      chat.innerHTML = '';
      // Loop through documents in database
      snaps.forEach((doc) => {
        // Create an HTML entry for each document and add it to the chat
        const entry = document.createElement('p');
        entry.textContent =
          getTime(doc.data().timestamp) +
          ' ' +
          doc.data().name +
          ': ' +
          doc.data().text;
        chat.appendChild(entry);
      });
    });
  }
}
main();
