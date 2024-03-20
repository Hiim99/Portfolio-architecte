const response = await fetch ("http://localhost:5678/api/works");
let works = await response.json();
let formData = new FormData();
const myLogin = document.querySelector("#login");
const monToken = window.localStorage.getItem('token');
const dropdownCategoryElement = document.getElementById("categories-dropdown");
const modifyElement = document.getElementById("projets");
modifyElement.innerHTML += `<a href class= "modify"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`;
var previewElement = document.getElementById("preview");
const cardElement = document.querySelector(".add-photo-card");
const modifyGallery = document.querySelector(".modify");
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
populateWorks();


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
const modal = document.querySelector(".modal")
modifyGallery.addEventListener("click" ,function(event){
    event.preventDefault();
     modal.style.display = "flex";
     modalWorks(works);
})

// ********** bouton ajouter une photo dans la première page de la modale ***********

const validatePhotoModal = document.querySelector(".modal-add-photo");
const addElement = document.querySelector(".add-photo");
addElement.addEventListener("click", function(event){
    dropdownCategoryElement.innerHTML = "";
    event.preventDefault();
    validatePhotoModal.style.display = "flex";
    fetch("http://localhost:5678/api/categories").then(
        async response => {
            const categories = await response.json();
            for (let i = 0; i < categories.length; i++){
                const optionElement = document.createElement("option");
                optionElement.dataset.id = categories[i].id;
                optionElement.textContent = categories[i].name;
                dropdownCategoryElement.appendChild(optionElement);
            }
        }
    )
})

// ********** bouton ajouter une photo dans la deuxième page de la modale ***********

var imageFileElement = document.getElementById('add');
document.querySelector(".add-photo-button").addEventListener('click', function() {
    imageFileElement.click();
    imageFileElement.addEventListener("change", function() {
        changeImage(this);
        
      });     
});



// ********* fermer la modale *************
const galleryElementModal = document.querySelector('.gallery-modal');
const closeElements = document.querySelectorAll(".fa-xmark");

closeElements.forEach(function (closeElement) {
    closeElement.addEventListener("click", function(event){
        event.preventDefault();
        modal.style.display = "none";
        validatePhotoModal.style.display = "none";
      
    })
})
// ********************Revenir en arrière dans la modale ******************************
const backElement = document.querySelector(".fa-arrow-left");
backElement.addEventListener("click", function(){
    validatePhotoModal.style.display = "none";
})

// ******************* Valider l'ajout de la photo *********************************

const validateElement = document.querySelector(".validate-photo-btn");
validateElement.addEventListener("click", async function(){
    formData = new FormData();
    const workTitle = document.getElementById("input-title").value;
    const workCategories = document.getElementById("categories-dropdown");
    const idOfSelectedDropdown = workCategories.options[workCategories.selectedIndex].getAttribute("data-id");
   

    if(workTitle && storedImage){
        formData.append("image", storedImage);
        formData.append("title" , workTitle);
        formData.append("category", idOfSelectedDropdown);
        fetch("http://localhost:5678/api/works", {
        
            "method": "POST",
            "headers": { 
                "Accept": "application/json",
                "Authorization" : `Bearer ${monToken}`
            },
            "body": formData
        }).then(function(response){
            return response.json();
        }).then(function(work){
            works.push(work);
            modal.style.display = "none";
            validatePhotoModal.style.display = "none";
            populateWorks();

            document.querySelector(".add-photo-form").reset();
            cardElement.style.display = "flex";
            previewElement.style.display = "none"; 
            storedImage = null;
        });
    }
    
  
})
window.onclick = function(event) {
    if (event.target == modal || event.target == validatePhotoModal) {
        modal.style.display = "none";
        validatePhotoModal.style.display = "none";;
    
    }
  }

/* *************************************FONCTIONS*************************************** */

// ********************************* fonction pour filtrer les travaux *************************
function listenerCategories(){
    const categoriesElements = document.querySelectorAll(".mesCategories li button")
    for (let i = 0; i < categoriesElements.length; i++) {
    
        categoriesElements[i].addEventListener("click", function (event) {
            const id = event.target.dataset.id;
            if (id == 0) {
                populateWorks()
            }else{
               
                populateWorks(id);
            }
            
        })
    }
}

function populateWorks(categoryId){
    let finalWorks = works;
    if(categoryId){
        finalWorks = works.filter(function(a){
            return a.categoryId == categoryId })
    }
    const galleryElement = document.querySelector(".gallery");
    galleryElement.innerHTML = ""
    for (let i = 0 ; i < finalWorks.length ; i ++){
      const figureElement = document.createElement("figure");
      const imgElement = document.createElement("img");
      const figCaptionElement = document.createElement("figcaption");
      
      imgElement.src = finalWorks[i].imageUrl;
      imgElement.alt = finalWorks[i].title;
      figCaptionElement.textContent = finalWorks[i].title
      
      figureElement.appendChild(imgElement);
      figureElement.appendChild(figCaptionElement);
      galleryElement.appendChild(figureElement);
      galleryElement.appendChild(figureElement)
    }
}

function checkToken(){
    if (monToken === null){
        myLogin.innerText = 'login'
    }else {
        myLogin.innerText= "logout"
        modifyGallery.style.display = "inline"
    }
}
let storedImage ;
function changeImage(input) {
    var reader;
    if (input.files && input.files[0]) {
        storedImage = input.files[0]
        reader = new FileReader();
  
        reader.onload = function(e) {
            previewElement.setAttribute('src', e.target.result);
            cardElement.style.display = "none";
            previewElement.style.display = "inline";    
        }
  
        reader.readAsDataURL(input.files[0]);
    }
  }

  function removeWorkWithId(id) {
    works =  works.filter((work) => work.id !== parseInt(id));
  }
 function modalWorks(){
    galleryElementModal.innerHTML = "";
    for (let i = 0 ; i < works.length ; i ++){
      
        const modalImgElement = document.createElement("div");
        const imgElement = document.createElement("img");
        imgElement.src = works[i].imageUrl;
        modalImgElement.appendChild(imgElement);
        galleryElementModal.appendChild( modalImgElement);
        modalImgElement.innerHTML += `<i class="fa-solid fa-trash-can" id ="${works[i].id}"></i>`;  
        modalImgElement.setAttribute("id", works[i].id);
    }

      // **************** Supprimer les travaux **************** 
    const deleteElements = document.querySelectorAll(".fa-trash-can");
    deleteElements.forEach(function(deleteElement){
        deleteElement.addEventListener("click", function(event){
            fetch(`http://localhost:5678/api/works/${event.target.id}` ,{ 
                method: 'DELETE',
                headers:{
                    'Authorization' : `Bearer ${monToken}`
                }  
            }).then((response)=>{
                if(response.status == "204"){
                    document.getElementById(event.target.id).remove();
                    removeWorkWithId(event.target.id);
                    populateWorks();
                }
            })
    })
    })
   
}
