import firebase from 'firebase/app'
import "firebase/auth"
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'



const firebaseConfig = {
  apiKey: "AIzaSyCyBh9SClGmPLbSn9mk606Q76C2dlCPQP4",
  authDomain: "cp3351project-45534.firebaseapp.com",
  projectId: "cp3351project-45534",
  storageBucket: "cp3351project-45534.appspot.com",
  messagingSenderId: "568860556152",
  appId: "1:568860556152:web:95b40bf59441a3a0cde68d",
  measurementId: "G-CN2SXTHTGJ"
  };

firebase.initializeApp(firebaseConfig)

firebase.firestore().useEmulator("10.0.2.2", 8080)
firebase.functions().useEmulator("10.0.2.2", 5001)
firebase.auth().useEmulator("http://10.0.2.2:9099")

export default firebase