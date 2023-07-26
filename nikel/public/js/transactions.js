const myModal = new bootstrap.Modal("#transaction-modal");
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

document.getElementById("button-logout").addEventListener("click", () => {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
});

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
        transactions.forEach((item) => {
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
            '</tr>'
        });

        document.getElementById("transactions-list").innerHTML = transactionsHtml;
    }
}