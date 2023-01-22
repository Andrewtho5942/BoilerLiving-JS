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

let locPage = 'blank';

const form = document.getElementById('send-message');
const input = document.getElementById('message');
const chat = document.getElementById('chat');
const comments = document.getElementById('comments');
const startButton = document.getElementById('signIn');
const bottom = document.getElementById('bottom');

//grid location elements
const meredith = document.getElementById('pmeredith');
const meredithsouth = document.getElementById('pmeredithsouth');
const windsor = document.getElementById('pwindsor');
const cary = document.getElementById('pcary');
const mccutcheon = document.getElementById('pmccutcheon');
const tarkington = document.getElementById('ptarkington');
const wiley = document.getElementById('pwiley');
const earhart = document.getElementById('pearhart');
const towers = document.getElementById('ptowers');
const freida = document.getElementById('pfreida');
const winifred = document.getElementById('pwinifred');
const harrison = document.getElementById('pharrison');
const hawkins = document.getElementById('phawkins');
const hillenbrand = document.getElementById('phillenbrand');
const honors = document.getElementById('phonors');
const owen = document.getElementById('powen');
const shreve = document.getElementById('pshreve');

const disabledLink = '#';
const abledLink = '';

let chatListener = null;

async function main() {
  // Firebase config
  const firebaseConfig = {
    apiKey: 'AIzaSyAPk7O__mtzcAuI74ZXvlkHaCoLB-TSkzA',

    authDomain: 'boilerlivingx.firebaseapp.com',

    projectId: 'boilerlivingx',

    storageBucket: 'boilerlivingx.appspot.com',

    messagingSenderId: '952766726355',

    appId: '1:952766726355:web:de37c13c620855cc349426',

    measurementId: 'G-6HKFCTNRL7',
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

  bottom.style.display = 'none';

  startButton.addEventListener('click', () => {
    console.log('clicked!');
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
      images = document.getElementsByClassName('locImg');
      [].forEach.call(images, function (image) {
        image.href = disabledLink;
      });
      //Subscribe to chat collection
      subscribeChat();
    } else {
      startButton.textContent = 'Sign In To Chat';
      images = document.getElementsByClassName('locImg');
      [].forEach.call(images, function (image) {
        image.href = abledLink;
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

  //subscribe to comment updates for a location
  function subscribeComments(location) {
    // Create query for messages
    const q = query(
      collection(db, 'locationData', location, 'reviews'),
      orderBy('timestamp', 'desc')
    );
    onSnapshot(q, (snaps) => {
      // Reset page
      comments.innerHTML = '';
      // Loop through documents in database
      snaps.forEach((doc) => {
        // Create an HTML entry for each document and add it to the chat
        const entry = document.createElement('p');
        const entry2 = document.createElement('q');
        //first line
        entry.textContent =
          getTime(doc.data().timestamp) +
          '  --  ' +
          doc.data().name +
          ': Community:  ' +
          doc.data().communityScore +
          '/5, Location: ' +
          doc.data().locationScore +
          '/5, ' +
          'Quality: ' +
          doc.data().qualityScore +
          '/5, Amenities: ' +
          doc.data().amenitiesScore;
        comments.appendChild(entry);

        entry2.textContent = doc.data().reviewMessage;
        comments.append(entry2);
      });
    });
  }

  var toRate;
  //value from 0-5
  //nameIDs:
  //"net-rating"
  //"location-rating"
  //"quality-rating"
  //"amenities-rating"
  //"communtity-rating"
  function setRating(value, nameID) {
    toRate = document.getElementById(nameID);
    value = value.toFixed(2);
    toRate.innerHTML = '' + value + '/5';
  }
  var imageImage;
  var locationTitle;
  //listen to clicks on any location in the grid
  meredith.addEventListener('click', () => {
    locPage = 'meredith';
    bottom.style.display = 'block';
    subscribeComments('meredith');
    locationTitle = document.getElementById('location-name').innerHTML =
      'Meredith Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/meredith-exterior-640x360.jpg';
  });

  meredithsouth.addEventListener('click', () => {
    subscribeComments('meredithsouth');
    locPage = 'meredithsouth';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Meredith South Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/meredith-south-exterior-640x360.jpg';
  });

  windsor.addEventListener('click', () => {
    console.log('subscribed');
    subscribeComments('windsor');
    locPage = 'windsor';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Windsor Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/windsor-exterior-640x360.jpg';
  });

  cary.addEventListener('click', () => {
    subscribeComments('cary');
    locPage = 'cary';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Cary Quadrangle';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/caryquad-640x360.jpg';
  });

  mccutcheon.addEventListener('click', () => {
    locPage = 'mccutcheon';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'McCutcheon Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/mccutcheon-exterior-640x360.jpg';
  });

  tarkington.addEventListener('click', () => {
    locPage = 'tarkington';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Tarkington Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/tarkington-exterior-640x360.jpg';
  });

  wiley.addEventListener('click', () => {
    locPage = 'wiley';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Wiley Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/wiley-exterior-640x360.jpg';
  });

  earhart.addEventListener('click', () => {
    locPage = 'earhart';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Earhart Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/earhart-exterior-statue-640x360.jpg';
  });

  towers.addEventListener('click', () => {
    locPage = 'towers';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'First Street Towers';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/first-street-towers-exterior-640x360.jpg';
  });

  freida.addEventListener('click', () => {
    locPage = 'freida';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Freida Parker Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/griffin-north-exterior-640x360.jpg';
  });

  winifred.addEventListener('click', () => {
    locPage = 'winifred';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Winifred Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/griffin-south-exterior-640x360.jpg';
  });

  harrison.addEventListener('click', () => {
    locPage = 'harrison';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Harrison Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/harrison-exterior-640x360.jpg';
  });

  hawkins.addEventListener('click', () => {
    locPage = 'hawkins';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Hawkins Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/hawkins-exterior-640x360.jpg';
  });

  hillenbrand.addEventListener('click', () => {
    locPage = 'hillenbrand';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Hillenbrand Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/hillenbrand-exterior-640x360.jpg';
  });

  honors.addEventListener('click', () => {
    locPage = 'honors';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Honors College';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/honors-college-exterior-640x360.jpg';
  });

  owen.addEventListener('click', () => {
    locPage = 'owen';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Owen Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/owen-exterior-640x360.jpg';
  });

  shreve.addEventListener('click', () => {
    locPage = 'shreve';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Shreve Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/shreve-exterior-640x360.jpg';
  });

  document.addEventListener(
    'DOMContentLoaded',
    function () {
      console.log('Ready!');
    },
    false
  );

  //renaming to specific location name
  var locName = 'placeholder';
  var nameLabels = document.getElementsByClassName('location-name');
  [].forEach.call(nameLabels, function (nameLabel) {
    nameLabel.innerHTML = locName;
  });

  //changing the image
  var imgSource = 'https://i.ibb.co/r7Sw159/0-Stars.jpg'; //placeholder
  var pageImg = document.getElementById('location-image');
  pageImg.src = imgSource;
  //appDiv.innerHTML = `<h1>JS Starter</h1>`;

  var locationScore = 0;
  var qualityScore = 0;
  var amenitiesScore = 0;
  var communityScore = 0;
  var average = 0;
  var reviewMessage = '';

  const submit = document.getElementById('submit-button');

  submit.addEventListener('click', () => {
    reviewMessage = document.getElementById('review-message').value;

    locationScore = +document.getElementById('location-score').value;
    qualityScore = +document.getElementById('quality-score').value;
    amenitiesScore = +document.getElementById('amenities-score').value;
    communityScore = +document.getElementById('community-score').value;

    if (
      locationScore == 0 ||
      qualityScore == 0 ||
      amenitiesScore == 0 ||
      communityScore == 0 ||
      reviewMessage.length == 0
    ) {
      console.log('no');
      alert('All boxes must be filled.');
    } else {
      average =
        (locationScore + qualityScore + amenitiesScore + communityScore) / 4;

      addDoc(collection(db, 'locationData', locPage, 'reviews'), {
        reviewMessage: reviewMessage,
        locationScore: locationScore,
        qualityScore: qualityScore,
        amenitiesScore: amenitiesScore,
        communityScore: communityScore,
        average: average,
        timestamp: Date.now(),
        name: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
      });

      document.getElementById('location-score').value = '';
      document.getElementById('quality-score').value = '';
      document.getElementById('amenities-score').value = '';
      document.getElementById('community-score').value = '';
      document.getElementById('review-message').value = '';
    }
  });
}
main();
