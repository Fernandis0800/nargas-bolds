// 1. LINKS CORRIGIDOS DO FIREBASE (Antes estavam apontando para gstatic.com puro e quebravam)
import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://gstatic.com";

// 2. CONFIGURAÇÃO CORRIGIDA (Adicionado o authDomain correto que estava sem o início)
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

// 3. ADICIONADO WINDOW. PARA FAZER OS BOTÕES DO MENU (🏠 ➕ 👤) VOLTAREM A FUNCIONAR
window.showSection = function(sectionName) {
  Object.values(sections).forEach(sec => sec.classList.add("hidden"));
  sections[sectionName].classList.remove("hidden");
}

// Navegação interna
document.getElementById("nav-logo").addEventListener("click", () => showSection("feed"));
document.getElementById("nav-feed").addEventListener("click", () => showSection("feed"));
document.getElementById("nav-post").addEventListener("click", () => showSection("post"));
document.getElementById("nav-profile").addEventListener("click", () => showSection("profile"));

// Login Simples Provisório
document.getElementById("btn-login").addEventListener("click", () => {
  authScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  showSection("feed");
});
document.getElementById("btn-register").addEventListener("click", () => {
  authScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  showSection("feed");
});
document.getElementById("btn-logout").addEventListener("click", () => {
  appScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
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

// Atualização automática do Feed em tempo real
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
