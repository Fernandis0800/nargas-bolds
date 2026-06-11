import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "AIzaSyD1pHGbTQ2_g6BsOUISFqBcs_rIcDvzjTg",
  authDomain: "nargas-social.firebaseapp.com",
  projectId: "nargas-social",
  storageBucket: "nargas-social.firebasestorage.app",
  messagingSenderId: "753341690678",
  appId: "1:753341690678:web:7226277e8416f056203997"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- CONTROLE DE TELAS ---
const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");
const sections = {
  feed: document.getElementById("feed-section"),
  post: document.getElementById("post-section"),
  profile: document.getElementById("profile-section")
};

// Força a exibição inicial correta das telas principais via estilo direto
authScreen.style.display = "block";
appScreen.style.display = "none";

window.showSection = function(sectionName) {
  // Esconde todas as seções internas do app
  Object.values(sections).forEach(sec => {
    if (sec) sec.style.display = "none";
  });
  // Mostra apenas a seção clicada
  if (sections[sectionName]) sections[sectionName].style.display = "block";
}

// Cliques do menu de navegação superior (🏠 ➕ 👤)
document.getElementById("nav-logo").addEventListener("click", () => showSection("feed"));
document.getElementById("nav-feed").addEventListener("click", () => showSection("feed"));
document.getElementById("nav-post").addEventListener("click", () => showSection("post"));
document.getElementById("nav-profile").addEventListener("click", () => showSection("profile"));

// Força a troca de telas ao entrar ou sair da conta (Ignora as classes do CSS)
document.getElementById("btn-login").addEventListener("click", () => {
  authScreen.style.display = "none";
  appScreen.style.display = "block";
  showSection("feed");
});

document.getElementById("btn-register").addEventListener("click", () => {
  authScreen.style.display = "none";
  appScreen.style.display = "block";
  showSection("feed");
});

document.getElementById("btn-logout").addEventListener("click", () => {
  appScreen.style.display = "none";
  authScreen.style.display = "block";
});

// --- SISTEMA DE POSTAGENS ---
const postCaption = document.getElementById("post-caption");
const btnShare = document.getElementById("btn-share");
const feedContainer = document.getElementById("feed-container");

btnShare.addEventListener("click", async () => {
  const texto = postCaption.value.trim();
  if (texto === "") return alert("Escreva uma legenda antes de compartilhar!");

  try {
    await addDoc(collection(db, "posts"), {
      legenda: texto,
      criadoEm: new Date()
    });
    postCaption.value = ""; 
    showSection("feed");   
  } catch (erro) {
    console.error("Erro ao postar:", erro);
  }
});

// Carregar posts automaticamente na tela
const q = query(collection(db, "posts"), orderBy("criadoEm", "desc"));
onSnapshot(q, (snapshot) => {
  feedContainer.innerHTML = ""; 
  snapshot.forEach((doc) => {
    const dados = doc.data();
    const postBox = document.createElement("div");
    postBox.style.border = "1px solid #dbdbdb";
    postBox.style.margin = "15px 0";
    postBox.style.padding = "15px";
    postBox.style.background = "#fff";
    postBox.style.borderRadius = "8px";
    postBox.innerHTML = `<p style="margin:0; font-size:16px; color:#000;">${dados.legenda}</p>`;
    feedContainer.appendChild(postBox);
  });
});
