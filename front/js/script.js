/* Initialisation de la variable qui contiendra les données récupérées depuis l'API  */
let products = [];

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
/*fonction permettant de créer les éléments afficahnts les produits sur la page d'accueil */
async function productHome() {
        await fetchApi('http://localhost:3000/api/products');
        for (product of products) {
            /* Création des éléments*/
            let link = document.createElement('a');
            let article = document.createElement('article');
            let name = document.createElement('h3');
            let description = document.createElement('p');
            let image = document.createElement('img');
            /*Ajout des éléments à leur élément parent*/
            items.appendChild(link);
            link.appendChild(article);
            article.append(image, name, description);
            
            link.href = `./product.html?id=${product._id}`;
            image.alt = product.altTxt;
            image.src = product.imageUrl;
            name.classList.add('productName');
            name.textContent = product.name;
            description.classList.add('productDescription');
            description.textContent = product.description;
        }
    ;
};
/*Appel de la fonction*/
productHome();
