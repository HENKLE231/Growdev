const myModal = new bootstrap.Modal("#register-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

checkLogin();

// Logar
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    let checkSession = document.getElementById("login-session-check").checked;

    let account = getAccount(email);

    if (!account) {
        alert("Ops! Verifique o usuário ou a senha.");
        return;
    }
    
    if (account.password != password) {
        alert("Ops! Verifique o usuário ou a senha.");
        return;
    }

    saveSession(email, checkSession);

    window.location.href = "home.html";
});

// Criar conta
document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;

    if (email.length < 5) {
        alert("Preencha o campo com o e-mail válido.");
        return;
    }
    if (password.length < 4) {
        alert("Preencha a senha coim no mínimo 3 dígitos.");
        return;
    }

    saveAccount({
        login: email,
        password: password,
        transactions: [] 
    });
    
    myModal.hide();
    alert("Conta criada com sucesso!")
});

function checkLogin() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (logged) {
        saveSession(logged, session);
        window.location.href = "home.html";
    }
}

function saveAccount(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}

function saveSession(data, save) {
    if (save) {
        localStorage.setItem("session", data);
    }
    
    sessionStorage.setItem("logged", data)
}

function getAccount(key) {
    let account = localStorage.getItem(key);

    if (account) {
        return JSON.parse(account);
    }

    return "";
}