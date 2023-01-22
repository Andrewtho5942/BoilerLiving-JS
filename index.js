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
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1 - 1,
  -1,
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

  function subscribeReview() {
    // Create query for messages
    const q = query(collection(db,'locationMetadata'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snaps) => {
      snaps.forEach((doc) => {
        async () => {
          const docRef = doc(db, 'locationMetadata', doc.data().name);
          // If they RSVP'd yes, save a document with attending: true
          try{
            await setDoc(docRef, {
              locationAverage:locationTotal/numReviews,
            qualityAverage:qualityTotal/numReviews,
            communityAverage:communitytotal/numReviews,
            amenitiesAverage:amenitiesTotal/numReviews,
            overallRating:((locationTotal/numReviews)+(qualityTotal/numReviews)+(communitytotal/numReviews)+(amenitiesTotal/numReviews))/4,
            name:location
            });
          }catch (e){
            console.error(e);
          }
        };
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
      let locationTotal=0;
      let qualityTotal=0;
      let amenitiesTotal=0;
      let communitytotal=0;
      let numReviews = 0;
      // Loop through documents in database
      snaps.forEach((doc) => {
        let community = doc.data().communityScore;
        let location = doc.data().locationScore;
        let quality = doc.data().qualityScore;
        let amenities = doc.data().amenitiesScore;

        numReviews++;

        locationTotal+=location;
        communitytotal+=community;
        qualityTotal+=quality;
        amenitiesTotal+=amenities;

        // Create an HTML entry for each document and add it to the chat
        const entry = document.createElement('p');
        const entry2 = document.createElement('q');
        //first line
        doc.data().nameID;
        entry.textContent =
          getTime(doc.data().timestamp) + ' --  ' +
          doc.data().name + ': Community:  ' + community + '/5, Location: ' + location + '/5, ' +
          'Quality: ' + quality + '/5, Amenities: ' + amenities + '/5';
        comments.appendChild(entry);

        entry2.textContent = doc.data().reviewMessage;
        comments.append(entry2);
      });
      console.log(locationTotal);
      
      //calculate the averages and set the docs in the locationData collection
        const docRef = doc(db, 'locationMetadata', location);
        try{
          await setDoc(docRef, {
            //calculate and store averages
            locationAverage:locationTotal/numReviews,
            qualityAverage:qualityTotal/numReviews,
            communityAverage:communitytotal/numReviews,
            amenitiesAverage:amenitiesTotal/numReviews,
            overallRating:((locationTotal/numReviews)+(qualityTotal/numReviews)+(communitytotal/numReviews)+(amenitiesTotal/numReviews))/4,
            name:location
          });
        }catch (e){
          console.error(e);
        }
        
    });
  }

  // test here

  const stars = [
    'https://i.ibb.co/r7Sw159/0-Stars.jpg',
    'https://i.ibb.co/D8YXwzD/1-Star.jpg',
    'https://i.ibb.co/mGr6Pr6/2-Stars.jpg',
    'https://i.ibb.co/161W3t4/3-Stars.jpg',
    'https://i.ibb.co/PgqG4L7/4-Stars.jpg',
    'https://i.ibb.co/6wdWNH4/5-Stars.jpg',
  ];

  var frontRating;
  var starImage;
  let avgs;
  function subscribeRatings() {
    // Create query for messages
    const q = query(collection(db, 'locationData'));
    onSnapshot(q, (snaps) => {
      // Loop through documents in database
      snaps.forEach((doc) => {
        switch (doc.data().name) {
          case 'meredith':
            ratingsArray[0] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('meredith-rating');
            frontRating.src = starImage;
            break;
          case 'meredithsouth':
            ratingsArray[1] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('meredith-s-rating');
            frontRating.src = starImage;
            break;
          case 'windsor':
            ratingsArray[2] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('windsor-rating');
            frontRating.src = starImage;
            break;
          case 'cary':
            ratingsArray[3] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('cary-rating');
            frontRating.src = starImage;
            break;
          case 'mccutcheon':
            ratingsArray[4] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('mccutcheon-rating');
            frontRating.src = starImage;
            break;
          case 'tarkington':
            ratingsArray[5] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('tarkington-rating');
            frontRating.src = starImage;
            break;
          case 'wiley':
            ratingsArray[6] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('wiley-rating');
            frontRating.src = starImage;
            break;
          case 'earhart':
            ratingsArray[7] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('earhart-rating');
            frontRating.src = starImage;
            break;
          case 'towers':
            ratingsArray[8] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('towers-rating');
            frontRating.src = starImage;
            break;
          case 'freida':
            ratingsArray[9] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('freida-rating');
            frontRating.src = starImage;
            break;
          case 'winifred':
            ratingsArray[10] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('winifred-rating');
            frontRating.src = starImage;
            break;
          case 'harrison':
            ratingsArray[11] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('harrison-rating');
            frontRating.src = starImage;
            break;
          case 'hawkins':
            ratingsArray[12] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('hawkins-rating');
            frontRating.src = starImage;
            break;
          case 'hillenbrand':
            ratingsArray[13] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('hillenbrand-rating');
            frontRating.src = starImage;
            break;
          case 'honors':
            ratingsArray[14] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('honors-rating');
            frontRating.src = starImage;
            break;
          case 'owen':
            ratingsArray[15] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('owens-rating');
            frontRating.src = starImage;
            break;
          case 'shreve':
            ratingsArray[16] = doc.data().overallRating;
            starImage = stars[doc.data().overallRating];
            frontRating = document.getElementById('shreve-rating');
            frontRating.src = starImage;
            break;
        }
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
    subscribeComments('mccutcheon');
    locPage = 'mccutcheon';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'McCutcheon Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/mccutcheon-exterior-640x360.jpg';
  });

  tarkington.addEventListener('click', () => {
    subscribeComments('tarkington');
    locPage = 'tarkington';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Tarkington Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/tarkington-exterior-640x360.jpg';
  });

  wiley.addEventListener('click', () => {
    subscribeComments('wiley');
    locPage = 'wiley';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Wiley Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/wiley-exterior-640x360.jpg';
  });

  earhart.addEventListener('click', () => {
    subscribeComments('earhart');
    locPage = 'earhart';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Earhart Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/earhart-exterior-statue-640x360.jpg';
  });

  towers.addEventListener('click', () => {
    subscribeComments('towers');
    locPage = 'towers';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'First Street Towers';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/first-street-towers-exterior-640x360.jpg';
  });

  freida.addEventListener('click', () => {
    subscribeComments('freida');
    locPage = 'freida';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Freida Parker Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/griffin-north-exterior-640x360.jpg';
  });

  winifred.addEventListener('click', () => {
    subscribeComments('winifred');
    locPage = 'winifred';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Winifred Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/griffin-south-exterior-640x360.jpg';
  });

  harrison.addEventListener('click', () => {
    subscribeComments('harrison');
    locPage = 'harrison';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Harrison Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/harrison-exterior-640x360.jpg';
  });

  hawkins.addEventListener('click', () => {
    subscribeComments('hawkins');
    locPage = 'hawkins';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Hawkins Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/hawkins-exterior-640x360.jpg';
  });

  hillenbrand.addEventListener('click', () => {
    subscribeComments('hillenbrand');
    locPage = 'hillenbrand';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Hillenbrand Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/hillenbrand-exterior-640x360.jpg';
  });

  honors.addEventListener('click', () => {
    subscribeComments('honors');
    locPage = 'honors';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Honors College';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/honors-college-exterior-640x360.jpg';
  });

  owen.addEventListener('click', () => {
    subscribeComments('owen');
    locPage = 'owen';
    bottom.style.display = 'block';
    locationTitle = document.getElementById('location-name').innerHTML =
      'Owen Hall';
    imageImage = document.getElementById('image-image').src =
      'https://www.housing.purdue.edu/images/_hero/owen-exterior-640x360.jpg';
  });

  shreve.addEventListener('click', () => {
    subscribeComments('shreve');
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
