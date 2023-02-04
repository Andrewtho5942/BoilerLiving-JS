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

let ratingsArray = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

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
      subscribeRatings();
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
      let locationTotal = 0;
      let qualityTotal = 0;
      let amenitiesTotal = 0;
      let communitytotal = 0;
      let numReviews = 0;
      // Loop through documents in database
      snaps.forEach((doc) => {
        let community = doc.data().communityScore;
        let location = doc.data().locationScore;
        let quality = doc.data().qualityScore;
        let amenities = doc.data().amenitiesScore;

        numReviews++;

        locationTotal += location;
        communitytotal += community;
        qualityTotal += quality;
        amenitiesTotal += amenities;

        // Create an HTML entry for each document and add it to the chat
        const entry = document.createElement('p');
        const entry2 = document.createElement('q');
        //first line
        doc.data().nameID;
        entry.textContent =
          getTime(doc.data().timestamp) +
          ' --  ' +
          doc.data().name +
          ': Community:  ' +
          community +
          '/5, Location: ' +
          location +
          '/5, ' +
          'Quality: ' +
          quality +
          '/5, Amenities: ' +
          amenities +
          '/5';
        comments.appendChild(entry);

        entry2.textContent = doc.data().reviewMessage;
        comments.append(entry2);
      });
      //calculate the averages and set the docs in the locationData collection
      const docRef = doc(db, 'locationMetadata', location);
      if (numReviews > 0) {
        try {
          setDoc(docRef, {
            //calculate and store averages
            locationAverage: locationTotal / numReviews,
            qualityAverage: qualityTotal / numReviews,
            communityAverage: communitytotal / numReviews,
            amenitiesAverage: amenitiesTotal / numReviews,
            overallRating:
              (locationTotal / numReviews +
                qualityTotal / numReviews +
                communitytotal / numReviews +
                amenitiesTotal / numReviews) /
              4,
            name: location,
          });
          console.log(amenitiesTotal / numReviews);
          console.log(qualityTotal / numReviews);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  // test here

  const stars = [
    'https://i.postimg.cc/k5w1tD65/0-Stars.jpg',
    'https://i.postimg.cc/zBBdw5KF/1Star.png',
    'https://i.postimg.cc/850Zt3bQ/2Stars.png',
    'https://i.postimg.cc/fW3sDQpd/3Stars.png',
    'https://i.postimg.cc/1XVJTHWg/4Stars.png',
    'https://i.postimg.cc/fk4Bh9F8/5Stars.png',
  ];

  
  function subscribeRatings() {
    var frontRating = document.getElementById('meredith-rating');
    console.log(frontRating);
    var starImage;
    // Create query for messages
    const q = query(collection(db, 'locationMetadata'));
    onSnapshot(q, (snaps) => {
      // Loop through documents in database
      snaps.forEach((doc) => {
        switch (doc.data().name) {
          case 'meredith':
            ratingsArray[0][0] = doc.data().overallRating;
            ratingsArray[0][1] = doc.data().amenitiesAverage;
            ratingsArray[0][2] = doc.data().locationAverage;
            ratingsArray[0][3] = doc.data().qualityAverage;
            ratingsArray[0][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('meredith-rating');
            frontRating.src = starImage;
            if(locPage == 'meredith'){
              setMultipleRatings(0);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'meredithsouth':
            ratingsArray[1][0] = doc.data().overallRating;
            ratingsArray[1][1] = doc.data().amenitiesAverage;
            ratingsArray[1][2] = doc.data().locationAverage;
            ratingsArray[1][3] = doc.data().qualityAverage;
            ratingsArray[1][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('meredith-s-rating');
            frontRating.src = starImage;
            if(locPage == 'meredithsouth'){
              setMultipleRatings(1);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'windsor':
            ratingsArray[2][0] = doc.data().overallRating;
            ratingsArray[2][1] = doc.data().amenitiesAverage;
            ratingsArray[2][2] = doc.data().locationAverage;
            ratingsArray[2][3] = doc.data().qualityAverage;
            ratingsArray[2][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('windsor-rating');
            frontRating.src = starImage;
            if(locPage == 'windsor'){
              setMultipleRatings(2);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'cary':
            ratingsArray[3][0] = doc.data().overallRating;
            ratingsArray[3][1] = doc.data().amenitiesAverage;
            ratingsArray[3][2] = doc.data().locationAverage;
            ratingsArray[3][3] = doc.data().qualityAverage;
            ratingsArray[3][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('cary-rating');
            frontRating.src = starImage;
            if(locPage == 'cary'){
              setMultipleRatings(3);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'mccutcheon':
            ratingsArray[4][0] = doc.data().overallRating;
            ratingsArray[4][1] = doc.data().amenitiesAverage;
            ratingsArray[4][2] = doc.data().locationAverage;
            ratingsArray[4][3] = doc.data().qualityAverage;
            ratingsArray[4][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('mccutcheon-rating');
            frontRating.src = starImage;
            if(locPage == 'mccutcheon'){
              setMultipleRatings(4);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'tarkington':
            ratingsArray[5][0] = doc.data().overallRating;
            ratingsArray[5][1] = doc.data().amenitiesAverage;
            ratingsArray[5][2] = doc.data().locationAverage;
            ratingsArray[5][3] = doc.data().qualityAverage;
            ratingsArray[5][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('tarkington-rating');
            frontRating.src = starImage;
            if(locPage == 'tarkington'){
              setMultipleRatings(5);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'wiley':
            ratingsArray[6][0] = doc.data().overallRating;
            ratingsArray[6][1] = doc.data().amenitiesAverage;
            ratingsArray[6][2] = doc.data().locationAverage;
            ratingsArray[6][3] = doc.data().qualityAverage;
            ratingsArray[6][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('wiley-rating');
            frontRating.src = starImage;
            if(locPage == 'wiley'){
              setMultipleRatings(6);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'earhart':
            ratingsArray[7][0] = doc.data().overallRating;
            ratingsArray[7][1] = doc.data().amenitiesAverage;
            ratingsArray[7][2] = doc.data().locationAverage;
            ratingsArray[7][3] = doc.data().qualityAverage;
            ratingsArray[7][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('earhart-rating');
            frontRating.src = starImage;
            if(locPage == 'earhart'){
              setMultipleRatings(7);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'towers':
            ratingsArray[8][0] = doc.data().overallRating;
            ratingsArray[8][1] = doc.data().amenitiesAverage;
            ratingsArray[8][2] = doc.data().locationAverage;
            ratingsArray[8][3] = doc.data().qualityAverage;
            ratingsArray[8][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('towers-rating');
            frontRating.src = starImage;
            if(locPage == 'towers'){
              setMultipleRatings(8);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'freida':
            ratingsArray[9][0] = doc.data().overallRating;
            ratingsArray[9][1] = doc.data().amenitiesAverage;
            ratingsArray[9][2] = doc.data().locationAverage;
            ratingsArray[9][3] = doc.data().qualityAverage;
            ratingsArray[9][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('freida-rating');
            frontRating.src = starImage;
            if(locPage == 'freida'){
              setMultipleRatings(9);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'winifred':
            ratingsArray[10][0] = doc.data().overallRating;
            ratingsArray[10][1] = doc.data().amenitiesAverage;
            ratingsArray[10][2] = doc.data().locationAverage;
            ratingsArray[10][3] = doc.data().qualityAverage;
            ratingsArray[10][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('winifred-rating');
            frontRating.src = starImage;
            if(locPage == 'winifred'){
              setMultipleRatings(10);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'harrison':
            ratingsArray[11][0] = doc.data().overallRating;
            ratingsArray[11][1] = doc.data().amenitiesAverage;
            ratingsArray[11][2] = doc.data().locationAverage;
            ratingsArray[11][3] = doc.data().qualityAverage;
            ratingsArray[11][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('harrison-rating');
            frontRating.src = starImage;
            if(locPage == 'harrison'){
              setMultipleRatings(11);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'hawkins':
            ratingsArray[12][0] = doc.data().overallRating;
            ratingsArray[12][1] = doc.data().amenitiesAverage;
            ratingsArray[12][2] = doc.data().locationAverage;
            ratingsArray[12][3] = doc.data().qualityAverage;
            ratingsArray[12][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('hawkins-rating');
            frontRating.src = starImage;
            if(locPage == 'hawkins'){
              setMultipleRatings(12);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'hillenbrand':
            ratingsArray[13][0] = doc.data().overallRating;
            ratingsArray[13][1] = doc.data().amenitiesAverage;
            ratingsArray[13][2] = doc.data().locationAverage;
            ratingsArray[13][3] = doc.data().qualityAverage;
            ratingsArray[13][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('hillenbrand-rating');
            frontRating.src = starImage;
            if(locPage == 'hillenbrand'){
              setMultipleRatings(13);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'honors':
            ratingsArray[14][0] = doc.data().overallRating;
            ratingsArray[14][1] = doc.data().amenitiesAverage;
            ratingsArray[14][2] = doc.data().locationAverage;
            ratingsArray[14][3] = doc.data().qualityAverage;
            ratingsArray[14][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('honors-rating');
            frontRating.src = starImage;
            if(locPage == 'honors'){
              setMultipleRatings(14);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'owen':
            ratingsArray[15][0] = doc.data().overallRating;
            ratingsArray[15][1] = doc.data().amenitiesAverage;
            ratingsArray[15][2] = doc.data().locationAverage;
            ratingsArray[15][3] = doc.data().qualityAverage;
            ratingsArray[15][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('owen-rating');
            frontRating.src = starImage;
            if(locPage == 'owen'){
              setMultipleRatings(15);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
          case 'shreve':
            ratingsArray[16][0] = doc.data().overallRating;
            ratingsArray[16][1] = doc.data().amenitiesAverage;
            ratingsArray[16][2] = doc.data().locationAverage;
            ratingsArray[16][3] = doc.data().qualityAverage;
            ratingsArray[16][4] = doc.data().communityAverage;
            starImage = stars[Math.round(doc.data().overallRating)];
            frontRating = document.getElementById('shreve-rating');
            frontRating.src = starImage;
            if(locPage == 'shreve'){
              setMultipleRatings(16);
              (document.getElementById('location-image')).src = starImage;
            }
            break;
        }
      });
    });
  }

  //value from 0-5
  //nameIDs:
  //"net-rating"
  //"location-rating"
  //"quality-rating"
  //"amenities-rating"
  //"communtity-rating"
  function setRating(value, nameID) {
    var toRate;
    toRate = document.getElementById(nameID);
    value = value.toFixed(2);
    toRate.innerHTML = '' + value + '/5';
  }

  function setMultipleRatings(locationID) {
    setRating(ratingsArray[locationID][0], 'net-rating');
    setRating(ratingsArray[locationID][1], 'amenities-rating');
    setRating(ratingsArray[locationID][2], 'location-rating');
    setRating(ratingsArray[locationID][3], 'quality-rating');
    setRating(ratingsArray[locationID][4], 'community-rating');
  }

  var starBottomImage;
  var starTopImage;

  var imageImage;
  var locationTitle;
  var mapImage;
  //listen to clicks on any location in the grid
  meredith.addEventListener('click', () => {
    locPage = 'meredith';
    bottom.style.display = 'block';
    subscribeComments('meredith');
    locationTitle = document.getElementById('location-name').innerHTML =
      'Meredith Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/meredith-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('meredith-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(0);
  });

  meredithsouth.addEventListener('click', () => {
    subscribeComments('meredithsouth');
    locPage = 'meredithsouth';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Meredith South Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/meredith-south-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('meredith-s-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(1);
  });

  windsor.addEventListener('click', () => {
    subscribeComments('windsor');
    locPage = 'windsor';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Windsor Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/windsor-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('windsor-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(2);
  });

  cary.addEventListener('click', () => {
    subscribeComments('cary');
    locPage = 'cary';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Cary Quadrangle';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/caryquad-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('cary-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(3);
  });

  mccutcheon.addEventListener('click', () => {
    subscribeComments('mccutcheon');
    locPage = 'mccutcheon';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'McCutcheon Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/mccutcheon-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('mccutcheon-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(4);
  });

  tarkington.addEventListener('click', () => {
    subscribeComments('tarkington');
    locPage = 'tarkington';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Tarkington Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/tarkington-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('tarkington-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(5);
  });

  wiley.addEventListener('click', () => {
    subscribeComments('wiley');
    locPage = 'wiley';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Wiley Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/wiley-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('wiley-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(6);
  });

  earhart.addEventListener('click', () => {
    subscribeComments('earhart');
    locPage = 'earhart';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Earhart Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/earhart-exterior-statue-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('earhart-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(7);
  });

  towers.addEventListener('click', () => {
    subscribeComments('towers');
    locPage = 'towers';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'First Street Towers';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/first-street-towers-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('towers-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(8);
  });

  freida.addEventListener('click', () => {
    subscribeComments('freida');
    locPage = 'freida';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Freida Parker Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/griffin-north-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('freida-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(9);
  });

  winifred.addEventListener('click', () => {
    subscribeComments('winifred');
    locPage = 'winifred';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Winifred Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/griffin-south-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('winifred-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(10);
  });

  harrison.addEventListener('click', () => {
    subscribeComments('harrison');
    locPage = 'harrison';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Harrison Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/harrison-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('harrison-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(11);
  });

  hawkins.addEventListener('click', () => {
    subscribeComments('hawkins');
    locPage = 'hawkins';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Hawkins Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/hawkins-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('hawkins-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(12);
  });

  hillenbrand.addEventListener('click', () => {
    subscribeComments('hillenbrand');
    locPage = 'hillenbrand';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Hillenbrand Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/hillenbrand-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('hillenbrand-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(13);
  });

  honors.addEventListener('click', () => {
    subscribeComments('honors');
    locPage = 'honors';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Honors College';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/honors-college-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('honors-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(14);
  });

  owen.addEventListener('click', () => {
    subscribeComments('owen');
    locPage = 'owen';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Owen Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/owen-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('owen-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(15);
  });

  shreve.addEventListener('click', () => {
    subscribeComments('shreve');
    locPage = 'shreve';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Shreve Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/shreve-exterior-640x360.jpg';
    starBottomImage = document.getElementById('location-image');
    starTopImage = document.getElementById('shreve-rating');
    starBottomImage.src = starTopImage.src;
    setMultipleRatings(16);
  });

  document.addEventListener('DOMContentLoaded', function () {}, false);

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
