let contactObj = JSON.parse(localStorage.getItem('contactObject'));
let productsId = JSON.parse(localStorage.getItem('productsId'));


async function confirmOrder() {
    const response = await fetch('http://localhost:3000/api/products/order', {
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({contact: contactObj, products: productsId})
    })
        .then(function(res) {
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(data) {
            console.log(data);
            let validationOrder = document.getElementById('orderId');
            validationOrder.textContent = data.orderId;
            /*Vidange du panier*/
            localStorage.clear();
        })
        .catch(function(err) {
            console.log(err)
        });
};
/*Appel de la fonction*/
confirmOrder();
