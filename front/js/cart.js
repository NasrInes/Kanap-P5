/* Récupération du panier*/
let totalBasket = JSON.parse(localStorage.getItem('basket'));

/* Initialisation de la variable qui contiendra les données récupérées depuis l'API  */
let product = [];


/* Création d'une fonction récupérant les données depuis mon API */
async function fetchApi(url) {
    await fetch(url)
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then(function(data) {
        /*console.log(data);*/
        product = data;
    })
    .catch(function(err) {
        console.log(err)
    });
};

/*Fonction permettant d'enregistrer le panier sur le local storage*/
function saveBasket(basket) {
    localStorage.setItem('basket', JSON.stringify(basket));
}

/* Code à éxécuter seulement sur la page Panier*/
if (window.location.href.indexOf("cart") > -1) {
    /*Fonction gérant la création et suppression des éléments*/
    async function maintenanceBucket() {
        let totalPrice = 0;
        /*Création des éléments essentiels pour chaque produit présent dans le panier */
        if (totalBasket !== null) {
            for (let i = 0; i < totalBasket.length; i++ ) {
                let urlProduct = 'http://localhost:3000/api/products/' + totalBasket[i].id;
                let container = document.getElementById('cart__items');
                await fetchApi(urlProduct);

                /*Création et implémentation de l'élément HTML 'article' avec ses spécificités*/
                let articleItem = document.createElement('div');
                articleItem.classList.add('cart__item');
                articleItem.setAttribute('data-id' , totalBasket[i].id);   
                articleItem.setAttribute('data-color' , totalBasket[i].color);  
                container.appendChild(articleItem);

                /*Création et implémentation de l'élément HTML 'div' contenant l'image du produit*/
                let imgDiv = document.createElement('div');
                imgDiv.classList.add('cart__item__img');
                articleItem.appendChild(imgDiv);

                /*Création et implémentation de l'élément HTML 'img' avec ses spécificités*/
                let img = document.createElement('img');
                img.src = product.imageUrl;
                img.alt = product.altTxt;
                imgDiv.appendChild(img);

                /*Création et implémentation de l'élément HTML 'div' contenant les détails du produit*/
                let contentDiv = document.createElement('div');
                contentDiv.classList.add('cart__item__content');
                articleItem.appendChild(contentDiv);

                /*Création et implémentation de l'élément HTML 'div' contenant la description du produit*/
                let descriptionDiv = document.createElement('div');
                descriptionDiv.classList.add('cart__item__content__description');
                contentDiv.appendChild(descriptionDiv);

                /*Création et implémentation de l'élément HTML 'h2' contenant le nom du produit*/
                let name = document.createElement('h2');
                name.textContent = product.name;
                descriptionDiv.appendChild(name);

                /*Création et implémentation de l'élément HTML 'p' contenant la couleur du produit*/
                let color = document.createElement('p');
                color.textContent = totalBasket[i].color;
                descriptionDiv.appendChild(color);

                /*Création et implémentation de l'élément HTML 'p' contenant le prix du produit*/
                let price = document.createElement('p');
                price.textContent = product.price + '€';
                descriptionDiv.appendChild(price);

                /*Création et implémentation de l'élément HTML 'div' contenant les paramètres du produit*/
                let settingsDiv = document.createElement('div');
                settingsDiv.classList.add('cart__item__content__settings');
                contentDiv.appendChild(settingsDiv);

                /*Création et implémentation de l'élément HTML 'div' contenant la quantité du produit*/
                let quantityDiv = document.createElement('div');
                quantityDiv.classList.add('cart__item__content__settings__quantity');
                settingsDiv.appendChild(quantityDiv);

                /*Création et implémentation de l'élément HTML 'p' représentant la quantité*/
                let quantity = document.createElement('p');
                quantity.textContent = 'Qté : ';
                quantityDiv.appendChild(quantity);

                /*Création et implémentation de l'élément HTML 'input' permettant de modifier la quantité*/
                let inputQuant = document.createElement('input');
                inputQuant.type = 'number';
                inputQuant.classList.add('itemQuantity');
                inputQuant.name = 'itemQuantity';
                inputQuant.min = 1;
                inputQuant.max = 100;
                inputQuant.setAttribute('value', totalBasket[i].quantity);
                quantityDiv.appendChild(inputQuant);

                /*Création et implémentation de l'élément HTML 'div' contenant le bouton de suppression*/
                let deleteDiv = document.createElement('div');
                deleteDiv.classList.add('cart__item__content__settings__delete');
                settingsDiv.appendChild(deleteDiv);

                /*Création et implémentation de l'élément HTML 'p' représentant le bouton de suppression du produit*/
                let deleteBtn = document.createElement('p');
                deleteBtn.classList.add('deleteItem');
                deleteBtn.textContent = 'Supprimer';
                deleteDiv.appendChild(deleteBtn);
            };
            /*fonction permettant de compter le nombre d'articles dans le panier*/
            function totalElem() {
                let totalQuantity = document.getElementById('totalQuantity')
                totalQuantity.textContent = totalBasket.length;
            };
            /*Appel de la fonction totalElem*/
            totalElem();
            /*fonction calculant la valeur totale du panier*/
            async function basketPrice() {
                /*Récupération de l'élément HTML affichant le prix total*/
                let totalPriceElem = document.getElementById('totalPrice');
                for (let i = 0; i < totalBasket.length; i++ ) {
                    /* Récupération du prix de chaque produit depuis l'API*/
                    let urlProduct = 'http://localhost:3000/api/products/' + totalBasket[i].id;
                    await fetchApi(urlProduct);
                    /*Calcul permettant de faire le total du panier*/
                    totalPrice += product.price * totalBasket[i].quantity;
                    /*Affichage du prix total*/
                    totalPriceElem.textContent = totalPrice;
                };
            };
            /*Appel de la fonction basketPrice*/
            basketPrice();
            /*Fonction permettant de supprimer un produit du panier*/
            function deleteFromBasket() {
                /*Récupération des éléments HTML 'p' permettant de supprimer les produits*/
                let deleteItem = document.querySelectorAll('.deleteItem');
                deleteItem.forEach((btn) => {
                    btn.addEventListener('click', () => {
                        /*Récupération de l'id et de la couleur du produit ciblé par la suppression*/
                        let cartItem = btn.closest('.cart__item');
                        let dataId = cartItem.dataset.id;
                        let dataColor = cartItem.dataset.color;
                        /*Suppression du code HTML associé au produit supprimé*/
                        cartItem.remove();
                        /*Mise à jour du panier et enregistrement sur le localstorage*/
                        totalBasket = totalBasket.filter(p => p.id != dataId || p.color != dataColor);
                        saveBasket(totalBasket);
                        /*Rechargement de la page*/
                        document.location.reload();
                    })
                });
            };
            /*Appel de la fonction deleteFromBasket*/
            deleteFromBasket();
            /*Fonction permettant de mettre à jour le panier si changment de quantité*/
            function changeQuantity() {
                /* Récupération des input permettant de modifier la quantité*/
                let inputQuantity = document.querySelectorAll('.itemQuantity');
                let newValue = 0;
                inputQuantity.forEach((input) => {
                    input.addEventListener('change', function() {
                        /*Récupération de l'id et de la couleur du produit ciblé par la modification*/
                        let cartItem = input.closest('.cart__item');
                        let dataId = cartItem.dataset.id;
                        let dataColor = cartItem.dataset.color;
                        /*Assignation de la nouvelle quantité voule*/
                        newValue = input.value;
                        input.setAttribute('value', newValue);
                        /*Enregistrement du nouveau panier sur le localStorage*/
                        totalBasket.forEach((elem) => {
                            if (dataId == elem.id && dataColor == elem.color) {
                                elem.quantity = newValue;
                                saveBasket(totalBasket);
                            }
                        })
                        /*Rechargement de la page*/
                        document.location.reload();
                    })
                })
            };
            /*Appel de la fonction changeQuantity*/
            changeQuantity();
            };
    };
    /*Appel de la fonction maintenanceBucket*/
    maintenanceBucket();
    
    /*Récupération et validation du formulaire*/
    /*Récupération du formulaire HTML*/
    let form = document.querySelector('.cart__order__form');
    let validity = false;

    /*Vérification du prénom entré*/
    /*Récupération de l'élément input ciblant le prénom*/
    let firstName = form.firstName;
    /*Fonction vérifiant la validité du prénom entrée*/
    function validFirstName(input) {
        let nameRegExp = /^[a-zA-Zéèçàù'\s-]+$/g;
        let testName = nameRegExp.test(input.value);
        let messageElem = document.getElementById('firstNameErrorMsg');
        /*Vérification de la conformité du prénom entré par rapport à l'expression régulière définie*/
        if (!testName) {
            messageElem.textContent = "Prénom invalide";
            validity = false;
        }
        else {
            messageElem.textContent = "";
            validity = true;
        }
    };
    /*Surveillance de l'input en cas de changement*/
    firstName.addEventListener('change', function() {
        validFirstName(firstName);
    });

    /*Vérification du nom entré*/
    /*Récupération de l'élément input ciblant le nom*/
    let lastName = form.lastName;
    /*Fonction vérifiant la validité du nom entré*/
    function validLastName(input) {
        let nameRegExp = /^[a-zA-Zéèçàù'\s-]+$/g;
        let testName = nameRegExp.test(input.value);
        let messageElem = document.getElementById('lastNameErrorMsg');
        /*Vérification de la conformité du nom entré par rapport à l'expression régulière définie*/
        if (!testName) {
            messageElem.textContent = "Nom invalide";
            validity = false;
        }
        else {
            messageElem.textContent = "";
            validity = true;
        }
    };
    /*Surveillance de l'input en cas de changement*/
    lastName.addEventListener('change', function() {
        validLastName(lastName);
    });

    /*Vérification de l'adresse entrée*/
    /*Récupération de l'élément input ciblant l'adresse*/
    let address = form.address;
    /*Fonction vérifiant la validité de l'adresse entrée*/
    function validAdress(input) {
        let adressRegExp = /^[\da-zA-Zéèçàù'\s-]+$/g;
        let testAdress = adressRegExp.test(input.value);
        let messageElem = document.getElementById('addressErrorMsg');
        /*Vérification de la conformité de l'adresse entré par rapport à l'expression régulière définie*/
        if (!testAdress) {
            messageElem.textContent = "Adresse invalide";
            validity = false;
        }
        else {
            messageElem.textContent = "";
            validity = true;
        }
    };
    /*Surveillance de l'input en cas de changement*/
    address.addEventListener('change', function() {
        validAdress(address);
    });

    /*Vérification de la ville entrée*/
    /*Récupération de l'élément input ciblant la ville*/
    let city = form.city;
    /*Fonction vérifiant la validité de la ville entrée*/
    function validCity(input) {
        let cityRegExp = /^[a-zA-Zéèçàù'\s-]+$/g;
        let testCity = cityRegExp.test(input.value);
        let messageElem = document.getElementById('cityErrorMsg');
        
        /*Vérification de la conformité de la ville entré par rapport à l'expression régulière définie*/
        if (!testCity) {
            messageElem.textContent = "Ville invalide";
            validity = false;
        }
        else {
            messageElem.textContent = "";
            validity = true;
        }
    };
    /*Surveillance de l'input en cas de changement*/
    city.addEventListener('change', function() {
        validCity(city);
    });

    /*Vérification de l'adresse email entrée*/
    /*Récupération de l'élément input ciblant l'email*/
    let email = form.email;
    /*Fonction vérifiant la validité de l'adresse email entrée*/
    function validEmail(inputEmail) {
        let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
        let testEmail = emailRegExp.test(inputEmail.value);
        let messageElem = document.getElementById('emailErrorMsg');
        /*Vérification de la conformité de l'email entrée par rapport à l'expression régulière définie*/
        if (!testEmail) {
            messageElem.textContent = "Adresse email invalide";
            validity = false;
        }
        else {
            messageElem.textContent = "";
            validity = true;
        }
    };
    /*Surveillance de l'input en cas de changement*/
    email.addEventListener('change', function() {
        validEmail(email);
    });

    /*Fonction indiquant si le panier et vide*/
    function isEmpty() {
        if (totalBasket == null) {
            let cart = document.getElementById('cart__items');
            let message = document.createElement('h2');
            message.textContent = " Vous n'avez pas d'article dans votre panier.";
            message.style.textAlign = "center";
            cart.appendChild(message);
            document.getElementById("totalQuantity").innerHTML = 0;
            document.getElementById("totalPrice").innerHTML = 0 ;
        };
    };
    /*Appel de la fonction isEmpty()*/
    isEmpty();

    /*Fonction permettant de stocker des éléments sur le locale storage*/
    function saveLocaleStorage(name, elem) {
        localStorage.setItem(name, JSON.stringify(elem));
    };

    /*Création de l'objet contact qui permettra de récolter
    les données du formulaire rempli*/ 
    let contact = {};

    /*Création d'un tableau contenant les id des produits présents dans le panier*/
    let productsArray = [];
    if (totalBasket !== null) {
        for (let i = 0; i < totalBasket.length; i++) {
            productsArray.push(totalBasket[i].id);
        };
    }
    /*Enregistrement du tableau sur le locale Storage*/
    saveLocaleStorage('productsId', productsArray);

    /*Fonction permettant de rediriger vers la page de confirmation
    en ajoutant le numéro de commande dans le lien*/
    function redirection(orderId) {
        document.location.href="./confirmation.html?"+orderId;
    };

    /*Fonction envoyant les données à l'API et récupérant le numéro de commande
    pour compléter le lien de redirection vers la page de confirmation*/
    async function postData() {
        const response = await fetch('http://localhost:3000/api/products/order', {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({contact: contact, products: productsArray})
            })
            .then(function(res) {
                if(res.ok) {
                    return res.json();
                }
            })
            .then(function(data) {
                console.log(data);
                /*Redirection vers la page de confirmation*/
                redirection(data.orderId);
            })
            .catch(function(err) {
                console.log(err)
            });
    };
    /*Ecoute du bouton "Commander"*/
    let orderBtn = document.getElementById('order');
    orderBtn.addEventListener('click', function(event) {
        event.preventDefault();
        /*Vérification de la validité du formulaire dans son entièreté 
        et de la présence d'articles dans le panier avant l'envoie*/
        if (validity === true && totalBasket.length > 0) {
            contact = {
                firstName : firstName.value,
                lastName : lastName.value,
                address : address.value,
                city : city.value,
                email : email.value, 
            };
            /*Enregistrement de l'objet contact dans le local storage*/
            saveLocaleStorage('contactObject', contact);
            postData();
        }
        /*Affichage d'une alerte si le formulaire est vide*/
        else if (validity === false) {
            alert('Le formulaire est invalie.');
        }
        /*Affichage d'une alerte si le panier est vide*/
        else {
            alert('Votre panier est vide, vous ne pouvez pas commander.');
        }
    });
}
/*Code à éxécuter sur la page de confimation seulement*/
else {
    /*Récupération de l'objet contact et du tableau des produits présents dans le panier*/
    let contactObj = JSON.parse(localStorage.getItem('contactObject'));
    let productsId = JSON.parse(localStorage.getItem('productsId'));
    /*Fonction permettant de récupérer et d'afficher le numéro de commande*/
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
                /*Affichage du numéro de commande*/
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
};
