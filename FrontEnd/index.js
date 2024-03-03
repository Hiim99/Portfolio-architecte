const response = await fetch ("http://localhost:5678/api/works");
const works = await response.json();
const myLogin = document.querySelector("#login");
myLogin.addEventListener("click" , function(event){
    if (myLogin.innerHTML == "login"){
        window.location.href = "login.html"
    }
    if (myLogin.innerHTML == "logout"){
       window.localStorage.removeItem('token')
    }
})
onstorage = (event) => {
    console.log("wiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
};

window.addEventListener("storage", (event) => {
    console.log("heeeeloooooo vietnaaaam")
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
        myLogin.innerHTML = 'login'
        console.log('LOG IN')
    }else {
        myLogin.innerHTML= "logout"
 
    }
}