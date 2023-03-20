import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: "AIzaSyDce7WDB1VU_wXUZTRrNzAJlmmtMIBnGM0",
	authDomain: "affinex-productivity-timer.firebaseapp.com",
	databaseURL:
		"https://affinex-productivity-timer-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "affinex-productivity-timer",
	storageBucket: "affinex-productivity-timer.appspot.com",
	messagingSenderId: "1083939956984",
	appId: "1:1083939956984:web:afa020611e9072791a730d",
	measurementId: "G-RQTLT9KSYJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
