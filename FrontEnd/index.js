const response = await fetch ("http://localhost:5678/api/works");
const works = await response.json();
const formData = new FormData();
const myLogin = document.querySelector("#login");
const monToken = window.localStorage.getItem('token');
const dropdownCategoryElement = document.getElementById("categories-dropdown");
const modifyElement = document.getElementById("projets");
modifyElement.innerHTML += `<a href class= "modify"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`;
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

document.querySelector(".add-photo-button").addEventListener('click', function() {
    document.getElementById('add').click();
    var imageFile = document.getElementById('add');
    imageFile.addEventListener("change", function() {
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
    const workTitle = document.getElementById("input-title").value;
    const workCategories = document.getElementById("categories-dropdown");
    const idOfSelectedDropdown = workCategories.options[workCategories.selectedIndex].getAttribute("data-id");
   
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

        populateWorks(works);
    });
})
window.onclick = function(event) {
    if (event.target == modal || event.target == validatePhotoModal) {
        modal.style.display = "none";
        validatePhotoModal.style.display = "none";;
    
    }
  }

/* *************************************FONCTIONS*************************************** */

// ********************************* fonction pour filtrer les travaux *************************

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
    if (monToken === null){
        myLogin.innerText = 'login'
    }else {
        myLogin.innerText= "logout"
        modifyGallery.style.display = "inline"
    }
}

function changeImage(input) {
    var reader;
    var previewElement = document.getElementById("preview");
    const cardElement = document.querySelector(".add-photo-card");
  
    if (input.files && input.files[0]) {
      formData.append("image" , input.files[0]);
      reader = new FileReader();
  
      reader.onload = function(e) {
        previewElement.setAttribute('src', e.target.result);
        cardElement.style.display = "none";
        previewElement.style.display = "inline";    
      }
  
      reader.readAsDataURL(input.files[0]);
    }
  }

  function removeWorkWithId(works, id) {
    return works.filter((work) => work.id !== parseInt(id));
  }
 function modalWorks(works){
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
                    works = removeWorkWithId(works , event.target.id);
                    populateWorks(works);
                }
            })
    })
    })
   
}
