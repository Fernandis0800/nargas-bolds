```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "nargas-social.firebaseapp.com",
  projectId: "nargas-social",
  storageBucket: "nargas-social.firebasestorage.app",
  messagingSenderId: "753341690678",
  appId: "1:753341690678:web:7226277e8416f056203997"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// TELAS
const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");

const sections = {
  feed: document.getElementById("feed-section"),
  post: document.getElementById("post-section"),
  profile: document.getElementById("profile-section")
};

authScreen.style.display = "block";
appScreen.style.display = "none";

function showSection(sectionName) {
  Object.values(sections).forEach(section => {
    section.style.display = "none";
  });

  sections[sectionName].style.display = "block";
}

// NAVEGAÇÃO
document.getElementById("nav-logo").addEventListener("click", () => {
  showSection("feed");
});

document.getElementById("nav-feed").addEventListener("click", () => {
  showSection("feed");
});

document.getElementById("nav-post").addEventListener("click", () => {
  showSection("post");
});

document.getElementById("nav-profile").addEventListener("click", () => {
  showSection("profile");
});

// CADASTRO
document.getElementById("btn-register").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Preencha email e senha.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    authScreen.style.display = "none";
    appScreen.style.display = "block";

    showSection("feed");

    alert("Conta criada com sucesso!");
  } catch (error) {
    alert(error.message);
  }
});

// LOGIN
document.getElementById("btn-login").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Preencha email e senha.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    authScreen.style.display = "none";
    appScreen.style.display = "block";

    showSection("feed");
  } catch (error) {
    alert("Email ou senha incorretos.");
  }
});

// LOGOUT
document.getElementById("btn-logout").addEventListener("click", async () => {
  try {
    await signOut(auth);

    appScreen.style.display = "none";
    authScreen.style.display = "block";
  } catch (error) {
    alert(error.message);
  }
});

// POSTAGENS
const postCaption = document.getElementById("post-caption");
const btnShare = document.getElementById("btn-share");
const feedContainer = document.getElementById("feed-container");

btnShare.addEventListener("click", async () => {
  const texto = postCaption.value.trim();

  if (!texto) {
    alert("Digite uma legenda.");
    return;
  }

  try {
    await addDoc(collection(db, "posts"), {
      legenda: texto,
      criadoEm: new Date()
    });

    postCaption.value = "";
    showSection("feed");
  } catch (error) {
    console.error(error);
    alert("Erro ao publicar.");
  }
});

// FEED
const q = query(
  collection(db, "posts"),
  orderBy("criadoEm", "desc")
);

onSnapshot(q, snapshot => {
  feedContainer.innerHTML = "";

  snapshot.forEach(doc => {
    const dados = doc.data();

    const post = document.createElement("div");

    post.style.background = "#fff";
    post.style.border = "1px solid #ddd";
    post.style.padding = "15px";
    post.style.margin = "10px 0";
    post.style.borderRadius = "10px";

    post.innerHTML = `
      <p>${dados.legenda}</p>
    `;

    feedContainer.appendChild(post);
  });
});
```
