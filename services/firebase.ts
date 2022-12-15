import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBYfMwcJ2xDClP9TGi4JW5EVvrvO-5n_gk",
  authDomain: "produzindocerto-79619.firebaseapp.com",
  projectId: "produzindocerto-79619",
  storageBucket: "produzindocerto-79619.appspot.com",
  messagingSenderId: "18709069929",
  appId: "1:18709069929:web:6be99043cded31cddf22f8",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const database = firebase.database();

export { firebase, database }