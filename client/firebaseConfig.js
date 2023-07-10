import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8bqZXeh6JMxkFnb5b18N7c-3Xu9C8jQM",
  authDomain: "otaku-love-96ab3.firebaseapp.com",
  projectId: "otaku-love-96ab3",
  storageBucket: "otaku-love-96ab3.appspot.com",
  messagingSenderId: "680561497801",
  appId: "1:680561497801:web:1498ed420b228507e59f18"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export { storage }