import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJIVcLC-KtYjXhx7URpnnxN9XUmKOQeCI",
  authDomain: "onev-fleet-ops.firebaseapp.com",
  projectId: "onev-fleet-ops",
  storageBucket: "onev-fleet-ops.appspot.com",
  messagingSenderId: "130276431433",
  appId: "1:130276431433:web:d56eb85374b37ef214d198"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export { storage }