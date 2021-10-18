// Variable to hold database connection
let db;

const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore ('new_transaction', {autoIncrement: true});
};

// if successful
request.onsuccess = function(event) {
    db =event.target.result;
    if (navigator.onLine){
    }
};
request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["new_transaction"], "readwrite");
// access the object store
    const budgetObjectStore = transaction.objectStore("new_transaction");

    budgetObjectStore.add(record);
}

function uploadTransaction() {
    // Open the transaction in the database
    const transaction = db.transaction(["new_transaction"], "readWrite");

    const budgetObjectStore = transaction.objectStore("new_transaction");

    const getAll = budgetObjectStore.getALl();

    getAll.onsuccess = function(){
        if (getAll.result.length >0){
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/Plain, */*",
                    "Content-Type" : "application/json"
                }
            })
            .then(response => response.json())
            .then(serverResponse =>{
                if(serverResponse.message){
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(["new_transaction"], "readWrite");

                const budgetObjectStore = transaction.objectStore("new_transaction");

                budgetObjectStore.clear();

                alert("All saved transactions have been submitted!");
            })
            .catch(err => {
                console.log(err);
            });   
        }
    }
}

window.addEventListener("online", uploadTransaction);