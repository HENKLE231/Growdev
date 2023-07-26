const myModal = new bootstrap.Modal("#transaction-modal");
const deletionModal = new bootstrap.Modal("#deletion-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};

checkLogin();

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

// Logout
document.getElementById("button-logout").addEventListener("click", () => {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
});

// Adicionar lançamento
document.getElementById("transaction-form").addEventListener("submit", (e) => {
    e.preventDefault();

    let value = parseFloat(document.getElementById("transaction-value").value);
    let description = document.getElementById("transaction-description").value;
    let date = document.getElementById("transaction-date").value;
    let type = document.querySelector("input[name='transaction-type']:checked").value;

    data.transactions.unshift({
        value: value,
        type: type,
        description: description,
        date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();
    
    getTransactions();

    alert("Lançamento adicionado com sucesso!");
});

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}

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
            '<tr onclick="selectRecord(' + i + ')">' +
                '<th scope="row">' + item.date + '</th>' +
                '<td>' + item.value.toFixed(2) + '</td>' +
                '<td>' + type + '</td>' +
                '<td>' + item.description + '</td>' +
                '<td><button class="btn basic-transition" type="button" data-bs-target="#deletion-modal" data-bs-toggle="modal">' +
                    '<i class="bi bi-trash"></i>' +
                '</button><td>' +
            '</tr>'
        }

        document.getElementById("transactions-list").innerHTML = transactionsHtml;
    }
}

function selectRecord(index) {
    document.getElementById('selected-record').value = index;
}

// Excluir lançamento
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