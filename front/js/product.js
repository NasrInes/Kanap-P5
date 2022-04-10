/* Création d'une fonction récupérant les données depuis mon API */
async function fetchApi(url) {
    await fetch(url)
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then(function(data) {
        console.log(data);
        products = data;
    })
    .catch(function(err) {
        console.log(err)
    });
};

/* Variable récupérant l'id du produit*/
const productId = new URL(window.location.href).searchParams.get('id');

/* Variable récupérant l'URL de la fiche produit*/
let urlProduct = 'http://localhost:3000/api/products/' + productId;

/*Fonction récupérant les détails de chaque produit*/
async function productDetails() {
    await fetchApi(urlProduct);
    /*Récupération de l'image du produit*/
    let img = document.createElement('img');
    img.src = products.imageUrl;
    img.alt = products.altTxt;
    document.querySelector('.item__img').appendChild(img);
    /*Récupération du titre du produit*/
    document.getElementById('title').textContent = products.name;
    /*Récupération du prix du produit*/
    document.getElementById('price').textContent = products.price;
    /*Récupération de la description du produit*/
    document.getElementById('description').textContent = products.description;
    /*Récupération des couleurs disponibles*/
    let colors = products.colors;
    let select = document.getElementById('colors');
    for (let i = 0; i < colors.length; i++) {
        let option = document.createElement('option');
        option.value = colors[i];
        option.textContent = colors[i];
        select.appendChild(option);
    }
};
/*Appel de la fonction*/
productDetails();

/*Récupération des données entrées par l'utilisateur */
let color = ''; 
let quantityProduct = '';

/* Couleur chosie*/
let colorProduct = document.getElementById('colors');
function colorValue() {
    return colorProduct.options[colorProduct.selectedIndex].text;
}

/*Enregistrement du panier*/
function saveBasket(basket) {
    localStorage.setItem('basket', JSON.stringify(basket));
}

/* Récupération du panier*/
function getBasket() {
    let basket = (localStorage.getItem('basket'));
    if (basket == null) {
        return [];
    }
    else {
        return JSON.parse(basket);
    }
}

/*Ajout du produit dans le panier*/
function addBasket() {
    document.getElementById("addToCart").addEventListener('click', function() {
        color = colorValue();
        let index = colors.selectedIndex;
        console.log(index);
        quantityProduct = document.getElementById('quantity').value;
        let product = {id : productId, color : color, quantity : parseInt(quantityProduct)};
        /* récupération du panier sur le local storage*/
        let basket = getBasket();
        /*Verifier s'il n'y a pas de doublons*/
        let foundProduct = basket.find(p => p.id == product.id & p.color == product.color);
        if (foundProduct != undefined) {
            foundProduct.quantity += product.quantity;
        }
        else if (index > 0 && quantityProduct > 0 && quantityProduct <= 100) {
            /*Ajout du nouveau produit*/
            basket.push(product);
            console.log("C'est Ok !")
            let answer = window.confirm("L'article a bien été ajouté au panier ! Souhaitez-vous être redirigé vers votre panier?");
            if (answer) {
                window.location.href="./cart.html"
            }
        }
        /*Affichage d'un message d'erreur si la couleur n'a pas été sélectionnée*/
        else if (index == 0) {
            alert("Veuillez choisir une couleur.");
        }
        /*Affichage d'un message d'erreur si la quantité entrée n'est pas valide'*/
        else if (quantityProduct <= 0 || quantityProduct > 100) {
            alert("Veuillez saisir une quantité valide : un nombre compris entre 0 et 100");
        }
        else {
            console.log("Il y a un problème.")
        }
        /*Enregistrement du panier*/
        saveBasket(basket);
        
    })
};
/*Appel de la fonction*/
addBasket();

