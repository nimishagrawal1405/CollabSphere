import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfrSQDp4hgwokM5cSAJTLtec9sAC64axw",
    authDomain: "collab-sphere-b05f4.firebaseapp.com",
    projectId: "collab-sphere-b05f4",
    storageBucket: "collab-sphere-b05f4.appspot.com",
    messagingSenderId: "319397548371",
    appId: "1:319397548371:web:1f0c49429293822e1b91a6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const messagesContainer = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("You must be logged in to chat.");
    window.location.href = "login.html";
    return;
  }

  const messagesRef = collection(db, "publicMessages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  onSnapshot(q, (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "message";
      div.textContent = `${data.userEmail}: ${data.text}`;
      messagesContainer.appendChild(div);
    });
  });

  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (messageInput.value.trim() === "") return;
    await addDoc(messagesRef, {
      userEmail: user.email,
      text: messageInput.value,
      timestamp: serverTimestamp()
    });
    messageInput.value = "";
  });
});