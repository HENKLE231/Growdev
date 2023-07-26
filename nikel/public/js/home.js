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

    getCashIn();
    getCashOut();
    getTotal();
}

document.getElementById("button-logout").addEventListener("click", () => {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
});

document.getElementById("transactions-button").addEventListener("click", () => {
    window.location.href = "transactions.html";
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

    getCashIn();
    getCashOut();
    getTotal();

    alert("Lançamento adicionado com sucesso!");
});

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}

function getCashIn() {
    const transactions = data.transactions;
    const cashIn = transactions.filter((item) => item.type == "1");
    
    if (cashIn.length) {
        let cashInHtml = '';
        let limit = 0;

        if (cashIn.length > 5) {
            limit = 5;
        } else {
            limit = cashIn.length;
        }

        for (let i = 0; i < limit; i++) {
            cashInHtml += 
                '<div class="row mb-4">' +
                    '<div class="col-12">' +
                        '<h3 class="fs=2">R$' + cashIn[i].value.toFixed(2) + '</h3>' +
                        '<div class="container p-9">' +
                            '<div class="row">' +
                                '<div class="col-12 col-md-8">' +
                                    '<p>' + cashIn[i].description + '</p>' +
                                '</div>' +
                                '<div class="col-12 col-md-3 d-flex justify-content-end">' +
                                    cashIn[i].date +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            ;
        }

        document.getElementById("cash-in-list").innerHTML = cashInHtml;
    }
}

function getCashOut() {
    const transactions = data.transactions;
    const cashOut = transactions.filter((item) => item.type == "2");
    
    if (cashOut.length) {
        let cashOutHtml = '';
        let limit = 0;

        if (cashOut.length > 5) {
            limit = 5;
        } else {
            limit = cashOut.length;
        }

        for (let i = 0; i < limit; i++) {
            cashOutHtml += 
                '<div class="row mb-4">' +
                    '<div class="col-12">' +
                        '<h3 class="fs=2">R$' + cashOut[i].value.toFixed(2) + '</h3>' +
                        '<div class="container p-9">' +
                            '<div class="row">' +
                                '<div class="col-12 col-md-8">' +
                                    '<p>' + cashOut[i].description + '</p>' +
                                '</div>' +
                                '<div class="col-12 col-md-3 d-flex justify-content-end">' +
                                    cashOut[i].date +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            ;
        }

        document.getElementById("cash-out-list").innerHTML = cashOutHtml;
    }
}

function getTotal() {
    const transactions = data.transactions;
    let total = 0;
    transactions.forEach((item) => {
        if (item.type == "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });

    document.getElementById("total").innerHTML = 'R$' + total.toFixed(2);
}
