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

let locPage = "blank";

const form = document.getElementById('send-message');
const input = document.getElementById('message');
const chat = document.getElementById('chat');
const startButton = document.getElementById('signIn');
const test = document.getElementById('test');


//grid location elements
const meredith = document.getElementById("pmeredith");
const meredithSouth = document.getElementById("pmeredithSouth");
const windsor = document.getElementById("pwindsor");
const cary = document.getElementById("pcary");
const mccutcheon = document.getElementById("pmccutcheon");
const tarkington = document.getElementById("ptarkington");
const wiley = document.getElementById("pwiley");
const earheart = document.getElementById("pearheart");
const towers = document.getElementById("ptowers");
const freida = document.getElementById("pfreida");
const winifred = document.getElementById("pwinifred");
const harrison = document.getElementById("pharrison");
const hawkins = document.getElementById("phawkins");
const hillenbrand = document.getElementById("phillenbrand");
const honors = document.getElementById("phonors");
const owen = document.getElementById("powen");
const shreve = document.getElementById("pshreve");



const disabledLink = '#';
const abledLink = 'https://js-kddsga.stackblitz.io';

let chatListener = null;

async function main() {
  // Firebase config
  const firebaseConfig = {

    apiKey: "AIzaSyAPk7O__mtzcAuI74ZXvlkHaCoLB-TSkzA",
  
    authDomain: "boilerlivingx.firebaseapp.com",
  
    projectId: "boilerlivingx",
  
    storageBucket: "boilerlivingx.appspot.com",
  
    messagingSenderId: "952766726355",
  
    appId: "1:952766726355:web:de37c13c620855cc349426",
  
    measurementId: "G-6HKFCTNRL7"
  
  };

  
  
  initializeApp(firebaseConfig);
  auth = getAuth();
  db = getFirestore();
  console.log(auth);
  
 
  
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
  
  



  startButton.addEventListener('click', () => {
    console.log("clicked!");
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

//listen to clicks on any location in the grid
meredith.addEventListener('click', () => {
  console.log("meredith was clicked!");
  locPage="meredith";
  test.style.display='block';

});
cary.addEventListener('click', () => {
  console.log("cary was clicked!");
  locPage="cary";
  test.style.display='block';
  
});

}
main();
