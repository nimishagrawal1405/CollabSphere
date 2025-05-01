import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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

const projectList = document.getElementById('project-list');
const uploadForm = document.getElementById('upload-form');

let currentUser = null;

onAuthStateChanged(auth, user => {
  currentUser = user;
  if (!user) {
    alert("Please log in to view/upload projects.");
    window.location.href = "login.html";
    return;
  }

  loadProjects();
});

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const link = document.getElementById('link').value;

  await addDoc(collection(db, "projects"), {
    title,
    description,
    link,
    owner: currentUser.uid,
    timestamp: Date.now()
  });

  uploadForm.reset();
  alert("Project uploaded!");
});

function loadProjects() {
  onSnapshot(collection(db, "projects"), (snapshot) => {
    projectList.innerHTML = "";
    snapshot.forEach(doc => {
      const project = doc.data();
      const card = document.createElement('div');
      card.className = "project-card";
      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">View Project</a>
        <br/>
        <button data-id="${doc.id}" data-owner="${project.owner}">I'm Interested</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        markInterest(doc.id, project.owner);
      });
      projectList.appendChild(card);
    });
  });
}

async function markInterest(projectId, ownerId) {
  if (!currentUser) return alert("You must be logged in!");

  await addDoc(collection(db, "interests"), {
    projectId,
    interestedBy: currentUser.uid,
    notifiedTo: ownerId,
    timestamp: Date.now()
  });

  alert("Interest marked! The project owner will be notified.");
}
