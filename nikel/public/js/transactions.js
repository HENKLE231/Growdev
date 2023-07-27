const myModal = new bootstrap.Modal("#transaction-modal");
const deletionModal = new bootstrap.Modal("#deletion-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {transactions: []};

checkLogin();

// Verificar login.
function checkLogin() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getTransactions();
}

// Faz Logout.
document.getElementById("button-logout").addEventListener("click", () => {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
});

// Lista lançamentos.
function getTransactions() {
    let transactions = data.transactions;
    let transactionsHtml = '';

    if (transactions.length) {
        for (let i = 0; i < transactions.length; i++) {
            let item = transactions[i];
            let type = "Entrada";

            if (item.type == "2") {
                type = "Saída";
            }

            transactionsHtml +=
            '<tr>' +
                '<th scope="row">' + item.date + '</th>' +
                '<td>' + item.value.toFixed(2) + '</td>' +
                '<td>' + type + '</td>' +
                '<td>' + item.description + '</td>' +
                '<td><button class="btn basic-transition" type="button" data-bs-target="#transaction-modal" data-bs-toggle="modal" onclick="fillOutTransactionForm(' + i + ')">' +
                    '<i class="bi bi-pencil-fill"></i>' +
                '</button></td>' +
                '<td><button class="btn basic-transition" type="button" data-bs-target="#deletion-modal" data-bs-toggle="modal" onclick="selectTransaction(' + i + ')">' +
                    '<i class="bi bi-trash"></i>' +
                '</button></td>' +
            '</tr>'
        }

        document.getElementById("transactions-list").innerHTML = transactionsHtml;
    }
}

// Salva alterações.
function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}

// Seleciona adição.
function selectAddition() {
    document.getElementById("action").value = "add";
    document.getElementById("primary-submit-button").innerText = "Adicionar";
    
}

// Seleciona edição.
function selectEdition() {
    document.getElementById("action").value = "edition";
    document.getElementById("primary-submit-button").innerText = "Editar";
}

// Recebe informações do formulário principal.
document.getElementById("transaction-form").addEventListener("submit", (e) => {
    e.preventDefault();

    let value = parseFloat(document.getElementById("transaction-value").value);
    let description = document.getElementById("transaction-description").value;
    let date = document.getElementById("transaction-date").value;
    let type = document.querySelector("input[name='transaction-type']:checked").value;

    let transaction = {
        value: value,
        type: type,
        description: description,
        date: date
    }

    if (document.getElementById("action").value == "add") {
        addTransaction(transaction, e);
    } else {
        editTransaction(transaction, e);
    }
});

// Adicionar lançamento.
function addTransaction(transaction, e) {
    data.transactions.unshift(transaction);

    saveData(data);
    e.target.reset();
    myModal.hide();
    
    getTransactions();

    alert("Lançamento adicionado com sucesso!");
}

// Editar lançamento.
function editTransaction(transaction, e) {
    let edition_target = document.getElementById("selected-record").value;

    data.transactions[edition_target] = transaction;
    saveData(data);
    e.target.reset();
    myModal.hide();
    
    getTransactions();

    alert("Lançamento editado com sucesso!");
}

// Selecionar lançamento.
function selectTransaction(index) {
    document.getElementById('selected-record').value = index;
}

// Preenche formulario com registro selecionado.
function fillOutTransactionForm(index) {
    selectTransaction(index);
    selectEdition();

    let transaction = data.transactions[index];
    
    document.getElementById("transaction-value").value = transaction.value;
    document.getElementById("transaction-description").value = transaction.description;
    document.getElementById("transaction-date").value = transaction.date;

    let type = transaction.type;
    document.getElementById("radio1").removeAttribute("checked");
    document.getElementById("radio2").removeAttribute("checked");
    document.getElementById("radio" + type).setAttribute("checked", "true");
}

// Exclui lançamento.
document.getElementById("deletion-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    let deletion_target = document.getElementById("selected-record").value;
    data.transactions.splice(deletion_target, 1);

    console.log(data);

    saveData(data);
    deletionModal.hide();
    
    getTransactions();

    alert("Lançamento excluído com sucesso!");
});