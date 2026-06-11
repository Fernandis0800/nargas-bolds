// 1. Importa as ferramentas do banco de dados na nuvem
import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://gstatic.com";

// 2. Suas credenciais oficiais do Firebase (do seu projeto nargas-social)
const firebaseConfig = {
  apiKey: "AIzaSyD1pHGbTQ2_g6BsOUISFqBcs_rIcDvzjTg",
  authDomain: "nargas-social.firebaseapp.com",
  projectId: "nargas-social",
  storageBucket: "nargas-social.firebasestorage.app",
  messagingSenderId: "753341690678",
  appId: "1:753341690678:web:7226277e8416f056203997"
};

// 3. Inicializa a conexão com o servidor da Google
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- SEUS ELEMENTOS DA TELA (IDs das tags do seu HTML) ---
const campoTexto = document.getElementById("texto-post"); 
const botaoPostar = document.getElementById("btn-postar"); 
const areaDePosts = document.getElementById("lista-posts"); 

// --- FUNÇÃO PARA ADICIONAR UM POST NO BANCO DE DADOS ---
botaoPostar.addEventListener("click", async () => {
  const texto = campoTexto.value.trim();
  
  if (texto === "") return alert("Digite algo antes de postar!");

  try {
    // Salva o texto direto na nuvem do Firebase
    await addDoc(collection(db, "posts"), {
      conteudo: texto,
      criadoEm: new Date() 
    });
    campoTexto.value = ""; // Limpa a caixa de texto
  } catch (erro) {
    console.error("Erro ao salvar no banco:", erro);
  }
});

// --- FUNÇÃO QUE ATUALIZA A TELA AUTOMATICAMENTE PARA VOCÊ E SEU AMIGO ---
const consulta = query(collection(db, "posts"), orderBy("criadoEm", "desc"));

onSnapshot(consulta, (snapshot) => {
  areaDePosts.innerHTML = ""; // Limpa os posts antigos da tela

  snapshot.forEach((doc) => {
    const dados = doc.data();
    
    // Cria a caixinha de cada post na tela
    const containerPost = document.createElement("div");
    containerPost.className = "post-item"; 
    containerPost.innerHTML = `<p>${dados.conteudo}</p>`;
    
    areaDePosts.appendChild(containerPost);
  });
});
