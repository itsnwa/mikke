import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/analytics"

// You have to put your own settings here
const fs = firebase.initializeApp({
  apiKey: "AIzaSyAYd7TJ2d0EmVJHy_VO3JqE9yig3WyF3qw",
  authDomain: "mikke-bce19.firebaseapp.com",
  databaseURL: "https://mikke-bce19.firebaseio.com",
  projectId: "mikke-bce19",
  storageBucket: "mikke-bce19.appspot.com",
  messagingSenderId: "1027117784444",
  appId: "1:1027117784444:web:a822232db55edc682ed8f9",
  measurementId: "G-5L2TH8XV0C"
})

// Initialize analytics
firebase.analytics()

export const db = fs.firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }

export default firebase
