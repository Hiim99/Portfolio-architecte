

let myForm = document.getElementById("login-form");
myForm.addEventListener("submit", async function(event){
   event.preventDefault();
   
   let email = document.getElementById("email").value;
   let password = document.getElementById("password").value;
   const mailValide = validerEmail(email); 
   const payload = JSON.stringify({
    "email": email,
    "password": password
  })
  if (mailValide == true){
    const response = await fetch("http://localhost:5678/api/users/login", {
        "method": "POST",
        "headers": { "Content-Type": "application/json" },
        "body": payload
    });
    
    switch (response.status){
         
        case 404:  alert("Utilisateur introuvable");
                   break;
        case 401 : alert ("Email ou mot de passe incorrect");
                   break;
        case 200 : const responseObject = await response.json();
                   window.localStorage.setItem('token', responseObject.token)
                   window.location.href = "index.html"
                   break;
                 
    }
  }else {
    alert('Email invalide!');
  }

})


function validerEmail(email) {
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    if (emailRegExp.test(email)) {
        return true
    }
    return false
}


