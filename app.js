// MEMÓRIA LOCAL (Substitui o Firebase para funcionar no Chromebook da Escola)
const getUsers = () => JSON.parse(localStorage.getItem('insta_users')) || {};
const getPosts = () => JSON.parse(localStorage.getItem('insta_posts')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('insta_current_user')) || null;

// ELEMENTOS DA TELA
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');

// MONITOR DE LOGIN (Verifica se você já estava logado)
window.onload = () => {
    if (currentUser) {
        showApp();
    }
};

// 1. SISTEMA DE CADASTRO E LOGIN (Salva na memória do navegador)
document.getElementById('btn-register').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) return alert("Preencha todos os campos!");

    let users = getUsers();
    if (users[email]) return alert("Este usuário já existe!");

    users[email] = {
        username: email.split('@')[0],
        password: password,
        avatar: "https://placeholder.com"
    };

    localStorage.setItem('insta_users', JSON.stringify(users));
    alert("Conta criada com sucesso! Agora clique em Entrar.");
});

document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let users = getUsers();
    if (users[email] && users[email].password === password) {
        currentUser = { email: email, ...users[email] };
        sessionStorage.setItem('insta_current_user', JSON.stringify(currentUser));
        showApp();
    } else {
        alert("E-mail ou senha incorretos!");
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    sessionStorage.removeItem('insta_current_user');
    location.reload();
});

function showApp() {
    authScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    loadUserProfile();
    renderFeed();
}

// 2. NAVEGAÇÃO ENTRE ABAS
function showSection(sectionName) {
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`${sectionName}-section`).classList.remove('hidden');
}

// 3. PERFIL E MODO ESCURO
function loadUserProfile() {
    document.getElementById('profile-name').innerText = currentUser.username;
    document.getElementById('profile-avatar').src = currentUser.avatar;
    document.getElementById('edit-username').value = currentUser.username;
}

document.getElementById('btn-save-profile').addEventListener('click', () => {
    const newName = document.getElementById('edit-username').value;
    let users = getUsers();
    users[currentUser.email].username = newName;
    currentUser.username = newName;
    
    localStorage.setItem('insta_users', JSON.stringify(users));
    sessionStorage.setItem('insta_current_user', JSON.stringify(currentUser));
    loadUserProfile();
    alert("Nome atualizado!");
});

// Mudar foto de perfil
document.getElementById('update-avatar-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            let users = getUsers();
            users[currentUser.email].avatar = reader.result;
            currentUser.avatar = reader.result;
            localStorage.setItem('insta_users', JSON.stringify(users));
            sessionStorage.setItem('insta_current_user', JSON.stringify(currentUser));
            loadUserProfile();
        };
        reader.readAsDataURL(file);
    }
});

// Fundo Preto (Modo Escuro)
document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});

// 4. CRIAR POSTAGEM
document.getElementById('btn-share').addEventListener('click', () => {
    const caption = document.getElementById('post-caption').value;
    const fileInput = document.getElementById('post-file');
    const file = fileInput.files[0];

    if (!file) return alert("Selecione uma foto!");

    const reader = new FileReader();
    reader.onloadend = () => {
        let posts = getPosts();
        posts.unshift({
            id: Date.now(),
            username: currentUser.username,
            avatar: currentUser.avatar,
            image: reader.result,
            caption: caption,
            likes: [],
            comments: []
        });
        localStorage.setItem('insta_posts', JSON.stringify(posts));
        fileInput.value = "";
        document.getElementById('post-caption').value = "";
        showSection('feed');
        renderFeed();
    };
    reader.readAsDataURL(file);
});

// 5. RENDERIZAR FEED, CURTIDAS E COMENTÁRIOS
function renderFeed() {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = "";
    let posts = getPosts();

    posts.forEach(post => {
        let commentsHtml = "";
        post.comments.forEach(c => {
            commentsHtml += `<p><strong>${c.username}:</strong> ${c.text}</p>`;
        });

        const postElement = document.createElement('div');
        postElement.className = 'instagram-post';
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.avatar}">
                <span>${post.username}</span>
            </div>
            <img class="post-img" src="${post.image}">
            <div class="post-actions">
                <button onclick="likePost(${post.id})">❤️ ${post.likes.length} Curtidas</button>
                <p><strong>${post.username}:</strong> ${post.caption}</p>
            </div>
            <div class="post-comments">
                <div class="comment-list">${commentsHtml}</div>
                <input type="text" id="comment-in-${post.id}" placeholder="Comentar...">
                <button onclick="addComment(${post.id})">Postar</button>
            </div>
        `;
        feedContainer.appendChild(postElement);
    });
}

// Sistema de Curtir
window.likePost = function(postId) {
    let posts = getPosts();
    let post = posts.find(p => p.id === postId);
    if (post) {
        const index = post.likes.indexOf(currentUser.username);
        if (index > -1) {
            post.likes.splice(index, 1); // Descurtir
        } else {
            post.likes.push(currentUser.username); // Curtir
        }
        localStorage.setItem('insta_posts', JSON.stringify(posts));
        renderFeed();
    }
};

// Sistema de Comentários
window.addComment = function(postId) {
    const input = document.getElementById(`comment-in-${postId}`);
    if (!input.value.trim()) return;

    let posts = getPosts();
    let post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            username: currentUser.username,
            text: input.value
        });
        localStorage.setItem('insta_posts', JSON.stringify(posts));
        input.value = "";
        renderFeed();
    }
};
