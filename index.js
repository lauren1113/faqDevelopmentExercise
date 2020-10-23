<script>
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: process.env.FIREBASE_API,
    authDomain: "ashlynns-arrangements-admin-db.firebaseapp.com",
    databaseURL: "https://ashlynns-arrangements-admin-db.firebaseio.com",
    projectId: "ashlynns-arrangements-admin-db",
    storageBucket: "ashlynns-arrangements-admin-db.appspot.com",
    messagingSenderId: "381803912491",
    appId: process.env.FIREBASE_ID,
    measurementId: "G-1N6G5KWPP6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>

// [FIREBASE USER DATABASE]

function addSignInListeners(st) {
  addLogInAndOutListener(state.User);
  listenForAuthChange();
  listenForRegister(st);
  listenForSignIn(st);
}

// FUNCTIONS & EVENT LISTENERS
function addLogInAndOutListener(user) {
  // select link in header
  document.querySelector("header a").addEventListener("click", event => {
    // if user is logged in,
    if (user.loggedIn) {
      event.preventDefault();
      // log out functionality
      auth.signOut().then(() => {
        logOutUserInDb(user.email);
        resetUserInState();
        // update user in database
        db.collection("Users").get;
        render(state.Home);
        router.navigate("/Home");
      });
    }
    // if user is logged out, clicking the link will route to sign in page
  });
}
function logOutUserInDb(email) {
  if (state.User.loggedIn) {
    db.collection("Users")
      .get()
      .then(snapshot =>
        snapshot.docs.forEach(doc => {
          if (email === doc.data().email) {
            let id = doc.id;
            db.collection("Users")
              .doc(id)
              .update({ signedIn: false });
          }
        })
      );
  }
}
function resetUserInState() {
  state.User.username = "";
  state.User.firstName = "";
  state.User.lastName = "";
  state.User.email = "";
  state.User.loggedIn = false;
}

function listenForAuthChange() {
  // log user object from auth if a user is signed in
  auth.onAuthStateChanged(user => (user ? console.log(user) : ""));
}

function listenForRegister(st) {
  document.querySelector("#newUserForm").addEventListener("submit", event => {
    event.preventDefault();
    // convert HTML elements to Array
    let inputList = Array.from(event.target.elements);
    // remove submit button from list
    inputList.pop();
    const inputs = inputList.map(input => input.value);
    let firstName = inputs[0];
    let lastName = inputs[1];
    let email = inputs[2];
    let password = inputs[3];

    // create user in Firebase
    auth.createUserWithEmailAndPassword(email, password).then(response => {
      addUserToStateAndDb(firstName, lastName, email, password);
      render(state.Home);
      router.navigate("/Home");
    });
  });
}

function addUserToStateAndDb(first, last, email, pass) {
  state.User.username = first + last;
  state.User.firstName = first;
  state.User.lastName = last;
  state.User.email = email;
  state.User.loggedIn = true;

  db.collection("Users").add({
    firstName: first,
    lastName: last,
    email: email,
    password: pass,
    signedIn: true
  });
}

function listenForSignIn(st) {
  document.querySelector("#existingUserForm").addEventListener("submit", event => {
    event.preventDefault();
    // convert HTML elements to Array
    let inputList = Array.from(event.target.elements);
    // remove submit button from list
    inputList.pop();
    const inputs = inputList.map(input => input.value);
    let email = inputs[0];
    let password = inputs[1];
    auth.signInWithEmailAndPassword(email, password).then(() => {
      getUserFromDb(email).then(() => render(state.Home));
      router.navigate("/Home");
    });
  });
}
function getUserFromDb(email) {
  return db
    .collection("Users")
    .get()
    .then(snapshot =>
      snapshot.docs.forEach(doc => {
        if (email === doc.data().email) {
          let id = doc.id;
          db.collection("Users")
            .doc(id)
            .update({ signedIn: true });
          let user = doc.data();
          state.User.username = user.firstName + user.lastName;
          state.User.firstName = user.firstName;
          state.User.lastName = user.lastName;
          state.User.email = email;
          state.User.loggedIn = true;
        }
      })
    );
}
