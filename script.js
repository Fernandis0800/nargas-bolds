import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://gstatic.com";

// Credenciais oficiais do seu projeto nargas-social
const firebaseConfig = {
  apiKey: "AIzaSyD1pHGbTQ2_g6BsOUISFqBcs_rIcDvzjTg",
  authDomain: "://firebaseapp.com",
  projectId: "nargas-social",
  storageBucket: "nargas-social.firebasestorage.app",
  messagingSenderId: "753341690678",
  appId: "1:753341690678:web:7226277e8416f056203997"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- CONTROLE DE TELAS E NAVEGAÇÃO ---
const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");
const sections = {
  feed: document.getElementById("feed-section"),
  post: document.getElementById("post-section"),
  profile: document.getElementById("profile-section")
};

function showSection(sectionName) {
  Object.values(sections).forEach(sec => sec.classList.add("hidden"));
  sections[sectionName].classList.remove("hidden");
}

// Eventos dos botões do menu de navegação
document.getElementById("nav-logo").addEventListener("click", () => showSection("feed"));
document.getElementById("nav-feed").addEventListener("click", () => showSection("feed"));
document.getElementById("nav-post").addEventListener("click", () => showSection("post"));
document.getElementById("nav-profile").addEventListener("click", () => showSection("profile"));

// Sistema provisório de Login Simples para pular a tela inicial
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

// --- SISTEMA DE POSTAGENS (FIREBASE) ---
const postCaption = document.getElementById("post-caption");
const btnShare = document.getElementById("btn-share");
const feedContainer = document.getElementById("feed-container");

// Enviar postagem para a nuvem
btnShare.addEventListener("click", async () => {
  const texto = postCaption.value.trim();
  if (texto === "") return alert("Escreva uma legenda antes de compartilhar!");

  try {
    await addDoc(collection(db, "posts"), {
      legenda: texto,
      criadoEm: new Date()
    });
    postCaption.value = ""; // Limpa o campo
    showSection("feed");   // Volta para o feed automaticamente
  } catch (erro) {
    console.error("Erro ao postar:", erro);
  }
});

// Carregar postagens em tempo real no feed
const q = query(collection(db, "posts"), orderBy("criadoEm", "desc"));
onSnapshot(q, (snapshot) => {
  feedContainer.innerHTML = ""; // Limpa a tela antes de recarregar

  snapshot.forEach((doc) => {
    const dados = doc.data();
    
    // Monta o card do post na tela
    const postBox = document.createElement("div");
    postBox.className = "box post-card"; 
    postBox.style.border = "1px solid #dbdbdb";
    postBox.style.margin = "15px 0";
    postBox.style.padding = "15px";
    postBox.style.background = "#fff";
    postBox.innerHTML = `<p style="margin:0; font-size:16px;">${dados.legenda}</p>`;
    
    feedContainer.appendChild(postBox);
  });
});
