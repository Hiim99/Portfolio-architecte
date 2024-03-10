const response = await fetch ("http://localhost:5678/api/works");
const works = await response.json();
const myLogin = document.querySelector("#login");
myLogin.addEventListener("click" , function(event){
    if (myLogin.innerText == "login"){
        window.location.href = "login.html"
    }else if (myLogin.innerText == "logout") {
        window.location.href = "index.html"
        window.localStorage.removeItem('token')  
    }  
 })
window.addEventListener("storage", (event) => {
    checkToken();
});
checkToken();
populateWorks(works);


const listCategories = works.map(function(a){
    return a.category
})
const setCategories = new Set(listCategories.map(JSON.stringify));
const categoriesSansDoublons = Array.from(setCategories).map(JSON.parse);
const filtresCategories = document.querySelector(".mesCategories");
for (let i = 0; i < categoriesSansDoublons.length; i++){
    const liElement = document.createElement("li");
    const boutonElment = document.createElement("button");
    boutonElment.dataset.id = categoriesSansDoublons[i].id;
    boutonElment.textContent = categoriesSansDoublons[i].name;

    liElement.appendChild(boutonElment);
    filtresCategories.appendChild(liElement);
}
listenerCategories(works);

/****************************************************La modale*********************************************/

const modifyElement = document.getElementById("projets")
modifyElement.innerHTML += `<a href class= "modify"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`;
const modifyGallery = document.querySelector(".modify");
const modal = document.querySelector(".modal")
modifyGallery.addEventListener("click" ,function(event){
    event.preventDefault();
     modal.style.display = "flex";
     modalWorks(works);
})
// ********* le bouton fermer la modale *************
const galleryElementModal = document.querySelector('.gallery-modal');
const closeElements = document.querySelectorAll(".fa-xmark");

closeElements.forEach(function (closeElement) {
    closeElement.addEventListener("click", function(event){
        event.preventDefault();
        galleryElementModal.innerHTML = ""
        modal.style.display = "none";
        validatePhoto.style.display = "none"
      
    })
})

// ********** bouton ajouter une photo ***********
const validatePhoto = document.querySelector(".modal-add-photo");
const addElement = document.querySelector(".add-photo");
addElement.addEventListener("click", function(event){
    event.preventDefault();
    validatePhoto.style.display = "flex";

})


 function modalWorks(works){
    for (let i = 0 ; i < works.length ; i ++){
        const modalImgElement = document.createElement("div");
        const imgElement = document.createElement("img");
        imgElement.src = works[i].imageUrl;
        modalImgElement.appendChild(imgElement);
        galleryElementModal.appendChild( modalImgElement);
        modalImgElement.innerHTML += `<i class="fa-solid fa-trash-can"></i>`;
     
      }
}



/* *************************************FONCTIONS*************************************** */

function listenerCategories(works){
    const categoriesElements = document.querySelectorAll(".mesCategories li button")


    for (let i = 0; i < categoriesElements.length; i++) {
    
        categoriesElements[i].addEventListener("click", function (event) {
            const id = event.target.dataset.id;
            if (id == 0) {
                populateWorks(works)
            }else{
                const worksfiltres = works.filter(function(a){
                    return a.categoryId == id 
            })
                populateWorks(worksfiltres);
            }
            
        })
    }
}


function populateWorks(works){
    const galleryElement = document.querySelector(".gallery");
    galleryElement.innerHTML = ""
    for (let i = 0 ; i < works.length ; i ++){
      const figureElement = document.createElement("figure");
      const imgElement = document.createElement("img");
      const figCaptionElement = document.createElement("figcaption");
      
      imgElement.src = works[i].imageUrl;
      imgElement.alt = works[i].title;
      figCaptionElement.textContent = works[i].title
      
      figureElement.appendChild(imgElement);
      figureElement.appendChild(figCaptionElement);
      galleryElement.appendChild(figureElement);
      galleryElement.appendChild(figureElement)
    }
}

function checkToken(){
    const monToken = window.localStorage.getItem('token')
    if (monToken === null){
        myLogin.innerText = 'login'
    }else {
        myLogin.innerText= "logout"
 
    }
}

