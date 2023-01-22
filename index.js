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

//grid location elements
const meredith = document.getElementById("pMeredith");
const meredithSouth = document.getElementById("pMeredithSouth");
const windsor = document.getElementById("pWindsor");
const cary = document.getElementById("pCary");
const mccutcheon = document.getElementById("pMccutcheon");
const tarkington = document.getElementById("pTarkington");
const wiley = document.getElementById("pWiley");
const earheart = document.getElementById("pEarheart");
const towers = document.getElementById("ptowers");
const freida = document.getElementById("pFreida");
const winifred = document.getElementById("pWinifred");
const harrison = document.getElementById("pHarrison");
const hawkins = document.getElementById("pHawkins");
const hillenbrand = document.getElementById("pHillenbrand");
const honors = document.getElementById("pHonors");
const owen = document.getElementById("pOwen");
const shreve = document.getElementById("pShreve");



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
  
  //link testing
  console.log('open');
  document.getElementById('link').onclick = function () {
    console.log('link clicked');
  };
  
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
meredith.onclick = async () => {
  
  // Get a reference to the user's document in the userData collection
  const userRef = doc(db, 'userData', auth.currentUser.uid);
  
  // If they RSVP'd yes, save a document with attending: true
  try{
    await setDoc(userRef, {
      lastClick: "Meredith",
      time: Date.now()
    });
  }catch (e){
    console.error(e);
  }
};
}
main();
