import { Nav, Header, Main, Footer } from "./components";
import * as state from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import "./env";
import { auth, db } from "./firebase";

axios
  .get(`https://api.github.com/users/lauren1113/repos`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  })
  .then(response => console.log(response.data));

const router = new Navigo(window.location.origin);

router
  .on(":view", handleRoute)
  .on("/", () => render(state.Home))
  .resolve();
function handleRoute(params) {
  const view = params.view;
  render(state[view]);
}

router.updatePageLinks();

function render(st) {
  document.querySelector("#root").innerHTML = `
    ${Nav(st)}
    ${Header()}
    ${Main(st)}
    ${Footer()}
  `;

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  // [FIREBASE USER DATABASE]

  function addSignInListeners(st) {
    addLogInAndOutListener(state.User);
    listenForAuthChange();
    listenForRegister(st);
    listenForSignIn(st);
    renderAdminFAQPage(st);
    getUserDataByUID(st);
    getUserDataByEmail(st);
  }
  addSignInListeners();

  // Fetch User Data from Firestore by User ID
  function getUserDataByUID(st) {
    admin
      .auth()
      .getUser(uid)
      .then(function(userRecord) {
        console.log("Successfully fetched user data:", userRecord.toJSON());
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
      });
  }

  // Fetch User Data from Firestore by Email
  function getUserDataByEmail(st) {
    admin
      .auth()
      .getUserByEmail(email)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
      });
  }

  // If Admin user is logged in, clicking "FAQ" will take them to admin FAQ page.

  function renderAdminFAQPage(st) {
    document.getElementById("faqLink").addEventListener("click", function() {
      if (state.User.Admin === true) {
        render("./adminFAQ"), router.navigate("./adminFAQ");
      }
    });
  }

  // function listenForAdminFAQ(st) {
    if (st.view === "adminFAQ") {
      document.getElementById("adminFaqForm").addEventListener("submit", event => {
        event.preventDefault();
        let inputList = Array.from(event.target.elements);
        //remove submit button from array
        inputList.pop();
        const inputs = inputList.map(input => input.value);
        let newQ1 = inputs[0];
        let newA1 = inputs[1];
        let newQ2 = inputs[2];
        let newA2 = inputs[3];
        let newQ3 = inputs[4];
        let newA3 = inputs[5];
      });
      addNewFaqToPage();
    }
  }

  // add new FAQ to FAQ page
  function addNewFaqToPage() {
    document.querySelector("#newQ1").innerHTML = newQ1;
    document.querySelector("#newA1").innerHTML = newA1;
    document.querySelector("#newQ2").innerHTML = newQ2;
    document.querySelector("#newA2").innerHTML = newA2;
    document.querySelector("#newQ3").innerHTML = newQ3;
    document.querySelector("#newA3").innerHTML = newA3;
  }

  // FUNCTIONS & EVENT LISTENERS
  function addLogInAndOutListener(user) {
    // select link in header
    document.querySelector("header a").addEventListener("click", event => {
      // if user is logged in,
      if (user.signedIn) {
        event.preventDefault();
        // log out functionality
        auth.signOut().then(() => {
          logOutUserInDb(user.email);
          resetUserInState();
          // update user in database
          db.collection("users").get;
          render(state.Home);
          router.navigate("/Home");
        });
      }
      // if user is logged out, clicking the link will route to sign in page
    });
  }
  function logOutUserInDb(email) {
    if (state.User.signedIn) {
      db.collection("users")
        .get()
        .then(snapshot =>
          snapshot.docs.forEach(doc => {
            if (email === doc.data().email) {
              let id = doc.id;
              db.collection("users")
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
    state.User.signedIn = false;
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
    state.User.signedIn = true;

    db.collection("users").add({
      firstName: first,
      lastName: last,
      email: email,
      password: pass,
      signedIn: true
    });
  }

  function listenForSignIn(st) {
    document
      .querySelector("#existingUserForm")
      .addEventListener("submit", event => {
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
      .collection("users")
      .get()
      .then(snapshot =>
        snapshot.docs.forEach(doc => {
          if (email === doc.data().email) {
            let id = doc.id;
            db.collection("users")
              .doc(id)
              .update({ signedIn: true });
            let user = doc.data();
            state.User.username = user.firstName + user.lastName;
            state.User.firstName = user.firstName;
            state.User.lastName = user.lastName;
            state.User.email = email;
            state.User.signedIn = true;
          }
        })
      );
  }
}
